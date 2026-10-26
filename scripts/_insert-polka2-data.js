// 一次性：Cotton Feel 波点四件套新 2 色（1071466105053-C9/C10，组 1071466105053-POLKA）数据插入
// 触点：products-materials / materials-map / materials-short-bullets / short-titles /
//       specs-overrides / new-product-handles / product-weights / image-aspect-overrides / variant-groups
// 锚点策略：各文件第一个 '1025015219200' 出现处回退到行首，把新内容插在其前（即紧跟 check 五色之后）；
// variant-groups 追加到 VARIANT_GROUPS 数组收尾 '];' 之前。
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ---------- 每色文案 ----------
const P2 = 'Breathable & Skin-Friendly All Season: The washed plain weave feels soft, airy and gentle against the skin, keeping you comfortable through warm summers and layered cozy in cooler months.';
const P3 = 'Complete Queen 4-Piece Set: This bedding set includes 1 duvet cover (88 x 88 in), 1 fitted sheet (60 x 80 in) with all-around elastic for a secure fit, and 2 pillowcases (20 x 30 in), giving you everything you need for a coordinated, polished bed.';
const P4 = 'Thoughtful Details & Easy Care: A hidden zipper closure and interior corner ties keep your comforter neatly in place; the set is machine washable and gets even softer with every wash.';

const VARIANTS = [
  {
    key: 'c9', asinU: '1071466105053-C9',
    handle: 'makimoo-queen-bedding-set-4-piece-cotton-feel-polka-cream-queen-1071466105053-c9',
    title: 'Makimoo Queen Bedding Set 4 Piece Cotton Feel Polka Dot Duvet Cover Fitted Sheet 2 Pillowcases 88 x 88 in (Cream Polka)',
    groupColor: 'Cream Polka', shortColor: 'Cream',
    p1: 'Cotton-Feel Polyester with Playful Polka Dots: Woven from soft brushed polyester with the relaxed, garment-washed hand of cotton, the duvet cover and pillowcases feature a scattering of black polka dots on a warm cream ground. Reversible AB design—the A side shows the polka dot print, while the B side is a clean solid ivory.',
    p5: 'Warm Cream Polka Colorway: Inky black dots scattered over a warm cream base—playful yet calm, it brings a light, cheerful rhythm to the bedroom, pairing easily with wood tones, neutrals, or minimalist décor.',
    sb2: 'Black polka dots on warm cream, solid ivory reverse',
  },
  {
    key: 'c10', asinU: '1071466105053-C10',
    handle: 'makimoo-queen-bedding-set-4-piece-cotton-feel-polka-blue-queen-1071466105053-c10',
    title: 'Makimoo Queen Bedding Set 4 Piece Cotton Feel Polka Dot Duvet Cover Fitted Sheet 2 Pillowcases 88 x 88 in (Blue Polka)',
    groupColor: 'Blue Polka', shortColor: 'Blue',
    p1: 'Cotton-Feel Polyester with Playful Polka Dots: Woven from soft brushed polyester with the relaxed, garment-washed hand of cotton, the duvet cover and pillowcases feature a scattering of navy polka dots on a soft dusty blue ground. Reversible AB design—the A side shows the polka dot print, while the B side is a clean solid deep navy.',
    p5: 'Dusty Blue Polka Colorway: Deep navy dots scattered over a soft dusty blue base—fresh and breezy with a quiet coastal feel, it brings a calm, easy order to the bedroom, pairing easily with white, light wood, or modern décor.',
    sb2: 'Navy polka dots on dusty blue, solid deep navy reverse',
  },
];

const bulletsOf = (v) => [v.p1, P2, P3, P4, v.p5];
const shortBulletsOf = (v) => [
  'Cotton-Feel Polyester: soft brushed hand, garment-washed feel',
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
  if (probe.includes('1071466105053-C9')) throw new Error('products-materials 已含 C9，疑似重复运行，中止');
  const probe2 = readText('src/data/variant-groups.ts');
  if (probe2.includes('1071466105053-POLKA')) throw new Error('variant-groups 已含新组，疑似重复运行，中止');
}

