/**
 * seeany-corduroy-cushion-colors.js — 灯芯绒坐垫 4 新色灰底棚拍图（2026-10-09）
 * 版型/工艺参考 B0CBT7R7NN 主图（L 形灯芯绒簇绒摇椅垫），颜色参考 MK-PC-CORD 枕套四色
 * （caramel / dustyrose / olive / dustyblue，双参考图：第 1 张版型、第 2 张颜色）。
 * 标准对齐坐垫灰底图规范：浅灰纯色棚拍背景、柔和棚拍光、底部浅阴影、无文字无 logo、
 * 画面只有一只坐垫（L 形 105° 微仰，3/4 侧面 + 轻微俯视）；1:1，2K → 1200×1200。
 * 用法: node scripts/seeany-corduroy-cushion-colors.js [CARAMEL ...]（不传色 = 全部）
 * 输出: public/images/staging/MK-CUSHION-CORD-<COLOR>/main.webp
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
const SITE = 'https://www.makimoohome.com/images/products';
const SHAPE_REF = `${SITE}/B0CBT7R7NN/1.webp`;

const COMMON =
  '**不要任何织标/标签/logo/水印文字**，布面完全纯净。浅灰色纯色摄影棚背景（light gray seamless studio background），' +
  '柔和均匀的棚拍光线，底部自然柔和的浅阴影，写实摄影，画面干净高级。' +
  '构图：**只展示一只椅垫**（画面中仅此一只，不要叠放、不要多只、不要椅子），使用形态：**靠背向后微仰约105度（不要垂直挺立），坐垫水平向右前方延伸、显得修长**，' +
  '整体呈舒展低矮的 L 形；相机从右前方略高处拍摄（四分之三侧面视角 + 轻微俯视），能看到坐垫的前边缘厚度与右侧面；' +
  '整体居中构图，占画面约 80%，四周留白均匀，绑带自然下垂不外扬。';

const JOBS = [
  { color: 'CARAMEL', desc: '焦糖橘棕色（warm caramel orange-brown）', refType: 'corduroy' },
  { color: 'DUSTYROSE', desc: '灰调 dusty rose 粉色（muted dusty rose pink）', refType: 'corduroy' },
  { color: 'OLIVE', desc: '橄榄绿色（muted olive green）', refType: 'corduroy' },
  { color: 'DUSTYBLUE', desc: '灰调雾霾蓝色（muted dusty blue）', refType: 'corduroy' },
  // 2026-10-09 用户定：焦糖色与既有棕色坐垫太接近，改用 CTN-CREAM 奶白色（颜色参考为棉质枕套，仅取色不取面料）
  { color: 'CREAM', refSku: 'MK-PC-CTN-CREAM', desc: '奶白米白色（warm cream / off-white）', refType: 'cotton' },
].map((j) => ({
  key: `MK-CUSHION-CORD-${j.color}`,
  refs: [SHAPE_REF, `${SITE}/${j.refSku || `MK-PC-CORD-${j.color}`}/1.webp`],
  prompt:
    `第一张参考图决定椅垫的版型与工艺：细条纹灯芯绒（corduroy）面料、簇绒（tufted）纽扣凹点、靠背与坐垫一体成型呈 L 形、靠背顶部两角和坐垫两侧各有一条绑带。` +
    (j.refType === 'cotton'
      ? `第二张参考图（一只棉质枕套）**只用于取颜色**：椅垫做成灯芯绒面料，颜色必须与第二张图的${j.desc}完全一致（低饱和度、ins 风柔和色调），面料质感以第一张参考图的灯芯绒为准。`
      : `第二张参考图（一只灯芯绒枕套）只用于取颜色与面料质感：椅垫面料颜色必须与第二张图的${j.desc}灯芯绒完全一致（低饱和度、ins 风柔和色调），条纹粗细与绒面质感一致。`) +
    COMMON,
}));

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
      inputImgs: job.refs,
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
    const { status, progress } = data.data;
    if (i % 6 === 0) console.log(`  [${uuid.slice(0, 8)}] ${status} ${progress ?? 0}%`);
    if (status === 'succeeded' || status === 'partial_failed') {
      const img = data.data.assets?.[0]?.images?.[0]?.url;
      if (!img) throw new Error(`无结果图: ${JSON.stringify(data.data).slice(0, 300)}`);
      return img;
    }
    if (status === 'failed') throw new Error(`任务失败: ${data.data.error_message || '未知原因'}`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error('轮询超时');
}

async function run(job) {
  console.log(`创建任务: ${job.key} 灯芯绒坐垫棚拍图`);
  const uuid = await createTask(job);
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  const buf = Buffer.from(await res.arrayBuffer());
  const outDir = path.join(__dirname, '..', 'public', 'images', 'staging', job.key);
  fs.mkdirSync(outDir, { recursive: true });
  const dest = path.join(outDir, 'main.webp');
  await sharp(buf).resize({ width: 1200, height: 1200, fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(dest);
  console.log(`  已保存 ${dest}`);
}

(async () => {
  const filter = process.argv.slice(2).map((s) => s.toUpperCase());
  const jobs = filter.length ? JOBS.filter((j) => filter.some((f) => j.key.includes(f))) : JOBS;
  if (jobs.length === 0) { console.error('无匹配的颜色'); process.exit(1); }
  let failed = 0;
  for (const job of jobs) {
    try { await run(job); } catch (e) { failed++; console.error(`${job.key} 失败:`, e.message); }
  }
  if (failed) process.exit(1);
  console.log('全部完成');
})();
