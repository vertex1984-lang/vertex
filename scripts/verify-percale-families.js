/* 一次性验证：percale 24 SKU 在 bedding 家族分组里的卡片表现（2026-10-17） */
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
const { buildSetFamilies, clusterSetFamilies } = require(path.join(ROOT, 'src/data/bedding-families.ts'));

const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA);
const bedding = enriched.filter((p) => p.productType === 'Bedding');
const families = clusterSetFamilies(buildSetFamilies(bedding));
const percale = families.filter((f) => f.key.toLowerCase().startsWith('percale-'));
console.log(`percale 家族数: ${percale.length}`);
for (const f of percale) {
  console.log(`- key=${f.key} | kind=${f.kind} | 卡标题="${f.titleOverride}" | 尺寸=[${f.sizes.join(', ')}] | rep=${f.rep.asin} | 图=${f.rep.images?.[0]?.url}`);
}
//  sanity：butter/dill 不应再出现
const gone = families.filter((f) => /butter|dill/i.test(f.key));
console.log(`butter/dill 家族残留: ${gone.length}`);
