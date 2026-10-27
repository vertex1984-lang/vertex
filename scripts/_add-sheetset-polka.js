// 2026-10-27 SHEETSET-POLKA-QUEEN 建档（一次性脚本，跑完可删）：
// sheetset 类型第九款——Cotton Feel（Washed Cotton-Like）蓝白波点 Sheet Set
// （床笠+平床单+2枕套，Blue Polka，仅 Queen，无变体组；与 1071466105053-C10 四件套相互独立）。
// asin 色段用 POLKA（POLKA/DOT/BLUE 裸码均未注册；COLOR_LABELS 新增 POLKA: 'Blue Polka'，
// 色名与站内同款四件套一致；同组 C9 Cream Polka 不走 COLOR_LABELS，无冲突）。
// 主图用户提供成品图 blue-dot-sheetset-solidtop-v2.jpg（1440x1920 原生 3:4，已归档 staging/）。
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

const ASIN = 'SHEETSET-POLKA-QUEEN';
const HANDLE = 'makimoo-queen-sheet-set-4-piece-cotton-feel-polka-blue-queen';
const TITLE = 'Makimoo Queen Sheet Set 4 Piece Cotton Feel Polka Dot Fitted Sheet Flat Sheet 2 Pillowcases (Blue Polka)';

const P1 = 'Cotton-Feel Polyester with Playful Polka Dots: Woven from soft brushed polyester with the relaxed, garment-washed hand of cotton, this sheet set pairs smooth solid deep navy sheets with pillowcases featuring a scattering of navy polka dots on a soft dusty blue ground. Reversible AB pillowcase design—the A side shows the polka dot print, while the B side is a clean solid deep navy.';
const P2 = 'Breathable & Skin-Friendly All Season: The washed plain weave feels soft, airy and gentle against the skin, keeping you comfortable through warm summers and layered cozy in cooler months.';
const P3 = 'Complete Queen 4-Piece Sheet Set: This sheet set includes 1 fitted sheet (60 x 80 in) with a deep pocket and all-around elastic for a secure fit, 1 flat sheet (90 x 102 in), and 2 pillowcases (20 x 30 in)—a complete foundation layer that pairs easily with any duvet cover or comforter.';
const P4 = 'Thoughtful Details & Easy Care: The deep-pocket fitted sheet hugs mattresses up to 16 in thick and stays snug without slipping; the set is machine washable and gets even softer with every wash.';
const P5 = 'Dusty Blue Polka Colorway: Deep navy dots scattered over a soft dusty blue base—fresh and breezy with a quiet coastal feel, it brings a calm, easy order to the bedroom, pairing easily with white, light wood, or modern décor.';
const DESC = [P1, P2, P3, P4, P5].join(' ');
const DESC_HTML = [P1, P2, P3, P4, P5].map((p) => `<p>${p}</p>`).join('');
const BULLETS = [P1, P2, P3, P4, P5].join('\\n\\n');

// ── 0. bedding-families.ts：COLOR_LABELS 新增 POLKA（插在 HEART 行后）──────
editFile('src/data/bedding-families.ts', [
  [
    "  HEART: 'Tan Heart',",
    "  HEART: 'Tan Heart',\n  // 2026-10-27：Cotton Feel 蓝白波点 Sheet Set 单色（POLKA/DOT/BLUE 裸码均未注册；色名与 1071466105053-C10 四件套一致）\n  POLKA: 'Blue Polka',",
  ],
]);

// ── 1. products-materials.ts：插在 makimoo-1025015219200-C1 块之前（紧随前八款 sheetset）─
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
            "width": 1440,
            "height": 1920
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

// ── 2. materials-map.ts：插在 sheetset-mocha-queen 行之后 ──────────────────
editFile('src/data/materials-map.ts', [
  [
    '"sku":"sheetset-mocha-queen","images":["/images/products/SHEETSET-MOCHA-QUEEN/1.webp"],"whiteBg":[false]},',
    `"sku":"sheetset-mocha-queen","images":["/images/products/SHEETSET-MOCHA-QUEEN/1.webp"],"whiteBg":[false]},\n  "sheetset-polka-queen": {"title":"${TITLE}","bullets":"${BULLETS}","sku":"sheetset-polka-queen","images":["/images/products/SHEETSET-POLKA-QUEEN/1.webp"],"whiteBg":[false]},`,
  ],
]);

