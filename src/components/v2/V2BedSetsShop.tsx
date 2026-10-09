'use client';

import { useMemo, useState } from 'react';
import { SET_KIND_LABEL, SetFamily, SetKind } from '@/data/bedding-families';
import { BEDDING_MATERIAL_ORDER, sortBeddingMaterials } from '@/data/subcategories';
import { fabricDisplayName } from '@/data/bedding-fabrics';
import BeddingSetCard from '@/components/v2/BeddingSetCard';
import { sortByWeight } from '@/lib/weights';

/**
 * /bedding/bed-sets/ 合并页选购区（2026-09-27 用户定）：
 * 筛选 UI 与 /products?cat=bedding 一致——"Type:" + "Fabric:" 两个下拉（默认 All / All Fabrics，
 * 选中高亮），两组为交集关系。All = 按 4-Piece/3-Piece 两分区展示；选中类型 = 只渲染该分区。
 * 卡片 badge 遵循全站统一规则：未选布料 → 叠布料标签；选了布料 → 改叠 type 标签；
 * 两个维度都选定 → 不叠标签。交互需要 useState，故为客户端组件
 * （V2FabricShop 的无交互分区模式仍供面料页使用）。
 */

const KIND_ORDER: SetKind[] = ['four', 'three', 'comforter', 'duvet'];

/** 布料标签：家族主材质（materials[0]），与 V2FabricShop 同口径；展示名经 fabricDisplayName（2026-10-09） */
const fabricBadge = (f: SetFamily): string[] => (f.materials[0] ? [fabricDisplayName(f.materials[0])] : []);

export default function V2BedSetsShop({ families }: { families: SetFamily[] }) {
  const [type, setType] = useState<'' | SetKind>('');
  const [material, setMaterial] = useState('');

  // 固定 Featured 序：按权重降序（与 V2FabricShop 一致）
  const sorted = useMemo(() => {
    const reps = sortByWeight(families.map((f) => f.rep));
    const byRep = new Map(families.map((f) => [f.rep.id, f]));
    return reps.map((r) => byRep.get(r.id)!).filter(Boolean);
  }, [families]);

  // Fabric 选项：与 V2BeddingShop 同口径（词表内材质全列，词表外 ≥2 家族才列）
  const materialOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const f of families) {
      for (const m of f.materials) counts.set(m, (counts.get(m) || 0) + 1);
    }
    const entries = Array.from(counts.entries()).filter(
      ([m, c]) => BEDDING_MATERIAL_ORDER.includes(m) || c >= 2
    );
    return sortBeddingMaterials(entries, (e) => e[1]).map(([label]) => label);
  }, [families]);

  // 交集筛选：类型 × 布料
  const filtered = useMemo(
    () => sorted.filter((f) => !material || f.materials.includes(material)),
    [sorted, material]
  );

  const sections = KIND_ORDER.map((kind) => ({
    kind,
    list: filtered.filter((f) => f.kind === kind),
  })).filter((s) => s.list.length > 0);

  const visible = type ? sections.filter((s) => s.kind === type) : sections;

  // badge 统一规则：选了布料 → 叠 type；未选 → 叠布料；双选定 → 不叠
  const cardBadges = (f: SetFamily): string[] => {
    if (material && type) return [];
    if (material) return [SET_KIND_LABEL[f.kind]];
    return fabricBadge(f);
  };

  const selectCls = (active: boolean) =>
    `h-9 lg:h-10 px-3 lg:px-4 rounded-full border text-xs lg:text-sm font-medium bg-white outline-none transition ${
      active
        ? 'border-brand text-brand'
        : 'border-warm-gray text-charcoal-light hover:border-brand'
    }`;

  return (
    <div>
      {/* 粘性筛选条：Type + Fabric 下拉（2026-09-27 用户定：与 /products?cat=bedding 同款吸顶格式）。
          背景必须不透明（bg-off-white 实底），z-30 必须低于移动端导航抽屉遮罩 z-40 */}
      <div className="sticky top-[60px] lg:top-[88px] z-30 -mx-3 lg:-mx-10 px-3 lg:px-10 bg-off-white border-y border-[#E8E2DA] py-3 mb-5 lg:mb-7">
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 lg:gap-2.5">
          {/* 内层横滑容器（同 V2BeddingShop）：移动端两个下拉保持单行横滑，不折行 */}
          <div className="flex items-center gap-2 lg:gap-2.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {KIND_ORDER.filter((k) => sorted.some((f) => f.kind === k)).length > 1 && (
          <label className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#999]">Type:</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as '' | SetKind)}
              className={selectCls(!!type)}
              aria-label="Filter by type"
            >
              <option value="">All</option>
              {KIND_ORDER.filter((k) => sorted.some((f) => f.kind === k)).map((k) => (
                <option key={k} value={k}>
                  {SET_KIND_LABEL[k]}s
                </option>
              ))}
            </select>
          </label>
        )}
        {materialOptions.length > 1 && (
          <>
            <span className="hidden lg:block w-px h-6 bg-warm-gray flex-shrink-0" aria-hidden="true" />
            <label className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#999]">Fabric:</span>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className={selectCls(!!material)}
                aria-label="Filter by fabric"
              >
                <option value="">All Fabrics</option>
                {materialOptions.map((m) => (
                  <option key={m} value={m}>
                    {fabricDisplayName(m)}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
          </div>
        </div>
        {/* 已选摘要：类型 × 材质 = 交集，结果数一目了然，可一键清空（同 V2BeddingShop） */}
        {(type || material) && (
          <div className="mt-2 pt-2 border-t border-[#E8E2DA] flex items-center gap-x-2 gap-y-1 flex-wrap text-xs lg:text-sm text-charcoal-light">
            <span>
              {[
                ...(type ? [`${SET_KIND_LABEL[type]}s`] : []),
                ...(material ? [fabricDisplayName(material)] : []),
              ].join(' × ')}
              <span className="text-[#999]">
                {' '}· {filtered.length} style{filtered.length === 1 ? '' : 's'}
              </span>
            </span>
            <button
              onClick={() => {
                setType('');
                setMaterial('');
              }}
              className="font-semibold text-brand underline underline-offset-2 hover:text-brand-dark"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* 零结果兜底：友好提示 + Clear Filters（同 V2BeddingShop 口径，不留死路） */}
      {visible.length === 0 ? (
        <div className="py-14 lg:py-20 text-center">
          <p className="text-base lg:text-lg font-semibold text-charcoal">No sets match these filters.</p>
          <p className="mt-1.5 text-sm text-charcoal-light">Try a different type or fabric.</p>
          <button
            type="button"
            onClick={() => {
              setType('');
              setMaterial('');
            }}
            className="mt-5 h-9 lg:h-10 px-5 rounded-full border border-brand text-brand text-xs lg:text-sm font-semibold hover:bg-brand hover:text-white transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        visible.map((s, i) => (
          <section
            key={s.kind}
            className={`py-8 lg:py-12 ${i === 0 ? 'pt-0' : 'border-t border-[#E8E2DA]'}`}
          >
            <h2 className="mb-5 lg:mb-8 text-lg lg:text-2xl font-extrabold text-charcoal">
              {SET_KIND_LABEL[s.kind]}s
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
              {s.list.map((f) => (
                <BeddingSetCard key={f.key} family={f} badges={cardBadges(f)} compactText />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
