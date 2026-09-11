/**
 * Featured / Best Sellers / New Arrivals 三个模块的共享数据源
 * 首页（(v2)/page.tsx）与 Featured 汇总页（(v2)/featured/page.tsx）共用，保持单一来源。
 */

import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { CATEGORY_DEFS } from '@/data/subcategories';

// Featured：与 (classic) 首页一致的 9 个精选 ASIN（Others 类目不进此区），展示用产品首图
export const FEATURED_ASINS = [
  'BEDSET4-BEIGE-FULL',
  'B0CBT7R7NN',
  'B0CC5RGRPS',
  'B0CW19GMPQ',
  'B0F1XMTYNC',
  'B0G6MPTVFD',
  'B0C4B9T6JV',
  'B0CQC5QJFJ',
  'B0CJ8TJL56',
];

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

export function getFeaturedProducts(): MakimooProduct[] {
  return enrichProductsWithShopifyData(byAsin(FEATURED_ASINS));
}

const titleKey = (title: string) =>
  title.toLowerCase().replace(/\(.*?\)/g, '').slice(0, 30).trim();

/**
 * Best Sellers：有 Shopify 数据且在售、按标题去重，取 15 个；
 * 排除 Featured Products 已展示的 ASIN，避免相邻区块重复
 */
export function getBestSellerProducts(): MakimooProduct[] {
  const featured = byAsin(FEATURED_ASINS);
  const featuredIds = new Set(featured.map((p) => p.id));
  const seenTitles = new Set(featured.map((p) => titleKey(p.title)));
  return enrichProductsWithShopifyData(PRODUCTS_DATA)
    .filter((p) => p.hasShopifyData && p.shopifyAvailable && p.productType !== 'Others')
    .filter((p) => !featuredIds.has(p.id))
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
 * Best Sellers 页：按类目精选榜单（暂无真实销量数据，人工编排）。
 * 每类 4 款在售产品，尽量覆盖不同子类与颜色；接入销量数据后改为按销量排序替换。
 */
export const BEST_SELLER_BY_CATEGORY: { cat: string; asins: string[] }[] = [
  {
    cat: 'bedding',
    asins: [
      'BEDSET4-GRAY-QUEEN',      // 纯色灰 4 件套
      'DUVSET-WHITE-QUEEN',      // 纯白 3 件套
      'BEDSET4-SAGE-QUEEN',      // 植物花卉
      'BEDSET4-PLAID-KING',      // 格纹
    ],
  },
  {
    cat: 'pillows',
    asins: [
      'B0CQC6H9MZ',   // 45x45 枕芯
      'B0G6M3F7CY',   // 30x50 枕芯
      'B0GD843WMN',   // 40x80 睡眠枕
      'B0GJLP59K1',   // 50x70 白色枕套
    ],
  },
  {
    cat: 'cushions',
    asins: [
      'B0BBZW4LZR',   // 110x55 高背 花色 2 件
      'B0C4B9T6JV',   // 43x43 坐垫 绿格
      'B0CBT7R7NN',   // 灯芯绒 95x45 灰
      'B0GJLPXB6F',   // 圆形坐垫 安哥拉红
    ],
  },
  {
    cat: 'towels',
    asins: [
      '1688-856468238034',      // 浴巾 2 条装
      '1688-952595759182-C4',   // 蓝白沙滩巾
      '1688-1056325209172',     // 白色手巾 4 条装
      '1688-1044064113195',     // 灰色加大浴巾
    ],
  },
  {
    cat: 'mats',
    asins: [
      '1688-828008656438',      // 全棉浴室地垫 2 条装
      '1688-1038477616596',     // 硅藻泥格纹厨房垫
      '1688-595229918569',      // 仿兔毛地毯
      '1688-745181807454',      // 波斯复古地毯
    ],
  },
  {
    cat: 'blankets',
    // 毯子为同品多色（标题几乎一致），精选 4 个色系族避免卡片重复
    asins: [
      '1688-969627065032-C21',  // 蓝族
      '1688-969627065032-C26',  // 奶黄族
      '1688-969627065032-C31',  // 深灰族
      '1688-969627065032-C41',  // 浅紫族
    ],
  },
];

export interface BestSellerSection {
  cat: string;
  label: string;
  intro: string;
  products: MakimooProduct[];
}

export function getBestSellersByCategory(): BestSellerSection[] {
  return BEST_SELLER_BY_CATEGORY.map(({ cat, asins }) => {
    const def = CATEGORY_DEFS.find((d) => d.value === cat);
    return {
      cat,
      label: def?.label ?? cat,
      intro: def?.intro ?? '',
      products: enrichProductsWithShopifyData(byAsin(asins)),
    };
  }).filter((s) => s.products.length > 0);
}
