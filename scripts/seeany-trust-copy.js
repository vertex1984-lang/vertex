/**
 * seeany-trust-copy.js — 重新生成首页信任区左卡配图（2026-09-22：原裁切左半张过空，用户要求重做）
 * 用法: node scripts/seeany-trust-copy.js
 * 4:3 构图饱满的织物静物（适配左卡窄列 + object-cover 裁切），输出 public/images/brand/trust-copy.png
 * （生成后转 webp 覆盖 trust-copy.webp）
 */
const fs = require('fs');
const path = require('path');
const KEY = (() => {
  const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
  return (env.match(/^SEEANY_API_KEY=(.+)$/m) || [])[1]?.trim();
})();
if (!KEY) { console.error('缺少 SEEANY_API_KEY'); process.exit(1); }

const API = 'https://api.seeany.com/api/ai/smarttask';
const OUT = path.join(__dirname, '..', 'public', 'images', 'brand');

const STYLE = '暖色调家居摄影风格，米色和暖棕色调（beige & warm brown palette），柔和自然光，高级电商品牌质感，写实摄影，无文字无水印无logo';

const JOB = {
  name: 'trust-copy',
  ratio: '4:3',
  prompt: `家居织物静物特写：原木长凳上整齐叠放着米色针织毯、亚麻抱枕与褶皱纹理的床品，织物层层叠叠充满画面下半部，背景为柔和虚化的米白色墙面与窗边自然光，浅景深，构图饱满不留大面积空白。${STYLE}`,
};

async function createTask(size) {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KEY}`,
      'User-Agent': 'seeany-api',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      aiTypeId: 113,
      aiType: 'smartImg',
      prompt: JOB.prompt,
      imgNum: 1,
      imgRatio: JOB.ratio,
      mode: 'nano-banana-pro',
      size,
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`${JSON.stringify(data)}`);
  return data.data.task_uuid;
}

// 轮询任务结果：GET /api/developer/task/status?task_uuid=xxx
async function pollTask(uuid) {
  const url = `https://api.seeany.com/api/developer/task/status?task_uuid=${encodeURIComponent(uuid)}`;
  for (let i = 0; i < 90; i++) {
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api' },
    });
    const data = await res.json();
    if (data.code !== 0) throw new Error(`查询失败: ${JSON.stringify(data)}`);
    const { status, progress, assets } = data.data;
    if (i % 6 === 0) console.log(`  [${uuid.slice(0, 8)}] ${status} ${progress ?? 0}%`);
    if (status === 'succeeded' || status === 'partial_failed') {
      const img = assets?.[0]?.images?.[0]?.url;
      if (!img) throw new Error(`无结果图: ${JSON.stringify(data.data).slice(0, 300)}`);
      return img;
    }
    if (status === 'failed') throw new Error(`任务失败: ${data.data.error_message || '未知原因'}`);
    await new Promise(r => setTimeout(r, 5000));
  }
  throw new Error('轮询超时');
}

(async () => {
  const dest = path.join(OUT, `${JOB.name}.png`);
  if (fs.existsSync(dest)) { console.log(`跳过已存在: ${dest}`); process.exit(0); }
  let uuid;
  try {
    uuid = await createTask('2K');
  } catch (e) {
    console.log(`2K 创建失败（${e.message}），回退 1K`);
    uuid = await createTask('1K');
  }
  console.log(`task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  console.log(`结果: ${imgUrl}`);
  const res = await fetch(imgUrl);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`已保存 ${dest} (${buf.length} bytes)`);
})().catch(e => { console.error('失败:', e.message); process.exit(1); });
