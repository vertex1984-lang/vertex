// 2026-10-27 sheetset 绒面三款建档（一次性脚本，跑完可删）：
// ⑥ SHEETSET-VINE-QUEEN（藤蔓绒球：米白藤蔓提花+棕色绒球边枕套，鼠尾草绿绒面床单床笠；参照 POMPOM4-VINE-QUEEN）
// ⑦ SHEETSET-IVORY-QUEEN（象牙白几何提花绒枕套，象牙白纯色绒面床单床笠；参照 VELJAC-IVORY-QUEEN）
// ⑧ SHEETSET-MOCHA-QUEEN（绿底棕条纹绒枕套，摩卡棕纯色绒面床单床笠；参照 VELSTRIPE-MOCHA-QUEEN）
// 三款均为单品无变体，与各自四件套相互独立（不动 variant-groups）。
// specs material 均沿用四件套口径 Embossed Velvet（fabricDisplayName → Plush Velvet，卡名 Plush Velvet Sheet Set）。
// 色段 VINE/IVORY/MOCHA 均已在 COLOR_LABELS（Olive Vine / Ivory White / Sage Stripe），无需改 bedding-families.ts。
// 行尾安全：\r?\n 宽松匹配锚点，新文本沿用被替换块的实际行尾。
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

const P3 = 'Complete Queen 4-Piece Sheet Set: This sheet set includes 1 fitted sheet (60 x 80 in) with a deep pocket and all-around elastic for a secure fit, 1 flat sheet (90 x 102 in), and 2 pillowcases (20 x 30 in)—a complete foundation layer that pairs easily with any duvet cover or comforter.';

