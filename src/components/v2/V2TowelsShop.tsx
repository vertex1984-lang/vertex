'use client';

import { useMemo, useState } from 'react';
import { MakimooProduct } from '@/data/products';
import { BlanketFamily } from '@/data/blanket-families';
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
 * - 按类型分 3 区展示 + 粘性 Type 筛选下拉（bath-towels / beach / hand-face，
 *   注册表见 subcategories.ts，归位逻辑见 classifyTowel；选中某类型 = 只渲染该分区）
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

  const families = useMemo(() => visibleTowelFamilies(products), [products]);

  const sorted = useMemo(() => sortTowelFamilies(families), [families]);

  // 家族类型 = 代表品的二级分类（enrich 时 classifyTowel 已归位）
  const typeOf = (f: BlanketFamily) => f.rep.subcategory || '';

  // 有产品的类型才进下拉（顺序按注册表：bath-towels → beach → hand-face）
  const typeOptions = useMemo(
    () => getSubcategoriesOf('towels').filter((s) => sorted.some((f) => typeOf(f) === s.key)),
    [sorted]
  );

  // 防御旧链接：不在注册表里的类型按未选处理
  const activeType = typeOptions.some((s) => s.key === type) ? type : '';

  const filtered = useMemo(
    () => (activeType ? sorted.filter((f) => typeOf(f) === activeType) : sorted),
    [sorted, activeType]
  );

  const sections = typeOptions
    .map((s) => ({ def: s, list: filtered.filter((f) => typeOf(f) === s.key) }))
    .filter((s) => s.list.length > 0);

  const typeLabel = (k: string) => typeOptions.find((s) => s.key === k)?.label || k;

  return (
    <div>
      {/* 粘性筛选条：Type 下拉（与 cushions 页同款吸顶格式）。
          背景必须不透明（bg-off-white 实底），z-30 必须低于移动端导航抽屉遮罩 z-40 */}
      <div className="sticky top-[calc(52px+env(safe-area-inset-top,0px))] lg:top-[calc(88px+env(safe-area-inset-top,0px))] z-30 -mx-3 lg:-mx-10 px-3 lg:px-10 bg-off-white border-y border-[#E8E2DA] py-3 mb-5 lg:mb-7">
        <div className="flex items-center gap-2 lg:gap-2.5">
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
        </div>
        {/* 已选摘要：结果数 + 一键清空（同 cushions 页） */}
        {activeType && (
          <div className="mt-2 pt-2 border-t border-[#E8E2DA] flex items-center gap-x-2 gap-y-1 flex-wrap text-xs lg:text-sm text-charcoal-light">
            <span>
              {typeLabel(activeType)}
              <span className="text-[#999]">
                {' '}· {filtered.length} style{filtered.length === 1 ? '' : 's'}
              </span>
            </span>
            <button
              onClick={() => setType('')}
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
