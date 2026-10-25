/**
 * seedream-percalestripe-petal-queen-zhongcao-34.js — Blush Pink 细条纹四件套·种草图（seedream 5.0 pro，2026-10-24）
 * 用户定：参考图 = ref-petal-alicdn.jpg（布料唯一标准，不做文字纹理描述）；
 * 床体占图比 60-70%；3:4；2K（1728x2304）；种草图规则遵循 docs/lifestyle-image-rules.md 六段式。
 * 输出：public/images/staging/seedream-percalestripe-petal-queen-zhongcao-34.jpg
 * 用法: node scripts/seedream-percalestripe-petal-queen-zhongcao-34.js
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || require('fs').readFileSync(__dirname + '/.ark-api-key', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'staging');
const REF_FABRIC = path.join(ROOT, 'public', 'images', 'staging', 'ref-petal-alicdn.jpg');
const SEED = 24137;

const prompt =
  // 1. 产品锚定段（不做文字纹理描述，一切以参考图为准）
  '主角是一套四件式床品（被套 + 床笠 + 两个枕套），其布料材质、颜色、织纹、条纹密度与走向、正面与反面（AB 面）的所有细节，严格 1:1 复刻参考图，不做任何改动、不添加任何参考图之外的图案或质感；参考图是布料的唯一标准，布面零织标。' +
  // 2. 场景构建段
  '构图（必须严格遵守）：竖幅 3:4，床体占画面约 60%-70%，床周留出充足环境空间——可见木地板与地毯、床头两侧的床头柜、墙面与窗户，构图有前景/中景/远景层次与呼吸感留白，床体透视自然正确。' +
  '床上为同一套布料的四件套：两个枕套枕头一前一后自然倚在床头，被套自然铺开带真实褶皱（松弛不刻意），被套上缘自然翻折一小段露出反面（反面细节与参考图一致）。' +
  '场景物品（每件带天然材质）：床头柜上粗陶马克杯带拉花拿铁、翻开内页的杂志、小托盘香薰蜡烛；床尾搭一条羊毛流苏搭毯；画面边缘大型琴叶榕绿植带自然脉络；原木床架带木纹；黄麻地毯。' +
  'ins 奶油风 / 原木风基底，低饱和暖色系，lived-in 松弛感，不刻意摆拍。' +
  // 3. 光线氛围段
  '温暖金色时刻自然日光透过白纱帘漫射入室，地面与家具形成柔和斑驳光影，柔和漫射渐变阴影，窗边日光自带温润光晕，暖色温。' +
  // 4. 镜头画质段
  '专业室内家居摄影，8K 超高清，浅景深电影镜头效果（焦点锁定床品，前景与背景自然虚化），细微复古胶片颗粒，超写实真实物理材质。' +
  // 5. 品牌调性段（社媒种草图口径）
  'ins 生活方式博主实拍感，自然真实色彩还原，白平衡准确，清爽通透不发闷，低饱和，像真实博主家里的随手拍大片。' +
  // 6. 负向规避段
  '零改动参考图布料的颜色、质感与织纹细节；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、扭曲透视；画面无文字、无水印、无 logo、无人。';

async function dataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

(async () => {
  const dest = path.join(OUT, 'seedream-percalestripe-petal-queen-zhongcao-34.jpg');
  console.log('调用 seedream 5.0 pro: Blush Pink 细条纹四件套 种草图（1728x2304 = 2K 3:4，1 张参考图）');
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      seed: SEED,
      prompt,
      image: [await dataUri(REF_FABRIC)],
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
