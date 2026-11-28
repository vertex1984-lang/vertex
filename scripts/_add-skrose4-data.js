// 2026-11-27 Sketch Rose 素描玫瑰四件套建档（一次性脚本，跑完可删）：
// Linen Feel（仿麻）印花四件套（被套+床笠+2枕套），米白底炭笔素描玫瑰 + 橄榄绿 B 面，
// Queen $89.99 / King $99.99，无 Shopify 关联（本地价），预售首发（admin-preorder.json 另行维护）。
// 触点：products-materials / materials-map / materials-short-bullets / short-titles /
//       specs-overrides / new-product-handles / product-weights / image-aspect-overrides /
//       variant-groups（MK-SKROSE4 尺寸组）/ bedding-families（SKROSE4 色名 + classifySet 前缀）/
//       product-tags（COLOR_OVERRIDES 主色 Cream）。
// 行尾安全：\r?\n 宽松匹配锚点，新文本沿用被替换块的实际行尾（全 CRLF）。
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
    console.log(`ok   ${rel} :: ${JSON.stringify(oldStr.slice(0, 55))}`);
  }
  fs.writeFileSync(file, s);
}

if (fs.readFileSync(path.join(ROOT, 'src/data/products-materials.ts'), 'utf8').includes('MK-SKROSE4-IVORY-QUEEN')) {
  console.log('already inserted, skip');
  process.exit(0);
}

const HANDLE_Q = 'makimoo-queen-bedding-set-4-piece-linen-feel-sketch-rose-ivory-queen-mk-skrose4-ivory-queen';
const HANDLE_K = 'makimoo-king-bedding-set-4-piece-linen-feel-sketch-rose-ivory-king-mk-skrose4-ivory-king';
const TITLE_Q = 'Makimoo Queen Bedding Set 4 Piece Linen Feel Sketch Rose Print Duvet Cover Fitted Sheet 2 Pillowcases 88 x 88 in (Sketch Rose)';
const TITLE_K = 'Makimoo King Bedding Set 4 Piece Linen Feel Sketch Rose Print Duvet Cover Fitted Sheet 2 Pillowcases 104 x 90 in (Sketch Rose)';

// 描述：3 行短句风格（参照 admin-products.json 现有床品 description 口径）
const L1 = 'Charcoal sketch-style roses bloom across an ivory linen-feel ground, reversing to a solid olive green.';
const L2_Q = 'Complete Queen 4-piece set: duvet cover (88 x 88 in), fitted sheet (60 x 80 in), and 2 pillowcases (20 x 30 in).';
const L2_K = 'Complete King 4-piece set: duvet cover (104 x 90 in), fitted sheet (78 x 80 in), and 2 pillowcases (20 x 36 in).';
const L3 = 'Machine washable and softens with every wash.';
const DESC_Q = [L1, L2_Q, L3].join('\n');
const DESC_K = [L1, L2_K, L3].join('\n');
const DESC_HTML_Q = [L1, L2_Q, L3].map((p) => `<p>${p}</p>`).join('');
const DESC_HTML_K = [L1, L2_K, L3].map((p) => `<p>${p}</p>`).join('');

function productEntry(asin, title, handle, desc, descHtml, price) {
  return {
    id: `makimoo-${asin}`,
    asin,
    title,
    handle,
    description: desc,
    descriptionHtml: descHtml,
    productType: 'Bedding',
    tags: ['Bedding'],
    availableForSale: false,
    images: [1, 2, 3, 4, 5, 6, 7].map((n) => ({
      url: `/images/products/${asin}/${n}.webp`,
      altText: title,
      width: 1344,
      height: 1792,
    })),
    priceRange: { minVariantPrice: { amount: price, currencyCode: 'USD' } },
    variants: [
      {
        id: `variant-${asin}`,
        title: 'Default Title',
        price: { amount: price, currencyCode: 'USD' },
        availableForSale: false,
        selectedOptions: [],
      },
    ],
    amazonUrl: '',
  };
}

const ENTRY_Q = productEntry('MK-SKROSE4-IVORY-QUEEN', TITLE_Q, HANDLE_Q, DESC_Q, DESC_HTML_Q, '89.99');
const ENTRY_K = productEntry('MK-SKROSE4-IVORY-KING', TITLE_K, HANDLE_K, DESC_K, DESC_HTML_K, '99.99');
const BLOCK = [ENTRY_Q, ENTRY_K].map((e) => JSON.stringify(e, null, 4)).join(',\n');

// ── 1. products-materials.ts：插在 makimoo-MK-BTFLY4-MOCHA-QUEEN 块之前 ──────
editFile('src/data/products-materials.ts', [
  ['{\n    "id": "makimoo-MK-BTFLY4-MOCHA-QUEEN",', `${BLOCK},\n{\n    "id": "makimoo-MK-BTFLY4-MOCHA-QUEEN",`],
]);

