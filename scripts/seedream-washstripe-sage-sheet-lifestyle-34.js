/**
 * seedream-washstripe-sage-sheet-lifestyle-34.js — Sage Green 细条纹·床单床笠枕头种草图（seedream 5.0 pro，2026-10-27）
 * 基于模板 scripts/_tpl-seedream-sheetset-lifestyle-34.js（Petal v4 同款配置：2K·3:4、白天暖光、
 * 枕套条纹 + 纯色床单床笠、零摆件）。
 * 与 Petal v4 的区别（用户定：场景、角度不同）：
 *   Petal v4 = 平视近距离床头一角、无床头板、窗帘背景、双枕一前一后倚放；
 *   本图 = 略高机位从床尾斜侧 45° 俯拍，展示床体纵深，双枕并排平放，平床单在胸口高度向后翻折，
 *          露出纯色床面，画面下缘带木地板与剑麻地毯一角，侧窗自然光。
 * 产品布料锚定 WASHSTRIPE-SAGEGREEN-QUEEN（鼠尾草绿细条纹水洗棉），
 * 参考图1=产品主图（床上整体效果），参考图2=ref-sage-stripe.jpg（布料纹理唯一标准）。
 * 输出：public/images/staging/seedream-washstripe-sage-sheet-lifestyle-34-v3.jpg
 * 用法: node scripts/seedream-washstripe-sage-sheet-lifestyle-34.js
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || require('fs').readFileSync(__dirname + '/.ark-api-key', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'staging');
const REF_MAIN = path.join(ROOT, 'public', 'images', 'products', 'WASHSTRIPE-SAGEGREEN-QUEEN', '1-3x4.webp');
const REF_FABRIC = path.join(ROOT, 'public', 'images', 'staging', 'ref-sage-stripe.jpg');
const SEED = 19384;

const prompt =
  // 1. 产品锚定段
  '主角布料是鼠尾草绿（sage green）细条纹水洗棉：布料材质肌理、颜色、条纹密度与走向的所有细节，严格 1:1 复刻参考图1与参考图2（参考图2是布料细节的唯一标准），不做任何改动、不添加任何参考图之外的图案或质感，布面零织标零印花。' +
  // 2. 场景构建段（与上一版种草图不同的场景与角度）
  '竖幅 3:4。略高机位从床尾斜侧约 45° 俯视拍摄，镜头展现床体的纵深感：从床尾一直看到床头，床体占画面约 85%-90%，下缘可裁切床体，画面底部露出浅色木地板与剑麻地毯一角，床头后方是干净的米白色墙面与一扇侧窗（白纱帘），无床头板。' +
  '床品组合严格按参考图1的搭配逻辑：只有枕套是条纹——两只睡枕套着鼠尾草绿细条纹枕套，条纹的密度、走向、颜色严格 1:1 复刻参考图1的枕头，双枕并排自然平放在床头；平床单（top sheet）与床笠（fitted sheet）均为纯色鼠尾草绿，颜色与参考图1中床笠的纯色绿完全一致——平床单在胸口高度向后翻折出一道柔软波浪边，露出下方纯色床面，床面其余区域带自然松软的褶皱起伏（像刚睡醒随手整理的状态）；床尾与床侧露出的床笠也是同一纯色鼠尾草绿，服帖包裹床垫。这张床上没有被套、没有被褥、没有被子，只有床单结构：画面中任何翻折、垂坠、堆叠的布都是纯色平床单。特别强调：画面前景床尾方向那一大片垂坠起伏的布也是纯色平床单，布面只有水洗棉的自然褶皱肌理，没有任何条纹图案。全画面的细条纹只出现在两只枕套上，其他所有布料区域（床笠、平床单、翻折边、垂坠部分）一律为纯色鼠尾草绿，严禁床单床笠出现条纹，也严禁出现第三种颜色。' +
  '布面纹理在褶皱与转折处必须沿布面自然连续弯曲，无错位、无断裂、无重影、无涂抹感。' +
  '床面之上严禁任何摆件：无抱枕、无搭毯、无书籍、无杯盘、无托盘、无绿植、无任何道具，床面只有枕头与床单。' +
  // 3. 光线氛围段（白天光线 + 暖色调）
  '白天明亮的自然日光从侧窗透过白纱帘漫射入室，光线充足、通透明亮，非清晨非傍晚，无金色斜阳；但整体色调保持暖色温、温润奶油感，画面不发冷不偏蓝。光线在床单褶皱与枕面上形成柔和的明暗渐变与光影层次，产品颜色还原与参考图一致、不发灰不偏色。' +
  // 4. 镜头画质段
  '专业家居静物摄影，8K 超高清，浅景深（焦点锁定枕面与床面布面中央，前景床尾与背景自然虚化），超写实真实物理材质，布面纹理细节清晰可辨。' +
  // 5. 品牌调性段
  'ins 生活方式博主实拍感，温暖、舒适、松弛的 lived-in 氛围，暖色奶油调，低饱和，像真实博主家里的随手拍大片。' +
  // 6. 负向规避段
  '零改动参考图布料的颜色、质感与织纹细节；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、扭曲透视；画面无文字、无水印、无 logo、无人、无任何床面摆件、无床头板。';

async function dataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

(async () => {
  const dest = path.join(OUT, 'seedream-washstripe-sage-sheet-lifestyle-34-v3.jpg');
  console.log('调用 seedream 5.0 pro: Sage Green 细条纹 床单床笠枕头种草图（1728x2304·2K，2 张参考图）');
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      seed: SEED,
      prompt,
      image: [await dataUri(REF_MAIN), await dataUri(REF_FABRIC)],
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
