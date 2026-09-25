'use client';

import { useState, useEffect, useMemo } from 'react';
import { MakimooProduct } from '@/data/products';
import { buildSetFamilies, classifySet, SET_KIND_LABEL, SetFamily, SetKind } from '@/data/bedding-families';
import { BEDDING_MATERIAL_ORDER, sortBeddingMaterials } from '@/data/subcategories';
import BeddingSetCard from '@/components/v2/BeddingSetCard';
import ProductCard from '@/components/ProductCard';
import { sortByWeight } from '@/lib/weights';
import { SHOPIFY_MAP } from '@/data/shopify-map';
import { v2url } from '@/lib/v2paths';

/**
 * Bedding 类目页选购视图（2026-09 重做，替代 V2BeddingLanding 聚合页）：
 * 定位 = 付费搜索落地页（任务型流量）。设计目标 = 最大化向下推进（进 PDP / 继续下滑）：
 * - 无 hero，首屏即产品网格（标题行 + 筛选条之后直接出卡）
 * - 粘性筛选条：类型 chips + 材质下拉 一键收窄，滚动时吸顶跟随，随时可改；
 *   两组为交集关系——Type:/Fabric: 维度前缀，选中后出"已选摘要行"显式回显组合与结果数
 *   （材质收为下拉是 2026-09 用户定：5 types + 6 fabrics 用 chips 横滑/换行都放不下）
 * - 卡片按色系家族聚合（23 款而非 92 SKU，减少选择瘫痪），图叠 "4-Piece Set"/材质徽章做关键词回显
 * - From 最低价 + 尺码带直接上卡，价格透明度前置
 * - 零结果兜底：Closest matches 部分匹配推荐（先满足类型、再补材质，≤8 卡）+ Clear Filters，不留死路
 * URL 参数：type=four|three|comforter（新增）、sub=材质（沿用）、sort（沿用），可分享。
 * 旧聚合页 V2BeddingLanding 组件保留在磁盘上备用（全站已无入口）。
 */

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest';
const SORT_KEYS: SortKey[] = ['featured', 'price-asc', 'price-desc', 'newest'];

const TYPE_CHIPS: { key: '' | SetKind; label: string }[] = [
  { key: '', label: 'All' },
  { key: 'four', label: '4-Piece Sets' },
  { key: 'three', label: '3-Piece Sets' },
  { key: 'comforter', label: 'Comforter Sets' },
];

function readParam(key: string): string {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get(key) || '';
}