const PRODUCTS = [
  {
    asin: 'SHEETSET-VINE-QUEEN',
    sku: 'sheetset-vine-queen',
    handle: 'makimoo-queen-sheet-set-4-piece-embossed-velvet-pom-pom-vine-queen',
    title: 'Makimoo Queen Sheet Set 4 Piece Embossed Velvet Fitted Sheet Flat Sheet 2 Pillowcases with Pom Pom Trim (Olive Vine)',
    paras: [
      'Sculpted Embossed Velvet Pillowcases with Pom-Pom Trim: The pillowcases are woven in a soft carved-plush fabric with a raised, sculpted vine pattern—velvety matte to the touch and gently plush—finished with a playful brown pom-pom edging along the borders for a soft, handcrafted look.',
      'Thick, Warm & Cozy Sheets: The fitted and flat sheets are made of solid sage-green milk-velvet—dense, smooth and warm against the skin, a cozy choice for autumn and winter nights without feeling heavy or stuffy.',
      P3,
      'Thoughtful Details & Easy Care: The deep-pocket fitted sheet hugs mattresses up to 16 in thick and stays snug without slipping; the set is machine washable and keeps its plush texture wash after wash.',
      'Soft Olive Vine Palette: Creamy vine-jacquard pillowcases with warm brown pom-pom trim over sage-green velvet sheets—low-saturation and quietly warm, it brings a calm, cozy elegance to the bedroom, pairing easily with modern, classic, or cozy décor.',
    ],
    shortTitle: 'Plush Velvet Pom Pom Sheet Set, Olive Vine, Queen',
    shortBullets: [
      'Sculpted Embossed Velvet: carved-plush, velvety matte and gently plush',
      'Raised vine-pattern pillowcases with playful brown pom-pom trim',
      '4-Piece Queen Sheet Set: fitted sheet 60 x 80 in, flat sheet 90 x 102 in, 2 pillowcases 20 x 30 in',
      'Solid sage-green velvet sheets; deep pocket fits mattresses up to 16 in',
      'Easy Care: machine washable, keeps its plush texture wash after wash',
    ],
    specsComment: '布料同 POMPOM4-VINE-QUEEN',
    handleComment: '藤蔓绒球 Sheet Set（Olive Vine，仅 Queen，无变体；与 POMPOM4-VINE-QUEEN 四件套相互独立）',
    aspectComment: '藤蔓绒球 Sheet Set（Olive Vine，仅 Queen，3:4 PDP 主图）',
  },
  {
    asin: 'SHEETSET-IVORY-QUEEN',
    sku: 'sheetset-ivory-queen',
    handle: 'makimoo-queen-sheet-set-4-piece-jacquard-velvet-ivory-queen',
    title: 'Makimoo Queen Sheet Set 4 Piece Double-Sided Jacquard Velvet Fitted Sheet Flat Sheet 2 Pillowcases (Ivory White)',
    paras: [
      'Double-Sided Jacquard Velvet Pillowcases: The pillowcases are soft, plush velvet carved with a three-dimensional diamond-and-braid jacquard that catches the light with a gentle sculpted relief—an AB reversible design with a smooth, solid velvet reverse in a warm camel tone.',
      'Thick, Warm & Cozy Sheets: The fitted and flat sheets are made of solid ivory milk-velvet—dense, velvety soft against the skin and holding warmth beautifully, a cozy choice for autumn and winter nights without feeling heavy or stuffy.',
      P3,
      'Thoughtful Details & Easy Care: The deep-pocket fitted sheet hugs mattresses up to 16 in thick and stays snug without slipping; the set is machine washable and keeps its plush pile and carved texture wash after wash.',
      'Soothing Ivory White Colorway: Finished in a soft Ivory White with a warm camel reverse on the pillowcases—low-saturation and quietly warm, it brings a calm, cozy elegance to the bedroom, pairing easily with modern, classic, or cozy décor.',
    ],
    shortTitle: 'Jacquard Velvet Sheet Set, Ivory White, Queen',
    shortBullets: [
      'Double-Sided Jacquard Velvet: plush, carved diamond-and-braid relief',
      'Geometric jacquard pillowcases with smooth solid camel reverse',
      '4-Piece Queen Sheet Set: fitted sheet 60 x 80 in, flat sheet 90 x 102 in, 2 pillowcases 20 x 30 in',
      'Solid ivory velvet sheets; deep pocket fits mattresses up to 16 in',
      'Easy Care: machine washable, keeps its plush pile wash after wash',
    ],
    specsComment: '布料同 VELJAC-IVORY-QUEEN',
    handleComment: '象牙白几何提花绒 Sheet Set（Ivory White，仅 Queen，无变体；与 VELJAC-IVORY-QUEEN 四件套相互独立）',
    aspectComment: '象牙白几何提花绒 Sheet Set（Ivory White，仅 Queen，3:4 PDP 主图）',
  },
  {
    asin: 'SHEETSET-MOCHA-QUEEN',
    sku: 'sheetset-mocha-queen',
    handle: 'makimoo-queen-sheet-set-4-piece-striped-velvet-mocha-queen',
    title: 'Makimoo Queen Sheet Set 4 Piece Striped Velvet Fitted Sheet Flat Sheet 2 Pillowcases (Sage Stripe)',
    paras: [
      'Soft Plush Velvet, Same Stripe on Both Sides: The pillowcases are woven in a short, dense velvet pile—velvety matte to the touch and gently plush. Both sides share the identical sage-and-brown stripe, so every fold and turn-back shows the same warm pattern, inside and out.',
      'Thick, Warm & Cozy Sheets: The fitted and flat sheets are made of solid mocha-brown milk-velvet—dense, velvety soft against the skin and holding warmth beautifully, a cozy choice for autumn and winter nights without feeling heavy or stuffy.',
      P3,
      'Thoughtful Details & Easy Care: The deep-pocket fitted sheet hugs mattresses up to 16 in thick and stays snug without slipping; the set is machine washable and keeps its plush pile and stripe texture wash after wash.',
      'Soothing Sage Stripe Colorway: Sage-green pillowcases patterned with fine warm-brown twin stripes over solid mocha velvet sheets—calm, earthy and quietly retro, it wraps the bedroom in a soft botanical warmth, pairing easily with modern, classic, or cozy décor.',
    ],
    shortTitle: 'Striped Velvet Sheet Set, Sage Stripe, Queen',
    shortBullets: [
      'Soft Plush Velvet: short, dense pile, velvety matte to the touch',
      'Sage-and-brown stripe pillowcases, same stripe on both sides',
      '4-Piece Queen Sheet Set: fitted sheet 60 x 80 in, flat sheet 90 x 102 in, 2 pillowcases 20 x 30 in',
      'Solid mocha velvet sheets; deep pocket fits mattresses up to 16 in',
      'Easy Care: machine washable, keeps its plush pile wash after wash',
    ],
    specsComment: '布料同 VELSTRIPE-MOCHA-QUEEN',
    handleComment: '摩卡棕条纹绒 Sheet Set（Sage Stripe，仅 Queen，无变体；与 VELSTRIPE-MOCHA-QUEEN 四件套相互独立）',
    aspectComment: '摩卡棕条纹绒 Sheet Set（Sage Stripe，仅 Queen，3:4 PDP 主图）',
  },
];

function productBlock(p) {
  const desc = p.paras.join(' ');
  const descHtml = p.paras.map((x) => `<p>${x}</p>`).join('');
  return `{
    "id": "makimoo-${p.asin}",
    "asin": "${p.asin}",
    "title": "${p.title}",
    "handle": "${p.handle}",
    "description": "${desc}",
    "descriptionHtml": "${descHtml}",
    "productType": "Bedding",
    "tags": [
        "Bedding"
    ],
    "availableForSale": false,
    "images": [
        {
            "url": "/images/products/${p.asin}/1.webp",
            "altText": "${p.title}",
            "width": 1728,
            "height": 2304
        }
    ],
    "priceRange": {
        "minVariantPrice": {
            "amount": "0.00",
            "currencyCode": "USD"
        }
    },
    "variants": [
        {
            "id": "variant-${p.asin}",
            "title": "Default Title",
            "price": {
                "amount": "0.00",
                "currencyCode": "USD"
            },
            "availableForSale": false,
            "selectedOptions": []
        }
    ],
    "amazonUrl": ""
},`;
}