// ---------- 1. products-materials.ts：2 条记录（C9→C10 顺序，组首 Cream 在最前） ----------
{
  const rel = 'src/data/products-materials.ts';
  const s = readText(rel);
  const nl = dominantNl(s);
  // 锚：muslin C1 记录的 '{' 行（id 行的上一行）
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
    return `  "1071466105053-${v.key}": {"title":"${esc(v.title)}","bullets":"${esc(bullets)}","sku":"1071466105053-${v.key}","images":["/images/products/${v.asinU}/1.webp"],"whiteBg":[false]},`;
  }).join(nl) + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 3. materials-short-bullets.ts ----------
{
  const rel = 'src/data/materials-short-bullets.ts';
  const nl = dominantNl(readText(rel));
  const text = VARIANTS.map((v) => {
    const items = shortBulletsOf(v).map((b) => `    "${esc(b)}",`).join(nl);
    return `  "1071466105053-${v.key}": [${nl}${items}${nl}  ],`;
  }).join(nl) + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 4. short-titles.ts ----------
{
  const rel = 'src/data/short-titles.ts';
  const nl = dominantNl(readText(rel));
  const text = VARIANTS.map((v) =>
    `  "1071466105053-${v.key}": "Cotton Feel Polka Dot Bedding Set, 4 Piece, ${v.shortColor}, Queen",`
  ).join(nl) + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 5. specs-overrides.ts ----------
{
  const rel = 'src/data/specs-overrides.ts';
  const nl = dominantNl(readText(rel));
  const text = VARIANTS.map((v) =>
    `  "1071466105053-${v.key}": { material: "Washed Cotton-Like", dimensionsCm: [220, 220] },`
  ).join(nl) + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 6. new-product-handles.ts ----------
{
  const rel = 'src/data/new-product-handles.ts';
  const nl = dominantNl(readText(rel));
  const text = VARIANTS.map((v) =>
    `  '${v.handle}',  // 2026-10-26：Cotton Feel 波点四件套新两色组（${v.groupColor}，仅 Queen）`
  ).join(nl) + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 7. product-weights.ts ----------
{
  const rel = 'src/data/product-weights.ts';
  const nl = dominantNl(readText(rel));
  const text = VARIANTS.map((v) =>
    `  "1071466105053-${v.key}": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},`
  ).join(nl) + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 8. image-aspect-overrides.ts ----------
{
  const rel = 'src/data/image-aspect-overrides.ts';
  const nl = dominantNl(readText(rel));
  const text = VARIANTS.map((v) => `  '1071466105053-${v.key}': '3/4',`).join(nl) + nl;
  insertBeforeFirstNeedleLine(rel, '1025015219200', text);
}

// ---------- 9. variant-groups.ts：新组 1071466105053-POLKA（Cream 组首） ----------
{
  const rel = 'src/data/variant-groups.ts';
  const s = readText(rel);
  const nl = dominantNl(s);
  const endIdx = s.lastIndexOf('];');
  if (endIdx < 0) throw new Error('variant-groups: 数组收尾 ]; 未找到');
  const members = VARIANTS.map((v) =>
    `    { asin: '1071466105053-${v.key}', handle: '${v.handle}', color: '${v.groupColor}', size: '220 x 220 cm' },`
  ).join(nl);
  const group = [
    `  {`,
    `    id: '1071466105053-POLKA',`,
    `    optionName: 'Color',`,
    `    // Cotton Feel（聚酯水洗棉手感）波点四件套第三变体组（2 色 × 仅 Queen，2026-10-26 用户定；独立组，Cream Polka 为组首）`,
    `    members: [`,
    members,
    `    ],`,
    `  },`,
  ].join(nl) + nl;
  writeText(rel, s.slice(0, endIdx) + group + s.slice(endIdx));
  console.log(`${rel}: group appended`);
}

console.log('ALL DONE');
