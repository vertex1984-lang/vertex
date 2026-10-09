// 二级分类注册表（key 用于 URL ?sub= 参数；parent 为顶级分类小写值）
// 判定规则见 classifyProduct：标题关键词 + 尺寸带（数据来自 product-specs / specs-overrides）
import { getProductSpecs } from '@/lib/specs';
import { getVariantGroupOf } from '@/data/variant-groups';

export interface CategoryDef {
  label: string;
  value: string; // URL ?cat= 参数值（小写）
  intro: string;
}

/** 顶级分类（全站统一 10 类；Holiday 暂无产品不展示） */
export const CATEGORY_DEFS: CategoryDef[] = [
  { label: 'Cushions', value: 'cushions', intro: 'Tufted, water-resistant comfort for every seat — indoors and out.' },
  { label: 'Pillows', value: 'pillows', intro: 'Premium inserts and covers with plush fillings for bed & sofa.' },
  { label: 'Towels', value: 'towels', intro: 'Hotel-style cotton towels for bath, beach & beyond.' },
  { label: 'Mats', value: 'mats', intro: 'Absorbent mats & durable rugs for every room.' },
  { label: 'Bedding', value: 'bedding', intro: 'Soft, breathable duvet cover sets for every bed.' },
  { label: 'Blankets', value: 'blankets', intro: 'Plush, cozy throws for couch, sofa & bed.' },
  { label: 'Decor', value: 'decor', intro: 'Framed canvas wall art to finish every room.' },
  { label: 'Dining', value: 'dining', intro: 'Handwoven rattan trays & table essentials.' },
  { label: 'Holiday', value: 'holiday', intro: 'Seasonal decor & festive essentials.' },
  { label: 'Others', value: 'others', intro: 'Travel, kitchen & extras for daily living.' },
];

export interface SubcategoryDef {
  key: string;
  parent: string; // 顶级分类小写（cushions / pillows / towels / mats）
  label: string; // 完整名（汇总页卡片 / 类目页标题）
  shortLabel: string; // 短名（产品卡眉头标签）
  blurb?: string; // 一句话简介（类目页分区标题下）
}

export const SUBCATEGORIES: SubcategoryDef[] = [
  // Cushions（2026-10-09 用户定：按风格分 3 类，按变体组归位不拆组，见 classifyCushion；
  //  展示顺序用户定：Corduroy 置顶，Solids 其次，Prints 最后）
  { key: 'corduroy', parent: 'cushions', label: 'Corduroy Classics', shortLabel: 'Corduroy', blurb: 'Ribbed corduroy comfort.' },
  { key: 'solids', parent: 'cushions', label: 'Soft Solids', shortLabel: 'Solids', blurb: 'Quiet tones for any space.' },
  { key: 'prints', parent: 'cushions', label: 'Floral & Prints', shortLabel: 'Prints', blurb: 'Prints to brighten every seat.' },
  // Pillows（2026-10-08 用户定：改为 枕芯 / 枕套 / 颈枕 三类）
  { key: 'pillow-inserts', parent: 'pillows', label: 'Pillow Inserts', shortLabel: 'Inserts', blurb: 'Plush inserts & bed pillows for sofa, couch & sleep.' },
  { key: 'pillow-cases', parent: 'pillows', label: 'Decorative Pillow Cases', shortLabel: 'Cases', blurb: 'Decorative covers in soft, muted tones.' },
  { key: 'neck-pillow', parent: 'pillows', label: 'Neck Pillows', shortLabel: 'Neck Pillow', blurb: 'Memory foam support for travel, office & home.' },
  // Towels
  { key: 'bath-towels', parent: 'towels', label: 'Bath Towels', shortLabel: 'Bath Towels', blurb: 'Soft, absorbent cotton for daily baths.' },
  { key: 'beach', parent: 'towels', label: 'Beach Towels', shortLabel: 'Beach Towels', blurb: 'Oversized and quick-drying for pool & beach.' },
  { key: 'hand-face', parent: 'towels', label: 'Hand & Face Towels', shortLabel: 'Hand & Face', blurb: 'Small essentials for hands & face.' },
  // Mats
  { key: 'kitchen', parent: 'mats', label: 'Kitchen Mats', shortLabel: 'Kitchen Mats', blurb: 'Anti-fatigue comfort where you stand most.' },
  { key: 'bath-mats', parent: 'mats', label: 'Bath Mats', shortLabel: 'Bath Mats', blurb: 'Step onto soft, quick-dry comfort.' },
  { key: 'door', parent: 'mats', label: 'Door Mats', shortLabel: 'Door Mats', blurb: 'Tough mats that trap dirt at the door.' },
  { key: 'area-rugs', parent: 'mats', label: 'Area Rugs', shortLabel: 'Area Rugs', blurb: 'Soft grounding for living spaces.' },
  { key: 'other-mats', parent: 'mats', label: 'Other Mats', shortLabel: 'Other Mats', blurb: 'More mats for every corner.' },
  // Bedding（按材质分组，材质数据来自 product-specs / specs-overrides）
  { key: 'microfiber', parent: 'bedding', label: 'Microfiber', shortLabel: 'Microfiber', blurb: 'Brushed microfiber — soft, wrinkle-resistant & easy care.' },
  { key: 'linen', parent: 'bedding', label: 'Linen', shortLabel: 'Linen', blurb: '100% natural linen, breathable with lived-in texture.' },
  { key: 'cotton', parent: 'bedding', label: 'Cotton', shortLabel: 'Cotton', blurb: 'Washed cotton for crisp, airy comfort.' },
  // Decor
  { key: 'wall-art', parent: 'decor', label: 'Wall Art', shortLabel: 'Wall Art', blurb: 'Framed canvas prints, boho & tribal styles.' },
  // Dining
  { key: 'trays', parent: 'dining', label: 'Trays', shortLabel: 'Trays', blurb: 'Handwoven rattan trays for serving & display.' },
  { key: 'placemats', parent: 'dining', label: 'Placemats', shortLabel: 'Placemats', blurb: 'Table pads & placemats for everyday dining.' },
  // Others
  { key: 'travel', parent: 'others', label: 'Travel Accessories', shortLabel: 'Travel', blurb: 'Neck pillows & essentials for the road.' },
  { key: 'kitchen-tools', parent: 'others', label: 'Kitchen Tools', shortLabel: 'Kitchen Tools', blurb: 'Handy tools for everyday cooking.' },
  { key: 'extras', parent: 'others', label: 'Extras', shortLabel: 'Extras', blurb: 'Little extras that make home better.' },
];

