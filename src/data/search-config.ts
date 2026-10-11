/**
 * 搜索层配置（2026-10 P2/P2.1）：热词、推荐位开关与数量集中在这，调优只改本文件不动组件。
 */

/** 搜索层空态的热词胶囊（Search Suggestions；点击直达；顺序即展示顺序） */
export interface HotSearch {
  label: string;
  href: string;
}

export const HOT_SEARCHES: HotSearch[] = [
  { label: 'Linen Bedding', href: '/bedding/linen/' },
  { label: 'Cotton Bath Towels', href: '/products?cat=towels&sub=bath-towels' },
  { label: 'Area Rugs', href: '/products?cat=mats&sub=area-rugs' },
  { label: 'Pillow Covers', href: '/pillows/decorative-pillows/' },
  { label: 'Blankets & Throws', href: '/products?cat=blankets' },
  { label: 'Bath Mats', href: '/products?cat=mats&sub=bath-mats' },
];

/** 历史搜索区块展示条数（存储上限 20 条在 user-profile.ts） */
export const HISTORY_SHOW_MAX = 10;

/**
 * Picked for You 个性推荐（画像驱动，每个用户不同）。
 * batchSize：单批气泡数，换一批按此步进循环整个画像池。
 */
export const PERSONALIZED = {
  batchSize: 8,
};

/**
 * Recommended Products 系统推荐（全站统一，非个性化）。
 * - source 'rating'：评分×ln(1+评论数) 基础分（当前）；'sales'：销量优先——等 Shopify 订单
 *   数据导出回流后切换（开关已留，组件内预留分支位）
 * - manualHandles：人工置顶单（非空时排在自动结果前面，绕过类目多样性限制——"之后改变权重"的口子）
 * - count：网格数量；maxPerCategory：类目多样性上限
 * - recentInsert：穿插最近浏览的产品数（约第 3/7 位让客户再看看，2026-10 用户定）
 */
export const RECOMMENDED = {
  source: 'rating' as 'rating' | 'sales',
  manualHandles: [] as string[],
  count: 8,
  maxPerCategory: 2,
  recentInsert: 2,
};
