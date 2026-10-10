'use client';

import { useMemo, useState } from 'react';
import { MakimooProduct } from '@/data/products';
import BeddingSetCard, { FamilyCardData } from '@/components/v2/BeddingSetCard';
import { sortByWeight } from '@/lib/weights';
import { dedupeFamilyColors } from '@/lib/listing-dedupe';
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
 * Pillows 一级选购视图（2026-09-30 用户定：展示方法与逻辑完全对齐 /bedding/bed-sets/）：
 * - 无意图回显行、无 hero；粘性筛选条 = "Type:" + "Filling:" 两个下拉（默认 All / All Fillings，
 *   选中高亮），两组为交集关系（材质维度对外文案 2026-10-09 用户定由 Material 改为 Filling）
 * - 始终按 Type 分区展示（分区标题仅 H2，无 blurb）；选中 Type = 只渲染该分区
 * - 卡片 = BeddingSetCard 同款家族卡（方图 + 徽标 + 标题 + 尺寸带 + From 价）；
 *   badge 遵循全站统一规则：未选材质 → 叠材质标签；选了材质 → 叠 type 标签；两个维度都选定 → 不叠
 * - 零结果兜底：友好提示 + Clear Filters（同 bed-sets，不留死路）
 * 交互需要 useState，故为客户端组件。
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

export default function V2PillowsShop({ products }: { products: MakimooProduct[] }) {
  const [type, setType] = useState('');
  const [material, setMaterial] = useState('');

  // 展示口径：同色去重 + 固定权重序（与全站 PLP 一致：excluded 排除、缺货沉底）
  // + 列表卡合并（2026-10-02）：两款记忆棉颈枕合并为一张卡
  const { list: cards, colorsByHandle, fromPriceByHandle } = useMemo(
    () => applyPillowCardMerges(sortByWeight(dedupeFamilyColors(products))),
    [products]
  );
  const typeOf = useMemo(() => {
    const map = new Map(cards.map((p) => [p.handle, pillowTypeOf(p)]));
    return (p: MakimooProduct) => map.get(p.handle) || '';
  }, [cards]);
  const materialOf = useMemo(() => {
    const map = new Map(cards.map((p) => [p.handle, pillowMaterialOf(p)]));
    return (p: MakimooProduct) => map.get(p.handle) || '';
  }, [cards]);

  // 有产品的形态/材质才进下拉（顺序按注册表）
  const typeOptions = useMemo(
    () => PILLOW_TYPES.filter((t) => cards.some((p) => typeOf(p) === t.key)),
    [cards, typeOf]
  );
  const materialOptions = useMemo(
    () => PILLOW_MATERIALS.filter((m) => cards.some((p) => materialOf(p) === m.key)),
    [cards, materialOf]
  );

  // 交集筛选：形态 × 材质
  const filtered = useMemo(
    () =>
      cards.filter(
        (p) => (!type || typeOf(p) === type) && (!material || materialOf(p) === material)
      ),
    [cards, type, material, typeOf, materialOf]
  );

  // 始终按 Type 分区；选中 Type = 只剩该分区
  const sections = typeOptions
    .map((t) => ({ taxon: t, list: filtered.filter((p) => typeOf(p) === t.key) }))
    .filter((s) => s.list.length > 0);

  const typeLabel = (k: string) => PILLOW_TYPES.find((t) => t.key === k)?.label || k;
  const materialLabel = (k: string) => PILLOW_MATERIALS.find((m) => m.key === k)?.label || k;

  // badge 统一规则：选了材质 → 叠 type；未选 → 叠材质；双选定 → 不叠
  const cardBadges = (p: MakimooProduct): string[] => {
    if (material && type) return [];
    if (material) return [typeLabel(typeOf(p))];
    return materialOf(p) ? [materialLabel(materialOf(p))] : [];
  };

  const selectCls = (active: boolean) =>
    `h-9 lg:h-10 px-3 lg:px-4 rounded-full border text-xs lg:text-sm font-medium bg-white outline-none transition ${
      active
        ? 'border-brand text-brand'
        : 'border-warm-gray text-charcoal-light hover:border-brand'
    }`;

  return (
    <div>
      {/* 粘性筛选条：Type + Material 下拉（与 /bedding/bed-sets/ 同款吸顶格式）。
          背景必须不透明（bg-off-white 实底），z-30 必须低于移动端导航抽屉遮罩 z-40 */}
      <div className="sticky top-[calc(52px+env(safe-area-inset-top,0px))] lg:top-[calc(88px+env(safe-area-inset-top,0px))] z-30 -mx-3 lg:-mx-10 px-3 lg:px-10 bg-off-white border-y border-[#E8E2DA] py-3 mb-5 lg:mb-7">
        <div className="flex items-center gap-2 lg:gap-2.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {typeOptions.length > 1 && (
            <label className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#999]">Type:</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={selectCls(!!type)}
                aria-label="Filter by type"
              >
                <option value="">All</option>
                {typeOptions.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          )}
          {materialOptions.length > 1 && (
            <>
              <span className="hidden lg:block w-px h-6 bg-warm-gray flex-shrink-0" aria-hidden="true" />
              <label className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#999]">Filling:</span>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className={selectCls(!!material)}
                  aria-label="Filter by filling"
                >
                  <option value="">All Fillings</option>
                  {materialOptions.map((m) => (
                    <option key={m.key} value={m.key}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
        </div>
        {/* 已选摘要：形态 × 材质 = 交集，结果数一目了然，可一键清空（同 bed-sets） */}
        {(type || material) && (
          <div className="mt-2 pt-2 border-t border-[#E8E2DA] flex items-center gap-x-2 gap-y-1 flex-wrap text-xs lg:text-sm text-charcoal-light">
            <span>
              {[...(type ? [typeLabel(type)] : []), ...(material ? [materialLabel(material)] : [])].join(' × ')}
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

      {/* 零结果兜底：友好提示 + Clear Filters（同 bed-sets 口径，不留死路） */}
      {sections.length === 0 ? (
        <div className="py-14 lg:py-20 text-center">
          <p className="text-base lg:text-lg font-semibold text-charcoal">No pillows match these filters.</p>
          <p className="mt-1.5 text-sm text-charcoal-light">Try a different type or material.</p>
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
                  badges={cardBadges(p)}
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
