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
    { asin: 'BEDSET4-MAUVE-TWIN', handle: '4-piece-botanical-floral-lace-trim-soft-romantic-bedding-bedset4-mauve-twin', color: 'Mauve', size: '170 x 220 cm' },
    { asin: 'BEDSET4-PLAID-FULL', handle: '4-piece-classic-plaid-duvet-cover-set-with-fitted-sheet-and-bedset4-plaid-full', color: 'Grey Plaid', size: '200 x 220 cm' },
    { asin: 'BEDSET4-SAGE-QUEEN', handle: '4-piece-floral-bedding-set-queen-size-soft-microfiber-duvet-bedset4-sage-queen', color: 'Sage', size: '220 x 220 cm' },
    { asin: 'BEDSET4-MAUVE-FULL', handle: '4-piece-floral-lace-print-bedding-set-with-duvet-cover-bedset4-mauve-full', color: 'Mauve', size: '200 x 220 cm' },
    { asin: 'BEDSET4-SAGE-FULL', handle: '4-piece-full-size-floral-duvet-cover-set-with-fitted-sheet-bedset4-sage-full', color: 'Sage', size: '200 x 220 cm' },
    { asin: 'BEDSET4-PLAID-QUEEN', handle: '4-piece-queen-bedding-set-with-88-x-88-in-duvet-cover-60-x-bedset4-plaid-queen', color: 'Grey Plaid', size: '220 x 220 cm' },
    { asin: 'BEDSET4-COFFEE-QUEEN', handle: '4-piece-queen-bedding-set-with-duvet-cover-fitted-sheet-and-bedset4-coffee-queen', color: 'Coffee', size: '220 x 220 cm' },
    { asin: 'BEDSET4-SLATE-QUEEN', handle: '4-piece-queen-bedding-set-with-duvet-cover-fitted-sheet-and-bedset4-slate-queen', color: 'Slate', size: '220 x 220 cm' },
    { asin: 'BEDSET4-MOSS-KING', handle: 'botanical-floral-duvet-cover-set-with-lace-trim-4-piece-bedset4-moss-king', color: 'Moss', size: '260 x 220 cm' },
    { asin: 'BEDSET4-SAGE-TWIN', handle: 'floral-bedding-set-with-duvet-cover-fitted-sheet-and-2-bedset4-sage-twin', color: 'Sage', size: '170 x 220 cm' },
    { asin: 'BEDSET4-BLUE-QUEEN', handle: 'floral-patchwork-bedding-set-queen-4-piece-duvet-cover-bedset4-blue-queen', color: 'Blue', size: '220 x 220 cm' },
    { asin: 'BEDSET4-MOSS-TWIN', handle: 'floral-print-4-piece-duvet-cover-set-with-fitted-sheet-and-bedset4-moss-twin', color: 'Moss', size: '170 x 220 cm' },
    { asin: 'BEDSET4-SLATE-TWIN', handle: 'makimoo-4-piece-bedding-set-duvet-cover-fitted-sheet-and-2-bedset4-slate-twin', color: 'Slate', size: '170 x 220 cm' },
    { asin: 'BEDSET4-COFFEE-FULL', handle: 'makimoo-4-piece-bedding-set-full-size-patchwork-block-print-bedset4-coffee-full', color: 'Coffee', size: '200 x 220 cm' },
    { asin: 'BEDSET4-BLUE-FULL', handle: 'makimoo-4-piece-bedding-set-full-size-quilt-cover-fitted-bedset4-blue-full', color: 'Blue', size: '200 x 220 cm' },
    { asin: 'BEDSET4-MAUVE-KING', handle: 'makimoo-4-piece-bedding-set-king-size-vintage-floral-print-bedset4-mauve-king', color: 'Mauve', size: '260 x 220 cm' },
    { asin: 'BEDSET4-LILAC-QUEEN', handle: 'makimoo-4-piece-bedding-set-queen-duvet-cover-88-x-88-in-bedset4-lilac-queen', color: 'Lilac', size: '220 x 220 cm' },
    { asin: 'BEDSET4-BLUE-TWIN', handle: 'makimoo-4-piece-bedding-set-with-duvet-cover-fitted-sheet-bedset4-blue-twin', color: 'Blue', size: '170 x 220 cm' },
    { asin: 'BEDSET4-LILAC-FULL', handle: 'makimoo-4-piece-bedding-set-with-duvet-cover-fitted-sheet-bedset4-lilac-full', color: 'Lilac', size: '200 x 220 cm' },
    { asin: 'BEDSET4-LILAC-TWIN', handle: 'makimoo-4-piece-bedding-set-with-duvet-cover-fitted-sheet-bedset4-lilac-twin', color: 'Lilac', size: '170 x 220 cm' },
    { asin: 'BEDSET4-MOSS-QUEEN', handle: 'makimoo-4-piece-bedding-set-with-duvet-cover-fitted-sheet-bedset4-moss-queen', color: 'Moss', size: '220 x 220 cm' },
    { asin: 'BEDSET4-SLATE-FULL', handle: 'makimoo-4-piece-bedding-set-with-duvet-cover-fitted-sheet-bedset4-slate-full', color: 'Slate', size: '200 x 220 cm' },
    { asin: 'BEDSET4-TAN-TWIN', handle: 'makimoo-4-piece-botanical-floral-bedding-set-soft-comfy-bedset4-tan-twin', color: 'Tan', size: '170 x 220 cm' },
    { asin: 'BEDSET4-TAN-KING', handle: 'makimoo-4-piece-botanical-floral-bedding-set-with-duvet-bedset4-tan-king', color: 'Tan', size: '260 x 220 cm' },
    { asin: 'BEDSET4-TAN-FULL', handle: 'makimoo-4-piece-floral-bedding-set-full-size-with-duvet-bedset4-tan-full', color: 'Tan', size: '200 x 220 cm' },
    { asin: 'BEDSET4-SAGE-KING', handle: 'makimoo-4-piece-floral-bedding-set-soft-breathable-fabric-bedset4-sage-king', color: 'Sage', size: '260 x 220 cm' },
    { asin: 'BEDSET4-LILAC-KING', handle: 'makimoo-4-piece-king-bedding-set-floral-duvet-cover-fitted-bedset4-lilac-king', color: 'Lilac', size: '260 x 220 cm' },
    { asin: 'BEDSET4-COFFEE-KING', handle: 'makimoo-4-piece-king-bedding-set-patchwork-block-print-bedset4-coffee-king', color: 'Coffee', size: '260 x 220 cm' },
    { asin: 'BEDSET4-BLUE-KING', handle: 'makimoo-4-piece-patchwork-floral-bedding-set-king-size-with-bedset4-blue-king', color: 'Blue', size: '260 x 220 cm' },
    { asin: 'BEDSET4-COFFEE-TWIN', handle: 'makimoo-4-piece-patchwork-print-bedding-set-twin-quilt-bedset4-coffee-twin', color: 'Coffee', size: '170 x 220 cm' },
    { asin: 'BEDSET4-PLAID-KING', handle: 'makimoo-4-piece-plaid-bedding-set-king-size-duvet-cover-bedset4-plaid-king', color: 'Grey Plaid', size: '260 x 220 cm' },
    { asin: 'BEDSET4-TAN-QUEEN', handle: 'makimoo-4-piece-queen-bedding-set-duvet-cover-fitted-sheet-bedset4-tan-queen', color: 'Tan', size: '220 x 220 cm' },
    { asin: 'BEDSET4-MAUVE-QUEEN', handle: 'makimoo-4-piece-shabby-chic-bedding-set-with-duvet-cover-bedset4-mauve-queen', color: 'Mauve', size: '220 x 220 cm' },
    { asin: 'BEDSET4-SLATE-KING', handle: 'makimoo-king-bedding-set-duvet-cover-fitted-sheet-and-2-bedset4-slate-king', color: 'Slate', size: '260 x 220 cm' },
    { asin: 'BEDSET4-MOSS-FULL', handle: 'rustic-floral-duvet-cover-set-with-fitted-sheet-and-two-bedset4-moss-full', color: 'Moss', size: '200 x 220 cm' },
    { asin: 'BEDSET4-PLAID-TWIN', handle: 'twin-size-4-piece-plaid-bedding-set-with-duvet-cover-fitted-bedset4-plaid-twin', color: 'Grey Plaid', size: '170 x 220 cm' },
    ],
  },
  {
    id: 'DUVSET',
    optionName: 'Size',
    members: [
    { asin: 'DUVSET-BEIGE-TWIN', handle: 'makimoo-duvet-cover-set-3-pieces-twin-size-soft-breathable-duvset-beige-twin', color: 'Beige', size: '170 x 220 cm' },
    { asin: 'DUVSET-BEIGE-FULL', handle: 'luxuriously-soft-duvet-cover-set-with-2-pillowcases-duvset-beige-full', color: 'Beige', size: '200 x 220 cm' },
    { asin: 'DUVSET-GRAY-TWIN', handle: '3-piece-duvet-cover-set-with-2-pillowcases-ultra-soft-cozy-duvset-gray-twin', color: 'Grey', size: '170 x 220 cm' },
    { asin: 'DUVSET-WHITE-FULL', handle: 'elegant-crisp-solid-duvet-cover-set-with-pillowcases-3-duvset-white-full', color: 'White', size: '200 x 220 cm' },
    { asin: 'DUVSET-GRAY-FULL', handle: 'makimoo-3-piece-duvet-cover-set-full-size-lightweight-soft-duvset-gray-full', color: 'Grey', size: '200 x 220 cm' },
    { asin: 'DUVSET-GRAY-KING', handle: 'makimoo-duvet-cover-set-king-size-3-piece-bedding-set-with-duvset-gray-king', color: 'Grey', size: '260 x 220 cm' },
    { asin: 'DUVSET-PINK-FULL', handle: 'makimoo-full-duvet-cover-set-3-pieces-ultra-soft-microfiber-duvset-pink-full', color: 'Pink', size: '200 x 220 cm' },
    { asin: 'DUVSET-BEIGE-KING', handle: 'makimoo-king-duvet-cover-set-3-pieces-with-2-pillowcases-duvset-beige-king', color: 'Beige', size: '260 x 220 cm' },
    { asin: 'DUVSET-WHITE-KING', handle: 'makimoo-king-size-duvet-cover-set-3-pieces-ultra-soft-duvset-white-king', color: 'White', size: '260 x 220 cm' },
    { asin: 'DUVSET-PINK-QUEEN', handle: 'makimoo-queen-duvet-cover-set-3-piece-soft-breathable-fade-duvset-pink-queen', color: 'Pink', size: '220 x 220 cm' },
    { asin: 'DUVSET-BEIGE-QUEEN', handle: 'makimoo-queen-duvet-cover-set-3-piece-soft-brushed-duvset-beige-queen', color: 'Beige', size: '220 x 220 cm' },
    { asin: 'DUVSET-GRAY-QUEEN', handle: 'makimoo-soft-brushed-microfiber-duvet-cover-set-queen-size-duvset-gray-queen', color: 'Grey', size: '220 x 220 cm' },
    { asin: 'DUVSET-WHITE-QUEEN', handle: 'queen-duvet-cover-set-3-pieces-soft-brushed-microfiber-duvset-white-queen', color: 'White', size: '220 x 220 cm' },
    { asin: 'DUVSET-WHITE-TWIN', handle: 'twin-duvet-cover-set-with-2-pillowcases-soft-3-piece-duvset-white-twin', color: 'White', size: '170 x 220 cm' },
    { asin: 'DUVSET-PINK-TWIN', handle: 'ultra-soft-washed-microfiber-3-piece-duvet-cover-set-duvset-pink-twin', color: 'Pink', size: '170 x 220 cm' },
    { asin: 'DUVSET-PINK-KING', handle: 'ultra-soft-washed-microfiber-duvet-cover-set-with-2-duvset-pink-king', color: 'Pink', size: '260 x 220 cm' },
    ],
  },

  {
    id: '1688-952595759182',
    optionName: 'Color',
    members: [
    { asin: '1688-952595759182', handle: '2-pack-soft-thick-cotton-beach-towels-oversized-striped-1688-952595759182', color: 'Red Stripe' },
    { asin: '1688-952595759182-c2', handle: '2-pack-thick-oversized-cotton-beach-towels-for-adults-soft-1688-952595759182-c2', color: 'Grey Stripe' },
    { asin: '1688-952595759182-c3', handle: '2-pack-oversized-cotton-beach-towels-75-x-180-cm-extra-1688-952595759182-c3', color: 'Yellow Stripe' },
    { asin: '1688-952595759182-c4', handle: '2-pack-oversized-plush-soft-cotton-beach-towels-extra-large-1688-952595759182-c4', color: 'Blue Stripe' },
    ],
  },
  {
    id: '1688-828008656438',
    optionName: 'Color',
    members: [
    { asin: '1688-828008656438', handle: 'plush-hotel-style-thick-cotton-bath-mats-set-of-2-non-slip-1688-828008656438', color: 'White Footprint' },
    { asin: '1688-828008656438-c2', handle: '2-pack-luxury-hotel-style-100-cotton-bath-mats-50-x-80-cm-1688-828008656438-c2', color: 'White Stone Jacquard' },
    { asin: '1688-828008656438-c3', handle: '2-pack-luxury-hotel-style-cotton-bath-mat-set-extra-thick-1688-828008656438-c3', color: 'White Jacquard Weave' },
    ],
  },
  {
    id: '1688-1044064113195',
    optionName: 'Color',
    members: [
    { asin: '1688-1044064113195', handle: '2-pack-oversized-bath-towels-100-cotton-hotel-style-highly-1688-1044064113195', color: 'White & Grey Trim' },
    { asin: '1688-1044064113195-c2', handle: '2-pack-pure-cotton-bath-towels-oversized-extra-thick-highly-1688-1044064113195-c2', color: 'White & Taupe Trim' },
    { asin: '1688-1044064113195-c3', handle: '2-pack-luxury-bath-towels-100-cotton-hotel-spa-towel-set-1688-1044064113195-c3', color: 'White & Slate Trim' },
    ],
  },
  {
    id: '1688-743666513356',
    optionName: 'Color',
    members: [
    { asin: '1688-743666513356-c4', handle: 'premium-2-pack-american-style-cotton-bath-towels-extra-1688-743666513356-c4', color: 'Cream' },
    { asin: '1688-743666513356-c6', handle: 'plush-ring-spun-cotton-bath-towels-2-pack-quick-dry-highly-1688-743666513356-c6', color: 'Light Grey' },
    { asin: '1688-743666513356-c7', handle: 'premium-2-pack-cotton-bath-towels-large-80-x-140-cm-hotel-1688-743666513356-c7', color: 'Navy Blue' },
    ],
  },
  {
    id: '1688-856468238034',
    optionName: 'Color',
    members: [
    { asin: '1688-856468238034', handle: 'premium-2-pack-cotton-bath-towels-extra-soft-highly-1688-856468238034', color: 'Orange' },
    { asin: '1688-856468238034-c4', handle: '2-pack-premium-black-bath-towels-made-of-pure-cotton-21s-1688-856468238034-c4', color: 'Black' },
    ],
  },
  {
    id: '1688-1056325209172',
    optionName: 'Color',
    members: [
    { asin: '1688-1056325209172', handle: '4-pack-luxury-hotel-collection-100-percent-cotton-face-1688-1056325209172', color: 'White & Tan Stripe' },
    { asin: '1688-1056325209172-c2', handle: '4-pack-100-percent-cotton-hand-towels-hotel-spa-style-40-x-1688-1056325209172-c2', color: 'White & Grey Stripe' },
    ],
  },
  {
    id: '1688-1064068114006',
    optionName: 'Color',
    members: [
    { asin: '1688-1064068114006', handle: 'oval-bathroom-rug-non-slip-water-absorbent-floor-mat-solid-1688-1064068114006', color: 'Cream' },
    { asin: '1688-1064068114006-c2', handle: 'premium-thick-oval-bath-mat-imitation-sisal-woven-bathroom-1688-1064068114006-c2', color: 'Caramel' },
    ],
  },
  {
    id: '1688-1052755373494',
    optionName: 'Color',
    members: [
    { asin: '1688-1052755373494', handle: 'round-outdoor-area-rug-sisal-look-woven-texture-floor-mat-1688-1052755373494', color: 'Natural Tan' },
    { asin: '1688-1052755373494-c2', handle: 'round-sisal-inspired-area-rug-100-x-100-cm-low-profile-1688-1052755373494-c2', color: 'Ivory' },
    ],
  },
  {
    id: '1688-1038477616596',
    optionName: 'Color',
    members: [
    { asin: '1688-1038477616596', handle: 'american-style-checkered-kitchen-mat-diatomaceous-earth-1688-1038477616596', color: 'Brown Checkered' },
    { asin: '1688-1038477616596-c2', handle: 'american-style-lattice-diatom-mud-kitchen-mat-anti-slip-1688-1038477616596-c2', color: 'Brown Floral' },
    ],
  },
  {
    id: '1688-1046667161713',
    optionName: 'Color',
    members: [
    { asin: '1688-1046667161713', handle: 'american-vintage-kitchen-rug-non-slip-absorbent-1688-1046667161713', color: 'Multicolor Tapestry' },
    { asin: '1688-1046667161713-c2', handle: 'set-of-2-vintage-tile-pattern-kitchen-mats-non-slip-oil-1688-1046667161713-c2', color: 'Beige Vintage Tile' },
    ],
  },
  {
    id: 'b0-inserts-square',
    optionName: 'Size',
    members: [
    { asin: 'b0f62y3xt9', handle: 'premium-square-throw-pillow-inserts-60-x-60-cm-set-of-2-b0f62y3xt9', color: 'White', size: '60 x 60 cm' },
    { asin: 'b0f62zy8zn', handle: 'square-throw-pillow-inserts-50-x-50-cm-set-of-2-cushion-b0f62zy8zn', color: 'White', size: '50 x 50 cm' },
    { asin: 'b0h4v662hl', handle: 'premium-pillow-inserts-45-x-45-cm-set-of-2-decorative-b0h4v662hl', color: 'White', size: '45 x 45 cm' },
    { asin: 'b0f62qgv32', handle: 'makimoo-square-cushion-inserts-30-x-30-cm-set-of-2-soft-b0f62qgv32', color: 'White', size: '30 x 30 cm' },
    { asin: 'b0g6mptvfd', handle: 'throw-pillow-inserts-pack-of-2-cushion-inserts-hollowfibre-f-b0g6mptvfd', color: 'White', size: '45 x 45 cm' },
    { asin: 'b0cqc6h9mz', handle: 'throw-pillow-inserts-45cm-x-45cm-18-x-18-cushion-inserts-hol-b0cqc6h9mz', color: 'White', size: '45 x 45 cm' },
    { asin: 'b0cqc5qjfj', handle: 'throw-pillow-inserts-40cm-x-40cm-16-x-16-cushion-inserts-hol-b0cqc5qjfj', color: 'White', size: '40 x 40 cm' },
    { asin: 'b0f62xrb55', handle: 'throw-pillow-inserts-35-x-35cm-14-x-14-cushion-inserts-hollo-b0f62xrb55', color: 'White', size: '35 x 35 cm' },
    ],
  },
  {
    id: 'b0-inserts-rect',
    optionName: 'Size',
    members: [
    { asin: 'b0f62y59cw', handle: 'makimoo-pillow-inserts-50-x-70-cm-set-of-2-soft-fluffy-b0f62y59cw', color: 'White', size: '50 x 70 cm' },
    { asin: 'b0grj9sdtf', handle: 'premium-rectangular-pillow-inserts-set-of-2-for-sofa-bed-b0grj9sdtf', color: 'White', size: '40 x 80 cm' },
    { asin: 'b0cqbzm49v', handle: 'throw-pillow-inserts-30-x-50cm-12-x-20-cushion-inserts-hollo-b0cqbzm49v', color: 'White', size: '30 x 50 cm' },
    { asin: 'b0g6m3f7cy', handle: 'throw-pillow-inserts-pack-of-2-cushion-inserts-hollowfibre-f-b0g6m3f7cy', color: 'White', size: '30 x 50 cm' },
    ],
  },
  {
    id: 'b0-inserts-quilted',
    optionName: 'Size',
    members: [
    { asin: 'b0gxwm4n7j', handle: 'makimoo-quilted-square-cushion-inserts-set-of-2-decorative-b0gxwm4n7j', color: 'White', size: '40 x 40 cm' },
    { asin: 'b0g6lxsf4t', handle: 'makimoo-quilted-throw-pillow-inserts-40-x-40-cm-pack-of-2-b0g6lxsf4t', color: 'White', size: '40 x 40 cm' },
    { asin: 'b0grj8m3tm', handle: 'makimoo-quilted-pillow-inserts-2-pack-decorative-cushion-b0grj8m3tm', color: 'White', size: '40 x 80 cm' },
    ],
  },
  {
    id: 'b0-bed-pillows',
    optionName: 'Size',
    members: [
    { asin: 'b0gd87zbn9', handle: 'premium-embossed-microfiber-bed-pillows-2-pack-soft-fluffy-b0gd87zbn9', color: 'White', size: '50 x 70 cm' },
    { asin: 'b0gd843wmn', handle: 'set-of-2-embossed-microfibre-bed-pillows-for-sleeping-soft-b0gd843wmn', color: 'White', size: '40 x 80 cm' },
    { asin: 'b0gd846fs2', handle: 'set-of-2-soft-embossed-microfiber-bed-pillows-40-x-70-cm-b0gd846fs2', color: 'White', size: '40 x 70 cm' },
    ],
  },
  {
    id: 'b0-round-cushions',
    optionName: 'Color',
    members: [
    { asin: 'b0gjlpxb6f', handle: 'makimoo-water-resistant-tufted-round-seat-cushions-set-of-2-b0gjlpxb6f', color: 'Burgundy' },
    { asin: 'b0f1ydrdtx', handle: 'set-of-2-plush-round-tufted-seat-cushions-water-resistant-b0f1ydrdtx', color: 'Navy Blue' },
    ],
  },
  {
    id: 'b0-highback-2pk',
    optionName: 'Color',
    members: [
    { asin: 'b0gjlrgvdj', handle: '2-pack-all-weather-outdoor-chair-cushions-waterproof-solid-b0gjlrgvdj', color: 'Brown', size: '45 x 10 cm' },
    { asin: 'b0gjsttgy5', handle: 'makimoo-outdoor-chair-cushions-2-pack-waterproof-tufted-b0gjsttgy5', color: 'Forest Green', size: '45 x 10 cm' },
    { asin: 'b0f1v8vmp4', handle: 'makimoo-2-pack-outdoor-chair-cushions-water-resistant-solid-b0f1v8vmp4', color: 'Navy Blue', size: '45 x 10 cm' },
    { asin: 'b0cw1tbzv3', handle: 'makimoo-2-pack-chair-cushions-with-backrest-and-seat-tufted-b0cw1tbzv3', color: 'Green Damask', size: '95 x 45 cm' },
    { asin: 'b0dsgfxldv', handle: 'makimoo-2-pack-patio-chair-cushions-with-ties-one-piece-b0dsgfxldv', color: 'Painted Petals', size: '95 x 45 cm' },
    { asin: 'b0dsgckwxw', handle: 'set-of-2-thick-outdoor-chair-cushions-with-ties-1-piece-b0dsgckwxw', color: 'Red Floral', size: '95 x 45 cm' },
    ],
  },
  {
    id: 'b0-highback-4pk',
    optionName: 'Color',
    members: [
    { asin: 'b0bcjw18sp', handle: 'makimoo-outdoor-chair-cushions-set-of-4-thick-padded-all-b0bcjw18sp', color: 'Hummingbird Garden', size: '110 x 55 cm' },
    { asin: 'b0bcjrtf3x', handle: 'makimoo-outdoor-chair-cushions-set-of-4-water-resistant-b0bcjrtf3x', color: 'Teal Palm Leaf', size: '110 x 55 cm' },
    ],
  },
  {
    id: 'b0-square-pads',
    optionName: 'Color',
    members: [
    { asin: 'b0gd81wt1b', handle: 'indoor-outdoor-square-tufted-seat-cushions-set-of-2-with-b0gd81wt1b', color: 'Teal Floral', size: '43 x 43 cm' },
    { asin: 'b0gd84d8vc', handle: 'set-of-2-tufted-outdoor-chair-cushions-with-ties-square-b0gd84d8vc', color: 'Green Batik', size: '43 x 43 cm' },
    { asin: 'b0gd93xkhr', handle: 'makimoo-set-of-2-thick-comfortable-tufted-colorful-floral-b0gd93xkhr', color: 'Colorful Floral', size: '43 x 43 cm' },
    { asin: 'b0gd7rr5ph', handle: 'makimoo-outdoor-chair-cushions-2-pack-thick-tufted-square-b0gd7rr5ph', color: 'Botanical Art', size: '43 x 43 cm' },
    ],
  },
  {
    id: 'b0-embossed-cases',
    optionName: 'Color',
    members: [
    { asin: 'b0gjlsdz52', handle: 'makimoo-embossed-cushion-covers-set-of-2-soft-microfibre-b0gjlsdz52', color: 'White', size: '40 x 80 cm' },
    { asin: 'b0gjlp59k1', handle: 'makimoo-embossed-microfiber-pillow-covers-50-x-70-cm-set-of-b0gjlp59k1', color: 'White', size: '50 x 70 cm' },
    { asin: 'b0gjlnmx2g', handle: 'makimoo-embossed-pillowcases-set-of-2-ultra-soft-breathable-b0gjlnmx2g', color: 'Light Grey', size: '40 x 70 cm' },
    { asin: 'b0gjlp4pr2', handle: 'makimoo-embossed-microfiber-pillowcases-set-of-2-soft-b0gjlp4pr2', color: 'Pink', size: '40 x 70 cm' },
    { asin: 'b0gjlmc6z4', handle: 'makimoo-embossed-pillowcases-2-pack-soft-textured-pillow-b0gjlmc6z4', color: 'White', size: '30 x 50 cm' },
    { asin: 'b0gjlgxtl4', handle: 'makimoo-embossed-microfibre-pillowcases-40-x-80-cm-set-of-2-b0gjlgxtl4', color: 'Pink', size: '40 x 80 cm' },
    { asin: 'b0gjlgm6xg', handle: 'set-of-2-pillowcases-40-x-80-cm-soft-durable-skin-friendly-b0gjlgm6xg', color: 'White', size: '40 x 80 cm' },
    { asin: 'b0gjldwt6x', handle: 'makimoo-embossed-pillow-cases-set-of-2-luxury-soft-brushed-b0gjldwt6x', color: 'Sage Green', size: '30 x 50 cm' },
    { asin: 'b0gjldmt57', handle: 'makimoo-embossed-cushion-covers-set-of-2-soft-breathable-b0gjldmt57', color: 'Light Grey', size: '50 x 70 cm' },
    { asin: 'b0gjlmjws1', handle: 'set-of-2-embossed-geometric-microfiber-cushion-covers-50-x-b0gjlmjws1', color: 'Pink', size: '50 x 70 cm' },
    { asin: 'b0gjlvmht7', handle: 'textured-geometric-embossed-pillowcases-set-of-2-soft-b0gjlvmht7', color: 'Pink', size: '30 x 50 cm' },
    ],
  },
  {
    id: 'b0-seat-cushions',
    optionName: 'Color',
    members: [
    { asin: 'b0c4b9t6jv', handle: '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0c4b9t6jv', color: 'Green Plaid' },
    { asin: 'b0c4bbvs53', handle: '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0c4bbvs53', color: 'Blue Paisley' },
    { asin: 'b0c4bc7q4s', handle: '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0c4bc7q4s', color: 'Khaki Floral' },
    { asin: 'b0c4bcd4dy', handle: '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0c4bcd4dy', color: 'Pink Watercolor Floral' },
    { asin: 'b0c4bd7q5x', handle: '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0c4bd7q5x', color: 'Blue Red Floral' },
    { asin: 'b0c4bdllfk', handle: '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0c4bdllfk', color: 'Orange Red Striped' },
    { asin: 'b0cjhx7xkl', handle: '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0cjhx7xkl', color: 'Navy Blue Houndstooth' },
    { asin: 'b0fnqrrv78', handle: '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-water-re-b0fnqrrv78', color: 'Navy Blue Red Color Block' },
    { asin: 'b0cj8tjl56', handle: '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0cj8tjl56', color: 'Green Houndstooth' },
    { asin: 'b0cjhslcz5', handle: '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0cjhslcz5', color: 'Red Houndstooth' },
    { asin: 'b0f1y4j48t', handle: '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-water-re-b0f1y4j48t', color: 'Green Brown' },
    { asin: 'b0f1y91hpr', handle: '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-water-re-b0f1y91hpr', color: 'Dark Green', size: '47 x 47 cm' },
    ],
  },
  {
    id: 'b0-rocking-95x45',
    optionName: 'Color',
    members: [
    { asin: 'b0cbt7b1ty', handle: 'outdoor-patio-cushion-rocking-chair-cushion-tufted-pads-set--b0cbt7b1ty', color: 'Corduroy Blue' },
    { asin: 'b0cbt7r7nn', handle: 'outdoor-patio-cushion-rocking-chair-cushion-tufted-pads-set--b0cbt7r7nn', color: 'Corduroy Grey' },
    { asin: 'b0cbt7rfk2', handle: 'outdoor-patio-cushion-rocking-chair-cushion-tufted-pads-set--b0cbt7rfk2', color: 'Corduroy Coffee' },
    { asin: 'b0cw182mcy', handle: 'outdoor-patio-cushion-rocking-chair-cushion-tufted-pads-set--b0cw182mcy', color: 'Houndstooth Red' },
    { asin: 'b0cw19gmpq', handle: 'outdoor-patio-cushion-rocking-chair-cushion-tufted-pads-set--b0cw19gmpq', color: 'Houndstooth Navy Blue' },
    { asin: 'b0cw1h96y5', handle: 'outdoor-patio-cushion-rocking-chair-cushion-tufted-pads-set--b0cw1h96y5', color: 'Houndstooth Green' },
    { asin: 'b0cw193n7m', handle: 'patio-cushion-rocking-chair-cushion-tufted-pads-set-of-upper-b0cw193n7m', color: 'Floral Black Purple' },
    ],
  },
  {
    id: 'b0-travel-memory',
    optionName: 'Color',
    members: [
    { asin: 'b0bxckknn8', handle: 'memory-foam-travel-pillow-neck-pillow-with-360-degree-head-s-b0bxckknn8', color: 'Black' },
    { asin: 'b0c2z9jrdm', handle: 'memory-foam-travel-pillow-neck-pillow-with-360-degree-head-s-b0c2z9jrdm', color: 'Pink' },
    { asin: 'b0c2z9pffk', handle: 'memory-foam-travel-pillow-neck-pillow-with-360-degree-head-s-b0c2z9pffk', color: 'Grey' },
    { asin: 'b0c2zcxvx7', handle: 'memory-foam-travel-pillow-neck-pillow-with-360-degree-head-s-b0c2zcxvx7', color: 'Blue' },
    ],
  },
  {
    id: 'b0-travel-inflatable',
    optionName: 'Color',
    members: [
    { asin: 'b0c69qnsb3', handle: 'inflatable-travel-pillow-neck-pillow-support-for-traveling-a-b0c69qnsb3', color: 'Grey' },
    { asin: 'b0c69rjvvt', handle: 'inflatable-travel-pillow-neck-pillow-support-for-traveling-a-b0c69rjvvt', color: 'Black' },
    { asin: 'b0c69rr6gf', handle: 'inflatable-travel-pillow-neck-pillow-support-for-traveling-a-b0c69rr6gf', color: 'Navy Blue' },
    { asin: 'b0c69rryxm', handle: 'inflatable-travel-pillow-neck-pillow-support-for-traveling-a-b0c69rryxm', color: 'Pink' },
    ],
  },
  {
    id: 'b0-travel-adjustable',
    optionName: 'Color',
    members: [
    { asin: 'b0bzcln57s', handle: 'travel-neck-pillow-top-memory-foam-pillow-for-head-support-i-b0bzcln57s', color: 'Black' },
    { asin: 'b0bzcmdzns', handle: 'travel-neck-pillow-top-memory-foam-pillow-for-head-support-i-b0bzcmdzns', color: 'Grey' },
    { asin: 'b0c8j237v3', handle: 'travel-neck-pillow-top-memory-foam-pillow-for-head-support-i-b0c8j237v3', color: 'Navy Blue' },
    { asin: 'b0c8j292wf', handle: 'travel-neck-pillow-top-memory-foam-pillow-for-head-support-i-b0c8j292wf', color: 'Pink' },
    ],
  },
  {
    id: 'LINEN3',
    optionName: 'Color',
    members: [
    { asin: 'LINEN3-CHARCOAL-FULL', handle: '100-linen-duvet-cover-set-3-piece-full-size-breathable-soft-linen3-charcoal-full', color: 'Charcoal', size: '200 x 220 cm' },
    { asin: 'LINEN3-SAGE-FULL', handle: '100-linen-duvet-cover-set-3-piece-full-size-soft-breathable-linen3-sage-full', color: 'Sage', size: '200 x 220 cm' },
    { asin: 'LINEN3-CHARCOAL-QUEEN', handle: '100-linen-duvet-cover-set-3-pieces-queen-with-1-duvet-cover-linen3-charcoal-queen', color: 'Charcoal', size: '220 x 220 cm' },
    { asin: 'LINEN3-OATMEAL-QUEEN', handle: '100-linen-duvet-cover-set-queen-3-piece-bedding-set-with-linen3-oatmeal-queen', color: 'Oatmeal', size: '220 x 220 cm' },
    { asin: 'LINEN3-DUSTYBLUE-QUEEN', handle: '100-linen-duvet-cover-set-queen-size-3-piece-bedding-set-1-linen3-dustyblue-queen', color: 'Dusty Blue', size: '220 x 220 cm' },
    { asin: 'LINEN3-SAGE-KING', handle: '100-percent-linen-duvet-cover-set-3-piece-king-size-bedding-linen3-sage-king', color: 'Sage', size: '260 x 220 cm' },
    { asin: 'LINEN3-CHARCOAL-TWIN', handle: 'makimoo-100-linen-duvet-cover-set-3-piece-bedding-set-with-linen3-charcoal-twin', color: 'Charcoal', size: '170 x 220 cm' },
    { asin: 'LINEN3-DUSTYBLUE-KING', handle: 'makimoo-100-linen-duvet-cover-set-3-piece-bedding-set-with-linen3-dustyblue-king', color: 'Dusty Blue', size: '260 x 220 cm' },
    { asin: 'LINEN3-DUSTYBLUE-TWIN', handle: 'makimoo-100-linen-duvet-cover-set-3-piece-bedding-set-with-linen3-dustyblue-twin', color: 'Dusty Blue', size: '170 x 220 cm' },
    { asin: 'LINEN3-SAGE-QUEEN', handle: 'makimoo-100-linen-duvet-cover-set-3-piece-bedding-set-with-linen3-sage-queen', color: 'Sage', size: '220 x 220 cm' },
    { asin: 'LINEN3-OATMEAL-KING', handle: 'makimoo-100-linen-duvet-cover-set-3-piece-king-size-with-2-linen3-oatmeal-king', color: 'Oatmeal', size: '260 x 220 cm' },
    { asin: 'LINEN3-CHARCOAL-KING', handle: 'makimoo-100-linen-duvet-cover-set-3-piece-king-soft-linen3-charcoal-king', color: 'Charcoal', size: '260 x 220 cm' },
    { asin: 'LINEN3-IVORY-QUEEN', handle: 'makimoo-100-linen-duvet-cover-set-3-pieces-queen-size-with-linen3-ivory-queen', color: 'Ivory', size: '220 x 220 cm' },
    { asin: 'LINEN3-SAGE-TWIN', handle: 'makimoo-100-linen-duvet-cover-set-3-piece-twin-bedding-with-linen3-sage-twin', color: 'Sage', size: '170 x 220 cm' },
    { asin: 'LINEN3-IVORY-TWIN', handle: 'makimoo-100-linen-duvet-cover-set-3-piece-twin-breathable-linen3-ivory-twin', color: 'Ivory', size: '170 x 220 cm' },
    { asin: 'LINEN3-OATMEAL-TWIN', handle: 'makimoo-100-linen-duvet-cover-set-3-piece-twin-size-1-duvet-linen3-oatmeal-twin', color: 'Oatmeal', size: '170 x 220 cm' },
    { asin: 'LINEN3-DUSTYBLUE-FULL', handle: 'makimoo-100-linen-duvet-cover-set-full-size-3-piece-bedding-linen3-dustyblue-full', color: 'Dusty Blue', size: '200 x 220 cm' },
    { asin: 'LINEN3-OATMEAL-FULL', handle: 'makimoo-100-linen-duvet-cover-set-full-size-3-piece-linen3-oatmeal-full', color: 'Oatmeal', size: '200 x 220 cm' },
    { asin: 'LINEN3-IVORY-KING', handle: 'makimoo-100-linen-duvet-cover-set-king-3-piece-bedding-with-linen3-ivory-king', color: 'Ivory', size: '260 x 220 cm' },
    { asin: 'LINEN3-IVORY-FULL', handle: 'makimoo-100-percent-linen-duvet-cover-set-full-size-3-piece-linen3-ivory-full', color: 'Ivory', size: '200 x 220 cm' },
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
