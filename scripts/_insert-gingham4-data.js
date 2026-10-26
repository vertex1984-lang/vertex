// 一次性脚本：GINGHAM4 三色四件套的配套数据（7 文件 × 3 色）+ classifySet 规则 + GINGHAM4 变体组
const fs = require('fs');

const COLORS = [
  { key: 'blue', ASIN: 'GINGHAM4-BLUE-QUEEN', a: 'gingham4-blue-queen', colorName: 'Blue Gingham', shortColor: 'Blue', solid: 'dusty blue', handle: 'makimoo-queen-bedding-set-4-piece-cotton-feel-gingham-blue-queen' },
  { key: 'black', ASIN: 'GINGHAM4-BLACK-QUEEN', a: 'gingham4-black-queen', colorName: 'Black Gingham', shortColor: 'Black', solid: 'charcoal black', handle: 'makimoo-queen-bedding-set-4-piece-cotton-feel-gingham-black-queen' },
  { key: 'grey', ASIN: 'GINGHAM4-GREY-QUEEN', a: 'gingham4-grey-queen', colorName: 'Grey Gingham', shortColor: 'Grey', solid: 'light grey', handle: 'makimoo-queen-bedding-set-4-piece-cotton-feel-gingham-grey-queen' },
];

const PARA = {
  blue: {
    p1: 'Cotton-Feel Polyester with Classic Gingham: Woven from soft brushed polyester with the relaxed, garment-washed hand of cotton, the duvet cover and pillowcases feature a timeless blue and white gingham check. Reversible AB design—the A side shows the gingham check, while the B side is a clean solid dusty blue.',
    p5: 'Fresh Blue Gingham Colorway: A classic blue and white check—crisp, cheerful and quietly nostalgic, it brings an easy cottage freshness to the bedroom, pairing easily with modern, classic, or cozy décor.',
  },
  black: {
    p1: 'Cotton-Feel Polyester with Classic Gingham: Woven from soft brushed polyester with the relaxed, garment-washed hand of cotton, the duvet cover and pillowcases feature a timeless black and white gingham check. Reversible AB design—the A side shows the gingham check, while the B side is a clean solid charcoal black.',
    p5: 'Bold Black Gingham Colorway: A graphic black and white check—grounded and calm rather than loud, it anchors the bedroom with a modern farmhouse edge, pairing easily with wood tones, neutrals, or minimalist décor.',
  },
  grey: {
    p1: 'Cotton-Feel Polyester with Classic Gingham: Woven from soft brushed polyester with the relaxed, garment-washed hand of cotton, the duvet cover and pillowcases feature a timeless grey and white gingham check. Reversible AB design—the A side shows the gingham check, while the B side is a clean solid light grey.',
    p5: 'Soft Grey Gingham Colorway: A gentle grey and white check—low-saturation and quietly warm, it brings a calm, effortless order to the bedroom, pairing easily with modern, classic, or cozy décor.',
  },
};
const P2 = 'Breathable & Skin-Friendly All Season: The washed plain weave feels soft, airy and gentle against the skin, keeping you comfortable through warm summers and layered cozy in cooler months.';
const P3 = 'Complete Queen 4-Piece Set: This bedding set includes 1 duvet cover (88 x 88 in), 1 fitted sheet (60 x 80 in) with all-around elastic for a secure fit, and 2 pillowcases (20 x 30 in), giving you everything you need for a coordinated, polished bed.';
const P4 = 'Thoughtful Details & Easy Care: A hidden zipper closure and interior corner ties keep your comforter neatly in place; the set is machine washable and gets even softer with every wash.';

function title(c) {
  return `Makimoo Queen Bedding Set 4 Piece Cotton Feel Gingham Duvet Cover Fitted Sheet 2 Pillowcases 88 x 88 in (${c.colorName})`;
}

// ── 通用：在 anchor 行/块后插入 insert 文本 ──
function insertAfter(file, anchor, insert, blockEnd = false) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(insert.trim().slice(0, 40))) {
    console.log('SKIP (exists):', file, insert.trim().slice(0, 40));
    return;
  }
  const i = s.indexOf(anchor);
  if (i < 0) throw new Error('anchor not found in ' + file + ' :: ' + anchor.slice(0, 50));
  let insertAt;
  if (blockEnd) {
    const j = s.indexOf('],', i);
    if (j < 0) throw new Error('block end not found in ' + file);
    insertAt = j + 2;
    const nl = s[insertAt] === '\r' && s[insertAt + 1] === '\n' ? '\r\n' : '\n';
    s = s.slice(0, insertAt) + nl + insert.split('\n').join(nl) + s.slice(insertAt);
  } else {
    const j = s.indexOf('\n', i);
    insertAt = j + 1;
    const nl = s[j - 1] === '\r' ? '\r\n' : '\n';
    s = s.slice(0, insertAt) + insert.split('\n').join(nl) + nl + s.slice(insertAt);
  }
  fs.writeFileSync(file, s);
  console.log('OK:', file);
}

