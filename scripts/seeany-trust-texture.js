/**
 * seeany-trust-texture.js — 生成首页信任区左卡（文案卡）配图（2026-09-22 用户定：材质细节特写，
 * 替换原卧室图 trust-reviews.webp）
 * 用法: node scripts/seeany-trust-texture.js
 * 16:9 横板（与左卡桌面 aspect-[16/9] 一致；移动端 4/5 由 object-cover 裁切）：
 * 毯子局部细节 + 部分枕头特写，凸显材质感与舒适放松感，色调参照用户提供的
 * 暖米色织物参考图（柔和阳光 + 叶影）。输出 public/images/brand/trust-texture.png/.webp
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
  name: 'trust-texture',
  ratio: '16:9',
  prompt: `织物材质特写镜头，横板宽幅构图：一条米色针织毯的局部细节占据画面主体，绒感与织纹清晰可见，毯子边缘有细腻流苏；画面一角露出亚麻枕头的柔软局部；午后柔和阳光斜照，墙面上有绿植叶片投下的斑驳影子，光线温暖慵懒，氛围舒适放松。浅景深，焦点在毯子织纹上；画面左侧留出相对平缓的区域（便于叠加文字）。${STYLE}`,
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
  // 同步转 webp（与站内其他生成图一致，q82）
  const sharp = require('sharp');
  const webp = path.join(OUT, `${JOB.name}.webp`);
  await sharp(buf).webp({ quality: 82 }).toFile(webp);
  console.log(`已转换 ${webp}`);
})().catch(e => { console.error('失败:', e.message); process.exit(1); });
