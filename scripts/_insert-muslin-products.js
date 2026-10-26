// 一次性脚本：在 POMPOM4-OLIVE-SHEET 条目前插入 1688-1025015219200 Cotton Blend Muslin 双层纱四件套三色产品条目
// （结构完全照抄上方 GINGHAM4 三色条目；顺序 C1 Grey → C2 Navy → C3 Brown，Grey 为主款/组首）
const fs = require('fs');
const path = 'src/data/products-materials.ts';
let src = fs.readFileSync(path, 'utf8');
if (src.includes('1688-1025015219200-C1')) {
  console.log('already inserted, skip');
  process.exit(0);
}
const anchor = '{\r\n    "id": "makimoo-POMPOM4-OLIVE-SHEET"';
if (!src.includes(anchor)) throw new Error('anchor not found');

const P2 = 'Breathable & Skin-Friendly All Season: The double-layer gauze weave lets air circulate freely, feeling cool and gentle against the skin through warm summers and layering cozy in cooler months.';
const P3 = 'Complete Queen 4-Piece Set: This bedding set includes 1 duvet cover (88 x 88 in), 1 fitted sheet (60 x 80 in) with all-around elastic for a secure fit, and 2 pillowcases (20 x 30 in), giving you everything you need for a coordinated, polished bed.';
const P4 = 'Thoughtful Details & Easy Care: A hidden zipper closure and interior corner ties keep your comforter neatly in place; the cotton blend fabric (85% cotton, 15% polyester) is machine washable and gets even softer with every wash.';
const P1 = 'Cotton Blend Muslin Double Gauze: Woven from a soft cotton blend—85% cotton, 15% polyester—in an airy double gauze construction, two whisper-light layers of muslin give this set a fluffy, featherlight hand with a gently crinkled, lived-in texture.';

const PRODUCTS = [
  {
    asin: '1688-1025015219200-C1',
    color: 'Grey',
    handle: 'cotton-blend-muslin-double-gauze-4-piece-bedding-set-grey-queen-1688-1025015219200-c1',
    colorPara5: 'Calm Grey Colorway: A soft, heathered light grey—quiet, airy and endlessly versatile, it brings a cloud-like calm to the bedroom, pairing easily with modern, classic, or cozy décor.',
  },
  {
    asin: '1688-1025015219200-C2',
    color: 'Navy',
    handle: 'cotton-blend-muslin-double-gauze-4-piece-bedding-set-navy-queen-1688-1025015219200-c2',
    colorPara5: 'Deep Navy Colorway: A rich, muted navy—grounded and serene rather than stark, it anchors the bedroom with a relaxed coastal depth, pairing easily with crisp whites, warm woods, or minimalist décor.',
  },
  {
    asin: '1688-1025015219200-C3',
    color: 'Brown',
    handle: 'cotton-blend-muslin-double-gauze-4-piece-bedding-set-brown-queen-1688-1025015219200-c3',
    colorPara5: 'Warm Brown Colorway: A soft, earthy brown—warm and understated, it wraps the bedroom in a cozy, lived-in warmth, pairing easily with creams, natural textures, or rustic décor.',
  },
];

const blocks = PRODUCTS.map((p) => {
  const title = `Makimoo Queen Bedding Set 4 Piece Cotton Blend Muslin Double Gauze Duvet Cover Fitted Sheet 2 Pillowcases 88 x 88 in (${p.color})`;
  const sentences = [P1, P2, P3, P4, p.colorPara5];
  return {
    id: `makimoo-${p.asin}`,
    asin: p.asin,
    title,
    handle: p.handle,
    description: sentences.join(' '),
    descriptionHtml: sentences.map((s) => `<p>${s}</p>`).join(''),
    productType: 'Bedding',
    tags: ['Bedding'],
    availableForSale: false,
    images: [{ url: `/images/products/${p.asin}/1.webp`, altText: title, width: 1440, height: 1920 }],
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
