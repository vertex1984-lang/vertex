// 2026-11-01：Sheet Sets 新规则主图（无毯子版）切 1200x1600 webp（q82）→ 产品目录 0-main-3x4.webp，
// public/ 和 out/ 双写（幂等）；同时把 featuredImage 指向新图（products-materials.ts）。
// 用法：node scripts/cut-sheetset-main-c.js [name ...]（不传 = 全部 9 款；传名 = 只处理指定款，便于剔除问题图）
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');

const ALL = [
  ['gingham', 'SHEETSET-GINGHAM-QUEEN'],
  ['polka', 'SHEETSET-POLKA-QUEEN'],
  ['sand', 'SHEETSET-SAND-QUEEN'],
  ['petal', 'SHEETSET-PETAL-QUEEN'],
  ['vine', 'SHEETSET-VINE-QUEEN'],
  ['ivory', 'SHEETSET-IVORY-QUEEN'],
  ['heart', 'SHEETSET-HEART-QUEEN'],
  ['mocha', 'SHEETSET-MOCHA-QUEEN'],
  ['sagegreen', 'SHEETSET-SAGEGREEN-QUEEN'],
];

const only = process.argv.slice(2);
const JOBS = ALL.filter(([n]) => only.length === 0 || only.includes(n));

(async () => {
  for (const [name, asin] of JOBS) {
    const srcPath = path.join(ROOT, 'public', 'images', 'staging', `main-c-sheetset-${name}.jpg`);
    if (!fs.existsSync(srcPath)) { console.error(`缺源图 ${name}，跳过`); continue; }
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

  // featuredImage → 0-main-3x4.webp（仅 products-materials.ts 有 SHEETSET 条目）
  const file = path.join(ROOT, 'src', 'data', 'products-materials.ts');
  let text = fs.readFileSync(file, 'utf8');
  for (const [, asin] of JOBS) {
    const marker = `"asin": "${asin}"`;
    const idx = text.indexOf(marker);
    if (idx === -1) { console.error(`${asin} 未找到，跳过`); continue; }
    const blockEnd = text.indexOf('"asin":', idx + marker.length);
    const end = blockEnd === -1 ? Math.min(idx + 6000, text.length) : blockEnd;
    const block = text.slice(idx, end);
    const newUrl = `/images/products/${asin}/0-main-3x4.webp`;
    const fiMatch = block.match(/^(\s*)"featuredImage": "([^"]*)",$/m);
    if (!fiMatch) { console.error(`${asin} 无 featuredImage 行，跳过`); continue; }
    if (fiMatch[2] === newUrl) { console.log(`${asin} featuredImage 已是新图`); continue; }
    console.log(`${asin} featuredImage: ${fiMatch[2]} -> ${newUrl}`);
    text = text.slice(0, idx) + block.replace(fiMatch[0], `${fiMatch[1]}"featuredImage": "${newUrl}",`) + text.slice(end);
  }
  fs.writeFileSync(file, text);
  console.log('done');
})().catch((e) => { console.error(e.message); process.exit(1); });
