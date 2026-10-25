/**
 * seedream-percalestripe-petal-duvet-lifestyle-34.js — Blush Pink 细条纹被套·聚焦种草图（seedream 5.0 pro，2026-10-24）
 * 沿用 seedream-percale-sky-duvet-lifestyle-34.js 的构图框架（聚焦被套、床上零摆件、床体高占图比、3:4），
 * 产品锚定改为参考图的腮红粉+白细条纹 jacquard 布料（条纹必须 1:1 连续）。
 * 场景规则遵循 docs/lifestyle-image-rules.md 六段式。
 * 输出：public/images/staging/seedream-percalestripe-petal-duvet-lifestyle-34.jpg
 * 用法: node scripts/seedream-percalestripe-petal-duvet-lifestyle-34.js
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || require('fs').readFileSync(__dirname + '/.ark-api-key', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'staging');
const REF_FABRIC = path.join(ROOT, 'public', 'images', 'staging', 'ref-petal-alicdn.jpg');
const SEED = 24129;

const prompt =
  // 1. 产品锚定段（不做文字纹理描述，一切以参考图为准）
  '主角是被套（duvet cover），其布料材质、颜色、提花织纹、条纹密度与走向、正面与反面（AB 面）的所有细节，严格 1:1 复刻参考图，不做任何改动、不添加任何参考图之外的图案或质感；参考图是被套布料的唯一标准，布面零织标。' +
  // 2. 场景构建段（聚焦被套，床上零摆件）
  '构图（必须严格遵守）：竖幅 3:4，镜头近距离聚焦床铺上的被套，床体占满画面约 85%-90%，不需要展示完整床体——床头板可以只露出一小部分或被裁切，画面四边均可裁切床体，被套的布面占据画面视觉中心与最大面积。' +
  '被套以自然随性的方式铺在床上：布面带真实的大面积自然褶皱与波浪起伏（像刚睡醒掀开又随手拉平的状态），褶皱在光线下形成柔和明暗层次。' +
  '布面纹理在褶皱与转折处必须沿布面自然连续弯曲，无错位、无断裂、无重影、无涂抹感；褶皱掀翻处露出的反面细节与参考图中的反面一致。' +
  '床面之上严禁出现任何摆件：无枕头以外的任何物品则连枕头也不要——床面只有这一条被套，无抱枕、无搭毯、无书籍、无杯盘、无托盘、无绿植、无任何道具。' +
  '背景仅露出少量卧室环境：素色墙面与一角自然光，环境极度克制，不抢被套的视觉焦点。' +
  // 3. 光线氛围段
  '清晨柔和自然日光从画面一侧的白纱帘漫射入室，在被套褶皱上形成温润的明暗渐变与柔和阴影，暖色温但白平衡准确，颜色还原与参考图一致、不发灰不发闷。' +
  // 4. 镜头画质段
  '专业家居静物摄影，8K 超高清，浅景深（焦点锁定被套布面中央，边缘自然虚化），超写实真实物理材质，布面细节清晰可辨。' +
  // 5. 品牌调性段（社媒种草图口径：不绑网站色系，真实色彩还原）
  'ins 生活方式博主实拍感，自然真实色彩还原，白平衡准确，清爽通透，低饱和，像真实博主家里的随手拍大片。' +
  // 6. 负向规避段
  '零改动参考图布料的颜色、质感与织纹细节；规避塑料 CGI 质感、光滑假表面、平涂死黑阴影、高饱和色彩、卡通插画画风、失真反光、扭曲透视；画面无文字、无水印、无 logo、无人、无任何床面摆件。';

async function dataUri(file) {
  const sharp = require('sharp');
  const buf = await sharp(file).resize(1024, 1024, { fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

(async () => {
  const dest = path.join(OUT, 'seedream-percalestripe-petal-duvet-lifestyle-34.jpg');
  console.log('调用 seedream 5.0 pro: Blush Pink 细条纹被套 聚焦种草图（1440x1920，1 张参考图）');
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
