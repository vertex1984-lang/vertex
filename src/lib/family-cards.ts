/**
 * 家族卡共享辅助（2026-10-20 新增）：全站产品卡统一为家族卡（BeddingSetCard）的公共口径。
 * 已接入：best-sellers / new-arrivals / 首页 V2Recommended / PDP 最近浏览与相关推荐
 * （featured-products 的 color·scene·style 子页 2026-10-22 整树下线，同 /featured 汇总页）。
 * 卡面标题口径（2026-10-21 用户定）：全站家族卡标题/颜色行对齐各一级类目 PLP，
 * 统一走 familyCardDisplay 分派（bedding/cushions/towels/blankets/pillows 各有 PLP 标题规则，
 * 其余类目保持原标题 + 家族颜色行）。
 */
import { buildBlanketFamilies, blanketCardTitle, type BlanketFamily } from '@/data/blanket-families';
import { beddingCardDisplayOf } from '@/data/bedding-families';
import { cushionCardTitle } from '@/data/cushion-families';
import { towelCardTitle } from '@/data/towel-families';
import { pillowCardTitle, pillowCardColor } from '@/data/pillows-taxonomy';
import { getSubcategoriesOf } from '@/data/subcategories';
import { getVariantGroupOf } from '@/data/variant-groups';
import { sortByWeight } from '@/lib/weights';
import type { MakimooProduct } from '@/data/products';
import type { FamilyCardData } from '@/components/v2/BeddingSetCard';

/** 家族 key：变体组成员 = `${组id}::${颜色}`（与 buildBlanketFamilies 口径一致），无组产品 = asin 小写 */
export function familyKeyOf(p: { asin: string }): string {
  const g = getVariantGroupOf(p.asin);
  if (!g) return p.asin.toLowerCase();
  const m = g.members.find((mm) => mm.asin.toLowerCase() === p.asin.toLowerCase());
  return `${g.id}::${m?.color ?? ''}`;
}

/** 产品在变体组里的颜色（无组 → ''），供 colorLine / 负载字段用 */
export function familyColorOf(p: { asin: string }): string {
  const g = getVariantGroupOf(p.asin);
  if (!g) return '';
  return g.members.find((mm) => mm.asin.toLowerCase() === p.asin.toLowerCase())?.color ?? '';
}

/**
 * 卡面标题/颜色行分派（2026-10-21 用户定）：全站家族卡与一级类目 PLP 同规则——
 * bedding = beddingCardDisplayOf（布料+Set / 颜色行，同 buildSetFamilies 口径）；
 * cushions = cushionCardTitle（"Cushions N pack, WxH\""）；towels = towelCardTitle（"类型 N Pack"）；
 * blankets = blanketCardTitle（去尾部尺寸/颜色段）；pillows = pillowCardTitle + pillowCardColor；
 * 其余类目（mats/decor 等）无 PLP 标题规则：原标题 + 家族颜色行。
 * 入参为最小家族形状：BlanketFamily 直接满足；推荐位精简卡可只给 rep+sizes+color
 * （sizes 缺失时 cushionCardTitle 回退解析 rep.title，与 PLP 同一代码路径）。
 */
export function familyCardDisplay(f: {
  rep: Pick<MakimooProduct, 'asin' | 'title' | 'handle' | 'productType' | 'subcategory'> & {
    tags?: string[];
  };
  sizes: string[];
  color: string;
}): { titleOverride?: string; colorLine?: string } {
  const p = f.rep;
  const colorLine = f.color || undefined;
  // pillows（含跨挂旅行颈枕）：与 isPillowProduct 同口径，tags 缺省（精简卡无 tags）时跳过 tags 分支
  const isPillow =
    p.productType.toLowerCase() === 'pillows' ||
    p.subcategory === 'travel' ||
    (p.tags ?? []).some((t) => t.toLowerCase().includes('pillows'));
  if (isPillow) {
    return {
      titleOverride: pillowCardTitle(p) || undefined,
      colorLine: pillowCardColor(p) || colorLine,
    };
  }
  switch (p.productType.toLowerCase()) {
    case 'bedding': {
      const d = beddingCardDisplayOf(p);
      return { titleOverride: d.titleOverride, colorLine: d.colorLine || colorLine };
    }
    case 'cushions':
      return { titleOverride: cushionCardTitle(f), colorLine };
    case 'towels': {
      const label = getSubcategoriesOf('towels').find(
        (s) => s.key === (p.subcategory || '')
      )?.label;
      return label ? { titleOverride: towelCardTitle(f, label), colorLine } : { colorLine };
    }
    case 'blankets':
      return { titleOverride: blanketCardTitle(f), colorLine };
    default:
      return { colorLine };
  }
}

/** BlanketFamily → FamilyCardData（2026-10-21：标题/颜色行走 familyCardDisplay，对齐 PLP 口径） */
export function toFamilyCard(f: BlanketFamily): FamilyCardData {
  return { ...f, ...familyCardDisplay(f) };
}

/** 家族排序 = 代表 SKU 的权重序（在售优先），categories 页同款口径 */
export function sortFamiliesByWeight(families: BlanketFamily[]): BlanketFamily[] {
  const order = new Map(
    sortByWeight(families.map((f) => f.rep)).map((p, i) => [p.asin.toLowerCase(), i])
  );
  return [...families].sort(
    (a, b) =>
      (order.get(a.rep.asin.toLowerCase()) ?? 1e9) - (order.get(b.rep.asin.toLowerCase()) ?? 1e9)
  );
}

/** 未去重的 enriched 列表 → 权重序家族列表（buildBlanketFamilies 需看到全部尺寸 SKU 才有正确 From 价） */
export function collapseToFamilies(products: MakimooProduct[]): BlanketFamily[] {
  return sortFamiliesByWeight(buildBlanketFamilies(products));
}
