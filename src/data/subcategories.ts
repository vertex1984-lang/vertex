// 二级分类注册表（key 用于 URL ?sub= 参数；parent 为顶级分类小写值）
// 判定规则见 classifyProduct：标题关键词 + 尺寸带（数据来自 product-specs / specs-overrides）
import { getProductSpecs } from '@/lib/specs';

export interface CategoryDef {
  label: string;
  value: string; // URL ?cat= 参数值（小写）
  intro: string;
}

/** 顶级分类（全站统一 6 类；Holiday 暂无产品不展示） */
export const CATEGORY_DEFS: CategoryDef[] = [
  { label: 'Cushions', value: 'cushions', intro: 'Tufted, water-resistant comfort for every seat — indoors and out.' },
  { label: 'Pillows', value: 'pillows', intro: 'Premium inserts and covers with plush fillings for bed & sofa.' },
  { label: 'Towels', value: 'towels', intro: 'Hotel-style cotton towels for bath, beach & beyond.' },
  { label: 'Mats', value: 'mats', intro: 'Absorbent mats & durable rugs for every room.' },
  { label: 'Holiday', value: 'holiday', intro: 'Seasonal decor & festive essentials.' },
  { label: 'Others', value: 'others', intro: 'Travel, kitchen & extras for daily living.' },
];

export interface SubcategoryDef {
  key: string;
  parent: string; // 顶级分类小写（cushions / pillows / towels / mats）
  label: string; // 完整名（汇总页卡片 / 类目页标题）
  shortLabel: string; // 短名（产品卡眉头标签）
}

export const SUBCATEGORIES: SubcategoryDef[] = [
  // Cushions（按形态/尺寸分组）
  { key: 'rocking', parent: 'cushions', label: 'Rocking Chair', shortLabel: 'Rocking Chair' },
  { key: 'hb-medium', parent: 'cushions', label: 'High-Back Medium', shortLabel: 'High-Back Medium' },
  { key: 'hb-large', parent: 'cushions', label: 'High-Back Large', shortLabel: 'High-Back Large' },
  { key: 'seat-pad', parent: 'cushions', label: 'Seat Pads', shortLabel: 'Seat Pads' },
  // Pillows
  { key: 'basic', parent: 'pillows', label: 'Basic', shortLabel: 'Basic' },
  { key: 'quilted', parent: 'pillows', label: 'Quilted', shortLabel: 'Quilted' },
  { key: 'embossed', parent: 'pillows', label: 'Embossed & Covers', shortLabel: 'Embossed & Covers' },
  // Towels
  { key: 'bath-towels', parent: 'towels', label: 'Bath Towels', shortLabel: 'Bath Towels' },
  { key: 'beach', parent: 'towels', label: 'Beach Towels', shortLabel: 'Beach Towels' },
  { key: 'hand-face', parent: 'towels', label: 'Hand & Face Towels', shortLabel: 'Hand & Face' },
  // Mats
  { key: 'kitchen', parent: 'mats', label: 'Kitchen Mats', shortLabel: 'Kitchen Mats' },
  { key: 'bath-mats', parent: 'mats', label: 'Bath Mats', shortLabel: 'Bath Mats' },
  { key: 'door', parent: 'mats', label: 'Door Mats', shortLabel: 'Door Mats' },
  { key: 'area-rugs', parent: 'mats', label: 'Area Rugs', shortLabel: 'Area Rugs' },
  { key: 'other-mats', parent: 'mats', label: 'Other Mats', shortLabel: 'Other Mats' },
  // Others
  { key: 'travel', parent: 'others', label: 'Travel Accessories', shortLabel: 'Travel' },
  { key: 'kitchen-tools', parent: 'others', label: 'Kitchen Tools', shortLabel: 'Kitchen Tools' },
  { key: 'extras', parent: 'others', label: 'Extras', shortLabel: 'Extras' },
];

export function getSubcategoriesOf(categoryValue: string): SubcategoryDef[] {
  return SUBCATEGORIES.filter((s) => s.parent === categoryValue.toLowerCase());
}

export function getSubcategoryDef(key: string): SubcategoryDef | undefined {
  return SUBCATEGORIES.find((s) => s.key === key);
}

/** 产品卡的分类标签：有二级分类用短标签，否则用顶级分类名 */
export function productCategoryTag(p: { productType: string; subcategory?: string }): string {
  const sub = p.subcategory ? getSubcategoryDef(p.subcategory) : undefined;
  return sub?.shortLabel || p.productType || 'Product';
}

/** 尺寸带：110 = 110×55 高背连体；95 = 95×45（含 90×45）；43 = 43×43 方形坐垫；twin = 50×43 摇椅两件套 */
type CushionBand = '110' | '95' | '43' | 'twin' | null;

function cushionBand(asin: string, title: string): CushionBand {
  const dims = getProductSpecs(asin)?.dimensionsCm;
  if (dims && dims.length >= 2) {
    const longest = Math.max(...dims);
    const second = [...dims].sort((a, b) => b - a)[1];
    if (longest >= 105 && longest <= 115) return '110';
    if (longest >= 88 && longest <= 100) return '95';
    // 50×43 上下两件套（摇椅垫，标题标注 95×45）
    if (longest >= 48 && longest <= 52 && second >= 40 && second <= 46) return 'twin';
    // 43×43 方形坐垫（47×8 圆形坐垫也归 Seat Pads）
    if (longest >= 40 && longest <= 48) return '43';
    return null;
  }
  // 无尺寸数据时按标题兜底（如 18.5-Inch 坐垫）
  if (/seat (cushion )?pad|1[78](\.\d)?[ -]?inch|1[78](\.\d)?"/i.test(title)) return '43';
  if (/110\s*x\s*5[35]/i.test(title)) return '110';
  if (/9[05]\s*x\s*4[56]/i.test(title)) return '95';
  if (/43\s*x\s*43/i.test(title)) return '43';
  return null;
}

function classifyCushion(title: string, asin: string): string {
  if (/rocking/i.test(title)) return 'rocking';
  const band = cushionBand(asin, title);
  if (band === 'twin') return 'rocking';
  if (band === '95') return 'hb-medium';
  if (band === '110') return 'hb-large';
  if (band === '43') return 'seat-pad';
  // 无尺寸且标题无法判定的兜底：高背关键词进 Medium，其余进 Seat Pads
  return /high[- ]?back/i.test(title) ? 'hb-medium' : 'seat-pad';
}

function classifyPillow(title: string): string {
  if (/quilted/i.test(title)) return 'quilted';
  if (/embossed|pillow ?case|cushion cover|pillow cover/i.test(title)) return 'embossed';
  return 'basic';
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

/**
 * 计算产品的二级分类 key；不属于五大类目时返回 undefined。
 * 注意：title 需传完整标题（素材库覆盖后、精简前），避免关键词被截断丢失。
 */
export function classifyProduct(productType: string, title: string, asin: string): string | undefined {
  switch (productType.toLowerCase()) {
    case 'cushions':
      return classifyCushion(title, asin);
    case 'pillows':
      return classifyPillow(title);
    case 'towels':
      return classifyTowel(title, asin);
    case 'mats':
      return classifyMat(title);
    case 'others':
      return classifyOther(title);
    default:
      return undefined;
  }
}
