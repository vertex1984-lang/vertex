// 2026-10-27 SHEETSET-GINGHAM-QUEEN 建档（一次性脚本，跑完可删）：
// sheetset 类型第四款——Cotton Feel（Washed Cotton-Like 聚酯水洗棉手感）灰白格纹 Sheet Set
// （床笠+平床单+2枕套，Grey Gingham，仅 Queen，无变体组；与 1071466105053-C3 四件套相互独立）。
// asin 色段用 GINGHAM（GREY 被 percalejac 'Light Grey' 占用、STONE 被拼接提花占用，
// COLOR_LABELS 新增 GINGHAM: 'Grey Gingham'，与站内同款四件套色名一致）。
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

const ASIN = 'SHEETSET-GINGHAM-QUEEN';
const HANDLE = 'makimoo-queen-sheet-set-4-piece-cotton-feel-gingham-grey-queen';
const TITLE = 'Makimoo Queen Sheet Set 4 Piece Cotton Feel Gingham Fitted Sheet Flat Sheet 2 Pillowcases (Grey Gingham)';

const P1 = 'Cotton-Feel Polyester with Classic Gingham: Woven from soft brushed polyester with the relaxed, garment-washed hand of cotton, this sheet set pairs smooth solid light grey sheets with pillowcases in a timeless grey and white gingham check. Reversible AB pillowcase design—the A side shows the gingham check, while the B side is a clean solid light grey.';
const P2 = 'Breathable & Skin-Friendly All Season: The washed plain weave feels soft, airy and gentle against the skin, keeping you comfortable through warm summers and layered cozy in cooler months.';
const P3 = 'Complete Queen 4-Piece Sheet Set: This sheet set includes 1 fitted sheet (60 x 80 in) with a deep pocket and all-around elastic for a secure fit, 1 flat sheet (90 x 102 in), and 2 pillowcases (20 x 30 in)—a complete foundation layer that pairs easily with any duvet cover or comforter.';
const P4 = 'Thoughtful Details & Easy Care: The deep-pocket fitted sheet hugs mattresses up to 16 in thick and stays snug without slipping; the set is machine washable and gets even softer with every wash.';
const P5 = 'Soft Grey Gingham Colorway: A gentle grey and white check—low-saturation and quietly warm, it brings a calm, effortless order to the bedroom, pairing easily with modern, classic, or cozy décor.';
const DESC = [P1, P2, P3, P4, P5].join(' ');
const DESC_HTML = [P1, P2, P3, P4, P5].map((p) => `<p>${p}</p>`).join('');
const BULLETS = [P1, P2, P3, P4, P5].join('\\n\\n');

// ── 0. bedding-families.ts：COLOR_LABELS 新增 GINGHAM（插在 SAGEGREEN 行后）──
editFile('src/data/bedding-families.ts', [
  [
    "  SAGEGREEN: 'Sage Green',",
    "  SAGEGREEN: 'Sage Green',\n  // 2026-10-27：Cotton Feel 灰白格纹 Sheet Set 单色（GREY 被 percalejac 占用、STONE 被拼接提花占用，改用 GINGHAM；色名与 1071466105053-C3 四件套一致）\n  GINGHAM: 'Grey Gingham',",
  ],
]);

// ── 1. products-materials.ts：插在 makimoo-1025015219200-C1 块之前（紧随前三款 sheetset）─
const PRODUCT_BLOCK = `{
    "id": "makimoo-${ASIN}",
    "asin": "${ASIN}",
    "title": "${TITLE}",
    "handle": "${HANDLE}",
    "description": "${DESC}",
    "descriptionHtml": "${DESC_HTML}",
    "productType": "Bedding",
    "tags": [
        "Bedding"
    ],
    "availableForSale": false,
    "images": [
        {
            "url": "/images/products/${ASIN}/1.webp",
            "altText": "${TITLE}",
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
            "id": "variant-${ASIN}",
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
},
{
    "id": "makimoo-1025015219200-C1",`;
editFile('src/data/products-materials.ts', [
  ['"amazonUrl": ""\n},\n{\n    "id": "makimoo-1025015219200-C1",', `"amazonUrl": ""\n},\n${PRODUCT_BLOCK}`],
]);

// ── 2. materials-map.ts：插在 sheetset-sagegreen-queen 行之后 ───────────────
editFile('src/data/materials-map.ts', [
  [
    '"sku":"sheetset-sagegreen-queen","images":["/images/products/SHEETSET-SAGEGREEN-QUEEN/1.webp"],"whiteBg":[false]},',
    `"sku":"sheetset-sagegreen-queen","images":["/images/products/SHEETSET-SAGEGREEN-QUEEN/1.webp"],"whiteBg":[false]},\n  "sheetset-gingham-queen": {"title":"${TITLE}","bullets":"${BULLETS}","sku":"sheetset-gingham-queen","images":["/images/products/SHEETSET-GINGHAM-QUEEN/1.webp"],"whiteBg":[false]},`,
  ],
]);

