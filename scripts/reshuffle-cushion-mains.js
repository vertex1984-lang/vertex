/**
 * reshuffle-cushion-mains.js — 生成的棚拍主图从图一移到图二，其余原图按顺序后移（2026-10-09）
 * 涉及 ASIN → 原图数量（git HEAD）：
 *   B0CBT7B1TY:4  B0CBT7R7NN:5  B0CBT7RFK2:3  B0CC5WN6JJ:5  B0BCJQYYL1:5  B0CXDZF2WQ:5
 * 磁盘：1.webp(新棚拍) 暂存 → git 还原原图 → 原 k≥2 移到 k+1 → 棚拍图放到 2.webp
 * 代码：products.ts 全部引用 k≥2 → k+1，images 数组重建为 1..N+1；
 *       materials-map.ts images/whiteBg 同步插入第 2 位（棚拍灰底 whiteBg=false）。
 * 用法: node scripts/reshuffle-cushion-mains.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const ASINS = {
  B0CBT7B1TY: 4,
  B0CBT7R7NN: 5,
  B0CBT7RFK2: 3,
  B0CC5WN6JJ: 5,
  B0BCJQYYL1: 5,
  B0CXDZF2WQ: 5,
};

// ---------- 1. 磁盘重排 ----------
for (const [asin, n] of Object.entries(ASINS)) {
  const dir = path.join(ROOT, 'public', 'images', 'products', asin);
  const studioTmp = path.join(dir, '_studio.tmp.webp');
  fs.copyFileSync(path.join(dir, '1.webp'), studioTmp); // 当前 1.webp = 新棚拍图
  execSync(`git checkout HEAD -- "public/images/products/${asin}/"`, { cwd: ROOT, stdio: 'inherit' });
  for (let i = n; i >= 2; i--) {
    fs.renameSync(path.join(dir, `${i}.webp`), path.join(dir, `${i + 1}.webp`));
  }
  fs.copyFileSync(studioTmp, path.join(dir, '2.webp'));
  fs.unlinkSync(studioTmp);
  console.log(`${asin}: 磁盘重排完成（1=原场景图, 2=棚拍图, 3..${n + 1}=其余原图）`);
}

// ---------- 2. products.ts ----------
const productsFile = path.join(ROOT, 'src', 'data', 'products.ts');
let src = fs.readFileSync(productsFile, 'utf-8');

for (const [asin, n] of Object.entries(ASINS)) {
  // 2a. 所有引用 k≥2 → k+1
  const reRef = new RegExp(`(/images/products/${asin}/)(\\d+)(\\.webp)`, 'g');
  src = src.replace(reRef, (m, p, k, s) => {
    const num = parseInt(k, 10);
    return num >= 2 ? `${p}${num + 1}${s}` : m;
  });
  // 2b. 重建 images 数组为 1..N+1
  const reBlock = new RegExp(`("asin": "${asin}"[\\s\\S]*?"images": \\[\\n)([\\s\\S]*?)(\\n    \\])`);
  const m = src.match(reBlock);
  if (!m) { console.error(`${asin}: 未找到 images 数组`); process.exit(1); }
  const alt = (m[2].match(/"altText": "((?:[^"\\]|\\.)*)"/) || [])[1] || '';
  const entries = [];
  for (let i = 1; i <= n + 1; i++) {
    entries.push(
      `      {\n        "url": "/images/products/${asin}/${i}.webp",\n        "altText": "${alt}",\n        "width": 800,\n        "height": 800\n      }`
    );
  }
  src = src.replace(reBlock, `$1${entries.join(',\n')}$3`);
  console.log(`${asin}: products.ts images 重建为 1..${n + 1}`);
}
fs.writeFileSync(productsFile, src);

// ---------- 3. materials-map.ts ----------
const mmFile = path.join(ROOT, 'src', 'data', 'materials-map.ts');
let mm = fs.readFileSync(mmFile, 'utf-8');

for (const [asin, n] of Object.entries(ASINS)) {
  const key = asin.toLowerCase();
  const re = new RegExp(`("${key}":\\{.*?"images":\\[)[^\\]]*(\\],"whiteBg":\\[)[^\\]]*(\\])`);
  const m = mm.match(re);
  if (!m) { console.error(`${asin}: materials-map 未找到条目`); process.exit(1); }
  // whiteBg 原数组
  const wbStr = (mm.match(new RegExp(`"${key}":\\{.*?"whiteBg":\\[([^\\]]*)\\]`)) || [])[1] || '';
  const wb = wbStr.split(',').map(s => s.trim() === 'true');
  const newImages = Array.from({ length: n + 1 }, (_, i) => `"/images/products/${asin}/${i + 1}.webp"`).join(',');
  const newWb = [wb[0] ?? false, false, ...wb.slice(1)].map(b => (b ? 'true' : 'false')).join(',');
  mm = mm.replace(re, `$1${newImages}$2${newWb}$3`);
  console.log(`${asin}: materials-map images/whiteBg 已同步`);
}
fs.writeFileSync(mmFile, mm);

console.log('全部完成');
