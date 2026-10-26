// 一次性：Linen Feel 四件套单品两款（MK-PRINT4-BLUE-QUEEN 蓝兔印花 / MK-FLORAL4-GREY-QUEEN 灰花卉）数据插入
// 单品无变体：不动 variant-groups.ts / group-cards.ts。
// 触点：products-materials / materials-map / materials-short-bullets / short-titles /
//       specs-overrides / new-product-handles / product-weights / image-aspect-overrides /
//       bedding-families（classifySet 两条前缀规则 + COLOR_LABELS 两个色段条目）
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const P2 = 'Breathable & Skin-Friendly All Season: The washed plain weave feels soft, airy and gentle against the skin, keeping you comfortable through warm summers and layered cozy in cooler months.';
const P3 = 'Complete Queen 4-Piece Set: This bedding set includes 1 duvet cover (88 x 88 in), 1 fitted sheet (60 x 80 in) with all-around elastic for a secure fit, and 2 pillowcases (20 x 30 in), giving you everything you need for a coordinated, polished bed.';
const P4 = 'Thoughtful Details & Easy Care: A hidden zipper closure and interior corner ties keep your comforter neatly in place; the set is machine washable and gets even softer with every wash.';

const VARIANTS = [
  {
    key: 'mk-print4-blue-queen', asinU: 'MK-PRINT4-BLUE-QUEEN',
    handle: 'makimoo-queen-bedding-set-4-piece-linen-feel-print-blue-queen-mk-print4-blue-queen',
    title: 'Makimoo Queen Bedding Set 4 Piece Linen Feel Rabbit Print Duvet Cover Fitted Sheet 2 Pillowcases 88 x 88 in (Blue Print)',
    shortTitle: 'Linen Feel Print Bedding Set, 4 Piece, Blue, Queen',
    p1: 'Linen Feel Polyester with Playful Rabbit Print: Woven from softly textured polyester with the relaxed, breathable look of linen, the duvet cover and pillowcases feature neat rows of playful rabbits in dusty blue on a cream ground. Reversible AB design—the A side shows the rabbit print, while the B side is a clean solid ivory.',
    p5: 'Dusty Blue Rabbit Colorway: Neat rows of dusty blue rabbits over a cream base—whimsical yet tidy, it brings a light, storybook charm to the bedroom, pairing easily with natural wood, crisp white, or kids-friendly neutral décor.',
    sb2: 'Dusty blue rabbit print on cream, solid ivory reverse',
    comment: 'Blue Print 蓝兔印花',
  },
  {
    key: 'mk-floral4-grey-queen', asinU: 'MK-FLORAL4-GREY-QUEEN',
    handle: 'makimoo-queen-bedding-set-4-piece-linen-feel-floral-grey-queen-mk-floral4-grey-queen',
    title: 'Makimoo Queen Bedding Set 4 Piece Linen Feel Floral Duvet Cover Fitted Sheet 2 Pillowcases 88 x 88 in (Grey Floral)',
    shortTitle: 'Linen Feel Floral Bedding Set, 4 Piece, Grey, Queen',
    p1: 'Linen Feel Polyester with Soft Floral Print: Woven from softly textured polyester with the relaxed, breathable look of linen, the duvet cover and pillowcases feature a trailing cream floral print on a heathered grey ground. Reversible AB design—the A side shows the floral print, while the B side is a clean solid light grey.',
    p5: 'Heather Grey Floral Colorway: Cream botanical sprigs trailing over a heathered grey base—soft and quietly romantic, it brings a calm, garden-fresh mood to the bedroom, pairing easily with white, natural wood, or modern neutral décor.',
    sb2: 'Cream floral print on heather grey, solid light grey reverse',
    comment: 'Grey Floral 灰花卉',
  },
];

const bulletsOf = (v) => [v.p1, P2, P3, P4, v.p5];
const shortBulletsOf = (v) => [
  'Linen Feel Polyester: softly textured weave, relaxed linen look',
  v.sb2,
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
  if (probe.includes('MK-PRINT4-BLUE-QUEEN') || probe.includes('MK-FLORAL4-GREY-QUEEN'))
    throw new Error('products-materials 已含新品，疑似重复运行，中止');
  const probe2 = readText('src/data/bedding-families.ts');
  if (probe2.includes('mk-print4-')) throw new Error('bedding-families 已含新规则，疑似重复运行，中止');
}

