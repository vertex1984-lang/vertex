/* vertex 侧合并验证：新品是否真的进入 PRODUCTS_DATA / VARIANT_GROUPS */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import ts from 'typescript';

const VERTEX_ROOT = 'D:/opencode_workspace/vertex';
const require = createRequire(import.meta.url);
require.extensions['.ts'] = function (m, f) {
  const out = ts.transpileModule(fs.readFileSync(f, 'utf8'), {
    compilerOptions: { module: 'commonjs', target: 'es2020', jsx: 'react' },
  }).outputText;
  m._compile(out, f);
};
const Module = require('module');
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  if (request.startsWith('@/')) request = path.join(VERTEX_ROOT, 'src', request.slice(2));
  return origResolve.call(this, request, ...args);
};

const { PRODUCTS_DATA, enrichProductsWithShopifyData, getProductByHandle } = require(path.join(VERTEX_ROOT, 'src/data/products.ts'));
console.log('PRODUCTS_DATA raw:', PRODUCTS_DATA.length, '(2323 + 4 = 2327)');
const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA);
console.log('enriched:', enriched.length, '(2238 + 4 = 2242)');
const p = getProductByHandle('makimoo-bamboo-cooling-sheet-set-sage-queen');
console.log('getProductByHandle 新品命中:', !!p, '| productType:', p && p.productType, '| availableForSale:', p && p.availableForSale);
const vg = require(path.join(VERTEX_ROOT, 'src/data/variant-groups.ts'));
const g = vg.VARIANT_GROUPS.find((x) => x.id === 'bamboo-cooling-sheet-set');
console.log('VARIANT_GROUPS 新组命中:', !!g, '| members:', g && g.members.length);
