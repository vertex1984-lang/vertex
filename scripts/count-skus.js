// 一次性：按"每个颜色×尺寸 SKU 都算一个产品"统计 bedding / pillows 数量（与页面口径一致）
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const ROOT = path.join(__dirname, '..');
require.extensions['.ts'] = (mod, filename) => {
  const src = fs.readFileSync(filename, 'utf8');
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  mod._compile(js, filename);
};
const Module = require('module');
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  if (request.startsWith('@/')) request = path.join(ROOT, 'src', request.slice(2));
  return origResolve.call(this, request, ...args);
};
const { PRODUCTS_DATA, enrichProductsWithShopifyData } = require(path.join(ROOT, 'src/data/products.ts'));
const { isPillowProduct } = require(path.join(ROOT, 'src/data/pillows-taxonomy.ts'));

const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA);
const bedding = enriched.filter((p) => p.productType.toLowerCase() === 'bedding');
const pillows = enriched.filter(isPillowProduct);
console.log('Bedding SKU 总数:', bedding.length);
console.log('Pillows SKU 总数（含 travel 跨挂）:', pillows.length);
console.log('  其中 productType=Pillows:', enriched.filter((p) => p.productType.toLowerCase() === 'pillows').length);
console.log('  其中跨挂（非 Pillows 类型）:', pillows.filter((p) => p.productType.toLowerCase() !== 'pillows').length);