// ── 3. materials-short-bullets.ts：插在 sheetset-mocha-queen 块之后 ─────────
editFile('src/data/materials-short-bullets.ts', [
  [
    '"Easy Care: machine washable, keeps its plush pile wash after wash",\n  ],\n  "1025015219200-c3": [',
    `"Easy Care: machine washable, keeps its plush pile wash after wash",\n  ],\n  "sheetset-polka-queen": [\n    "Cotton-Feel Polyester: soft brushed, garment-washed hand of cotton",\n    "Playful navy polka-dot pillowcases on dusty blue, solid deep navy reverse",\n    "4-Piece Queen Sheet Set: fitted sheet 60 x 80 in, flat sheet 90 x 102 in, 2 pillowcases 20 x 30 in",\n    "Deep pocket & all-around elastic fit mattresses up to 16 in",\n    "Easy Care: machine washable, gets softer with every wash",\n  ],\n  "1025015219200-c3": [`,
  ],
]);

// ── 4. short-titles.ts ──────────────────────────────────────────────────────
editFile('src/data/short-titles.ts', [
  [
    '"sheetset-mocha-queen": "Striped Velvet Sheet Set, Sage Stripe, Queen",',
    '"sheetset-mocha-queen": "Striped Velvet Sheet Set, Sage Stripe, Queen",\n  "sheetset-polka-queen": "Cotton Feel Polka Dot Sheet Set, Blue, Queen",',
  ],
]);

// ── 5. specs-overrides.ts ───────────────────────────────────────────────────
editFile('src/data/specs-overrides.ts', [
  [
    '"sheetset-mocha-queen": { material: "Embossed Velvet", dimensionsCm: [152, 203] }, // 2026-10-27：Sheet Set 无被套，取床笠尺寸（同 sheet 类口径；布料同 VELSTRIPE-MOCHA-QUEEN）',
    '"sheetset-mocha-queen": { material: "Embossed Velvet", dimensionsCm: [152, 203] }, // 2026-10-27：Sheet Set 无被套，取床笠尺寸（同 sheet 类口径；布料同 VELSTRIPE-MOCHA-QUEEN）\n  "sheetset-polka-queen": { material: "Washed Cotton-Like", dimensionsCm: [152, 203] }, // 2026-10-27：Sheet Set 无被套，取床笠尺寸（同 sheet 类口径；布料同 1071466105053-C10）',
  ],
]);

// ── 6. new-product-handles.ts ───────────────────────────────────────────────
editFile('src/data/new-product-handles.ts', [
  [
    "'makimoo-queen-sheet-set-4-piece-striped-velvet-mocha-queen',  // 2026-10-27：摩卡棕条纹绒 Sheet Set（Sage Stripe，仅 Queen，无变体；与 VELSTRIPE-MOCHA-QUEEN 四件套相互独立）",
    "'makimoo-queen-sheet-set-4-piece-striped-velvet-mocha-queen',  // 2026-10-27：摩卡棕条纹绒 Sheet Set（Sage Stripe，仅 Queen，无变体；与 VELSTRIPE-MOCHA-QUEEN 四件套相互独立）\n  'makimoo-queen-sheet-set-4-piece-cotton-feel-polka-blue-queen',  // 2026-10-27：Cotton Feel 蓝白波点 Sheet Set（Blue Polka，仅 Queen，无变体；与 1071466105053-C10 四件套相互独立）",
  ],
]);

// ── 7. product-weights.ts ───────────────────────────────────────────────────
editFile('src/data/product-weights.ts', [
  [
    '"sheetset-mocha-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},',
    '"sheetset-mocha-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},\n  "sheetset-polka-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},',
  ],
]);

// ── 8. image-aspect-overrides.ts ────────────────────────────────────────────
editFile('src/data/image-aspect-overrides.ts', [
  [
    "  'sheetset-mocha-queen': '3/4',\n};",
    "  'sheetset-mocha-queen': '3/4',\n  // 2026-10-27：Cotton Feel 蓝白波点 Sheet Set（Blue Polka，仅 Queen，3:4 PDP 主图）\n  'sheetset-polka-queen': '3/4',\n};",
  ],
]);

console.log(totalFail === 0 ? 'ALL OK' : `FAILURES: ${totalFail}`);
process.exit(totalFail === 0 ? 0 : 1);
