// 2026-11-01：Duvet Covers v7 批次二（8 张通过 QC）切 1200x1600 webp（q82）→ 0-main-3x4.webp，
// public/ 和 out/ 双写；featuredImage 指向新图（无则新增）。
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');

const JOBS = [
  { src: 'main-c-duvet-linen3-charcoal-v7.jpg', asin: 'LINEN3-CHARCOAL-DUVET' },
  { src: 'main-c-duvet-linen3-dustyblue-v7.jpg', asin: 'LINEN3-DUSTYBLUE-DUVET' },
  { src: 'main-c-duvet-percale-mist-v7.jpg', asin: 'PERCALE-MIST-DUVET' },
  { src: 'main-c-duvet-percale-nude-v7.jpg', asin: 'PERCALE-NUDE-DUVET' },
  { src: 'main-c-duvet-percale-coconut-v7.jpg', asin: 'PERCALE-COCONUT-QUEEN-DUVET' },
  { src: 'main-c-duvet-percalepatch-stone-v7.jpg', asin: 'PERCALEPATCH-STONE-DUVET' },
  { src: 'main-c-duvet-veljac-ivory-v7.jpg', asin: 'VELJAC-IVORY-DUVET' },
  { src: 'main-c-duvet-washjac-cream-v7.jpg', asin: 'WASHJAC-CREAM-DUVET' },
];

(async () => {
  for (const { src, asin } of JOBS) {
    const srcPath = path.join(ROOT, 'public', 'images', 'staging', src);
    if (!fs.existsSync(srcPath)) { console.error(`缺源图 ${src}，跳过`); continue; }
    const buf = await sharp(srcPath)
      .resize(1200, 1600, { fit: 'cover', position: 'centre' })
      .webp({ quality: 82 })
      .toBuffer();
    for (const base of ['public', 'out']) {
      const dest = path.join(ROOT, base, 'images', 'products', asin, '0-main-3x4.webp');
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, buf);
    }
    console.log(`${asin} 切图 ✓`);
  }

  const file = path.join(ROOT, 'src', 'data', 'products-materials.ts');
  let text = fs.readFileSync(file, 'utf8');
  for (const { asin } of JOBS) {
    const marker = `"asin": "${asin}"`;
    const idx = text.indexOf(marker);
    if (idx === -1) { console.error(`${asin} 未找到，跳过`); continue; }
    const blockEnd = text.indexOf('"asin":', idx + marker.length);
    const end = blockEnd === -1 ? Math.min(idx + 6000, text.length) : blockEnd;
    const block = text.slice(idx, end);
    const newUrl = `/images/products/${asin}/0-main-3x4.webp`;
    const fiMatch = block.match(/^(\s*)"featuredImage": "([^"]*)",$/m);
    if (fiMatch) {
      if (fiMatch[2] === newUrl) { console.log(`${asin} 已是新图`); continue; }
      text = text.slice(0, idx) + block.replace(fiMatch[0], `${fiMatch[1]}"featuredImage": "${newUrl}",`) + text.slice(end);
      console.log(`${asin} featuredImage 替换 ✓`);
    } else {
      const imgMatch = block.match(/^(\s*)"images": \[$/m);
      if (!imgMatch) { console.error(`${asin} 无 images 行，跳过`); continue; }
      text = text.slice(0, idx) + block.replace(imgMatch[0], `${imgMatch[1]}"featuredImage": "${newUrl}",\n${imgMatch[0]}`) + text.slice(end);
      console.log(`${asin} featuredImage 新增 ✓`);
    }
  }
  fs.writeFileSync(file, text);
  console.log('done');
})().catch((e) => { console.error(e.message); process.exit(1); });
