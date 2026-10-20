import { PRODUCTS_DATA, enrichProductsWithShopifyData } from '../src/data/products.ts';
const all = enrichProductsWithShopifyData(PRODUCTS_DATA);
const towels = all.filter(p => p.productType.toLowerCase() === 'towels');
console.log('total towels:', towels.length);
for (const p of towels) {
  console.log([p.asin, p.subcategory, p.title.slice(0,95), (p.images[0]||{}).url].join(' | '));
}
