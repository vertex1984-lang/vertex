// 2026-11-27 三款四件套建档（一次性脚本，跑完可删），流程同 _add-skrose4-data.js：
//   产品2 Scarlet Toile（Linen Feel，酒红茹伊印花+金蝴蝶，灰褐底/深 taupe B 面，7 图，主图指定 3239）
//   产品3 Champagne Cream（Cotton Feel，纯色香槟奶油，1 图）
//   产品4 Cherry Bloom（Cotton Percale，奶油底红樱桃印花/白 B 面，1 图）
// 均 Queen $89.99 / King $99.99，无 Shopify（本地价），预售另行追加 admin-preorder.json。
// 触点与 Sketch Rose 相同 11 处（product-tags.json 与 admin-preorder.json 手工维护，不在本脚本）。
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

if (fs.readFileSync(path.join(ROOT, 'src/data/products-materials.ts'), 'utf8').includes('MK-TOILE4-SCARLET-QUEEN')) {
  console.log('already inserted, skip');
  process.exit(0);
}

const L2_Q = 'Complete Queen 4-piece set: duvet cover (88 x 88 in), fitted sheet (60 x 80 in), and 2 pillowcases (20 x 30 in).';
const L2_K = 'Complete King 4-piece set: duvet cover (104 x 90 in), fitted sheet (78 x 80 in), and 2 pillowcases (20 x 36 in).';
const L3 = 'Machine washable and softens with every wash.';

const PRODUCTS = [
  {
    prefix: 'toile4', groupId: 'TOILE4', label: 'Scarlet Toile', colorTag: 'red',
    materialAtom: 'Linen-Like', materialWords: 'linen-feel',
    titleFrag: 'Linen Feel Scarlet Toile Print',
    l1: 'A scarlet toile floral with delicate golden butterfly accents drifts across a warm greige linen-feel ground, reversing to a solid deep taupe.',
    shortTitle: 'Linen Feel Scarlet Toile Bedding Set, 4 Piece, Scarlet',
    bullets: [
      'Linen Feel Polyester: softly textured weave, relaxed linen look',
      'Scarlet toile floral with golden butterflies on greige, solid deep taupe reverse',
    ],
  },
  {
    prefix: 'champ4', groupId: 'CHAMP4', label: 'Champagne Cream', colorTag: 'cream',
    materialAtom: 'Washed Cotton-Like', materialWords: 'cotton-feel',
    titleFrag: 'Cotton Feel Solid',
    l1: 'A solid champagne cream in a soft, garment-washed cotton-feel weave—quietly warm, smooth against the skin, and easy to layer.',
    shortTitle: 'Cotton Feel Solid Bedding Set, 4 Piece, Champagne',
    bullets: [
      'Cotton Feel Polyester: garment-washed for a broken-in softness from the first night',
      'Solid Champagne Cream: quietly warm, easy to mix and layer',
    ],
  },
  {
    prefix: 'cherry4', groupId: 'CHERRY4', label: 'Cherry Bloom', colorTag: 'cream',
    materialAtom: 'Cotton Percale', materialWords: 'cotton-percale',
    titleFrag: 'Cotton Percale Cherry Print',
    l1: 'A delicate cherry print scatters across a crisp cotton percale ground in soft cream, reversing to a clean solid white.',
    shortTitle: 'Cotton Percale Cherry Bedding Set, 4 Piece, Cream',
    bullets: [
      '100% Cotton Percale: crisp, tightly woven plain weave, cool & breathable',
      'Delicate cherry print on soft cream, clean solid white reverse',
    ],
  },
];

// 每款的颜色段（ASIN 第三段 / handle 尾部）：toile4→scarlet、champ4→cream、cherry4→bloom
const COLOR_SEG = { toile4: 'scarlet', champ4: 'cream', cherry4: 'bloom' };
const NAME_WORDS = { toile4: 'scarlet-toile', champ4: 'champagne-cream', cherry4: 'cherry-bloom' };
const IMG_COUNT = { toile4: 7, champ4: 1, cherry4: 1 };

const entries = [];
for (const p of PRODUCTS) {
  for (const size of ['queen', 'king']) {
    const SIZE = size.toUpperCase();
    const asin = `MK-${p.groupId}-${COLOR_SEG[p.prefix].toUpperCase()}-${SIZE}`;
    const sizeWord = size === 'queen' ? 'Queen' : 'King';
    const dims = size === 'queen' ? '88 x 88' : '104 x 90';
    const title = `Makimoo ${sizeWord} Bedding Set 4 Piece ${p.titleFrag} Duvet Cover Fitted Sheet 2 Pillowcases ${dims} in (${p.label})`;
    const handle = `makimoo-${size}-bedding-set-4-piece-${p.materialWords}-${NAME_WORDS[p.prefix]}-${size}-mk-${p.prefix}-${COLOR_SEG[p.prefix]}-${size}`;
    const l2 = size === 'queen' ? L2_Q : L2_K;
    const price = size === 'queen' ? '89.99' : '99.99';
    const imgs = Array.from({ length: IMG_COUNT[p.prefix] }, (_, i) => i + 1);
    entries.push({
      p, size, sizeWord, asin, title, handle, price,
      sku: asin.toLowerCase(),
      desc: [p.l1, l2, L3].join('\n'),
      descHtml: [p.l1, l2, L3].map((x) => `<p>${x}</p>`).join(''),
      bulletsStr: [p.l1, l2, L3].join('\\n\\n'),
      imgs,
      pieceLine: size === 'queen'
        ? '4-Piece Queen Set: duvet cover 88 x 88 in, fitted sheet 60 x 80 in, 2 pillowcases 20 x 30 in'
        : '4-Piece King Set: duvet cover 104 x 90 in, fitted sheet 78 x 80 in, 2 pillowcases 20 x 36 in',
      dimsCm: size === 'queen' ? [220, 220] : [260, 220],
      sizeCm: size === 'queen' ? '220 x 220 cm' : '260 x 220 cm',
    });
  }
}

