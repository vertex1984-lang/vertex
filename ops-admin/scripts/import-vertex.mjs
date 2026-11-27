/* 从 vertex 仓库导入商品快照 → data/snapshot.json
 * 读取 vertex 的 products.ts（enrich 后与前台渲染一致）+ scenes.ts（死链诊断）。
 * 用法：node scripts/import-vertex.mjs   （VERTEX_ROOT 环境变量可覆盖默认路径）
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ADMIN_ROOT = path.resolve(__dirname, '..');
const VERTEX_ROOT = process.env.VERTEX_ROOT || path.resolve(ADMIN_ROOT, '..', 'vertex');
const require = createRequire(import.meta.url);

// —— TS 加载器（与 vertex/scripts/admin-server.js 同方案）——
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
  if (request.startsWith('@/')) request = path.join(VERTEX_ROOT, 'src', request.slice(2));
  return origResolve.call(this, request, ...args);
};

console.log(`VERTEX_ROOT = ${VERTEX_ROOT}`);

// —— 商品（enrich 后的数据 = 前台最终渲染口径）——
const productsModule = require(path.join(VERTEX_ROOT, 'src', 'data', 'products.ts'));
const { PRODUCTS_DATA, enrichProductsWithShopifyData, isHiddenProduct } = productsModule;
const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA);
console.log(`商品：raw ${PRODUCTS_DATA.length} → enrich（滤隐藏后）${enriched.length}`);

// —— 场景（死链诊断，口径 = 三方对照：scenes 热区 × PRODUCTS_DATA × out 落地页）——
// noProduct：handle 不在商品表 → getProductByHandle 找不到，圆点被滤（不 404，数据债）
// noPage：handle 在表但 out/ 无落地页（隐藏商品）→ 圆点会渲染并 404（严重，需修）
let deadSkus = [];
let noPageSkus = [];
let sceneCount = 0;
let hotspotCount = 0;
try {
  const { SCENES } = require(path.join(VERTEX_ROOT, 'src', 'data', 'scenes.ts'));
  const rawHandles = new Set(PRODUCTS_DATA.map((p) => p.handle.toLowerCase()));
  const OUT_PRODUCTS = path.join(VERTEX_ROOT, 'out', 'products');
  const hasPage = (hd) => fs.existsSync(path.join(OUT_PRODUCTS, hd, 'index.html'));
  const noProduct = new Map();
  const noPage = new Map();
  for (const s of SCENES) {
    sceneCount++;
    for (const h of s.hotspots || []) {
      hotspotCount++;
      const hd = h.handle.toLowerCase();
      if (!rawHandles.has(hd)) {
        if (!noProduct.has(hd)) noProduct.set(hd, []);
        noProduct.get(hd).push(s.slug);
      } else if (!hasPage(hd)) {
        if (!noPage.has(hd)) noPage.set(hd, []);
        noPage.get(hd).push(s.slug);
      }
    }
  }
  deadSkus = [...noProduct.entries()].map(([handle, scenes]) => ({ handle, scenes, kind: 'no-product' }));
  noPageSkus = [...noPage.entries()].map(([handle, scenes]) => ({ handle, scenes, kind: 'no-page' }));
  console.log(`场景：${sceneCount} 张 / ${hotspotCount} 热区 / 真死链 ${deadSkus.length} / 404 风险 ${noPageSkus.length}`);
} catch (e) {
  console.warn('scenes.ts 导入失败，跳过死链诊断：', e.message);
}

// —— 归一化快照 ——
const products = enriched.map((p) => {
  const price = Number(p.shopifyPrice ?? p.priceRange?.minVariantPrice?.amount ?? 0);
  const available = p.shopifyAvailable ?? p.availableForSale ?? false;
  const images = p.shopifyImages || (p.images || []).map((i) => i.url) || [];
  const derivedStatus = price === 0 ? 'coming_soon' : available ? 'live' : 'unavailable';
  return {
    handle: p.handle,
    asin: p.asin,
    title: p.title,
    // 批次 3+：PDP 描述基线（enrich 后口径 = 前台最终渲染文本）——编辑页「打开即回填
    // 当前生效描述」的数据源；发布覆盖在 effectiveProducts 归并时套用
    description: p.description ?? '',
    productType: p.productType,
    subcategory: p.subcategory || null,
    tags: p.tags || [],
    price,
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    available,
    hasShopifyData: !!p.hasShopifyData,
    images,
    derivedStatus,
  };
});

const hiddenRaw = PRODUCTS_DATA.filter((p) => isHiddenProduct(p)).length;
const byCategory = {};
for (const p of products) byCategory[p.productType] = (byCategory[p.productType] || 0) + 1;

const snapshot = {
  importedAt: new Date().toISOString(),
  vertexRoot: VERTEX_ROOT,
  stats: {
    total: products.length,
    live: products.filter((p) => p.derivedStatus === 'live').length,
    comingSoon: products.filter((p) => p.derivedStatus === 'coming_soon').length,
    unavailable: products.filter((p) => p.derivedStatus === 'unavailable').length,
    noShopify: products.filter((p) => !p.hasShopifyData).length,
    hiddenRaw,
    sceneCount,
    hotspotCount,
    deadSkuCount: deadSkus.length,
    noPageCount: noPageSkus.length,
    byCategory,
  },
  products,
  deadSkus,
  noPageSkus,
};

const out = path.join(ADMIN_ROOT, 'data', 'snapshot.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(snapshot));
console.log(
  `快照完成：${products.length} 商品（在售 ${snapshot.stats.live} / Coming Soon ${snapshot.stats.comingSoon} / 不可售 ${snapshot.stats.unavailable}）→ ${out}`
);
