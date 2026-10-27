/**
 * seedream-veljac-ivory-sheet-lifestyle-34.js — 象牙白绒面提花·床单床笠枕头种草图（seedream 5.0 pro，2026-10-27）
 * 基于模板 scripts/_tpl-seedream-sheetset-lifestyle-34.js（2K·3:4、白天暖光、
 * 枕套花纹 + 纯色床单床笠、零摆件、布料层次清晰）。
 * 与前五张的角度区别：Petal = 平视床头一角；Sage = 床尾斜侧高机位；Gingham = 床侧低机位横拍；
 *   Heart = 床尾正中正面；Pompom = 左前侧 3/4；本图 = 床头右侧 3/4 近距离中景、镜头略低，重点凸显绒面质感。
 * 产品布料锚定 VELJAC-IVORY-QUEEN（象牙白绒面几何提花），参考图1=产品主图（唯一布料标准：
 * 枕套几何提花 1:1 复刻；床单床笠为象牙白纯色绒面，颜色与参考图中露出的床笠一致）。
 * 用户定：床单床笠材质是绒，要凸显绒面质感。
 * 输出：public/images/staging/seedream-veljac-ivory-sheet-lifestyle-34.jpg
 * 用法: node scripts/seedream-veljac-ivory-sheet-lifestyle-34.js
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || require('fs').readFileSync(__dirname + '/.ark-api-key', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'staging');
const REF_MAIN = path.join(ROOT, 'public', 'images', 'products', 'VELJAC-IVORY-QUEEN', '1-3x4.webp');
const SEED = 38654;

const prompt =
  // 1. 产品锚定段
  '画面有两种主角布料，全部严格 1:1 复刻参考图1（参考图1是唯一标准）：A=象牙白（ivory）绒面几何提花面料，菱形与波西米亚几何纹样的凹凸提花、绒面基底完全复刻参考图1的枕套；B=象牙白纯色短绒绒面材质，细腻绒毛，颜色与参考图1中露出的床笠完全一致（暖调象牙白，不是冷白）。不做任何改动、不添加任何参考图之外的图案或质感，布面零织标零印花（纹样是提花凹凸不是印花）。' +
  // 2. 场景构建段（与前五张种草图不同的角度）
  '竖幅 3:4。镜头在床头右侧 3/4 斜角、略低于床垫的近距离中景：床头在画面左上方、床尾延伸向右下，床体占画面约 85%-90%，右缘与下缘可裁切床体，画面右下角露出浅色地毯一角，床头后方是干净的米白色墙面，左侧有一扇透光的窗（白纱帘），无床头板。' +
  '床品组合：只有枕套用布料A——两只睡枕套着象牙白几何提花绒面枕套，提花纹样完全复刻参考图1的枕头，双枕一前一后自然倚放在床头；平床单（top sheet）与床笠（fitted sheet）均用布料B（象牙白纯色绒面）。布料层次关系必须清晰明确：床笠在下紧紧包裹床垫、服帖平整；平床单是一整块独立的绒面布，平整地铺在床笠之上，上缘在枕头下方约胸口高度整齐地向后翻折出一道明晰的折边（折边线条连贯、走向清晰、单层不堆叠），绒面褶皱自然松软。严禁布料结构混乱：折边不能断裂成多段、不能与床笠融为一体分不清层次、不能出现来源不明的布片或凭空多出的布角、不能出现违背重力的悬浮褶皱。这张床上没有被套、没有被褥、没有被子、没有搭毯，只有床单结构。特别强调：全画面的几何提花只出现在两只枕套上，其他所有布料区域（床笠、平床单、翻折边）一律为象牙白纯色绒面，严禁床单床笠出现提花、印花或条纹，也严禁出现第三种颜色。' +
  '绒面质感是画面重点：侧光下绒面呈现细腻的方向性明暗（绒毛倒向不同产生的深浅变化）、柔和哑光丝绒光泽，褶皱的亮部与暗部过渡如天鹅绒般绵软；提花凹凸在枕套上投下细微阴影、立体感清晰，无涂抹感。' +
  '床面之上严禁任何摆件：无抱枕、无搭毯、无书籍、无杯盘、无托盘、无绿植、无任何道具，床面只有枕头与床单。' +
  // 3. 光线氛围段（白天光线 + 暖色调）
  '白天明亮的自然日光从左侧窗透过白纱帘漫射入室，光线充足、通透明亮，非清晨非傍晚，无金色斜阳；但整体色调保持暖色温、温润奶油感，画面不发冷不偏蓝。侧光充分刻画绒面的明暗层次与提花立体感，产品颜色还原与参考图一致、不发灰不偏色。' +
  // 4. 镜头画质段
  '专业家居静物摄影，8K 超高清，浅景深（焦点锁定枕面与床面布面中央，前景与背景自然虚化），超写实真实物理材质，绒面绒毛、提花凹凸细节清晰可辨。' +
  // 5. 品牌调性段
  'ins 生活方式博主实拍感，温暖、舒适、松弛的 lived-in 氛围，暖色奶油调，低饱和，像真实博主家里的随手拍大片。' +
  // 6. 负向规避段
  '零改动参考图布料的颜色、质感与提花细节；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、扭曲透视；画面无文字、无水印、无 logo、无人、无任何床面摆件、无床头板、无搭毯。';

async function dataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

(async () => {
  const dest = path.join(OUT, 'seedream-veljac-ivory-sheet-lifestyle-34.jpg');
  console.log('调用 seedream 5.0 pro: 象牙白绒面提花 床单床笠枕头种草图（1728x2304·2K，1 张参考图）');
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
