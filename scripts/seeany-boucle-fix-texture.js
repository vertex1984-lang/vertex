/**
 * seeany-boucle-fix-texture.js — 重生成 Dusty Rose / Sage 两色泰迪绒枕套灰底图（2026-10-13 用户反馈：两色短绒效果不好）
 * 唯一参考图 = 已验收的白色主图（MK-PC-BOUCLE-WHITE-45/1.webp）：面料颗粒质感、版型、构图、
 * 背景、光线全部严格保持，只换颜色（低饱和 ins 风）。
 * 用法: node scripts/seeany-boucle-fix-texture.js [DUSTYROSE ...]（不传 = 两个都跑）
 * 输出: public/images/staging/MK-PC-BOUCLE-<COLOR>/main.webp（覆盖旧图）
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
const REF = 'https://www.makimoohome.com/images/products/MK-PC-BOUCLE-WHITE-45/1.webp';

const JOBS = [
  { color: 'DUSTYROSE', desc: '灰调烟粉色（muted dusty rose pink，低饱和度、带灰度的柔和粉）' },
  { color: 'SAGE', desc: '灰调鼠尾草绿（muted sage green，低饱和度、带灰度的柔和绿）' },
];

const buildPrompt = (j) =>
  '参考图是一只白色泰迪绒（bouclé / teddy fleece）方形抱枕套的棚拍主图。' +
  '**严格保持参考图的一切不变**：细密卷曲的泰迪绒颗粒质感与密度、抱枕版型与饱满度、正面视角居中构图、' +
  '占画面比例、浅灰色纯色无缝摄影棚背景、柔和棚拍光线、底部浅阴影。' +
  `唯一改动：把抱枕面料颜色改成${j.desc}，颜色均匀纯正、绒面纹理在彩色下依然清晰可见（不要糊成一片、不要变成平织/天鹅绒质感）。` +
  '**不要任何织标/标签/拉链头可见/logo/水印文字**；画面中只有这一只抱枕，不要叠放、不要多只、不要家具。' +
  '写实摄影，画面干净高级、ins 风。';

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
      inputImgs: [REF],
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
  console.log(`创建任务: ${key}（严格沿用白色主图绒感，仅换色）`);
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
  let failed = 0;
  for (const job of jobs) {
    try { await run(job); } catch (e) { failed++; console.error(`${job.color} 失败:`, e.message); }
  }
  if (failed) process.exit(1);
  console.log('全部完成');
})();
