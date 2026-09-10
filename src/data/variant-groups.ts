/**
 * 变体组数据（草稿版）：同一 1688 货源下的同款异色关系。
 * - 依据 ASIN 命名规则生成（listing ID 去除 -C数字 尾缀 = 组 ID），限已同步的 22 款新品
 * - 铁律：组内成员必须同属一个二级分类；一个二级分类下可含多个变体组
 * - 领导校准后可直接修改本文件的成员/颜色值，无需动组件
 * - size 字段已启用：床品/毯子等二维（颜色×尺寸）或纯尺寸家族由 size 导航，
 *   色圆点按颜色去重、点击优先跳同尺寸；尺寸选择器按同色跳尺寸
 */
export interface VariantGroupMember {
  asin: string;
  handle: string;
  color: string;
  /** 尺寸（可选）：二维/尺寸型家族（床品、毯子）填写；地毯等纯颜色家族不填 */
  size?: string;
}

export interface VariantGroup {
  id: string;
  optionName: string;
  members: VariantGroupMember[];
}

export const VARIANT_GROUPS: VariantGroup[] = [
  {
    id: '1688-1052742241013',
    optionName: 'Color',
    members: [
    { asin: '1688-1052742241013-C3', handle: 'distressed-vintage-boho-area-rug-ultra-soft-faux-cashmere-1688-1052742241013-c3', color: 'Sage Green' },
    { asin: '1688-1052742241013-C2', handle: 'soft-plush-vintage-american-bohemian-area-rug-persian-1688-1052742241013-c2', color: 'Navy Blue' },
    { asin: '1688-1052742241013', handle: 'plush-american-vintage-persian-area-rug-faux-cashmere-non-1688-1052742241013', color: 'Rust Orange' },
    { asin: '1688-1052742241013-C4', handle: 'distressed-vintage-persian-floral-medallion-large-area-rug-1688-1052742241013-c4', color: 'Multicolor' },
    { asin: '1688-1052742241013-C5', handle: 'american-vintage-oriental-persian-style-area-rug-soft-faux-1688-1052742241013-c5', color: 'Teal Blue' },
    { asin: '1688-1052742241013-C6', handle: 'vintage-american-persian-style-area-rug-imitation-cashmere-1688-1052742241013-c6', color: 'Rust Orange' },
    ],
  },
  {
    id: '1688-595229918569',
    optionName: 'Color',
    members: [
    { asin: '1688-595229918569-C2', handle: 'luxurious-plush-faux-rabbit-fur-area-rug-ultra-soft-carpet-1688-595229918569-c2', color: 'Off White' },
    { asin: '1688-595229918569', handle: 'ultra-soft-faux-rabbit-fur-area-rug-for-modern-living-room-1688-595229918569', color: 'Light Camel' },
    { asin: '1688-595229918569-C3', handle: 'super-soft-faux-rabbit-fur-area-rug-thick-plush-shaggy-1688-595229918569-c3', color: 'Silver Grey' },
    ],
  },
  {
    id: '1688-744995685423',
    optionName: 'Color',
    members: [
    { asin: '1688-744995685423-C2', handle: 'minimalist-geometric-area-rug-for-living-room-bedroom-1688-744995685423-c2', color: 'Black and White' },
    { asin: '1688-744995685423', handle: 'soft-low-pile-modern-geometric-area-rug-for-living-room-1688-744995685423', color: 'Grey Beige' },
    ],
  },
  {
    id: '1688-745181807454',
    optionName: 'Color',
    members: [
    { asin: '1688-745181807454-C3', handle: 'elegant-distressed-oriental-vintage-area-rug-traditional-1688-745181807454-c3', color: 'Beige Multicolor' },
    { asin: '1688-745181807454-C2', handle: 'turkish-persian-vintage-area-rug-geometric-diamond-pattern-1688-745181807454-c2', color: 'Navy Blue' },
    { asin: '1688-745181807454', handle: 'vintage-area-rug-with-colorful-anatolian-persian-tribal-1688-745181807454', color: 'Multicolor' },
    { asin: '1688-745181807454-C4', handle: 'turkish-persian-vintage-area-rug-bohemian-geometric-1688-745181807454-c4', color: 'Multicolor' },
    { asin: '1688-745181807454-C6', handle: 'vintage-medallion-indoor-area-rug-for-living-room-bedroom-1688-745181807454-c6', color: 'Multicolor' },
    { asin: '1688-745181807454-C5', handle: 'oriental-traditional-turkish-persian-vintage-area-rug-160-x-1688-745181807454-c5', color: 'Cream Multicolor' },
    { asin: '1688-745181807454-C7', handle: 'colorful-geometric-tribal-turkish-persian-style-area-rug-1688-745181807454-c7', color: 'Multicolor' },
    { asin: '1688-745181807454-C8', handle: 'elegant-turkish-persian-area-rug-vintage-oriental-medallion-1688-745181807454-c8', color: 'Black Gold' },
    ],
  },
  {
    id: '1688-996768645117',
    optionName: 'Color',
    members: [
    { asin: '1688-996768645117', handle: 'luxury-oval-shaggy-area-rug-ultra-soft-silky-plush-carpet-1688-996768645117', color: 'Khaki' },
    { asin: '1688-996768645117-C2', handle: 'oval-fluffy-area-rug-large-modern-tie-dye-style-shaggy-1688-996768645117-c2', color: 'Light Grey' },
    { asin: '1688-996768645117-C3', handle: 'nordic-oval-plush-area-rug-tie-dyed-silky-faux-fur-shag-1688-996768645117-c3', color: 'Snow White' },
    ],
  },
  {
    id: '1688-916370884976',
    optionName: 'Size',
    members: [
    { asin: '1688-916370884976-C8', handle: 'comforter-set-3-pcs-washed-cotton-soft-breathable-skin-1688-916370884976-c8', color: 'Light Blue & Cheese', size: '200 x 150 cm' },
    { asin: '1688-916370884976-C9', handle: 'comforter-set-3-pcs-washed-cotton-soft-breathable-skin-1688-916370884976-c9', color: 'Light Blue & Cheese', size: '220 x 180 cm' },
    { asin: '1688-916370884976-C6', handle: 'comforter-set-3-pcs-washed-cotton-soft-breathable-skin-1688-916370884976-c6', color: 'Light Blue & Cheese', size: '220 x 180 cm' },
    { asin: '1688-916370884976-C5', handle: 'comforter-set-3-pcs-washed-cotton-soft-breathable-skin-1688-916370884976-c5', color: 'Light Blue & Cheese', size: '230 x 200 cm' },
    { asin: '1688-916370884976-C7', handle: 'comforter-set-3-pcs-washed-cotton-soft-breathable-skin-1688-916370884976-c7', color: 'Light Blue & Cheese', size: '240 x 220 cm' },
    ],
  },
  {
    id: '1688-969627065032',
    optionName: 'Color',
    members: [
    { asin: '1688-969627065032-C22', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c22', color: 'Blue', size: '120 x 200 cm' },
    { asin: '1688-969627065032-C27', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c27', color: 'Cream Yellow', size: '120 x 200 cm' },
    { asin: '1688-969627065032-C31', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c31', color: 'Dark Gray', size: '120 x 200 cm' },
    { asin: '1688-969627065032-C36', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c36', color: 'Silver Gray', size: '120 x 200 cm' },
    { asin: '1688-969627065032-C21', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c21', color: 'Blue', size: '150 x 200 cm' },
    { asin: '1688-969627065032-C26', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c26', color: 'Cream Yellow', size: '150 x 200 cm' },
    { asin: '1688-969627065032-C32', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c32', color: 'Dark Gray', size: '150 x 200 cm' },
    { asin: '1688-969627065032-C41', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c41', color: 'Purple', size: '150 x 200 cm' },
    { asin: '1688-969627065032-C37', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c37', color: 'Silver Gray', size: '150 x 200 cm' },
    { asin: '1688-969627065032-C23', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c23', color: 'Blue', size: '180 x 200 cm' },
    { asin: '1688-969627065032-C28', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c28', color: 'Cream Yellow', size: '180 x 200 cm' },
    { asin: '1688-969627065032-C33', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c33', color: 'Dark Gray', size: '180 x 200 cm' },
    { asin: '1688-969627065032-C43', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c43', color: 'Purple', size: '180 x 200 cm' },
    { asin: '1688-969627065032-C38', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c38', color: 'Silver Gray', size: '180 x 200 cm' },
    { asin: '1688-969627065032-C24', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c24', color: 'Blue', size: '200 x 230 cm' },
    { asin: '1688-969627065032-C29', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c29', color: 'Cream Yellow', size: '200 x 230 cm' },
    { asin: '1688-969627065032-C34', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c34', color: 'Dark Gray', size: '200 x 230 cm' },
    { asin: '1688-969627065032-C42', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c42', color: 'Purple', size: '200 x 230 cm' },
    { asin: '1688-969627065032-C39', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c39', color: 'Silver Gray', size: '200 x 230 cm' },
    { asin: '1688-969627065032-C25', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c25', color: 'Blue', size: '230 x 250 cm' },
    { asin: '1688-969627065032-C30', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c30', color: 'Cream Yellow', size: '230 x 250 cm' },
    { asin: '1688-969627065032-C35', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c35', color: 'Dark Gray', size: '230 x 250 cm' },
    { asin: '1688-969627065032-C40', handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c40', color: 'Silver Gray', size: '230 x 250 cm' },
    ],
  },
  {
    id: 'BEDSET4',
    optionName: 'Color',
    members: [
    { asin: 'BEDSET4-BEIGE-TWIN', handle: 'soft-cozy-all-season-4-piece-bedding-set-with-duvet-cover-bedset4-beige-twin', color: 'Beige', size: '170 x 220 cm' },
    { asin: 'BEDSET4-GRAY-TWIN', handle: 'makimoo-twin-bedding-set-4-piece-duvet-cover-set-with-bedset4-gray-twin', color: 'Grey', size: '170 x 220 cm' },
    { asin: 'BEDSET4-PINK-TWIN', handle: 'makimoo-4-piece-twin-bedding-set-includes-duvet-cover-bedset4-pink-twin', color: 'Pink', size: '170 x 220 cm' },
    { asin: 'BEDSET4-WHITE-TWIN', handle: 'makimoo-twin-bedding-set-4-piece-duvet-cover-fitted-sheet-bedset4-white-twin', color: 'White', size: '170 x 220 cm' },
    { asin: 'BEDSET4-BEIGE-KING', handle: 'luxury-brushed-microfiber-4-piece-bedding-set-king-size-bedset4-beige-king', color: 'Beige', size: '260 x 220 cm' },
    { asin: 'BEDSET4-GRAY-KING', handle: 'makimoo-king-size-bedding-set-4-piece-duvet-cover-with-bedset4-gray-king', color: 'Grey', size: '260 x 220 cm' },
    { asin: 'BEDSET4-PINK-KING', handle: 'premium-ultra-soft-brushed-microfiber-4-piece-bedding-set-bedset4-pink-king', color: 'Pink', size: '260 x 220 cm' },
    { asin: 'BEDSET4-WHITE-KING', handle: 'king-size-bedding-set-4-pieces-soft-brushed-microfiber-bedset4-white-king', color: 'White', size: '260 x 220 cm' },
    { asin: 'BEDSET4-BEIGE-QUEEN', handle: 'makimoo-queen-size-4-piece-bedding-set-duvet-cover-fitted-bedset4-beige-queen', color: 'Beige', size: '220 x 220 cm' },
    { asin: 'BEDSET4-BEIGE-FULL', handle: 'makimoo-bedding-set-4-pieces-full-size-duvet-cover-with-bedset4-beige-full', color: 'Beige', size: '200 x 220 cm' },
    { asin: 'BEDSET4-GRAY-QUEEN', handle: 'makimoo-queen-duvet-cover-set-4-pieces-with-fitted-sheet-bedset4-gray-queen', color: 'Grey', size: '220 x 220 cm' },
    { asin: 'BEDSET4-GRAY-FULL', handle: 'makimoo-full-duvet-cover-set-4-pieces-with-fitted-sheet-and-bedset4-gray-full', color: 'Grey', size: '200 x 220 cm' },
    { asin: 'BEDSET4-PINK-FULL', handle: '4-piece-duvet-cover-bedding-set-with-fitted-sheet-and-2-bedset4-pink-full', color: 'Pink', size: '200 x 220 cm' },
    { asin: 'BEDSET4-PINK-QUEEN', handle: 'makimoo-queen-duvet-cover-set-4-pieces-with-fitted-sheet-bedset4-pink-queen', color: 'Pink', size: '220 x 220 cm' },
    { asin: 'BEDSET4-WHITE-QUEEN', handle: 'makimoo-queen-size-bedding-set-4-pieces-premium-ultra-soft-bedset4-white-queen', color: 'White', size: '220 x 220 cm' },
    { asin: 'BEDSET4-WHITE-FULL', handle: 'makimoo-full-bedding-set-4-piece-soft-breathable-bedset4-white-full', color: 'White', size: '200 x 220 cm' },
    ],
  },
  {
    id: 'DUVSET',
    optionName: 'Size',
    members: [
    { asin: 'DUVSET-BEIGE-TWIN', handle: 'makimoo-duvet-cover-set-3-pieces-twin-size-soft-breathable-duvset-beige-twin', color: 'Beige', size: '170 x 220 cm' },
    { asin: 'DUVSET-BEIGE-FULL', handle: 'luxuriously-soft-duvet-cover-set-with-2-pillowcases-duvset-beige-full', color: 'Beige', size: '200 x 220 cm' },
    ],
  },

];

const groupsByAsin = new Map<string, VariantGroup>();
for (const g of VARIANT_GROUPS) {
  for (const m of g.members) groupsByAsin.set(m.asin.toLowerCase(), g);
}

export function getVariantGroupOf(asin: string): VariantGroup | undefined {
  return groupsByAsin.get(asin.toLowerCase());
}