// ── 1. products-materials.ts：三款一并插在 makimoo-1025015219200-C1 块之前 ──
editFile('src/data/products-materials.ts', [
  [
    '"amazonUrl": ""\n},\n{\n    "id": "makimoo-1025015219200-C1",',
    `"amazonUrl": ""\n},\n${PRODUCTS.map(productBlock).join('\n')}\n{\n    "id": "makimoo-1025015219200-C1",`,
  ],
]);

// ── 2. materials-map.ts：三款一并插在 sheetset-heart-queen 行之后 ───────────
editFile('src/data/materials-map.ts', [
  [
    '"sku":"sheetset-heart-queen","images":["/images/products/SHEETSET-HEART-QUEEN/1.webp"],"whiteBg":[false]},',
    `"sku":"sheetset-heart-queen","images":["/images/products/SHEETSET-HEART-QUEEN/1.webp"],"whiteBg":[false]},\n` +
      PRODUCTS.map(
        (p) =>
          `  "${p.sku}": {"title":"${p.title}","bullets":"${p.paras.join('\\\\n\\\\n')}","sku":"${p.sku}","images":["/images/products/${p.asin}/1.webp"],"whiteBg":[false]},`
      ).join('\n'),
  ],
]);

// ── 3. materials-short-bullets.ts：三款一并插在 sheetset-heart-queen 块之后 ──
editFile('src/data/materials-short-bullets.ts', [
  [
    '"Easy Care: machine washable, gets softer with every wash",\n  ],\n  "1025015219200-c3": [',
    '"Easy Care: machine washable, gets softer with every wash",\n  ],\n' +
      PRODUCTS.map(
        (p) => `  "${p.sku}": [\n${p.shortBullets.map((b) => `    "${b}",`).join('\n')}\n  ],`
      ).join('\n') +
      '\n  "1025015219200-c3": [',
  ],
]);

// ── 4. short-titles.ts ──────────────────────────────────────────────────────
editFile('src/data/short-titles.ts', [
  [
    '"sheetset-heart-queen": "Linen Feel Heart Sheet Set, Tan, Queen",',
    '"sheetset-heart-queen": "Linen Feel Heart Sheet Set, Tan, Queen",\n' +
      PRODUCTS.map((p) => `  "${p.sku}": "${p.shortTitle}",`).join('\n'),
  ],
]);

// ── 5. specs-overrides.ts ───────────────────────────────────────────────────
editFile('src/data/specs-overrides.ts', [
  [
    '"sheetset-heart-queen": { material: "Linen-Like", dimensionsCm: [152, 203] }, // 2026-10-27：Sheet Set 无被套，取床笠尺寸（同 sheet 类口径；布料同 MK-HEART4-TAN-QUEEN）',
    '"sheetset-heart-queen": { material: "Linen-Like", dimensionsCm: [152, 203] }, // 2026-10-27：Sheet Set 无被套，取床笠尺寸（同 sheet 类口径；布料同 MK-HEART4-TAN-QUEEN）\n' +
      PRODUCTS.map(
        (p) => `  "${p.sku}": { material: "Embossed Velvet", dimensionsCm: [152, 203] }, // 2026-10-27：Sheet Set 无被套，取床笠尺寸（同 sheet 类口径；${p.specsComment}）`
      ).join('\n'),
  ],
]);

// ── 6. new-product-handles.ts ───────────────────────────────────────────────
editFile('src/data/new-product-handles.ts', [
  [
    "'makimoo-queen-sheet-set-4-piece-linen-feel-heart-tan-queen',  // 2026-10-27：Linen Feel 浅棕爱心印花 Sheet Set（Tan Heart，仅 Queen，无变体；与 MK-HEART4-TAN-QUEEN 四件套相互独立）",
    "'makimoo-queen-sheet-set-4-piece-linen-feel-heart-tan-queen',  // 2026-10-27：Linen Feel 浅棕爱心印花 Sheet Set（Tan Heart，仅 Queen，无变体；与 MK-HEART4-TAN-QUEEN 四件套相互独立）\n" +
      PRODUCTS.map((p) => `  '${p.handle}',  // 2026-10-27：${p.handleComment}`).join('\n'),
  ],
]);

// ── 7. product-weights.ts ───────────────────────────────────────────────────
editFile('src/data/product-weights.ts', [
  [
    '"sheetset-heart-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},',
    '"sheetset-heart-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},\n' +
      PRODUCTS.map((p) => `  "${p.sku}": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},`).join('\n'),
  ],
]);

// ── 8. image-aspect-overrides.ts ────────────────────────────────────────────
editFile('src/data/image-aspect-overrides.ts', [
  [
    "  'sheetset-heart-queen': '3/4',\n};",
    "  'sheetset-heart-queen': '3/4',\n" +
      PRODUCTS.map((p) => `  // 2026-10-27：${p.aspectComment}\n  '${p.sku}': '3/4',`).join('\n') +
      '\n};',
  ],
]);

console.log(totalFail === 0 ? 'ALL OK' : `FAILURES: ${totalFail}`);
process.exit(totalFail === 0 ? 0 : 1);
