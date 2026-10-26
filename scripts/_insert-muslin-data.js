// 一次性脚本：1688-1025015219200 Cotton Blend Muslin 双层纱四件套的配套数据
// （materials-map / short-bullets / short-titles / specs-overrides / product-weights / image-aspect-overrides
//   / new-product-handles × 3 色）+ bedding-families 三条规则 + 变体组 + bedding-fabrics 条目 + V2Header 菜单 + sitemap
const fs = require('fs');

const COLORS = [
  {
    c: 'c1', ASIN: '1688-1025015219200-C1', a: '1688-1025015219200-c1', color: 'Grey',
    handle: 'cotton-blend-muslin-double-gauze-4-piece-bedding-set-grey-queen-1688-1025015219200-c1',
    tone: 'calm light grey',
    p5: 'Calm Grey Colorway: A soft, heathered light grey—quiet, airy and endlessly versatile, it brings a cloud-like calm to the bedroom, pairing easily with modern, classic, or cozy décor.',
  },
  {
    c: 'c2', ASIN: '1688-1025015219200-C2', a: '1688-1025015219200-c2', color: 'Navy',
    handle: 'cotton-blend-muslin-double-gauze-4-piece-bedding-set-navy-queen-1688-1025015219200-c2',
    tone: 'deep muted navy',
    p5: 'Deep Navy Colorway: A rich, muted navy—grounded and serene rather than stark, it anchors the bedroom with a relaxed coastal depth, pairing easily with crisp whites, warm woods, or minimalist décor.',
  },
  {
    c: 'c3', ASIN: '1688-1025015219200-C3', a: '1688-1025015219200-c3', color: 'Brown',
    handle: 'cotton-blend-muslin-double-gauze-4-piece-bedding-set-brown-queen-1688-1025015219200-c3',
    tone: 'warm earthy brown',
    p5: 'Warm Brown Colorway: A soft, earthy brown—warm and understated, it wraps the bedroom in a cozy, lived-in warmth, pairing easily with creams, natural textures, or rustic décor.',
  },
];

const P1 = 'Cotton Blend Muslin Double Gauze: Woven from a soft cotton blend—85% cotton, 15% polyester—in an airy double gauze construction, two whisper-light layers of muslin give this set a fluffy, featherlight hand with a gently crinkled, lived-in texture.';
const P2 = 'Breathable & Skin-Friendly All Season: The double-layer gauze weave lets air circulate freely, feeling cool and gentle against the skin through warm summers and layering cozy in cooler months.';
const P3 = 'Complete Queen 4-Piece Set: This bedding set includes 1 duvet cover (88 x 88 in), 1 fitted sheet (60 x 80 in) with all-around elastic for a secure fit, and 2 pillowcases (20 x 30 in), giving you everything you need for a coordinated, polished bed.';
const P4 = 'Thoughtful Details & Easy Care: A hidden zipper closure and interior corner ties keep your comforter neatly in place; the cotton blend fabric (85% cotton, 15% polyester) is machine washable and gets even softer with every wash.';

function title(c) {
  return `Makimoo Queen Bedding Set 4 Piece Cotton Blend Muslin Double Gauze Duvet Cover Fitted Sheet 2 Pillowcases 88 x 88 in (${c.color})`;
}

