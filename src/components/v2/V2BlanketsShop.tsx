'use client';

import { useMemo } from 'react';
import { MakimooProduct } from '@/data/products';
import { buildBlanketFamilies } from '@/data/blanket-families';
import BeddingSetCard from '@/components/v2/BeddingSetCard';
import { sortByWeight } from '@/lib/weights';

/**
 * /products?cat=blankets 选购视图（2026-09-27 用户定，参照 bedding 页样式）：
 * 意图回显行（N styles from $X to $Y，上限取家族内变体最高价 toPrice）+ 家族卡网格
 * （复用 BeddingSetCard：From 价 + 尺寸带，sizesSuffix="cm" 统一补单位）。
 * 无筛选条——全类目仅一条产品线（仿兔毛毯），没有任何筛选维度，加了也是空壳；
 * 以后毯子品类丰富了（多材质/多类型）再参照 V2BedSetsShop 补 Type/Fabric 下拉。
 * 排序固定 Featured（权重序），无排序下拉（同 bedding 规则）。
 * 卡片不叠任何 badge：页面标题已表达类目、全页同一材质，两维度都已表达（统一规则）。
 */
export default function V2BlanketsShop({ products }: { products: MakimooProduct[] }) {
  const families = useMemo(() => buildBlanketFamilies(products), [products]);

  // 固定 Featured 序：按权重降序（与 V2BeddingShop 一致）
  const sorted = useMemo(() => {
    const reps = sortByWeight(families.map((f) => f.rep));
    const byRep = new Map(families.map((f) => [f.rep.id, f]));
    return reps.map((r) => byRep.get(r.id)!).filter(Boolean);
  }, [families]);

  // 价格锚点：全部家族的最低 From 价 / 最高变体价（同 V2BeddingShop 口径）
  const [minPrice, maxPrice] = useMemo(() => {
    const mins = families.map((f) => parseFloat(f.fromPrice)).filter((n) => !Number.isNaN(n) && n > 0);
    const maxs = families.map((f) => parseFloat(f.toPrice)).filter((n) => !Number.isNaN(n) && n > 0);
    return mins.length > 0 && maxs.length > 0 ? [Math.min(...mins), Math.max(...maxs)] : [null, null];
  }, [families]);

  return (
    <div>
      {/* 意图回显行：数量 + 价格区间（同 bedding 页） */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4 lg:mb-5">
        <p className="text-sm lg:text-base text-charcoal-light">
          {families.length} styles
          {minPrice !== null && maxPrice !== null
            ? minPrice === maxPrice
              ? ` from $${minPrice.toFixed(2)}`
              : ` from $${minPrice.toFixed(2)} to $${maxPrice.toFixed(2)}`
            : ''}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
        {sorted.map((f) => (
          <BeddingSetCard key={f.key} family={f} sizesSuffix="cm" />
        ))}
      </div>
    </div>
  );
}
