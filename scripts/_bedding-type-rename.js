// 2026-10-26 bedding 类型分类体系重构（一次性脚本，跑完可删）：
//  1) four 改名 Complete Set(s)（URL slug 4-piece-sets 不变）
//  2) 新增三个预留类型 sheetset / duvetset / bundle（LABEL/PAGE_COPY/SLUGS/classifySet 前缀）
//  3) Pillow Covers 改名 Pillowcases & Shams（PAGE_COPY.heading + 导航/快链 label，URL 不变）
// 行尾安全：替换按 \r?\n 宽松匹配锚点，新文本沿用被替换块的实际行尾。
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

function escRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

let totalFail = 0;
function editFile(rel, pairs) {
  const file = path.join(ROOT, rel);
  let s = fs.readFileSync(file, 'utf8');
  for (const [oldStr, newStr, expect = 1] of pairs) {
    const re = new RegExp(escRe(oldStr).replace(/\n/g, '\\r?\\n'), 'g');
    const matches = s.match(re);
    const n = matches ? matches.length : 0;
    if (n !== expect) {
      console.error(`FAIL ${rel}: expected ${expect}x, got ${n}x :: ${JSON.stringify(oldStr.slice(0, 70))}`);
      totalFail++;
      continue;
    }
    s = s.replace(re, (m) => {
      const nl = m.includes('\r\n') ? '\r\n' : '\n';
      return newStr.replace(/\n/g, nl);
    });
    console.log(`ok   ${rel} :: ${JSON.stringify(oldStr.slice(0, 60))}`);
  }
  fs.writeFileSync(file, s);
}

