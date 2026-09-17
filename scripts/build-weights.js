/**
 * build-weights.js — 产品权重体系：自动表现分 + 人工赋权，生成 src/data/product-weights.ts
 *
 * 总分 = 表现分（0–100）+ boost（±30 clamp）；pin 硬置顶 / bury 沉底 / exclude 排除。
 * 表现分构成（v1）：
 *  - 销量 60 分：scripts/sales-data.json（asin → 近90天销量，由 Shopify Admin API 同步生成，
 *    暂无该文件时此项为 0，其余信号仍构成相对排序）——log1p 归一
 *  - 新鲜度 15 分：Shopify createdAt，上架 0 天 = 15，90 天线性衰减到 0
 *  - 评价 15 分：贝叶斯平均（防少样本高分），(bayes-3)/2 映射；全站暂无评价数据时为 0
 *  - 内容完整度 10 分：图片数（≥4 张满分 6）+ 规格（尺寸 +2 / 材质 +2）
 * 人工赋权表：src/data/weights-overrides.ts（boost/pin/bury/exclude/until/note）
 *
 * 用法：node scripts/build-weights.js（幂等；已加入 npm run build 链）
 */

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = path.join(__dirname, '..');
const OUT_TS = path.join(ROOT, 'src/data/product-weights.ts');
const SALES_JSON = path.join(__dirname, 'sales-data.json');

const FRESHNESS_MAX = 15, FRESHNESS_DAYS = 90;
const RATING_MAX = 15, RATING_PRIOR = 3.8, RATING_PRIOR_COUNT = 10;
const CONTENT_MAX = 10;
const SALES_MAX = 60;
const BOOST_CAP = 30;
const PIN_LIMIT = 3;

/** 注册 .ts require hook（项目数据文件都是相对引用的纯字面量导出，直接当 CJS 加载） */
require.extensions['.ts'] = (mod, filename) => {
  const src = fs.readFileSync(filename, 'utf8');
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  mod._compile(js, filename);
};

// '@/x' 别名 → src/x（Next.js tsconfig paths，Node 侧需要手动映射）
const Module = require('module');
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  if (request.startsWith('@/')) request = path.join(ROOT, 'src', request.slice(2));
  return origResolve.call(this, request, ...args);
};

function loadTs(relPath) {
  return require(path.join(ROOT, relPath));
}

