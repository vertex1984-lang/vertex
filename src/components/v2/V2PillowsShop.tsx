'use client';

import { useMemo } from 'react';
import { MakimooProduct } from '@/data/products';
import GroupProductCard from '@/components/v2/GroupProductCard';
import { buildGroupCards } from '@/lib/group-cards';
import { sortFamiliesByWeight } from '@/lib/family-cards';
import { buildBlanketFamilies } from '@/data/blanket-families';
import {
  PILLOW_TYPES,
  PILLOW_MATERIALS,
  pillowTypeOf,
  pillowMaterialOf,
} from '@/data/pillows-taxonomy';

/**
 * Pillows 一级选购视图：
 * - 2026-10-16 用户定：按 bedding 类目页结构重建——Type/Filling 下拉筛选条（含移动端
 *   Filter 弹层）整体移除，页头改 Parachute 式 hero（见 V2PillowsCatHero），
 *   选购区固定按形态（Inserts / Cases / Neck）分区平铺
 * - 2026-10-22 用户定（一组一卡 + 色卡）：卡片改 GroupProductCard——同组各色并一张卡，
 *   色卡行展示全部颜色（取代颜色文字行/合并卡颜色拼接）；卡面标题走 familyCardDisplay
 *   （pillowCardTitle 同口径）；列表卡合并场景（b0-travel-memory 一族一卡）由组折叠天然覆盖
 * - badge 遵循全站统一规则：分区标题已表形态，叠填充材质标签（无填充信息不叠）
 * - 排序固定 Featured（权重序）
 */
export default function V2PillowsShop({ products }: { products: MakimooProduct[] }) {
  // 组卡：未去重列表成族（buildBlanketFamilies 需看到全部尺寸 SKU 才有正确 From 价）→
  // 权重序 → 按变体组并卡（同组各色 = 色卡变体）
  const cards = useMemo(
    () => buildGroupCards(sortFamiliesByWeight(buildBlanketFamilies(products))),
    [products]
  );

  // 分区标题已表形态；卡片叠填充材质标签（全站统一 badge 规则）
  const cardBadges = (c: (typeof cards)[number]): string[] => {
    const m = pillowMaterialOf(c.rep);
    const label = m ? PILLOW_MATERIALS.find((x) => x.key === m)?.label : '';
    return label ? [label] : [];
  };

  // 始终按形态分区（有产品的形态才出分区，顺序按注册表）
  const sections = PILLOW_TYPES.map((t) => ({
    taxon: t,
    list: cards.filter((c) => pillowTypeOf(c.rep) === t.key),
  })).filter((s) => s.list.length > 0);

  return (
    <div>
      {sections.map((s, i) => (
        <section
          key={s.taxon.key}
          className={`py-8 lg:py-12 ${i === 0 ? 'pt-0' : 'border-t border-[#E8E2DA]'}`}
        >
          <h2 className="mb-5 lg:mb-8 text-lg lg:text-2xl font-extrabold text-charcoal">
            {s.taxon.label}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
            {s.list.map((c) => (
              <GroupProductCard
                key={c.key}
                card={c}
                badges={cardBadges(c)}
                paddedWhiteBg={!!c.rep.imageWhiteBg?.[0]}
                compactText
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