// ── 1. src/data/bedding-families.ts ─────────────────────────────────────────
editFile('src/data/bedding-families.ts', [
  // SetKind 加三类型
  [
    "export type SetKind = 'four' | 'comforter' | 'duvet' | 'sheet' | 'pillowcase';",
    "// 2026-10-26 用户定：新增 sheetset（Sheet Set）/ duvetset（Duvet Cover Set）/ bundle（Starter\n// Bedroom Bundle）三个预留类型——暂无产品，分类前缀/文案/路由均已就位，接入对应 ASIN 前缀即上线\nexport type SetKind =\n  | 'four'\n  | 'comforter'\n  | 'duvet'\n  | 'sheet'\n  | 'pillowcase'\n  | 'sheetset'\n  | 'duvetset'\n  | 'bundle';",
  ],
  // beddingCardTitle 注释更新
  [
    ' *  - Sheets / Pillow Covers（未上线）上线后同规则',
    ' *  - sheetset / duvetset / bundle（2026-10-26 预留，暂无产品）走兜底 "{布料} Set"',
  ],
  // classifySet 枕套注释改名
  [
    '归 Pillow Covers，',
    '归 Pillowcases & Shams，',
  ],
  // classifySet 加三前缀规则（插在 mk-btfly4- 规则后）
  [
    "  if (a.startsWith('mk-btfly4-')) return 'four';",
    "  if (a.startsWith('mk-btfly4-')) return 'four';\n  // 2026-10-26 用户定：三个预留类型前缀（暂无产品；与 duvset- 等既有前缀互不前缀冲突）\n  if (a.startsWith('sheetset-')) return 'sheetset';\n  if (a.startsWith('duvetset-')) return 'duvetset';\n  if (a.startsWith('bundle-')) return 'bundle';",
  ],
  // SET_KIND_LABEL：four 改名 + 新增三类型 + pillowcase 注释更新
  [
    "export const SET_KIND_LABEL: Record<SetKind, string> = {\n  // 2026-10-16 用户定：对外类目名不再用 x-Piece 叫法——four = \"Sheets & Duvet Set(s)\"（4 件套）；\n  // 2026-10-22 用户定：three（Duvet Cover Sets，3 件套）类型整体下线，原家族并入 four\n  four: 'Sheets & Duvet Set',\n  comforter: 'Comforter Set',\n  duvet: 'Duvet Cover',\n  sheet: 'Fitted Sheet',\n  // 2026-10-26 用户定：Pillow Covers 分类上线（枕套对装）\n  pillowcase: 'Pillowcases',\n};",
    "export const SET_KIND_LABEL: Record<SetKind, string> = {\n  // 2026-10-16 用户定：对外类目名不再用 x-Piece 叫法；2026-10-22 用户定：three（3 件套）类型\n  // 整体下线、原家族并入 four；2026-10-26 用户定：four 改名 \"Complete Set(s)\"\n  // （原 \"Sheets & Duvet Set(s)\"，URL slug /bedding/4-piece-sets/ 不变）\n  four: 'Complete Set',\n  comforter: 'Comforter Set',\n  duvet: 'Duvet Cover',\n  sheet: 'Fitted Sheet',\n  // 2026-10-26 用户定：Pillow Covers 分类上线（枕套对装），同日页面/导航层改名 Pillowcases & Shams；\n  // 本 LABEL 保持 'Pillowcases'（卡面/PDP 标题用），URL /bedding/pillow-covers/ 不变\n  pillowcase: 'Pillowcases',\n  // 2026-10-26 用户定：三个预留类型（暂无产品）\n  sheetset: 'Sheet Set',\n  duvetset: 'Duvet Cover Set',\n  bundle: 'Starter Bedroom Bundle',\n};",
  ],
  // SET_KIND_PAGE_COPY：four heading 改名
  [
    "    heading: 'Sheets & Duvet Sets',",
    "    heading: 'Complete Sets',",
  ],
  // SET_KIND_PAGE_COPY：pillowcase 改名 + 追加三类型
  [
    "  pillowcase: {\n    heading: 'Pillow Covers',\n    blurb: 'Two matching pillowcases',\n  },\n};",
    "  pillowcase: {\n    // 2026-10-26 用户定：Pillow Covers 改名 Pillowcases & Shams（blurb 与 URL 不变）\n    heading: 'Pillowcases & Shams',\n    blurb: 'Two matching pillowcases',\n  },\n  // 2026-10-26 用户定：三个预留类型页文案（暂无产品——/bedding/[slug]/ 只对\n  // 有产品的类型生成静态页，三个 slug 访问 404，接入产品即自动出页）\n  sheetset: {\n    heading: 'Sheet Sets',\n    blurb: 'Fitted sheet, flat sheet & two pillowcases',\n  },\n  duvetset: {\n    heading: 'Duvet Cover Sets',\n    blurb: 'Duvet cover & two pillow shams',\n  },\n  bundle: {\n    heading: 'Starter Bedroom Bundles',\n    blurb: 'Complete set, duvet insert & two pillow inserts',\n  },\n};",
  ],
  // SET_KIND_SLUGS：追加三 slug
  [
    "  'fitted-sheets': 'sheet',\n  'pillow-covers': 'pillowcase',\n};",
    "  'fitted-sheets': 'sheet',\n  'pillow-covers': 'pillowcase',\n  // 2026-10-26 用户定：三个预留类型 slug（无产品时不生成页面，见 [slug]/page.tsx generateStaticParams）\n  'sheet-sets': 'sheetset',\n  'duvet-cover-sets': 'duvetset',\n  'starter-bundles': 'bundle',\n};",
  ],
]);

// ── 2. src/components/v2/V2Header.tsx ───────────────────────────────────────
editFile('src/components/v2/V2Header.tsx', [
  [
    "          // 2026-10-16 用户定：Bedding 子分类改为——类型页（4 件套=Sheets & Duvet Sets，URL slug 不变）\n          // + Duvet Covers + 两个 coming soon 占位；原 Bed Sets 合并入口移除（/bedding/bed-sets/ 合并页\n          // 已删除，该 URL 404）。2026-10-22 用户定：Duvet Cover Sets（3 件套）类型下线、入口移除，\n          // /bedding/3-piece-sets/ 不再生成、访问 404\n          { label: 'Sheets & Duvet Sets', desc: 'Duvet cover, fitted sheet & two pillowcases.', href: '/bedding/4-piece-sets/' },\n          { label: 'Duvet Covers', desc: 'Covers only — mix & match.', href: '/bedding/duvet-covers/' },\n          // 2026-10-25 用户定：Sheets 占位上线为 Fitted Sheets 分类\n          { label: 'Fitted Sheets', desc: 'Deep pocket, all-around elastic.', href: '/bedding/fitted-sheets/' },\n          // 2026-10-26 用户定：Pillow Covers 占位上线为正式分类\n          { label: 'Pillow Covers', desc: 'Two matching pillowcases.', href: '/bedding/pillow-covers/' },",
    "          // 2026-10-26 用户定：类型列按新矩阵重排——Sheet Sets / Duvet Cover Sets /\n          // Starter Bedroom Bundles 为即将上线占位（comingSoon 置灰不可点，产品上线后改活链\n          // 到 /bedding/sheet-sets/ 等对应类型页）；4 件套改名 Complete Sets（原 Sheets & Duvet Sets，\n          // URL slug /bedding/4-piece-sets/ 不变）；Pillow Covers 改名 Pillowcases & Shams\n          // （URL /bedding/pillow-covers/ 不变）。3 件套类型 2026-10-22 已下线（/bedding/3-piece-sets/ 404）\n          { label: 'Sheet Sets', desc: '', href: '/products?cat=bedding', comingSoon: true },\n          { label: 'Duvet Cover Sets', desc: '', href: '/products?cat=bedding', comingSoon: true },\n          { label: 'Complete Sets', desc: 'Duvet cover, fitted sheet & two pillowcases.', href: '/bedding/4-piece-sets/' },\n          { label: 'Starter Bedroom Bundles', desc: '', href: '/products?cat=bedding', comingSoon: true },\n          { label: 'Duvet Covers', desc: 'Covers only — mix & match.', href: '/bedding/duvet-covers/' },\n          { label: 'Fitted Sheets', desc: 'Deep pocket, all-around elastic.', href: '/bedding/fitted-sheets/' },\n          { label: 'Pillowcases & Shams', desc: 'Two matching pillowcases.', href: '/bedding/pillow-covers/' },",
  ],
]);