// ── 2. materials-map.ts：插在 mk-btfly4-mocha-queen 行之后 ─────────────────
const imgs = (asin) => [1, 2, 3, 4, 5, 6, 7].map((n) => `"/images/products/${asin}/${n}.webp"`).join(',');
const BULLETS_Q = [L1, L2_Q, L3].join('\\n\\n');
const BULLETS_K = [L1, L2_K, L3].join('\\n\\n');
editFile('src/data/materials-map.ts', [
  [
    '"sku":"991242341545-c1","images":["/images/products/MK-BTFLY4-MOCHA-QUEEN/1.webp"],"whiteBg":[false]},',
    `"sku":"991242341545-c1","images":["/images/products/MK-BTFLY4-MOCHA-QUEEN/1.webp"],"whiteBg":[false]},\n  "mk-skrose4-ivory-queen": {"title":"${TITLE_Q}","bullets":"${BULLETS_Q}","sku":"mk-skrose4-ivory-queen","images":[${imgs('MK-SKROSE4-IVORY-QUEEN')}],"whiteBg":[false,false,false,false,false,false,false]},\n  "mk-skrose4-ivory-king": {"title":"${TITLE_K}","bullets":"${BULLETS_K}","sku":"mk-skrose4-ivory-king","images":[${imgs('MK-SKROSE4-IVORY-KING')}],"whiteBg":[false,false,false,false,false,false,false]},`,
  ],
]);

// ── 3. materials-short-bullets.ts：插在 mk-btfly4-mocha-queen 块之后 ───────
const SHORT_Q = [
  'Linen Feel Polyester: softly textured weave, relaxed linen look',
  'Charcoal sketch-style rose print on ivory, solid olive green reverse',
  '4-Piece Queen Set: duvet cover 88 x 88 in, fitted sheet 60 x 80 in, 2 pillowcases 20 x 30 in',
  'Hidden zipper & corner ties keep your comforter in place',
  'Easy Care: machine washable, gets softer with every wash',
];
const SHORT_K = [
  'Linen Feel Polyester: softly textured weave, relaxed linen look',
  'Charcoal sketch-style rose print on ivory, solid olive green reverse',
  '4-Piece King Set: duvet cover 104 x 90 in, fitted sheet 78 x 80 in, 2 pillowcases 20 x 36 in',
  'Hidden zipper & corner ties keep your comforter in place',
  'Easy Care: machine washable, gets softer with every wash',
];
const bulletBlock = (key, arr) => `  "${key}": [\n${arr.map((b) => `    "${b}",`).join('\n')}\n  ],\n`;
editFile('src/data/materials-short-bullets.ts', [
  [
    '  ],\n  "sheetset-sand-queen": [',
    `  ],\n${bulletBlock('mk-skrose4-ivory-queen', SHORT_Q)}${bulletBlock('mk-skrose4-ivory-king', SHORT_K)}  "sheetset-sand-queen": [`,
  ],
]);

// ── 4. short-titles.ts（≤10 词）─────────────────────────────────────────────
editFile('src/data/short-titles.ts', [
  [
    '"mk-btfly4-mocha-queen": "Linen Feel Butterfly Bedding Set, 4 Piece, Mocha, Queen",',
    '"mk-btfly4-mocha-queen": "Linen Feel Butterfly Bedding Set, 4 Piece, Mocha, Queen",\n  "mk-skrose4-ivory-queen": "Linen Feel Sketch Rose Bedding Set, 4 Piece, Ivory, Queen",\n  "mk-skrose4-ivory-king": "Linen Feel Sketch Rose Bedding Set, 4 Piece, Ivory, King",',
  ],
]);

// ── 5. specs-overrides.ts（four 口径：取被套尺寸 220x220 / 260x220）─────────
editFile('src/data/specs-overrides.ts', [
  [
    '"mk-btfly4-mocha-queen": { material: "Linen-Like", dimensionsCm: [220, 220] },',
    '"mk-btfly4-mocha-queen": { material: "Linen-Like", dimensionsCm: [220, 220] },\n  "mk-skrose4-ivory-queen": { material: "Linen-Like", dimensionsCm: [220, 220] },\n  "mk-skrose4-ivory-king": { material: "Linen-Like", dimensionsCm: [260, 220] },',
  ],
]);

