// 一次性：Cotton Feel 波点四件套新 2 色（1071466105053-C9/C10）主图转换
// 源图 C:/Users/12021/Desktop/种草图/（均 1440x1920，已探明）→ public/images/products/<ASIN>/1.webp (webp q82)
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = 'C:/Users/12021/Desktop/种草图';
const OUT_BASE = path.join(__dirname, '..', 'public', 'images', 'products');

const jobs = [
  { src: 'cream-polka-3x4.jpg', asin: '1071466105053-C9' },
  { src: 'blue-polka-3x4.jpg', asin: '1071466105053-C10' },
];

(async () => {
  for (const j of jobs) {
    const srcPath = path.join(SRC, j.src);
    const meta = await sharp(srcPath).metadata();
    if (meta.width !== 1440 || meta.height !== 1920) {
      throw new Error(`${j.src} 尺寸 ${meta.width}x${meta.height}，不是 1440x1920`);
    }
    const outDir = path.join(OUT_BASE, j.asin);
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, '1.webp');
    await sharp(srcPath).webp({ quality: 82 }).toFile(outPath);
    const om = await sharp(outPath).metadata();
    console.log(`${j.asin}/1.webp  ${om.width}x${om.height}  ${fs.statSync(outPath).size} bytes`);
  }
})();
