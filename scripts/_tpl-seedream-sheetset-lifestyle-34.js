/**
 * seedream-percalestripe-petal-sheet-lifestyle-34.js — Blush Pink 细条纹·床单床笠枕头种草图（seedream 5.0 pro，2026-10-27）
 * 构图样式锚定 Parachute 参考图（scripts/_parachute-ref.jpg）：床头近距离特写、双枕 + 平床单自然垂坠 +
 * 床笠露出、床体几乎占满画面、窗帘背景、无床头板、零摆件。
 * 产品布料锚定 PERCALESTRIPE-PETAL-QUEEN（腮红粉细条纹提花 percale），
 * 参考图1=产品主图（床上整体效果），参考图2=alicdn 布料细节（纹理唯一标准），参考图3=Parachute 构图样式。
 * 用户定：暖色光源和色调；展示枕头、床笠、床单；占图比高。
 * v2（用户定）：① 床笠+平床单+枕套全部同一腮红粉细条纹布料，床面零纯色区域；
 * ② 光线改为白天明亮自然日光（非傍晚金色时刻），但保持暖色调温润奶油感。
 * 输出：public/images/staging/seedream-percalestripe-petal-sheet-lifestyle-34-v4.jpg
 * 用法: node scripts/seedream-percalestripe-petal-sheet-lifestyle-34.js
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || require('fs').readFileSync(__dirname + '/.ark-api-key', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'staging');
const REF_MAIN = path.join(ROOT, 'public', 'images', 'products', 'PERCALESTRIPE-PETAL-QUEEN', '1-3x4.webp');
const REF_FABRIC = path.join(ROOT, 'public', 'images', 'staging', 'ref-petal-alicdn.jpg');
const REF_STYLE = path.join(ROOT, 'scripts', '_parachute-ref.jpg');
const SEED = 61783;

const prompt =
  // 1. 产品锚定段
  '主角布料是腮红粉（blush pink）细条纹提花棉质 percale：布料材质肌理、颜色、提花织纹、条纹密度与走向的所有细节，严格 1:1 复刻参考图1与参考图2（参考图2是布料细节的唯一标准），不做任何改动、不添加任何参考图之外的图案或质感，布面零织标零印花。' +
  // 2. 场景构建段（构图样式锚定参考图3）
  '构图严格参照参考图3的镜头样式：竖幅 3:4，镜头近距离平视床头一角，床体占满画面约 90%-95%，四边均可裁切床体，不出现床头板，背景只有垂落的亚麻窗帘。' +
  '床品组合严格按参考图1的搭配逻辑：只有枕套是条纹——两只睡枕套着腮红粉细条纹枕套，条纹的密度、走向、颜色严格 1:1 复刻参考图1的枕头，一前一后自然倚放在床头（参考图3的双枕姿态）；平床单（top sheet）与床笠（fitted sheet）均为纯色浅粉色，颜色与参考图1中床笠的浅粉色完全一致——平床单以纯色浅粉布料随意铺在床面，带大面积自然褶皱与波浪起伏，一角自然翻折垂坠（像刚睡醒随手拉平的状态），褶皱在光线下形成柔和明暗层次；枕头下方与床侧露出的床笠也是同一纯色浅粉，紧紧包裹床垫、边缘服帖。床面露出的区域（床笠面、平床单）统一为纯色浅粉，只有枕套带条纹，严禁床笠或平床单出现条纹，也严禁出现第三种颜色。' +
  '布面纹理在褶皱与转折处必须沿布面自然连续弯曲，无错位、无断裂、无重影、无涂抹感。' +
  '床面之上严禁任何摆件：无抱枕、无搭毯、无书籍、无杯盘、无托盘、无绿植、无任何道具，床面只有枕头与床单。' +
  // 3. 光线氛围段（用户定 v2：白天光线 + 暖色调）
  '白天明亮的自然日光透过白纱帘漫射入室，光线充足、通透明亮，非清晨非傍晚，无金色斜阳；但整体色调保持暖色温、温润奶油感，画面不发冷不偏蓝。光线在床单褶皱与枕面上形成柔和的明暗渐变与光影层次，产品颜色还原与参考图一致、不发灰不偏色。' +
  // 4. 镜头画质段
  '专业家居静物摄影，8K 超高清，浅景深（焦点锁定枕面与床单布面中央，边缘自然虚化），超写实真实物理材质，布面纹理细节清晰可辨。' +
  // 5. 品牌调性段（用户定暖色调）
  'ins 生活方式博主实拍感，温暖、舒适、松弛的 lived-in 氛围，暖色奶油调，低饱和，像真实博主家里的随手拍大片。' +
  // 6. 负向规避段
  '零改动参考图布料的颜色、质感与织纹细节；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、扭曲透视；画面无文字、无水印、无 logo、无人、无任何床面摆件、无床头板。';

async function dataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

(async () => {
  const dest = path.join(OUT, 'seedream-percalestripe-petal-sheet-lifestyle-34-v4.jpg');
  console.log('调用 seedream 5.0 pro: Blush Pink 细条纹 床单床笠枕头种草图（1728x2304·2K，3 张参考图）');
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      seed: SEED,
      prompt,
      image: [await dataUri(REF_MAIN), await dataUri(REF_FABRIC), await dataUri(REF_STYLE)],
      response_format: 'url',
      size: '1728x2304',
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
