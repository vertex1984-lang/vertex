/**
 * seeany-boucle-pillow-colors.js — 白色泰迪绒抱枕 3 新色灰底棚拍图（2026-10-13，用户定：ins 风低饱和）
 * 版型/面料参考用户实物照片（front/side），构图风格参考 MK-PC-CTN-CREAM 枕套主图，
 * 颜色由 prompt 指定（低饱和 ins 风）。标准对齐枕套灰底图规范：浅灰纯色棚拍背景、
 * 正面视角、居中、底部浅阴影、无文字无 logo 无织标；1:1，2K → 1200×1200。
 * 用法: node scripts/seeany-boucle-pillow-colors.js [OATMEAL ...]（不传色 = 全部）
 * 输出: public/images/staging/MK-PC-BOUCLE-<COLOR>/main.webp
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
const REFS = [
  'https://www.makimoohome.com/images/staging/refs/boucle-pillow/front.jpg',
  'https://www.makimoohome.com/images/staging/refs/boucle-pillow/side.jpg',
  'https://www.makimoohome.com/images/products/MK-PC-CTN-CREAM/1.webp',
];

const JOBS = [
  { color: 'OATMEAL', desc: '燕麦米棕色（warm oatmeal beige，低饱和度暖调浅驼色）' },
  { color: 'DUSTYROSE', desc: '灰调烟粉色（muted dusty rose pink，低饱和度、带灰度的柔和粉）' },
  { color: 'SAGE', desc: '灰调鼠尾草绿（muted sage green，低饱和度、带灰度的柔和绿）' },
];

const buildPrompt = (j) =>
  '前两张参考图是同一只抱枕的实物照片：泰迪绒/羊羔绒（bouclé / teddy fleece）方形抱枕，' +
  '绒面呈细密颗粒卷曲质感，填充饱满、四角自然微翘，侧面有隐藏拉链。' +
  `抱枕的面料质感、颗粒密度、版型必须与实物图完全一致，但颜色改为${j.desc}（ins 风柔和色调）。` +
  '第三张参考图（网站现有枕套主图）只决定构图与影棚风格：浅灰色纯色无缝摄影棚背景（light gray seamless studio background），' +
  '正面视角、抱枕竖直立于画面中央，整体居中构图、占画面约 80%、四周留白均匀，底部自然柔和的浅阴影。' +
  '**不要任何织标/标签/拉链头可见/logo/水印文字**，绒面完全纯净；画面中只有这一只抱枕，不要叠放、不要多只、不要家具。' +
  '柔和均匀的棚拍光线，绒面颜色均匀纯正，写实摄影，画面干净高级、ins 风。';

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
      prompt: buildPrompt(job),
      inputImgs: REFS,
      imgNum: 1,
      imgRatio: '1:1',
      mode: 'gpt-image-2.5',
      size: '2K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(JSON.stringify(data));
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

async function run(job) {
  const key = `MK-PC-BOUCLE-${job.color}`;
  console.log(`创建任务: ${key}（${job.desc}）`);
  const uuid = await createTask(job);
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  const buf = Buffer.from(await res.arrayBuffer());
  const outDir = path.join(__dirname, '..', 'public', 'images', 'staging', key);
  fs.mkdirSync(outDir, { recursive: true });
  const dest = path.join(outDir, 'main.webp');
  await sharp(buf).resize({ width: 1200, height: 1200, fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(dest);
  console.log(`  已保存 ${dest}`);
}

(async () => {
  const filter = process.argv.slice(2).map((s) => s.toUpperCase());
  const jobs = filter.length ? JOBS.filter((j) => filter.includes(j.color)) : JOBS;
  if (jobs.length === 0) { console.error('无匹配的颜色'); process.exit(1); }
  let failed = 0;
  for (const job of jobs) {
    try { await run(job); } catch (e) { failed++; console.error(`${job.color} 失败:`, e.message); }
  }
  if (failed) process.exit(1);
  console.log('全部完成');
})();
