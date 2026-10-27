/**
 * seedream-velstripe-mocha-sheet-lifestyle-34.js — 条纹绒枕套 + 摩卡棕绒面床单床笠 种草图（seedream 5.0 pro，2026-10-27）
 * 基于模板 scripts/_tpl-seedream-sheetset-lifestyle-34.js（2K·3:4、白天暖光、
 * 枕套花纹 + 纯色床单床笠、零摆件、布料层次清晰、凸显绒面）。
 * 角度：右前方 3/4 斜角、略高于床垫的机位，从左往右展示床面纵深，左侧窗光。
 * 产品布料锚定 VELSTRIPE-MOCHA-QUEEN（鼠尾草绿底棕条纹绒 + 摩卡棕纯色绒），
 * 参考图1=产品主图（唯一布料标准：枕套条纹绒 1:1 复刻；
 * 床单床笠为摩卡棕纯色绒面，颜色与参考图中露出的床笠一致）。
 * 输出：public/images/staging/seedream-velstripe-mocha-sheet-lifestyle-34.jpg
 * 用法: node scripts/seedream-velstripe-mocha-sheet-lifestyle-34.js
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || require('fs').readFileSync(__dirname + '/.ark-api-key', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'staging');
const REF_MAIN = path.join(ROOT, 'public', 'images', 'products', 'VELSTRIPE-MOCHA-QUEEN', '1-3x4.webp');
const SEED = 74192;

const prompt =
  // 1. 产品锚定段
  '画面有两种主角布料，全部严格 1:1 复刻参考图1（参考图1是唯一标准）：A=鼠尾草绿底配棕色细条纹的短绒绒面面料，条纹密度、走向、配色与绒面质感完全复刻参考图1的枕套；B=摩卡棕（mocha）纯色短绒绒面材质，细腻绒毛，颜色与参考图1中露出的床笠完全一致。不做任何改动、不添加任何参考图之外的图案或质感，布面零织标零印花。' +
  // 2. 场景构建段
  '竖幅 3:4。镜头在床的右前方 3/4 斜角、略高于床垫的机位，从左往右展示床面纵深：床头在画面左上方、床尾延伸向右下，床体占画面约 85%-90%，下缘与右缘可裁切床体，画面右下角露出米色地毯一角，床头后方是干净的米白色墙面，左侧有一扇透光的窗（白纱帘），无床头板。' +
  '床品组合：只有枕套用布料A——两只睡枕套着绿底棕条纹绒面枕套，条纹完全复刻参考图1的枕头，双枕并排自然平放在床头；平床单（top sheet）与床笠（fitted sheet）均用布料B（摩卡棕纯色绒面）。布料层次关系必须清晰明确：床笠在下紧紧包裹床垫、服帖平整；平床单是一整块独立的绒面布，平整地铺在床笠之上，上缘在枕头下方约胸口高度整齐地向后翻折出一道明晰的折边（折边线条连贯、走向清晰、单层不堆叠），绒面褶皱自然松软。严禁布料结构混乱：折边不能断裂成多段、不能与床笠融为一体分不清层次、不能出现来源不明的布片或凭空多出的布角、不能出现违背重力的悬浮褶皱。这张床上没有被套、没有被褥、没有被子、没有搭毯，只有床单结构。特别强调：全画面的条纹只出现在两只枕套上，其他所有布料区域（床笠、平床单、翻折边）一律为摩卡棕纯色绒面，严禁床单床笠出现条纹、提花或印花，也严禁出现第三种颜色。' +
  '绒面质感是画面重点：侧光下绒面呈现细腻的方向性明暗（绒毛倒向不同产生的深浅变化）、柔和哑光丝绒光泽，褶皱的亮部与暗部过渡如天鹅绒般绵软；枕套条纹沿布面自然连续弯曲，无错位、无断裂、无重影。' +
  '床面之上严禁任何摆件：无抱枕、无搭毯、无书籍、无杯盘、无托盘、无绿植、无任何道具，床面只有枕头与床单。' +
  // 3. 光线氛围段（白天光线 + 暖色调）
  '白天明亮的自然日光从左侧窗透过白纱帘漫射入室，光线充足、通透明亮，非清晨非傍晚，无金色斜阳；但整体色调保持暖色温、温润奶油感，画面不发冷不偏蓝。侧光充分刻画绒面的明暗层次，产品颜色还原与参考图一致、不发灰不偏色。' +
  // 4. 镜头画质段
  '专业家居静物摄影，8K 超高清，浅景深（焦点锁定枕面与床面布面中央，前景与背景自然虚化），超写实真实物理材质，绒面绒毛与条纹细节清晰可辨。' +
  // 5. 品牌调性段
  'ins 生活方式博主实拍感，温暖、舒适、松弛的 lived-in 氛围，暖色奶油调，低饱和，像真实博主家里的随手拍大片。' +
  // 6. 负向规避段
  '零改动参考图布料的颜色、质感与条纹细节；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、扭曲透视；画面无文字、无水印、无 logo、无人、无任何床面摆件、无床头板、无搭毯。';

async function dataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

(async () => {
  const dest = path.join(OUT, 'seedream-velstripe-mocha-sheet-lifestyle-34.jpg');
  console.log('调用 seedream 5.0 pro: 条纹绒枕套 + 摩卡棕绒面床单 种草图（1728x2304·2K，1 张参考图）');
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      seed: SEED,
      prompt,
      image: [await dataUri(REF_MAIN)],
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
