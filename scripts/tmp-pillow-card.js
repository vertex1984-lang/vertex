// 临时：模拟 pillows 页家族卡，定位 Pillow Inserts Set of 2 卡片的渲染参数
const path = require('path');
const Module = require('module');
const SRC = path.resolve(__dirname, '../src');
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request.startsWith('@/')) request = path.join(SRC, request.slice(2));
  return origResolve.call(this, request, ...rest);
};
const jiti = require('jiti')(__filename);
const { PRODUCTS_DATA, enrichProductsWithShopifyData } = jiti('@/data/products');
const { buildGroupCards } = jiti('@/lib/group-cards');
const { sortFamiliesByWeight } = jiti('@/lib/family-cards');
const { buildBlanketFamilies } = jiti('@/data/blanket-families');
const { isPillowProduct, pillowTypeOf } = jiti('@/data/pillows-taxonomy');

const products = enrichProductsWithShopifyData(PRODUCTS_DATA).filter(isPillowProduct);
const cards = buildGroupCards(sortFamiliesByWeight(buildBlanketFamilies(products)));
for (const c of cards) {
  if (pillowTypeOf(c.rep) !== 'pillow-inserts') continue;
  console.log('key:', c.key);
  console.log('rep:', c.rep.asin, '| whiteBg[0]:', c.rep.imageWhiteBg?.[0]);
  console.log('imageUrl:', c.imageUrl);
  console.log('variants:', c.variants.map((v) => `${v.asin}(img=${v.imageUrl}, wb=${v.imageWhiteBg?.[0] ?? '?'})`).join(', '));
}
