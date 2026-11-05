// 临时验证脚本：mats 选购视图数据管线（2026-11-05 取消分区后版）
// 用 typescript transpile + require hook 直接跑 src 数据层，模拟 V2MatsShop 的
// 家族/组卡计算（单一网格、不传 extraKey），打印家族数与组卡数，抽样检查卡面标题与 From 价，
// 并检查同网格内是否有重复卡面标题（跨分类合并是否生效）。
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
    const base = path.resolve(path.dirname(parent.filename), request);
    for (const cand of [base + '.ts', path.join(base, 'index.ts')]) {
      if (fs.existsSync(cand)) return cand;
    }
    throw e;
  }
};

require.extensions['.ts'] = function (m, filename) {
  const src = fs.readFileSync(filename, 'utf8');
  const out = ts.transpileModule(src, {
    compilerOptions: { module: 'commonjs', target: 'es2020', esModuleInterop: true, jsx: 'react' },
  }).outputText;
  m._compile(out, filename);
};
require.extensions['.tsx'] = require.extensions['.ts'];

const { PRODUCTS_DATA, enrichProductsWithShopifyData } = require('../src/data/products.ts');
const { buildBlanketFamilies } = require('../src/data/blanket-families.ts');
const { sortFamiliesByWeight } = require('../src/lib/family-cards.ts');
const { buildGroupCards } = require('../src/lib/group-cards.ts');

const mats = enrichProductsWithShopifyData(PRODUCTS_DATA).filter(
  (p) => p.productType.toLowerCase() === 'mats'
);
console.log('mats SKU 总数:', mats.length);

// 新口径：不传 extraKey（跨二级分类合并同色族）
const families = sortFamiliesByWeight(buildBlanketFamilies(mats));
console.log('家族总数:', families.length);

const cards = buildGroupCards(families);
console.log('组卡总数:', cards.length);

let bad = 0;
const seenTitles = new Map();
for (const c of cards) {
  const title = (c.titleOverride || c.rep.title).replace(/,\s*(Twin|Full|Queen|King|\d+\s*x\s*\d*\s*cm)$/i, '');
  if (!title || title.length > 80) { bad++; console.log('⚠️ 标题异常:', title); }
  if (!(c.fromPrice > 0)) { bad++; console.log('⚠️ From 价异常:', title); }
  const k = title.toLowerCase();
  if (seenTitles.has(k)) { bad++; console.log('⚠️ 重复卡面标题:', title, '↔', seenTitles.get(k)); }
  else seenTitles.set(k, c.key);
}
console.log('\n前 5 张卡抽样:');
for (const c of cards.slice(0, 5)) {
  const title = (c.titleOverride || c.rep.title).replace(/,\s*(Twin|Full|Queen|King|\d+\s*x\s*\d*\s*cm)$/i, '');
  console.log(`  ${title} | From ${c.currency} ${c.fromPrice} | 色 ${c.variants.length} | ${c.rep.hasShopifyData ? '在库' : '缺货'}`);
}
console.log(bad === 0 ? '\nOK：无异常、无重复卡面' : `\n⚠️ ${bad} 处异常`);
