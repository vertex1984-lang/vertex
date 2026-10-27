/**
 * seedream-pompom-vine-sheet-lifestyle-34.js — 藤蔓提花绒球边枕套 + 鼠尾草绿绒面床单床笠 种草图（seedream 5.0 pro，2026-10-27）
 * 基于模板 scripts/_tpl-seedream-sheetset-lifestyle-34.js（2K·3:4、白天暖光、
 * 枕套花纹 + 纯色床单床笠、零摆件、布料层次清晰）。
 * 与前四张的角度区别：Petal = 平视床头一角；Sage = 床尾斜侧高机位；Gingham = 床侧低机位横拍；
 *   Heart = 床尾正中正面；本图 = 床的左前侧 3/4 斜角中景，右前方窗光。
 * 产品布料锚定 POMPOM4-VINE-QUEEN（米白藤蔓提花 + 棕色绒球花边；B面鼠尾草绿绒），
 * 参考图1=产品主图（唯一布料标准：枕套藤蔓提花与绒球边 1:1 复刻；
 * 床单床笠为鼠尾草绿绒面材质，颜色与参考图中露出的床笠/被套B面绿色一致）。
 * 输出：public/images/staging/seedream-pompom-vine-sheet-lifestyle-34.jpg
 * 用法: node scripts/seedream-pompom-vine-sheet-lifestyle-34.js
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || require('fs').readFileSync(__dirname + '/.ark-api-key', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'staging');
const REF_MAIN = path.join(ROOT, 'public', 'images', 'products', 'POMPOM4-VINE-QUEEN', '1-3x4.webp');
const SEED = 65318;

const prompt =
  // 1. 产品锚定段
  '画面有两种主角布料，全部严格 1:1 复刻参考图1（参考图1是唯一标准）：A=米白底灰绿藤蔓提花面料，边缘缀一圈棕色小绒球花边（提花纹理、绒球的大小与间距完全复刻参考图1的枕套）；B=鼠尾草绿（sage green）短绒绒面材质，细腻绒毛带柔和哑光光泽，颜色与参考图1中露出的绿色床笠/被套B面完全一致。不做任何改动、不添加任何参考图之外的图案或质感，布面零织标零印花（藤蔓是织出来的提花不是印花）。' +
  // 2. 场景构建段（与前四张种草图不同的角度）
  '竖幅 3:4。镜头在床的左前侧 3/4 斜角、中等高度拍摄：床头在画面右上方、床尾延伸向左下，床体占画面约 85%-90%，下缘与左缘可裁切床体，画面左下角露出米色地毯一角，床头后方是干净的米白色墙面，右前方有一扇透光的窗（白纱帘），无床头板。' +
  '床品组合：只有枕套用布料A——两只睡枕套着米白藤蔓提花枕套、四周一圈棕色绒球花边，完全复刻参考图1的枕头，双枕并排自然平放在床头；平床单（top sheet）与床笠（fitted sheet）均用布料B（鼠尾草绿绒面）。布料层次关系必须清晰明确：床笠在下紧紧包裹床垫、服帖平整，绒面质感在侧光下呈现柔和的明暗；平床单是一整块独立的绒面布，平整地铺在床笠之上，上缘在枕头下方约胸口高度整齐地向后翻折出一道明晰的折边（折边线条连贯、走向清晰、单层不堆叠），绒面褶皱自然松软。严禁布料结构混乱：折边不能断裂成多段、不能与床笠融为一体分不清层次、不能出现来源不明的布片或凭空多出的布角、不能出现违背重力的悬浮褶皱。这张床上没有被套、没有被褥、没有被子、没有搭毯，只有床单结构。特别强调：全画面的藤蔓提花与绒球花边只出现在两只枕套上，其他所有布料区域（床笠、平床单、翻折边）一律为鼠尾草绿纯色绒面，严禁床单床笠出现提花、印花或条纹，也严禁出现第三种颜色。' +
  '枕套提花与绒球边在转折处必须沿布面自然连续弯曲，无错位、无断裂、无重影、无涂抹感；绒球颗粒分明、不成糊状。' +
  '床面之上严禁任何摆件：无抱枕、无搭毯、无书籍、无杯盘、无托盘、无绿植、无任何道具，床面只有枕头与床单。' +
  // 3. 光线氛围段（白天光线 + 暖色调）
  '白天明亮的自然日光从右前方窗透过白纱帘漫射入室，光线充足、通透明亮，非清晨非傍晚，无金色斜阳；但整体色调保持暖色温、温润奶油感，画面不发冷不偏蓝。绒面在光线下呈现细腻的哑光丝绒光泽与柔和明暗层次，产品颜色还原与参考图一致、不发灰不偏色。' +
  // 4. 镜头画质段
  '专业家居静物摄影，8K 超高清，浅景深（焦点锁定枕面与床面布面中央，前景与背景自然虚化），超写实真实物理材质，提花织纹、绒球颗粒与绒面质感细节清晰可辨。' +
  // 5. 品牌调性段
  'ins 生活方式博主实拍感，温暖、舒适、松弛的 lived-in 氛围，暖色奶油调，低饱和，像真实博主家里的随手拍大片。' +
  // 6. 负向规避段
  '零改动参考图布料的颜色、质感与织纹细节；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、扭曲透视；画面无文字、无水印、无 logo、无人、无任何床面摆件、无床头板、无搭毯。';

async function dataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

(async () => {
  const dest = path.join(OUT, 'seedream-pompom-vine-sheet-lifestyle-34.jpg');
  console.log('调用 seedream 5.0 pro: 藤蔓提花绒球枕套 + 鼠尾草绿绒面床单 种草图（1728x2304·2K，1 张参考图）');
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
