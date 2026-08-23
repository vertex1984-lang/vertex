/**
 * seeany-brand-banner.js — 生成主页品牌影响力横幅底图（无文字，文字用 HTML 叠加）
 * 用法: node scripts/seeany-brand-banner.js
 * 输出: public/images/brand/brand-banner.webp（桌面横版 1456x574）
 *       public/images/brand/brand-banner-mobile.webp（移动竖版 3:4）
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const KEY = (() => {
  const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
  return (env.match(/^SEEANY_API_KEY=(.+)$/m) || [])[1]?.trim();
})();
if (!KEY) { console.error('缺少 SEEANY_API_KEY'); process.exit(1); }

const API = 'https://api.seeany.com/api/ai/smarttask';
const OUT = path.join(__dirname, '..', 'public', 'images', 'brand');
fs.mkdirSync(OUT, { recursive: true });

const STYLE = '暖色调家居摄影风格，米色和暖棕色调（beige & warm brown palette），柔和自然光，高级电商品牌质感，写实摄影，画面干净有呼吸感，无文字无水印无logo';

const JOBS = [
  {
    name: 'brand-banner',
    ratio: '21:9',
    width: 1456,
    height: 574,
    prompt: `极简主义超宽幅横版构图：画面左侧三分之二是一面干净的暖灰米色纯色墙面，大面积留白，柔和晨光在墙面上形成淡淡的渐变；画面最右侧边缘只露出米色布艺沙发的一角和一个抱枕，小面积点缀，浅景深。整体安静、高级、极简。${STYLE}`,
  },
  {
    name: 'brand-banner-mobile',
    ratio: '3:4',
    width: 900,
    height: 1200,
    prompt: `极简主义竖版构图：画面上半部分是米色沙发一角和一个抱枕，浅景深柔和虚化；下半部分三分之二是大面积干净的暖灰米色纯色地面和墙面留白，光线柔和渐变。整体安静、高级、极简。${STYLE}`,
  },
];

async function createTask(job) {
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
      prompt: job.prompt,
      imgNum: 1,
      imgRatio: job.ratio,
      mode: 'nano-banana-pro',
      size: '2K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`${job.name}: ${JSON.stringify(data)}`);
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
  for (const job of JOBS) {
    const dest = path.join(OUT, `${job.name}.webp`);
    console.log(`创建任务: ${job.name} (${job.ratio})`);
    const uuid = await createTask(job);
    console.log(`  task_uuid=${uuid}, 等待生成...`);
    const imgUrl = await pollTask(uuid);
    const res = await fetch(imgUrl);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf)
      .resize(job.width, job.height, { fit: 'cover', position: 'attention' })
      .webp({ quality: 82 })
      .toFile(dest);
    console.log(`  已保存 ${dest}`);
  }
  console.log('全部完成');
})().catch(e => { console.error('失败:', e.message); process.exit(1); });
