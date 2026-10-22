'use client';

import { useMemo } from 'react';
import { MakimooProduct } from '@/data/products';
import GroupProductCard from '@/components/v2/GroupProductCard';
import { collapseToFamilies } from '@/lib/family-cards';
import { buildGroupCards } from '@/lib/group-cards';
import { DECOR_SECTIONS, decorSectionOf } from '@/data/decor-families';

/**
 * /products?cat=decor 选购视图（2026-10-21 用户定：按 bedding 类目页结构重构，
 * 同 blankets/towels 口径）：
 * - 按分区展示（DECOR_SECTIONS 注册表：Wall Art / Trays & Tabletop / More Decor，
 *   与页头 hero 快链同口径，分区锚点 id = section.key）；
 *   Trays & Tabletop = 原 Dining 类目并入的藤编托盘/果盘家族
 * - 家族卡网格（collapseToFamilies + toFamilyCard：decor 无 PLP 标题规则，
 *   familyCardDisplay 默认分支 = 原标题 + 家族颜色行）；排序固定 Featured（权重序）
 * 无筛选条/排序下拉（decorMode 在 page.tsx 已豁免）；卡片不叠 badge（全站开关关闭中）。
 */
export default function V2DecorShop({ products }: { products: MakimooProduct[] }) {
  // collapseToFamilies 内部已按代表 SKU 权重排序（与 V2BlanketsShop 固定 Featured 序一致）
  const families = useMemo(() => collapseToFamilies(products), [products]);

  // 按分区（无产品的分区不出；顺序 = DECOR_SECTIONS 注册表）
  const sections = DECOR_SECTIONS
    .map((def) => ({ def, list: families.filter((f) => decorSectionOf(f.rep) === def.key) }))
    .filter((s) => s.list.length > 0);

  return (
    <div>
      {sections.map((s, i) => (
        <section
          key={s.def.key}
          id={s.def.key}
          className={`py-8 lg:py-12 scroll-mt-24 lg:scroll-mt-28 ${
            i === 0 ? 'pt-0' : 'border-t border-[#E8E2DA]'
          }`}
        >
          <div className="mb-5 lg:mb-8">
            <h2 className="text-lg lg:text-2xl font-extrabold text-charcoal">{s.def.label}</h2>
            {s.def.blurb && <p className="mt-1 text-xs lg:text-sm text-[#999]">{s.def.blurb}</p>}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
            {/* 2026-10-22 一组一卡：同组各色并卡 + 色卡行（decor 无 PLP 标题规则，
                familyCardDisplay 默认分支 = 原标题，同 toFamilyCard 口径） */}
            {buildGroupCards(s.list).map((c) => (
              <GroupProductCard key={c.key} card={c} compactText />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
