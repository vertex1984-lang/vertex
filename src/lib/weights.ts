import { PRODUCT_WEIGHTS, ProductWeight } from '@/data/product-weights';

interface Weightable {
  asin: string;
  hasShopifyData?: boolean;
  shopifyAvailable?: boolean;
}

export function weightOf(asin: string): ProductWeight | undefined {
  return PRODUCT_WEIGHTS[asin.toLowerCase()];
}

// 类目平均分（全部在售产品的总分均值）：总分相同的按类目平均分降序破平，
// 不做类目配额平衡——允许一个类目多、一个类目少（2026-09 用户确认）
const CAT_AVG: Record<string, number> = (() => {
  const sum: Record<string, { s: number; n: number }> = {};
  for (const w of Object.values(PRODUCT_WEIGHTS)) {
    if (w.excluded) continue;
    (sum[w.type] ||= { s: 0, n: 0 }).s += w.score;
    sum[w.type].n++;
  }
  return Object.fromEntries(Object.entries(sum).map(([k, v]) => [k, v.s / v.n]));
})();

export const categoryAvgOf = (asin: string): number => {
  const t = weightOf(asin)?.type;
  return t ? CAT_AVG[t] ?? 0 : 0;
};

/**
 * 权重排序（统一出口，类目页 featured 排序 / Best Sellers / 推荐位共用）：
 *  1. excluded 直接排除
 *  2. 缺货沉底（保持原有行为）
 *  3. pin 硬置顶：占在售组的固定位次（1 起），凌驾于一切排序
 *  4. buried 沉到在售组末尾（缺货组之前）
 *  5. 其余按总分降序；总分相同按类目平均分降序，再同分保持传入顺序（稳定排序）
 */
export function sortByWeight<T extends Weightable>(list: T[]): T[] {
  const inStock = (p: T) => p.hasShopifyData === true && p.shopifyAvailable === true;
  const pool = list.filter((p) => !weightOf(p.asin)?.excluded);
  const avail = pool.filter(inStock);
  const out = pool.filter((p) => !inStock(p));

  const buried = avail.filter((p) => weightOf(p.asin)?.buried);
  const normal = avail.filter((p) => !weightOf(p.asin)?.buried);

  const pinned = normal
    .filter((p) => weightOf(p.asin)?.pin)
    .sort((a, b) => weightOf(a.asin)!.pin! - weightOf(b.asin)!.pin!);
  const rest = normal.filter((p) => !weightOf(p.asin)?.pin);

  const sorted = rest
    .map((p, i) => ({ p, i }))
    .sort(
      (a, b) =>
        (weightOf(b.p.asin)?.score ?? 0) - (weightOf(a.p.asin)?.score ?? 0) ||
        categoryAvgOf(b.p.asin) - categoryAvgOf(a.p.asin) ||
        a.i - b.i
    )
    .map((x) => x.p);

  // pin 占绝对位次（多个 pin 按位次先后插入）
  for (const p of pinned) {
    const pos = Math.min(weightOf(p.asin)!.pin! - 1, sorted.length);
    sorted.splice(pos, 0, p);
  }

  return [...sorted, ...buried, ...out];
}