// ── 3. src/app/(v2)/products/page.tsx ───────────────────────────────────────
editFile('src/app/(v2)/products/page.tsx', [
  [
    "  // 快链 = 类型子分类：Sheets & Duvet Sets（4 件套，2026-10-22 起含原三件套家族——\n  // Duvet Cover Sets（3-piece）类型已下线，/bedding/3-piece-sets/ 不再生成、访问 404）/\n  // Duvet Covers / Sheets（未上线）/ Pillow Covers（未上线），\n  // 再加有产品的面料页；上标数 = 全部 SKU 数（每个颜色×尺寸变体都算一个产品，2026-10-18 用户定）",
    "  // 快链 = 类型子分类：Complete Sets（4 件套，2026-10-26 由 Sheets & Duvet Sets 改名，\n  // 2026-10-22 起含原三件套家族）/ Duvet Covers / Fitted Sheets / Pillowcases & Shams\n  // （2026-10-26 由 Pillow Covers 改名），再加有产品的面料页；\n  // 上标数 = 全部 SKU 数（每个颜色×尺寸变体都算一个产品，2026-10-18 用户定）",
  ],
  [
    "      typeLinks.push({ label: 'Sheets & Duvet Sets', href: v2url('/bedding/4-piece-sets/') });",
    "      typeLinks.push({ label: 'Complete Sets', href: v2url('/bedding/4-piece-sets/') });",
  ],
  [
    "    // 2026-10-26 用户定：Pillow Covers 占位上线（/bedding/pillow-covers/），无产品时不出快链\n    if (fams.some((f) => f.kind === 'pillowcase'))\n      typeLinks.push({ label: 'Pillow Covers', href: v2url('/bedding/pillow-covers/') });",
    "    // 2026-10-26 用户定：Pillow Covers 分类上线（/bedding/pillow-covers/），同日改名\n    // Pillowcases & Shams（URL 不变）；无产品时不出快链\n    if (fams.some((f) => f.kind === 'pillowcase'))\n      typeLinks.push({ label: 'Pillowcases & Shams', href: v2url('/bedding/pillow-covers/') });",
  ],
]);

// ── 4. src/components/v2/BeddingSetCard.tsx（注释） ─────────────────────────
editFile('src/components/v2/BeddingSetCard.tsx', [
  [
    '（SET_KIND_LABEL，如 "Sheets & Duvet Set"；/products?cat=bedding 材质分区）；',
    '（SET_KIND_LABEL，如 "Complete Set"；/products?cat=bedding 材质分区）；',
  ],
]);

