/**
 * Decor 类目分区注册表（2026-10-21 用户定：/products?cat=decor 按 bedding 类目页结构重构——
 * Parachute 式 hero + 分区家族卡网格，见 V2DecorCatHero / V2DecorShop）。
 * Decor 无二级 PLP，hero 快链 = 页内锚点 #<key>（同 towels/blankets 口径）。
 * trays-tabletop = 原 Dining 类目并入的藤编托盘/果盘家族（Dining 2026-10-21 全站下线，数据保留）。
 */
export interface DecorSectionDef {
  key: string;
  label: string;
  blurb?: string;
}

export const DECOR_SECTIONS: DecorSectionDef[] = [
  { key: 'wall-art', label: 'Wall Art', blurb: 'Framed canvas prints, boho & tribal styles.' },
  { key: 'trays-tabletop', label: 'Trays & Tabletop', blurb: 'Handwoven rattan trays & tabletop accents.' },
  { key: 'more-decor', label: 'More Decor', blurb: 'Little accents that finish a room.' },
];

/** 分区归位：wall-art 走二级分类；原 Dining 三个托盘家族按 asin 前缀；
 *  其余散件（胡椒研磨器/香薰炉/自行车篮及未来新品）兜底 more-decor */
export function decorSectionOf(p: { asin: string; subcategory?: string }): string {
  if (p.subcategory === 'wall-art') return 'wall-art';
  const a = p.asin.toLowerCase();
  if (
    a.startsWith('743606980882') ||
    a.startsWith('899672152256') ||
    a.startsWith('663341114084')
  )
    return 'trays-tabletop';
  return 'more-decor';
}
