// 2026-10-27 SHEETSET-HEART-QUEEN 建档（一次性脚本，跑完可删）：
// sheetset 类型第五款——Linen Feel（Linen-Like 仿麻聚酯）浅棕爱心印花 Sheet Set
// （床笠+平床单+2枕套，Tan Heart，仅 Queen，无变体组；与 MK-HEART4-TAN-QUEEN 四件套相互独立）。
// asin 色段用 HEART（HEART/TAN 裸码均未注册；COLOR_LABELS 新增 HEART: 'Tan Heart'，
// 色名与站内同款四件套一致；HEART4 是 mk-heart4 家族专用段，不复用）。
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

const ASIN = 'SHEETSET-HEART-QUEEN';
const HANDLE = 'makimoo-queen-sheet-set-4-piece-linen-feel-heart-tan-queen';
const TITLE = 'Makimoo Queen Sheet Set 4 Piece Linen Feel Heart Print Fitted Sheet Flat Sheet 2 Pillowcases (Tan Heart)';

const P1 = 'Linen Feel Polyester with Sweet Heart Print: Woven from softly textured polyester with the relaxed, breathable look of linen, this sheet set pairs smooth solid tan sheets with pillowcases featuring a scattering of dark brown hearts on a warm tan ground. Reversible AB pillowcase design—the A side shows the heart print, while the B side is a clean solid ivory.';
const P2 = 'Breathable & Skin-Friendly All Season: The washed plain weave feels soft, airy and gentle against the skin, keeping you comfortable through warm summers and layered cozy in cooler months.';
const P3 = 'Complete Queen 4-Piece Sheet Set: This sheet set includes 1 fitted sheet (60 x 80 in) with a deep pocket and all-around elastic for a secure fit, 1 flat sheet (90 x 102 in), and 2 pillowcases (20 x 30 in)—a complete foundation layer that pairs easily with any duvet cover or comforter.';
const P4 = 'Thoughtful Details & Easy Care: The deep-pocket fitted sheet hugs mattresses up to 16 in thick and stays snug without slipping; the set is machine washable and gets even softer with every wash.';
const P5 = 'Warm Tan Heart Colorway: Deep brown hearts scattered over a warm tan base—sweet without being saccharine, it brings a cozy, cottage-soft warmth to the bedroom, pairing easily with natural wood, rattan, or neutral décor.';
const DESC = [P1, P2, P3, P4, P5].join(' ');
const DESC_HTML = [P1, P2, P3, P4, P5].map((p) => `<p>${p}</p>`).join('');
const BULLETS = [P1, P2, P3, P4, P5].join('\\n\\n');

// ── 0. bedding-families.ts：COLOR_LABELS 新增 HEART（插在 GINGHAM 行后）────
editFile('src/data/bedding-families.ts', [
  [
    "  GINGHAM: 'Grey Gingham',",
    "  GINGHAM: 'Grey Gingham',\n  // 2026-10-27：Linen Feel 浅棕爱心印花 Sheet Set 单色（HEART/TAN 裸码未注册；色名与 MK-HEART4-TAN-QUEEN 四件套一致）\n  HEART: 'Tan Heart',",
  ],
]);

// ── 1. products-materials.ts：插在 makimoo-1025015219200-C1 块之前（紧随前四款 sheetset）─
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

// ── 2. materials-map.ts：插在 sheetset-gingham-queen 行之后 ─────────────────
editFile('src/data/materials-map.ts', [
  [
    '"sku":"sheetset-gingham-queen","images":["/images/products/SHEETSET-GINGHAM-QUEEN/1.webp"],"whiteBg":[false]},',
    `"sku":"sheetset-gingham-queen","images":["/images/products/SHEETSET-GINGHAM-QUEEN/1.webp"],"whiteBg":[false]},\n  "sheetset-heart-queen": {"title":"${TITLE}","bullets":"${BULLETS}","sku":"sheetset-heart-queen","images":["/images/products/SHEETSET-HEART-QUEEN/1.webp"],"whiteBg":[false]},`,
  ],
]);