// ── 5. src/components/v2/V2BeddingCatHero.tsx（注释） ───────────────────────
editFile('src/components/v2/V2BeddingCatHero.tsx', [
  [
    ' * 快链 = 类型子分类（Sheets & Duvet Sets / Duvet Covers / Sheets / Pillow Covers，后两个\n * Coming Soon 灰化；Duvet Cover Sets（3 件套）2026-10-22 下线）+ 有产品的面料页（2026-10-16 用户定）。',
    ' * 快链 = 类型子分类（Complete Sets（2026-10-26 由 Sheets & Duvet Sets 改名）/ Duvet Covers /\n * Fitted Sheets / Pillowcases & Shams（同日由 Pillow Covers 改名），无产品的不出快链；\n * Duvet Cover Sets（3 件套）2026-10-22 下线）+ 有产品的面料页（2026-10-16 用户定）。',
  ],
]);

// ── 6. src/components/v2/V2BeddingShop.tsx（注释） ──────────────────────────
editFile('src/components/v2/V2BeddingShop.tsx', [
  [
    ' *   分区与 hero 快链同口径）：Sheets & Duvet Sets（4 件套，2026-10-22 起含原三件套家族）',
    ' *   分区与 hero 快链同口径）：Complete Sets（4 件套，2026-10-26 由 Sheets & Duvet Sets 改名；2026-10-22 起含原三件套家族）',
  ],
]);

// ── 7. src/app/(v2)/bedding/[slug]/page.tsx（注释） ─────────────────────────
editFile('src/app/(v2)/bedding/[slug]/page.tsx', [
  [
    ' * 只给有产品的面料/类型生成静态页；Sheets / Pillow Covers 无产品不生成（导航置灰 Coming soon）。',
    ' * 只给有产品的面料/类型生成静态页；Sheet Sets / Duvet Cover Sets / Starter Bedroom Bundles\n * 暂无产品不生成（2026-10-26 预留，导航置灰 Coming soon；slug 已在 SET_KIND_SLUGS 注册）。',
  ],
]);

// ── 8. AGENTS.md 追加 changelog ─────────────────────────────────────────────
{
  const file = path.join(ROOT, 'AGENTS.md');
  let s = fs.readFileSync(file, 'utf8');
  const entry =
    '\n\n- 2026-10-26: bedding 类型分类体系重构（用户定）——① four 改名 "Complete Set(s)"（原 "Sheets & Duvet Set(s)"，URL slug /bedding/4-piece-sets/ 不变；SET_KIND_LABEL/SET_KIND_PAGE_COPY.heading、V2Header mega menu、/products bedding hero 快链同步改名，blurb "Duvet cover, fitted sheet & two pillowcases" 不变）；② 新增三个预留类型 sheetset / duvetset / bundle（暂无产品）：SetKind/SET_KIND_LABEL/SET_KIND_PAGE_COPY 补全（Record<SetKind> 要求全键覆盖），SET_KIND_SLUGS 加 sheet-sets / duvet-cover-sets / starter-bundles，classifySet 加 sheetset-/duvetset-/bundle- 前缀规则（与 duvset- 等既有前缀互不前缀冲突）；无产品 → /bedding/[slug]/ 不生成页面（404）。V2Header Bedding 类型列按新顺序：Sheet Sets / Duvet Cover Sets（comingSoon 置灰）→ Complete Sets（活链 /bedding/4-piece-sets/）→ Starter Bedroom Bundles（置灰）→ Duvet Covers / Fitted Sheets / Pillowcases & Shams；③ Pillow Covers 改名 Pillowcases & Shams（仅 PAGE_COPY.heading 与导航/hero 快链 label；SET_KIND_LABEL.pillowcase=\'Pillowcases\' 与 URL /bedding/pillow-covers/ 不变；search-config.ts 指向 /pillows/decorative-pillows/ 的 "Pillow Covers" 是抱枕类，不动）。新类型上线口径：产品 ASIN 用 sheetset-/duvetset-/bundle- 前缀即自动归类出页，导航对应行去 comingSoon 改活链；分区序注册表（V2BeddingShop.SECTION_KIND_ORDER / V2FabricShop.KIND_ORDER / categories SET_SECTION_ORDER）未含新类型——有产品后需手动加入对应数组才会出一级页/面料页分区。';
  const nl = s.includes('\r\n') ? '\r\n' : '\n';
  s = s.replace(/\s*$/, '') + entry.replace(/\n/g, nl) + nl;
  fs.writeFileSync(file, s);
  console.log('ok   AGENTS.md :: appended changelog entry');
}

console.log(totalFail === 0 ? 'ALL OK' : `FAILURES: ${totalFail}`);
process.exit(totalFail === 0 ? 0 : 1);
