/**
 * insert-pillow-seed-image.js — 三条枕头线 9 个 SKU 图片位次调整（2026-10-18 用户定，幂等）
 * 位次：1.webp 主图（灰底平叠）→ 2.webp 种草图（pillow-seed-down-vs-microfiber.png，3:2）→ 3.webp 填充物图
 * 处理：public/images/products/<ASIN>/ 现有 2.webp → 3.webp，种草图转 1600x1067 webp 落 2.webp；
 *       products-materials.ts（images 数组插入对象）、materials-map.ts（images + whiteBg）同步更新。
 * 用法: node scripts/insert-pillow-seed-image.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const ASINS = [
  'DOWN-PILLOW-STANDARD', 'DOWN-PILLOW-QUEEN', 'DOWN-PILLOW-KING',
  'DOWN-FEATHER-PILLOW-STANDARD', 'DOWN-FEATHER-PILLOW-QUEEN', 'DOWN-FEATHER-PILLOW-KING',
  'MICROFIBER-PILLOW-STANDARD', 'MICROFIBER-PILLOW-QUEEN', 'MICROFIBER-PILLOW-KING',
];
const SEED_SRC = path.join(ROOT, 'public/images/staging', 'pillow-seed-down-vs-microfiber.png');
const SEED_ALT = 'Makimoo bed pillows styled on a relaxed, unmade bed in warm neutral tones';

(async () => {
  const sharp = require('sharp');
  if (!fs.existsSync(SEED_SRC)) { console.error('缺种草图: ' + SEED_SRC); process.exit(1); }

  // ─── 1. 图片文件：2.webp → 3.webp，种草图 → 2.webp ──────────────────────
  for (const asin of ASINS) {
    const dir = path.join(ROOT, 'public/images/products', asin);
    const p2 = path.join(dir, '2.webp');
    const p3 = path.join(dir, '3.webp');
    if (!fs.existsSync(p2) && !fs.existsSync(p3)) { console.error(`缺 2.webp: ${asin}`); process.exit(1); }
    if (fs.existsSync(p2)) {
      if (fs.existsSync(p3)) { console.error(`${asin}: 2.webp 与 3.webp 同时存在，请人工检查`); process.exit(1); }
      fs.renameSync(p2, p3); // 填充图挪到第三位
    }
    const tmp = p2 + '.tmp';
    await sharp(SEED_SRC).resize(1600, 1067).webp({ quality: 82 }).toFile(tmp);
    fs.renameSync(tmp, p2);
  }
  console.log('images: 9 个 ASIN 已调整位次（2=种草，3=填充）');

  // ─── 2. products-materials.ts：images 数组插入种草图对象 ────────────────
  {
    const file = path.join(ROOT, 'src/data/products-materials.ts');
    let s = fs.readFileSync(file, 'utf8');
    let n = 0;
    for (const asin of ASINS) {
      if (s.includes(`/images/products/${asin}/3.webp`)) continue; // 幂等
      // 匹配该 ASIN 的 2.webp 图片对象（生成器写死的多行格式）
      const re = new RegExp(
        `\\{\\s*"url": "\\/images\\/products\\/${asin}\\/2\\.webp",\\s*"altText": "([^"]*)",\\s*"width": 1200,\\s*"height": 1200\\s*\\}`
      );
      const m = s.match(re);
      if (!m) { console.error(`products-materials.ts 未匹配: ${asin}`); process.exit(1); }
      const alt = m[1];
      const replacement =
        `{\n        "url": "/images/products/${asin}/2.webp",\n        "altText": "${SEED_ALT}",\n        "width": 1600,\n        "height": 1067\n      },\n      {\n        "url": "/images/products/${asin}/3.webp",\n        "altText": "${alt}",\n        "width": 1200,\n        "height": 1200\n      }`;
      s = s.replace(re, replacement);
      n++;
    }
    fs.writeFileSync(file, s, 'utf8');
    console.log(`products-materials.ts: ${n} 条 images 已更新`);
  }

  // ─── 3. materials-map.ts：images 数组 + whiteBg ─────────────────────────
  {
    const file = path.join(ROOT, 'src/data/materials-map.ts');
    let s = fs.readFileSync(file, 'utf8');
    let n = 0;
    for (const asin of ASINS) {
      const lower = asin.toLowerCase();
      if (new RegExp(`"${lower}":.*3\\.webp`).test(s)) continue; // 幂等
      const oldImg = `"images":["/images/products/${asin}/1.webp","/images/products/${asin}/2.webp"],"whiteBg":[false,false]`;
      const newImg = `"images":["/images/products/${asin}/1.webp","/images/products/${asin}/2.webp","/images/products/${asin}/3.webp"],"whiteBg":[false,false,false]`;
      if (!s.includes(oldImg)) { console.error(`materials-map.ts 未匹配: ${lower}`); process.exit(1); }
      s = s.replace(oldImg, newImg);
      n++;
    }
    fs.writeFileSync(file, s, 'utf8');
    console.log(`materials-map.ts: ${n} 条已更新`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
