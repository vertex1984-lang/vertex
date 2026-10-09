/**
 * insert-cushion-mains.js — 新生成的灰底棚拍图插入为主图（图一），其余原图按顺序后移（2026-10-09）
 * 涉及 ASIN → 原图数量（磁盘真实文件数）：
 *   B0BCJV24JR:4  B0F1XFWZVY:5  B0F1XMTYNC:5  B0F1XS27XS:5
 *   B0F1XS7VKY:5  B0CBT8FZWF:4  B0DSGCLBVW:5  B0GJLPXB6F:6
 *   B0F1YDRDTX:4  B0F1Y4J48T:4
 * 磁盘：原 i.webp → i+1.webp（i=N..1）→ staging/<ASIN>/main.webp 复制为 1.webp
 * 代码：products.ts / products-materials.ts 该产品的 images 数组重建为 1..N+1（顺带清除失效引用）；
 *       materials-map.ts images/whiteBg 同步前插第 1 位（棚拍灰底 whiteBg=false）。
 * 用法: node scripts/insert-cushion-mains.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ASINS_ALL = {
  B0BCJV24JR: 4,
  B0F1XFWZVY: 5,
  B0F1XMTYNC: 5,
  B0F1XS27XS: 5,
  B0F1XS7VKY: 5,
  B0CBT8FZWF: 4,
  B0DSGCLBVW: 5,
  B0GJLPXB6F: 6,
  B0F1YDRDTX: 4,
  B0F1Y4J48T: 4,
  B0GJLRGVDJ: 4,
  B0F1V8VMP4: 5,
  B0F1Y91HPR: 4,
  B0FNQRRV78: 6,
  B0GD7RR5PH: 4,
  B0CC5RGRPS: 5,
  B0GJSTTGY5: 5,
  B0C3B16L6R: 3,
  B0CC5TLWFS: 6,
  B0DSGCKWXW: 4,
  B0DSGFXLDV: 5,
  B0CC5VNQY3: 5,
  B0CC5Y77DC: 4,
  B0C4BD7Q5X: 5,
  B0C39ZMK7H: 7,
  B0BCJW18SP: 5,
  B0C33LFHN1: 5,
  B0C33LPY5G: 6,
  B0BCJRTF3X: 5,
  B0C6H5XZMZ: 5,
  B0D5DNWX8J: 5,
};

// 用法: node scripts/insert-cushion-mains.js [ASIN ...]（带参数则只处理指定 ASIN；脚本非幂等，勿对同一 ASIN 重复跑）
const filter = process.argv.slice(2).map(s => s.toUpperCase());
const ASINS = Object.fromEntries(
  Object.entries(ASINS_ALL).filter(([a]) => !filter.length || filter.includes(a))
);

// ---------- 1. 磁盘重排（幂等：目标文件已存在则跳过） ----------
for (const [asin, n] of Object.entries(ASINS)) {
  const dir = path.join(ROOT, 'public', 'images', 'products', asin);
  const staging = path.join(ROOT, 'public', 'images', 'staging', asin, 'main.webp');
  if (!fs.existsSync(staging)) { console.error(`${asin}: 缺少 staging 图，跳过`); process.exit(1); }
  if (fs.existsSync(path.join(dir, `${n + 1}.webp`))) {
    console.log(`${asin}: 磁盘已重排过，跳过`);
    continue;
  }
  for (let i = n; i >= 1; i--) {
    fs.renameSync(path.join(dir, `${i}.webp`), path.join(dir, `${i + 1}.webp`));
  }
  fs.copyFileSync(staging, path.join(dir, '1.webp'));
  console.log(`${asin}: 磁盘重排完成（1=新棚拍图, 2..${n + 1}=原图后移）`);
}

// ---------- 2. products.ts / products-materials.ts（同一结构，两个数据源） ----------
for (const dataFile of ['products.ts', 'products-materials.ts']) {
  const productsFile = path.join(ROOT, 'src', 'data', dataFile);
  let src = fs.readFileSync(productsFile, 'utf-8');
  let touched = false;

  for (const [asin, n] of Object.entries(ASINS)) {
    const reBlock = new RegExp(`("asin": "${asin}"[\\s\\S]*?"images": \\[\\r?\\n)([\\s\\S]*?)(\\r?\\n    \\])`);
    const m = src.match(reBlock);
    if (!m) { console.log(`${asin}: ${dataFile} 无条目，跳过`); continue; }
    const alt = (m[2].match(/"altText": "((?:[^"\\]|\\.)*)"/) || [])[1] || '';
    // 保留非数字命名的额外图片条目（如 jimeng 场景图），追加在 1..n+1 之后
    const extras = [];
    const reEntry = /\{\s*\r?\n\s*"url": "((?:[^"\\]|\\.)*)",[\s\S]*?\}/g;
    let em;
    while ((em = reEntry.exec(m[2])) !== null) {
      if (!new RegExp(`^/images/products/${asin}/\\d+\\.webp$`).test(em[1])) extras.push(em[0]);
    }
    const entries = [];
    for (let i = 1; i <= n + 1; i++) {
      entries.push(
        `      {\n        "url": "/images/products/${asin}/${i}.webp",\n        "altText": "${alt}",\n        "width": 800,\n        "height": 800\n      }`
      );
    }
    src = src.replace(reBlock, `$1${entries.concat(extras).join(',\n')}$3`);
    touched = true;
    console.log(`${asin}: ${dataFile} images 重建为 1..${n + 1}${extras.length ? ` + 保留 ${extras.length} 张额外国` : ''}`);
  }
  if (touched) fs.writeFileSync(productsFile, src);
}

// ---------- 3. materials-map.ts ----------
const mmFile = path.join(ROOT, 'src', 'data', 'materials-map.ts');
let mm = fs.readFileSync(mmFile, 'utf-8');

for (const [asin, n] of Object.entries(ASINS)) {
  const key = asin.toLowerCase();
  const re = new RegExp(`("${key}":\\s*\\{.*?"images":\\[)[^\\]]*(\\],"whiteBg":\\[)[^\\]]*(\\])`);
  const m = mm.match(re);
  if (!m) {
    // 纯数组格式："asin": [true,...] —— 仅 whiteBg 标志，前插 false 即可
    const reArr = new RegExp(`("${key}":\\s*\\[)([^\\]]*)(\\])`);
    const ma = mm.match(reArr);
    if (!ma) { console.error(`${asin}: materials-map 未找到条目`); process.exit(1); }
    mm = mm.replace(reArr, `$1false,${ma[2].trim()}$3`);
    console.log(`${asin}: materials-map 纯数组条目 whiteBg 前插 false`);
    continue;
  }
  const wbStr = (mm.match(new RegExp(`"${key}":\\s*\\{.*?"whiteBg":\\[([^\\]]*)\\]`)) || [])[1] || '';
  const wb = wbStr.split(',').map(s => s.trim() === 'true');
  const newImages = Array.from({ length: n + 1 }, (_, i) => `"/images/products/${asin}/${i + 1}.webp"`).join(',');
  const newWb = [false, ...wb].map(b => (b ? 'true' : 'false')).join(',');
  mm = mm.replace(re, `$1${newImages}$2${newWb}$3`);
  console.log(`${asin}: materials-map images/whiteBg 已同步（前插第 1 位）`);
}
fs.writeFileSync(mmFile, mm);

console.log('全部完成');
