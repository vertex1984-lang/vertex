/**
 * seedream-percale-mist-twin-duvetonly-stacked.js — Mist Grey Twin 纯色被套·叠放展示图（seedream 5.0 pro，2026-10-24）
 * 折叠逻辑与占图比例遵循 docs/folded-gray-bg-image-rules.md；参考图仅提供布料。
 * API：火山方舟 Ark /api/v3/images/generations，model doubao-seedream-5-0-pro-260628，同步返回 url。
 * 参考图以 base64 dataUri 传入 image 字段；size 显式 1440x1920（3:4）；watermark false。
 * 输出：public/images/staging/seedream-percale-mist-twin-duvetonly-stacked-34.jpg
 * 用法: node scripts/seedream-percale-mist-twin-duvetonly-stacked.js
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || require('fs').readFileSync(__dirname + '/.ark-api-key', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'staging');
const REF_FABRIC = path.join(ROOT, 'public', 'images', 'products', 'PERCALE-MIST-TWIN', '1-3x4.webp');
const SEED = 24311;

const prompt =
  '一条 duvet cover（被套）按真实物理方式折叠：先平铺，上下对折一次，再左右对折一次，形成规整长方形，共 4 层布料。正前方略带俯视的拍摄角度。' +
  '构图与占图比例（必须严格遵守）：产品水平居中，产品总高度（含顶部翻角）约占画面高度的 43%（允许 40%-45%），产品宽度约占画面宽度的 82%；产品底边位于画面高度约 80% 处，上方留白约 37%，下方留白约 17%；不要顶天立地，不要把产品撑满画面。' +
  '折叠结构必须严格符合几何逻辑：1. 前缘为被套的自由边（开口侧），可见 4 层布边整齐平行叠放，每层厚度均匀、间距一致；' +
  '2. 左右两侧为对折形成的折痕边（封闭的圆弧折边），折痕方向与对折方式一致，侧面层数与前缘层数必须吻合，不得出现多余卷边、螺旋或不属于这条被套的独立布卷；' +
  '3. 被套外沿只有翻起露背面的那一处开口，其余边缘平整服帖，无散开的布料。' +
  '翻角方式（关键）：仅把最上层布料远离镜头那一侧的一个角，沿一条对角折线向前翻折，翻折后搭在顶面上；翻起部分与顶面布料沿折线完全连续、是一整块布，绝不是单独放上去的另一块布；' +
  '翻起部分露出的纯色背面，与顶面纯色正面是同一块布的正反两面，在折线处能看到两面沿同一条折线自然过渡。翻角后顶面剩余部分仍保持平整矩形，不塌陷、不鼓起。' +
  '背面为与正面同色同质的纯色雾灰色（mist grey）棉质 percale 面料，无任何图案。' +
  '背景为干净的浅灰色纯色摄影背景，柔和自然光，被套底部有浅浅的投影。' +
  '被套正面布料严格取自参考图：雾灰色（mist grey，低饱和浅灰、略带冷调）纯色棉质 percale 面料，带细密平纹织理、哑光清爽质感；无条纹、无印花、无提花，颜色与参考图 1:1 对应，严禁色偏、严禁添加任何图案。' +
  '纯色布面在顶面与各折叠层之间保持颜色、织纹和图案自然连续，折叠转折处沿布面自然弯曲，无错位、无断裂、无重影、无涂抹感。' +
  '参考图仅作布料来源，严禁沿用其卧室场景与任何陈设。' +
  '写实摄影质感，画面无文字、无水印、无logo、无人、无道具、无其他床上用品。';

async function dataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

(async () => {
  const dest = path.join(OUT, 'seedream-percale-mist-twin-duvetonly-stacked-34.jpg');
  console.log('调用 seedream 5.0 pro: Mist Grey Twin 纯色被套 叠放展示图（1440x1920，1 张参考图）');
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      seed: SEED,
      prompt,
      image: [await dataUri(REF_FABRIC)],
      response_format: 'url',
      size: '1440x1920',
      stream: false,
      watermark: false,
    }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(JSON.stringify(data).slice(0, 500));
  const imgUrl = data.data?.[0]?.url;
  if (!imgUrl) throw new Error('无结果图: ' + JSON.stringify(data).slice(0, 500));
  const imgRes = await fetch(imgUrl);
  if (!imgRes.ok) throw new Error(`结果图下载失败: HTTP ${imgRes.status}`);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  已保存 ${dest} (${buf.length} bytes), size=${data.data[0].size}, seed=${SEED}, tokens=${data.usage?.total_tokens}`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
