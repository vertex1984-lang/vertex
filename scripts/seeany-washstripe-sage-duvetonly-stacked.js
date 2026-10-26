/**
 * seeany-washstripe-sage-duvetonly-stacked.js — sage 条纹被套·叠放展示图（2026-10-23 用户定，同 stone 标准）
 * 构图：浅灰纯色背景、中央偏下叠放一条折成规整长方形的被套，
 *   前缘可见 2-3 层折叠厚度与边缘缝线、顶部约 1/4 处一片面料向上翻起露出被套背面（B面）纯色布料、
 *   哑光写实、柔光、底部浅投影、无文字道具。
 * 布料锚：WASHSTRIPE-SAGEGREEN-QUEEN/1-3x4.webp —— 鼠尾草绿+白色细条纹水洗棉 1:1 取色取纹；
 *   背面为同色系纯色鼠尾草绿棉质。
 * 输出：public/images/staging/washstripe-sage-duvetonly-stacked-34.png
 * 用法: node scripts/seeany-washstripe-sage-duvetonly-stacked.js
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
const REF_FABRIC = path.join(ROOT, 'public', 'images', 'products', 'WASHSTRIPE-SAGEGREEN-QUEEN', '1-3x4.webp'); // 布料配色/纹理来源

const prompt =
  '一条 duvet cover（被套）平铺后折叠成规整的长方形，叠放在画面中央偏下位置，' +
  '正前方略带俯视的拍摄角度，能看清被套前缘 2-3 层的折叠厚度、边缘缝线与面料垂坠感；' +
  '关键构图：被套顶部约四分之一处有一片面料向上向后翻起，清晰露出被套的背面（B面）——' +
  '背面是与正面同色系的纯色鼠尾草绿（sage green）棉质面料，无任何图案，与正面条纹形成明确对照。' +
  '背景为干净的浅灰色纯色摄影背景，柔和自然光，被套底部有浅浅的投影，画面大量留白。' +
  '被套正面布料严格取自参考图：鼠尾草绿（sage green，低饱和灰绿）与白色相间的细密竖条纹水洗棉面料，' +
  '带水洗棉特有的轻微褶皱肌理、哑光柔和质感；条纹宽度比例、配色密度与排列与参考图 1:1 对应，严禁色偏、严禁加宽或改动条纹。' +
  '最重要的要求——条纹连贯性：所有条纹严格平行、笔直、间距绝对均匀，如同真实印染布料；' +
  '条纹从被套顶面到前缘各折叠层必须一一对应、逐条对齐连续，层与层之间条纹的相位、间距完全一致，' +
  '绝不允许出现条纹错位、断裂、间距突变、波浪起伏或某一层条纹与另一层对不上的情况；' +
  '折叠转折处条纹沿布面自然弯曲转折，走向符合布料物理形态，无扭曲、无重影、无涂抹感。' +
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
  const dest = path.join(OUT, 'washstripe-sage-duvetonly-stacked-34.png');
  console.log('创建任务: Sage 条纹被套 叠放展示图（顶部翻起露背面，灰底 3:4）');
  const uuid = await createTask([await dataUri(REF_FABRIC)]);
  console.log(`  task_uuid=${uuid}, 等待生成...`);
  const imgUrl = await pollTask(uuid);
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`结果图下载失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  已保存 ${dest} (${buf.length} bytes)`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
