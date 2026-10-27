// 二级分类注册表（key 用于 URL ?sub= 参数；parent 为顶级分类小写值）
// 判定规则见 classifyProduct：标题关键词 + 尺寸带（数据来自 product-specs / specs-overrides）
import { getProductSpecs } from '@/lib/specs';

export interface CategoryDef {
  label: string;
  value: string; // URL ?cat= 参数值（小写）
  intro: string;
}

/** 顶级分类（8 类注册、7 类在售展示；Holiday 暂无产品不展示；
 *  Others 2026-10-20 下线、Dining 2026-10-21 下线——条目见数组末尾注释） */
export const CATEGORY_DEFS: CategoryDef[] = [
  { label: 'Cushions', value: 'cushions', intro: 'Tufted, water-resistant comfort for every seat — indoors and out.' },
  { label: 'Pillows', value: 'pillows', intro: 'Premium inserts and covers with plush fillings for bed & sofa.' },
  { label: 'Towels', value: 'towels', intro: 'Hotel-style cotton towels for bath, beach & beyond.' },
  { label: 'Mats', value: 'mats', intro: 'Absorbent mats & durable rugs for every room.' },
  { label: 'Bedding', value: 'bedding', intro: 'Soft essentials for every bed.' },
  { label: 'Blankets', value: 'blankets', intro: 'Plush, cozy throws for couch, sofa & bed.' },
  { label: 'Decor', value: 'decor', intro: 'Wall art & handcrafted accents to finish every room.' },
  { label: 'Holiday', value: 'holiday', intro: 'Seasonal decor & festive essentials.' },
  // Others 已全站下线（2026-10-20 用户定：数据保留、网站不展示、页面与 sitemap 移除）——
  // 颈枕已归 Pillows，4 个散件经 products.ts 的 CATEGORY_OVERRIDES 归 Decor；恢复时把条目加回即可
  // Dining 已全站下线（2026-10-21 用户定：数据保留、网站不展示、?cat=dining 渲染 404 页 + noindex）——
  // 原 Dining 产品（藤编托盘/果盘 22 款 + 胡椒研磨器）全部并入 Decor（见 products.ts 归一化与下方 SUB_OVERRIDES）；
  // 恢复时加回：{ label: 'Dining', value: 'dining', intro: 'Handwoven rattan trays & table essentials.' },
];

export interface SubcategoryDef {
  key: string;
  parent: string; // 顶级分类小写（cushions / pillows / towels / mats）
  label: string; // 完整名（汇总页卡片 / 类目页标题）
  shortLabel: string; // 短名（产品卡眉头标签）
  blurb?: string; // 一句话简介（类目页分区标题下）
}

