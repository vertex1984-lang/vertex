// 2026-10-27 SHEETSET-PETAL-QUEEN 建档（一次性脚本，跑完可删）：
// sheetset 类型第二款——Cotton Percale 色织细条纹提花 Sheet Set（床笠+平床单+2枕套，Blush Pink，
// 仅 Queen，无变体组；与 PERCALESTRIPE-PETAL-QUEEN 四件套是两个独立产品，不合变体）。
// 另含：beddingCardTitle 补 sheetset 分支（卡名规则 {fabric} Sheet Set，2026-10-27 用户定，
// 同时修正首款 SHEETSET-SAND-QUEEN 的卡面标题兜底 "…Set" → "…Sheet Set"）。
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

const ASIN = 'SHEETSET-PETAL-QUEEN';
const HANDLE = 'makimoo-queen-sheet-set-4-piece-cotton-percale-jacquard-stripe-petal-queen';
const TITLE = 'Makimoo Queen Sheet Set 4 Piece Cotton Percale Jacquard Fine Stripe Fitted Sheet Flat Sheet 2 Pillowcases (Blush Pink)';

const P1 = '100% Cotton Percale with Yarn-Dyed Jacquard: Woven in a crisp, tightly woven cotton percale, this sheet set pairs smooth solid sheets with pillowcases in a yarn-dyed jacquard fine stripe with a subtle woven texture. Reversible AB pillowcase design—the A side shows the fine-stripe jacquard, while the B side is a clean solid color.';
const P2 = 'Breathable & Skin-Friendly All Season: The percale plain weave feels cool, smooth and gentle against the skin, with airy breathability that keeps you comfortable through warm summers and layered cozy in cooler months.';
const P3 = 'Complete Queen 4-Piece Sheet Set: This sheet set includes 1 fitted sheet (60 x 80 in) with a deep pocket and all-around elastic for a secure fit, 1 flat sheet (90 x 102 in), and 2 pillowcases (20 x 30 in)—a complete foundation layer that pairs easily with any duvet cover or comforter.';
const P4 = 'Thoughtful Details & Easy Care: The deep-pocket fitted sheet hugs mattresses up to 16 in thick and stays snug without slipping; the set is machine washable and keeps its crisp hand and woven texture wash after wash.';
const P5 = 'Soothing Blush Pink Colorway: Finished in a soft blush pink—low-saturation and gently romantic, it brings a calm, healing warmth to the bedroom, pairing easily with modern, classic, or cozy décor.';
const DESC = [P1, P2, P3, P4, P5].join(' ');
const DESC_HTML = [P1, P2, P3, P4, P5].map((p) => `<p>${p}</p>`).join('');
const BULLETS = [P1, P2, P3, P4, P5].join('\\n\\n');

// ── 1. products-materials.ts：插在 makimoo-1025015219200-C1 块之前（紧随 SHEETSET-SAND-QUEEN）─
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

// ── 2. materials-map.ts：插在 sheetset-sand-queen 行之后 ────────────────────
editFile('src/data/materials-map.ts', [
  [
    '"sku":"sheetset-sand-queen","images":["/images/products/SHEETSET-SAND-QUEEN/1.webp"],"whiteBg":[false]},',
    `"sku":"sheetset-sand-queen","images":["/images/products/SHEETSET-SAND-QUEEN/1.webp"],"whiteBg":[false]},\n  "sheetset-petal-queen": {"title":"${TITLE}","bullets":"${BULLETS}","sku":"sheetset-petal-queen","images":["/images/products/SHEETSET-PETAL-QUEEN/1.webp"],"whiteBg":[false]},`,
  ],
]);

// ── 3. materials-short-bullets.ts：插在 sheetset-sand-queen 块之后 ──────────
editFile('src/data/materials-short-bullets.ts', [
  [
    '"Easy Care: machine washable, gets softer with every wash",\n  ],\n  "1025015219200-c3": [',
    `"Easy Care: machine washable, gets softer with every wash",\n  ],\n  "sheetset-petal-queen": [\n    "100% Cotton Percale: crisp, tightly woven plain weave, cool & breathable",\n    "Yarn-dyed fine-stripe jacquard pillowcases, clean solid reverse",\n    "4-Piece Queen Sheet Set: fitted sheet 60 x 80 in, flat sheet 90 x 102 in, 2 pillowcases 20 x 30 in",\n    "Deep pocket & all-around elastic fit mattresses up to 16 in",\n    "Easy Care: machine washable, gets softer with every wash",\n  ],\n  "1025015219200-c3": [`,
  ],
]);

