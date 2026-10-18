'use client';

import { useMemo } from 'react';
import { MakimooProduct } from '@/data/products';
import BeddingSetCard from '@/components/v2/BeddingSetCard';
import { getSubcategoriesOf } from '@/data/subcategories';
import {
  towelCardTitle,
  visibleTowelFamilies,
  sortTowelFamilies,
} from '@/data/towel-families';

/**
 * /products?cat=towels 选购视图（2026-10-15 用户定：按 pillows/cushions 家族卡结构重建）：
 * - 复用 buildBlanketFamilies 按颜色成族；卡片标题/排序逻辑在 @/data/towel-families
 * - 按类型分区展示：towels(Bath Towels) / beach（Beach Towels）两区，
 *   注册表见 subcategories.ts，归位逻辑见 classifyTowel
 * - 2026-10-18 用户定：按 bedding 页结构重构——Type/Fabric 筛选 UI（下拉 + 移动端弹层）整块移除，
 *   类型导航由类目 hero 快链承担（V2TowelsCatHero → 页内锚点 #bath-towels / #beach-towels）；
 *   卡面加标题下浅色颜色行（同 bedding/pillows/cushions）
 * - 排序固定 Featured（权重序）
 */
export default function V2TowelsShop({ products }: { products: MakimooProduct[] }) {
  const families = useMemo(() => visibleTowelFamilies(products), [products]);

  const sorted = useMemo(() => sortTowelFamilies(families), [families]);

  // 家族类型 = 代表品的二级分类（enrich 时 classifyTowel 已归位）
  const typeOf = (f: (typeof sorted)[number]) => f.rep.subcategory || '';

  // 有产品的类型才出分区（顺序按注册表：towels → beach）
  const sections = getSubcategoriesOf('towels')
    .map((s) => ({ def: s, list: sorted.filter((f) => typeOf(f) === s.key) }))
    .filter((s) => s.list.length > 0);

  // 分区锚点 id（hero 快链页内跳转用）：towels → bath-towels，beach → beach-towels
  const anchorOf = (key: string) => (key === 'towels' ? 'bath-towels' : `${key}-towels`);

  return (
    <div>
      {sections.map((s, i) => (
        <section
          key={s.def.key}
          id={anchorOf(s.def.key)}
          className={`py-8 lg:py-12 scroll-mt-24 lg:scroll-mt-28 ${
            i === 0 ? 'pt-0' : 'border-t border-[#E8E2DA]'
          }`}
        >
          <h2 className="mb-5 lg:mb-8 text-lg lg:text-2xl font-extrabold text-charcoal">
            {s.def.label}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
            {s.list.map((f) => (
              <BeddingSetCard
                key={f.key}
                family={{
                  ...f,
                  titleOverride: towelCardTitle(f, s.def.label),
                  // 2026-10-18 用户定：towels 卡也加标题下浅色颜色行（同 bedding/pillows/cushions）
                  colorLine: f.color || undefined,
                }}
                compactText
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