export default function V2BeddingShop({ products }: { products: MakimooProduct[] }) {
  const [type, setType] = useState<'' | SetKind>('');
  const [material, setMaterial] = useState('');
  const [sort, setSort] = useState<SortKey>('featured');

  // 挂载后从 URL 恢复（本组件只在父页 mounted 后渲染，SSR 不涉及）
  useEffect(() => {
    const t = readParam('type');
    setType(t === 'four' || t === 'three' || t === 'comforter' ? t : '');
    setMaterial(readParam('sub'));
    const s = readParam('sort') as SortKey;
    setSort(SORT_KEYS.includes(s) ? s : 'featured');
  }, []);

  // 写回 URL（replaceState，不污染历史；保留 cat 等其他参数）
  useEffect(() => {
    const url = new URL(window.location.href);
    const set = (k: string, v: string) => (v ? url.searchParams.set(k, v) : url.searchParams.delete(k));
    set('type', type);
    set('sub', material);
    set('sort', sort === 'featured' ? '' : sort);
    window.history.replaceState(null, '', url.toString());
  }, [type, material, sort]);

  // 浏览器前进/后退
  useEffect(() => {
    const onPop = () => {
      const t = readParam('type');
      setType(t === 'four' || t === 'three' || t === 'comforter' ? t : '');
      setMaterial(readParam('sub'));
      const s = readParam('sort') as SortKey;
      setSort(SORT_KEYS.includes(s) ? s : 'featured');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // 家族聚合 + 未匹配家族规则的兜底产品（新增 bedding 产品若不符合 ASIN 前缀规律也不会消失）
  const families = useMemo(() => buildSetFamilies(products), [products]);
  const unclassified = useMemo(() => products.filter((p) => !classifySet(p.asin)), [products]);

  // 材质 chips：BEDDING_MATERIAL_ORDER 中有家族的先出；其余材质 ≥2 个家族才出（滤掉规格表噪声）
  const materialChips = useMemo(() => {
    const counts = new Map<string, number>();
    for (const f of families) {
      for (const m of f.materials) counts.set(m, (counts.get(m) || 0) + 1);
    }
    const entries = Array.from(counts.entries()).filter(
      ([m, c]) => BEDDING_MATERIAL_ORDER.includes(m) || c >= 2
    );
    return sortBeddingMaterials(entries, (e) => e[1]).map(([label]) => label);
  }, [families]);

  const filtered = useMemo(
    () =>
      families.filter(
        (f) => (!type || f.kind === type) && (!material || f.materials.includes(material))
      ),
    [families, type, material]
  );

  const sortedFamilies = useMemo(() => {
    if (sort === 'featured') {
      const reps = sortByWeight(filtered.map((f) => f.rep));
      const byRep = new Map(filtered.map((f) => [f.rep.id, f]));
      return reps.map((r) => byRep.get(r.id)!).filter(Boolean);
    }
    if (sort === 'newest') {
      const createdOf = (f: SetFamily) => SHOPIFY_MAP[f.rep.asin.toLowerCase()]?.createdAt ?? '';
      return [...filtered].sort((a, b) => createdOf(b).localeCompare(createdOf(a)));
    }
    const priceOf = (f: SetFamily) => parseFloat(f.fromPrice) || Infinity;
    return [...filtered].sort((a, b) =>
      sort === 'price-asc' ? priceOf(a) - priceOf(b) : priceOf(b) - priceOf(a)
    );
  }, [filtered, sort]);

  const showUnclassified = !type && !material && unclassified.length > 0;
  const hasResults = sortedFamilies.length > 0 || showUnclassified;

  // 空态推荐（Closest matches）：优先"只满足类型"的家族，不够 8 个再补"只满足材质"的，
  // 让 0 结果不再是死胡同——付费流量进来看到推荐而不是空白
  const closestMatches = useMemo(() => {
    if (hasResults) return [];
    const byType = type ? families.filter((f) => f.kind === type) : [];
    const typeKeys = new Set(byType.map((f) => f.key));
    const byMaterial = material
      ? families.filter((f) => f.materials.includes(material) && !typeKeys.has(f.key))
      : [];
    return [...byType, ...byMaterial].slice(0, 8);
  }, [families, type, material, hasResults]);
  // 价格锚点（意图回显行用）：全部家族的最低/最高 From 价
  const [minPrice, maxPrice] = useMemo(() => {
    const prices = families.map((f) => parseFloat(f.fromPrice)).filter((n) => !Number.isNaN(n) && n > 0);
    return prices.length > 0 ? [Math.min(...prices), Math.max(...prices)] : [null, null];
  }, [families]);

  const chipCls = (active: boolean) =>
    `flex-shrink-0 px-4 py-2 rounded-full text-xs lg:text-sm font-medium border transition ${
      active
        ? 'bg-brand text-cream border-brand'
        : 'bg-white text-charcoal-light border-warm-gray hover:border-brand hover:text-brand'
    }`;

  return (
    <div>
      {/* 意图回显行（2026-09 用户定：数量 + 价格区间在左，筛选结果数 + 排序右对齐同一行；
          运费/退货承诺顶部公告条已有，不重复） */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4 lg:mb-5">
        <p className="text-sm lg:text-base text-charcoal-light">
          {families.length} styles
          {minPrice !== null && maxPrice !== null
            ? ` from $${minPrice.toFixed(2)} to $${maxPrice.toFixed(2)}`
            : ''}
        </p>
        <div className="flex items-center gap-3 ml-auto flex-shrink-0">
          <span className="text-xs lg:text-sm text-[#999]">
            {sortedFamilies.length} style{sortedFamilies.length === 1 ? '' : 's'}
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-9 lg:h-10 px-2.5 lg:px-3 rounded-lg border-2 border-[#E8E2DA] bg-white text-xs lg:text-sm text-[#333] outline-none focus:border-[#8B5A2B]"
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* 粘性筛选条：类型 + 材质 + 排序；滚动时吸顶，随时一键收窄（不离开浏览流）
          背景必须不透明（bg-off-white 实底）：/95 + blur 会让下方滚动文字透上来，看起来像叠字
          z-30：必须低于移动端导航抽屉遮罩（z-40），否则抽屉打开时筛选条浮在抽屉之上 */}
      <div className="sticky top-20 lg:top-[88px] z-30 -mx-3 lg:-mx-10 px-3 lg:px-10 bg-off-white border-y border-[#E8E2DA] py-3 mb-5 lg:mb-7">
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 lg:gap-2.5">
          <div className="flex items-center gap-2 lg:gap-2.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* 维度前缀：明示类型/材质是两个独立维度、交集生效，避免用户当成同组并列项 */}
            <span className="flex-shrink-0 text-[11px] font-semibold uppercase tracking-wider text-[#999]">Type:</span>
            {TYPE_CHIPS.map((c) => (
              <button key={c.key} onClick={() => setType(c.key)} aria-pressed={type === c.key} className={chipCls(type === c.key)}>
                {c.label}
              </button>
            ))}
            <span className="hidden lg:block w-px h-6 bg-warm-gray flex-shrink-0" aria-hidden="true" />
            {/* Fabric 收为下拉（2026-09 用户定）：材质会涨到 6+，chips 横滑/换行都放不下；
                选中后 pill 高亮，已选摘要行同步回显 */}
            <label className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#999]">Fabric:</span>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className={`h-9 lg:h-10 px-3 lg:px-4 rounded-full border text-xs lg:text-sm font-medium bg-white outline-none transition ${
                  material
                    ? 'border-brand text-brand'
                    : 'border-warm-gray text-charcoal-light hover:border-brand'
                }`}
                aria-label="Filter by fabric"
              >
                <option value="">All Fabrics</option>
                {materialChips.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        {/* 已选摘要：把"类型 × 材质 = 交集"显式写出来，结果数一目了然，可一键清空 */}
        {(type || material) && (
          <div className="mt-2 pt-2 border-t border-[#E8E2DA] flex items-center gap-x-2 gap-y-1 flex-wrap text-xs lg:text-sm text-charcoal-light">
            <span>
              {[
                ...(type ? [TYPE_CHIPS.find((c) => c.key === type)!.label] : []),
                ...(material ? [material] : []),
              ].join(' × ')}
              <span className="text-[#999]">
                {' '}· {sortedFamilies.length} style{sortedFamilies.length === 1 ? '' : 's'}
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

      {/* 家族卡网格：与全站 PLP 同列数节奏 */}
      {hasResults ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
            {sortedFamilies.map((f) => (
              <BeddingSetCard
                key={f.key}
                family={f}
                badges={[SET_KIND_LABEL[f.kind]]}
              />
            ))}
          </div>
          {showUnclassified && (
            <>
              <h2 className="mt-10 lg:mt-14 mb-4 text-lg lg:text-2xl font-extrabold text-[#333]">More Bedding</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
                {unclassified.map((p) => (
                  <ProductCard key={p.id} product={p} href={v2url(`/products/${p.handle}/`)} />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        /* 零结果兜底：友好提示 + Closest matches 推荐网格（部分匹配，最多 8 卡）+ 一键清空 */
        <div className="py-10 lg:py-14">
          <div className="text-center mb-8 lg:mb-10">
            <p className="text-[#333] text-lg lg:text-xl font-semibold">
              We don&apos;t have that exact combo yet
            </p>
            <p className="mt-1.5 text-sm lg:text-base text-charcoal-light">
              But here are the closest matches — same type or same fabric.
            </p>
          </div>
          {closestMatches.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
              {closestMatches.map((f) => (
                <BeddingSetCard
                  key={f.key}
                  family={f}
                  badges={[SET_KIND_LABEL[f.kind]]}
                />
              ))}
            </div>
          )}
          <div className="text-center mt-8 lg:mt-10">
            <button
              onClick={() => {
                setType('');
                setMaterial('');
              }}
              className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-brand hover:bg-brand-dark transition"
            >
              Clear Filters — View All {families.length} Styles
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
