/**
 * seeany-cushion-4pack-main.js — 户外餐椅垫 4 件套 B0CXDZF2WQ 棚拍主图（2026-10-09，先生成一张验收）
 * 标准对齐抱枕芯/摇椅垫主图：浅灰纯色棚拍背景、柔和棚拍光、底部浅阴影、无文字无 logo；1:1，2K → 1200×1200。
 * 参考图：线上 1.webp（木椅上的实物场景图，形状/印花最准确），mode gpt-image-2.5（图生图）
 * 用法: node scripts/seeany-cushion-4pack-main.js
 * 输出: public/images/staging/B0CXDZF2WQ/main.webp
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
const OUT = path.join(__dirname, '..', 'public', 'images', 'staging', 'B0CXDZF2WQ');
fs.mkdirSync(OUT, { recursive: true });

const REF = 'https://www.makimoohome.com/images/products/B0CXDZF2WQ/3.webp';
const PROMPT =
  '以参考图中的橙黄色花鸟印花户外椅垫为准：暖橙黄底色、花卉枝叶与小鸟印花、靠背与坐垫一体成型呈 L 形、' +
  '边缘有滚边（piped edge）、靠背顶部两角和坐垫两侧各有一条绑带，保持完全一致的面料质感、印花图案、配色与工艺。' +
  '**不要任何织标/标签/logo/水印文字**，布面完全纯净。浅灰色纯色摄影棚背景（light gray seamless studio background），' +
  '柔和均匀的棚拍光线，底部自然柔和的浅阴影，写实摄影，画面干净高级。' +
  '构图：**只展示一只椅垫**（画面中仅此一只，不要叠放、不要多只）——以使用形态立于画面中央' +
  '（靠背自然竖直、坐垫水平前伸，呈自然挺括的 L 形，四分之三侧面视角，与参考图姿态一致），' +
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

(async () => {
  console.log('创建任务: B0CXDZF2WQ 棚拍主图（Set of 4）');
  const uuid = await createTask();
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  const buf = Buffer.from(await res.arrayBuffer());
  const dest = path.join(OUT, 'main.webp');
  await sharp(buf).resize({ width: 1200, height: 1200, fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(dest);
  console.log(`  已保存 ${dest}`);
})().catch(e => { console.error('失败:', e.message); process.exit(1); });
