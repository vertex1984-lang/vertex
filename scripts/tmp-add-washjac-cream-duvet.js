// 2026-10-25：新建 WASHJAC-CREAM-DUVET 单独被套 PDP（奶白暗纹提花水洗棉被套，仅 Queen）
const fs = require('fs');

function patch(file, anchor, insert, opts = {}) {
  let s = fs.readFileSync(file, 'utf8');
  const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\n/g, '\\r?\\n');
  const re = new RegExp(esc(anchor));
  const m = s.match(re);
  if (!m) { console.error('ANCHOR NOT FOUND in', file); process.exit(1); }
  const eol = m[0].includes('\r\n') ? '\r\n' : '\n';
  const ins = insert.replace(/\n/g, eol);
  s = s.replace(re, opts.before ? ins + m[0] : m[0] + ins);
  fs.writeFileSync(file, s);
  console.log('patched', file);
}

const ASIN = 'washjac-cream-duvet';
const ASIN_UP = 'WASHJAC-CREAM-DUVET';
const HANDLE = 'makimoo-washed-cotton-jacquard-duvet-cover-only-cream-white-queen-washjac-cream-duvet';
const TITLE = 'Makimoo Soft Washed Cotton Jacquard Duvet Cover Only 88 x 88 in with Hidden Zipper and Corner Ties (Cream White, Queen)';

const BULLETS = [
  'Soft Washed Cotton with Textured Jacquard: Woven from garment-washed cotton-feel fabric with a broken-in softness from the very first night, the duvet cover features a yarn-dyed, textured leaf-vein jacquard woven into the cloth—not printed—creating a subtle tonal pattern that catches the light gently. Reversible AB design—the A side shows the leaf-vein jacquard, while the B side is a clean solid color.',
  'Standalone Duvet Cover, Queen Size: One duvet cover only (88 x 88 in). Pillowcases, fitted sheet and comforter are NOT included—slip it over your duvet to instantly refresh the bedroom.',
  'Breathable & Skin-Friendly All Season: The washed plain weave feels soft, airy and gentle against the skin, keeping you comfortable through warm summers and layered cozy in cooler months.',
  'Thoughtful Details & Easy Care: A hidden zipper closure and interior corner ties keep your comforter neatly in place; the cover is machine washable and gets even softer with every wash.',
  'Soothing Cream White Colorway: Finished in a soft, milky Cream White—low-saturation and quietly warm, it brings a calm, airy elegance to the bedroom, pairing easily with modern, classic, or cozy décor.',
];
const bulletsStr = BULLETS.join('\n\n');
const descPlain = BULLETS.join(' ');
const descHtml = BULLETS.map((p) => `<p>${p}</p>`).join('');

// 1) materials-map.ts：插在 "pompom4-vine-duvet" 条目之后
{
  const entry = `  "${ASIN}": {"title":${JSON.stringify(TITLE)},"bullets":${JSON.stringify(bulletsStr)},"sku":"${ASIN_UP}","images":["/images/products/${ASIN_UP}/1.webp"],"whiteBg":[false]},\n`;
  const anchorLine = `"pompom4-vine-duvet":`;
  let s = fs.readFileSync('src/data/materials-map.ts', 'utf8');
  const i = s.indexOf(anchorLine);
  if (i < 0) { console.error('anchor not found in materials-map'); process.exit(1); }
  const lineEnd = s.indexOf('\n', i);
  const eol = s[lineEnd - 1] === '\r' ? '\r\n' : '\n';
  s = s.slice(0, lineEnd + 1) + entry.replace(/\n$/, eol) + s.slice(lineEnd + 1);
  fs.writeFileSync('src/data/materials-map.ts', s);
  console.log('patched materials-map.ts');
}

// 2) products-materials.ts：插在 makimoo-PERCALE-COCONUT-DUVET 条目之前
{
  const entry = `  {
    "id": "makimoo-${ASIN_UP}",
    "asin": "${ASIN_UP}",
    "title": ${JSON.stringify(TITLE)},
    "handle": "${HANDLE}",
    "description": ${JSON.stringify(descPlain)},
    "descriptionHtml": ${JSON.stringify(descHtml)},
    "productType": "Bedding",
    "tags": [
      "Bedding"
    ],
    "availableForSale": false,
    "images": [
      {
        "url": "/images/products/${ASIN_UP}/1.webp",
        "altText": ${JSON.stringify(TITLE)},
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
        "id": "variant-${ASIN_UP}",
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
`;
  patch('src/data/products-materials.ts', `  {
    "id": "makimoo-PERCALE-COCONUT-DUVET",`, entry, { before: true });
}

// 3) short-titles.ts
patch('src/data/short-titles.ts',
  `  "pompom4-vine-duvet": "Embossed Velvet Duvet Cover, Olive Vine, Queen",`,
  `\n  "${ASIN}": "Washed Cotton Jacquard Duvet Cover, Cream White, Queen",`);

// 4) materials-short-bullets.ts
patch('src/data/materials-short-bullets.ts',
  `    "Easy Care: machine washable, keeps its plush texture",
  ],`,
  `\n  "${ASIN}": [
    "Washed Cotton: soft, broken-in feel from day one",
    "Leaf-Vein Jacquard: yarn-dyed, woven not printed",
    "Standalone Cover: one duvet cover, insert not included",
    "Secure Fit: hidden zipper and interior corner ties",
    "Easy Care: machine washable, softer with every wash",
  ],`);

// 5) specs-overrides.ts
patch('src/data/specs-overrides.ts',
  `  "pompom4-vine-duvet": { material: "Embossed Velvet", dimensionsCm: [220, 220] },`,
  `\n  "${ASIN}": { material: "Washed Cotton-Like", dimensionsCm: [220, 220] },`);

// 6) product-weights.ts
patch('src/data/product-weights.ts',
  `  "pompom4-vine-duvet": {"type":"Bedding","score":3,"perf":3,"boost":0},`,
  `\n  "${ASIN}": {"type":"Bedding","score":3,"perf":3,"boost":0},`);

// 7) new-product-handles.ts
patch('src/data/new-product-handles.ts',
  `  'makimoo-embossed-velvet-pom-pom-duvet-cover-only-olive-vine-queen-pompom4-vine-duvet',  // 2026-10-25：单独被套（Olive Vine 雕花绒球，仅 Queen）`,
  `\n  '${HANDLE}',  // 2026-10-25：单独被套（奶白暗纹提花水洗棉，仅 Queen）`);

// 8) pdp-main-34-asins.ts
patch('src/data/pdp-main-34-asins.ts',
  `  'pompom4-vine-duvet',`,
  `\n  '${ASIN}',`);

// 9) image-aspect-overrides.ts
patch('src/data/image-aspect-overrides.ts',
  `  'pompom4-vine-duvet': '3/4',`,
  `\n  '${ASIN}': '3/4',`);

console.log('ALL DONE');
