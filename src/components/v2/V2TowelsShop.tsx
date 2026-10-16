'use client';

import { useMemo, useState } from 'react';
import { MakimooProduct } from '@/data/products';
import { BlanketFamily } from '@/data/blanket-families';
import BeddingSetCard from '@/components/v2/BeddingSetCard';
import V2FilterSheet, { FilterSheetGroup } from '@/components/v2/V2FilterSheet';
import { getSubcategoriesOf } from '@/data/subcategories';
import {
  towelCardTitle,
  visibleTowelFamilies,
  sortTowelFamilies,
} from '@/data/towel-families';

/** Fabric 维度（2026-10-16 用户定）：与 Type 并行的第二种分类法，按 asin 前缀判定系列归属；
 *  未归入任何系列的家族（fabric=''）在选中 Fabric 筛选时不显示 */
const FABRIC_OPTIONS = [
  {
    key: 'long-staple-cotton',
    label: 'Long-Staple Cotton',
    blurb: 'Extra-long staple fibers — softer, stronger and more absorbent with every wash.',
  },
  {
    key: 'classic-cotton',
    label: 'Classic Cotton',
    blurb: 'Everyday classic cotton terry — thick, plush and quick-drying for beach & pool.',
  },
] as const;

function fabricOf(f: BlanketFamily): string {
  const asin = (f.rep.asin || '').toLowerCase();
  if (asin.startsWith('mk-towel-lsc')) return 'long-staple-cotton';
  if (asin.startsWith('1688-952595759182')) return 'classic-cotton';
  return '';
}

/**
 * /products?cat=towels 选购视图（2026-10-15 用户定：按 pillows/cushions 家族卡结构重建）：
 * - 复用 buildBlanketFamilies 按颜色成族；卡片标题/排序逻辑在 @/data/towel-families
 * - 按类型分区展示 + 粘性 Type 筛选下拉（2026-10-16 起合并为 towels(Bath Towels) / beach 两区，
 *   注册表见 subcategories.ts，归位逻辑见 classifyTowel；选中某类型 = 只渲染该分区）
 * - Fabric 第二筛选维度（2026-10-16 用户定）：Long-Staple Cotton（mk-towel-lsc 系列）/
 *   Classic Cotton（1688-952595759182 沙滩巾系列），选中后在摘要行显示一句话简介
 * - 无意图回显行（与 cushions 页一致）；排序固定 Featured（权重序），无零结果兜底
 */
