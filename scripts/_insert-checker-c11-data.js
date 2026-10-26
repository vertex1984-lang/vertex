// 一次性：Cotton Feel 棋盘格四件套新色（1071466105053-C11，Black Checker）数据插入
// 关键差异：并入原格纹组 '1071466105053' 且成员插到 members[0]（组首），
// group-cards 白名单 preferredAsin/memberOrder 取 members[0]，卡面与色卡自动跟随。
// 触点：products-materials / materials-map / materials-short-bullets / short-titles /
//       specs-overrides / new-product-handles / product-weights / image-aspect-overrides /
//       variant-groups（members[0] 插入 + 组注释更新）、group-cards（两条过时注释更新）
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const P2 = 'Breathable & Skin-Friendly All Season: The washed plain weave feels soft, airy and gentle against the skin, keeping you comfortable through warm summers and layered cozy in cooler months.';
const P3 = 'Complete Queen 4-Piece Set: This bedding set includes 1 duvet cover (88 x 88 in), 1 fitted sheet (60 x 80 in) with all-around elastic for a secure fit, and 2 pillowcases (20 x 30 in), giving you everything you need for a coordinated, polished bed.';
const P4 = 'Thoughtful Details & Easy Care: A hidden zipper closure and interior corner ties keep your comforter neatly in place; the set is machine washable and gets even softer with every wash.';

const V = {
  key: 'c11', asinU: '1071466105053-C11',
  handle: 'makimoo-queen-bedding-set-4-piece-cotton-feel-checker-black-queen-1071466105053-c11',
  title: 'Makimoo Queen Bedding Set 4 Piece Cotton Feel Checkerboard Duvet Cover Fitted Sheet 2 Pillowcases 88 x 88 in (Black Checker)',
  groupColor: 'Black Checker',
  p1: 'Cotton-Feel Polyester with Bold Checkerboard: Woven from soft brushed polyester with the relaxed, garment-washed hand of cotton, the duvet cover and pillowcases feature a bold black and cream checkerboard. Reversible AB design—the A side shows the checkerboard, while the B side is a clean solid charcoal black.',
  p5: 'Bold Black Checker Colorway: A graphic black and cream checkerboard—statement-making yet timeless, it anchors the bedroom with a modern, editorial edge, pairing easily with wood tones, crisp whites, or minimalist décor.',
  sb2: 'Bold black & cream checkerboard, solid charcoal black reverse',
};

const bulletsOf = () => [V.p1, P2, P3, P4, V.p5];
const shortBulletsOf = () => [
  'Cotton-Feel Polyester: soft brushed hand, garment-washed feel',
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
  if (probe.includes('1071466105053-C11')) throw new Error('products-materials 已含 C11，疑似重复运行，中止');
  const probe2 = readText('src/data/variant-groups.ts');
  if (probe2.includes("1071466105053-c11")) throw new Error('variant-groups 已含 c11，疑似重复运行，中止');
}

