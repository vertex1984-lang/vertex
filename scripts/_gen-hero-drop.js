// 一次性脚本（2026-11-27）：合成 /drop-home 的 Drop 拼版 hero 图。
// 桌面端 2560x1440（4 竖联面板）；移动端 1125x1654≈0.68（2×2 网格，配合压低版 mobile hero）。
// 图源 = 首发 Drop 01 四款的场景主图（Sketch Rose / Scarlet Toile / Champagne / Cherry Cream）。
// 用法：node scripts/_gen-hero-drop.js
const sharp = require('sharp');
const path = require('path');

const SRC = [
  'public/images/products/MK-SKROSE4-IVORY-QUEEN/1.webp',
  'public/images/products/MK-TOILE4-SCARLET-QUEEN/1.webp',
  'public/images/products/MK-CHAMP4-CREAM-QUEEN/1.webp',
  'public/images/products/MK-CHERRY4-BLOOM-QUEEN/1.webp',
];

async function panel(file, w, h) {
  return sharp(file).resize(w, h, { fit: 'cover' }).toBuffer();
}

async function desktop() {
  const W = 2560, H = 1440, pw = W / 4;
  const inputs = [];
  for (let i = 0; i < 4; i++) {
    inputs.push({ input: await panel(SRC[i], pw, H), left: i * pw, top: 0 });
  }
  await sharp({ create: { width: W, height: H, channels: 3, background: '#cfc0a8' } })
    .composite(inputs)
    .webp({ quality: 82 })
    .toFile('public/images/brand/hero-drop-desktop.webp');
  console.log('desktop OK');
}

async function mobile() {
  const W = 1125, H = 1654, pw = Math.floor(W / 2), ph = Math.floor(H / 2);
  const inputs = [];
  for (let i = 0; i < 4; i++) {
    inputs.push({ input: await panel(SRC[i], pw, ph), left: (i % 2) * pw, top: Math.floor(i / 2) * ph });
  }
  await sharp({ create: { width: W, height: H, channels: 3, background: '#cfc0a8' } })
    .composite(inputs)
    .webp({ quality: 82 })
    .toFile('public/images/brand/hero-drop-mobile.webp');
  console.log('mobile OK');
}

(async () => {
  await desktop();
  await mobile();
})();
