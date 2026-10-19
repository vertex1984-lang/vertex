// 临时验证脚本：用 typescript  transpile + require hook 直接跑 src 数据层
const ts = require('typescript');
const fs = require('fs');
const path = require('path');
const Module = require('module');
const ROOT = path.join(__dirname, '..');

const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  if (request.startsWith('@/')) request = path.join(ROOT, 'src', request.slice(2));
  try {
    return origResolve.call(this, request, parent, ...rest);
  } catch (e) {
    // 扩展名省略的 .ts 导入
    const base = path.resolve(path.dirname(parent.filename), request);
    for (const cand of [base + '.ts', path.join(base, 'index.ts')]) {
      if (fs.existsSync(cand)) return cand;
    }
    throw e;
  }
};
require.extensions['.ts'] = function (module, filename) {
  const src = fs.readFileSync(filename, 'utf8');
  const { outputText } = ts.transpileModule(src, {
    compilerOptions: { module: 'commonjs', target: 'es2019', esModuleInterop: true },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

const { PRODUCTS_DATA, enrichProductsWithShopifyData } = require(path.join(ROOT, 'src/data/products.ts'));
const { buildBlanketFamilies, blanketSectionOf, BLANKET_SECTIONS } = require(path.join(ROOT, 'src/data/blanket-families.ts'));

const blankets = enrichProductsWithShopifyData(PRODUCTS_DATA).filter(
  (p) => p.productType.toLowerCase() === 'blankets'
);
console.log('hero 上标数（全部 SKU）:', blankets.length);

const fams = buildBlanketFamilies(blankets);
const bySection = new Map();
for (const f of fams) {
  const k = blanketSectionOf(f);
  if (!bySection.has(k)) bySection.set(k, []);
  bySection.get(k).push(f);
}
let totalCards = 0;
for (const s of BLANKET_SECTIONS) {
  const list = bySection.get(s.key) || [];
  if (!list.length) continue;
  totalCards += list.length;
  console.log(`#${s.key} (${s.label}): ${list.length} 张家族卡 — ${list.map((f) => f.color || f.rep.asin).join(', ')}`);
  // 尺寸带抽查
  const f0 = list[0];
  console.log(`   示例: key=${f0.key} sizes=[${f0.sizes.join(' / ')}] from=${f0.fromPrice} rep=${f0.rep.asin}`);
}
console.log('家族卡总数:', totalCards, '| 家族总数:', fams.length);
