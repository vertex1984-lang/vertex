/**
 * seedream-percalestripe-petal-queen-main-34.js — Blush Pink 细条纹四件套·新主图（seedream 5.0 pro，2026-10-24）
 * 用户定：参考图 = ref-petal-alicdn.jpg（布料唯一标准，不做文字纹理描述）；
 * 氛围 = 舒适、松弛（lived-in）；3:4；四件套（被套+床笠+2 枕套）上床展示。
 * 输出：public/images/staging/seedream-percalestripe-petal-queen-main-34.jpg
 * 用法: node scripts/seedream-percalestripe-petal-queen-main-34.js
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || require('fs').readFileSync(__dirname + '/.ark-api-key', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'staging');
const REF_FABRIC = path.join(ROOT, 'public', 'images', 'staging', 'ref-petal-alicdn.jpg');
const SEED = 24131;

const prompt =
  // 1. 产品锚定段（不做文字纹理描述，一切以参考图为准）
  '主角是一套四件式床品（被套 + 床笠 + 两个枕套），其布料材质、颜色、织纹、条纹密度与走向、正面与反面（AB 面）的所有细节，严格 1:1 复刻参考图，不做任何改动、不添加任何参考图之外的图案或质感；参考图是布料的唯一标准，布面零织标。' +
  // 2. 场景构建段（四件套上床，松弛氛围）
  '构图（必须严格遵守）：竖幅 3:4，卧室场景中一张大床占据画面主要空间（床体占画面约 75%-85%），镜头从床尾侧前方略带俯视拍摄，完整呈现床面与床头，床体透视自然正确。' +
  '床上为同一套布料的四件套：两个枕套枕头一前一后自然倚在床头，被套随手铺开、带真实自然的褶皱与波浪起伏（像刚睡醒稍微拉平的状态，松弛不刻意），床笠颜色与参考图中一致。' +
  '被套上缘自然翻折一小段，露出反面（反面细节与参考图一致）。' +
  '床面除四件套本身外无书籍、无杯盘、无玩偶、无搭毯等任何摆件。' +
  '卧室环境克制：原木床架、素色墙面、一角白纱帘，可有少量绿植点缀在画面边缘，不抢床品焦点。' +
  // 3. 光线氛围段
  '清晨柔和自然日光透过白纱帘漫射入室，在床品褶皱上形成温润的明暗渐变，整体氛围舒适、松弛、治愈，暖色温但白平衡准确，颜色还原与参考图一致。' +
  // 4. 镜头画质段
  '专业室内家居摄影，8K 超高清，自然景深，超写实真实物理材质，布面细节清晰可辨。' +
  // 5. 品牌调性段
  'ins 生活方式博主实拍感，自然真实色彩还原，清爽通透，低饱和，像真实博主家里的随手拍大片。' +
  // 6. 负向规避段
  '零改动参考图布料的颜色、质感与织纹细节；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、扭曲透视；画面无文字、无水印、无 logo、无人。';

async function dataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

(async () => {
  const dest = path.join(OUT, 'seedream-percalestripe-petal-queen-main-34.jpg');
  console.log('调用 seedream 5.0 pro: Blush Pink 细条纹四件套 新主图（1440x1920，1 张参考图）');
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
