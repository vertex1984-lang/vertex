/**
 * Cushions 家族卡共享逻辑（2026-10-09 抽取自 V2CushionsShop）：
 * 供 /products?cat=cushions 列表页与 /cushions/[slug]/ 二级页共用，
 * 两处卡片标题、Set of 4 隐藏规则、变体聚拢排序必须始终一致。
 */
import { MakimooProduct } from '@/data/products';
import { buildBlanketFamilies, BlanketFamily } from '@/data/blanket-families';
import { sortByWeight } from '@/lib/weights';
import { getVariantGroupOf, CUSHION_LISTING_HIDDEN_ASINS } from '@/data/variant-groups';

/** cm → in，去小数点（四舍五入取整）：43cm→17、47cm→19、95cm→37 */
const cmToIn = (cm: number) => Math.round(cm / 2.54);

/** 卡片标题规则（2026-10-09 用户定）："Cushions Set of {x}, {W} x {H} in"
 *  （不带颜色；尺寸换算成英寸、去小数点后一位）。
 *  尺寸来源：优先解析代表品短标题（"95 x 45cm" / "95x45cm" / "47cm Round"，短标题是策划过的
 *  产品实际尺寸）；解析不到才用变体组尺寸带（cm，buildBlanketFamilies 已去单位）。
 *  套装数来源：短标题或尺寸带（110x55 家族 size 字段存的是 "Set of N" 套件数，非尺寸）
 *  的 "Set of N"，或 handle "set-of-N"/"N-pack"，缺省 2（当前全线 2 件装）。 */
export function cushionCardTitle(f: BlanketFamily): string {
  const sizeBand = f.sizes[0] || '';
  const countMatch =
    f.rep.title.match(/set of (\d+)/i) ||
    sizeBand.match(/set of (\d+)/i) ||
    f.rep.handle.match(/set-of-(\d+)/i) ||
    f.rep.handle.match(/(\d)-pack/i);
  const count = countMatch ? countMatch[1] : '2';

  const sizeSeg = (() => {
    const t = f.rep.title;
    const round = t.match(/(\d+(?:\.\d+)?)\s*cm\s*round/i);
    if (round) return `${cmToIn(parseFloat(round[1]))} in Round`;
    const wh = t.match(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*cm/i);
    if (wh) return `${cmToIn(parseFloat(wh[1]))} x ${cmToIn(parseFloat(wh[2]))} in`;
    // 尺寸带首段是数字才是尺寸（"110×55"）；"Set of 4" 这类套件数段跳过
    return /^\d/.test(sizeBand) ? sizeBand : '';
  })();
  const sizeIn = sizeSeg.includes('in')
    ? sizeSeg
    : sizeSeg
        .split('×')
        .map((s) => cmToIn(parseFloat(s)))
        .filter((n) => !Number.isNaN(n))
        .join(' x ') + (sizeSeg ? ' in' : '');

  return `Cushions Set of ${count}${sizeIn ? `, ${sizeIn}` : ''}`;
}

/** 建家族 + 隐藏同花色有 Set of 2 的 Set of 4 卡片（名单见 variant-groups.ts） */
export function visibleCushionFamilies(products: MakimooProduct[]): BlanketFamily[] {
  return buildBlanketFamilies(products).filter(
    (f) => !CUSHION_LISTING_HIDDEN_ASINS.has(f.rep.asin.toLowerCase())
  );
}

/** 排序（2026-10-09 用户定）：同一变体组的卡片排在一起，排完一组再排下一组；
 *  组间顺序 = 组内卡片的最高权重位次（Featured 权重序），组内顺序 = 变体组注册顺序（与 PDP 色点一致） */
export function sortCushionFamilies(families: BlanketFamily[]): BlanketFamily[] {
  const reps = sortByWeight(families.map((f) => f.rep));
  const rank = new Map(reps.map((r, i) => [r.id, i]));
  // family.key = "组id::颜色"（有变体组）或 asin（单品成族）
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
