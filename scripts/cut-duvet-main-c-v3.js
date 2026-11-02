// 2026-11-01：Duvet Covers v3 规则主图（床尾中轴机位）切 1200x1600 webp（q82）→ 产品目录 0-main-3x4.webp，
// public/ 和 out/ 双写（幂等）。featuredImage 已在 v2 流程指向 0-main-3x4.webp，无需再改 src。
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');

const JOBS = [
  { src: 'main-c-duvet-duvset-gray-v3.jpg', asin: 'DUVSET-GRAY-DUVET' },
  { src: 'main-c-duvet-linen3-ivory-v3.jpg', asin: 'LINEN3-IVORY-DUVET' },
  { src: 'main-c-duvet-percale-sky-v3.jpg', asin: 'PERCALE-SKY-DUVET' },
  { src: 'main-c-duvet-percalestripe-petal-v3.jpg', asin: 'PERCALESTRIPE-PETAL-DUVET' },
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
  console.log('done');
})().catch((e) => { console.error(e.message); process.exit(1); });