// ── 3. materials-short-bullets.ts：插在 sheetset-sagegreen-queen 块之后 ──────
editFile('src/data/materials-short-bullets.ts', [
  [
    '"Easy Care: machine washable, gets softer with every wash",\n  ],\n  "1025015219200-c3": [',
    `"Easy Care: machine washable, gets softer with every wash",\n  ],\n  "sheetset-gingham-queen": [\n    "Cotton-Feel Polyester: soft brushed, garment-washed hand of cotton",\n    "Classic grey & white gingham pillowcases, clean solid light grey reverse",\n    "4-Piece Queen Sheet Set: fitted sheet 60 x 80 in, flat sheet 90 x 102 in, 2 pillowcases 20 x 30 in",\n    "Deep pocket & all-around elastic fit mattresses up to 16 in",\n    "Easy Care: machine washable, gets softer with every wash",\n  ],\n  "1025015219200-c3": [`,
  ],
]);

// ── 4. short-titles.ts ──────────────────────────────────────────────────────
editFile('src/data/short-titles.ts', [
  [
    '"sheetset-sagegreen-queen": "Washed Cotton Stripe Sheet Set, Sage Green, Queen",',
    '"sheetset-sagegreen-queen": "Washed Cotton Stripe Sheet Set, Sage Green, Queen",\n  "sheetset-gingham-queen": "Cotton Feel Gingham Sheet Set, Grey, Queen",',
  ],
]);

// ── 5. specs-overrides.ts ───────────────────────────────────────────────────
editFile('src/data/specs-overrides.ts', [
  [
    '"sheetset-sagegreen-queen": { material: "Washed Cotton-Like", dimensionsCm: [152, 203] }, // 2026-10-27：Sheet Set 无被套，取床笠尺寸（同 sheet 类口径）',
    '"sheetset-sagegreen-queen": { material: "Washed Cotton-Like", dimensionsCm: [152, 203] }, // 2026-10-27：Sheet Set 无被套，取床笠尺寸（同 sheet 类口径）\n  "sheetset-gingham-queen": { material: "Washed Cotton-Like", dimensionsCm: [152, 203] }, // 2026-10-27：Sheet Set 无被套，取床笠尺寸（同 sheet 类口径；布料同 1071466105053-C3）',
  ],
]);

// ── 6. new-product-handles.ts ───────────────────────────────────────────────
editFile('src/data/new-product-handles.ts', [
  [
    "'makimoo-queen-sheet-set-4-piece-washed-cotton-stripe-sage-queen',  // 2026-10-27：水洗棉细条纹 Sheet Set（Sage Green，仅 Queen，无变体；与 WASHSTRIPE-SAGEGREEN-QUEEN 四件套相互独立）",
    "'makimoo-queen-sheet-set-4-piece-washed-cotton-stripe-sage-queen',  // 2026-10-27：水洗棉细条纹 Sheet Set（Sage Green，仅 Queen，无变体；与 WASHSTRIPE-SAGEGREEN-QUEEN 四件套相互独立）\n  'makimoo-queen-sheet-set-4-piece-cotton-feel-gingham-grey-queen',  // 2026-10-27：Cotton Feel 灰白格纹 Sheet Set（Grey Gingham，仅 Queen，无变体；与 1071466105053-C3 四件套相互独立）",
  ],
]);

// ── 7. product-weights.ts ───────────────────────────────────────────────────
editFile('src/data/product-weights.ts', [
  [
    '"sheetset-sagegreen-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},',
    '"sheetset-sagegreen-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},\n  "sheetset-gingham-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},',
  ],
]);

// ── 8. image-aspect-overrides.ts ────────────────────────────────────────────
editFile('src/data/image-aspect-overrides.ts', [
  [
    "  'sheetset-sagegreen-queen': '3/4',\n};",
    "  'sheetset-sagegreen-queen': '3/4',\n  // 2026-10-27：Cotton Feel 灰白格纹 Sheet Set（Grey Gingham，仅 Queen，3:4 PDP 主图）\n  'sheetset-gingham-queen': '3/4',\n};",
  ],
]);

console.log(totalFail === 0 ? 'ALL OK' : `FAILURES: ${totalFail}`);
process.exit(totalFail === 0 ? 0 : 1);
