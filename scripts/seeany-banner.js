/**
 * seeany-banner.js — 生成移动端 collection banner 竖版底图（无文字）
 * 用法: node scripts/seeany-banner.js
 * 输出: public/images/brand/collection-banner-mobile-v2.png
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
const DEST = path.join(OUT, 'collection-banner-mobile-v2.png');

const STYLE = '暖色调家居摄影风格，米色和暖棕色调（beige & warm brown palette），柔和自然光，高级电商品牌质感，写实摄影，无文字无水印无logo';
const PROMPT = `竖版构图的温馨卧室场景：木质床架上铺着米白色绗缝被和米色毯子，床头摆着蓬松的白色抱枕，床边木质床头柜上有陶瓷台灯和绿植，窗外柔和晨光洒入，画面下半部分保留相对简洁的空间适合叠加文字。${STYLE}`;

async function createTask() {
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
      prompt: PROMPT,
      imgNum: 1,
      imgRatio: '3:4',
      mode: 'nano-banana-pro',
      size: '1K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`创建失败: ${JSON.stringify(data)}`);
  return data.data.task_uuid;
}

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
  if (fs.existsSync(DEST)) { console.log('已存在，跳过:', DEST); return; }
  console.log('创建任务 (3:4 竖版)...');
  const uuid = await createTask();
  console.log(`task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  console.log('结果:', imgUrl);
  const res = await fetch(imgUrl);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(DEST, buf);
  console.log(`已保存 ${DEST} (${buf.length} bytes)`);
})().catch(e => { console.error('失败:', e.message); process.exit(1); });
