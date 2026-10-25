/**
 * remove-stale-hidden-20261026.js — 隐藏产品残留入口清理（2026-10-26 用户定，幂等）
 * 1) products.ts HIDDEN_HANDLES 新增：DUVSET Alpine Oat 全家族 4 尺寸 + BEDSET4-GRAY 全家族 4 尺寸
 *   （用户 10-26 发现这两款仍可通过 PDP/色卡/搜索访问——此前从未进隐藏清单；按 Butter/Dill 先例整色下架，数据保留）
 * 2) variant-groups.ts：移除所有 handle 已在隐藏清单内的成员（色卡/变体链接入口，含历史残留 19 款 + 新增 8 款）
 * 3) build-sitemap.js：隐藏清单改为从 products.ts 自动解析（原手动副本已漂移：
 *    25 款已隐藏产品仍被收录；duvset-gray-duvet / percalejac-haze-duvet 两款在售品被误排除）
 * 4) scenes.ts：移除 NECK_PILLOW 常量及以其为唯一 hotspot 的两个场景
 *    （quiet-sofa-reading / deck-chair-sunrise——颈枕类目 10-23 已整体下架，场景成死链入口）
 * 用法: node scripts/remove-stale-hidden-20261026.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const NEW_HIDDEN = [
  // DUVSET Alpine Oat（4 尺寸）
  'makimoo-twin-duvet-cover-set-3-piece-soft-brushed-duvset-oat-twin',
  'makimoo-full-duvet-cover-set-3-piece-soft-brushed-duvset-oat-full',
  'makimoo-queen-duvet-cover-set-3-piece-soft-brushed-duvset-oat-queen',
  'makimoo-king-duvet-cover-set-3-piece-soft-brushed-duvset-oat-king',
  // BEDSET4-GRAY 灰色（4 尺寸）
  'makimoo-twin-bedding-set-4-piece-duvet-cover-set-with-bedset4-gray-twin',
  'makimoo-full-duvet-cover-set-4-pieces-with-fitted-sheet-and-bedset4-gray-full',
  'makimoo-queen-duvet-cover-set-4-pieces-with-fitted-sheet-bedset4-gray-queen',
  'makimoo-king-size-bedding-set-4-piece-duvet-cover-with-bedset4-gray-king',
];

// ─── 1. products.ts：HIDDEN_HANDLES 追加 ────────────────────────────────────
{
  const file = path.join(ROOT, 'src/data/products.ts');
  let s = fs.readFileSync(file, 'utf8');
  const toAdd = NEW_HIDDEN.filter((h) => !s.includes(`'${h}'`));
  if (toAdd.length) {
    const anchor = "  'king-size-bedding-set-4-pieces-soft-brushed-microfiber-bedset4-white-king',";
    const idx = s.indexOf(anchor);
    if (idx < 0) { console.error('products.ts HIDDEN_HANDLES 锚点未找到'); process.exit(1); }
    const block =
      '\n  // 2026-10-26 用户定：DUVSET Alpine Oat 全家族移除（4 尺寸；同 Butter/Dill 口径整色下架，数据保留）\n' +
      toAdd.slice(0, 4).map((h) => `  '${h}',`).join('\n') +
      '\n  // 2026-10-26 用户定：BEDSET4-GRAY 灰色四件套全家族移除（4 尺寸）\n' +
      toAdd.slice(4).map((h) => `  '${h}',`).join('\n');
    s = s.slice(0, idx + anchor.length) + block + s.slice(idx + anchor.length);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`products.ts: HIDDEN_HANDLES +${toAdd.length}`);
}

// 读取最新隐藏清单（含 prefixes）
const ptSrc = fs.readFileSync(path.join(ROOT, 'src/data/products.ts'), 'utf8');
const HIDDEN = new Set(
  [...ptSrc.match(/const HIDDEN_HANDLES = new Set\(\[([\s\S]*?)\]\)/)[1].matchAll(/'([^']+)'/g)].map((m) => m[1])
);

// ─── 2. variant-groups.ts：移除隐藏 handle 的成员（lone-\r 行尾） ───────────
{
  const file = path.join(ROOT, 'src/data/variant-groups.ts');
  let s = fs.readFileSync(file, 'utf8');
  let n = 0;
  for (const h of HIDDEN) {
    const re = new RegExp(`\\{ asin: '[^']*', handle: '${h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[^}]*\\},\\r?`, 'g');
    s = s.replace(re, () => { n++; return ''; });
  }
  fs.writeFileSync(file, s, 'utf8');
  console.log(`variant-groups.ts: -${n} 个隐藏成员`);
}

// ─── 3. build-sitemap.js：隐藏清单自动解析 products.ts ──────────────────────
{
  const file = path.join(ROOT, 'scripts/build-sitemap.js');
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes('HIDDEN 清单唯一来源')) {
    console.log('build-sitemap.js: 已是自动解析，跳过');
  } else {
    const startMark = '// 2026-09-30 用户定：隐藏产品（4 款天鹅绒充气颈枕 + 8 款枕套）不入 sitemap';
    const start = s.indexOf(startMark);
    const endMark = ']);\nconst handles =';
    const end = s.indexOf(endMark);
    if (start < 0 || end < 0) { console.error('build-sitemap.js 锚点未找到'); process.exit(1); }
    const replacement =
      '// 2026-10-26 起：HIDDEN 清单唯一来源 = src/data/products.ts（自动解析，杜绝两份手动清单漂移——\n' +
      '// 漂移曾致 25 款已隐藏产品被 sitemap 收录、duvset-gray-duvet / percalejac-haze-duvet 两款在售品被误排除）\n' +
      'const HIDDEN_HANDLES = new Set(\n' +
      '  [...productsSrc.match(/const HIDDEN_HANDLES = new Set\\(\\[([\\s\\S]*?)\\]\\)/)[1].matchAll(/\'([^\']+)\'/g)].map((m) => m[1])\n' +
      ');\n' +
      'const HIDDEN_HANDLE_PREFIXES = [...productsSrc\n' +
      '  .match(/const HIDDEN_HANDLE_PREFIXES = \\[([\\s\\S]*?)\\]/)[1]\n' +
      '  .matchAll(/\'([^\']+)\'/g)].map((m) => m[1]);\n';
    s = s.slice(0, start) + replacement + s.slice(end + 3); // 保留 'const handles =' 起
    // 过滤条件改用解析出的 prefixes
    const oldFilter =
      "  .filter(\n    (h) =>\n      !h.startsWith('inflatable-travel-pillow-') &&\n      !h.startsWith('comforter-set-3-pcs-washed-cotton-soft-breathable-skin-1688-916370884976') &&\n      !HIDDEN_HANDLES.has(h)\n  );";
    const newFilter =
      '  .filter(\n    (h) =>\n      !HIDDEN_HANDLE_PREFIXES.some((pre) => h.startsWith(pre)) &&\n      !HIDDEN_HANDLES.has(h)\n  );';
    if (!s.includes(oldFilter)) { console.error('build-sitemap.js filter 锚点未找到'); process.exit(1); }
    s = s.replace(oldFilter, newFilter);
    fs.writeFileSync(file, s, 'utf8');
    console.log('build-sitemap.js: 改为自动解析 products.ts 隐藏清单');
  }
}

// ─── 4. scenes.ts：移除 NECK_PILLOW 与两个颈枕场景 ─────────────────────────
{
  const file = path.join(ROOT, 'src/data/scenes.ts');
  let s = fs.readFileSync(file, 'utf8');
  let n = 0;
  for (const slug of ['quiet-sofa-reading', 'deck-chair-sunrise']) {
    const re = new RegExp(`\\r?\\n  \\{\\r?\\n    slug: '${slug}',[\\s\\S]*?\\r?\\n  \\},`);
    if (re.test(s)) { s = s.replace(re, ''); n++; }
  }
  const constRe = /const NECK_PILLOW = '[^']+';\r?\n?/;
  if (constRe.test(s)) { s = s.replace(constRe, ''); n++; }
  fs.writeFileSync(file, s, 'utf8');
  console.log(`scenes.ts: -${n} 处（2 场景 + 1 常量）`);
}
console.log('全部完成');
