// 2026-10-27 SHEETSET-SAND-QUEEN 建档（一次性脚本，跑完可删）：
// sheetset 类型首款产品——Cotton Percale 细格提花 Sheet Set（床笠+平床单+2枕套，Sand，仅 Queen，无变体组）。
// 触点：products-materials / materials-map / materials-short-bullets / short-titles / specs-overrides /
//       new-product-handles / product-weights / image-aspect-overrides + V2Header 导航 Sheet Sets 翻转活链
//       + V2FabricShop KIND_ORDER 补三个新类型（面料页分区序）。
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

const ASIN = 'SHEETSET-SAND-QUEEN';
const HANDLE = 'makimoo-queen-sheet-set-4-piece-cotton-percale-check-jacquard-sand-queen';
const TITLE = 'Makimoo Queen Sheet Set 4 Piece Cotton Percale Check Jacquard Fitted Sheet Flat Sheet 2 Pillowcases (Sand)';

const P1 = '100% Cotton Percale with Yarn-Dyed Check Jacquard: Woven in a crisp, tightly woven cotton percale, this sheet set pairs smooth solid sheets with pillowcases in a fine yarn-dyed check jacquard with a subtle woven texture. Reversible AB pillowcase design—the A side shows the woven check jacquard, while the B side is a clean solid color.';
const P2 = 'Breathable & Skin-Friendly All Season: The percale plain weave feels cool, smooth and gentle against the skin, with airy breathability that keeps you comfortable through warm summers and layered cozy in cooler months.';
const P3 = 'Complete Queen 4-Piece Sheet Set: This sheet set includes 1 fitted sheet (60 x 80 in) with a deep pocket and all-around elastic for a secure fit, 1 flat sheet (90 x 102 in), and 2 pillowcases (20 x 30 in)—a complete foundation layer that pairs easily with any duvet cover or comforter.';
const P4 = 'Thoughtful Details & Easy Care: The deep-pocket fitted sheet hugs mattresses up to 16 in thick and stays snug without slipping; the set is machine washable and keeps its crisp hand and woven texture wash after wash.';
const P5 = 'Soothing Sand Colorway: Finished in a warm, understated sand beige—natural and calm, it lends the bedroom a soft, sunlit warmth, pairing easily with modern, classic, or cozy décor.';
const DESC = [P1, P2, P3, P4, P5].join(' ');
const DESC_HTML = [P1, P2, P3, P4, P5].map((p) => `<p>${p}</p>`).join('');
const BULLETS = [P1, P2, P3, P4, P5].join('\\n\\n');

// ── 1. products-materials.ts：插在 makimoo-1025015219200-C1 块之前 ──────────
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

// ── 2. materials-map.ts：插在 mk-btfly4-mocha-queen 行之后 ─────────────────
editFile('src/data/materials-map.ts', [
  [
    '"sku":"mk-btfly4-mocha-queen","images":["/images/products/MK-BTFLY4-MOCHA-QUEEN/1.webp"],"whiteBg":[false]},',
    `"sku":"mk-btfly4-mocha-queen","images":["/images/products/MK-BTFLY4-MOCHA-QUEEN/1.webp"],"whiteBg":[false]},\n  "sheetset-sand-queen": {"title":"${TITLE}","bullets":"${BULLETS}","sku":"sheetset-sand-queen","images":["/images/products/SHEETSET-SAND-QUEEN/1.webp"],"whiteBg":[false]},`,
  ],
]);

// ── 3. materials-short-bullets.ts：插在 mk-btfly4-mocha-queen 块之后 ───────
editFile('src/data/materials-short-bullets.ts', [
  [
    '"Easy Care: machine washable, gets softer with every wash",\n  ],\n  "1025015219200-c3": [',
    `"Easy Care: machine washable, gets softer with every wash",\n  ],\n  "sheetset-sand-queen": [\n    "100% Cotton Percale: crisp, tightly woven plain weave, cool & breathable",\n    "Yarn-dyed check jacquard pillowcases, clean solid reverse",\n    "4-Piece Queen Sheet Set: fitted sheet 60 x 80 in, flat sheet 90 x 102 in, 2 pillowcases 20 x 30 in",\n    "Deep pocket & all-around elastic fit mattresses up to 16 in",\n    "Easy Care: machine washable, gets softer with every wash",\n  ],\n  "1025015219200-c3": [`,
  ],
]);

// ── 4. short-titles.ts ──────────────────────────────────────────────────────
editFile('src/data/short-titles.ts', [
  [
    '"mk-btfly4-mocha-queen": "Linen Feel Butterfly Bedding Set, 4 Piece, Mocha, Queen",',
    '"mk-btfly4-mocha-queen": "Linen Feel Butterfly Bedding Set, 4 Piece, Mocha, Queen",\n  "sheetset-sand-queen": "Cotton Percale Sheet Set, Sand, Queen",',
  ],
]);