// ---------- 1. products-materials.ts（BLUE 在 GREY 前，插在 muslin C1 之前） ----------
{
  const rel = 'src/data/products-materials.ts';
  const s = readText(rel);
  const nl = dominantNl(s);
  const idIdx = s.indexOf('"id": "makimoo-1025015219200-C1"');
  if (idIdx < 0) throw new Error('products-materials: muslin C1 锚点未找到');
  const idLineStart = s.lastIndexOf('\n', idIdx) + 1;
  const braceLineStart = s.lastIndexOf('\n', idLineStart - 2) + 1;
  if (s[braceLineStart] !== '{') throw new Error('products-materials: 锚点上一行不是 {');
  const records = VARIANTS.map((v) => {
    const paras = bulletsOf(v);
    const desc = paras.join(' ');
    const html = '<p>' + paras.join('</p><p>') + '</p>';
    const lines = [
      '{',
      `    "id": "makimoo-${v.asinU}",`,
      `    "asin": "${v.asinU}",`,
      `    "title": "${esc(v.title)}",`,
      `    "handle": "${v.handle}",`,
      `    "description": "${esc(desc)}",`,
      `    "descriptionHtml": "${esc(html)}",`,
      `    "productType": "Bedding",`,
      `    "tags": [`,
      `        "Bedding"`,
      `    ],`,
      `    "availableForSale": false,`,
      `    "images": [`,
      `        {`,
      `            "url": "/images/products/${v.asinU}/1.webp",`,
      `            "altText": "${esc(v.title)}",`,
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
      `            "id": "variant-${v.asinU}",`,
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
    return lines.join(nl) + nl;
  }).join('');
  writeText(rel, s.slice(0, braceLineStart) + records + s.slice(braceLineStart));
  console.log(`${rel}: 2 records inserted`);
}

// ---------- 2. materials-map.ts ----------
{
  const rel = 'src/data/materials-map.ts';
  const nl = dominantNl(readText(rel));
  const text = VARIANTS.map((v) => {
    const bullets = bulletsOf(v).join('\\n\\n');
    return `  "${v.key}": {"title":"${esc(v.title)}","bullets":"${esc(bullets)}","sku":"${v.key}","images":["/images/products/${v.asinU}/1.webp"],"whiteBg":[false]},`;
  }).join(nl) + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 3. materials-short-bullets.ts ----------
{
  const rel = 'src/data/materials-short-bullets.ts';
  const nl = dominantNl(readText(rel));
  const text = VARIANTS.map((v) => {
    const items = shortBulletsOf(v).map((b) => `    "${esc(b)}",`).join(nl);
    return `  "${v.key}": [${nl}${items}${nl}  ],`;
  }).join(nl) + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 4. short-titles.ts ----------
{
  const rel = 'src/data/short-titles.ts';
  const nl = dominantNl(readText(rel));
  const text = VARIANTS.map((v) => `  "${v.key}": "${v.shortTitle}",`).join(nl) + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 5. specs-overrides.ts ----------
{
  const rel = 'src/data/specs-overrides.ts';
  const nl = dominantNl(readText(rel));
  const text = VARIANTS.map((v) =>
    `  "${v.key}": { material: "Linen-Like", dimensionsCm: [220, 220] },`
  ).join(nl) + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 6. new-product-handles.ts ----------
{
  const rel = 'src/data/new-product-handles.ts';
  const nl = dominantNl(readText(rel));
  const text = VARIANTS.map((v) =>
    `  '${v.handle}',  // 2026-10-26：Linen Feel 四件套单品（${v.comment}，仅 Queen，无变体）`
  ).join(nl) + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 7. product-weights.ts ----------
{
  const rel = 'src/data/product-weights.ts';
  const nl = dominantNl(readText(rel));
  const text = VARIANTS.map((v) =>
    `  "${v.key}": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},`
  ).join(nl) + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 8. image-aspect-overrides.ts ----------
{
  const rel = 'src/data/image-aspect-overrides.ts';
  const nl = dominantNl(readText(rel));
  const text = VARIANTS.map((v) => `  '${v.key}': '3/4',`).join(nl) + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 9. bedding-families.ts：classifySet 两条前缀规则 + COLOR_LABELS 两个条目 ----------
{
  const rel = 'src/data/bedding-families.ts';
  const s = readText(rel);
  const nl = dominantNl(s);
  // 9a. classifySet：mk-print4- / mk-floral4- 归 four（尾段 -QUEEN 被 SET_SIZE_ORDER 识别，
  //     familyKeyOf 默认分支去尾段；beddingUsSizeLabel 默认分支 → Queen，均无需特判）
  const anchorA = `  if (a.startsWith('mk-heart4-')) return 'four';`;
  if (!s.includes(anchorA)) throw new Error('bedding-families: classifySet 锚点未找到');
  const ruleA = anchorA + nl +
    `  // 2026-10-26 用户定：Linen Feel 蓝兔印花 / 灰花卉四件套单品（各单色 × 仅 Queen，无变体组），归 four` + nl +
    `  if (a.startsWith('mk-print4-')) return 'four';` + nl +
    `  if (a.startsWith('mk-floral4-')) return 'four';`;
  let out = s.replace(anchorA, ruleA);
  // 9b. COLOR_LABELS：family key 第二段 PRINT4 / FLORAL4 → 展示名
  const anchorB = `  HEART4: 'Tan Heart',`;
  if ((out.match(/HEART4: 'Tan Heart',/g) || []).length !== 1)
    throw new Error('bedding-families: COLOR_LABELS 锚点不唯一或未找到');
  const ruleB = anchorB + nl +
    `  // 2026-10-26：Linen Feel 印花/花卉单品（mk-print4 / mk-floral4 前缀，family key 第二段）` + nl +
    `  PRINT4: 'Blue Print',` + nl +
    `  FLORAL4: 'Grey Floral',`;
  out = out.replace(anchorB, ruleB);
  writeText(rel, out);
  console.log(`${rel}: classifySet rules + COLOR_LABELS entries added`);
}

console.log('ALL DONE');
