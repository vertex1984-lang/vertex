/**
 * regen-archive-from-git.js — 从 git HEAD 重建归档切片（2026-10-26）
 * 背景：archive-hidden-products 第一轮运行后归档数据目录被误清，但所有被剥离内容在 git HEAD 中完好。
 * 本脚本按当前 HIDDEN 清单从 HEAD 版本提取各文件中的隐藏条目，重新写入 archive。
 * 用法: node scripts/regen-archive-from-git.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const ARCHIVE_DATA = path.join(ROOT, 'archive/removed-products/2026-10-26/data');
fs.mkdirSync(ARCHIVE_DATA, { recursive: true });

const pt = fs.readFileSync(path.join(ROOT, 'src/data/products.ts'), 'utf8');
const HIDDEN = new Set(
  [...pt.match(/const HIDDEN_HANDLES = new Set\(\[([\s\S]*?)\]\)/)[1].matchAll(/'([^']+)'/g)].map((m) => m[1])
);
const PREFIX = [...pt.match(/const HIDDEN_HANDLE_PREFIXES = \[([\s\S]*?)\]/)[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
const asinMap = JSON.parse(fs.readFileSync(path.join(ARCHIVE_DATA, 'handle-asin-map.json'), 'utf8'));
const ASINS_LOWER = new Set(Object.values(asinMap).map((a) => a.toLowerCase()));
const escRe = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isH = (h) => HIDDEN.has(h) || PREFIX.some((p) => h.startsWith(p));
const head = (f) => execSync(`git show HEAD:${f}`, { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 }).toString('utf8');
const write = (name, text) => fs.writeFileSync(path.join(ARCHIVE_DATA, name), text, 'utf8');

// variant-groups.ts：隐藏成员行 + 成员全隐藏的组整块
{
  const s = head('src/data/variant-groups.ts');
  const members = [];
  for (const m of s.matchAll(/\{ asin: '[^']*', handle: '([^']+)'[^}]*\},/g)) {
    if (isH(m[1])) members.push(m[0]);
  }
  write('variant-groups.members', members.join('\n') + '\n');
  console.log('variant-groups.members:', members.length);
  // 空组（现网版中已不存在的组 = 整块被移除的）
  const now = fs.readFileSync(path.join(ROOT, 'src/data/variant-groups.ts'), 'utf8');
  const gone = [];
  for (const m of s.matchAll(/id: '([^']+)'/g)) {
    if (!now.includes(`id: '${m[1]}'`)) gone.push(m[1]);
  }
  const blocks = [];
  for (const gid of gone) {
    const re = new RegExp(`\\{\\r?\\n?\\s*id: '${escRe(gid)}',[\\s\\S]*?\\},`, 'm');
    const b = s.match(re);
    if (b) blocks.push(b[0]);
  }
  write('variant-groups.empty-groups', blocks.join('\n// ----\n') + '\n');
  console.log('variant-groups.empty-groups:', blocks.length, gone);
}

// 行级文件
const lineFiles = ['new-product-handles.ts', 'product-tags.ts', 'variant-thumb-crops.ts', 'weights-overrides.ts', 'product-specs.ts', 'short-titles.ts', 'specs-overrides.ts', 'pdp-main-34-asins.ts', 'materials-map.ts', 'product-reviews.ts'];
for (const f of lineFiles) {
  const s = head('src/data/' + f);
  const out = [];
  // 逐行 + 同行内联条目（materials-map 情形）
  for (const L of s.split('\n')) {
    for (const m of L.matchAll(/["']([^"']+)["']\s*:/g)) {
      if (ASINS_LOWER.has(m[1]) || isH(m[1])) { out.push(L); break; }
    }
    // new-product-handles / pdp-main：'xxx', 纯值行
    const v = L.match(/^\s*'([^']+)',?\s*$/);
    if (v && (isH(v[1]) || ASINS_LOWER.has(v[1]))) out.push(L);
  }
  write(f + '.lines', [...new Set(out)].join('\n') + '\n');
  console.log(f + '.lines:', new Set(out).size);
}

// 块级：gallery-images-overrides / materials-short-bullets / blog-posts recos
{
  const s = head('src/data/gallery-images-overrides.ts');
  const out = [];
  for (const a of ASINS_LOWER) {
    const re = new RegExp(`\\s*'${escRe(a)}': \\[[\\s\\S]*?\\],`, 'g');
    for (const m of s.matchAll(re)) out.push(m[0]);
  }
  write('gallery-images-overrides.ts.blocks', out.join('\n') + '\n');
  console.log('gallery blocks:', out.length);
}
{
  const s = head('src/data/materials-short-bullets.ts');
  const out = [];
  for (const a of ASINS_LOWER) {
    const re = new RegExp(`\\s*"${escRe(a)}": \\[[\\s\\S]*?\\],`, 'g');
    for (const m of s.matchAll(re)) out.push(m[0]);
  }
  write('materials-short-bullets.ts.blocks', out.join('\n') + '\n');
  console.log('short-bullets blocks:', out.length);
}
{
  const s = head('src/data/blog-posts.ts');
  const out = [];
  for (const a of ASINS_LOWER) {
    const re = new RegExp(`\\s*\\{\\s*\\n\\s*key: "${escRe(a)}",[\\s\\S]*?\\},`, 'g');
    for (const m of s.matchAll(re)) out.push(m[0]);
  }
  write('blog-posts.recos', out.join('\n') + '\n');
  console.log('blog recos:', out.length);
}
console.log('归档重建完成');
