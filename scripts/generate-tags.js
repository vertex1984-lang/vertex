/* 用真实数据管线（products.ts + product-tags.ts）生成持久化标签 JSON：
 * 遍历全部在售产品，按完整标题打 color/scene，并从标题提取套装数 pieces，
 * 输出 src/data/product-tags.json（key = 小写 asin，按 key 排序）。
 * 新品/规则变更后重跑：node scripts/generate-tags.js
 *
 * 手工配置保护：现有 JSON 中带 "manual": true 的条目（管理工具人工指定的 color/scene）
 * 不被自动打标覆盖——保留其手工 color/scene 和 manual 标记，只刷新 pieces。
 * 带 "manualPieces": true 的条目（管理工具人工指定的 Pack 件数）保留其手工 pieces，不刷新。
 * 被在售过滤排除的产品（如缺货）：带 manual/manualPieces 的条目原样保留，不随重建删除。 */
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
const { getColorTag, getSceneTag, NO_TAG_TYPES } = require(path.join(ROOT, 'src/data/product-tags.ts'));

// 套装数：从完整标题提取，取第一个命中，都没有则 null
const PIECES_PATTERNS = [
  /set of (\d+)/i,
  /(\d+)\s*[- ]?pack/i,
  /(\d+)\s*[- ]?piece/i,
];
const extractPieces = (title) => {
  for (const re of PIECES_PATTERNS) {
    const m = title.match(re);
    if (m) return parseInt(m[1], 10);
  }
  return null;
};

// 在售产品 + 素材库新品（无 Shopify 数据）：新品提前打标持久化，建品上架后自动生效；
// 静态页仍只按在售产品生成（tagged.ts 过滤），缺货新品的标签不会影响现有页面。
// Others / Decor / Dining 类目不参与 color/scene 分类（2026-09 用户定），直接跳过
const inStock = enrichProductsWithShopifyData(PRODUCTS_DATA).filter(
  (p) => ((p.hasShopifyData && p.shopifyAvailable) || !p.hasShopifyData) && !NO_TAG_TYPES.has(p.productType)
);

const tags = {};
const noColor = [];
const colorDist = {}, sceneDist = {};
let piecesCount = 0;
let manualCount = 0;
let manualPiecesCount = 0;

// 读取现有 JSON：带 manual: true 的条目保留手工 color/scene，防止被自动打标冲掉
const outPath = path.join(ROOT, 'src/data/product-tags.json');
let existing = {};
try {
  existing = JSON.parse(fs.readFileSync(outPath, 'utf8'));
} catch { /* 文件不存在则全部自动打标 */ }

inStock.forEach((p) => {
  const asin = p.asin.toLowerCase();
  const fullTitle = MATERIALS_MAP[asin]?.title || p.title;
  const prev = existing[asin];
  // 手工 Pack 件数保护：manualPieces 条目不刷新 pieces
  const keepPieces = prev && prev.manualPieces;
  const pieces = keepPieces ? prev.pieces ?? null : extractPieces(fullTitle);
  if (prev && prev.manual) {
    // 手工配置：color/scene 原样保留，只刷新 pieces（manualPieces 除外）
    tags[asin] = { color: prev.color ?? null, scene: prev.scene ?? null, pieces, manual: true };
    colorDist['MANUAL'] = (colorDist['MANUAL'] || 0) + 1;
    manualCount++;
  } else {
    const c = getColorTag(fullTitle, p.asin);
    const s = getSceneTag(fullTitle, p.productType);
    tags[asin] = { color: c ? c.key : null, scene: s.key, pieces };
    colorDist[c ? c.key : 'NONE'] = (colorDist[c ? c.key : 'NONE'] || 0) + 1;
    sceneDist[s.key] = (sceneDist[s.key] || 0) + 1;
    if (!c) noColor.push({ asin, title: fullTitle });
  }
  if (keepPieces) {
    tags[asin].manualPieces = true;
    manualPiecesCount++;
  }
  if (!keepPieces && pieces !== null) piecesCount++;
});

// 被在售过滤排除的产品（如缺货）：其手工 color/scene 和 manualPieces 原样保留，
// 否则输出 JSON 全量重建会把这些手工配置静默删掉
const inStockAsins = new Set(inStock.map((p) => p.asin.toLowerCase()));
let manualCarriedCount = 0;
Object.keys(existing).forEach((asin) => {
  const prev = existing[asin];
  if (!prev || inStockAsins.has(asin)) return;
  if (prev.manual || prev.manualPieces) {
    tags[asin] = prev;
    manualCarriedCount++;
  }
});

const sorted = {};
Object.keys(tags).sort().forEach((k) => { sorted[k] = tags[k]; });

fs.writeFileSync(outPath, JSON.stringify(sorted, null, 2) + '\n', 'utf8');

console.log('written:', path.relative(ROOT, outPath));
console.log('in-stock total:', inStock.length);
console.log('manual preserved:', manualCount);
console.log('manual pieces preserved:', manualPiecesCount);
console.log('manual carried (excluded/out-of-stock):', manualCarriedCount);
console.log('colors:', JSON.stringify(colorDist));
console.log('scenes:', JSON.stringify(sceneDist));
console.log('pieces extracted:', piecesCount);
if (noColor.length > 0) {
  console.log('--- WARNING: no color (' + noColor.length + ')，请在 COLOR_OVERRIDES 人工指定 ---');
  noColor.forEach((p) => console.log(p.asin + '\t' + p.title));
} else {
  console.log('no null color remaining.');
}
