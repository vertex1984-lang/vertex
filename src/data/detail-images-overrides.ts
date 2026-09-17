/**
 * 详情页附图覆盖表（asin → 附图路径列表）
 *
 * 为什么单独放一个文件：materials-map.ts 由 scripts/sync-materials.js 自动生成，
 * 领导侧重新生成会冲掉内嵌在条目里的 detailImages 字段——附图数据放在这个
 * 独立覆盖文件里则不受数据再生成影响（同 specs-overrides.ts 的先例）。
 *
 * 有新商品的套图叙事素材时，在下面加一条即可（图片放 public/images/products/<目录>/）。
 */
export const DETAIL_IMAGES_OVERRIDES: Record<string, string[]> = {
  '1688-745181807454-c7': [
    '/images/products/1688-745181807454-C7/detail-1.webp',
    '/images/products/1688-745181807454-C7/detail-2.webp',
    '/images/products/1688-745181807454-C7/detail-3.webp',
    '/images/products/1688-745181807454-C7/detail-4.webp',
    '/images/products/1688-745181807454-C7/detail-5.webp',
  ],
};