// ── 通用：在 anchor 行/块后插入 insert 文本（行尾自适应 \r\n / \n）──
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
  const bullets = [P1, P2, P3, P4, c.p5].join('\\n\\n');
  insertAfter(
    'src/data/materials-map.ts',
    `"gingham4-blue-queen": {`,
    `  "${c.a}": {"title":"${title(c)}","bullets":"${bullets}","sku":"${c.a}","images":["${img}"],"whiteBg":[false]},`
  );
  insertAfter(
    'src/data/materials-short-bullets.ts',
    `"gingham4-blue-queen": [`,
    `  "${c.a}": [\n    "Cotton Blend Muslin: 85% cotton / 15% polyester double gauze",\n    "Airy two-layer weave in a ${c.tone}—breathable, fluffy & lightweight",\n    "4-Piece Queen Set: duvet cover 88 x 88 in, fitted sheet 60 x 80 in, 2 pillowcases 20 x 30 in",\n    "Hidden zipper & corner ties keep your comforter in place",\n    "Easy Care: machine washable, gets softer with every wash",\n  ],`,
    true
  );
  insertAfter(
    'src/data/short-titles.ts',
    `"gingham4-blue-queen": "Cotton Feel Gingham Bedding Set, 4 Piece, Blue, Queen",`,
    `  "${c.a}": "Cotton Blend Muslin Bedding Set, 4 Piece, ${c.color}, Queen",`
  );
  insertAfter(
    'src/data/specs-overrides.ts',
    `"gingham4-blue-queen": { material: "Washed Cotton-Like", dimensionsCm: [220, 220] },`,
    `  "${c.a}": { material: "Cotton Blend", dimensionsCm: [220, 220] },`
  );
  insertAfter(
    'src/data/image-aspect-overrides.ts',
    `'gingham4-blue-queen': '3/4',`,
    `  '${c.a}': '3/4',`
  );
  insertAfter(
    'src/data/new-product-handles.ts',
    `'makimoo-queen-bedding-set-4-piece-cotton-feel-gingham-grey-queen',  // 2026-10-26：Cotton Feel 格纹四件套（Grey Gingham，仅 Queen）`,
    `  '${c.handle}',  // 2026-10-26：Cotton Blend Muslin 双层纱四件套（${c.color}，仅 Queen）`
  );
}

// product-weights.ts 是 build-weights.js 自动生成的（build 链会重算，新品自动得 score 1.5 与 GINGHAM4 一致）；
// 此处按用户要求照 GINGHAM4 模式手工补 3 条，build 重算后值不变
for (const c of COLORS) {
  insertAfter(
    'src/data/product-weights.ts',
    `"gingham4-grey-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},`,
    `  "${c.a}": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},`
  );
}

// ── bedding-families.ts：classifySet / familyKeyOf / beddingUsSizeLabel 三条规则 ──
{
  const file = 'src/data/bedding-families.ts';
  let s = fs.readFileSync(file, 'utf8');
  const add = (anchor, insert) => {
    if (s.includes(insert.trim().split('\n').pop().trim().slice(0, 30))) {
      console.log('SKIP (exists):', insert.trim().split('\n').pop().trim().slice(0, 40));
      return;
    }
    const i = s.indexOf(anchor);
    if (i < 0) throw new Error('bedding-families anchor not found: ' + anchor.slice(0, 50));
    const j = s.indexOf('\n', i);
    const nl = s[j - 1] === '\r' ? '\r\n' : '\n';
    s = s.slice(0, j + 1) + insert.split('\n').join(nl) + nl + s.slice(j + 1);
  };
  add(
    `if (a.startsWith('gingham4-')) return 'four';`,
    `  // 2026-10-26 用户定：Cotton Blend（85%棉/15%聚酯）Muslin 双层纱四件套（3 色 × 仅 Queen），归 four\n  if (a.startsWith('1688-1025015219200')) return 'four';`
  );
  add(
    `if (a.startsWith('1688-916370884976')) return '1688-916370884976';`,
    `  // 2026-10-26：1688-1025015219200 Cotton Blend 双层纱四件套——同前缀同色归一个 family（key = 前缀::颜色，\n  // 颜色取变体组成员色，同 duvet 二维家族口径；ASIN 无颜色段，colorOf 会误取数字段）\n  if (a.startsWith('1688-1025015219200')) return \`1688-1025015219200::\${duvetColorOf(asin)}\`;`
  );
  add(
    `const last = asin.split('-').pop()?.toUpperCase() ?? '';`,
    `  // 2026-10-26：1688-1025015219200 Cotton Blend 双层纱四件套仅 Queen（ASIN 无尺寸尾段，220cm 短边会被误判 King / Cal King）\n  if (asin.toLowerCase().startsWith('1688-1025015219200')) return 'Queen';`
  );
  fs.writeFileSync(file, s);
  console.log('OK: bedding-families');
}

// ── variant-groups.ts：变体组（C1 Grey 组首）──
{
  const file = 'src/data/variant-groups.ts';
  let s = fs.readFileSync(file, 'utf8');
  if (!s.includes("id: '1688-1025015219200'")) {
    const tail = s.lastIndexOf('];');
    if (tail < 0) throw new Error('variant-groups tail not found');
    const group = `  {\n    id: '1688-1025015219200',\n    optionName: 'Color',\n    // Cotton Blend（85%棉/15%聚酯）Muslin 双层纱四件套（3 色 × 仅 Queen，2026-10-26 用户定）\n    members: [\n${COLORS.map((c) => `    { asin: '${c.a}', handle: '${c.handle}', color: '${c.color}', size: '220 x 220 cm' },`).join('\n')}\n    ],\n  },\n`;
    s = s.slice(0, tail) + group + s.slice(tail);
    fs.writeFileSync(file, s);
    console.log('OK: variant-groups 1688-1025015219200');
  } else console.log('SKIP: variant-groups');
}

