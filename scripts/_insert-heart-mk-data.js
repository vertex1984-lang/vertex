// 一次性：Linen Feel 爱心四件套单品（MK-HEART4-TAN-QUEEN，Tan Heart）数据插入
// 单品无变体：不动 variant-groups.ts / group-cards.ts。
// 触点：products-materials / materials-map / materials-short-bullets / short-titles /
//       specs-overrides / new-product-handles / product-weights / image-aspect-overrides /
//       bedding-families（classifySet 新前缀规则 + COLOR_LABELS 色段条目）
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const P2 = 'Breathable & Skin-Friendly All Season: The washed plain weave feels soft, airy and gentle against the skin, keeping you comfortable through warm summers and layered cozy in cooler months.';
const P3 = 'Complete Queen 4-Piece Set: This bedding set includes 1 duvet cover (88 x 88 in), 1 fitted sheet (60 x 80 in) with all-around elastic for a secure fit, and 2 pillowcases (20 x 30 in), giving you everything you need for a coordinated, polished bed.';
const P4 = 'Thoughtful Details & Easy Care: A hidden zipper closure and interior corner ties keep your comforter neatly in place; the set is machine washable and gets even softer with every wash.';

const V = {
  key: 'mk-heart4-tan-queen', asinU: 'MK-HEART4-TAN-QUEEN',
  handle: 'makimoo-queen-bedding-set-4-piece-linen-feel-heart-tan-queen-mk-heart4-tan-queen',
  title: 'Makimoo Queen Bedding Set 4 Piece Linen Feel Heart Print Duvet Cover Fitted Sheet 2 Pillowcases 88 x 88 in (Tan Heart)',
  p1: 'Linen Feel Polyester with Sweet Heart Print: Woven from softly textured polyester with the relaxed, breathable look of linen, the duvet cover and pillowcases feature a scattering of dark brown hearts on a warm tan ground. Reversible AB design—the A side shows the heart print, while the B side is a clean solid ivory.',
  p5: 'Warm Tan Heart Colorway: Deep brown hearts scattered over a warm tan base—sweet without being saccharine, it brings a cozy, cottage-soft warmth to the bedroom, pairing easily with natural wood, rattan, or neutral décor.',
  sb1: 'Linen Feel Polyester: softly textured weave, relaxed linen look',
  sb2: 'Dark brown heart print on warm tan, solid ivory reverse',
};

const bulletsOf = () => [V.p1, P2, P3, P4, V.p5];
const shortBulletsOf = () => [
  V.sb1,
  V.sb2,
  '4-Piece Queen Set: duvet cover 88 x 88 in, fitted sheet 60 x 80 in, 2 pillowcases 20 x 30 in',
  'Hidden zipper & corner ties keep your comforter in place',
  'Easy Care: machine washable, gets softer with every wash',
];

// ---------- 工具 ----------
function readText(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }
function writeText(rel, s) { fs.writeFileSync(path.join(ROOT, rel), s); }
function dominantNl(s) {
  const crlf = (s.match(/\r\n/g) || []).length;
  const lfOnly = (s.match(/(?<!\r)\n/g) || []).length;
  return crlf >= lfOnly ? '\r\n' : '\n';
}
/** 在 rel 文件中第一个 needle 出现处的行首插入 insertText（自带换行结尾） */
function insertBeforeFirstNeedleLine(rel, needle, insertText) {
  const s = readText(rel);
  const idx = s.indexOf(needle);
  if (idx < 0) throw new Error(`${rel}: 锚点 ${needle} 未找到`);
  const lineStart = s.lastIndexOf('\n', idx) + 1;
  writeText(rel, s.slice(0, lineStart) + insertText + s.slice(lineStart));
  console.log(`${rel}: inserted (${insertText.length} chars)`);
}
const esc = (t) => t.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

// ---------- 0. 全局去重检查 ----------
{
  const probe = readText('src/data/products-materials.ts');
  if (probe.includes('MK-HEART4-TAN-QUEEN')) throw new Error('products-materials 已含本品，疑似重复运行，中止');
  const probe2 = readText('src/data/bedding-families.ts');
  if (probe2.includes('mk-heart4-')) throw new Error('bedding-families 已含 mk-heart4 规则，疑似重复运行，中止');
}

