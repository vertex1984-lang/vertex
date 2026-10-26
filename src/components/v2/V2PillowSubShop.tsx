'use client';

import { useMemo, useState } from 'react';
import { MakimooProduct } from '@/data/products';
import GroupProductCard from '@/components/v2/GroupProductCard';
import { collapseProductsToGroupCards } from '@/lib/group-cards';
import V2FilterSheet, { FilterSheetGroup } from '@/components/v2/V2FilterSheet';
import {
  PILLOW_TYPES,
  PILLOW_MATERIALS,
  pillowTypeOf,
  pillowMaterialOf,
} from '@/data/pillows-taxonomy';

/**
 * Pillows 二级类目页选购区（2026-09-30 用户定：展示方法与逻辑完全对齐 /bedding/bed-sets/）：
 * - 形态页（/pillows/pillow-inserts/ 等）：按材质分区，筛选项 = Material 下拉
 * - 材质页（/pillows/down-alternative/ 等）：按形态分区，筛选项 = Type 下拉
 * - 选中 = 只渲染该分区；零结果给友好提示 + Clear Filters（不留死路）
 * - 不叠 badge：页标题（形态/材质）+ 分区标题（另一维度）已把两个维度都表达
 *   （同 bedding 面料页 noBadges 规则）
 * - 2026-10-22 用户定（一组一卡 + 色卡）：卡片改 GroupProductCard——同组各色并一张卡，
 *   色卡行展示全部颜色；卡面标题走 familyCardDisplay（pillowCardTitle 同口径）；
 *   原列表卡合并（b0-travel-memory 一族一卡）由组折叠天然覆盖
 */

export default function V2PillowSubShop({
  products,
  sectionBy,
  flat = false,
}: {
  products: MakimooProduct[];
  /** type 页按材质分区；material 页按形态分区 */
  sectionBy: 'type' | 'material';
  /** flat = 平铺网格：不出筛选条、不分区（2026-10-25 用户定：pillow-inserts 页对齐 pillow-cases 样式） */
  flat?: boolean;
}) {
  const [selected, setSelected] = useState('');
  // 2026-10-16 用户定：移动端筛选改 Filter 按钮 + 底部弹层，桌面端下拉不变
  const [filterOpen, setFilterOpen] = useState(false);

  // 一组一卡（2026-10-22）：入参已是同色去重+聚拢的产品列表，按变体组并卡；
  // 组 key/计数/筛选全部按组卡口径
  const cards = useMemo(() => collapseProductsToGroupCards(products), [products]);

  const keyOf = useMemo(() => {
    const fn = sectionBy === 'type' ? pillowTypeOf : pillowMaterialOf;
    const map = new Map(cards.map((c) => [c.key, fn(c.rep)]));
    return (c: (typeof cards)[number]) => map.get(c.key) || '';
  }, [cards, sectionBy]);

  const registry = sectionBy === 'type' ? PILLOW_TYPES : PILLOW_MATERIALS;
  const options = registry.filter((t) => cards.some((c) => keyOf(c) === t.key));

  const filtered = selected ? cards.filter((c) => keyOf(c) === selected) : cards;
  const sections = options
    .map((t) => ({ taxon: t, list: filtered.filter((c) => keyOf(c) === t.key) }))
    .filter((s) => s.list.length > 0);

  // 2026-10-09 用户定：材质维度对外文案改 Filling（填充物口径，比 Material 更贴合枕芯）
  const dimLabel = sectionBy === 'type' ? 'Type:' : 'Filling:';
  const allLabel = sectionBy === 'type' ? 'All' : 'All Fillings';

  // 移动端底部弹层的筛选组（2026-10-16 用户定）：单组，标题/All 文案与桌面端下拉一致
  const filterGroups: FilterSheetGroup[] = [
    {
      key: 'sel',
      title: sectionBy === 'type' ? 'Type' : 'Filling',
      allLabel,
      options: options.map((t) => ({ value: t.key, label: t.label })),
    },
  ];

  // flat 模式（pillow-inserts）：无筛选条、无分区标题，直接平铺网格（对齐 pillow-cases 样式）
  if (flat) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
        {cards.map((c) => (
          <GroupProductCard
            key={c.key}
            card={c}
            paddedWhiteBg={!!c.rep.imageWhiteBg?.[0]}
            compactText
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* 粘性筛选条：单一维度下拉（与 /bedding/bed-sets/ 同款吸顶格式）。
          背景必须不透明（bg-off-white 实底），z-30 必须低于移动端导航抽屉遮罩 z-40 */}
      {options.length > 1 && (
        <div className="sticky top-[calc(52px+env(safe-area-inset-top,0px))] lg:top-[calc(88px+env(safe-area-inset-top,0px))] z-30 -mx-3 lg:-mx-10 px-3 lg:px-10 bg-off-white border-y border-[#E8E2DA] py-2 lg:py-3 mb-5 lg:mb-7">
          {/* 移动端行（2026-10-16 用户定：移动端筛选改 Filter 按钮 + 底部弹层，桌面端下拉不变）；
              沿用整条筛选条的 options.length > 1 条件 */}
          <div className="flex lg:hidden items-center justify-between py-0">
            <button
              onClick={() => setFilterOpen(true)}
              className={`flex items-center gap-1.5 h-8 px-3.5 rounded-full border text-xs font-medium ${
                selected
                  ? 'border-brand text-brand'
                  : 'border-warm-gray text-charcoal-light'
              }`}
              aria-label="Open filters"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
              </svg>
              Filter{selected ? ' · 1' : ''}
            </button>
            {selected && (
              <button
                onClick={() => setSelected('')}
                className="text-xs font-semibold text-brand underline underline-offset-2"
              >
                Clear
              </button>
            )}
          </div>
          {/* 桌面端下拉筛选条（原样保留，仅移动端隐藏） */}
          <div className="hidden lg:block">
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
        </div>
      )}

      {/* 移动端筛选底部弹层（2026-10-16 用户定）；与筛选条同条件渲染 */}
      {options.length > 1 && (
        <V2FilterSheet
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          groups={filterGroups}
          values={{ sel: selected }}
          onChange={(_k, v) => setSelected(v)}
          onClearAll={() => setSelected('')}
          resultCount={filtered.length}
        />
      )}

      {sections.length === 0 ? (
        filtered.length > 0 ? (
          /* 2026-10-08：产品存在但不命中任何分区 taxon（如枕套无填充材质）时，
             直接平铺网格，不再误报 "No pillows match this filter." */
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
            {filtered.map((c) => (
              <GroupProductCard
                key={c.key}
                card={c}
                paddedWhiteBg={!!c.rep.imageWhiteBg?.[0]}
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
      ) : sections.length === 1 ? (
        /* 2026-10-16 用户定：只剩一个分区时不出细分标题直接平铺（细分标题与页头信息重复）；
           2026-10-23：neck-pillows / memory-foam 二级页随颈枕下架移除，现存二级页均为单分区 */
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
          {sections[0].list.map((c) => (
            <GroupProductCard
              key={c.key}
              card={c}
              paddedWhiteBg={!!c.rep.imageWhiteBg?.[0]}
              compactText
            />
          ))}
        </div>
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
              {s.list.map((c) => (
                <GroupProductCard
                  key={c.key}
                  card={c}
                  paddedWhiteBg={!!c.rep.imageWhiteBg?.[0]}
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
