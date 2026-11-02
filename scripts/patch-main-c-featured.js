// 2026-10-31：批量把 20 个产品的 featuredImage 指向 C 方案新主图 0-main-3x4.webp（卡面换图）
// 幂等；对已指向 0-main-3x4.webp 的条目跳过。只改 src/data/products.ts / products-materials.ts
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const ASINS = [
  'BEDSET4-SLATE-QUEEN', 'BEDSET4-BEIGE-QUEEN', 'DUVSET-GRAY-QUEEN', 'LINEN3-SAGE-QUEEN',
  'SATEEN4-CREAM-QUEEN', 'WASHJAC-CREAM-QUEEN', 'PERCALE-COCONUT-QUEEN',
  '1025015219200-C1', '1071466105053-C5', '1071466105053-C9', '1071466105053-C11',
  'PERCALEPATCH-STONE-QUEEN', 'PERCALESTRIPE-PETAL-QUEEN', 'POMPOM4-VINE-QUEEN',
  'VELJAC-IVORY-QUEEN', 'VELSTRIPE-CHARCOAL-QUEEN',
  'MK-BTFLY4-MOCHA-QUEEN', 'MK-FLORAL4-GREY-QUEEN', 'MK-HEART4-TAN-QUEEN', 'MK-PRINT4-BLUE-QUEEN',
];

const FILES = ['src/data/products.ts', 'src/data/products-materials.ts'];
const done = new Set();

for (const rel of FILES) {
  const file = path.join(ROOT, rel);
  let text = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const asin of ASINS) {
    const marker = `"asin": "${asin}"`;
    let idx = text.indexOf(marker);
    while (idx !== -1) {
      const blockEnd = text.indexOf('"asin":', idx + marker.length);
      const end = blockEnd === -1 ? Math.min(idx + 6000, text.length) : blockEnd;
      const block = text.slice(idx, end);
      const newUrl = `/images/products/${asin}/0-main-3x4.webp`;
      let newBlock;
      const fiMatch = block.match(/^(\s*)"featuredImage": "([^"]*)",$/m);
      if (fiMatch) {
        if (fiMatch[2] === newUrl) { newBlock = block; }
        else {
          console.log(`${asin} [${rel}] 替换: ${fiMatch[2]} -> ${newUrl}`);
          newBlock = block.replace(fiMatch[0], `${fiMatch[1]}"featuredImage": "${newUrl}",`);
        }
      } else {
        const imgMatch = block.match(/^(\s*)"images": \[$/m);
        if (!imgMatch) { console.error(`${asin} [${rel}] 找不到 images 行，跳过`); newBlock = block; }
        else {
          console.log(`${asin} [${rel}] 新增 featuredImage -> ${newUrl}`);
          newBlock = block.replace(imgMatch[0], `${imgMatch[1]}"featuredImage": "${newUrl}",\n${imgMatch[0]}`);
        }
      }
      if (newBlock !== block) { text = text.slice(0, idx) + newBlock + text.slice(idx + block.length); changed = true; }
      done.add(asin);
      idx = text.indexOf(marker, idx + newBlock.length);
    }
  }
  if (changed) fs.writeFileSync(file, text);
}

const missing = ASINS.filter((a) => !done.has(a));
console.log(`\n处理 ${done.size}/${ASINS.length}` + (missing.length ? `，未找到: ${missing.join(', ')}` : '，全部命中'));
