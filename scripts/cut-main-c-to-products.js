// 2026-10-31：C 方案新主图切 1200x1600 webp（q82）→ 产品目录 0-main-3x4.webp，public/ 和 out/ 双写（幂等，可反复跑）
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');

const JOBS = [
  { src: 'main-c-washstripe-sage.jpg', asin: 'WASHSTRIPE-SAGEGREEN-QUEEN' },
  { src: 'main-c-percalejac-haze.jpg', asin: 'PERCALEJAC-HAZE-QUEEN' },
  { src: 'main-c-percalecheck-sand.jpg', asin: 'PERCALECHECK-SAND-QUEEN' },
  // 第 1 批（2026-10-31 用户确认）
  { src: 'main-c-bedset4-slate.jpg', asin: 'BEDSET4-SLATE-QUEEN' },
  { src: 'main-c-bedset4-beige.jpg', asin: 'BEDSET4-BEIGE-QUEEN' },
  { src: 'main-c-duvset-gray.jpg', asin: 'DUVSET-GRAY-QUEEN' },
  { src: 'main-c-linen3-sage.jpg', asin: 'LINEN3-SAGE-QUEEN' },
  { src: 'main-c-sateen4-cream.jpg', asin: 'SATEEN4-CREAM-QUEEN' },
  { src: 'main-c-washjac-cream.jpg', asin: 'WASHJAC-CREAM-QUEEN' },
  // 复用 C 方案定档样图（椰白贡缎）
  { src: 'main-tpl-c-55high.jpg', asin: 'PERCALE-COCONUT-QUEEN' },
  // SET B
  { src: 'main-c-1025015219200-c1.jpg', asin: '1025015219200-C1' },
  { src: 'main-c-1071466105053-c5.jpg', asin: '1071466105053-C5' },
  { src: 'main-c-1071466105053-c9.jpg', asin: '1071466105053-C9' },
  { src: 'main-c-1071466105053-c11.jpg', asin: '1071466105053-C11' },
  { src: 'main-c-percalepatch-stone-queen.jpg', asin: 'PERCALEPATCH-STONE-QUEEN' },
  // SET C
  { src: 'main-c-percalestripe-petal-queen.jpg', asin: 'PERCALESTRIPE-PETAL-QUEEN' },
  { src: 'main-c-pompom4-vine-queen.jpg', asin: 'POMPOM4-VINE-QUEEN' },
  { src: 'main-c-veljac-ivory-queen.jpg', asin: 'VELJAC-IVORY-QUEEN' },
  { src: 'main-c-velstripe-charcoal-queen.jpg', asin: 'VELSTRIPE-CHARCOAL-QUEEN' },
  // SET D
  { src: 'main-c-mk-btfly4-mocha-queen.jpg', asin: 'MK-BTFLY4-MOCHA-QUEEN' },
  { src: 'main-c-mk-floral4-grey-queen.jpg', asin: 'MK-FLORAL4-GREY-QUEEN' },
  { src: 'main-c-mk-heart4-tan-queen.jpg', asin: 'MK-HEART4-TAN-QUEEN' },
  { src: 'main-c-mk-print4-blue-queen.jpg', asin: 'MK-PRINT4-BLUE-QUEEN' },
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
    console.log(`${asin} ✓`);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