// ── 5. specs-overrides.ts（sheet 类口径：床笠 60x80in → [152,203]，无被套不照抄 [220,220]）─
editFile('src/data/specs-overrides.ts', [
  [
    '"mk-btfly4-mocha-queen": { material: "Linen-Like", dimensionsCm: [220, 220] },',
    '"mk-btfly4-mocha-queen": { material: "Linen-Like", dimensionsCm: [220, 220] },\n  "sheetset-sand-queen": { material: "Cotton Percale", dimensionsCm: [152, 203] }, // 2026-10-27：Sheet Set 无被套，取床笠尺寸（同 sheet 类口径）',
  ],
]);

// ── 6. new-product-handles.ts ───────────────────────────────────────────────
editFile('src/data/new-product-handles.ts', [
  [
    "'makimoo-queen-bedding-set-4-piece-linen-feel-butterfly-mocha-queen-mk-btfly4-mocha-queen',  // 2026-10-26：Linen Feel 蝴蝶印花四件套单品（Mocha Butterfly，仅 Queen，无变体）",
    "'makimoo-queen-bedding-set-4-piece-linen-feel-butterfly-mocha-queen-mk-btfly4-mocha-queen',  // 2026-10-26：Linen Feel 蝴蝶印花四件套单品（Mocha Butterfly，仅 Queen，无变体）\n  'makimoo-queen-sheet-set-4-piece-cotton-percale-check-jacquard-sand-queen',  // 2026-10-27：Cotton Percale 细格提花 Sheet Set（床笠+平床单+2枕套，Sand，仅 Queen，无变体；sheetset 类型首款）",
  ],
]);

// ── 7. product-weights.ts ───────────────────────────────────────────────────
editFile('src/data/product-weights.ts', [
  [
    '"mk-btfly4-mocha-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},',
    '"mk-btfly4-mocha-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},\n  "sheetset-sand-queen": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},',
  ],
]);

// ── 8. image-aspect-overrides.ts ────────────────────────────────────────────
editFile('src/data/image-aspect-overrides.ts', [
  [
    "  'velstripe-charcoal-queen': '3/4',\n};",
    "  'velstripe-charcoal-queen': '3/4',\n  // 2026-10-27：Cotton Percale 细格提花 Sheet Set（sheetset 类型首款，仅 Queen，3:4 PDP 主图）\n  'sheetset-sand-queen': '3/4',\n};",
  ],
]);

// ── 9. V2Header.tsx：Sheet Sets 翻转活链 ────────────────────────────────────
editFile('src/components/v2/V2Header.tsx', [
  [
    "          { label: 'Sheet Sets', desc: 'Fitted sheet, flat sheet & two pillowcases.', href: '/products?cat=bedding', comingSoon: true },",
    "          // 2026-10-27 用户定：Sheet Sets 上线（首款 SHEETSET-SAND-QUEEN，Cotton Percale 细格提花），翻转活链\n          { label: 'Sheet Sets', desc: 'Fitted sheet, flat sheet & two pillowcases.', href: '/bedding/sheet-sets/' },",
  ],
  [
    '          // 2026-10-26 用户定：类型列按新矩阵重排——Sheet Sets / Duvet Cover Sets /\n          // Complete Bundles 为即将上线占位（comingSoon 置灰不可点，产品上线后改活链\n          // 到 /bedding/sheet-sets/ 等对应类型页）；',
    '          // 2026-10-26 用户定：类型列按新矩阵重排——Duvet Cover Sets / Complete Bundles\n          // 为即将上线占位（comingSoon 置灰不可点，产品上线后改活链到对应类型页；\n          // Sheet Sets 2026-10-27 已上线）；',
  ],
]);

// ── 10. V2FabricShop.tsx：KIND_ORDER 补三个新类型（否则 sheetset 卡在面料页分区模式被静默丢弃）─
editFile('src/components/v2/V2FabricShop.tsx', [
  [
    "const KIND_ORDER: SetKind[] = ['four', 'comforter', 'duvet', 'sheet'];",
    "// 2026-10-27：补 sheetset/duvetset/bundle 三个新类型（矩阵序，无产品不出分区；\n// 缺了会在面料页分区模式被静默丢弃——Sheet Sets 首款 SHEETSET-SAND-QUEEN 属 Cotton Percale 面料页）\nconst KIND_ORDER: SetKind[] = ['sheetset', 'duvetset', 'four', 'bundle', 'comforter', 'duvet', 'sheet'];",
  ],
]);

console.log(totalFail === 0 ? 'ALL OK' : `FAILURES: ${totalFail}`);
process.exit(totalFail === 0 ? 0 : 1);