export default function V2TowelsShop({
  products,
  initialType = '',
}: {
  products: MakimooProduct[];
  /** URL ?sub= 深链（如 sub=beach） */
  initialType?: string;
}) {
  const [type, setType] = useState(initialType);
  const [fabric, setFabric] = useState('');
  // 2026-10-16 用户定：移动端筛选改 Filter 按钮 + 底部弹层，桌面端下拉不变
  const [filterOpen, setFilterOpen] = useState(false);

  const families = useMemo(() => visibleTowelFamilies(products), [products]);

  const sorted = useMemo(() => sortTowelFamilies(families), [families]);

  // 家族类型 = 代表品的二级分类（enrich 时 classifyTowel 已归位）
  const typeOf = (f: BlanketFamily) => f.rep.subcategory || '';

  // 有产品的类型才进下拉（顺序按注册表：towels → beach）
  const typeOptions = useMemo(
    () => getSubcategoriesOf('towels').filter((s) => sorted.some((f) => typeOf(f) === s.key)),
    [sorted]
  );

  // 防御旧链接：不在注册表里的类型按未选处理
  const activeType = typeOptions.some((s) => s.key === type) ? type : '';

  // 有产品的 Fabric 才进下拉
  const fabricOptions = useMemo(
    () => FABRIC_OPTIONS.filter((o) => sorted.some((f) => fabricOf(f) === o.key)),
    [sorted]
  );

  const activeFabric = fabricOptions.some((o) => o.key === fabric) ? fabric : '';
  const activeFabricDef = fabricOptions.find((o) => o.key === activeFabric);

  const filtered = useMemo(
    () =>
      sorted.filter(
        (f) =>
          (!activeType || typeOf(f) === activeType) &&
          (!activeFabric || fabricOf(f) === activeFabric)
      ),
    [sorted, activeType, activeFabric]
  );

  const sections = typeOptions
    .map((s) => ({ def: s, list: filtered.filter((f) => typeOf(f) === s.key) }))
    .filter((s) => s.list.length > 0);

  const typeLabel = (k: string) => typeOptions.find((s) => s.key === k)?.label || k;

  // 移动端底部弹层的筛选组（2026-10-16 用户定）：组与桌面端下拉同口径（>1 个可选项才纳入）；
  // values 绑定 activeType/activeFabric（与下拉一致，防御旧链接的非法值按未选显示）
  const filterGroups: FilterSheetGroup[] = [
    ...(typeOptions.length > 1
      ? [
          {
            key: 'type',
            title: 'Type',
            allLabel: 'All',
            options: typeOptions.map((s) => ({ value: s.key, label: s.label })),
          },
        ]
      : []),
    ...(fabricOptions.length > 1
      ? [
          {
            key: 'fabric',
            title: 'Fabric',
            allLabel: 'All Fabrics',
            options: fabricOptions.map((o) => ({ value: o.key, label: o.label, desc: o.blurb })),
          },
        ]
      : []),
  ];
  const activeFilterCount = (activeType ? 1 : 0) + (activeFabric ? 1 : 0);
  const clearAllFilters = () => {
    setType('');
    setFabric('');
  };

  return (
    <div>
      {/* 粘性筛选条：Type 下拉（与 cushions 页同款吸顶格式）。
          背景必须不透明（bg-off-white 实底），z-30 必须低于移动端导航抽屉遮罩 z-40 */}
      <div className="sticky top-[calc(52px+env(safe-area-inset-top,0px))] lg:top-[calc(88px+env(safe-area-inset-top,0px))] z-30 -mx-3 lg:-mx-10 px-3 lg:px-10 bg-off-white border-y border-[#E8E2DA] py-2 lg:py-3 mb-5 lg:mb-7">
        {/* 移动端行（2026-10-16 用户定：移动端筛选改 Filter 按钮 + 底部弹层，桌面端下拉不变）；
            至少一个组有可选项时才渲染 */}
        {(typeOptions.length > 1 || fabricOptions.length > 1) && (
          <div className="flex lg:hidden items-center justify-between py-0">
            <button
              onClick={() => setFilterOpen(true)}
              className={`flex items-center gap-1.5 h-8 px-3.5 rounded-full border text-xs font-medium ${
                activeFilterCount > 0
                  ? 'border-brand text-brand'
                  : 'border-warm-gray text-charcoal-light'
              }`}
              aria-label="Open filters"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
              </svg>
              Filter{activeFilterCount > 0 ? ` · ${activeFilterCount}` : ''}
            </button>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-brand underline underline-offset-2"
              >
                Clear
              </button>
            )}
          </div>
        )}
        {/* 桌面端下拉筛选条（原样保留，仅移动端隐藏） */}
        <div className="hidden lg:block">
        <div className="flex items-center gap-2 lg:gap-2.5 flex-wrap">
          {typeOptions.length > 1 && (
            <label className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#999]">Type:</span>
              <select
                value={activeType}
                onChange={(e) => setType(e.target.value)}
                className={`h-9 lg:h-10 px-3 lg:px-4 rounded-full border text-xs lg:text-sm font-medium bg-white outline-none transition ${
                  activeType
                    ? 'border-brand text-brand'
                    : 'border-warm-gray text-charcoal-light hover:border-brand'
                }`}
                aria-label="Filter by type"
              >
                <option value="">All</option>
                {typeOptions.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          )}
          {fabricOptions.length > 1 && (
            <label className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#999]">Fabric:</span>
              <select
                value={activeFabric}
                onChange={(e) => setFabric(e.target.value)}
                className={`h-9 lg:h-10 px-3 lg:px-4 rounded-full border text-xs lg:text-sm font-medium bg-white outline-none transition ${
                  activeFabric
                    ? 'border-brand text-brand'
                    : 'border-warm-gray text-charcoal-light hover:border-brand'
                }`}
                aria-label="Filter by fabric"
              >
                <option value="">All</option>
                {fabricOptions.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        {/* 已选摘要：结果数 + Fabric 一句话简介 + 一键清空（同 cushions 页） */}
        {(activeType || activeFabric) && (
          <div className="mt-2 pt-2 border-t border-[#E8E2DA] flex items-center gap-x-2 gap-y-1 flex-wrap text-xs lg:text-sm text-charcoal-light">
            <span>
              {[activeType && typeLabel(activeType), activeFabricDef?.label]
                .filter(Boolean)
                .join(' · ')}
              <span className="text-[#999]">
                {' '}· {filtered.length} style{filtered.length === 1 ? '' : 's'}
              </span>
            </span>
            {activeFabricDef && (
              <span className="text-[#999]">{activeFabricDef.blurb}</span>
            )}
            <button
              onClick={() => {
                setType('');
                setFabric('');
              }}
              className="font-semibold text-brand underline underline-offset-2 hover:text-brand-dark"
            >
              Clear all
            </button>
          </div>
        )}
        </div>
      </div>

      {/* 移动端筛选底部弹层（2026-10-16 用户定） */}
      {filterGroups.length > 0 && (
        <V2FilterSheet
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          groups={filterGroups}
          values={{ type: activeType, fabric: activeFabric }}
          onChange={(k, v) => {
            if (k === 'type') setType(v);
            else setFabric(v);
          }}
          onClearAll={clearAllFilters}
          resultCount={filtered.length}
        />
      )}

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
                  titleOverride: towelCardTitle(f, s.def.label),
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
