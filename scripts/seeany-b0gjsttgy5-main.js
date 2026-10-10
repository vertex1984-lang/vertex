/**
 * seeany-b0gjsttgy5-main.js — B0GJSTTGY5 灰底主图重生成（2026-10-10）
 * 版型/样式参考 B0GJLRGVDJ/1.webp（同变体组棕色 L 形高靠背坐垫灰底图），
 * 颜色参考 B0GJSTTGY5/4.webp 场景图中的深森林绿（deep forest green）。
 * 标准对齐坐垫灰底图规范：浅灰纯色棚拍背景、柔和棚拍光、底部浅阴影、无文字无 logo、
 * 画面只有一只坐垫（L 形 105° 微仰，3/4 侧面 + 轻微俯视）；1:1，2K → 1200×1200。
 * 用法: node scripts/seeany-b0gjsttgy5-main.js
 * 输出: public/images/staging/B0GJSTTGY5-MAIN/main.webp（确认后替换 products/B0GJSTTGY5/1.webp）
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
const SHAPE_REF = `${SITE}/B0GJLRGVDJ/1.webp`;
const COLOR_REF = `${SITE}/B0GJSTTGY5/4.webp`;

const PROMPT =
  '第一张参考图决定椅垫的版型、工艺与构图：簇绒（tufted）纽扣凹点、靠背与坐垫一体成型呈 L 形、' +
  '靠背顶部两角各有一条绑带、靠背中下部两侧各有一条绑带，面料为哑光细密绒面（velvet-touch microfiber），' +
  '绷带的数量、位置、系法与第一张图完全一致。' +
  '第二张参考图（户外椅场景照片）**只用于取颜色**：椅垫颜色必须与第二张图中坐垫的深森林绿色' +
  '（deep forest green / emerald green，浓郁但不过饱和）完全一致，不要棕色、不要浅绿。' +
  '**不要任何织标/标签/logo/水印文字**，布面完全纯净。浅灰色纯色摄影棚背景（light gray seamless studio background），' +
  '柔和均匀的棚拍光线，底部自然柔和的浅阴影，写实摄影，画面干净高级。' +
  '构图：**只展示一只椅垫**（画面中仅此一只，不要叠放、不要多只、不要椅子），使用形态：靠背向后微仰约105度（不要垂直挺立），坐垫水平向右前方延伸、显得修长，' +
  '整体呈舒展低矮的 L 形；相机从右前方略高处拍摄（四分之三侧面视角 + 轻微俯视），能看到坐垫的前边缘厚度与右侧面；' +
  '整体居中构图，占画面约 80%，四周留白均匀，绑带自然下垂不外扬。';

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
      inputImgs: [SHAPE_REF, COLOR_REF],
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

(async () => {
  console.log('创建任务: B0GJSTTGY5 深森林绿坐垫灰底图');
  const uuid = await createTask();
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  const buf = Buffer.from(await res.arrayBuffer());
  const outDir = path.join(__dirname, '..', 'public', 'images', 'staging', 'B0GJSTTGY5-MAIN');
  fs.mkdirSync(outDir, { recursive: true });
  const dest = path.join(outDir, 'main.webp');
  await sharp(buf).resize({ width: 1200, height: 1200, fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(dest);
  console.log(`  已保存 ${dest}`);
})();