export const SUBCATEGORIES: SubcategoryDef[] = [
  // Cushions（2026-10-23 用户定：取消风格 3 类，全部并入 outdoor-cushions 单分类，见 classifyCushion；
  //  展示顺序用户定：Corduroy 置顶，Solids 其次，Prints 最后）
  // 2026-10-23 用户定：cushions 取消 corduroy/solids/prints 风格三类，全部并入 Outdoor Cushions 单分类
  { key: 'outdoor-cushions', parent: 'cushions', label: 'Outdoor Cushions', shortLabel: 'Outdoor', blurb: 'Tufted, water-resistant comfort for every patio seat.' },
  // Pillows（2026-10-08 用户定：改为 枕芯 / 枕套 / 颈枕 三类）
  { key: 'pillow-inserts', parent: 'pillows', label: 'Pillow Inserts', shortLabel: 'Inserts', blurb: 'Plush inserts & bed pillows for sofa, couch & sleep.' },
  { key: 'pillow-cases', parent: 'pillows', label: 'Decorative Pillow Cases', shortLabel: 'Cases', blurb: 'Decorative covers in soft, muted tones.' },
  { key: 'neck-pillow', parent: 'pillows', label: 'Neck Pillows', shortLabel: 'Neck Pillow', blurb: 'Memory foam support for travel, office & home.' },
  // Towels（2026-10-16 用户定：二级分类合并为 Bath Towels + Beach Towels 两类，
  // 原 bath-towels / hand-face 合并为 towels（key 不变，label 改 Bath Towels）——浴巾/手巾/面巾不再细分；
  // 另有 Fabric 维度（Long-Staple Cotton / Classic Cotton）在 V2TowelsShop 按 asin 前缀判定，不入此注册表）
  { key: 'towels', parent: 'towels', label: 'Bath Towels', shortLabel: 'Bath Towels', blurb: 'Long-staple cotton for bath, hand & face.' },
  { key: 'beach', parent: 'towels', label: 'Beach Towels', shortLabel: 'Beach Towels', blurb: 'Oversized and quick-drying for pool & beach.' },
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
  // Dining（2026-10-21 用户定：Dining 类目全站下线，trays/placemats 二级分类一并停用、数据保留——
  // 原 Dining 产品并入 Decor 且无二级分类（SUB_OVERRIDES 置 ''）；恢复 Dining 时把下面两条加回即可）
  // { key: 'trays', parent: 'dining', label: 'Trays', shortLabel: 'Trays', blurb: 'Handwoven rattan trays for serving & display.' },
  // { key: 'placemats', parent: 'dining', label: 'Placemats', shortLabel: 'Placemats', blurb: 'Table pads & placemats for everyday dining.' },
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
// 2026-10-23：Satin 随缎面床品全站移除出序（用户定）
export const BEDDING_MATERIAL_ORDER = ['Cotton Percale', '100% Linen', 'Washed Cotton-Like', 'Linen-Like', 'Organic Cotton'];

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
  'Cotton Percale': 'Crisp, cool & breathable plain weave — that fresh hotel feel, softer with every wash.',
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

/** 2026-10-23 用户定：cushions 取消风格三类（原 prints / solids / corduroy 归位表废除），
 *  全部坐垫统一归 outdoor-cushions 单分类 */
function classifyCushion(): string {
  return 'outdoor-cushions';
}

function classifyPillow(title: string): string {
  // 2026-10-08 用户定：Pillows 拆为 颈枕 / 枕套 / 枕芯 三类（颈枕由 Others/Travel 归正到 Pillows）
  if (/neck pillow/i.test(title)) return 'neck-pillow';
  if (/pillow ?case|cushion cover|pillow cover|pillowcase/i.test(title)) return 'pillow-cases';
  return 'pillow-inserts';
}

function classifyTowel(title: string): string {
  if (/beach/i.test(title)) return 'beach';
  // 2026-10-16 用户定：浴巾/手巾/面巾不再细分，统一归 towels（原 bath-towels / hand-face 合并，
  // 不再按标题关键词或规格尺寸拆 hand-face / bath-towels）
  return 'towels';
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
// 手工指定二级分类（用户确认时在此加 asin → sub key 条目；'' = 不属于任何二级分类——
// 2026-10-20 改类目的 3 个散件：香薰炉/自行车篮归 Decor 但不是 wall-art；
// 2026-10-21 Dining 类目下线：原 Dining 的 22 款藤编托盘/果盘 + 胡椒研磨器并入 Decor，
// 同样不是 wall-art，全部置 ''——classifyProduct 的 decor 分支是无条件归 wall-art，不加会误归）
const SUB_OVERRIDES: Record<string, string> = {
  'b0d9lh1y55': '', // 希腊胡椒研磨器
  'b0by8ly757': '',
  'b098f1bkjq': '',
  // 原 Dining → Decor（2026-10-21）：743606980882 长方托盘家族
  '743606980882-c2': '',
  '743606980882-c10': '',
  '743606980882-c20': '',
  '743606980882-c32': '',
  '743606980882-c41': '',
  '743606980882-c52': '',
  '743606980882-c61': '',
  '743606980882-c71': '',
  '743606980882-c80': '',
  '743606980882-c89': '',
  // 原 Dining → Decor（2026-10-21）：899672152256 圆托盘家族
  '899672152256-c2': '',
  '899672152256-c13': '',
  '899672152256-c22': '',
  '899672152256-c33': '',
  '899672152256-c42': '',
  '899672152256-c52': '',
  '899672152256-c61': '',
  '899672152256-c70': '',
  '899672152256-c78': '',
  '899672152256-c85': '',
  // 原 Dining → Decor（2026-10-21）：663341114084 藤编陶瓷椭圆盘
  '663341114084-c2': '',
  '663341114084-c3': '',
};

export function classifyProduct(productType: string, title: string, asin: string): string | undefined {
  const asinLower = asin.toLowerCase();
  // hasOwnProperty 判断：'' 也是有效覆盖（= 无二级分类）
  if (Object.prototype.hasOwnProperty.call(SUB_OVERRIDES, asinLower)) {
    return SUB_OVERRIDES[asinLower] || undefined;
  }
  switch (productType.toLowerCase()) {
    case 'cushions':
      return classifyCushion();
    case 'pillows':
      return classifyPillow(title);
    case 'towels':
      return classifyTowel(title);
    case 'mats':
      return classifyMat(title);
    case 'bedding':
      return classifyBedding(asin);
    case 'decor':
      return 'wall-art';
    // Dining 类目已下线（2026-10-21）：原 Dining 产品经 products.ts 归一化并入 Decor，
    // 该分支理论上不再命中；保留仅作数据存档（恢复 Dining 时连同上方 trays/placemats 一起加回）
    case 'dining':
      return /placemat|coaster|table (pad|mat)/i.test(title) ? 'placemats' : 'trays';
    case 'others':
      return classifyOther(title);
    default:
      return undefined;
  }
}
