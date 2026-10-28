/**
 * seedream-hero-mist2-mobile-upscale.js — 移动端 hero 图 AI 放大（seedream 5.0 pro 图生图，2026-10-28）
 * 用户定：626x1040 小图放大到 ~2x，画面细节/构图/色调完全不变，仅提升分辨率。
 * 输入: C:/Users/12021/Desktop/大片图/hero-editorial-b-desktop(1)(1).jpg（626x1040）
 * 输出: public/images/staging/hero-mist2-mobile-2x.jpg（确认后再转正替换 hero-mist2-mobile.webp）
 * 用法: node scripts/seedream-hero-mist2-mobile-upscale.js
 */
const fs = require('fs');
const path = require('path');
const KEY = process.env.ARK_API_KEY || fs.readFileSync(__dirname + '/.ark-api-key', 'utf8').trim();

const ROOT = path.join(__dirname, '..');
const SRC = 'C:/Users/12021/Desktop/大片图/hero-editorial-b-desktop(1)(1).jpg';
const DEST = path.join(ROOT, 'public', 'images', 'staging', 'hero-mist2-mobile-2x.jpg');

const PROMPT =
  '将这张照片原样放大到高分辨率：画面内容、构图、色彩、光影、所有细节与质感保持完全一致，' +
  '不做任何改动、不增删任何元素——晨光薄雾中的卧室，白色床品、落地灯、落地窗与窗外远山薄雾。' +
  '只提升清晰度和分辨率，织物的褶皱纹理、灯罩的布艺质感、木地板纹理保持真实自然。' +
  '照片级真实感，画面中不要出现任何文字。';

async function generate(size) {
  const b64 = fs.readFileSync(SRC).toString('base64');
  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-pro-260628',
      prompt: PROMPT,
      image: `data:image/jpeg;base64,${b64}`,
      response_format: 'url',
      size,
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
  fs.writeFileSync(DEST, buf);
  console.log(`已保存 ${DEST} (${buf.length} bytes), size=${data.data[0].size}`);
}

(async () => {
  console.log('调用 seedream 5.0 pro（图生图放大，0.602 比例）');
  try {
    // 0.602 比例 ≈ 1240x2060（约 2 倍放大）
    await generate('1240x2060');
  } catch (e) {
    console.log('1240x2060 失败，回退 1024x1700:', e.message.slice(0, 200));
    await generate('1024x1700');
  }
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
