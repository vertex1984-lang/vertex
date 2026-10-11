/**
 * 搜索层配置（2026-10 P2）：热词与推荐位开关集中在这，调优只改本文件不动组件。
 */

/** 搜索层空态的 Search Suggestions 胶囊（点击直达；顺序即展示顺序） */
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

/**
 * Recommended Products 推荐位（搜索层空态网格）。
 * - source 'rating'：评分×ln(1+评论数) 基础分（当前）；'sales'：销量优先——等 Shopify 订单
 *   数据导出回流后切换（开关已留，组件内预留分支位）
 * - manualHandles：人工置顶单（handle 列表，非空时按顺序排在自动结果前面——"之后改变权重"的口子）
 * - count / maxPerCategory：网格数量与类目多样性上限（避免 8 个全是被套）
 * - 个性化：排序后再乘 (1 + affinity 加成)，见 user-profile.ts / V2SearchOverlay
 */
export const RECOMMENDED = {
  source: 'rating' as 'rating' | 'sales',
  manualHandles: [] as string[],
  count: 8,
  maxPerCategory: 2,
};
