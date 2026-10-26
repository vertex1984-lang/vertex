// 一次性脚本：在 POMPOM4-OLIVE-SHEET 条目前插入 GINGHAM4 三色四件套产品条目
const fs = require('fs');
const path = 'src/data/products-materials.ts';
let src = fs.readFileSync(path, 'utf8');
if (src.includes('GINGHAM4-BLUE-QUEEN')) {
  console.log('already inserted, skip');
  process.exit(0);
}
const anchor = '{\r\n    "id": "makimoo-POMPOM4-OLIVE-SHEET"';
if (!src.includes(anchor)) throw new Error('anchor not found');

const PRODUCTS = [
  {
    asin: 'GINGHAM4-BLUE-QUEEN',
    handle: 'makimoo-queen-bedding-set-4-piece-cotton-feel-gingham-blue-queen',
    title: 'Makimoo Queen Bedding Set 4 Piece Cotton Feel Gingham Duvet Cover Fitted Sheet 2 Pillowcases 88 x 88 in (Blue Gingham)',
    colorPara1: 'Cotton-Feel Polyester with Classic Gingham: Woven from soft brushed polyester with the relaxed, garment-washed hand of cotton, the duvet cover and pillowcases feature a timeless blue and white gingham check. Reversible AB design—the A side shows the gingham check, while the B side is a clean solid dusty blue.',
    colorPara5: 'Fresh Blue Gingham Colorway: A classic blue and white check—crisp, cheerful and quietly nostalgic, it brings an easy cottage freshness to the bedroom, pairing easily with modern, classic, or cozy décor.',
  },
  {
    asin: 'GINGHAM4-BLACK-QUEEN',
    handle: 'makimoo-queen-bedding-set-4-piece-cotton-feel-gingham-black-queen',
    title: 'Makimoo Queen Bedding Set 4 Piece Cotton Feel Gingham Duvet Cover Fitted Sheet 2 Pillowcases 88 x 88 in (Black Gingham)',
    colorPara1: 'Cotton-Feel Polyester with Classic Gingham: Woven from soft brushed polyester with the relaxed, garment-washed hand of cotton, the duvet cover and pillowcases feature a timeless black and white gingham check. Reversible AB design—the A side shows the gingham check, while the B side is a clean solid charcoal black.',
    colorPara5: 'Bold Black Gingham Colorway: A graphic black and white check—grounded and calm rather than loud, it anchors the bedroom with a modern farmhouse edge, pairing easily with wood tones, neutrals, or minimalist décor.',
  },
  {
    asin: 'GINGHAM4-GREY-QUEEN',
    handle: 'makimoo-queen-bedding-set-4-piece-cotton-feel-gingham-grey-queen',
    title: 'Makimoo Queen Bedding Set 4 Piece Cotton Feel Gingham Duvet Cover Fitted Sheet 2 Pillowcases 88 x 88 in (Grey Gingham)',
    colorPara1: 'Cotton-Feel Polyester with Classic Gingham: Woven from soft brushed polyester with the relaxed, garment-washed hand of cotton, the duvet cover and pillowcases feature a timeless grey and white gingham check. Reversible AB design—the A side shows the gingham check, while the B side is a clean solid light grey.',
    colorPara5: 'Soft Grey Gingham Colorway: A gentle grey and white check—low-saturation and quietly warm, it brings a calm, effortless order to the bedroom, pairing easily with modern, classic, or cozy décor.',
  },
];

const para2 = 'Breathable & Skin-Friendly All Season: The washed plain weave feels soft, airy and gentle against the skin, keeping you comfortable through warm summers and layered cozy in cooler months.';
const para3 = 'Complete Queen 4-Piece Set: This bedding set includes 1 duvet cover (88 x 88 in), 1 fitted sheet (60 x 80 in) with all-around elastic for a secure fit, and 2 pillowcases (20 x 30 in), giving you everything you need for a coordinated, polished bed.';
const para4 = 'Thoughtful Details & Easy Care: A hidden zipper closure and interior corner ties keep your comforter neatly in place; the set is machine washable and gets even softer with every wash.';

const blocks = PRODUCTS.map((p) => {
  const sentences = [p.colorPara1, para2, para3, para4, p.colorPara5];
  return {
    id: `makimoo-${p.asin}`,
    asin: p.asin,
    title: p.title,
    handle: p.handle,
    description: sentences.join(' '),
    descriptionHtml: sentences.map((s) => `<p>${s}</p>`).join(''),
    productType: 'Bedding',
    tags: ['Bedding'],
    availableForSale: false,
    images: [{ url: `/images/products/${p.asin}/1.webp`, altText: p.title, width: 1440, height: 1920 }],
    priceRange: { minVariantPrice: { amount: '0.00', currencyCode: 'USD' } },
    variants: [
      {
        id: `variant-${p.asin}`,
        title: 'Default Title',
        price: { amount: '0.00', currencyCode: 'USD' },
        availableForSale: false,
        selectedOptions: [],
      },
    ],
    amazonUrl: '',
  };
});

// 与邻条目同风格：JSON 4 空格缩进 + 行间 \r\n；条目间逗号分隔
const fixed = blocks.map((b) => JSON.stringify(b, null, 4).split('\n').join('\r\n')).join(',\r\n');
const out = src.replace(anchor, fixed + ',\r\n' + anchor);
fs.writeFileSync(path, out);
console.log('inserted 3 products, new length:', out.length);
