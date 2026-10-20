/**
 * bedding-image-inventory.js — 盘点 bedding 类目全部产品的主图（临时工具，2026-10-19）
 * 解析 products.ts 内联 BASE_PRODUCTS + products-materials.ts 的 MATERIALS_PRODUCTS，
 * 筛 productType=Bedding，取主图 /images/products/<ASIN>/1.webp，按文件内容 MD5 去重。
 * 输出：产品总数、唯一主图数、每张唯一图对应的 ASIN 列表。
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');

function evalArray(file, varName, typeName) {
  let src = fs.readFileSync(file, 'utf-8');
  const start = src.indexOf(`const ${varName}: ${typeName} = [`);
  if (start === -1) throw new Error(`${varName} not found in ${file}`);
  const bracketStart = src.indexOf('[', src.indexOf('= [', start));
  let depth = 0, end = -1;
  for (let i = bracketStart; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
  }
  const literal = src.slice(bracketStart, end + 1);
  return eval(literal);
}

const base = evalArray(path.join(ROOT, 'src/data/products.ts'), 'BASE_PRODUCTS', 'MakimooProduct[]');
const materials = evalArray(path.join(ROOT, 'src/data/products-materials.ts'), 'MATERIALS_PRODUCTS', 'MakimooProduct[]');
const all = [...base, ...materials];

const bedding = all.filter((p) => (p.productType || '').toLowerCase() === 'bedding');
console.log(`bedding 产品总数: ${bedding.length}`);

const SKIP = new Set(['duvset-gray-duvet']);
const groups = new Map(); // md5 -> { file, asins: [] }
let missing = 0;
for (const p of bedding) {
  const asin = p.asin.toLowerCase();
  if (SKIP.has(asin)) continue;
  const img = path.join(ROOT, 'public/images/products', p.asin, '1.webp');
  if (!fs.existsSync(img)) { missing++; console.log(`缺图: ${p.asin}`); continue; }
  const md5 = crypto.createHash('md5').update(fs.readFileSync(img)).digest('hex');
  const g = groups.get(md5) || { file: img, asins: [] };
  g.asins.push(p.asin);
  groups.set(md5, g);
}

console.log(`唯一主图（内容去重）: ${groups.size} 张，缺图 ${missing}`);
const entries = Array.from(groups.values()).sort((a, b) => a.asins[0].localeCompare(b.asins[0]));
for (const g of entries) {
  console.log(`- ${path.basename(path.dirname(g.file))}  (共用 ASIN ${g.asins.length} 个: ${g.asins.slice(0, 4).join(', ')}${g.asins.length > 4 ? '…' : ''})`);
}
