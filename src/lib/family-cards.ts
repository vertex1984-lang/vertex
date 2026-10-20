/**
 * 家族卡共享辅助（2026-10-20 新增）：全站产品卡统一为家族卡（BeddingSetCard）的公共口径。
 * 已接入：best-sellers / new-arrivals / featured-products 的 color·scene·style 子页 /
 * 首页 V2Recommended / PDP 最近浏览与相关推荐。
 * 卡面统一跟随 /categories 页：colorLine = 家族颜色，不传 titleOverride / compactText / sizesSuffix。
 */
import { buildBlanketFamilies, type BlanketFamily } from '@/data/blanket-families';
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

/** BlanketFamily → FamilyCardData（统一口径：colorLine = 家族颜色，无颜色行不传） */
export function toFamilyCard(f: BlanketFamily): FamilyCardData {
  return { ...f, colorLine: f.color || undefined };
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
