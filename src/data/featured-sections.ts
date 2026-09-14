/**
 * Featured / Best Sellers / New Arrivals 三个模块的共享数据源
 * 首页（(v2)/page.tsx）与 Featured 汇总页（(v2)/featured/page.tsx）共用，保持单一来源。
 */

import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { CATEGORY_DEFS } from '@/data/subcategories';
import { sortByWeight } from '@/lib/weights';
import PRODUCT_TAGS_JSON from '@/data/product-tags.json';

const PRODUCT_TAGS = PRODUCT_TAGS_JSON as Record<string, { color: string | null }>;

// Featured：类目配额制（2026-09 用户定），共 8 个卡位：
// 1. 类目权重 = 该类目在售产品数 / 总在售产品数（Others 不参与），配额 = 份额 × 8 四舍五入，
//    再按四舍五入误差修正到恰好 8（补位优先误差最大者，减位保底每类 1 个）
// 2. 类目内部按 sortByWeight（总分降序，同分保持自然顺序）
// 3. 卡片顺序：类目权重（份额）高的类目整组靠前，组内按产品权重
export const FEATURED_COUNT = 8;

export function getFeaturedProducts(): MakimooProduct[] {
  const pool = enrichProductsWithShopifyData(PRODUCTS_DATA).filter(
    (p) => p.hasShopifyData && p.shopifyAvailable && p.productType !== 'Others'
  );
  const byType: Record<string, MakimooProduct[]> = {};
  for (const p of pool) (byType[p.productType] ||= []).push(p);
  const total = pool.length || 1;
  const cats = Object.entries(byType).map(([type, products]) => {
    const exact = (products.length / total) * FEATURED_COUNT;
    return {
      type,
      products: sortByWeight(products),
      share: products.length / total,
      exact,
      quota: Math.min(Math.round(exact), products.length),
    };
  });
  let sum = cats.reduce((s, c) => s + c.quota, 0);
  // 不足 8：按四舍五入误差（exact - quota）降序补位
  while (sum < FEATURED_COUNT) {
    const cand = cats
      .filter((c) => c.quota < c.products.length)
      .sort((a, b) => b.exact - b.quota - (a.exact - a.quota))[0];
    if (!cand) break;
    cand.quota++;
    sum++;
  }
  // 超出 8：按误差（quota - exact）降序减位，保底每类 1 个
  while (sum > FEATURED_COUNT) {
    const cand = cats
      .filter((c) => c.quota > 1)
      .sort((a, b) => b.quota - b.exact - (a.quota - a.exact))[0];
    if (!cand) break;
    cand.quota--;
    sum--;
  }
  return cats
    .sort((a, b) => b.share - a.share)
    .flatMap((c) => c.products.slice(0, c.quota));
}

// New Arrivals：展示用的新到产品（暂选 B0F/B0G 批次新品 ASIN，与 Featured 不重复）
export const NEW_ARRIVAL_ASINS = [
  'B0F1XFWZVY',
  'B0F1XS27XS',
  'B0F1XS7VKY',
  'B0F1Y4J48T',
  'B0F1Y91HPR',
  'B0F62XRB55',
  'B0FNQRRV78',
  'B0G6M3F7CY',
];

const byAsin = (asins: string[]) =>
  asins
    .map((asin) => PRODUCTS_DATA.find((p) => p.asin.toUpperCase() === asin.toUpperCase()))
    .filter(Boolean) as MakimooProduct[];

const titleKey = (title: string) =>
  title.toLowerCase().replace(/\(.*?\)/g, '').slice(0, 30).trim();

/**
 * Best Sellers：有 Shopify 数据且在售、按标题去重，按权重总分降序取 15 个；
 * 排除 Featured Products 已展示的产品，避免相邻区块重复
 */
export function getBestSellerProducts(): MakimooProduct[] {
  const featured = getFeaturedProducts();
  const featuredIds = new Set(featured.map((p) => p.id));
  const seenTitles = new Set(featured.map((p) => titleKey(p.title)));
  const pool = enrichProductsWithShopifyData(PRODUCTS_DATA)
    .filter((p) => p.hasShopifyData && p.shopifyAvailable && p.productType !== 'Others')
    .filter((p) => !featuredIds.has(p.id));
  // 先按权重排序，再去重取前 15：同标题保留权重最高的一款
  return sortByWeight(pool)
    .filter((p) => {
      const key = titleKey(p.title);
      if (seenTitles.has(key)) return false;
      seenTitles.add(key);
      return true;
    })
    .slice(0, 15);
}

export function getNewArrivalProducts(): MakimooProduct[] {
  return enrichProductsWithShopifyData(byAsin(NEW_ARRIVAL_ASINS)).filter(
    (p) => p.productType !== 'Others'
  );
}

/**
 * Best Sellers 页：按类目分区榜单，每类 4 款。
 * 2026-09 起改为权重驱动：在售产品按 sortByWeight（总分降序，同分按类目平均分），
 * 按标题去重后每类取前 4（替代原 BEST_SELLER_BY_CATEGORY 人工编排）。
 */
const BEST_SELLER_CATS = ['bedding', 'pillows', 'cushions', 'towels', 'mats', 'blankets'];

export interface BestSellerSection {
  cat: string;
  label: string;
  intro: string;
  products: MakimooProduct[];
}

export function getBestSellersByCategory(): BestSellerSection[] {
  const seenKeys = new Set<string>();
  return BEST_SELLER_CATS.map((cat) => {
    const def = CATEGORY_DEFS.find((d) => d.value === cat);
    const products = sortByWeight(
      enrichProductsWithShopifyData(PRODUCTS_DATA).filter(
        (p) => p.hasShopifyData && p.shopifyAvailable && p.productType.toLowerCase() === cat
      )
    )
      .filter((p) => {
        // Blankets 是同品多色（标题几乎一致），按色系去重保证 4 张卡不同色族；其余类目按标题去重
        const key =
          p.productType === 'Blankets'
            ? `blanket-${PRODUCT_TAGS[p.asin.toLowerCase()]?.color ?? titleKey(p.title)}`
            : titleKey(p.title);
        if (seenKeys.has(key)) return false;
        seenKeys.add(key);
        return true;
      })
      .slice(0, 4);
    return { cat, label: def?.label ?? cat, intro: def?.intro ?? '', products };
  }).filter((s) => s.products.length > 0);
}
