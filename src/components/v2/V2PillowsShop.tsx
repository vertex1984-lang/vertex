'use client';

import { useMemo } from 'react';
import { MakimooProduct } from '@/data/products';
import BeddingSetCard, { FamilyCardData } from '@/components/v2/BeddingSetCard';
import { sortByWeight } from '@/lib/weights';
import { dedupeFamilyColors, clusterFamilies } from '@/lib/listing-dedupe';
import {
  PILLOW_TYPES,
  PILLOW_MATERIALS,
  pillowTypeOf,
  pillowMaterialOf,
  pillowSizesOf,
  pillowCardTitle,
  pillowCardColor,
  applyPillowCardMerges,
} from '@/data/pillows-taxonomy';

/**
 * Pillows 一级选购视图：
 * - 2026-10-16 用户定：按 bedding 类目页结构重建——Type/Filling 下拉筛选条（含移动端
 *   Filter 弹层）整体移除，页头改 Parachute 式 hero（见 V2PillowsCatHero），
 *   选购区固定按形态（Inserts / Cases / Neck）分区平铺
 * - 卡片 = BeddingSetCard 同款家族卡（方图 + 徽标 + 标题 + 尺寸带 + From 价）；
 *   badge 遵循全站统一规则：分区标题已表形态，叠填充材质标签（无填充信息不叠）
 * - 排序固定 Featured（权重序）；列表卡合并保留（2026-10-02，如两款记忆棉颈枕合并为一张卡）
 */

/** MakimooProduct → BeddingSetCard 最小数据形状（尺寸带取变体族全尺寸；From 价 = 卡片展示价；
 *  colors/From 价覆盖 = pillows 合并卡（2026-10-02，如两款记忆棉颈枕合并为一张卡）；
 *  titleOverride = 卡片标题规则（2026-10-09，pillowCardTitle：ins "Pillow Inserts Set of 2" /
 *  长抱枕 "Body Pillow Insert" / cases "Pillow Covers Set of 2"）；
 *  colorLine = 标题下浅色颜色行（2026-10-18 用户定；合并卡显示全部颜色 "A / B" 拼接） */
function toFamilyCard(
  p: MakimooProduct,
  colors?: string[],
  priceOverride?: { amount: string; currency: string }
): FamilyCardData {
  return {
    rep: p,
    sizes: pillowSizesOf(p),
    fromPrice: priceOverride?.amount || p.shopifyPrice || p.priceRange?.minVariantPrice?.amount || '',
    currency:
      priceOverride?.currency ||
      p.shopifyCurrencyCode ||
      p.priceRange?.minVariantPrice?.currencyCode ||
      'USD',
    colors,
    titleOverride: pillowCardTitle(p) || undefined,
    colorLine: colors?.length ? colors.join(' / ') : pillowCardColor(p) || undefined,
  };
}

export default function V2PillowsShop({ products }: { products: MakimooProduct[] }) {
  // 展示口径：同色去重 + 固定权重序（与全站 PLP 一致：excluded 排除、缺货沉底）
  // + 同家族色卡聚拢相邻（2026-10-16 用户定：排完一个变体族才到下一个，不穿插）
  // + 列表卡合并（2026-10-02）：两款记忆棉颈枕合并为一张卡
  const { list: cards, colorsByHandle, fromPriceByHandle } = useMemo(
    () => applyPillowCardMerges(clusterFamilies(sortByWeight(dedupeFamilyColors(products)))),
    [products]
  );

  // 分区标题已表形态；卡片叠填充材质标签（全站统一 badge 规则）
  const cardBadges = (p: MakimooProduct): string[] => {
    const m = pillowMaterialOf(p);
    const label = m ? PILLOW_MATERIALS.find((x) => x.key === m)?.label : '';
    return label ? [label] : [];
  };

  // 始终按形态分区（有产品的形态才出分区，顺序按注册表）
  const sections = PILLOW_TYPES.map((t) => ({
    taxon: t,
    list: cards.filter((p) => pillowTypeOf(p) === t.key),
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
            {s.list.map((p) => (
              <BeddingSetCard
                key={p.id}
                family={toFamilyCard(p, colorsByHandle.get(p.handle), fromPriceByHandle.get(p.handle))}
                badges={cardBadges(p)}
                paddedWhiteBg={!!p.imageWhiteBg?.[0]}
                compactText
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
