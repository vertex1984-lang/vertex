/**
 * update-pillow-images.js — 抱枕芯组产品图更新（2026-10-08 用户定）
 * 顺序：1 平铺图(主图) → 2 场景图(种草) → 3 侧面图(厚度) → 4 细节图(填充物)
 * B0CQBZM49V / B0G6M3F7CY 的场景、侧面、细节图共用 B0CQC6H9MZ 组
 * 用法: node scripts/update-pillow-images.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const STAGING = path.join(ROOT, 'public', 'images', 'staging');
const PRODUCTS = path.join(ROOT, 'public', 'images', 'products');
const DATA = path.join(ROOT, 'src', 'data', 'products.ts');

const SHARED = 'B0CQC6H9MZ'; // 场景/侧面/细节共用源
const GROUP = [
  { asin: 'B0CQC6H9MZ', alt: 'Throw Pillow Inserts 45cm x 45cm (18\\" x 18\\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)' },
  { asin: 'B0CQBZM49V', alt: 'Throw Pillow Inserts 30 x 50cm (12\\" x 20\\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)' },
  // B0G6M3F7CY 已移除：该 listing 是菱形绗缝布料，不属于本次磨毛布组（2026-10-08 核实）
];
// [新文件名, staging 来源 ASIN, staging 文件名]
const SHOTS = [
  ['studio-main', null, 'main'],      // null = 用各自 ASIN 的 staging
  ['scene', SHARED, 'scene'],
  ['studio-side', SHARED, 'side'],
  ['studio-filling', SHARED, 'filling'],
];

for (const { asin, alt } of GROUP) {
  const dir = path.join(PRODUCTS, asin);
  fs.mkdirSync(dir, { recursive: true });
  for (const [dest, srcAsin, srcName] of SHOTS) {
    const src = path.join(STAGING, srcAsin || asin, `${srcName}.webp`);
    if (!fs.existsSync(src)) { console.error(`缺文件: ${src}`); process.exit(1); }
    fs.copyFileSync(src, path.join(dir, `${dest}.webp`));
  }
  console.log(`${asin}: 4 张图已复制`);
}

// 重写 products.ts 中三个 ASIN 的 images 数组
let ts = fs.readFileSync(DATA, 'utf-8');
for (const { asin, alt } of GROUP) {
  const entries = SHOTS.map(([name]) => `      {
        "url": "/images/products/${asin}/${name}.webp",
        "altText": "${alt}",
        "width": 1200,
        "height": 1200
      }`).join(',\n');
  const block = `"images": [\n${entries}\n    ],`;
  const anchor = `"asin": "${asin}"`;
  const start = ts.indexOf(anchor);
  if (start === -1) { console.error(`未找到 ${asin}`); process.exit(1); }
  const imgStart = ts.indexOf('"images": [', start);
  const imgEnd = ts.indexOf('\n    ],', imgStart);
  if (imgStart === -1 || imgEnd === -1) { console.error(`${asin} images 数组定位失败`); process.exit(1); }
  ts = ts.slice(0, imgStart) + block + ts.slice(imgEnd + '\n    ],'.length);
  console.log(`${asin}: images 数组已更新`);
}
fs.writeFileSync(DATA, ts);
console.log('products.ts 已写入');