// ── 4. short-titles.ts ──────────────────────────────────────────────────────
editFile('src/data/short-titles.ts', [
  [
    '"sheetset-sand-queen": "Cotton Percale Sheet Set, Sand, Queen",',
    '"sheetset-sand-queen": "Cotton Percale Sheet Set, Sand, Queen",\n  "sheetset-petal-queen": "Cotton Percale Sheet Set, Blush Pink, Queen",',
  ],
]);

// ── 5. specs-overrides.ts ───────────────────────────────────────────────────
editFile('src/data/specs-overrides.ts', [
  [
    '"sheetset-sand-queen": { material: "Cotton Percale", dimensionsCm: [152, 203] }, // 2026-10-27：Sheet Set 无被套，取床笠尺寸（同 sheet 类口径）',
    '"sheetset-sand-queen": { material: "Cotton Percale", dimensionsCm: [152, 203] }, // 2026-10-27：Sheet Set 无被套，取床笠尺寸（同 sheet 类口径）\n  "sheetset-petal-queen": { material: "Cotton Percale", dimensionsCm: [152, 203] }, // 2026-10-27：Sheet Set 无被套，取床笠尺寸（同 sheet 类口径）',
  ],
]);

// ── 6. new-product-handles.ts ───────────────────────────────────────────────
editFile('src/data/new-product-handles.ts', [
  [
    "'makimoo-queen-sheet-set-4-piece-cotton-percale-check-jacquard-sand-queen',  // 2026-10-27：Cotton Percale 细格提花 Sheet Set（床笠+平床单+2枕套，Sand，仅 Queen，无变体；sheetset 类型首款）",
    "'makimoo-queen-sheet-set-4-piece-cotton-percale-check-jacquard-sand-queen',  // 2026-10-27：Cotton Percale 细格提花 Sheet Set（床笠+平床单+2枕套，Sand，仅 Queen，无变体；sheetset 类型首款）\n  'makimoo-queen-sheet-set-4-piece-cotton-percale-jacquard-stripe-petal-queen',  // 2026-10-27：Cotton Percale 细条纹提花 Sheet Set（Blush Pink，仅 Queen，无变体；与 PERCALESTRIPE-PETAL-QUEEN 四件套相互独立）",
  ],
]);

// ── 7. product-weights.ts ───────────────────────────────────────────────────
editFile('src/data/product-weights.ts', [
  [
    '"sheetset-sand-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},',
    '"sheetset-sand-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},\n  "sheetset-petal-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},',
  ],
]);

// ── 8. image-aspect-overrides.ts ────────────────────────────────────────────
editFile('src/data/image-aspect-overrides.ts', [
  [
    "  'sheetset-sand-queen': '3/4',\n};",
    "  'sheetset-sand-queen': '3/4',\n  // 2026-10-27：Cotton Percale 细条纹提花 Sheet Set（Blush Pink，仅 Queen，3:4 PDP 主图）\n  'sheetset-petal-queen': '3/4',\n};",
  ],
]);

// ── 9. bedding-families.ts：beddingCardTitle 补 sheetset 分支（2026-10-27 用户定卡名规则）─
editFile('src/data/bedding-families.ts', [
  [
    ' *  - sheetset / duvetset / bundle（2026-10-26 预留，暂无产品）走兜底 "{布料} Set"',
    ' *  - sheetset（2026-10-27 上线）  → "{布料} Sheet Set"；duvetset / bundle（预留）走兜底 "{布料} Set"',
  ],
  [
    "  if (kind === 'pillowcase') return `${fabric} Pillowcases`;\n  return `${fabric} Set`;",
    "  if (kind === 'pillowcase') return `${fabric} Pillowcases`;\n  // 2026-10-27 用户定：sheetset 卡名规则 {布料} Sheet Set（SHEETSET-SAND/PETAL 两款）\n  if (kind === 'sheetset') return `${fabric} Sheet Set`;\n  return `${fabric} Set`;",
  ],
]);

console.log(totalFail === 0 ? 'ALL OK' : `FAILURES: ${totalFail}`);
process.exit(totalFail === 0 ? 0 : 1);
