'use client';

import { useMemo } from 'react';
import { MakimooProduct } from '@/data/products';
import GroupProductCard from '@/components/v2/GroupProductCard';
import { buildGroupCards } from '@/lib/group-cards';
import { getSubcategoriesOf } from '@/data/subcategories';
import {
  visibleCushionFamilies,
  sortCushionFamilies,
} from '@/data/cushion-families';

/**
 * /products?cat=cushions 选购视图：
 * - 2026-10-09 用户定：按 pillows/bedding 的家族卡结构改造（复用 buildBlanketFamilies 按颜色成族）；
 *   卡片标题/Set of 4 隐藏/变体聚拢排序逻辑抽在 @/data/cushion-families（与 /cushions/[slug]/ 二级页共用）；
 *   compactText 与 pillows/bedding 卡片字体一致
 * - 2026-10-23 用户定：取消 corduroy/solids/prints 风格 3 区，全部并入 Outdoor Cushions 单分区（见 classifyCushion）
 * - 2026-10-18 用户定：筛选 UI 整块移除（粘性 Style 下拉 / 移动端 Filter 按钮 + 底部弹层 / URL sub 过滤）——
 *   分类导航由类目 hero 快链承担（见 V2CushionsCatHero → /cushions/[slug]/ 二级页）
 * - 排序固定 Featured（权重序）
 */
export default function V2CushionsShop({ products }: { products: MakimooProduct[] }) {
  const families = useMemo(() => visibleCushionFamilies(products), [products]);

  const sorted = useMemo(() => sortCushionFamilies(families), [families]);

  // 家族风格 = 代表品的二级分类（enrich 时 classifyCushion 已按变体组归位）
  const styleOf = (f: (typeof sorted)[number]) => f.rep.subcategory || '';

  // 有产品的分类才出分区（2026-10-23 起单分区 Outdoor Cushions）
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
            {/* 2026-10-22 一组一卡：同组各色并卡 + 色卡行；Set of 4 隐藏策略保留
                （visibleCushionFamilies 上游剔除）；卡面标题走 familyCardDisplay（cushionCardTitle 同口径） */}
            {buildGroupCards(s.list).map((c) => (
              <GroupProductCard key={c.key} card={c} compactText />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
