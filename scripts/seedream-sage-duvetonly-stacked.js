/**
 * seedream-sage-duvetonly-stacked.js — sage 条纹被套·叠放展示图（seedream 5.0 pro 试生成，2026-10-24）
 * 与 seeany-washstripe-sage-duvetonly-stacked.js 同主题，折叠逻辑按用户要求写死：
 *   上下对折→左右对折共 4 层；前缘自由边、左右折痕边；最上层远侧一角对角前翻露 B 面纯色。
 * API：火山方舟 Ark /api/v3/images/generations，model doubao-seedream-5-0-pro-260628，同步返回 url。
 * 参考图以 base64 dataUri 传入 image 字段；size 显式 1440x1920（3:4）；watermark false。
 * 输出：public/images/staging/seedream-sage-duvetonly-stacked-34.jpg
 * 用法: node scripts/seedream-sage-duvetonly-stacked.js
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || require('fs').readFileSync(__dirname + '/.ark-api-key', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'staging');
const REF_FABRIC = path.join(ROOT, 'public', 'images', 'products', 'WASHSTRIPE-SAGEGREEN-QUEEN', '1-3x4.webp');

const prompt =
  '一条 duvet cover（被套）按真实物理方式折叠：先平铺，上下对折一次，再左右对折一次，形成规整长方形，共 4 层布料，叠放在画面中央偏下位置。正前方略带俯视的拍摄角度。' +
  '折叠结构必须严格符合几何逻辑：1. 前缘为被套的自由边（开口侧），可见 4 层布边整齐平行叠放，每层厚度均匀、间距一致；' +
  '2. 左右两侧为对折形成的折痕边（封闭的圆弧折边），折痕方向与对折方式一致，侧面层数与前缘层数必须吻合，不得出现多余卷边、螺旋或不属于这条被套的独立布卷；' +
  '3. 被套外沿只有翻起露背面的那一处开口，其余边缘平整服帖，无散开的布料。' +
  '翻角方式（关键）：仅把最上层布料远离镜头那一侧的一个角，沿一条对角折线向前翻折，翻折后搭在顶面上；翻起部分与顶面布料沿折线完全连续、是一整块布，绝不是单独放上去的另一块布；' +
  '翻起部分露出的纯色背面，与顶面条纹正面是同一块布的正反两面，在折线处能看到条纹面与纯色面沿同一条折线自然过渡。翻角后顶面剩余部分仍保持平整矩形，不塌陷、不鼓起。' +
  '背面为与正面同色系的纯色鼠尾草绿（sage green）棉质面料，无任何图案。' +
  '背景为干净的浅灰色纯色摄影背景，柔和自然光，被套底部有浅浅的投影，画面大量留白。' +
  '被套正面布料严格取自参考图：鼠尾草绿（低饱和灰绿）与白色相间的细密竖条纹水洗棉面料，带轻微水洗褶皱肌理、哑光柔和质感；条纹宽度比例、配色密度与参考图 1:1 对应，严禁色偏、严禁加宽或改动条纹。' +
  '所有条纹严格平行、笔直、间距均匀，从顶面到前缘各折叠层逐条对齐连续，折叠转折处条纹沿布面自然弯曲，无错位、无断裂、无重影、无涂抹感。' +
  '参考图仅作布料来源，严禁沿用其卧室场景与任何陈设。' +
  '写实摄影质感，画面无文字、无水印、无logo、无人、无道具、无其他床上用品。';

async function dataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

(async () => {
  const dest = path.join(OUT, 'seedream-sage-duvetonly-stacked-34.jpg');
  console.log('调用 seedream 5.0 pro: Sage 条纹被套 叠放展示图（1440x1920，1 张参考图）');
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
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
  console.log(`  已保存 ${dest} (${buf.length} bytes), size=${data.data[0].size}, tokens=${data.usage?.total_tokens}`);
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
