/**
 * seeany-bedding-hero.js — 生成新 bedding 页主视觉横幅底图（无文字，文字用 HTML 叠加）
 * 主题：舒适 & 睡眠质量——一张让人想躺进去的床
 * 用法: node scripts/seeany-bedding-hero.js
 * 输出: public/images/bedding/hero-desktop.webp（横版 21:9）
 *       public/images/bedding/hero-mobile.webp（竖版 3:4）
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
const OUT = path.join(__dirname, '..', 'public', 'images', 'bedding');
fs.mkdirSync(OUT, { recursive: true });

const STYLE = '暖色调家居摄影风格，米色奶油色系（beige & cream palette），柔和晨光，高级电商品牌质感，写实摄影，画面干净有呼吸感，无文字无水印无logo，无人';

const JOBS = [
  {
    name: 'hero-desktop',
    ratio: '21:9',
    width: 1680,
    height: 720,
    prompt: `超宽幅横版卧室场景：画面右侧一张铺得蓬松柔软的大床，米白色亚麻床品层叠，被子有自然褶皱和柔软起伏，几个抱枕慵懒地靠在床头，质感细腻可见织物纹理，晨光从左侧纱帘透进来在被子上形成柔和光影；画面左侧三分之一是干净的暖米色墙面和纱帘柔光，大面积安静留白（用于叠加文字）。整体传达深度睡眠的舒适与安宁。${STYLE}`,
  },
  {
    name: 'hero-mobile',
    ratio: '3:4',
    width: 900,
    height: 1200,
    prompt: `竖版卧室场景：中景一张铺得蓬松柔软的大床，米白色亚麻床品层叠，被子有自然褶皱和柔软起伏，抱枕慵懒靠在床头，织物纹理细腻，晨光透过纱帘洒在被子上形成柔和光影；画面上半部分保留安静的暖米色墙面留白（用于叠加文字）。整体传达深度睡眠的舒适与安宁。${STYLE}`,
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
      mode: 'gpt-image-2.5-sunburst',
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