export function getSubcategoriesOf(categoryValue: string): SubcategoryDef[] {
  return SUBCATEGORIES.filter((s) => s.parent === categoryValue.toLowerCase());
}

/** Bedding 材质分组的展示顺序（2026-09 用户定）：类目页分区/Filter/顶部导航 mega menu 三处统一。
 *  未收录的材质排在后面（按产品数降序兜底） */
export const BEDDING_MATERIAL_ORDER = ['100% Linen', 'Washed Cotton-Like', 'Linen-Like', 'Satin', 'Organic Cotton'];

/** 材质分组排序：先按 BEDDING_MATERIAL_ORDER 固定位次，未收录的按数量降序排在尾部 */
export function sortBeddingMaterials<T>(entries: [string, T][], countOf: (e: [string, T]) => number): [string, T][] {
  return [...entries].sort((a, b) => {
    const ia = BEDDING_MATERIAL_ORDER.indexOf(a[0]);
    const ib = BEDDING_MATERIAL_ORDER.indexOf(b[0]);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    return countOf(b) - countOf(a);
  });
}

/** bedding 材质分区标题下的一句话描述（小字，2026-09 用户定）；未收录的材质不显示描述行。
 *  原定义在 (v2)/products/page.tsx，2026-09 挪入此表供 V2BeddingShop 材质分区复用 */
export const BEDDING_MATERIAL_BLURBS: Record<string, string> = {
  'Washed Cotton-Like': 'Soft washed feel with a relaxed, lived-in look — easy everyday care.',
  'Linen-Like': 'Airy linen-style texture with a naturally relaxed drape.',
  '100% Linen': 'Pure natural linen — breathable, durable, and softer with every wash.',
  'Silk-Modal': 'Silky-smooth modal blend with a cool, gentle touch.',
  Satin: 'Glossy satin weave — silky-smooth, cool to the touch, with a fluid drape.',
  Microfiber: 'Brushed microfiber — soft, wrinkle-resistant & easy care.',
  Bamboo: 'Bamboo-blend fabric — cool, breathable & moisture-wicking.',
  Linen: 'Natural linen — breathable with a lived-in texture.',
};

export function getSubcategoryDef(key: string): SubcategoryDef | undefined {
  return SUBCATEGORIES.find((s) => s.key === key);
}

/** 产品卡的分类标签：Bedding 统一显示材质（原始字符串，不去 "100% " 前缀，与 Collections 材质分组口径一致，
 *  2026-09 用户定）；其他类目有二级分类用短标签，否则用顶级分类名 */
export function productCategoryTag(p: { productType: string; subcategory?: string; asin?: string }): string {
  if (p.productType.toLowerCase() === 'bedding' && p.asin) {
    const material = getProductSpecs(p.asin)?.material;
    if (material) return material;
  }
  const sub = p.subcategory ? getSubcategoryDef(p.subcategory) : undefined;
  return sub?.shortLabel || p.productType || 'Product';
}

/** 2026-10-09 用户定：cushions 二级分类改为按风格 3 类（prints / solids / corduroy），
 *  按变体组归位（组 = 风格单元，不拆组）；无变体组的新品按标题关键词兜底 */
