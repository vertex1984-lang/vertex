// 一次性脚本：为 PERCALEJAC-HAZE-PC-QUEEN 补 7 个配套数据文件条目
const fs = require('fs');
const A = 'percalejac-haze-pc-queen';
const img = (n) => `/images/products/PERCALEJAC-HAZE-PC-QUEEN/${n}.webp`;

const edits = [
  {
    file: 'src/data/materials-map.ts',
    anchor: `"percalejac-ivory-pc-queen": {`,
    findLineEnd: true,
    insert:
      `  "${A}": {"title":"Makimoo 100% Cotton Percale Jacquard Pillowcases Set of 2 Queen Size 20 x 30 in (Dusty Blue, Queen)","bullets":"100% Cotton Percale Jacquard: Woven in a crisp, tightly woven cotton percale, these pillowcases feature a yarn-dyed wide-stripe jacquard with a subtle sculpted texture—woven, not printed—so the pattern stays true wash after wash.\\n\\nSet of 2 Pillowcases, Queen Size: Two matching pillowcases (20 x 30 in). Pillow inserts are NOT included—slip them over your pillows to instantly refresh the bed.\\n\\nReversible AB Design: The A side shows the dusty blue and ivory stripe jacquard, while the B side is a smooth, solid percale in matching dusty blue—two looks in one set.\\n\\nBreathable & Skin-Friendly All Season: The percale plain weave feels cool, smooth and gentle against skin and hair, keeping you comfortable year-round.\\n\\nEasy Care: Machine washable and keeps its crisp hand and woven texture wash after wash.\\n\\nCalming Dusty Blue Colorway: A soft dusty blue paired with ivory stripes—low-saturation and quietly fresh, pairing easily with modern, coastal, or cozy bedding.","sku":"PERCALEJAC-HAZE-PC-QUEEN","images":["${img(1)}","${img(2)}","${img(3)}"],"whiteBg":[false,false,false]},`,
  },
  {
    file: 'src/data/materials-short-bullets.ts',
    anchor: `"percalejac-ivory-pc-queen": [`,
    findBlockEnd: true,
    insert:
      `  "${A}": [\n    "100% Cotton Percale: crisp, breathable yarn-dyed stripe jacquard",\n    "Set of 2: two Queen pillowcases (20 x 30 in), inserts not included",\n    "Reversible AB Design: dusty blue stripe jacquard front, solid dusty blue back",\n    "Skin-Friendly: cool smooth percale, gentle on skin and hair",\n    "Easy Care: machine washable, keeps its crisp hand",\n  ],`,
  },
  {
    file: 'src/data/short-titles.ts',
    anchor: `"percalejac-ivory-pc-queen": "Cotton Percale Jacquard Pillowcases, Ivory White, Queen",`,
    insert: `  "${A}": "Cotton Percale Jacquard Pillowcases, Dusty Blue, Queen",`,
  },
  {
    file: 'src/data/specs-overrides.ts',
    anchor: `"percalejac-ivory-pc-queen": { material: "Cotton Percale", dimensionsCm: [51, 76] },`,
    insert: `  "${A}": { material: "Cotton Percale", dimensionsCm: [51, 76] },`,
  },
  {
    file: 'src/data/product-weights.ts',
    anchor: `"percalejac-ivory-pc-queen": {"type":"Bedding","score":4.5,"perf":4.5,"boost":0},`,
    insert: `  "${A}": {"type":"Bedding","score":4.5,"perf":4.5,"boost":0},`,
  },
  {
    file: 'src/data/new-product-handles.ts',
    anchor: `'makimoo-cotton-percale-jacquard-pillowcases-set-of-2-queen-ivory-percalejac-ivory-pc-queen',  // 2026-10-26：枕套对装（象牙白棉 Percale 提花，仅 Queen 20x30in）`,
    insert: `  'makimoo-cotton-percale-jacquard-pillowcases-set-of-2-queen-dusty-blue-percalejac-haze-pc-queen',  // 2026-10-26：枕套对装（灰蓝棉 Percale 宽条提花，仅 Queen 20x30in）`,
  },
  {
    file: 'src/data/image-aspect-overrides.ts',
    anchor: `'percalejac-ivory-pc-queen': '3/4',`,
    insert: `  '${A}': '3/4',`,
  },
];

for (const e of edits) {
  let s = fs.readFileSync(e.file, 'utf8');
  if (s.includes(A)) {
    console.log('SKIP (exists):', e.file);
    continue;
  }
  const i = s.indexOf(e.anchor);
  if (i < 0) throw new Error('anchor not found in ' + e.file);
  let insertAt;
  if (e.findBlockEnd) {
    const j = s.indexOf('],', i);
    if (j < 0) throw new Error('block end not found in ' + e.file);
    insertAt = j + 2;
    const nl = s[insertAt] === '\r' && s[insertAt + 1] === '\n' ? '\r\n' : '\n';
    s = s.slice(0, insertAt) + nl + e.insert.split('\n').join(nl) + s.slice(insertAt);
  } else {
    const j = s.indexOf('\n', i);
    insertAt = j + 1;
    const nl = s[j - 1] === '\r' ? '\r\n' : '\n';
    s = s.slice(0, insertAt) + e.insert.split('\n').join(nl) + nl + s.slice(insertAt);
  }
  fs.writeFileSync(e.file, s);
  console.log('OK:', e.file);
}