// ── 1. products-materials.ts：插在 makimoo-MK-BTFLY4-MOCHA-QUEEN 块之前 ──────
const BLOCK = entries
  .map((e) =>
    JSON.stringify(
      {
        id: `makimoo-${e.asin}`,
        asin: e.asin,
        title: e.title,
        handle: e.handle,
        description: e.desc,
        descriptionHtml: e.descHtml,
        productType: 'Bedding',
        tags: ['Bedding'],
        availableForSale: false,
        images: e.imgs.map((n) => ({
          url: `/images/products/${e.asin}/${n}.webp`,
          altText: e.title,
          width: 1344,
          height: 1792,
        })),
        priceRange: { minVariantPrice: { amount: e.price, currencyCode: 'USD' } },
        variants: [
          {
            id: `variant-${e.asin}`,
            title: 'Default Title',
            price: { amount: e.price, currencyCode: 'USD' },
            availableForSale: false,
            selectedOptions: [],
          },
        ],
        amazonUrl: '',
      },
      null,
      4
    )
  )
  .join(',\n');
editFile('src/data/products-materials.ts', [
  ['{\n    "id": "makimoo-MK-BTFLY4-MOCHA-QUEEN",', `${BLOCK},\n{\n    "id": "makimoo-MK-BTFLY4-MOCHA-QUEEN",`],
]);

// ── 2. materials-map.ts：插在 sheetset-sand-queen 行之前 ────────────────────
const mapLines = entries
  .map((e) => {
    const imgs = e.imgs.map((n) => `"/images/products/${e.asin}/${n}.webp"`).join(',');
    const wb = e.imgs.map(() => 'false').join(',');
    return `  "${e.sku}": {"title":"${e.title}","bullets":"${e.bulletsStr}","sku":"${e.sku}","images":[${imgs}],"whiteBg":[${wb}]},`;
  })
  .join('\n');
editFile('src/data/materials-map.ts', [
  [
    '  "sheetset-sand-queen": {"title":"Makimoo Queen Sheet Set 4 Piece Soft Washed',
    `${mapLines}\n  "sheetset-sand-queen": {"title":"Makimoo Queen Sheet Set 4 Piece Soft Washed`,
  ],
]);

// ── 3. materials-short-bullets.ts：插在 sheetset-sand-queen 块之前 ──────────
const bulletBlocks = entries
  .map((e) => {
    const arr = [...e.p.bullets, e.pieceLine, 'Hidden zipper & corner ties keep your comforter in place', 'Easy Care: machine washable, gets softer with every wash'];
    return `  "${e.sku}": [\n${arr.map((b) => `    "${b}",`).join('\n')}\n  ],`;
  })
  .join('\n');
editFile('src/data/materials-short-bullets.ts', [
  ['  "sheetset-sand-queen": [', `${bulletBlocks}\n  "sheetset-sand-queen": [`],
]);

// ── 4. short-titles.ts ──────────────────────────────────────────────────────
const stLinesFixed = entries.map(
  (e) => `  "${e.sku}": "${e.p.shortTitle}, ${e.sizeWord}",`
);
editFile('src/data/short-titles.ts', [
  [
    '"mk-skrose4-ivory-king": "Linen Feel Sketch Rose Bedding Set, 4 Piece, Ivory, King",',
    `"mk-skrose4-ivory-king": "Linen Feel Sketch Rose Bedding Set, 4 Piece, Ivory, King",\n${stLinesFixed.join('\n')}`,
  ],
]);

// ── 5. specs-overrides.ts ───────────────────────────────────────────────────
const specLines = entries.map(
  (e) => `  "${e.sku}": { material: "${e.p.materialAtom}", dimensionsCm: [${e.dimsCm.join(', ')}] },`
);
editFile('src/data/specs-overrides.ts', [
  [
    '"mk-skrose4-ivory-king": { material: "Linen-Like", dimensionsCm: [260, 220] },',
    `"mk-skrose4-ivory-king": { material: "Linen-Like", dimensionsCm: [260, 220] },\n${specLines.join('\n')}`,
  ],
]);

