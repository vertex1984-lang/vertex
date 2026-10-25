/**
 * seeany-percalepatch-stone-duvetonly-stacked.js — stone 拼接被套·叠放展示图（2026-10-23 用户定）
 * 构图（按用户参考图文字描述复刻）：浅灰纯色背景、中央偏下叠放一条折成规整长方形的被套，
 *   前缘可见 2-3 层折叠厚度与边缘缝线、顶部约 1/4 处一片面料向上翻起露出被套背面（B面）纯色布料、
 *   哑光写实、柔光、底部浅投影、无文字道具。
 * 布料锚：PERCALEPATCH-STONE-QUEEN/1-3x4.webp —— 灰白拼接提花（小块几何提花分区拼接）1:1 取色取纹；
 *   背面为同色系纯色浅灰棉质。
 * 输出：public/images/staging/percalepatch-stone-duvetonly-stacked-34.png
 * 用法: node scripts/seeany-percalepatch-stone-duvetonly-stacked.js
 */
const fs = require('fs');
const path = require('path');
const KEY = (() => {
  for (const p of [
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '..', '.env.local'),
    'E:\\Makimoo Website\\headless-store\\.env.local',
    'E:\\Makimoo Website\\headless-store\\.env',
  ]) {
    try {
      const env = fs.readFileSync(p, 'utf-8');
      const m = env.match(/^SEEANY_API_KEY=(.+)$/m);
      if (m) return m[1].trim();
    } catch {}
  }
})();
if (!KEY) { console.error('缺少 SEEANY_API_KEY'); process.exit(1); }

const API = 'https://api.seeany.com/api/ai/smarttask';
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'staging');
const REF_FABRIC = path.join(ROOT, 'public', 'images', 'products', 'PERCALEPATCH-STONE-QUEEN', '1-3x4.webp'); // 布料配色/纹理来源

const prompt =
  '一条 duvet cover（被套）平铺后折叠成规整的长方形，叠放在画面中央偏下位置，' +
  '正前方略带俯视的拍摄角度，能看清被套前缘 2-3 层的折叠厚度、边缘缝线与面料垂坠感；' +
  '关键构图：被套顶部约四分之一处有一片面料向上向后翻起，清晰露出被套的背面（B面）——' +
  '背面是与正面同色系的纯色浅灰色棉质面料，无任何图案，与正面拼接图案形成明确对照。' +
  '背景为干净的浅灰色纯色摄影背景，柔和自然光，被套底部有浅浅的投影，画面大量留白。' +
  '被套正面布料严格取自参考图：灰白色调的 patchwork 拼接提花棉质面料，' +
  '由若干矩形分区拼接而成，每个分区是不同的细密几何提花图案（小棋盘格、细点阵、细条纹等灰白组合），' +
  '带轻微华夫肌理、哑光细腻质感；拼接分区的比例、图案密度、灰白配色与参考图 1:1 对应，严禁色偏、严禁改动图案。' +
  '折叠状态下拼接图案必须自然连续，折叠转折处图案走向真实，无扭曲、无断裂、无重影。' +
  '参考图仅作布料来源，严禁沿用其卧室场景与任何陈设。' +
  '写实摄影质感，画面无文字、无水印、无logo、无人、无道具、无其他床上用品。';

async function dataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function createTask(inputImgs) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aiTypeId: 113, aiType: 'smartImg', prompt,
      inputImgs, imgNum: 1, imgRatio: '3:4',
      mode: 'gpt-image-2.5-sunburst', size: '2K',
    }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(JSON.stringify(data));
  return data.data.task_uuid;
}

async function pollTask(uuid) {
  const url = `https://api.seeany.com/api/developer/task/status?task_uuid=${encodeURIComponent(uuid)}`;
  for (let i = 0; i < 90; i++) {
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${KEY}`, 'User-Agent': 'seeany-api' } });
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
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error('轮询超时');
}

(async () => {
  const dest = path.join(OUT, 'percalepatch-stone-duvetonly-stacked-34.png');
  console.log('创建任务: Stone 拼接被套 叠放展示图（顶部翻起露背面，灰底 3:4）');
  const uuid = await createTask([await dataUri(REF_FABRIC)]);
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  已保存 ${dest} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