for (const c of COLORS) {
  const img = `/images/products/${c.ASIN}/1.webp`;
  const bullets = [PARA[c.key].p1, P2, P3, P4, PARA[c.key].p5].join('\\n\\n');
  insertAfter(
    'src/data/materials-map.ts',
    `"percalejac-haze-pc-queen": {`,
    `  "${c.a}": {"title":"${title(c)}","bullets":"${bullets}","sku":"${c.a}","images":["${img}"],"whiteBg":[false]},`
  );
  insertAfter(
    'src/data/materials-short-bullets.ts',
    `"percalejac-haze-pc-queen": [`,
    `  "${c.a}": [\n    "Cotton-Feel Polyester: soft brushed hand, garment-washed feel",\n    "Classic ${c.key} & white gingham check, solid ${c.solid} reverse",\n    "4-Piece Queen Set: duvet cover 88 x 88 in, fitted sheet 60 x 80 in, 2 pillowcases 20 x 30 in",\n    "Hidden zipper & corner ties keep your comforter in place",\n    "Easy Care: machine washable, gets softer with every wash",\n  ],`,
    true
  );
  insertAfter(
    'src/data/short-titles.ts',
    `"percalejac-haze-pc-queen": "Cotton Percale Jacquard Pillowcases, Dusty Blue, Queen",`,
    `  "${c.a}": "Cotton Feel Gingham Bedding Set, 4 Piece, ${c.shortColor}, Queen",`
  );
  insertAfter(
    'src/data/specs-overrides.ts',
    `"percalejac-haze-pc-queen": { material: "Cotton Percale", dimensionsCm: [51, 76] },`,
    `  "${c.a}": { material: "Washed Cotton-Like", dimensionsCm: [220, 220] },`
  );
  insertAfter(
    'src/data/product-weights.ts',
    `"percalejac-haze-pc-queen": {"type":"Bedding","score":4.5,"perf":4.5,"boost":0},`,
    `  "${c.a}": {"type":"Bedding","score":3,"perf":3,"boost":0},`
  );
  insertAfter(
    'src/data/new-product-handles.ts',
    `'makimoo-cotton-percale-jacquard-pillowcases-set-of-2-queen-dusty-blue-percalejac-haze-pc-queen',  // 2026-10-26：枕套对装（灰蓝棉 Percale 宽条提花，仅 Queen 20x30in）`,
    `  '${c.handle}',  // 2026-10-26：Cotton Feel 格纹四件套（${c.colorName}，仅 Queen）`
  );
  insertAfter(
    'src/data/image-aspect-overrides.ts',
    `'percalejac-haze-pc-queen': '3/4',`,
    `  '${c.a}': '3/4',`
  );
}

// ── classifySet：gingham4- 前缀归 four ──
{
  const file = 'src/data/bedding-families.ts';
  let s = fs.readFileSync(file, 'utf8');
  if (!s.includes("a.startsWith('gingham4-')")) {
    const anchor = `if (a.startsWith('velstripe-')) return 'four'; // 2026-10-25：条纹绒四件套`;
    const i = s.indexOf(anchor);
    if (i < 0) throw new Error('classifySet anchor not found');
    const j = s.indexOf('\n', i);
    const nl = s[j - 1] === '\r' ? '\r\n' : '\n';
    s = s.slice(0, j + 1) + `  // 2026-10-26 用户定：Cotton Feel（聚酯水洗棉手感）格纹四件套（3 色 × 仅 Queen），归 four` + nl + `  if (a.startsWith('gingham4-')) return 'four';` + nl + s.slice(j + 1);
    fs.writeFileSync(file, s);
    console.log('OK: classifySet');
  } else console.log('SKIP: classifySet');
}

// ── variant-groups.ts：GINGHAM4 组（Blue 组首）──
{
  const file = 'src/data/variant-groups.ts';
  let s = fs.readFileSync(file, 'utf8');
  if (!s.includes("id: 'GINGHAM4'")) {
    const tail = s.lastIndexOf('];');
    if (tail < 0) throw new Error('variant-groups tail not found');
    const group = `  {\n    id: 'GINGHAM4',\n    optionName: 'Color',\n    // Cotton Feel（聚酯水洗棉手感）格纹四件套（3 色 × 仅 Queen，2026-10-26 用户定）\n    members: [\n${COLORS.map((c) => `    { asin: '${c.a}', handle: '${c.handle}', color: '${c.colorName}', size: '220 x 220 cm' },`).join('\n')}\n    ],\n  },\n`;
    s = s.slice(0, tail) + group + s.slice(tail);
    fs.writeFileSync(file, s);
    console.log('OK: variant-groups GINGHAM4');
  } else console.log('SKIP: variant-groups');
}
console.log('ALL DONE');
