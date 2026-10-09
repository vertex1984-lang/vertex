'use client';

import { useMemo } from 'react';
import { MakimooProduct } from '@/data/products';
import { buildBlanketFamilies } from '@/data/blanket-families';
import BeddingSetCard from '@/components/v2/BeddingSetCard';
import { sortByWeight } from '@/lib/weights';

/**
 * /products?cat=cushions 选购视图（2026-10-09 用户定：按 pillows/bedding 的家族卡结构改造）：
 * 意图回显行（N styles from $X）+ 家族卡网格（复用 BeddingSetCard：From 价；
 * badge / 变体信息行已由 BeddingSetCard 全站开关统一关闭）。
 * 无筛选条——全类目仅一条产品线（摇椅垫 b0-rocking-95x45，7 色，无尺寸维度），
 * 与 blankets 同口径；以后坐垫品类丰富了（多类型/多材质）再参照 V2BedSetsShop 补下拉。
 * 排序固定 Featured（权重序）。
 * 家族分组直接复用 buildBlanketFamilies（逻辑通用：有变体组按颜色成族，无则单品成族）。
 * 卡片标题规则（2026-10-09 用户定）："{Color} Chair Cushions Set of 2"
 * （当前唯一产品线为 2 个装；新增其他套装规格时需扩展此规则）。
 */
export default function V2CushionsShop({ products }: { products: MakimooProduct[] }) {
  const families = useMemo(() => buildBlanketFamilies(products), [products]);

  // 固定 Featured 序：按权重降序（与 V2BeddingShop / V2BlanketsShop 一致）
  const sorted = useMemo(() => {
    const reps = sortByWeight(families.map((f) => f.rep));
    const byRep = new Map(families.map((f) => [f.rep.id, f]));
    return reps.map((r) => byRep.get(r.id)!).filter(Boolean);
  }, [families]);

  // 价格锚点：全部家族的最低 From 价 / 最高变体价（同 bedding/blankets 口径）
  const [minPrice, maxPrice] = useMemo(() => {
    const mins = families.map((f) => parseFloat(f.fromPrice)).filter((n) => !Number.isNaN(n) && n > 0);
    const maxs = families.map((f) => parseFloat(f.toPrice)).filter((n) => !Number.isNaN(n) && n > 0);
    return mins.length > 0 && maxs.length > 0 ? [Math.min(...mins), Math.max(...maxs)] : [null, null];
  }, [families]);

  return (
    <div>
      {/* 意图回显行：数量 + 价格区间（同 bedding/blankets 页） */}
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
          <BeddingSetCard
            key={f.key}
            family={{
              ...f,
              titleOverride: `${f.color ? `${f.color} ` : ''}Chair Cushions Set of 2`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
