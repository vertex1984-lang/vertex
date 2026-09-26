'use client';

import { useState, useEffect, useMemo } from 'react';
import { MakimooProduct } from '@/data/products';
import { buildSetFamilies, classifySet, SET_KIND_LABEL, SetFamily, SetKind } from '@/data/bedding-families';
import { BEDDING_MATERIAL_ORDER, BEDDING_MATERIAL_BLURBS, sortBeddingMaterials } from '@/data/subcategories';
import BeddingSetCard from '@/components/v2/BeddingSetCard';
import ProductCard from '@/components/ProductCard';
import { sortByWeight } from '@/lib/weights';
import { dedupeFamilyColors } from '@/lib/listing-dedupe';
import { SHOPIFY_MAP } from '@/data/shopify-map';
import { v2url } from '@/lib/v2paths';

/**
 * Bedding 类目页选购视图（2026-09 重做，替代 V2BeddingLanding 聚合页）：
 * 定位 = 付费搜索落地页（任务型流量）。设计目标 = 最大化向下推进（进 PDP / 继续下滑）：
 * - 无 hero，首屏即产品网格（标题行 + 筛选条之后直接出卡）
 * - 默认（无筛选）视图 2026-09 用户定改为【按材质分区】展示全部家族（参照 /bedding/bed-sets/
 *   子页结构）：材质标题 + 一句话描述 + BeddingSetCard 网格（卡片图上叠 type 标签——
 *   分区标题已表材质，2026-09 用户定统一规则：卡片只叠「标题未表达的另一维度」）；
 *   锚点 chips 与排序下拉已应用户要求移除（2026-09，排序固定 Featured/权重序）
 * - 粘性筛选条：类型下拉 + 材质下拉 一键收窄，滚动时吸顶跟随，随时可改；
 *   两组为交集关系——Type:/Fabric: 维度前缀，选中后出"已选摘要行"显式回显组合与结果数
 *   （两组均用下拉是 2026-09 用户定：chips 横滑/换行放不下，选中后下拉高亮）；
 *   有筛选时回退为单一平铺网格（跨材质结果分组无意义）
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
  // Comforter Sets 选项 2026-09-26 移除：唯一 comforter 家族（1688-916370884976）实为被套 3 件套，已归 three
];

/** 材质名 → 分区锚点 id（"100% Linen" → fabric-100-linen） */
function fabricAnchor(material: string): string {
  return `fabric-${material.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

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

  // 家族聚合 + 未匹配家族规则的兜底产品（新增 bedding 产品若不符合 ASIN 前缀规律也不会消失）。
  // 注意：上游传入的是未去重全量列表（家族需要全尺寸 SKU 拼尺寸带），
  // 兜底区逐 SKU 出卡前必须先做同色去重，否则同款 3 个尺寸并排重复（2026-09 修复）
  const families = useMemo(() => buildSetFamilies(products), [products]);
  const unclassified = useMemo(
    () => dedupeFamilyColors(products.filter((p) => !classifySet(p.asin))),
    [products]
  );

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

  // 排序函数：featured=权重序、newest=上架倒序、price=From 价；分区视图各分区内部复用
  const sortFamilies = useMemo(
    () => (list: SetFamily[]): SetFamily[] => {
      if (sort === 'featured') {
        const reps = sortByWeight(list.map((f) => f.rep));
        const byRep = new Map(list.map((f) => [f.rep.id, f]));
        return reps.map((r) => byRep.get(r.id)!).filter(Boolean);
      }
      if (sort === 'newest') {
        const createdOf = (f: SetFamily) => SHOPIFY_MAP[f.rep.asin.toLowerCase()]?.createdAt ?? '';
        return [...list].sort((a, b) => createdOf(b).localeCompare(createdOf(a)));
      }
      const priceOf = (f: SetFamily) => parseFloat(f.fromPrice) || Infinity;
      return [...list].sort((a, b) =>
        sort === 'price-asc' ? priceOf(a) - priceOf(b) : priceOf(b) - priceOf(a)
      );
    },
    [sort]
  );

  const sortedFamilies = useMemo(() => sortFamilies(filtered), [filtered, sortFamilies]);

  // 材质分区（默认无筛选视图，2026-09 用户定）：每家族只归一个材质区（materials[0]），
  // 分区顺序按 BEDDING_MATERIAL_ORDER、未收录材质按家族数降序兜底
  const materialSections = useMemo(() => {
    const map = new Map<string, SetFamily[]>();
    for (const f of families) {
      const m = f.materials[0] || 'Other';
      if (!map.has(m)) map.set(m, []);
      map.get(m)!.push(f);
    }
    return sortBeddingMaterials(Array.from(map.entries()), (e) => e[1].length).map(
      ([m, list]) => ({ material: m, anchor: fabricAnchor(m), list: sortFamilies(list) })
    );
  }, [families, sortFamilies]);

  // 默认视图 = 材质分区；有类型/材质筛选时回退平铺网格
  const sectioned = !type && !material;

  // 平铺模式卡片 badge（2026-09 用户定统一规则：叠「页面未表达的另一维度」）：
  // 选了 Type → 类型已由筛选条/摘要行表达，卡片叠布料标签；否则叠 type 标签
  const cardBadges = (f: SetFamily): string[] =>
    type ? (f.materials[0] ? [f.materials[0]] : []) : [SET_KIND_LABEL[f.kind]];

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
  // 价格锚点（意图回显行用）：全部家族的最低 From 价 / 最高变体价（上限取 toPrice，
  // 否则区间上限漏掉家族内大尺码的高价，如 linen3 King $129.99）
  const [minPrice, maxPrice] = useMemo(() => {
    const mins = families.map((f) => parseFloat(f.fromPrice)).filter((n) => !Number.isNaN(n) && n > 0);
    const maxs = families.map((f) => parseFloat(f.toPrice)).filter((n) => !Number.isNaN(n) && n > 0);
    return mins.length > 0 && maxs.length > 0 ? [Math.min(...mins), Math.max(...maxs)] : [null, null];
  }, [families]);

  return (
    <div>
      {/* 意图回显行：数量 + 价格区间（运费/退货承诺顶部公告条已有，不重复）。
          右侧"筛选结果数 + 排序下拉"2026-09 用户定移除（排序固定 Featured/权重序） */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4 lg:mb-5">
        <p className="text-sm lg:text-base text-charcoal-light">
          {families.length} styles
          {minPrice !== null && maxPrice !== null
            ? ` from $${minPrice.toFixed(2)} to $${maxPrice.toFixed(2)}`
            : ''}
        </p>
      </div>

      {/* 粘性筛选条：类型 + 材质 + 排序；滚动时吸顶，随时一键收窄（不离开浏览流）
          背景必须不透明（bg-off-white 实底）：/95 + blur 会让下方滚动文字透上来，看起来像叠字
          z-30：必须低于移动端导航抽屉遮罩（z-40），否则抽屉打开时筛选条浮在抽屉之上 */}
      <div className="sticky top-[60px] lg:top-[88px] z-30 -mx-3 lg:-mx-10 px-3 lg:px-10 bg-off-white border-y border-[#E8E2DA] py-3 mb-5 lg:mb-7">
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 lg:gap-2.5">
          <div className="flex items-center gap-2 lg:gap-2.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* Type 下拉（2026-09 用户定：chips 改下拉，默认 All；选中后高亮，与 Fabric 同款） */}
            <label className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#999]">Type:</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as '' | SetKind)}
                className={`h-9 lg:h-10 px-3 lg:px-4 rounded-full border text-xs lg:text-sm font-medium bg-white outline-none transition ${
                  type
                    ? 'border-brand text-brand'
                    : 'border-warm-gray text-charcoal-light hover:border-brand'
                }`}
                aria-label="Filter by type"
              >
                {TYPE_CHIPS.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
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

      {/* 家族卡网格：与全站 PLP 同列数节奏；默认无筛选时按材质分区（2026-09 用户定，
          结构参照 /bedding/bed-sets/ 子页：分区标题 + 描述 + 网格；锚点 chips 已应用户要求移除） */}
      {hasResults ? (
        <>
          {sectioned ? (
            <>
              {materialSections.map((s, i) => (
                <section
                  key={s.material}
                  id={s.anchor}
                  className={`py-8 lg:py-12 scroll-mt-40 ${i === 0 ? 'pt-0' : 'border-t border-[#E8E2DA]'}`}
                >
                  <div className="mb-5 lg:mb-8">
                    <h2 className="text-lg lg:text-2xl font-extrabold text-charcoal">{s.material}</h2>
                    {BEDDING_MATERIAL_BLURBS[s.material] && (
                      <p className="mt-1 text-xs lg:text-sm text-[#999]">
                        {BEDDING_MATERIAL_BLURBS[s.material]}
                      </p>
                    )}
                  </div>
                  {/* 材质分区标题已表材质；卡片图上叠 type 标签（2026-09 用户定规则） */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
                    {s.list.map((f) => (
                      <BeddingSetCard
                        key={f.key}
                        family={f}
                        badges={[SET_KIND_LABEL[f.kind]]}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
              {sortedFamilies.map((f) => (
                <BeddingSetCard
                  key={f.key}
                  family={f}
                  badges={cardBadges(f)}
                />
              ))}
            </div>
          )}
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
                  badges={cardBadges(f)}
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
