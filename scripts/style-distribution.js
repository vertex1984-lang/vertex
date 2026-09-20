/* Shop by Style 风格分布调研：按 getStyleTag 规则对全部在售产品打风格标，
 * 输出每个风格的产品数 + 示例标题，供确认规则效果（不入库、不写 JSON）。
 * 运行：node scripts/style-distribution.js */
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
const { getStyleTag, STYLE_RULES } = require(path.join(ROOT, 'src/data/product-tags.ts'));

const inStock = enrichProductsWithShopifyData(PRODUCTS_DATA).filter(
  (p) => p.hasShopifyData && p.shopifyAvailable
);

const byStyle = new Map();
for (const p of inStock) {
  const title = MATERIALS_MAP[p.asin.toLowerCase()]?.title || p.title;
  const tag = getStyleTag(title, p.productType);
  if (!byStyle.has(tag.key)) byStyle.set(tag.key, []);
  byStyle.get(tag.key).push(`[${p.productType}] ${title}`);
}

console.log(`在售产品 ${inStock.length} 款，风格分布：\n`);
for (const rule of STYLE_RULES) {
  const list = byStyle.get(rule.key) || [];
  console.log(`${rule.label} (${rule.key}) — ${list.length} 款`);
  list.slice(0, 4).forEach((t) => console.log('   ', t.slice(0, 95)));
  if (list.length > 4) console.log(`    ... 另 ${list.length - 4} 款`);
  console.log('');
}
