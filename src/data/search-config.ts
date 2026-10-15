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
  { label: 'Cotton Towels', href: '/products?cat=towels&sub=towels' },
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

/**
 * 系统推荐网格的排名角标（图左上角，统一文案 "Top Rated"）。
 * - 口径：本推荐榜单内评分排名（rating×ln(1+评论数)），取前 topN 个发标；2026-10-12
 *   用户定 B 案统一文案——避免 "#N Rated" 被读成"全站第 N"（评审提出的措辞歧义）。
 *   榜单内评分排序真实可支撑，合规安全。mode 'sales'（销量口径）等 Shopify 订单
 *   数据回流后切换。
 * - 回味位（穿插的最近浏览）永不发标；manualHandles 置顶不虚假加冕（榜单内评分
 *   没进前 N 就没有标）。
 */
export const RANK_BADGES = {
  enabled: true,
  topN: 3,
  mode: 'rating' as 'rating' | 'sales',
};
