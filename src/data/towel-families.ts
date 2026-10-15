/**
 * Towels 家族卡共享逻辑（2026-10-15 新增，仿 cushion-families）：
 * /products?cat=towels 选购视图专用——卡片标题、成族口径、变体聚拢排序
 * 与 pillows/cushions 列表页保持同一结构。
 */
import { MakimooProduct } from '@/data/products';
import { buildBlanketFamilies, BlanketFamily } from '@/data/blanket-families';
import { sortByWeight } from '@/lib/weights';
import { getVariantGroupOf } from '@/data/variant-groups';

/** 卡片标题规则："{类型} {N} Pack"（不带尺寸和颜色——2026-10-16 用户定：尺寸/颜色只在 PDP 内展示）。
 *  类型取二级分类注册表 label（2026-10-16 起：Towels / Beach Towels）；
 *  件数来源：标题 "2-Pack"/"2 Pack"/"Set of N"，缺省 2。 */
export function towelCardTitle(f: BlanketFamily, typeLabel: string): string {
  // MK 自有长绒棉毛巾（mk-towel-lsc）单件装、标题不含件数/类型词，统一显示系列名
  if (getVariantGroupOf(f.rep.asin)?.id === 'mk-towel-lsc') {
    return 'Long-Staple Cotton Towel';
  }
  const countMatch =
    f.rep.title.match(/(\d+)\s*-\s*pack/i) ||
    f.rep.title.match(/(\d+)\s+pack/i) ||
    f.rep.title.match(/set of (\d+)/i);
  const count = countMatch ? countMatch[1] : '2';

  return `${typeLabel} ${count} Pack`;
}

/** 建家族：towels 全部产品已在 variant-groups.ts 注册颜色组，按颜色成族；
 *  extraKey = 二级分类（2026-10-16 合并后：mk-towel-lsc 全尺寸同落 towels 区，
 *  每色一张卡；沙滩巾落 beach 区） */
export function visibleTowelFamilies(products: MakimooProduct[]): BlanketFamily[] {
  return buildBlanketFamilies(products, (p) => p.subcategory || '');
}

/** 排序（与 cushions 同口径，2026-10-15）：同一变体组的卡片排在一起；
 *  组间顺序 = 组内卡片的最高权重位次（Featured 权重序），组内顺序 = 变体组注册顺序 */
export function sortTowelFamilies(families: BlanketFamily[]): BlanketFamily[] {
  const reps = sortByWeight(families.map((f) => f.rep));
  const rank = new Map(reps.map((r, i) => [r.id, i]));
  const groupOf = (f: BlanketFamily) => (f.key.includes('::') ? f.key.split('::')[0] : f.key);
  const groupRank = new Map<string, number>();
  for (const f of families) {
    const g = groupOf(f);
    const r = rank.get(f.rep.id) ?? 9999;
    groupRank.set(g, Math.min(groupRank.get(g) ?? 9999, r));
  }
  const orderInGroup = (f: BlanketFamily) => {
    const g = getVariantGroupOf(f.rep.asin);
    const idx = g ? g.members.findIndex((m) => m.asin.toLowerCase() === f.rep.asin.toLowerCase()) : -1;
    return idx < 0 ? 999 : idx;
  };
  return [...families].sort((a, b) => {
    const ga = groupOf(a);
    const gb = groupOf(b);
    if (ga !== gb) return (groupRank.get(ga) ?? 9999) - (groupRank.get(gb) ?? 9999);
    return orderInGroup(a) - orderInGroup(b);
  });
}