// ── 3. materials-short-bullets.ts：插在 sheetset-gingham-queen 块之后 ────────
editFile('src/data/materials-short-bullets.ts', [
  [
    '"Easy Care: machine washable, gets softer with every wash",\n  ],\n  "1025015219200-c3": [',
    `"Easy Care: machine washable, gets softer with every wash",\n  ],\n  "sheetset-heart-queen": [\n    "Linen Feel Polyester: softly textured, breathable linen look",\n    "Sweet heart-print pillowcases on warm tan, clean solid ivory reverse",\n    "4-Piece Queen Sheet Set: fitted sheet 60 x 80 in, flat sheet 90 x 102 in, 2 pillowcases 20 x 30 in",\n    "Deep pocket & all-around elastic fit mattresses up to 16 in",\n    "Easy Care: machine washable, gets softer with every wash",\n  ],\n  "1025015219200-c3": [`,
  ],
]);

// ── 4. short-titles.ts ──────────────────────────────────────────────────────
editFile('src/data/short-titles.ts', [
  [
    '"sheetset-gingham-queen": "Cotton Feel Gingham Sheet Set, Grey, Queen",',
    '"sheetset-gingham-queen": "Cotton Feel Gingham Sheet Set, Grey, Queen",\n  "sheetset-heart-queen": "Linen Feel Heart Sheet Set, Tan, Queen",',
  ],
]);

// ── 5. specs-overrides.ts ───────────────────────────────────────────────────
editFile('src/data/specs-overrides.ts', [
  [
    '"sheetset-gingham-queen": { material: "Washed Cotton-Like", dimensionsCm: [152, 203] }, // 2026-10-27：Sheet Set 无被套，取床笠尺寸（同 sheet 类口径；布料同 1071466105053-C3）',
    '"sheetset-gingham-queen": { material: "Washed Cotton-Like", dimensionsCm: [152, 203] }, // 2026-10-27：Sheet Set 无被套，取床笠尺寸（同 sheet 类口径；布料同 1071466105053-C3）\n  "sheetset-heart-queen": { material: "Linen-Like", dimensionsCm: [152, 203] }, // 2026-10-27：Sheet Set 无被套，取床笠尺寸（同 sheet 类口径；布料同 MK-HEART4-TAN-QUEEN）',
  ],
]);

// ── 6. new-product-handles.ts ───────────────────────────────────────────────
editFile('src/data/new-product-handles.ts', [
  [
    "'makimoo-queen-sheet-set-4-piece-cotton-feel-gingham-grey-queen',  // 2026-10-27：Cotton Feel 灰白格纹 Sheet Set（Grey Gingham，仅 Queen，无变体；与 1071466105053-C3 四件套相互独立）",
    "'makimoo-queen-sheet-set-4-piece-cotton-feel-gingham-grey-queen',  // 2026-10-27：Cotton Feel 灰白格纹 Sheet Set（Grey Gingham，仅 Queen，无变体；与 1071466105053-C3 四件套相互独立）\n  'makimoo-queen-sheet-set-4-piece-linen-feel-heart-tan-queen',  // 2026-10-27：Linen Feel 浅棕爱心印花 Sheet Set（Tan Heart，仅 Queen，无变体；与 MK-HEART4-TAN-QUEEN 四件套相互独立）",
  ],
]);

// ── 7. product-weights.ts ───────────────────────────────────────────────────
editFile('src/data/product-weights.ts', [
  [
    '"sheetset-gingham-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},',
    '"sheetset-gingham-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},\n  "sheetset-heart-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},',
  ],
]);

// ── 8. image-aspect-overrides.ts ────────────────────────────────────────────
editFile('src/data/image-aspect-overrides.ts', [
  [
    "  'sheetset-gingham-queen': '3/4',\n};",
    "  'sheetset-gingham-queen': '3/4',\n  // 2026-10-27：Linen Feel 浅棕爱心印花 Sheet Set（Tan Heart，仅 Queen，3:4 PDP 主图）\n  'sheetset-heart-queen': '3/4',\n};",
  ],
]);

console.log(totalFail === 0 ? 'ALL OK' : `FAILURES: ${totalFail}`);
process.exit(totalFail === 0 ? 0 : 1);
