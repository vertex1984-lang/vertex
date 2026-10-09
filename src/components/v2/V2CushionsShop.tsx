'use client';

import { useMemo, useState } from 'react';
import { MakimooProduct } from '@/data/products';
import { buildBlanketFamilies, BlanketFamily } from '@/data/blanket-families';
import BeddingSetCard from '@/components/v2/BeddingSetCard';
import { sortByWeight } from '@/lib/weights';
import { getSubcategoriesOf } from '@/data/subcategories';
import { getVariantGroupOf, CUSHION_LISTING_HIDDEN_ASINS } from '@/data/variant-groups';

/** cm → in，去小数点（四舍五入取整）：43cm→17、47cm→19、95cm→37 */
const cmToIn = (cm: number) => Math.round(cm / 2.54);

/** 卡片标题规则（2026-10-09 用户定）："Cushions Set of {x}, {W} x {H} in"
 *  （不带颜色；尺寸换算成英寸、去小数点后一位）。
 *  尺寸来源：优先解析代表品短标题（"95 x 45cm" / "95x45cm" / "47cm Round"，短标题是策划过的
 *  产品实际尺寸）；解析不到才用变体组尺寸带（cm，buildBlanketFamilies 已去单位）。
 *  套装数来源：短标题或尺寸带（110x55 家族 size 字段存的是 "Set of N" 套件数，非尺寸）
 *  的 "Set of N"，或 handle "set-of-N"/"N-pack"，缺省 2（当前全线 2 件装）。 */
function cushionCardTitle(f: BlanketFamily): string {
  const sizeBand = f.sizes[0] || '';
  const countMatch =
    f.rep.title.match(/set of (\d+)/i) ||
    sizeBand.match(/set of (\d+)/i) ||
    f.rep.handle.match(/set-of-(\d+)/i) ||
    f.rep.handle.match(/(\d)-pack/i);
  const count = countMatch ? countMatch[1] : '2';

  const sizeSeg = (() => {
    const t = f.rep.title;
    const round = t.match(/(\d+(?:\.\d+)?)\s*cm\s*round/i);
    if (round) return `${cmToIn(parseFloat(round[1]))} in Round`;
    const wh = t.match(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*cm/i);
    if (wh) return `${cmToIn(parseFloat(wh[1]))} x ${cmToIn(parseFloat(wh[2]))} in`;
    // 尺寸带首段是数字才是尺寸（"110×55"）；"Set of 4" 这类套件数段跳过
    return /^\d/.test(sizeBand) ? sizeBand : '';
  })();
  const sizeIn = sizeSeg.includes('in')
    ? sizeSeg
    : sizeSeg
        .split('×')
        .map((s) => cmToIn(parseFloat(s)))
        .filter((n) => !Number.isNaN(n))
        .join(' x ') + (sizeSeg ? ' in' : '');

  return `Cushions Set of ${count}${sizeIn ? `, ${sizeIn}` : ''}`;
}

/**
 * /products?cat=cushions 选购视图：
 * - 2026-10-09 用户定：按 pillows/bedding 的家族卡结构改造（复用 buildBlanketFamilies 按颜色成族）；
 *   卡片标题规则见 cushionCardTitle；compactText 与 pillows/bedding 卡片字体一致
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
  /** URL ?sub= 深链（如 Header mega 菜单 "Shop Corduroy" → sub=corduroy） */
  initialStyle?: string;
}) {
  const [style, setStyle] = useState(initialStyle);

  // 同花色有 Set of 2 的 Set of 4 卡片不在列表展示（2026-10-09 用户定，名单见 variant-groups.ts）
  const families = useMemo(
    () => buildBlanketFamilies(products).filter((f) => !CUSHION_LISTING_HIDDEN_ASINS.has(f.rep.asin.toLowerCase())),
    [products]
  );

  // 排序（2026-10-09 用户定）：同一变体组的卡片排在一起，排完一组再排下一组；
  // 组间顺序 = 组内卡片的最高权重位次（Featured 权重序），组内顺序 = 变体组注册顺序（与 PDP 色点一致）
  const sorted = useMemo(() => {
    const reps = sortByWeight(families.map((f) => f.rep));
    const rank = new Map(reps.map((r, i) => [r.id, i]));
    // family.key = "组id::颜色"（有变体组）或 asin（单品成族）
    const groupOf = (f: BlanketFamily) => (f.key.includes('::') ? f.key.split('::')[0] : f.key);
    const groupRank = new Map<string, number>();
    for (const f of families) {
      const g = groupOf(f);
      const r = rank.get(f.rep.id) ?? 9999;
      groupRank.set(g, Math.min(groupRank.get(g) ?? 9999, r));
    }
    const orderInGroup = (f: BlanketFamily) => {
      const g = getVariantGroupOf(f.rep.asin);
      const idx = g ? g.members.findIndex((m) => m.asin.toLowerCase() === f.rep.asin.toLowerCase()) : -1;
      return idx < 0 ? 999 : idx;
    };
    return [...families].sort((a, b) => {
      const ga = groupOf(a);
      const gb = groupOf(b);
      if (ga !== gb) return (groupRank.get(ga) ?? 9999) - (groupRank.get(gb) ?? 9999);
      return orderInGroup(a) - orderInGroup(b);
    });
  }, [families]);

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
      <div className="sticky top-[60px] lg:top-[88px] z-30 -mx-3 lg:-mx-10 px-3 lg:px-10 bg-off-white border-y border-[#E8E2DA] py-3 mb-5 lg:mb-7">
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
