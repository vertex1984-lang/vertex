/**
 * 变体组数据（草稿版）：同一 1688 货源下的同款异色关系。
 * - 依据 ASIN 命名规则生成（listing ID 去除 -C数字 尾缀 = 组 ID），限已同步的 22 款新品
 * - 铁律：组内成员必须同属一个二级分类；一个二级分类下可含多个变体组
 * - 领导校准后可直接修改本文件的成员/颜色值，无需动组件
 * - 预留扩展：后续多尺寸可在 member 上加 size 字段或新增 optionName
 */
export interface VariantGroupMember {
  asin: string;
  handle: string;
  color: string;
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
    { asin: '1688-1052742241013-C3', handle: 'distressed-vintage-boho-area-rug-ultra-soft-faux-cashmere-pe-1688-1052742241013-c3', color: 'Sage Green' },
    { asin: '1688-1052742241013-C2', handle: 'soft-plush-vintage-american-bohemian-area-rug-persian-medall-1688-1052742241013-c2', color: 'Navy Blue' },
    { asin: '1688-1052742241013', handle: 'plush-american-vintage-persian-area-rug-faux-cashmere-non-sl-1688-1052742241013', color: 'Rust Orange' },
    { asin: '1688-1052742241013-C4', handle: 'distressed-vintage-persian-floral-medallion-large-area-rug-b-1688-1052742241013-c4', color: 'Multicolor' },
    { asin: '1688-1052742241013-C5', handle: 'american-vintage-oriental-persian-style-area-rug-soft-faux-c-1688-1052742241013-c5', color: 'Teal Blue' },
    { asin: '1688-1052742241013-C6', handle: 'vintage-american-persian-style-area-rug-imitation-cashmere-s-1688-1052742241013-c6', color: 'Rust Orange' },
    ],
  },
  {
    id: '1688-595229918569',
    optionName: 'Color',
    members: [
    { asin: '1688-595229918569-C2', handle: 'luxurious-plush-faux-rabbit-fur-area-rug-ultra-soft-carpet-f-1688-595229918569-c2', color: 'Off White' },
    { asin: '1688-595229918569', handle: 'ultra-soft-faux-rabbit-fur-area-rug-for-modern-living-room-b-1688-595229918569', color: 'Light Camel' },
    { asin: '1688-595229918569-C3', handle: 'super-soft-faux-rabbit-fur-area-rug-thick-plush-shaggy-carpe-1688-595229918569-c3', color: 'Silver Grey' },
    ],
  },
  {
    id: '1688-744995685423',
    optionName: 'Color',
    members: [
    { asin: '1688-744995685423-C2', handle: 'minimalist-geometric-area-rug-for-living-room-bedroom-modern-1688-744995685423-c2', color: 'Black and White' },
    { asin: '1688-744995685423', handle: 'soft-low-pile-modern-geometric-area-rug-for-living-room-bedr-1688-744995685423', color: 'Grey Beige' },
    ],
  },
  {
    id: '1688-745181807454',
    optionName: 'Color',
    members: [
    { asin: '1688-745181807454-C3', handle: 'elegant-distressed-oriental-vintage-area-rug-traditional-per-1688-745181807454-c3', color: 'Beige Multicolor' },
    { asin: '1688-745181807454-C2', handle: 'turkish-persian-vintage-area-rug-geometric-diamond-pattern-s-1688-745181807454-c2', color: 'Navy Blue' },
    { asin: '1688-745181807454', handle: 'vintage-area-rug-with-colorful-anatolian-persian-tribal-stri-1688-745181807454', color: 'Multicolor' },
    { asin: '1688-745181807454-C4', handle: 'turkish-persian-vintage-area-rug-bohemian-geometric-medallio-1688-745181807454-c4', color: 'Multicolor' },
    { asin: '1688-745181807454-C6', handle: 'vintage-medallion-indoor-area-rug-for-living-room-bedroom-di-1688-745181807454-c6', color: 'Multicolor' },
    { asin: '1688-745181807454-C5', handle: 'oriental-traditional-turkish-persian-vintage-area-rug-160-x-1688-745181807454-c5', color: 'Cream Multicolor' },
    { asin: '1688-745181807454-C7', handle: 'colorful-geometric-tribal-turkish-persian-style-area-rug-vin-1688-745181807454-c7', color: 'Multicolor' },
    { asin: '1688-745181807454-C8', handle: 'elegant-turkish-persian-area-rug-vintage-oriental-medallion-1688-745181807454-c8', color: 'Black Gold' },
    ],
  },
  {
    id: '1688-996768645117',
    optionName: 'Color',
    members: [
    { asin: '1688-996768645117', handle: 'luxury-oval-shaggy-area-rug-ultra-soft-silky-plush-carpet-fo-1688-996768645117', color: 'Khaki' },
    { asin: '1688-996768645117-C2', handle: 'oval-fluffy-area-rug-large-modern-tie-dye-style-shaggy-bedro-1688-996768645117-c2', color: 'Light Grey' },
    { asin: '1688-996768645117-C3', handle: 'nordic-oval-plush-area-rug-tie-dyed-silky-faux-fur-shag-carp-1688-996768645117-c3', color: 'Snow White' },
    ],
  }
];

const groupsByAsin = new Map<string, VariantGroup>();
for (const g of VARIANT_GROUPS) {
  for (const m of g.members) groupsByAsin.set(m.asin.toLowerCase(), g);
}

export function getVariantGroupOf(asin: string): VariantGroup | undefined {
  return groupsByAsin.get(asin.toLowerCase());
}
