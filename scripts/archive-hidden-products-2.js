/**
 * archive-hidden-products-2.js — 彻底移除第二轮（2026-10-26，幂等）
 * 处理第一轮（archive-hidden-products.js）残留扫描发现的引用：
 * 1) materials-map.ts：同行多条目场景的内联隐藏条目移除（`"key": {...},` 段）
 * 2) variant-groups.ts：前缀隐藏成员（inflatable-travel-pillow-*、1688-916370884976-C5~C8）移除；
 *    成员全空的组整块移除（块文本归档）
 * 3) gallery-images-overrides.ts / product-specs.ts / product-tags.ts / variant-thumb-crops.ts /
 *    weights-overrides.ts / product-reviews.ts（REVIEW 映射表条目）按隐藏 asin 剥离
 * 4) blog-posts.ts：推荐产品卡（{ key: "<asin>", ... } 对象块）按隐藏 asin 剥离
 * 保留：page.tsx / bedding-families.ts 里的排除规则（防 sync 回流的防线）、注释提及
 * 用法: node scripts/archive-hidden-products-2.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const ARCHIVE_DATA = path.join(ROOT, 'archive/removed-products/2026-10-26/data');

const archWrite = (name, text) => {
  const p = path.join(ARCHIVE_DATA, name);
  const prev = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  fs.writeFileSync(p, prev ? prev.replace(/\s+$/, '') + '\n' + text : text, 'utf8');
};

// 隐藏 handle（含前缀）与 asin 映射
const pt = fs.readFileSync(path.join(ROOT, 'src/data/products.ts'), 'utf8');
const HIDDEN = new Set(
  [...pt.match(/const HIDDEN_HANDLES = new Set\(\[([\s\S]*?)\]\)/)[1].matchAll(/'([^']+)'/g)].map((m) => m[1])
);
const PREFIX = [...pt.match(/const HIDDEN_HANDLE_PREFIXES = \[([\s\S]*?)\]/)[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
const asinMap = JSON.parse(fs.readFileSync(path.join(ARCHIVE_DATA, 'handle-asin-map.json'), 'utf8'));
const ASINS = new Set(Object.values(asinMap));
const ASINS_LOWER = new Set([...ASINS].map((a) => a.toLowerCase()));
const escRe = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ─── 1. materials-map.ts 内联条目 ───────────────────────────────────────────
{
  const file = path.join(ROOT, 'src/data/materials-map.ts');
  let s = fs.readFileSync(file, 'utf8');
  let n = 0;
  for (const a of ASINS_LOWER) {
    const re = new RegExp(`(\\n\\s*|^|\\},\\s*)"${escRe(a)}": \\{[^{}]*\\},?`, 'g');
    s = s.replace(re, (m, pre) => {
      n++; archWrite('materials-map.ts.lines', `"${a}": …（内联条目）`);
      if (pre.startsWith('},')) return '},'; // 保留前一条目的收尾
      return pre.trimStart() ? pre : '';
    });
  }
  fs.writeFileSync(file, s, 'utf8');
  console.log(`materials-map.ts: -${n} 内联条目`);
}

// ─── 2. variant-groups.ts：前缀隐藏成员 + 空组整块移除 ──────────────────────
{
  const file = path.join(ROOT, 'src/data/variant-groups.ts');
  let s = fs.readFileSync(file, 'utf8');
  let nm = 0;
  // 前缀隐藏成员（handle 以前缀开头）
  s = s.replace(/\{ asin: '[^']*', handle: '([^']+)'[^}]*\},\r?/g, (m, h) => {
    if (PREFIX.some((p) => h.startsWith(p))) { nm++; archWrite('variant-groups.members', m); return ''; }
    return m;
  });
  // 空组整块移除（成员已清空的组）
  let ng = 0;
  for (;;) {
    const m = s.match(/\{\r?\n?\s*id: '([^']+)',[\s\S]*?members: \[\s*(?:\/\/[^\r\n]*)?\r?\n?\s*\],[\s\S]*?\r?\n?\s*\},\r?/);
    if (!m) break;
    ng++;
    archWrite('variant-groups.empty-groups', m[0] + '\n// ----');
    s = s.replace(m[0], '');
  }
  fs.writeFileSync(file, s, 'utf8');
  console.log(`variant-groups.ts: -${nm} 前缀成员, -${ng} 空组`);
}

// ─── 3. 行级 / 块级剥离 ────────────────────────────────────────────────────
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
// product-specs.ts / product-tags.ts / variant-thumb-crops.ts / weights-overrides.ts：单行 "asin": / 'asin':
for (const f of ['product-specs.ts', 'product-tags.ts', 'variant-thumb-crops.ts', 'weights-overrides.ts']) {
  stripLines(path.join(ROOT, 'src/data', f), (L) => {
    const m = L.match(/^\s*["']([^"']+)["']\s*:/);
    return m && ASINS_LOWER.has(m[1]);
  }, f + '.lines');
}
// gallery-images-overrides.ts：多行块 'asin': [ ... ],
{
  const file = path.join(ROOT, 'src/data/gallery-images-overrides.ts');
  let s = fs.readFileSync(file, 'utf8');
  let n = 0;
  for (const a of ASINS_LOWER) {
    const re = new RegExp(`\\n\\s*'${escRe(a)}': \\[[\\s\\S]*?\\],`, 'g');
    s = s.replace(re, (m) => { n++; archWrite('gallery-images-overrides.ts.blocks', m); return ''; });
  }
  fs.writeFileSync(file, s, 'utf8');
  console.log(`gallery-images-overrides.ts: -${n} 块`);
}
// product-reviews.ts：REVIEW 映射表条目（'asin': XXX_REVIEWS, 单行；常量定义保留——可能被其他产品共用）
stripLines(path.join(ROOT, 'src/data/product-reviews.ts'), (L) => {
  const m = L.match(/^\s*["']([^"']+)["']\s*:\s*[A-Z_]+,\s*$/);
  return m && ASINS_LOWER.has(m[1]);
}, 'product-reviews.ts.lines');
// blog-posts.ts：推荐产品卡对象块 { key: "<asin>", ... },（无嵌套大括号）
{
  const file = path.join(ROOT, 'src/data/blog-posts.ts');
  let s = fs.readFileSync(file, 'utf8');
  let n = 0;
  for (const a of ASINS_LOWER) {
    const re = new RegExp(`\\n\\s*\\{\\s*\\n\\s*key: "${escRe(a)}",[\\s\\S]*?\\},`, 'g');
    s = s.replace(re, (m) => { n++; archWrite('blog-posts.recos', m); return ''; });
  }
  fs.writeFileSync(file, s, 'utf8');
  console.log(`blog-posts.ts: -${n} 推荐卡`);
}
console.log('全部完成');
