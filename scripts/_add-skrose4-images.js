// 2026-11-27 Sketch Rose 素描玫瑰四件套（MK-SKROSE4-IVORY-QUEEN/KING）图片入库（一次性脚本，跑完可删）：
// 源图 C:/Users/12021/Desktop/网站产品图/（7 张 PNG，1344x1792 = 3:4，无需裁切）
// → public/images/products/MK-SKROSE4-IVORY-{QUEEN,KING}/{1..7}.webp（webp q82，同 _check-convert-images.js 口径）
// Queen/King 图片一致（同花色不同尺寸），参照 LINEN3 每尺寸独立目录惯例双份落盘。
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = 'C:/Users/12021/Desktop/网站产品图';
const OUT_BASE = path.join(__dirname, '..', 'public', 'images', 'products');

// 图序：1 主图俯视整套 → 2 床头特写 → 3 侧景带灯 → 4 模特睡姿 → 5 → 6 面料特写 → 7
const jobs = [
  { src: '微信图片_20261127091824_3971_24.png', out: '1.webp' },
  { src: '微信图片_20261127091830_3976_24.png', out: '2.webp' },
  { src: '微信图片_20261127091830_3977_24.png', out: '3.webp' },
  { src: '微信图片_20261127091830_3978_24.png', out: '4.webp' },
  { src: '微信图片_20261127091830_3979_24.png', out: '5.webp' },
  { src: '微信图片_20261127091824_3970_24.png', out: '6.webp' },
  { src: '微信图片_20261127091824_3972_24.png', out: '7.webp' },
];

(async () => {
  for (const asin of ['MK-SKROSE4-IVORY-QUEEN', 'MK-SKROSE4-IVORY-KING']) {
    const outDir = path.join(OUT_BASE, asin);
    fs.mkdirSync(outDir, { recursive: true });
    for (const j of jobs) {
      const srcPath = path.join(SRC, j.src);
      const meta = await sharp(srcPath).metadata();
      if (meta.width !== 1344 || meta.height !== 1792) {
        throw new Error(`${j.src} 尺寸 ${meta.width}x${meta.height}，不是 1344x1792`);
      }
      const outPath = path.join(outDir, j.out);
      await sharp(srcPath).webp({ quality: 82 }).toFile(outPath);
      const om = await sharp(outPath).metadata();
      console.log(`${asin}/${j.out}  ${om.width}x${om.height}  ${fs.statSync(outPath).size} bytes`);
    }
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
