/**
 * archive-hidden-products.js — 隐藏产品彻底移除 + 数据归档（2026-10-26 用户定，幂等，可重复运行）
 * 口径：HIDDEN_HANDLES / HIDDEN_HANDLE_PREFIXES 内的产品，网站零入口，数据归档到
 * archive/removed-products/2026-10-26/（data/ 原始切片 + images/ 图片目录 + handle-asin-map.json）
 * 剥离：products.ts BASE_PRODUCTS、products-materials.ts MATERIALS_PRODUCTS（字符级扫描，字符串/行注释感知）、
 *       materials-map.ts、materials-short-bullets.ts、short-titles.ts、specs-overrides.ts、
 *       image-aspect-overrides.ts、pdp-main-34-asins.ts、new-product-handles.ts、config/chat-script.ts RUGS
 * 保留：HIDDEN_HANDLES 清单本身（sync-materials.js 全量重同步会拉回条目，清单是网站侧最终防线）；
 *       shopify-map.ts / product-weights.ts 为构建链自动生成，无需手剥。
 * 用法: node scripts/archive-hidden-products.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const ARCHIVE = path.join(ROOT, 'archive/removed-products/2026-10-26');
const ARCHIVE_DATA = path.join(ARCHIVE, 'data');
const ARCHIVE_IMG = path.join(ARCHIVE, 'images');
fs.mkdirSync(ARCHIVE_DATA, { recursive: true });
fs.mkdirSync(ARCHIVE_IMG, { recursive: true });

const archWrite = (name, text) => {
  const p = path.join(ARCHIVE_DATA, name);
  const prev = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  fs.writeFileSync(p, prev ? prev.replace(/\s+$/, '') + '\n' + text : text, 'utf8');
};

// ─── 0. 隐藏清单 ────────────────────────────────────────────────────────────
const ptPath = path.join(ROOT, 'src/data/products.ts');
const pmPath = path.join(ROOT, 'src/data/products-materials.ts');
const pt0 = fs.readFileSync(ptPath, 'utf8');
const HIDDEN = new Set(
  [...pt0.match(/const HIDDEN_HANDLES = new Set\(\[([\s\S]*?)\]\)/)[1].matchAll(/'([^']+)'/g)].map((m) => m[1])
);
const PREFIX = [...pt0.match(/const HIDDEN_HANDLE_PREFIXES = \[([\s\S]*?)\]/)[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
{
  const pm0 = fs.readFileSync(pmPath, 'utf8');
  const all = new Set(
    [...pt0.matchAll(/"handle":\s*"([^"]+)"/g)].map((m) => m[1])
      .concat([...pm0.matchAll(/"handle":\s*"([^"]+)"/g)].map((m) => m[1]))
  );
  for (const h of all) if (PREFIX.some((p) => h.startsWith(p))) HIDDEN.add(h);
}
console.log(`隐藏 handle 总数: ${HIDDEN.size}`);

// ─── 1. 字符级数组条目扫描（字符串/转义/行注释感知；条目切片含前置注释行） ──
function scanArray(src, arrayDecl) {
  const di = src.indexOf(arrayDecl);
  if (di < 0) throw new Error(`${arrayDecl} 未找到`);
  const eq = src.indexOf('=', di); // 跳过类型注解（如 `: ShopifyProduct[]`）里的方括号
  const bStart = src.indexOf('[', eq < 0 ? di : eq);
  let depth = 0, inStr = null, esc = false, inLC = false;
  let entryStart = -1;
  const entries = [];
  let i = bStart;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inLC) { if (c === '\n') inLC = false; continue; }
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '/' && src[i + 1] === '/') { inLC = true; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '[' || c === '{') {
      depth++;
      if (c === '{' && depth === 2) entryStart = i;
      continue;
    }
    if (c === ']' || c === '}') {
      if (c === '}' && depth === 2 && entryStart >= 0) {
        let end = i + 1;
        while (src[end] === ' ' || src[end] === '\t') end++;
        if (src[end] === ',') end++;
        entries.push({ start: entryStart, end });
        entryStart = -1;
      }
      depth--;
      if (depth === 0) break;
    }
  }
  const arrayEnd = i;
  // 条目起点向前扩展到紧邻的注释/空行
  for (const e of entries) {
    let s0 = e.start;
    for (;;) {
      const prevNl = src.lastIndexOf('\n', s0 - 1);
      if (prevNl < 0) break;
      const prevStart = src.lastIndexOf('\n', prevNl - 1) + 1;
      const line = src.slice(prevStart, prevNl);
      if (/^\s*(\/\/|$)/.test(line)) s0 = prevStart;
      else break;
    }
    e.sliceStart = s0;
  }
  return { entries, bStart, arrayEnd };
}

const asinOf = (() => {
  const p = path.join(ARCHIVE_DATA, 'handle-asin-map.json');
  return new Map(fs.existsSync(p) ? Object.entries(JSON.parse(fs.readFileSync(p, 'utf8'))) : []);
})();

function stripArrayFile(file, arrayDecl, archiveName) {
  const s = fs.readFileSync(file, 'utf8');
  const { entries, bStart, arrayEnd } = scanArray(s, arrayDecl);
  const removed = [], kept = [];
  for (const e of entries) {
    const text = s.slice(e.start, e.end);
    const full = s.slice(e.sliceStart, e.end);
    const hm = text.match(/"handle":\s*"([^"]+)"/) || text.match(/url:\s*"\/products\/([^"]+)"/);
    if (hm && HIDDEN.has(hm[1])) removed.push(full);
    else kept.push(full);
  }
  if (!removed.length) { console.log(`${path.basename(file)} [${arrayDecl}]: 0 条目`); return; }
  const head = s.slice(bStart + 1, entries[0].sliceStart);
  // 末条去尾逗号
  const last = kept.length - 1;
  if (last >= 0) kept[last] = kept[last].replace(/\},(\s*)$/, '}$1');
  // 前缀（接口/ import 等）与后缀（数组之后的全部内容）必须保留
  const rebuilt = s.slice(0, bStart + 1) + head + kept.join('\n') + s.slice(arrayEnd);
  fs.writeFileSync(file, rebuilt, 'utf8');
  for (const full of removed) {
    const a = full.match(/"asin":\s*"([^"]+)"/);
    const h = full.match(/"handle":\s*"([^"]+)"/) || full.match(/url:\s*"\/products\/([^"]+)"/);
    if (a && h) asinOf.set(h[1], a[1]);
    // chat-script 条目无 asin 字段：从 image 路径补
    if (!a && h) {
      const img = full.match(/\/images\/products\/([^/]+)\//);
      if (img) asinOf.set(h[1], img[1]);
    }
  }
  archWrite(archiveName, removed.join(''));
  console.log(`${path.basename(file)} [${arrayDecl}]: -${removed.length} 条目`);
}

stripArrayFile(ptPath, 'BASE_PRODUCTS', 'products-ts-BASE_PRODUCTS.json');
stripArrayFile(pmPath, 'MATERIALS_PRODUCTS', 'products-materials-MATERIALS_PRODUCTS.json');
stripArrayFile(path.join(ROOT, 'src/config/chat-script.ts'), 'const RUGS', 'chat-script-RUGS.json');
fs.writeFileSync(path.join(ARCHIVE_DATA, 'handle-asin-map.json'), JSON.stringify(Object.fromEntries(asinOf), null, 2));
const ASINS = new Set([...asinOf.values()]);
const ASINS_LOWER = new Set([...ASINS].map((a) => a.toLowerCase()));
console.log(`asin 映射累计: ${ASINS.size}`);

// ─── 2. 行级 / 块级剥离 ────────────────────────────────────────────────────
function stripLines(file, test, archiveName) {
  const s = fs.readFileSync(file, 'utf8');
  const lines = s.split('\n');
  const removed = [], keep = [];
  for (const L of lines) (test(L) ? removed : keep).push(L);
  if (!removed.length) { console.log(`${path.basename(file)}: 0 行`); return; }
  fs.writeFileSync(file, keep.join('\n'), 'utf8');
  archWrite(archiveName, removed.join('\n'));
  console.log(`${path.basename(file)}: -${removed.length} 行`);
}
for (const f of ['materials-map.ts', 'short-titles.ts', 'specs-overrides.ts']) {
  stripLines(path.join(ROOT, 'src/data', f), (L) => {
    const m = L.match(/^\s*"([^"]+)":/);
    return m && ASINS_LOWER.has(m[1]);
  }, f + '.lines');
}
stripLines(path.join(ROOT, 'src/data/image-aspect-overrides.ts'), (L) => {
  const m = L.match(/^\s*'([^']+)':/);
  return m && ASINS_LOWER.has(m[1]);
}, 'image-aspect-overrides.ts.lines');
stripLines(path.join(ROOT, 'src/data/pdp-main-34-asins.ts'), (L) => {
  const m = L.match(/^\s*'([^']+)',\s*$/);
  return m && ASINS_LOWER.has(m[1]);
}, 'pdp-main-34-asins.ts.lines');
stripLines(path.join(ROOT, 'src/data/new-product-handles.ts'), (L) => {
  const m = L.match(/^\s*'([^']+)',/);
  return m && HIDDEN.has(m[1]);
}, 'new-product-handles.ts.lines');
// materials-short-bullets.ts：多行块  "asin": [ ... ],
{
  const file = path.join(ROOT, 'src/data/materials-short-bullets.ts');
  let s = fs.readFileSync(file, 'utf8');
  let n = 0;
  for (const a of ASINS_LOWER) {
    const re = new RegExp(`\\n  "${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}": \\[[\\s\\S]*?\\n  \\],`, 'g');
    s = s.replace(re, (m) => { n++; archWrite('materials-short-bullets.ts.blocks', m); return ''; });
  }
  fs.writeFileSync(file, s, 'utf8');
  console.log(`materials-short-bullets.ts: -${n} 块`);
}

// ─── 3. 图片目录归档 ────────────────────────────────────────────────────────
{
  const dir = path.join(ROOT, 'public/images/products');
  const lower = new Map(fs.readdirSync(dir).map((d) => [d.toLowerCase(), d]));
  let n = 0;
  for (const a of ASINS_LOWER) {
    const d = lower.get(a);
    if (!d) continue;
    fs.renameSync(path.join(dir, d), path.join(ARCHIVE_IMG, d));
    n++;
  }
  for (const f of ['neck-home.webp', 'neck-travel.webp']) {
    const p = path.join(ROOT, 'public/images/pdp-lifestyle', f);
    if (fs.existsSync(p)) { fs.renameSync(p, path.join(ARCHIVE_IMG, f)); n++; }
  }
  console.log(`images: +${n} 个目录/文件归档`);
}

// ─── 4. 残留校验 ────────────────────────────────────────────────────────────
{
  const leftovers = [];
  const scanFiles = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (!['node_modules', '.next', 'out', '.git', 'archive'].includes(e.name)) walk(p); }
      else if (/\.(ts|tsx)$/.test(e.name)) scanFiles.push(p);
    }
  };
  walk(path.join(ROOT, 'src'));
  for (const f of scanFiles) {
    const s = fs.readFileSync(f, 'utf8');
    const rel = path.relative(ROOT, f);
    for (const h of HIDDEN) if (s.includes(h)) leftovers.push(`${rel}: ${h}`);
    for (const a of ASINS) if (s.includes(a) || s.includes(a.toLowerCase())) leftovers.push(`${rel}: asin ${a}`);
  }
  // products.ts 允许 HIDDEN_HANDLES 清单本身命中
  const ptNow = fs.readFileSync(ptPath, 'utf8');
  const listOnly = ptNow.match(/const HIDDEN_HANDLES = new Set\(\[([\s\S]*?)\]\)/)[1];
  const stripped = ptNow.replace(listOnly, '');
  const left2 = [];
  for (const h of HIDDEN) if (stripped.includes(h)) left2.push(`products.ts(清单外): ${h}`);
  const all = leftovers.filter((l) => !l.startsWith('src/data/products.ts:') || left2.includes(l.replace('src/data/products.ts:', 'products.ts(清单外):')));
  const uniq = [...new Set(all)];
  if (uniq.length) {
    console.log(`!! 残留引用 ${uniq.length} 处:`);
    uniq.slice(0, 50).forEach((l) => console.log('  ', l));
  } else console.log('残留校验: 0');
}
console.log('全部完成 → ' + ARCHIVE);
