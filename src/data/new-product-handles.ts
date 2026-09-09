/**
 * PDP v2 改造白名单：22 款新上传产品的 handle。
 * 详情页新功能（花色切换/尺寸选择/快速加购/新标题等）仅对名单内商品生效，
 * 原有商品详情页保持原样。领导批准全量后：删除此门控即可铺开。
 */
export const NEW_PRODUCT_HANDLES = new Set<string>([
  'minimalist-geometric-area-rug-for-living-room-bedroom-modern-1688-744995685423-c2',
  'luxurious-plush-faux-rabbit-fur-area-rug-ultra-soft-carpet-f-1688-595229918569-c2',
  'soft-low-pile-modern-geometric-area-rug-for-living-room-bedr-1688-744995685423',
  'ultra-soft-faux-rabbit-fur-area-rug-for-modern-living-room-b-1688-595229918569',
  'elegant-distressed-oriental-vintage-area-rug-traditional-per-1688-745181807454-c3',
  'turkish-persian-vintage-area-rug-geometric-diamond-pattern-s-1688-745181807454-c2',
  'distressed-vintage-boho-area-rug-ultra-soft-faux-cashmere-pe-1688-1052742241013-c3',
  'soft-plush-vintage-american-bohemian-area-rug-persian-medall-1688-1052742241013-c2',
  'luxury-oval-shaggy-area-rug-ultra-soft-silky-plush-carpet-fo-1688-996768645117',
  'vintage-area-rug-with-colorful-anatolian-persian-tribal-stri-1688-745181807454',
  'plush-american-vintage-persian-area-rug-faux-cashmere-non-sl-1688-1052742241013',
  'distressed-vintage-persian-floral-medallion-large-area-rug-b-1688-1052742241013-c4',
  'american-vintage-oriental-persian-style-area-rug-soft-faux-c-1688-1052742241013-c5',
  'oval-fluffy-area-rug-large-modern-tie-dye-style-shaggy-bedro-1688-996768645117-c2',
  'vintage-american-persian-style-area-rug-imitation-cashmere-s-1688-1052742241013-c6',
  'nordic-oval-plush-area-rug-tie-dyed-silky-faux-fur-shag-carp-1688-996768645117-c3',
  'super-soft-faux-rabbit-fur-area-rug-thick-plush-shaggy-carpe-1688-595229918569-c3',
  'turkish-persian-vintage-area-rug-bohemian-geometric-medallio-1688-745181807454-c4',
  'vintage-medallion-indoor-area-rug-for-living-room-bedroom-di-1688-745181807454-c6',
  'oriental-traditional-turkish-persian-vintage-area-rug-160-x-1688-745181807454-c5',
  'colorful-geometric-tribal-turkish-persian-style-area-rug-vin-1688-745181807454-c7',
  'elegant-turkish-persian-area-rug-vintage-oriental-medallion-1688-745181807454-c8',
]);

export function isNewProductHandle(handle: string): boolean {
  return NEW_PRODUCT_HANDLES.has(handle);
}
