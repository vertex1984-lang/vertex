/**
 * update-square-group-images.js — 方形抱枕芯变体组图片统一（2026-10-08 用户定）
 * 以 B0CQC6H9MZ 的新图组为准：主图(Pack of 2 双枕) / 场景 / 侧面 / 填充物，组内全部成员一致
 * b0h4v662hl 已从变体组移除（与 b0g6mptvfd 同为 45×45 重复），不在本次更新内
 * 用法: node scripts/update-square-group-images.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'images', 'staging', 'B0CQC6H9MZ');
const PRODUCTS = path.join(ROOT, 'public', 'images', 'products');
const MAP = path.join(ROOT, 'src', 'data', 'materials-map.ts');

const MEMBERS = ['B0CQC6H9MZ', 'B0G6MPTVFD', 'B0CQC5QJFJ', 'B0F62XRB55', 'B0F62QGV32', 'B0F62ZY8ZN', 'B0F62Y3XT9'];
// [产品目录文件名, staging 源文件]
const SHOTS = [
  ['studio-main', 'main-2pack'],
  ['scene', 'scene'],
  ['studio-side', 'side'],
  ['studio-filling', 'filling'],
];

for (const asin of MEMBERS) {
  const dir = path.join(PRODUCTS, asin);
  fs.mkdirSync(dir, { recursive: true });
  for (const [dest, srcName] of SHOTS) {
    const src = path.join(SRC, `${srcName}.webp`);
    if (!fs.existsSync(src)) { console.error(`缺文件: ${src}（先生成 main-2pack）`); process.exit(1); }
    fs.copyFileSync(src, path.join(dir, `${dest}.webp`));
  }
  console.log(`${asin}: 4 张图已复制`);
}

let ts = fs.readFileSync(MAP, 'utf-8');
for (const asin of MEMBERS) {
  const key = `"${asin.toLowerCase()}": {`;
  const start = ts.indexOf(key);
  if (start === -1) {
    // B0F62XRB55 无素材库条目（materials-map 里只有 whiteBg 标记），图片走 products.ts，单独处理
    console.log(`${asin}: materials-map 无条目，跳过（改 products.ts）`);
    continue;
  }
  const end = ts.indexOf('},', start);
  const entry = ts.slice(start, end);
  const images = SHOTS.map(([name]) => `"/images/products/${asin}/${name}.webp"`).join(',');
  const newEntry = entry
    .replace(/"images":\[[^\]]*\]/, `"images":[${images}]`)
    .replace(/"whiteBg":\[[^\]]*\]/, '"whiteBg":[false,false,false,false]');
  if (newEntry === entry) {
    if (entry.includes('studio-main')) { console.log(`${asin}: 已是新图，跳过`); continue; }
    console.error(`${asin} 替换失败`); process.exit(1);
  }
  ts = ts.slice(0, start) + newEntry + ts.slice(end);
  console.log(`${asin}: materials-map 已更新`);
}
fs.writeFileSync(MAP, ts);
console.log('materials-map.ts 已写入');

// B0F62XRB55：products.ts 的 images 数组重写为新 4 图
const DATA = path.join(ROOT, 'src', 'data', 'products.ts');
let pts = fs.readFileSync(DATA, 'utf-8');
{
  const asin = 'B0F62XRB55';
  const alt = 'Throw Pillow Inserts 35 x 35cm (14\\" x 14\\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)';
  const entries = SHOTS.map(([name]) => `      {
        "url": "/images/products/${asin}/${name}.webp",
        "altText": "${alt}",
        "width": 1200,
        "height": 1200
      }`).join(',\n');
  const block = `"images": [\n${entries}\n    ],`;
  const anchor = `"asin": "${asin}"`;
  const aStart = pts.indexOf(anchor);
  if (aStart === -1) { console.error(`products.ts 未找到 ${asin}`); process.exit(1); }
  const imgStart = pts.indexOf('"images": [', aStart);
  const imgEnd = pts.indexOf('\n    ],', imgStart);
  if (imgStart === -1 || imgEnd === -1) { console.error(`${asin} images 数组定位失败`); process.exit(1); }
  pts = pts.slice(0, imgStart) + block + pts.slice(imgEnd + '\n    ],'.length);
  fs.writeFileSync(DATA, pts);
  console.log(`${asin}: products.ts 已更新`);
}
