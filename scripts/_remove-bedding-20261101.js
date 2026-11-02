/**
 * _remove-bedding-20261101.js — 一次性：删除 14 个 bedding 产品（2026-11-01 用户定）
 * BEDSET4-BEIGE/PINK ×4 尺寸（8）+ POMPOM4-VINE ×4 尺寸（4）+ PERCALEJAC-GREY/OATBEIGE-QUEEN（2）
 * 基于 remove-products.js，扩展：pdp-main-34-asins / image-aspect-overrides / specs-overrides /
 * variant-thumb-crops / weight-boosts.json / taxonomy.json
 * 不删除磁盘图片。用法: node scripts/_remove-bedding-20261101.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const ASINS = [
  'bedset4-beige-twin', 'bedset4-beige-full', 'bedset4-beige-queen', 'bedset4-beige-king',
  'bedset4-pink-twin', 'bedset4-pink-full', 'bedset4-pink-queen', 'bedset4-pink-king',
  'pompom4-vine-twin', 'pompom4-vine-full', 'pompom4-vine-queen', 'pompom4-vine-king',
  'percalejac-grey-queen', 'percalejac-oatbeige-queen',
];
const hit = (line) => ASINS.some((a) => line.toLowerCase().includes(a));

function readLines(f) {
  return fs.readFileSync(path.join(ROOT, f), 'utf-8').split('\n');
}
function writeLines(f, lines) {
  fs.writeFileSync(path.join(ROOT, f), lines.join('\n'));
}
// 删除后处理尾逗号：若被删块/行是最后一个条目，上一行末尾的逗号要去掉（JSON 安全）
function fixTrailingComma(lines, at) {
  if (at >= lines.length) return;
  if (/^\s*[}\]]/.test(lines[at]) && at > 0 && /,\s*$/.test(lines[at - 1])) {
    lines[at - 1] = lines[at - 1].replace(/,\s*$/, '');
  }
}

// ---------- 1. 单行删除 ----------
const LINE_FILES = [
  'src/data/product-specs.ts',
  'src/data/product-weights.ts',
  'src/data/short-titles.ts',
  'src/data/new-product-handles.ts',
  'src/data/variant-groups.ts',
  'src/data/materials-map.ts',
  'src/data/pdp-main-34-asins.ts',
  'src/data/image-aspect-overrides.ts',
  'src/data/specs-overrides.ts',
  'src/data/variant-thumb-crops.ts',
  'src/data/weight-boosts.json',
];
for (const f of LINE_FILES) {
  const lines = readLines(f);
  let removed = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!hit(lines[i])) continue;
    lines.splice(i, 1);
    fixTrailingComma(lines, i);
    removed++;
    i--;
  }
  if (removed) { writeLines(f, lines); console.log(`${f}: 删除 ${removed} 行`); }
}

// ---------- 2. 键值块删除 ----------
function blockEnd(lines, start) {
  let depth = 0;
  let started = false;
  for (let i = start; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === '{' || ch === '[') { depth++; started = true; }
      else if (ch === '}' || ch === ']') { depth--; }
    }
    if (started && depth === 0) return i;
  }
  throw new Error(`块未闭合: 起始行 ${start + 1}`);
}

const KEYED_FILES = [
  'src/data/shopify-map.ts',
  'src/data/product-tags.json',
  'src/data/materials-short-bullets.ts',
  'src/data/material-overrides.json',
  'src/data/taxonomy.json',
];
for (const f of KEYED_FILES) {
  const lines = readLines(f);
  let removed = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!hit(lines[i])) continue;
    const end = blockEnd(lines, i);
    lines.splice(i, end - i + 1);
    fixTrailingComma(lines, i);
    removed++;
    i--;
  }
  if (removed) { writeLines(f, lines); console.log(`${f}: 删除 ${removed} 个块`); }
}

// ---------- 3. products-materials.ts：产品大对象块（起始 { 缩进 0 或 2 空格两种并存，按配平找结束） ----------
{
  const f = 'src/data/products-materials.ts';
  const lines = readLines(f);
  let removed = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!/"asin":\s*"/.test(lines[i]) || !hit(lines[i])) continue;
    let start = i;
    while (start > 0 && !/^\s{0,2}\{\s*$/.test(lines[start])) start--;
    if (!/^\s{0,2}\{\s*$/.test(lines[start])) throw new Error(`${f}: 未找到块起始（asin 行 ${i + 1}）`);
    const end = blockEnd(lines, start);
    lines.splice(start, end - start + 1);
    fixTrailingComma(lines, start);
    removed++;
    i = start - 1;
  }
  if (removed) { writeLines(f, lines); console.log(`${f}: 删除 ${removed} 个块`); }
}

// ---------- 4. JSON 完整性自检 ----------
for (const f of ['src/data/weight-boosts.json', 'src/data/product-tags.json', 'src/data/material-overrides.json', 'src/data/taxonomy.json']) {
  try {
    JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf-8'));
    console.log(`${f}: JSON 校验通过`);
  } catch (e) {
    console.error(`${f}: JSON 校验失败 — ${e.message}`);
    process.exitCode = 1;
  }
}

console.log('全部完成');
