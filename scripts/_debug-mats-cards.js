const ts = require('typescript');
const fs = require('fs');
const path = require('path');
const Module = require('module');
const ROOT = path.join(__dirname, '..');
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  if (request.startsWith('@/')) request = path.join(ROOT, 'src', request.slice(2));
  try { return origResolve.call(this, request, parent, ...rest); } catch (e) {
    const base = path.resolve(path.dirname(parent.filename), request);
    for (const cand of [base + '.ts', path.join(base, 'index.ts')]) if (fs.existsSync(cand)) return cand;
    throw e;
  }
};
require.extensions['.ts'] = function (m, filename) {
  const src = fs.readFileSync(filename, 'utf8');
  const out = ts.transpileModule(src, { compilerOptions: { module: 'commonjs', target: 'es2020', esModuleInterop: true } }).outputText;
  m._compile(out, filename);
};
require.extensions['.tsx'] = require.extensions['.ts'];
const { PRODUCTS_DATA, enrichProductsWithShopifyData } = require('../src/data/products.ts');
const { buildBlanketFamilies } = require('../src/data/blanket-families.ts');
const { buildGroupCards } = require('../src/lib/group-cards.ts');
const mats = enrichProductsWithShopifyData(PRODUCTS_DATA).filter((p) => p.productType.toLowerCase() === 'mats');
const families = buildBlanketFamilies(mats);
const cards = buildGroupCards(families);
for (const c of cards) {
  if (/berber|nordic|patchwork/i.test(c.key + c.rep.title)) {
    console.log('CARD key=' + c.key, '| variants=' + c.variants.length, '| rep=' + c.rep.asin, '| title=' + (c.titleOverride || c.rep.title).slice(0, 90));
  }
}
console.log('---families---');
for (const f of families) {
  if (/berber|nordic|patchwork/i.test(f.key)) {
    console.log('FAM key=' + f.key, '| members=' + f.members.length, '| rep=' + f.rep.asin);
  }
}
