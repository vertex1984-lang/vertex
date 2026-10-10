'use client';

import { useMemo, useState } from 'react';
import { MakimooProduct } from '@/data/products';
import { BlanketFamily } from '@/data/blanket-families';
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
 * - 2026-10-09 用户定：按风格分 3 区展示 + 粘性 Style 筛选下拉（prints / solids / corduroy，
 *   注册表见 subcategories.ts，归位逻辑见 classifyCushion；选中某风格 = 只渲染该分区）
 * - 意图回显行（N styles from $X）保留在筛选条上方
 * - 排序固定 Featured（权重序）；无筛选交集维度，故无零结果兜底
 */
export default function V2CushionsShop({
  products,
  initialStyle = '',
}: {
  products: MakimooProduct[];
  /** URL ?sub= 深链（旧链接兼容，如 sub=corduroy）；新导航走 /cushions/[slug]/ 二级页 */
  initialStyle?: string;
}) {
  const [style, setStyle] = useState(initialStyle);

  const families = useMemo(() => visibleCushionFamilies(products), [products]);

  const sorted = useMemo(() => sortCushionFamilies(families), [families]);

  // 家族风格 = 代表品的二级分类（enrich 时 classifyCushion 已按变体组归位）
  const styleOf = (f: BlanketFamily) => f.rep.subcategory || '';

  // 有产品的风格才进下拉（顺序按注册表：prints → solids → corduroy）
  const styleOptions = useMemo(
    () => getSubcategoriesOf('cushions').filter((s) => sorted.some((f) => styleOf(f) === s.key)),
    [sorted]
  );

  // 防御旧链接（如 sub=rocking）：不在注册表里的风格按未选处理
  const activeStyle = styleOptions.some((s) => s.key === style) ? style : '';

  const filtered = useMemo(
    () => (activeStyle ? sorted.filter((f) => styleOf(f) === activeStyle) : sorted),
    [sorted, activeStyle]
  );

  const sections = styleOptions
    .map((s) => ({ def: s, list: filtered.filter((f) => styleOf(f) === s.key) }))
    .filter((s) => s.list.length > 0);

  // 价格锚点：全部家族的最低 From 价 / 最高变体价（同 bedding/blankets 口径）
  const [minPrice, maxPrice] = useMemo(() => {
    const mins = families.map((f) => parseFloat(f.fromPrice)).filter((n) => !Number.isNaN(n) && n > 0);
    const maxs = families.map((f) => parseFloat(f.toPrice)).filter((n) => !Number.isNaN(n) && n > 0);
    return mins.length > 0 && maxs.length > 0 ? [Math.min(...mins), Math.max(...maxs)] : [null, null];
  }, [families]);

  const styleLabel = (k: string) => styleOptions.find((s) => s.key === k)?.label || k;

  return (
    <div>
      {/* 意图回显行：数量 + 价格区间（同 bedding/blankets 页） */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4 lg:mb-5">
        <p className="text-sm lg:text-base text-charcoal-light">
          {filtered.length} styles
          {minPrice !== null && maxPrice !== null
            ? minPrice === maxPrice
              ? ` from $${minPrice.toFixed(2)}`
              : ` from $${minPrice.toFixed(2)} to $${maxPrice.toFixed(2)}`
            : ''}
        </p>
      </div>

      {/* 粘性筛选条：Style 下拉（与 pillows 页同款吸顶格式）。
          背景必须不透明（bg-off-white 实底），z-30 必须低于移动端导航抽屉遮罩 z-40 */}
      <div className="sticky top-[calc(60px+env(safe-area-inset-top,0px))] lg:top-[calc(88px+env(safe-area-inset-top,0px))] z-30 -mx-3 lg:-mx-10 px-3 lg:px-10 bg-off-white border-y border-[#E8E2DA] py-3 mb-5 lg:mb-7">
        <div className="flex items-center gap-2 lg:gap-2.5">
          {styleOptions.length > 1 && (
            <label className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#999]">Style:</span>
              <select
                value={activeStyle}
                onChange={(e) => setStyle(e.target.value)}
                className={`h-9 lg:h-10 px-3 lg:px-4 rounded-full border text-xs lg:text-sm font-medium bg-white outline-none transition ${
                  activeStyle
                    ? 'border-brand text-brand'
                    : 'border-warm-gray text-charcoal-light hover:border-brand'
                }`}
                aria-label="Filter by style"
              >
                <option value="">All</option>
                {styleOptions.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        {/* 已选摘要：结果数 + 一键清空（同 pillows 页） */}
        {activeStyle && (
          <div className="mt-2 pt-2 border-t border-[#E8E2DA] flex items-center gap-x-2 gap-y-1 flex-wrap text-xs lg:text-sm text-charcoal-light">
            <span>
              {styleLabel(activeStyle)}
              <span className="text-[#999]">
                {' '}· {filtered.length} style{filtered.length === 1 ? '' : 's'}
              </span>
            </span>
            <button
              onClick={() => setStyle('')}
              className="font-semibold text-brand underline underline-offset-2 hover:text-brand-dark"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

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