function main() {
  const { PRODUCTS_DATA, enrichProductsWithShopifyData } = loadTs('src/data/products.ts');
  const { SHOPIFY_MAP } = loadTs('src/data/shopify-map.ts');
  const { MATERIALS_MAP } = loadTs('src/data/materials-map.ts');
  const { PRODUCT_SPECS } = loadTs('src/data/product-specs.ts');
  const { WEIGHT_OVERRIDES, GROUP_BOOSTS } = loadTs('src/data/weights-overrides.ts');

  // 销量数据（可选）：{ "asin": units90d }；文件损坏时降级为销量 0，不阻断构建
  let sales = {};
  if (fs.existsSync(SALES_JSON)) {
    try {
      sales = JSON.parse(fs.readFileSync(SALES_JSON, 'utf8'));
    } catch (e) {
      console.warn(`WARNING: scripts/sales-data.json 解析失败（${e.message}），销量信号按 0 计`);
    }
  } else {
    console.log('未找到 scripts/sales-data.json，销量信号按 0 计（接入 Shopify Admin API 后生成该文件）');
  }
  const maxSales = Math.max(0, ...Object.values(sales).map((v) => Number(v) || 0));

  const now = Date.now();
  const products = enrichProductsWithShopifyData(PRODUCTS_DATA);

  // 人工表预处理：过期剔除、pin 数量检查、note 检查
  const activeOverrides = {};
  let pinCount = 0;
  for (const [asin, o] of Object.entries(WEIGHT_OVERRIDES)) {
    if (o.until && new Date(o.until + 'T23:59:59Z').getTime() < now) {
      console.log(`[权重过期] ${asin} 的人工赋权已于 ${o.until} 到期，本条已忽略（${o.note || '无备注'}）`);
      continue;
    }
    if (!o.note) console.warn(`WARNING: ${asin} 的人工赋权缺少 note 备注`);
    if (o.pin) {
      pinCount++;
      if (pinCount > PIN_LIMIT) console.warn(`WARNING: 同时置顶产品超过 ${PIN_LIMIT} 个（当前 ${pinCount}），请精简`);
    }
    activeOverrides[asin.toLowerCase()] = o;
  }

  // 分组规则预处理：过期剔除
  const activeGroupRules = (GROUP_BOOSTS || []).filter((r) => {
    if (r.until && new Date(r.until + 'T23:59:59Z').getTime() < now) {
      console.log(`[权重过期] 分组规则「${r.note}」已于 ${r.until} 到期，本条已忽略`);
      return false;
    }
    return true;
  });

  const matchRule = (r, p, asin, material, fullTitle) => {
    const m = r.match;
    if (m.productType && p.productType !== m.productType) return false;
    if (m.subcategory && p.subcategory !== m.subcategory) return false;
    if (m.materialIncludes && !material.toLowerCase().includes(m.materialIncludes.toLowerCase())) return false;
    if (m.asinIncludes && !m.asinIncludes.every((s) => asin.includes(s.toLowerCase()))) return false;
    if (m.titleIncludesAny && !m.titleIncludesAny.some((s) => fullTitle.toLowerCase().includes(s.toLowerCase()))) return false;
    return true;
  };

  const fullTitleOf = (p, asin) => MATERIALS_MAP[asin]?.title || p.title || '';

  const groupBoostOf = (p, asin) => {
    const material = PRODUCT_SPECS[asin]?.material || '';
    const fullTitle = fullTitleOf(p, asin);
    let total = 0;
    for (const r of activeGroupRules) if (matchRule(r, p, asin, material, fullTitle)) total += r.boost;
    return total;
  };

  const weights = {};
  for (const p of products) {
    const asin = p.asin.toLowerCase();

    // 销量 60
    const units = Number(sales[asin]) || 0;
    const salesScore = maxSales > 0 ? (Math.log1p(units) / Math.log1p(maxSales)) * SALES_MAX : 0;

    // 新鲜度 15
    const createdAt = SHOPIFY_MAP[asin]?.createdAt;
    const days = createdAt ? (now - new Date(createdAt).getTime()) / 86400000 : FRESHNESS_DAYS;
    const freshScore = Math.max(0, FRESHNESS_MAX * (1 - days / FRESHNESS_DAYS));

    // 评价 15（贝叶斯平均）
    let ratingScore = 0;
    if (p.rating && p.reviewCount) {
      const bayes = (p.rating * p.reviewCount + RATING_PRIOR * RATING_PRIOR_COUNT) / (p.reviewCount + RATING_PRIOR_COUNT);
      ratingScore = Math.min(RATING_MAX, Math.max(0, ((bayes - 3) / 2) * RATING_MAX));
    }

    // 内容完整度 10
    const imgCount = (MATERIALS_MAP[asin]?.images || p.images || []).length;
    const specs = PRODUCT_SPECS[asin];
    const contentScore =
      Math.min(6, imgCount * 1.5) + (specs?.dimensionsCm ? 2 : 0) + (specs?.material ? 2 : 0);

    const perf = salesScore + freshScore + ratingScore + contentScore;

    const o = activeOverrides[asin] || {};
    // 单品 boost + 命中分组规则 boost 叠加，合计 ±30 封顶
    const rawBoost = (o.boost || 0) + groupBoostOf(p, asin);
    const boost = Math.max(-BOOST_CAP, Math.min(BOOST_CAP, rawBoost));
    weights[asin] = {
      type: p.productType,
      score: Math.round((perf + boost) * 10) / 10,
      perf: Math.round(perf * 10) / 10,
      boost,
      ...(o.pin ? { pin: o.pin } : {}),
      ...(o.bury ? { buried: true } : {}),
      ...(o.exclude ? { excluded: true } : {}),
    };
  }

  const body = Object.entries(weights)
    .map(([asin, w]) => `  "${asin}": ${JSON.stringify(w)}`)
    .join(',\n');

  fs.writeFileSync(
    OUT_TS,
    `// Auto-generated by scripts/build-weights.js
// DO NOT EDIT MANUALLY - 人工赋权改 src/data/weights-overrides.ts 后重跑本脚本
// Generated at: ${new Date().toISOString()}

export interface ProductWeight {
  /** 一级类目（同分破平用类目平均分） */
  type: string;
  /** 总分 = 表现分 + 人工 boost（±30 封顶） */
  score: number;
  /** 自动表现分（销量 60 / 新鲜度 15 / 评价 15 / 内容 10） */
  perf: number;
  /** 人工加减分 */
  boost: number;
  /** 硬置顶位次（1 起，凌驾于排序） */
  pin?: number;
  /** 沉底：排在在售组末尾 */
  buried?: boolean;
  /** 排除：权重排序场景不展示 */
  excluded?: boolean;
}

export const PRODUCT_WEIGHTS: Record<string, ProductWeight> = {
${body},
};
`
  );

  const top10 = Object.entries(weights).sort((a, b) => b[1].score - a[1].score).slice(0, 10);
  console.log(`written: src/data/product-weights.ts（${Object.keys(weights).length} 个产品）`);
  console.log('Top 10:', top10.map(([a, w]) => `${a}=${w.score}`).join(', '));
  // 分组规则命中统计
  for (const r of activeGroupRules) {
    const n = products.filter((p) => {
      const asin = p.asin.toLowerCase();
      return matchRule(r, p, asin, PRODUCT_SPECS[asin]?.material || '', fullTitleOf(p, asin));
    }).length;
    console.log(`分组规则「${r.note}」命中 ${n} 个产品 (${r.boost > 0 ? '+' : ''}${r.boost})`);
  }
}

main();