// ---------- 1. products-materials.ts（插在 muslin C1 之前，与其他新品聚集） ----------
{
  const rel = 'src/data/products-materials.ts';
  const s = readText(rel);
  const nl = dominantNl(s);
  const idIdx = s.indexOf('"id": "makimoo-1025015219200-C1"');
  if (idIdx < 0) throw new Error('products-materials: muslin C1 锚点未找到');
  const idLineStart = s.lastIndexOf('\n', idIdx) + 1;
  const braceLineStart = s.lastIndexOf('\n', idLineStart - 2) + 1;
  if (s[braceLineStart] !== '{') throw new Error('products-materials: 锚点上一行不是 {');
  const paras = bulletsOf();
  const desc = paras.join(' ');
  const html = '<p>' + paras.join('</p><p>') + '</p>';
  const lines = [
    '{',
    `    "id": "makimoo-${V.asinU}",`,
    `    "asin": "${V.asinU}",`,
    `    "title": "${esc(V.title)}",`,
    `    "handle": "${V.handle}",`,
    `    "description": "${esc(desc)}",`,
    `    "descriptionHtml": "${esc(html)}",`,
    `    "productType": "Bedding",`,
    `    "tags": [`,
    `        "Bedding"`,
    `    ],`,
    `    "availableForSale": false,`,
    `    "images": [`,
    `        {`,
    `            "url": "/images/products/${V.asinU}/1.webp",`,
    `            "altText": "${esc(V.title)}",`,
    `            "width": 1440,`,
    `            "height": 1920`,
    `        }`,
    `    ],`,
    `    "priceRange": {`,
    `        "minVariantPrice": {`,
    `            "amount": "0.00",`,
    `            "currencyCode": "USD"`,
    `        }`,
    `    },`,
    `    "variants": [`,
    `        {`,
    `            "id": "variant-${V.asinU}",`,
    `            "title": "Default Title",`,
    `            "price": {`,
    `                "amount": "0.00",`,
    `                "currencyCode": "USD"`,
    `            },`,
    `            "availableForSale": false,`,
    `            "selectedOptions": []`,
    `        }`,
    `    ],`,
    `    "amazonUrl": ""`,
    `},`,
  ];
  writeText(rel, s.slice(0, braceLineStart) + lines.join(nl) + nl + s.slice(braceLineStart));
  console.log(`${rel}: 1 record inserted`);
}

// ---------- 2. materials-map.ts ----------
{
  const rel = 'src/data/materials-map.ts';
  const nl = dominantNl(readText(rel));
  const bullets = bulletsOf().join('\\n\\n');
  const text = `  "${V.key}": {"title":"${esc(V.title)}","bullets":"${esc(bullets)}","sku":"${V.key}","images":["/images/products/${V.asinU}/1.webp"],"whiteBg":[false]},` + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 3. materials-short-bullets.ts ----------
{
  const rel = 'src/data/materials-short-bullets.ts';
  const nl = dominantNl(readText(rel));
  const items = shortBulletsOf().map((b) => `    "${esc(b)}",`).join(nl);
  const text = `  "${V.key}": [${nl}${items}${nl}  ],` + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 4. short-titles.ts ----------
{
  const rel = 'src/data/short-titles.ts';
  const nl = dominantNl(readText(rel));
  const text = `  "${V.key}": "Linen Feel Heart Bedding Set, 4 Piece, Tan, Queen",` + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 5. specs-overrides.ts ----------
{
  const rel = 'src/data/specs-overrides.ts';
  const nl = dominantNl(readText(rel));
  const text = `  "${V.key}": { material: "Linen-Like", dimensionsCm: [220, 220] },` + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 6. new-product-handles.ts ----------
{
  const rel = 'src/data/new-product-handles.ts';
  const nl = dominantNl(readText(rel));
  const text = `  '${V.handle}',  // 2026-10-26：Linen Feel 爱心四件套单品（Tan Heart，仅 Queen，无变体）` + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 7. product-weights.ts ----------
{
  const rel = 'src/data/product-weights.ts';
  const nl = dominantNl(readText(rel));
  const text = `  "${V.key}": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},` + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 8. image-aspect-overrides.ts ----------
{
  const rel = 'src/data/image-aspect-overrides.ts';
  const nl = dominantNl(readText(rel));
  const text = `  '${V.key}': '3/4',` + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 9. bedding-families.ts：classifySet 前缀规则 + COLOR_LABELS 条目 ----------
{
  const rel = 'src/data/bedding-families.ts';
  const s = readText(rel);
  const nl = dominantNl(s);
  // 9a. classifySet：mk-heart4- 前缀归 four（asin 尾段 -QUEEN 被 SET_SIZE_ORDER 识别，
  //     familyKeyOf 默认分支去尾段 → key 'MK-HEART4-TAN'；beddingUsSizeLabel 默认分支 → Queen，均无需特判）
  const anchorA = `  if (a.startsWith('1025015219200')) return 'four';`;
  if (!s.includes(anchorA)) throw new Error('bedding-families: classifySet 锚点未找到');
  const ruleA = anchorA + nl +
    `  // 2026-10-26 用户定：Linen Feel（仿麻聚酯）爱心四件套单品（单色 × 仅 Queen，无变体组），归 four` + nl +
    `  if (a.startsWith('mk-heart4-')) return 'four';`;
  let out = s.replace(anchorA, ruleA);
  // 9b. COLOR_LABELS：family key 'MK-HEART4-TAN' 的色段 HEART4 → 展示名 Tan Heart
  const anchorB = `  CHARCOAL: 'Charcoal Stripe',`;
  if ((out.match(/CHARCOAL: 'Charcoal Stripe',/g) || []).length !== 1)
    throw new Error('bedding-families: COLOR_LABELS 锚点不唯一或未找到');
  const ruleB = anchorB + nl +
    `  // 2026-10-26：Linen Feel 爱心四件套单色（mk-heart4 前缀，family key 第二段为 HEART4）` + nl +
    `  HEART4: 'Tan Heart',`;
  out = out.replace(anchorB, ruleB);
  writeText(rel, out);
  console.log(`${rel}: classifySet rule + COLOR_LABELS entry added`);
}

console.log('ALL DONE');