// ---------- 1. products-materials.ts：紧跟 C3 之后（CHECK 组 C4 之前） ----------
{
  const rel = 'src/data/products-materials.ts';
  const s = readText(rel);
  const nl = dominantNl(s);
  const idIdx = s.indexOf('"id": "makimoo-1071466105053-C4"');
  if (idIdx < 0) throw new Error('products-materials: C4 锚点未找到');
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

// ---------- 2. materials-map.ts（插到 CHECK 组 c4 条目之前，与格纹三色相邻） ----------
{
  const rel = 'src/data/materials-map.ts';
  const nl = dominantNl(readText(rel));
  const bullets = bulletsOf().join('\\n\\n');
  const text = `  "1071466105053-${V.key}": {"title":"${esc(V.title)}","bullets":"${esc(bullets)}","sku":"1071466105053-${V.key}","images":["/images/products/${V.asinU}/1.webp"],"whiteBg":[false]},` + nl;
  insertBeforeFirstNeedleLine(rel, '1071466105053-c4', text);
}

// ---------- 3. materials-short-bullets.ts ----------
{
  const rel = 'src/data/materials-short-bullets.ts';
  const nl = dominantNl(readText(rel));
  const items = shortBulletsOf().map((b) => `    "${esc(b)}",`).join(nl);
  const text = `  "1071466105053-${V.key}": [${nl}${items}${nl}  ],` + nl;
  insertBeforeFirstNeedleLine(rel, '1071466105053-c4', text);
}

// ---------- 4. short-titles.ts ----------
{
  const rel = 'src/data/short-titles.ts';
  const nl = dominantNl(readText(rel));
  const text = `  "1071466105053-${V.key}": "Cotton Feel Checkerboard Bedding Set, 4 Piece, Black, Queen",` + nl;
  insertBeforeFirstNeedleLine(rel, '1071466105053-c4', text);
}

// ---------- 5. specs-overrides.ts ----------
{
  const rel = 'src/data/specs-overrides.ts';
  const nl = dominantNl(readText(rel));
  const text = `  "1071466105053-${V.key}": { material: "Washed Cotton-Like", dimensionsCm: [220, 220] },` + nl;
  insertBeforeFirstNeedleLine(rel, '1071466105053-c4', text);
}

// ---------- 6. new-product-handles.ts ----------
{
  const rel = 'src/data/new-product-handles.ts';
  const nl = dominantNl(readText(rel));
  const text = `  '${V.handle}',  // 2026-10-26：Cotton Feel 格纹组新色（Black Checker 棋盘格，仅 Queen，组首）` + nl;
  insertBeforeFirstNeedleLine(rel, '1071466105053-c4', text);
}

// ---------- 7. product-weights.ts ----------
{
  const rel = 'src/data/product-weights.ts';
  const nl = dominantNl(readText(rel));
  const text = `  "1071466105053-${V.key}": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},` + nl;
  insertBeforeFirstNeedleLine(rel, '1071466105053-c4', text);
}

// ---------- 8. image-aspect-overrides.ts ----------
{
  const rel = 'src/data/image-aspect-overrides.ts';
  const nl = dominantNl(readText(rel));
  const text = `  '1071466105053-${V.key}': '3/4',` + nl;
  insertBeforeFirstNeedleLine(rel, '1071466105053-c4', text);
}

// ---------- 9. variant-groups.ts：members[0] 插入 + 组注释更新 ----------
{
  const rel = 'src/data/variant-groups.ts';
  const s = readText(rel);
  const nl = dominantNl(s);
  // 9a. 组注释更新
  const oldComment = '// Cotton Feel（聚酯水洗棉手感）格纹四件套（3 色 × 仅 Queen，2026-10-26 用户定；同日由格纹旧 sku 迁移 1688 风格，Black 仍为组首）';
  const newComment = '// Cotton Feel（聚酯水洗棉手感）格纹四件套（4 色 × 仅 Queen，2026-10-26 用户定；同日由格纹旧 sku 迁移 1688 风格；2026-10-26 新增 Black Checker 棋盘格 C11 并设为组首）';
  if (!s.includes(oldComment)) throw new Error('variant-groups: 组注释锚点未找到');
  let out = s.replace(oldComment, newComment);
  // 9b. c1 成员行之前插入 c11（组 members[0]）
  const c1Line = `    { asin: '1071466105053-c1', handle: 'makimoo-queen-bedding-set-4-piece-cotton-feel-gingham-black-queen-1071466105053-c1', color: 'Black Gingham', size: '220 x 220 cm' },`;
  if (!out.includes(c1Line)) throw new Error('variant-groups: c1 成员行锚点未找到');
  const c11Line = `    { asin: '1071466105053-${V.key}', handle: '${V.handle}', color: '${V.groupColor}', size: '220 x 220 cm' },`;
  out = out.replace(c1Line, c11Line + nl + c1Line);
  writeText(rel, out);
  console.log(`${rel}: member inserted at [0] + comment updated`);
}

// ---------- 10. group-cards.ts：两条过时注释更新（逻辑不动） ----------
{
  const rel = 'src/lib/group-cards.ts';
  const s = readText(rel);
  const oldA = '1071466105053 格纹组同口径（组首 = Black Queen；同日迁移 1688 sku，组首不变）';
  const newA = '1071466105053 格纹组同口径（2026-10-26 起组首 = Black Checker C11，同日迁移 1688 sku）';
  const oldB = '1071466105053 格纹组同口径（色卡顺序 = 组内成员顺序 Black/Blue/Grey）';
  const newB = '1071466105053 格纹组同口径（色卡顺序 = 组内成员顺序 Black Checker/Black/Blue/Grey）';
  if (!s.includes(oldA) || !s.includes(oldB)) throw new Error('group-cards: 注释锚点未找到');
  writeText(rel, s.replace(oldA, newA).replace(oldB, newB));
  console.log(`${rel}: comments updated`);
}

console.log('ALL DONE');
