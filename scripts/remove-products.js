/**
 * remove-products.js — 从站点数据中移除指定 ASIN 的产品（2026-10-10）
 * 覆盖：单行映射（product-specs / product-weights / short-titles / product-tags.ts /
 *   subcategories / new-product-handles / variant-groups / materials-map）
 *   键值块（shopify-map / product-tags.json / materials-short-bullets / material-overrides.json）
 *   匿名对象块（chat-script.ts）、产品大对象块（products.ts / products-materials.ts）
 * 不删除磁盘图片。用法: node scripts/remove-products.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const ASINS = [
  'b0cw19gmpq',
];
const hit = (line) => ASINS.some((a) => line.toLowerCase().includes(a));

function readLines(f) {
  return fs.readFileSync(path.join(ROOT, f), 'utf-8').split('\n');
}
function writeLines(f, lines) {
  fs.writeFileSync(path.join(ROOT, f), lines.join('\n'));
}

// ---------- 1. 单行删除 ----------
const LINE_FILES = [
  'src/data/product-specs.ts',
  'src/data/product-weights.ts',
  'src/data/short-titles.ts',
  'src/data/product-tags.ts',
  'src/data/subcategories.ts',
  'src/data/new-product-handles.ts',
  'src/data/variant-groups.ts',
  'src/data/materials-map.ts',
];
for (const f of LINE_FILES) {
  const lines = readLines(f);
  const kept = lines.filter((l) => !hit(l));
  if (kept.length !== lines.length) {
    writeLines(f, kept);
    console.log(`${f}: 删除 ${lines.length - kept.length} 行`);
  }
}

// ---------- 2. 通用块删除 ----------
// 从 start 行起按 {} [] 配平，返回块结束行（含）
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

// 删除后处理 JSON 尾逗号：若被删块是最后一个条目，上一行末尾的逗号要去掉
function fixTrailingComma(lines, at) {
  if (at >= lines.length) return;
  if (/^\s*[}\]]/.test(lines[at]) && at > 0 && /,\s*$/.test(lines[at - 1])) {
    lines[at - 1] = lines[at - 1].replace(/,\s*$/, '');
  }
}

// 键值块文件：条目起始行本身含 asin（"asin": { 或 "asin": [）
const KEYED_FILES = [
  'src/data/shopify-map.ts',
  'src/data/product-tags.json',
  'src/data/materials-short-bullets.ts',
  'src/data/material-overrides.json',
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
    i--; // 同位置继续查
  }
  if (removed) { writeLines(f, lines); console.log(`${f}: 删除 ${removed} 个块`); }
}

// ---------- 3. chat-script.ts：匿名对象块（asin 在 image/url 行内） ----------
{
  const f = 'src/config/chat-script.ts';
  const lines = readLines(f);
  let removed = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!hit(lines[i])) continue;
    let start = i;
    while (start > 0 && lines[start].trim() !== '{') start--;
    const end = blockEnd(lines, start);
    lines.splice(start, end - start + 1);
    fixTrailingComma(lines, start);
    removed++;
    i = start - 1;
  }
  if (removed) { writeLines(f, lines); console.log(`${f}: 删除 ${removed} 个块`); }
}

// ---------- 4. products.ts / products-materials.ts：产品大对象块（2 空格缩进的 { 起始，2 空格 } 收尾） ----------
for (const f of ['src/data/products.ts', 'src/data/products-materials.ts']) {
  const lines = readLines(f);
  let removed = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!/"asin":\s*"[A-Z0-9]+"/.test(lines[i]) || !hit(lines[i])) continue;
    let start = i;
    while (start > 0 && !/^\s{2}\{\s*$/.test(lines[start])) start--;
    if (!/^\s{2}\{\s*$/.test(lines[start])) throw new Error(`${f}: 未找到块起始（asin 行 ${i + 1}）`);
    let end = i;
    while (end < lines.length && !/^\s{2}\},?\s*$/.test(lines[end])) end++;
    if (end >= lines.length) throw new Error(`${f}: 未找到块结束（起始行 ${start + 1}）`);
    lines.splice(start, end - start + 1);
    fixTrailingComma(lines, start);
    removed++;
    i = start - 1;
  }
  if (removed) { writeLines(f, lines); console.log(`${f}: 删除 ${removed} 个块`); }
}

console.log('全部完成');