// ── bedding-fabrics.ts：Cotton Blend 面料条目（面料 PLP /bedding/cotton-blend/ 随之生成）──
{
  const file = 'src/data/bedding-fabrics.ts';
  let s = fs.readFileSync(file, 'utf8');
  if (!s.includes("slug: 'cotton-blend'")) {
    const anchor = `  // /bedding/satin/ 2026-10-23 随 Satin 床品全站移除下线`;
    const i = s.indexOf(anchor);
    if (i < 0) throw new Error('bedding-fabrics anchor not found');
    const nl = s.includes('\r\n') ? '\r\n' : '\n';
    const entry = [
      `  {`,
      `    // 2026-10-26 用户定：Cotton Blend（85%棉/15%聚酯）Muslin 双层纱四件套新面料线（3 色 × 仅 Queen）`,
      `    slug: 'cotton-blend',`,
      `    material: 'Cotton Blend',`,
      `    desc: 'Soft. Durable. Easy care.',`,
      `    story:`,
      `      'A breathable cotton blend—85% cotton, 15% polyester—woven as muslin double gauze: two airy layers with a soft, fluffy, featherlight hand. It breathes all night and gets even softer with every wash.',`,
      `    // hero 图由 grey 主图居中裁 4:3 生成（scripts/_muslin-convert-images.js），暂无独立面料特写素材`,
      `    heroImage: '/images/fabric-guide/fabric-cotton-blend.webp',`,
      `  },`,
      ``,
    ].join(nl);
    s = s.slice(0, i) + entry + s.slice(i);
    fs.writeFileSync(file, s);
    console.log('OK: bedding-fabrics cotton-blend');
  } else console.log('SKIP: bedding-fabrics');
}

// ── V2Header.tsx：Fabric 菜单 Cotton Blend 去掉 comingSoon 置灰，走正常 fabricByMaterial 链路 ──
{
  const file = 'src/components/v2/V2Header.tsx';
  let s = fs.readFileSync(file, 'utf8');
  const oldBranch = `      if (key === 'Cotton Blend') {\n        return [{ label: 'Cotton Blend', desc: 'Soft. Durable. Easy care.', href: '/products?cat=bedding', comingSoon: true }];\n      }\n`;
  const oldBranchCrlf = oldBranch.split('\n').join('\r\n');
  if (s.includes(oldBranch) || s.includes(oldBranchCrlf)) {
    s = s.includes(oldBranch) ? s.replace(oldBranch, '') : s.replace(oldBranchCrlf, '');
    const oldComment = 'Cotton Blend 产品线未上，置灰占位';
    if (!s.includes(oldComment)) throw new Error('V2Header comment anchor not found');
    s = s.replace(oldComment, 'Cotton Blend 2026-10-26 上线（Muslin 双层纱四件套），正常项走 fabricByMaterial → /bedding/cotton-blend/');
    fs.writeFileSync(file, s);
    console.log('OK: V2Header Cotton Blend 菜单项');
  } else console.log('SKIP: V2Header');
}

// ── build-sitemap.js：面料 PLP 清单手动同步（文件头注释要求）──
{
  const file = 'scripts/build-sitemap.js';
  let s = fs.readFileSync(file, 'utf8');
  if (!s.includes('/bedding/cotton-blend/')) {
    const anchor = `{ loc: '/bedding/sateen/', priority: '0.7', changefreq: 'weekly' },`;
    const i = s.indexOf(anchor);
    if (i < 0) throw new Error('build-sitemap anchor not found');
    const j = s.indexOf('\n', i);
    const nl = s[j - 1] === '\r' ? '\r\n' : '\n';
    s = s.slice(0, j + 1) + `  { loc: '/bedding/cotton-blend/', priority: '0.7', changefreq: 'weekly' },` + nl + s.slice(j + 1);
    fs.writeFileSync(file, s);
    console.log('OK: build-sitemap cotton-blend');
  } else console.log('SKIP: build-sitemap');
}

console.log('ALL DONE');
