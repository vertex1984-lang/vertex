'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import ProductCard from '@/components/ProductCard';
import { MakimooProduct, PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';
import { CATEGORY_DEFS, sortBeddingMaterials } from '@/data/subcategories';
import { STYLE_RULES, getStyleTagWithOverride } from '@/data/product-tags';
import { STYLE_DISPLAY_RULES } from '@/data/style-tagged';
import { MATERIALS_MAP } from '@/data/materials-map';
import { getProductSpecs } from '@/lib/specs';
import { v2url } from '@/lib/v2paths';
import { trackEvent } from '@/lib/gtag';
import { sortByWeight } from '@/lib/weights';
import { dedupeFamilyColors } from '@/lib/listing-dedupe';

// 每批加载数量与 (classic) 产品列表页一致
const PAGE_SIZE = 24;

// 分区视图（一级类目页）每个 collection 展示 3 行产品卡后截断；
// 超出的出「View More」按钮，点击进入该 collection 子分类页看全部（2026-09 用户定）。
// 截断数 = 3 行 × 各断点列数：移动端 2 列 → 6 张；lg 3 列 → 9 张；xl 4 列 → 12 张
const SECTION_LIMITS = { mobile: 6, lg: 9, xl: 12 };

type SortKey = 'featured' | 'price-asc' | 'price-desc';
const SORT_KEYS: SortKey[] = ['featured', 'price-asc', 'price-desc'];

function isInStock(p: MakimooProduct): boolean {
  return p.hasShopifyData === true && p.shopifyAvailable === true;
}

function priceOf(p: MakimooProduct): number {
  return parseFloat(p.shopifyPrice || p.priceRange.minVariantPrice.amount) || 0;
}

// 产品材质列表（提取表 + 手工覆盖表合并后的展示字符串，如 "Polyester, Canvas"）。
// 筛选项计数时去掉 "100% " 前缀归一化（"100% Linen" 与 "Linen" 合并为一个选项，与风格分组口径一致）；
// 详情页规格展示仍用原始字符串，不受影响
function materialsOf(asin: string): string[] {
  const m = getProductSpecs(asin)?.material;
  return m ? m.split(', ').map((x) => x.replace(/^100%\s+/i, '')) : [];
}

// 原始材质列表（不做 "100% " 归一化）：bedding 类目按材质分组展示时使用（2026-09 用户定）
function rawMaterialsOf(asin: string): string[] {
  const m = getProductSpecs(asin)?.material;
  return m ? m.split(', ') : [];
}

// bedding 分区视图：材质标题下的一句话描述（小字，2026-09 用户定）；未收录的材质不显示描述行
const MATERIAL_BLURBS: Record<string, string> = {
  'Washed Cotton-Like': 'Soft washed feel with a relaxed, lived-in look — easy everyday care.',
  'Linen-Like': 'Airy linen-style texture with a naturally relaxed drape.',
  '100% Linen': 'Pure natural linen — breathable, durable, and softer with every wash.',
  'Silk-Modal': 'Silky-smooth modal blend with a cool, gentle touch.',
  'Sateen': 'Smooth sateen weave with a subtle sheen and buttery feel.',
  Microfiber: 'Brushed microfiber — soft, wrinkle-resistant & easy care.',
  Bamboo: 'Bamboo-blend fabric — cool, breathable & moisture-wicking.',
  Linen: 'Natural linen — breathable with a lived-in texture.',
};

/** 在售优先，缺货沉底；组内保持原顺序 */
function inStockFirst(list: MakimooProduct[]): MakimooProduct[] {
  return [...list].sort((a, b) => Number(isInStock(b)) - Number(isInStock(a)));
}

function applySort(list: MakimooProduct[], sort: SortKey): MakimooProduct[] {
  // featured = 权重排序（表现分 + 人工赋权，含在售优先/沉底/置顶/排除）
  if (sort === 'featured') return sortByWeight(list);
  const grouped = inStockFirst(list);
  // 价格排序只在在售组内生效，缺货组保持沉底
  const inStock = grouped.filter(isInStock);
  const out = grouped.filter((p) => !isInStock(p));
  inStock.sort((a, b) => (sort === 'price-asc' ? priceOf(a) - priceOf(b) : priceOf(b) - priceOf(a)));
  return [...inStock, ...out];
}

function readUrlParam(key: string): string {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get(key) || '';
}

function readUrlList(key: string): string[] {
  return readUrlParam(key).split(',').filter(Boolean);
}

const toggleInList = (list: string[], v: string) =>
  list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

interface FilterBundle {
  cat: string;
  sub: string;
  material: string[];
  sort: SortKey;
}

/**
 * V2 产品列表页：展示样式回归 v1（白底产品卡 + 左侧筛选栏 + 风格分区视图 + Load More），
 * 差异只在版心——v1 是 max-w-7xl 盒子且外层有 1400px 边框框，这里用 V2 全宽容器
 * （px-6 / lg:px-10，无页面边框），列数不变，产品卡随页面宽度等比增大。
 * 站内链接统一走 v2url()（含产品卡 href 覆盖），避免从 v2 跳回 classic 页面。
 */
export default function V2ProductsPage() {
  // mounted 标志：防止静态 HTML 在 JS 执行前闪现
  const [mounted, setMounted] = useState(false);
  // 首屏必须用默认值，保证水合 HTML 与服务端一致；URL 参数在挂载后读取（见下方 useEffect）
  const [activeCategory, setActiveCategory] = useState('');
  const [activeSub, setActiveSub] = useState('');
  // 搜索词只从 URL 读取（页面搜索框已移除，入口在 V2Header 搜索）
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('featured');
  const [materialSel, setMaterialSel] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  // 移动端筛选抽屉
  const [filterOpen, setFilterOpen] = useState(false);

  // 抽屉打开时锁定背景滚动 + Esc 关闭
  useEffect(() => {
    document.body.style.overflow = filterOpen ? 'hidden' : '';
    if (!filterOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFilterOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filterOpen]);

  // 首次挂载后从 URL 恢复筛选状态，再标记为已挂载（此时首屏水合已完成，不会与服务端 HTML 冲突）
  useEffect(() => {
    setActiveCategory(readUrlParam('cat'));
    setActiveSub(readUrlParam('sub'));
    setSearchQuery(readUrlParam('q'));
    const s = readUrlParam('sort') as SortKey;
    setSortBy(SORT_KEYS.includes(s) ? s : 'featured');
    setMaterialSel(readUrlList('material'));
    setMounted(true);
    // GA4: search（URL 带 ?q= 参数进入时触发一次）
    const q = new URLSearchParams(window.location.search).get('q');
    if (q && q.trim()) {
      trackEvent('search', { search_term: q.trim() });
    }
  }, []);

  // 全部产品（含 Shopify 价格/库存、素材库标题/图片覆盖）。
  // 变体族同色去重：同族同色只保留一张卡（不同颜色各自保留一个入口），计数/筛选/分区/网格同步该口径（2026-09 用户定）
  const allProducts = useMemo(() => dedupeFamilyColors(enrichProductsWithShopifyData(PRODUCTS_DATA)), []);

  // 产品 → 风格 key（与首页 Shop by Style 同一规则：完整标题（素材库覆盖后、精简前）+ productType 现算）。
  // Collections 筛选/分区视图/URL sub 参数统一按风格分组（2026-09 用户定，替代原二级分类分组）
  const styleKeyOf = useMemo(() => {
    const map = new Map(
      allProducts.map((p) => [
        p.handle,
        getStyleTagWithOverride(MATERIALS_MAP[p.asin.toLowerCase()]?.title || p.title, p.productType, p.asin).key,
      ])
    );
    return (p: MakimooProduct) => map.get(p.handle) || '';
  }, [allProducts]);

  const isSearching = searchQuery.trim().length > 0;

  const categoryDef = CATEGORY_DEFS.find((c) => c.value === activeCategory.toLowerCase());

  // bedding 类目特殊规则（2026-09 用户定）：Collections 按材质分组（替代风格分组），
  // 筛选区第二组由 Material 改为 Style（按风格多选筛选）
  const beddingMaterialMode = activeCategory.toLowerCase() === 'bedding';

  // 当前类目下的产品（不含风格过滤；用于 Collections 计数）
  const categoryProducts = useMemo(() => {
    if (!activeCategory) return [];
    return allProducts.filter(
      (p) =>
        p.productType.toLowerCase() === activeCategory.toLowerCase() ||
        p.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()))
    );
  }, [allProducts, activeCategory]);

  // Collections 筛选项：默认按 Shop by Style 风格分组（带数量；0 的不显示），顺序与首页 Shop by Style 一致；
  // bedding 按材质分组（只显示有产品的材质，顺序按 BEDDING_MATERIAL_ORDER）
  const collectionOptions = useMemo(() => {
    if (!activeCategory) return [];
    if (beddingMaterialMode) {
      const counts = new Map<string, number>();
      for (const p of categoryProducts) {
        for (const m of rawMaterialsOf(p.asin)) counts.set(m, (counts.get(m) || 0) + 1);
      }
      return sortBeddingMaterials(Array.from(counts.entries()), (e) => e[1])
        .map(([label, count]) => ({ key: label, label, count }));
    }
    return STYLE_DISPLAY_RULES.map((s) => ({
      key: s.key,
      label: s.label,
      count: categoryProducts.filter((p) => styleKeyOf(p) === s.key).length,
    })).filter((s) => s.count > 0);
  }, [categoryProducts, activeCategory, beddingMaterialMode, styleKeyOf]);

  // 筛选作用域：有类目按类目，无类目（V2 裸 /products = Shop All）取全部；再叠分组过滤
  // （默认按风格 key；bedding 按材质）
  const scopeProducts = useMemo(() => {
    let list = activeCategory ? categoryProducts : allProducts;
    if (activeSub) {
      list = beddingMaterialMode
        ? list.filter((p) => rawMaterialsOf(p.asin).includes(activeSub))
        : list.filter((p) => styleKeyOf(p) === activeSub);
    }
    return list;
  }, [allProducts, categoryProducts, activeCategory, activeSub, beddingMaterialMode, styleKeyOf]);

  // 第二组筛选项聚合（当前类目 + 分组内带产品数）：默认材质多选；bedding 改为风格（Style）多选
  const materialOptions = useMemo(() => {
    if (beddingMaterialMode) {
      return STYLE_DISPLAY_RULES.map((s) => ({
        key: s.key,
        label: s.label,
        count: scopeProducts.filter((p) => styleKeyOf(p) === s.key).length,
      })).filter((s) => s.count > 0);
    }
    const counts = new Map<string, number>();
    for (const p of scopeProducts) {
      for (const m of materialsOf(p.asin)) counts.set(m, (counts.get(m) || 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ key: label, label, count }));
  }, [scopeProducts, beddingMaterialMode, styleKeyOf]);

  // 统一写 URL（分类 + 风格 + 筛选 + 排序，可分享；q 参数原样保留）。
  // 进入/退出风格分组用 pushState（浏览器后退可回到分区视图），其余变更用 replaceState 不污染历史
  const writeUrl = (b: FilterBundle, push = false) => {
    const url = new URL(window.location.href);
    const set = (k: string, v: string) => (v ? url.searchParams.set(k, v) : url.searchParams.delete(k));
    set('cat', b.cat);
    set('sub', b.sub);
    set('material', b.material.join(','));
    set('sort', b.sort === 'featured' ? '' : b.sort);
    if (push) window.history.pushState(null, '', url.toString());
    else window.history.replaceState(null, '', url.toString());
  };

  // 统一更新筛选状态：合并变更 → 写回 state + URL，重置分批加载
  const setFilter = (over: Partial<FilterBundle>) => {
    const b: FilterBundle = {
      cat: activeCategory,
      sub: activeSub,
      material: materialSel,
      sort: sortBy,
      ...over,
    };
    if (over.cat !== undefined) setActiveCategory(over.cat);
    if (over.sub !== undefined) setActiveSub(over.sub);
    if (over.material) setMaterialSel(over.material);
    if (over.sort) setSortBy(over.sort);
    setVisibleCount(PAGE_SIZE);
    writeUrl(b, over.sub !== undefined);
  };

  // 浏览器前进/后退：从 URL 恢复筛选状态
  useEffect(() => {
    const onPop = () => {
      setActiveCategory(readUrlParam('cat'));
      setActiveSub(readUrlParam('sub'));
      setMaterialSel(readUrlList('material'));
      const s = readUrlParam('sort') as SortKey;
      setSortBy(SORT_KEYS.includes(s) ? s : 'featured');
      setVisibleCount(PAGE_SIZE);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Collections 单选：点其他项切换，再点当前项取消（回到全类目）
  const toggleSub = (key: string) => {
    setFilter({ sub: activeSub === key ? '' : key });
  };

  // 清空筛选（回到全类目、清材质与排序）
  const clearFilters = () => {
    setFilter({ sub: '', material: [], sort: 'featured' });
  };

  const activeFilterCount = materialSel.length + (activeSub ? 1 : 0);

  // 当前筛选结果：类目 + 分组 → 搜索 → 第二组筛选
  // （启用第二组筛选时，没有对应数据的产品不显示；搜索时不生效，与旧页一致。bedding 按风格筛选，其余类目按材质）
  const filtered = useMemo(() => {
    let result = scopeProducts;
    if (isSearching) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    } else if (materialSel.length > 0) {
      if (beddingMaterialMode) {
        result = result.filter((p) => materialSel.includes(styleKeyOf(p)));
      } else {
        result = result.filter((p) => {
          const mats = materialsOf(p.asin);
          return mats.length > 0 && materialSel.some((m) => mats.includes(m));
        });
      }
    }
    return result;
  }, [scopeProducts, searchQuery, isSearching, materialSel, beddingMaterialMode, styleKeyOf]);

  const sortedFiltered = useMemo(() => applySort(filtered, sortBy), [filtered, sortBy]);

  // 无限滚动：哨兵进入视口即加载下一批（2026-09 用户定：子分类页下拉自动显示更多，替代 Load More 按钮）。
  // rootMargin 提前 600px 触发，滚到底之前内容已就位；视口过大时哨兵持续可见会连续触发，直到填满或加载完
  const hasMore = visibleCount < sortedFiltered.length;
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const ob = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setVisibleCount((c) => c + PAGE_SIZE),
      { rootMargin: '600px 0px' }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [hasMore, sortedFiltered.length]);

  // 分区视图：类目默认视图（无搜索/无分组筛选/无第二组筛选/默认排序）且产品足够多时，
  // 按分组分区展示（与 Collections 筛选同一分组口径：默认风格，bedding 材质），避免长网格单调、信息效率递减；
  // 分区内产品按 catalogue 权重分排序（pin 置顶/缺货沉底/excluded 排除，与子分类页 featured 排序同一口径）
  const sections = useMemo(() => {
    if (!activeCategory || isSearching || activeSub || materialSel.length > 0 || sortBy !== 'featured') {
      return [];
    }
    const grouped = beddingMaterialMode
      ? collectionOptions
          .map((o) => ({
            def: { key: o.key, label: o.label },
            products: sortByWeight(categoryProducts.filter((p) => rawMaterialsOf(p.asin).includes(o.key))),
          }))
          .filter((s) => s.products.length > 0)
      : STYLE_DISPLAY_RULES.map((rule) => ({
          def: { key: rule.key, label: rule.label },
          products: sortByWeight(categoryProducts.filter((p) => styleKeyOf(p) === rule.key)),
        })).filter((s) => s.products.length > 0);
    const total = grouped.reduce((n, s) => n + s.products.length, 0);
    return grouped.length >= 2 && total >= 4 ? grouped : [];
  }, [activeCategory, isSearching, activeSub, materialSel, sortBy, categoryProducts, beddingMaterialMode, collectionOptions, styleKeyOf]);

  const gridCls = 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6';

  // 分组名：默认查风格规则；bedding 的 sub 是材质名，直接展示
  const subDef = activeSub
    ? beddingMaterialMode
      ? { key: activeSub, label: activeSub }
      : STYLE_RULES.find((r) => r.key === activeSub)
    : undefined;
  const pageTitle = isSearching
    ? 'Search Results'
    : subDef?.label || categoryDef?.label || 'Shop All';

  // 产品卡详情链接：v2 页面内保持 /v2 前缀
  const cardHref = (p: MakimooProduct) => v2url(`/products/${p.handle}/`);

  // 桌面端左侧筛选栏（lg+）：类目视图（不含子分类页）且有可选项时显示（2026-09 用户定：子分类页不展示筛选区）
  const showSidebar = mounted && !!activeCategory && !activeSub && !isSearching && (collectionOptions.length > 0 || materialOptions.length > 0);

  return (
    /* 全宽容器：无 max-w 盒子、无页面边框；V2Header 是 fixed，顶部留出页头高度 */
    <div className="px-3 lg:px-10 pt-32 lg:pt-36 pb-10 lg:pb-14">
      {/* 页头（v1 样式）：面包屑 + 左对齐标题 + 右侧结果数/排序 */}
      <nav className="text-xs lg:text-sm text-[#999] mb-2 lg:mb-3" aria-label="Breadcrumb">
        <a href={v2url('/')} className="hover:text-[#8B5A2B] transition-colors">Home</a>
        <span className="mx-1.5">/</span>
        {activeSub && subDef && categoryDef ? (
          <>
            <a href={v2url(`/products/?cat=${activeCategory}`)} className="hover:text-[#8B5A2B] transition-colors">{categoryDef.label}</a>
            <span className="mx-1.5">/</span>
            <span className="text-[#555]">{subDef.label}</span>
          </>
        ) : (
          <span className="text-[#555]">{pageTitle}</span>
        )}
      </nav>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-4 lg:mb-10">
        <div>
          {/* 移动端隐藏类目标题（面包屑已有指引）；桌面端保留（2026-09 用户定） */}
          <h1 className="hidden lg:block text-xl sm:text-2xl lg:text-4xl font-extrabold text-[#333]">{pageTitle}</h1>
        </div>
        {/* 桌面端：排序（移动端排序在筛选抽屉里）；不显示产品数量（2026-09 用户定） */}
        {mounted && (
          <div className="hidden lg:flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setFilter({ sort: e.target.value as SortKey })}
              className="h-10 px-3 rounded-lg border-2 border-[#E8E2DA] bg-white text-sm text-[#333] outline-none focus:border-[#8B5A2B]"
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        )}
      </div>

      <div className="lg:flex lg:gap-10">
      {/* 桌面端左侧筛选栏：Collections 单选 + Material/Style 多选（bedding 为 Style），吸顶跟随 */}
      {showSidebar && (
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-28">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8E2DA]">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#333]">Filters</h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-[#8B5A2B] hover:underline underline-offset-4"
                >
                  Clear All
                </button>
              )}
            </div>
            {collectionOptions.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-2">{beddingMaterialMode ? 'Material' : 'Collections'}</p>
                {collectionOptions.map((o) => {
                  const active = activeSub === o.key;
                  return (
                    <button key={o.key} onClick={() => toggleSub(o.key)} aria-pressed={active} className="flex items-center gap-2.5 w-full py-1.5 text-left">
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${active ? 'border-[#8B5A2B]' : 'border-[#D8D2C8]'}`}>
                        {active && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#8B5A2B' }} />}
                      </span>
                      <span className={`text-sm ${active ? 'font-semibold text-[#333]' : 'text-[#555]'}`}>{o.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {materialOptions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-2">{beddingMaterialMode ? 'Style' : 'Material'}</p>
                {materialOptions.map((o) => {
                  const active = materialSel.includes(o.key);
                  return (
                    <button key={o.key} onClick={() => setFilter({ material: toggleInList(materialSel, o.key) })} aria-pressed={active} className="flex items-center gap-2.5 w-full py-1.5 text-left">
                      <span
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${active ? 'border-[#8B5A2B]' : 'border-[#D8D2C8]'}`}
                        style={active ? { backgroundColor: '#8B5A2B' } : {}}
                      >
                        {active && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      <span className={`text-sm ${active ? 'font-semibold text-[#333]' : 'text-[#555]'}`}>{o.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      )}

      <div className="flex-1 min-w-0">
      {!mounted ? (
        /* JS 加载前的占位：骨架屏与卡片同比例，避免布局跳动 */
        <div className={gridCls}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
              <div className="aspect-square bg-[#E8E2DA]" />
              <div className="p-3 sm:p-4">
                <div className="h-3 bg-[#E8E2DA] rounded w-16 mb-2" />
                <div className="h-4 bg-[#E8E2DA] rounded w-full mb-2" />
                <div className="h-4 bg-[#E8E2DA] rounded w-3/4 mb-3" />
                <div className="h-5 bg-[#E8E2DA] rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : sections.length > 0 ? (
        /* 分区视图：按风格分区；每个 collection 展示 3 行后截断（移动 6 / lg 9 / xl 12 张），
           超出出「View More」进入子分类页看全部（2026-09 用户定） */
        <div>
          {/* 移动端：筛选抽屉入口（桌面端在页头右侧）；不显示产品数量（2026-09 用户定） */}
          <div className="flex items-center justify-end mb-3 gap-3 lg:hidden">
            <button
              onClick={() => setFilterOpen(true)}
              className="inline-flex items-center gap-1.5 py-1 text-[13px] font-medium text-[#999] hover:text-[#8B5A2B] transition-colors"
              aria-label="Open filters"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filter &amp; Sort{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </button>
          </div>
          <div className="space-y-10 lg:space-y-16">
            {sections.map(({ def, products }) => (
              <section key={def.key}>
                <div className="mb-4 lg:mb-5">
                  <h2 className="text-lg lg:text-2xl font-extrabold text-[#333]">{def.label}</h2>
                  {/* bedding 材质分区：标题下一句话材质描述（小字灰）；风格分区无描述 */}
                  {beddingMaterialMode && MATERIAL_BLURBS[def.label] && (
                    <p className="mt-1 text-xs lg:text-sm text-[#999]">{MATERIAL_BLURBS[def.label]}</p>
                  )}
                </div>
                {/* 移动端：2 列 × 3 行（gap-2 与全站移动端产品网格一致；2026-09 由横滑条统一改为网格） */}
                <div className="lg:hidden grid grid-cols-2 gap-2">
                  {products.slice(0, SECTION_LIMITS.mobile).map((p) => (
                    <ProductCard key={p.id} product={p} href={cardHref(p)} />
                  ))}
                </div>
                {/* 桌面 lg：3 列 × 3 行 */}
                <div className="hidden lg:grid xl:hidden grid-cols-3 gap-6">
                  {products.slice(0, SECTION_LIMITS.lg).map((p) => (
                    <ProductCard key={p.id} product={p} href={cardHref(p)} />
                  ))}
                </div>
                {/* 桌面 xl：4 列 × 3 行 */}
                <div className="hidden xl:grid grid-cols-4 gap-6">
                  {products.slice(0, SECTION_LIMITS.xl).map((p) => (
                    <ProductCard key={p.id} product={p} href={cardHref(p)} />
                  ))}
                </div>
                {/* View More：只在当前断点确实有截断时显示（7-9 款仅移动端截断，10-12 款仅 lg 截断） */}
                {products.length > SECTION_LIMITS.mobile && (
                  <div
                    className={`mt-5 lg:mt-8 text-center ${
                      products.length <= SECTION_LIMITS.lg ? 'lg:hidden' : products.length <= SECTION_LIMITS.xl ? 'xl:hidden' : ''
                    }`}
                  >
                    <button
                      onClick={() => setFilter({ sub: def.key })}
                      className="inline-flex items-center gap-1.5 px-8 py-3 rounded-full text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                      style={{ backgroundColor: '#8B5A2B' }}
                    >
                      View More
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </button>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      ) : (
        /* 类目视图 / 搜索视图：完整网格 + 排序 + 分批加载 */
        <>
          {/* 风格分组视图：返回分区视图的链接（浏览器后退同样可用） */}
          {activeSub && !isSearching && (
            <button
              onClick={() => setFilter({ sub: '' })}
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#8B5A2B] hover:underline underline-offset-4"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
              Back to All {categoryDef?.label || 'Products'}
            </button>
          )}
          {/* 移动端：搜索结果数 + 筛选抽屉入口（桌面端排序在页头右侧）；子分类页不展示筛选入口；
              一级类目/子类目页不显示产品数量，仅搜索视图保留结果数（2026-09 用户定） */}
          {(isSearching || !activeSub) && (
          <div className={`flex items-center mb-3 flex-wrap gap-3 lg:hidden ${isSearching ? 'justify-between' : 'justify-end'}`}>
            {isSearching && (
            <p className="text-sm text-[#777]">
              {`${filtered.length} result${filtered.length === 1 ? '' : 's'} for "${searchQuery.trim()}"`}
            </p>
            )}
            {!activeSub && (
            <button
              onClick={() => setFilterOpen(true)}
              className="inline-flex items-center gap-1.5 py-1 text-[13px] font-medium text-[#999] hover:text-[#8B5A2B] transition-colors"
              aria-label="Open filters"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filter &amp; Sort{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </button>
            )}
          </div>
          )}

          {sortedFiltered.length > 0 ? (
            <>
              <div className={gridCls}>
                {sortedFiltered.slice(0, visibleCount).map((product) => (
                  <ProductCard key={product.id} product={product} href={cardHref(product)} />
                ))}
              </div>
              {/* 无限滚动哨兵：进入视口自动加载下一批；不显示产品数量，仅提示加载中（2026-09 用户定） */}
              {hasMore && (
                <div ref={sentinelRef} className="text-center mt-10 py-3">
                  <p className="text-sm text-[#999]">Loading more…</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-[#555] text-lg">No products found.</p>
              <p className="mt-2 text-sm text-[#999]">Check for spelling mistakes or try searching the name of a collection or product.</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-5 py-2 rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: '#8B5A2B' }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}
      </div>
      </div>

      {/* 移动端筛选抽屉（右侧滑出）：Sort + Collections（单选）+ Material/Style（多选，bedding 为 Style），底部 Show Products（不显示数量，2026-09 用户定） */}
      {filterOpen && (
        <div className="fixed inset-0 bg-black/40 z-[1600] lg:hidden" onClick={() => setFilterOpen(false)} />
      )}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm z-[1700] bg-white flex flex-col transition-transform duration-300 ease-out lg:hidden ${
          filterOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Filters"
        aria-hidden={!filterOpen}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E2DA]">
          <h2 className="text-lg font-bold text-[#333]">Filter &amp; Sort</h2>
          <button
            onClick={() => setFilterOpen(false)}
            className="w-10 h-10 rounded-full border border-[#E8E2DA] flex items-center justify-center text-2xl text-[#333] hover:bg-[#F8F5F0] transition"
            aria-label="Close filters"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Sort（单选） */}
          <p className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-2">Sort By</p>
          <div className="mb-5">
            {([['featured', 'Featured'], ['price-asc', 'Price: Low to High'], ['price-desc', 'Price: High to Low']] as [SortKey, string][]).map(([k, l]) => {
              const active = sortBy === k;
              return (
                <button key={k} onClick={() => setFilter({ sort: k })} aria-pressed={active} className="flex items-center gap-3 w-full py-2.5 text-left">
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${active ? 'border-[#8B5A2B]' : 'border-[#D8D2C8]'}`}>
                    {active && <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#8B5A2B' }} />}
                  </span>
                  <span className={`text-sm ${active ? 'font-semibold text-[#333]' : 'text-[#555]'}`}>{l}</span>
                </button>
              );
            })}
          </div>

          {/* Collections（分组，单选；默认风格，bedding 材质——bedding 下组名显示 Material） */}
          {collectionOptions.length > 0 && (
            <>
              <p className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-2 pt-4 border-t border-[#E8E2DA]/70">{beddingMaterialMode ? 'Material' : 'Collections'}</p>
              <div className="mb-5">
                {collectionOptions.map((o) => {
                  const active = activeSub === o.key;
                  return (
                    <button key={o.key} onClick={() => toggleSub(o.key)} aria-pressed={active} className="flex items-center gap-3 w-full py-2.5 text-left">
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${active ? 'border-[#8B5A2B]' : 'border-[#D8D2C8]'}`}>
                        {active && <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#8B5A2B' }} />}
                      </span>
                      <span className={`text-sm ${active ? 'font-semibold text-[#333]' : 'text-[#555]'}`}>{o.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Material/Style（多选；bedding 为 Style） */}
          {materialOptions.length > 0 && (
            <>
              <p className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-2 pt-4 border-t border-[#E8E2DA]/70">{beddingMaterialMode ? 'Style' : 'Material'}</p>
              <div>
                {materialOptions.map((o) => {
                  const active = materialSel.includes(o.key);
                  return (
                    <button key={o.key} onClick={() => setFilter({ material: toggleInList(materialSel, o.key) })} aria-pressed={active} className="flex items-center gap-3 w-full py-2.5 text-left">
                      <span
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${active ? 'border-[#8B5A2B]' : 'border-[#D8D2C8]'}`}
                        style={active ? { backgroundColor: '#8B5A2B' } : {}}
                      >
                        {active && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      <span className={`text-sm ${active ? 'font-semibold text-[#333]' : 'text-[#555]'}`}>{o.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="border-t border-[#E8E2DA] px-5 py-4">
          <button
            onClick={() => setFilterOpen(false)}
            className="w-full py-3.5 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: '#8B5A2B' }}
          >
            Show Products
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="w-full mt-2.5 text-sm font-semibold text-[#8B5A2B] hover:underline underline-offset-4"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
