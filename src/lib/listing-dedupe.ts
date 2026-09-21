/**
 * 列表页变体去重（2026-09 用户定）：同一变体族内"同款同色"只保留一个卡位入口，
 * 不同颜色各自保留一张卡。口径与 PDP 颜色圆点一致（均按 VARIANT_GROUPS 的 color 去重）。
 *
 * 代表成员选择（prefer）：
 * - 'weight'（默认）：在售优先 → 权重最高 → 自然顺序（sortByWeight 自带 pin/沉底/excluded 口径）
 * - 'order'：保持入参顺序取首个（调用方已按业务排序时使用，如 New Arrivals 按上架时间）
 *
 * 返回值为入参的子集且保持原有顺序，调用方的排序/筛选/配额逻辑不受影响；
 * 非家族成员（真单品）原样保留。
 */

import { VARIANT_GROUPS } from '@/data/variant-groups';
import { sortByWeight } from '@/lib/weights';
import type { MakimooProduct } from '@/data/products';

// handle → 去重键（familyId + 归一化颜色）
const familyColorByHandle = new Map<string, string>();
for (const group of VARIANT_GROUPS) {
  for (const member of group.members) {
    familyColorByHandle.set(member.handle, `${group.id}::${member.color.trim().toLowerCase()}`);
  }
}

export function dedupeFamilyColors<T extends MakimooProduct>(
  products: T[],
  prefer: 'weight' | 'order' = 'weight'
): T[] {
  const keyOf = (p: T) => familyColorByHandle.get(p.handle);
  const representative = new Map<string, T>();

  if (prefer === 'order') {
    for (const p of products) {
      const key = keyOf(p);
      if (key && !representative.has(key)) representative.set(key, p);
    }
  } else {
    for (const p of sortByWeight(products)) {
      const key = keyOf(p);
      if (key && !representative.has(key)) representative.set(key, p);
    }
    // 兜底：被权重表 excluded 的成员不参与排序，若某键仍无代表则取自然顺序首个
    for (const p of products) {
      const key = keyOf(p);
      if (key && !representative.has(key)) representative.set(key, p);
    }
  }

  if (representative.size === 0) return products;
  return products.filter((p) => {
    const key = keyOf(p);
    return !key || representative.get(key) === p;
  });
}
