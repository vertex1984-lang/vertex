/* 用真实数据管线（products.ts + product-tags.ts）跑全站打标分析：
 * 列出标题无颜色词（需要人工指定色系）的产品，并输出色系/场景分布。 */
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

require.extensions['.ts'] = function (m, f) {
  const src = fs.readFileSync(f, 'utf8');
  const out = ts.transpileModule(src, {
    compilerOptions: { module: 'commonjs', target: 'es2020', jsx: 'react' },
  }).outputText;
  m._compile(out, f);
};
const Module = require('module');
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  if (request.startsWith('@/')) request = path.join(process.cwd(), 'src', request.slice(2));
  return origResolve.call(this, request, ...args);
};

const ROOT = process.cwd();
const { PRODUCTS_DATA, enrichProductsWithShopifyData } = require(path.join(ROOT, 'src/data/products.ts'));
const { MATERIALS_MAP } = require(path.join(ROOT, 'src/data/materials-map.ts'));
const { getColorTag, getSceneTag } = require(path.join(ROOT, 'src/data/product-tags.ts'));

// Others 类目不参与 color/scene 分类（2026-09 用户定），分析时跳过
const inStock = enrichProductsWithShopifyData(PRODUCTS_DATA).filter(
  (p) => p.hasShopifyData && p.shopifyAvailable && p.productType !== 'Others'
);

const colorDist = {}, sceneDist = {};
const noColor = [];
inStock.forEach((p) => {
  const fullTitle = MATERIALS_MAP[p.asin.toLowerCase()]?.title || p.title;
  const c = getColorTag(fullTitle, p.asin);
  const s = getSceneTag(fullTitle, p.productType);
  colorDist[c ? c.label : 'NONE'] = (colorDist[c ? c.label : 'NONE'] || 0) + 1;
  sceneDist[s.label] = (sceneDist[s.label] || 0) + 1;
  if (!c) noColor.push({ asin: p.asin, title: fullTitle });
});

console.log('in-stock total:', inStock.length);
console.log('colors:', JSON.stringify(colorDist));
console.log('scenes:', JSON.stringify(sceneDist));
console.log('--- no color word (' + noColor.length + ') ---');
noColor.forEach((p) => console.log(p.asin + '\t' + p.title));