// ── 6. new-product-handles.ts ───────────────────────────────────────────────
const handleLines = entries.map((e, i) => {
  const cmt =
    i === 0
      ? '  // 2026-11-27：三款四件套（Scarlet Toile 茹伊印花 Linen Feel / Champagne Cream 纯色 Cotton Feel / Cherry Bloom 樱桃 Cotton Percale，各 Queen/King，预售首发）'
      : '';
  return `  '${e.handle}',${cmt}`;
});
editFile('src/data/new-product-handles.ts', [
  [
    "'makimoo-king-bedding-set-4-piece-linen-feel-sketch-rose-ivory-king-mk-skrose4-ivory-king',",
    `'makimoo-king-bedding-set-4-piece-linen-feel-sketch-rose-ivory-king-mk-skrose4-ivory-king',\n${handleLines.join('\n')}`,
  ],
]);

// ── 7. product-weights.ts（生成文件，预置值会被 build-weights 重算，占位对齐既有新品）─
const weightLines = entries.map(
  (e) => `  "${e.sku}": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},`
);
editFile('src/data/product-weights.ts', [
  [
    '"mk-skrose4-ivory-king": {"type":"Bedding","score":6,"perf":6,"boost":0},',
    `"mk-skrose4-ivory-king": {"type":"Bedding","score":6,"perf":6,"boost":0},\n${weightLines.join('\n')}`,
  ],
]);

// ── 8. image-aspect-overrides.ts ────────────────────────────────────────────
const aspectLines = entries.map((e) => `  '${e.sku}': '3/4',`);
editFile('src/data/image-aspect-overrides.ts', [
  [
    "'mk-skrose4-ivory-king': '3/4',",
    `'mk-skrose4-ivory-king': '3/4',\n${aspectLines.join('\n')}`,
  ],
]);

// ── 9. variant-groups.ts：三个尺寸组 ────────────────────────────────────────
const groups = PRODUCTS.map((p) => {
  const q = entries.find((e) => e.p === p && e.size === 'queen');
  const k = entries.find((e) => e.p === p && e.size === 'king');
  return `  {
    // 2026-11-27：${p.label} 四件套（单色 × Queen/King，预售首发）
    id: '${p.groupId}',
    optionName: 'Size',
    members: [
    { asin: '${q.asin}', handle: '${q.handle}', color: '${p.label}', size: '220 x 220 cm' },
    { asin: '${k.asin}', handle: '${k.handle}', color: '${p.label}', size: '260 x 220 cm' },
    ],
  },
`;
}).join('');
editFile('src/data/variant-groups.ts', [
  [
    "  {\n    // mk-btfly4 Sheet Set（颜色×尺寸，2026-11-01 规划 SKU 占位组）\n    id: 'MK-BTFLY4-SHEETSET',",
    `${groups}  {\n    // mk-btfly4 Sheet Set（颜色×尺寸，2026-11-01 规划 SKU 占位组）\n    id: 'MK-BTFLY4-SHEETSET',`,
  ],
]);

// ── 10. bedding-families.ts：色名 + classifySet 前缀 ────────────────────────
const labelLines = PRODUCTS.map(
  (p) => `  // 2026-11-27：${p.label} 四件套（mk-${p.prefix} 前缀，family key 第二段）\n  ${p.groupId}: '${p.label}',`
).join('\n');
const classifyLines = PRODUCTS.map(
  (p) => `  if (a.startsWith('mk-${p.prefix}-')) return 'four'; // 2026-11-27：${p.label}`
).join('\n');
editFile('src/data/bedding-families.ts', [
  [
    "  // 2026-11-27：Linen Feel 素描玫瑰四件套（mk-skrose4 前缀，family key 第二段）\n  SKROSE4: 'Sketch Rose',",
    `  // 2026-11-27：Linen Feel 素描玫瑰四件套（mk-skrose4 前缀，family key 第二段）\n  SKROSE4: 'Sketch Rose',\n${labelLines}`,
  ],
  [
    "  // 2026-11-27 用户定：Linen Feel 素描玫瑰印花四件套（单色 × Queen/King），归 four\n  if (a.startsWith('mk-skrose4-')) return 'four';",
    `  // 2026-11-27 用户定：Linen Feel 素描玫瑰印花四件套（单色 × Queen/King），归 four\n  if (a.startsWith('mk-skrose4-')) return 'four';\n${classifyLines}`,
  ],
]);

// ── 11. product-tags.ts：COLOR_OVERRIDES ────────────────────────────────────
const coLines = entries.map((e) => `  '${e.sku}': '${e.p.colorTag}',`);
editFile('src/data/product-tags.ts', [
  [
    "  'mk-skrose4-ivory-queen': 'cream',\n  'mk-skrose4-ivory-king': 'cream',\n};",
    `  'mk-skrose4-ivory-queen': 'cream',\n  'mk-skrose4-ivory-king': 'cream',\n  // 2026-11-27 三款四件套（标题色词不足，看图定主色：toile4 酒红印花归 Red，另两款奶油底归 Cream）\n${coLines.join('\n')}\n};`,
  ],
]);

console.log(totalFail === 0 ? 'ALL OK' : `FAILURES: ${totalFail}`);
process.exit(totalFail === 0 ? 0 : 1);
