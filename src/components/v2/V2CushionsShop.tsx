'use client';

import { useMemo } from 'react';
import { MakimooProduct } from '@/data/products';
import BeddingSetCard from '@/components/v2/BeddingSetCard';
import { getSubcategoriesOf } from '@/data/subcategories';
import {
  cushionCardTitle,
  visibleCushionFamilies,
  sortCushionFamilies,
} from '@/data/cushion-families';

/**
 * /products?cat=cushions 选购视图：
 * - 2026-10-09 用户定：按 pillows/bedding 的家族卡结构改造（复用 buildBlanketFamilies 按颜色成族）；
 *   卡片标题/Set of 4 隐藏/变体聚拢排序逻辑抽在 @/data/cushion-families（与 /cushions/[slug]/ 二级页共用）；
 *   compactText 与 pillows/bedding 卡片字体一致
 * - 按风格分 3 区展示（corduroy / solids / prints，注册表见 subcategories.ts，归位逻辑见 classifyCushion）
 * - 2026-10-18 用户定：筛选 UI 整块移除（粘性 Style 下拉 / 移动端 Filter 按钮 + 底部弹层 / URL sub 过滤）——
 *   风格导航由类目 hero 快链承担（见 V2CushionsCatHero → /cushions/[slug]/ 二级页）
 * - 排序固定 Featured（权重序）
 */
export default function V2CushionsShop({ products }: { products: MakimooProduct[] }) {
  const families = useMemo(() => visibleCushionFamilies(products), [products]);

  const sorted = useMemo(() => sortCushionFamilies(families), [families]);

  // 家族风格 = 代表品的二级分类（enrich 时 classifyCushion 已按变体组归位）
  const styleOf = (f: (typeof sorted)[number]) => f.rep.subcategory || '';

  // 有产品的风格才出分区（顺序按注册表：corduroy → solids → prints）
  const sections = getSubcategoriesOf('cushions')
    .map((s) => ({ def: s, list: sorted.filter((f) => styleOf(f) === s.key) }))
    .filter((s) => s.list.length > 0);

  return (
    <div>
      {sections.map((s, i) => (
        <section
          key={s.def.key}
          className={`py-8 lg:py-12 ${i === 0 ? 'pt-0' : 'border-t border-[#E8E2DA]'}`}
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
                  titleOverride: cushionCardTitle(f),
                  // 2026-10-18 用户定：cushions 卡也加标题下浅色颜色行（同 bedding/pillows）
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
