/**
 * update-pillow-series-images.js — 绗缝抱枕芯系列 + 压花磨毛床枕系列 产品图更新（2026-10-08 用户定）
 * 顺序：1 平铺图(主图) → 2 场景图(种草) → 3 侧面图(厚度) → 4 细节图(填充物)
 * 复制 staging 图到 public/images/products/<ASIN>/ 并改写 materials-map.ts 的 images/whiteBg
 * （materials-map 是全站图片第一通道；注意 sync-materials.js 全量同步会覆盖，需重跑本脚本）
 * 用法: node scripts/update-pillow-series-images.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const STAGING = path.join(ROOT, 'public', 'images', 'staging');
const PRODUCTS = path.join(ROOT, 'public', 'images', 'products');
const MAP = path.join(ROOT, 'src', 'data', 'materials-map.ts');

// ASIN → [staging 系列目录, 主图文件名]
const GROUP = [
  { asin: 'B0GXWM4N7J', series: 'quilted', main: 'main-square' },   // 绗缝 35/40×40
  { asin: 'B0G6LXSF4T', series: 'quilted', main: 'main-square' },   // 绗缝 40×40
  { asin: 'B0GRJ8M3TM', series: 'quilted', main: 'main-rect' },     // 绗缝 40×80
  { asin: 'B0GD87ZBN9', series: 'bedpillow', main: 'main-5070' },   // 床枕 50×70
  { asin: 'B0GD843WMN', series: 'bedpillow', main: 'main-4080' },   // 床枕 40×80
  { asin: 'B0GD846FS2', series: 'bedpillow', main: 'main-4070' },   // 床枕 40×70
  // 变体重组（2026-10-08）：B0G6MPTVFD 实为绗缝 45×45（从磨毛布方组移入绗缝方组）；
  // B0G6M3F7CY 绗缝 30×50（从磨毛布长方组移入绗缝长方组）
  { asin: 'B0G6MPTVFD', series: 'quilted', main: 'main-square' },
  { asin: 'B0G6M3F7CY', series: 'quilted', main: 'main-3050' },
];
// [产品目录新文件名, staging 文件名（main 用上面的映射）]
const SHOTS = [
  ['studio-main', 'MAIN'],
  ['scene', 'scene'],
  ['studio-side', 'side'],
  ['studio-filling', 'filling'],
];

for (const { asin, series, main } of GROUP) {
  const dir = path.join(PRODUCTS, asin);
  fs.mkdirSync(dir, { recursive: true });
  for (const [dest, srcName] of SHOTS) {
    const src = path.join(STAGING, series, `${srcName === 'MAIN' ? main : srcName}.webp`);
    if (!fs.existsSync(src)) { console.error(`缺文件: ${src}`); process.exit(1); }
    fs.copyFileSync(src, path.join(dir, `${dest}.webp`));
  }
  console.log(`${asin}: 4 张图已复制`);
}

// 改写 materials-map.ts 各条目的 images / whiteBg
let ts = fs.readFileSync(MAP, 'utf-8');
for (const { asin } of GROUP) {
  const key = `"${asin.toLowerCase()}": {`;
  const start = ts.indexOf(key);
  if (start === -1) { console.error(`materials-map 未找到 ${asin}`); process.exit(1); }
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
