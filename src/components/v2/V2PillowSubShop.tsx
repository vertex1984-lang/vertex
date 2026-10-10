'use client';

import { useMemo, useState } from 'react';
import { MakimooProduct } from '@/data/products';
import BeddingSetCard, { FamilyCardData } from '@/components/v2/BeddingSetCard';
import {
  PILLOW_TYPES,
  PILLOW_MATERIALS,
  pillowTypeOf,
  pillowMaterialOf,
  pillowSizesOf,
  pillowCardTitle,
  applyPillowCardMerges,
} from '@/data/pillows-taxonomy';

/**
 * Pillows 二级类目页选购区（2026-09-30 用户定：展示方法与逻辑完全对齐 /bedding/bed-sets/）：
 * - 形态页（/pillows/pillow-inserts/ 等）：按材质分区，筛选项 = Material 下拉
 * - 材质页（/pillows/down-alternative/ 等）：按形态分区，筛选项 = Type 下拉
 * - 选中 = 只渲染该分区；零结果给友好提示 + Clear Filters（不留死路）
 * - 不叠 badge：页标题（形态/材质）+ 分区标题（另一维度）已把两个维度都表达
 *   （同 bedding 面料页 noBadges 规则）
 */

/** MakimooProduct → BeddingSetCard 最小数据形状（尺寸带取变体族全尺寸；From 价 = 卡片展示价；
 *  colors/From 价覆盖 = pillows 合并卡（2026-10-02，如两款记忆棉颈枕合并为一张卡）；
 *  titleOverride = 卡片标题规则（2026-10-09，pillowCardTitle：ins "Pillow Inserts Set of 2" /
 *  长抱枕 "Body Pillow Insert" / cases "Pillow Covers Set of 2"，颈枕返回 '' 不覆盖）） */
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
  };
}

export default function V2PillowSubShop({
  products,
  sectionBy,
}: {
  products: MakimooProduct[];
  /** type 页按材质分区；material 页按形态分区 */
  sectionBy: 'type' | 'material';
}) {
  const [selected, setSelected] = useState('');

  // 列表卡合并（2026-10-02）：两款记忆棉颈枕合并为一张卡，非代表成员在此移除
  const { list: cards, colorsByHandle, fromPriceByHandle } = useMemo(
    () => applyPillowCardMerges(products),
    [products]
  );

  const keyOf = useMemo(() => {
    const fn = sectionBy === 'type' ? pillowTypeOf : pillowMaterialOf;
    const map = new Map(cards.map((p) => [p.handle, fn(p)]));
    return (p: MakimooProduct) => map.get(p.handle) || '';
  }, [cards, sectionBy]);

  const registry = sectionBy === 'type' ? PILLOW_TYPES : PILLOW_MATERIALS;
  const options = registry.filter((t) => cards.some((p) => keyOf(p) === t.key));

  const filtered = selected ? cards.filter((p) => keyOf(p) === selected) : cards;
  const sections = options
    .map((t) => ({ taxon: t, list: filtered.filter((p) => keyOf(p) === t.key) }))
    .filter((s) => s.list.length > 0);

  // 2026-10-09 用户定：材质维度对外文案改 Filling（填充物口径，比 Material 更贴合枕芯）
  const dimLabel = sectionBy === 'type' ? 'Type:' : 'Filling:';
  const allLabel = sectionBy === 'type' ? 'All' : 'All Fillings';

  return (
    <div>
      {/* 粘性筛选条：单一维度下拉（与 /bedding/bed-sets/ 同款吸顶格式）。
          背景必须不透明（bg-off-white 实底），z-30 必须低于移动端导航抽屉遮罩 z-40 */}
      {options.length > 1 && (
        <div className="sticky top-[calc(60px+env(safe-area-inset-top,0px))] lg:top-[calc(88px+env(safe-area-inset-top,0px))] z-30 -mx-3 lg:-mx-10 px-3 lg:px-10 bg-off-white border-y border-[#E8E2DA] py-3 mb-5 lg:mb-7">
          <div className="flex items-center gap-2 lg:gap-2.5">
            <label className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#999]">{dimLabel}</span>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className={`h-9 lg:h-10 px-3 lg:px-4 rounded-full border text-xs lg:text-sm font-medium bg-white outline-none transition ${
                  selected
                    ? 'border-brand text-brand'
                    : 'border-warm-gray text-charcoal-light hover:border-brand'
                }`}
                aria-label={sectionBy === 'type' ? 'Filter by type' : 'Filter by filling'}
              >
                <option value="">{allLabel}</option>
                {options.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {selected && (
            <div className="mt-2 pt-2 border-t border-[#E8E2DA] flex items-center gap-x-2 gap-y-1 flex-wrap text-xs lg:text-sm text-charcoal-light">
              <span>
                {options.find((o) => o.key === selected)?.label}
                <span className="text-[#999]">
                  {' '}· {filtered.length} style{filtered.length === 1 ? '' : 's'}
                </span>
              </span>
              <button
                onClick={() => setSelected('')}
                className="font-semibold text-brand underline underline-offset-2 hover:text-brand-dark"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {sections.length === 0 ? (
        filtered.length > 0 ? (
          /* 2026-10-08：产品存在但不命中任何分区 taxon（如枕套无填充材质）时，
             直接平铺网格，不再误报 "No pillows match this filter." */
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
            {filtered.map((p) => (
              <BeddingSetCard
                key={p.id}
                family={toFamilyCard(p, colorsByHandle.get(p.handle), fromPriceByHandle.get(p.handle))}
                paddedWhiteBg={!!p.imageWhiteBg?.[0]}
                compactText
              />
            ))}
          </div>
        ) : (
        <div className="py-14 lg:py-20 text-center">
          <p className="text-base lg:text-lg font-semibold text-charcoal">No pillows match this filter.</p>
          <button
            type="button"
            onClick={() => setSelected('')}
            className="mt-5 h-9 lg:h-10 px-5 rounded-full border border-brand text-brand text-xs lg:text-sm font-semibold hover:bg-brand hover:text-white transition"
          >
            Clear Filters
          </button>
        </div>
        )
      ) : (
        sections.map((s, i) => (
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
                  paddedWhiteBg={!!p.imageWhiteBg?.[0]}
                  compactText
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