const CUSHION_GROUP_SUB: Record<string, string> = {
  'b0-seat-cushions': 'prints',
  'outdoor-95x45': 'prints',
  'outdoor-110x55': 'prints',
  'b0-highback-4pk': 'prints',
  'b0-round-cushions': 'solids',
  'b0-highback-2pk': 'solids',
  'outdoor-110x53': 'solids',
  'b0-seat-cushions-wr': 'solids',
  'b0-rocking-95x45': 'corduroy',
};

function classifyCushion(title: string, asin: string): string {
  const g = getVariantGroupOf(asin);
  const sub = g ? CUSHION_GROUP_SUB[g.id] : undefined;
  if (sub) return sub;
  if (/corduroy|rocking/i.test(title)) return 'corduroy';
  if (/floral|flower|paisley|botanical|leaf|leaves|bird|butterfly|tulip|jungle|print|stripe|plaid|check|geometric|lattice|houndstooth|batik|watercolor|monet|oil painting/i.test(title))
    return 'prints';
  return 'solids';
}

function classifyPillow(title: string): string {
  // 2026-10-08 用户定：Pillows 拆为 颈枕 / 枕套 / 枕芯 三类（颈枕由 Others/Travel 归正到 Pillows）
  if (/neck pillow/i.test(title)) return 'neck-pillow';
  if (/pillow ?case|cushion cover|pillow cover|pillowcase/i.test(title)) return 'pillow-cases';
  return 'pillow-inserts';
}

function classifyTowel(title: string, asin: string): string {
  if (/beach/i.test(title)) return 'beach';
  if (/hand towel|face towel/i.test(title)) return 'hand-face';
  // 40×80 四件装按手巾/面巾归类
  const dims = getProductSpecs(asin)?.dimensionsCm;
  if (dims && Math.max(...dims) <= 85 && /4 pack|set of 4/i.test(title)) return 'hand-face';
  return 'bath-towels';
}

function classifyMat(title: string): string {
  // 标题后半常堆使用场景词（如 bath mat 尾部带 "Entryway Kitchen Rug"），
  // 以各关键词在标题中最早出现的位置判定主用途
  const candidates: [RegExp, string][] = [
    [/kitchen/i, 'kitchen'],
    [/door mat|entryway/i, 'door'],
    [/area rug|round[\s\S]{0,20}rug|carpet/i, 'area-rugs'],
    [/bath ?mat|bath rug|bathroom|shower/i, 'bath-mats'],
  ];
  let best: string | null = null;
  let bestIdx = Infinity;
  for (const [re, key] of candidates) {
    const idx = title.search(re);
    if (idx >= 0 && idx < bestIdx) {
      bestIdx = idx;
      best = key;
    }
  }
  return best || 'other-mats';
}

function classifyOther(title: string): string {
  if (/neck pillow|travel/i.test(title)) return 'travel';
  if (/kitchen|pepper|salt|grinder|mill|cutting|utensil|kettle|pot\b|pan\b/i.test(title)) return 'kitchen-tools';
  return 'extras';
}

/** Bedding 按材质分组：取规格表主材质（逗号前第一个，去掉 "100% " 前缀归一化——
 *  specs-overrides 把 linen3 系列写成 "100% Linen"，不归一化会漏分组）；Bamboo 等暂不分组返回 undefined */
function classifyBedding(asin: string): string | undefined {
  const material = getProductSpecs(asin)?.material;
  if (!material) return undefined;
  const primary = material.split(',')[0].trim().toLowerCase().replace(/^100%\s+/, '');
  if (primary === 'microfiber') return 'microfiber';
  if (primary === 'linen') return 'linen';
  if (primary === 'cotton') return 'cotton';
  return undefined;
}

/**
 * 计算产品的二级分类 key；不属于五大类目时返回 undefined。
 * 注意：title 需传完整标题（素材库覆盖后、精简前），避免关键词被截断丢失。
 */
// 手工指定二级分类（用户确认时在此加 asin → sub key 条目）
const SUB_OVERRIDES: Record<string, string> = {
};

export function classifyProduct(productType: string, title: string, asin: string): string | undefined {
  const override = SUB_OVERRIDES[asin.toLowerCase()];
  if (override) return override;
  switch (productType.toLowerCase()) {
    case 'cushions':
      return classifyCushion(title, asin);
    case 'pillows':
      return classifyPillow(title);
    case 'towels':
      return classifyTowel(title, asin);
    case 'mats':
      return classifyMat(title);
    case 'bedding':
      return classifyBedding(asin);
    case 'decor':
      return 'wall-art';
    case 'dining':
      return /placemat|coaster|table (pad|mat)/i.test(title) ? 'placemats' : 'trays';
    case 'others':
      return classifyOther(title);
    default:
      return undefined;
  }
}