// ── 6. new-product-handles.ts（PDP v2 白名单）──────────────────────────────
editFile('src/data/new-product-handles.ts', [
  [
    "'makimoo-queen-sheet-set-4-piece-cotton-percale-check-jacquard-sand-queen',  // 2026-10-27：Cotton Percale 细格提花 Sheet Set（床笠+平床单+2枕套，Sand，仅 Queen，无变体；sheetset 类型首款）",
    "'makimoo-queen-sheet-set-4-piece-cotton-percale-check-jacquard-sand-queen',  // 2026-10-27：Cotton Percale 细格提花 Sheet Set（床笠+平床单+2枕套，Sand，仅 Queen，无变体；sheetset 类型首款）\n  'makimoo-queen-bedding-set-4-piece-linen-feel-sketch-rose-ivory-queen-mk-skrose4-ivory-queen',  // 2026-11-27：Linen Feel 素描玫瑰四件套（Sketch Rose，米白底+橄榄绿 B 面，Queen/King 尺寸组，预售首发）\n  'makimoo-king-bedding-set-4-piece-linen-feel-sketch-rose-ivory-king-mk-skrose4-ivory-king',",
  ],
]);

// ── 7. product-weights.ts ───────────────────────────────────────────────────
editFile('src/data/product-weights.ts', [
  [
    '"mk-btfly4-mocha-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},',
    '"mk-btfly4-mocha-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},\n  "mk-skrose4-ivory-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},\n  "mk-skrose4-ivory-king": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},',
  ],
]);

// ── 8. image-aspect-overrides.ts（PDP 主图区 3:4）──────────────────────────
editFile('src/data/image-aspect-overrides.ts', [
  [
    "'mk-btfly4-mocha-queen': '3/4',",
    "'mk-btfly4-mocha-queen': '3/4',\n  'mk-skrose4-ivory-queen': '3/4',\n  'mk-skrose4-ivory-king': '3/4',",
  ],
]);

// ── 9. variant-groups.ts：MK-SKROSE4 尺寸组（Queen/King 互链）──────────────
const GROUP = `  {
    // 2026-11-27：Linen Feel 素描玫瑰四件套（Sketch Rose 单色 × Queen/King，预售首发）
    id: 'MK-SKROSE4',
    optionName: 'Size',
    members: [
    { asin: 'MK-SKROSE4-IVORY-QUEEN', handle: '${HANDLE_Q}', color: 'Sketch Rose', size: '220 x 220 cm' },
    { asin: 'MK-SKROSE4-IVORY-KING', handle: '${HANDLE_K}', color: 'Sketch Rose', size: '260 x 220 cm' },
    ],
  },
`;
editFile('src/data/variant-groups.ts', [
  [
    "  {\n    // mk-btfly4 Sheet Set（颜色×尺寸，2026-11-01 规划 SKU 占位组）\n    id: 'MK-BTFLY4-SHEETSET',",
    `${GROUP}  {\n    // mk-btfly4 Sheet Set（颜色×尺寸，2026-11-01 规划 SKU 占位组）\n    id: 'MK-BTFLY4-SHEETSET',`,
  ],
]);

// ── 10. bedding-families.ts：SKROSE4 色名 + classifySet 前缀 ───────────────
editFile('src/data/bedding-families.ts', [
  [
    "  // 2026-10-26：Linen Feel 蝴蝶印花单品（mk-btfly4 前缀，family key 第二段）\n  BTFLY4: 'Mocha Butterfly',",
    "  // 2026-10-26：Linen Feel 蝴蝶印花单品（mk-btfly4 前缀，family key 第二段）\n  BTFLY4: 'Mocha Butterfly',\n  // 2026-11-27：Linen Feel 素描玫瑰四件套（mk-skrose4 前缀，family key 第二段）\n  SKROSE4: 'Sketch Rose',",
  ],
  [
    "  // 2026-10-26 用户定：Linen Feel 蝴蝶印花四件套单品（单色 × 仅 Queen，无变体组），归 four\n  if (a.startsWith('mk-btfly4-')) return 'four';",
    "  // 2026-10-26 用户定：Linen Feel 蝴蝶印花四件套单品（单色 × 仅 Queen，无变体组），归 four\n  if (a.startsWith('mk-btfly4-')) return 'four';\n  // 2026-11-27 用户定：Linen Feel 素描玫瑰印花四件套（单色 × Queen/King），归 four\n  if (a.startsWith('mk-skrose4-')) return 'four';",
  ],
]);

// ── 11. product-tags.ts：COLOR_OVERRIDES（标题无内置色词，主色米白归 Cream）─
editFile('src/data/product-tags.ts', [
  [
    "  '1052742241013-c9': 'blue',\n};",
    "  '1052742241013-c9': 'blue',\n  // 2026-11-27 Sketch Rose 素描玫瑰四件套（标题无内置色词，主色米白归 Cream）\n  'mk-skrose4-ivory-queen': 'cream',\n  'mk-skrose4-ivory-king': 'cream',\n};",
  ],
]);

console.log(totalFail === 0 ? 'ALL OK' : `FAILURES: ${totalFail}`);
process.exit(totalFail === 0 ? 0 : 1);
