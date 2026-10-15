/**
 * Towels 家族卡共享逻辑（2026-10-15 新增，仿 cushion-families）：
 * /products?cat=towels 选购视图专用——卡片标题、成族口径、变体聚拢排序
 * 与 pillows/cushions 列表页保持同一结构。
 */
import { MakimooProduct } from '@/data/products';
import { buildBlanketFamilies, BlanketFamily } from '@/data/blanket-families';
import { sortByWeight } from '@/lib/weights';
import { getVariantGroupOf } from '@/data/variant-groups';

/** cm → in，去小数点（四舍五入取整）：80cm→31、140cm→55 */
const cmToIn = (cm: number) => Math.round(cm / 2.54);

/** 卡片标题规则（2026-10-15 用户定，仿 cushions 卡）："{类型} {N} Pack, {W}x{L}\""
 *  （不带颜色；尺寸换算成英寸、去小数点、无空格、双引号表英寸）。
 *  类型取二级分类注册表 label（Bath Towels / Beach Towels / Hand & Face Towels）；
 *  尺寸来源：优先短标题 "80 x 140 cm"，其次 handle "75-x-180"，再次变体组尺寸带；
 *  件数来源：标题 "2-Pack"/"2 Pack"/"Set of N"，缺省 2。 */
export function towelCardTitle(f: BlanketFamily, typeLabel: string): string {
  // 2026-10-16：MK 自有长绒棉毛巾（mk-towel-lsc）单件装、标题不含件数/类型词；
  // 卡标题不写尺寸和颜色（用户定：尺寸/颜色只在 PDP 内展示），统一显示系列名
  if (getVariantGroupOf(f.rep.asin)?.id === 'mk-towel-lsc') {
    return 'Long-Staple Cotton Towel';
  }
  const countMatch =
    f.rep.title.match(/(\d+)\s*-\s*pack/i) ||
    f.rep.title.match(/(\d+)\s+pack/i) ||
    f.rep.title.match(/set of (\d+)/i);
  const count = countMatch ? countMatch[1] : '2';

  const sizeSeg = (() => {
    const t = f.rep.title;
    const wh = t.match(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*cm/i);
    if (wh) return `${cmToIn(parseFloat(wh[1]))}x${cmToIn(parseFloat(wh[2]))}"`;
    // handle 兜底："75-x-180" / "40-x-80"
    const h = f.rep.handle.match(/(\d+)-x-(\d+)/i);
    if (h) return `${cmToIn(parseFloat(h[1]))}x${cmToIn(parseFloat(h[2]))}"`;
    // 尺寸带首段是数字才是尺寸
    const sizeBand = f.sizes[0] || '';
    if (!/^\d/.test(sizeBand)) return '';
    const parts = sizeBand
      .split('×')
      .map((s) => cmToIn(parseFloat(s)))
      .filter((n) => !Number.isNaN(n));
    return parts.length > 0 ? parts.join('x') + '"' : '';
  })();

  return `${typeLabel} ${count} Pack${sizeSeg ? `, ${sizeSeg}` : ''}`;
}

/** 建家族：towels 全部产品已在 variant-groups.ts 注册颜色组，按颜色成族；
 *  extraKey = 二级分类——同色跨分区的变体组（mk-towel-lsc：bath towel/bath sheet 与
 *  washcloth/hand towel 同族）拆成两张卡，各落 Bath Towels / Hand & Face 分区（2026-10-16） */
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
