// 一次性脚本：在 POMPOM4-OLIVE-SHEET 条目前插入 PERCALEJAC-IVORY-PC-QUEEN 产品条目
const fs = require('fs');
const path = 'src/data/products-materials.ts';
const src = fs.readFileSync(path, 'utf8');
if (src.includes('PERCALEJAC-IVORY-PC-QUEEN')) {
  console.log('already inserted, skip');
  process.exit(0);
}
const anchor = '{\r\n    "id": "makimoo-POMPOM4-OLIVE-SHEET"';
if (!src.includes(anchor)) throw new Error('anchor not found');

const title = 'Makimoo 100% Cotton Percale Jacquard Pillowcases Set of 2 Queen Size 20 x 30 in (Ivory White, Queen)';
const sentences = [
  '100% Cotton Percale Jacquard: Woven in a crisp, tightly woven cotton percale, these pillowcases feature a yarn-dyed diamond-and-braid jacquard with a subtle sculpted texture—woven, not printed—so the pattern stays true wash after wash.',
  'Set of 2 Pillowcases, Queen Size: Two matching pillowcases (20 x 30 in). Pillow inserts are NOT included—slip them over your pillows to instantly refresh the bed.',
  'Reversible AB Design: The A side shows the ivory jacquard pattern, while the B side is a smooth, solid percale in a warm beige tone—two looks in one set.',
  'Breathable & Skin-Friendly All Season: The percale plain weave feels cool, smooth and gentle against skin and hair, keeping you comfortable year-round.',
  'Easy Care: Machine washable and keeps its crisp hand and woven texture wash after wash.',
  'Soothing Ivory White Colorway: A soft ivory white with a warm beige reverse—low-saturation and quietly warm, pairing easily with modern, classic, or cozy bedding.',
];
const entry = {
  id: 'makimoo-PERCALEJAC-IVORY-PC-QUEEN',
  asin: 'PERCALEJAC-IVORY-PC-QUEEN',
  title,
  handle: 'makimoo-cotton-percale-jacquard-pillowcases-set-of-2-queen-ivory-percalejac-ivory-pc-queen',
  description: sentences.join(' '),
  descriptionHtml: sentences.map((s) => `<p>${s}</p>`).join(''),
  productType: 'Bedding',
  tags: ['Bedding'],
  availableForSale: false,
  images: [1, 2, 3].map((n) => ({
    url: `/images/products/PERCALEJAC-IVORY-PC-QUEEN/${n}.webp`,
    altText: title,
    width: 1440,
    height: 1920,
  })),
  priceRange: { minVariantPrice: { amount: '0.00', currencyCode: 'USD' } },
  variants: [
    {
      id: 'variant-PERCALEJAC-IVORY-PC-QUEEN',
      title: 'Default Title',
      price: { amount: '0.00', currencyCode: 'USD' },
      availableForSale: false,
      selectedOptions: [],
    },
  ],
  amazonUrl: '',
};
// 与邻条目同风格：JSON 4 空格缩进 + 行间 \r\n
const fixed = JSON.stringify(entry, null, 4).split('\n').join('\r\n');
const out = src.replace(anchor, fixed + '\r\n' + anchor);
fs.writeFileSync(path, out);
console.log('inserted, new length:', out.length);
