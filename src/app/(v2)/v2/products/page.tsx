'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import V2ProductCard from '@/components/v2/V2ProductCard';
import { MakimooProduct, PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';
import { CATEGORY_DEFS, getSubcategoriesOf, getSubcategoryDef } from '@/data/subcategories';
import { getProductSpecs } from '@/lib/specs';
import { v2url } from '@/lib/v2paths';
import { trackEvent } from '@/lib/gtag';

// 每页数量与 (classic) 产品列表页一致
const PAGE_SIZE = 24;

type SortKey = 'featured' | 'price-asc' | 'price-desc';
const SORT_KEYS: SortKey[] = ['featured', 'price-asc', 'price-desc'];
const SORT_LABELS: Record<SortKey, string> = {
  featured: 'Featured',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
};

function isInStock(p: MakimooProduct): boolean {
  return p.hasShopifyData === true && p.shopifyAvailable === true;
}

function priceOf(p: MakimooProduct): number {
  return parseFloat(p.shopifyPrice || p.priceRange.minVariantPrice.amount) || 0;
}

// 产品材质列表（提取表 + 手工覆盖表合并后的展示字符串，如 "Polyester, Canvas"）
function materialsOf(asin: string): string[] {
  const m = getProductSpecs(asin)?.material;
  return m ? m.split(', ') : [];
}

/** 在售优先，缺货沉底；组内保持原顺序 */
function inStockFirst(list: MakimooProduct[]): MakimooProduct[] {
  return [...list].sort((a, b) => Number(isInStock(b)) - Number(isInStock(a)));
}

function applySort(list: MakimooProduct[], sort: SortKey): MakimooProduct[] {
  const grouped = inStockFirst(list);
  if (sort === 'featured') return grouped;
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

/** 分页页码序列：总页数 > 7 时只保留首页/末页/当前页附近，中间用省略号 */
function pageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const keep = new Set([1, total, current - 1, current, current + 1]);
  const sorted = Array.from(keep).filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | 'ellipsis')[] = [];
  let prev = 0;
  for (const n of sorted) {
    if (n - prev > 1) out.push('ellipsis');
    out.push(n);
    prev = n;
  }
  return out;
}

// pill 样式：描边，选中态实底 brand
const pillCls = (active: boolean) =>
  `inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm transition-colors ${
    active
      ? 'bg-brand text-cream border-brand'
      : 'bg-white border-warm-gray text-charcoal-light hover:border-brand hover:text-brand'
  }`;

export default function V2ProductsPage() {
  // mounted 标志：防止静态 HTML 在 JS 执行前闪现
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(() => readUrlParam('cat'));
  const [activeSub, setActiveSub] = useState(() => readUrlParam('sub'));
  // 搜索词只从 URL 读取（入口在 V2Header 搜索）
  const [searchQuery] = useState(() => readUrlParam('q'));
  const [sortBy, setSortBy] = useState<SortKey>(() => {
    const s = readUrlParam('sort') as SortKey;
    return SORT_KEYS.includes(s) ? s : 'featured';
  });
  const [materialSel, setMaterialSel] = useState<string[]>(() => readUrlList('material'));
  const [page, setPage] = useState(1);
  // 移动端筛选抽屉
  const [filterOpen, setFilterOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // 抽屉打开时锁定背景滚动 + Esc 关闭
  useEffect(() => {
    document.body.style.overflow = filterOpen ? 'hidden' : '';
    if (!filterOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFilterOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [filterOpen]);

  // 首次挂载后立即标记为已挂载，此时 state 已从 URL 正确初始化
  useEffect(() => {
    setMounted(true);
    // GA4: search（URL 带 ?q= 参数进入时触发一次）
    const q = new URLSearchParams(window.location.search).get('q');
    if (q && q.trim()) {
      trackEvent('search', { search_term: q.trim() });
    }
  }, []);

  // 全部产品（含 Shopify 价格/库存、素材库标题/图片覆盖、二级分类）
  const allProducts = useMemo(() => enrichProductsWithShopifyData(PRODUCTS_DATA), []);

  const isSearching = searchQuery.trim().length > 0;

  const categoryDef = CATEGORY_DEFS.find((c) => c.value === activeCategory.toLowerCase());

  // 当前类目下的产品（不含二级分类过滤；用于 Collections 计数）
  const categoryProducts = useMemo(() => {
    if (!activeCategory) return [];
    return allProducts.filter(
      (p) =>
        p.productType.toLowerCase() === activeCategory.toLowerCase() ||
        p.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()))
    );
  }, [allProducts, activeCategory]);

  // Collections 筛选项：当前类目的二级分类（带数量；0 的不显示）
  const collectionOptions = useMemo(() => {
    if (!activeCategory) return [];
    return getSubcategoriesOf(activeCategory)
      .map((s) => ({
        key: s.key,
        label: s.label,
        count: categoryProducts.filter((p) => p.subcategory === s.key).length,
      }))
      .filter((s) => s.count > 0);
  }, [categoryProducts, activeCategory]);

  // 筛选作用域：有类目按类目（V2 裸 /products 即 Shop All，不跳转，展示全部）
  const scopeProducts = useMemo(() => {
    let list = activeCategory ? categoryProducts : allProducts;
    if (activeSub) {
      list = list.filter((p) => p.subcategory === activeSub);
    }
    return list;
  }, [allProducts, categoryProducts, activeCategory, activeSub]);

  // 材质筛选聚合（当前类目 + 二级分类内带产品数）
  const materialOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of scopeProducts) {
      for (const m of materialsOf(p.asin)) counts.set(m, (counts.get(m) || 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ key: label, label, count }));
  }, [scopeProducts]);

  // 统一写 URL（分类 + 二级分类 + 筛选 + 排序，可分享；q 参数原样保留）。
  // 进入/退出二级分类用 pushState（浏览器后退可回到上级视图），其余变更用 replaceState 不污染历史
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

  // 统一更新筛选状态：合并变更 → 写回 state + URL，重置分页
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
    setPage(1);
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
      setPage(1);
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

  // 当前筛选结果：类目 + 二级分类 → 搜索 → 材质
  // （启用材质筛选时，没有材质数据的产品不显示；搜索时材质筛选不生效，与旧页一致）
  const filtered = useMemo(() => {
    let result = scopeProducts;
    if (isSearching) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    } else if (materialSel.length > 0) {
      result = result.filter((p) => {
        const mats = materialsOf(p.asin);
        return mats.length > 0 && materialSel.some((m) => mats.includes(m));
      });
    }
    return result;
  }, [scopeProducts, searchQuery, isSearching, materialSel]);

  const sortedFiltered = useMemo(() => applySort(filtered, sortBy), [filtered, sortBy]);

  const pageCount = Math.max(1, Math.ceil(sortedFiltered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = sortedFiltered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goToPage = (n: number) => {
    setPage(n);
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const gridCls = 'grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6';

  const subDef = activeSub ? getSubcategoryDef(activeSub) : undefined;
  const pageTitle = isSearching
    ? 'Search Results'
    : subDef?.label || categoryDef?.label || 'Shop All';
  const pageIntro = isSearching
    ? `Results for "${searchQuery.trim()}".`
    : subDef?.blurb ||
      categoryDef?.intro ||
      'Cushions, pillows, towels, mats and more — every Makimoo essential in one place.';

  // 筛选控件：搜索态隐藏 Collections/Material（材质筛选搜索时不生效），只留排序
  const showFacetFilters = !isSearching;

  return (
    <>
      {/* 深色页头：衬住初始透明的 fixed V2Header（announcement bar + header 约 112-120px） */}
      <section className="bg-brand">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-32 lg:pt-36 pb-10 lg:pb-14">
          <nav className="text-xs lg:text-sm text-cream/60 mb-3 lg:mb-4" aria-label="Breadcrumb">
            <a href={v2url('/')} className="hover:text-cream transition-colors">
              Home
            </a>
            <span className="mx-1.5">/</span>
            {mounted && activeSub && subDef && categoryDef ? (
              <>
                <a
                  href={v2url(`/products/?cat=${activeCategory}`)}
                  className="hover:text-cream transition-colors"
                >
                  {categoryDef.label}
                </a>
                <span className="mx-1.5">/</span>
                <span className="text-cream">{subDef.label}</span>
              </>
            ) : (
              <span className="text-cream">{mounted ? pageTitle : 'Shop All'}</span>
            )}
          </nav>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-cream">
            {mounted ? pageTitle : 'Shop All'}
          </h1>
          <p className="mt-3 lg:mt-4 text-sm lg:text-base text-cream/75 max-w-2xl">
            {mounted ? pageIntro : ' '}
          </p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-cream/60">
            {mounted ? `${filtered.length} Product${filtered.length === 1 ? '' : 's'}` : ' '}
          </p>
        </div>
      </section>

      {/* Sticky 筛选栏：fixed header 实底后总高约 112px（移动端）/ 120px（lg），announcement bar 不随滚动隐藏 */}
      <div className="sticky top-28 lg:top-[120px] z-40 bg-off-white border-b border-warm-gray">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {/* 桌面端筛选栏 */}
          <div className="hidden lg:block py-5 space-y-4">
            <div className="flex items-center gap-6">
              {mounted && showFacetFilters && collectionOptions.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-light mr-1">
                    Collections
                  </span>
                  <button onClick={() => setFilter({ sub: '' })} aria-pressed={!activeSub} className={pillCls(!activeSub)}>
                    All
                  </button>
                  {collectionOptions.map((o) => (
                    <button
                      key={o.key}
                      onClick={() => toggleSub(o.key)}
                      aria-pressed={activeSub === o.key}
                      className={pillCls(activeSub === o.key)}
                    >
                      {o.label}
                      <span className={activeSub === o.key ? 'text-cream/70' : 'text-charcoal-light/70'}>
                        {o.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              <div className="ml-auto flex items-center gap-4 flex-shrink-0">
                {mounted && activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-semibold text-brand hover:underline underline-offset-4"
                  >
                    Clear All ({activeFilterCount})
                  </button>
                )}
                <select
                  value={sortBy}
                  onChange={(e) => setFilter({ sort: e.target.value as SortKey })}
                  className="h-10 px-4 rounded-full border border-warm-gray bg-white text-sm text-charcoal outline-none focus:border-brand"
                  aria-label="Sort products"
                >
                  {SORT_KEYS.map((k) => (
                    <option key={k} value={k}>
                      {SORT_LABELS[k]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {mounted && showFacetFilters && materialOptions.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-light mr-1">
                  Material
                </span>
                {materialOptions.map((o) => {
                  const active = materialSel.includes(o.key);
                  return (
                    <button
                      key={o.key}
                      onClick={() => setFilter({ material: toggleInList(materialSel, o.key) })}
                      aria-pressed={active}
                      className={pillCls(active)}
                    >
                      {o.label}
                      <span className={active ? 'text-cream/70' : 'text-charcoal-light/70'}>{o.count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 移动端筛选栏：结果数 + Filters 抽屉入口 */}
          <div className="flex lg:hidden items-center justify-between py-3">
            <p className="text-sm text-charcoal-light">
              {mounted ? `${filtered.length} product${filtered.length === 1 ? '' : 's'}` : ' '}
            </p>
            <button
              onClick={() => setFilterOpen(true)}
              className="relative h-10 px-4 rounded-full border border-warm-gray bg-white text-sm font-semibold text-charcoal inline-flex items-center gap-2"
              aria-label="Open filters"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-brand text-cream text-[11px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 产品网格区 */}
      <section className="bg-off-white">
        <div
          ref={gridRef}
          className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 lg:py-14 scroll-mt-44 lg:scroll-mt-56"
        >
          {!mounted ? (
            /* JS 加载前的占位：骨架屏与卡片同比例，避免布局跳动 */
            <div className={gridCls}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square rounded-lg bg-warm-gray" />
                  <div className="pt-3.5">
                    <div className="h-4 bg-warm-gray rounded w-full mb-2" />
                    <div className="h-4 bg-warm-gray rounded w-2/3 mb-2" />
                    <div className="h-4 bg-warm-gray rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : paged.length > 0 ? (
            <>
              <div className={gridCls}>
                {paged.map((product) => (
                  <V2ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* 分页：PAGE_SIZE=24，描边按钮，当前页实底 */}
              {pageCount > 1 && (
                <div className="mt-12 lg:mt-16 text-center">
                  <p className="text-sm text-charcoal-light mb-5">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                    {Math.min(currentPage * PAGE_SIZE, sortedFiltered.length)} of {sortedFiltered.length}
                  </p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-10 px-4 rounded-full border border-warm-gray bg-white text-sm font-semibold text-charcoal transition hover:border-brand hover:text-brand disabled:opacity-40 disabled:hover:border-warm-gray disabled:hover:text-charcoal"
                      aria-label="Previous page"
                    >
                      Prev
                    </button>
                    {pageNumbers(currentPage, pageCount).map((n, i) =>
                      n === 'ellipsis' ? (
                        <span key={`e${i}`} className="w-10 h-10 flex items-center justify-center text-sm text-charcoal-light">
                          …
                        </span>
                      ) : (
                        <button
                          key={n}
                          onClick={() => goToPage(n)}
                          aria-current={n === currentPage ? 'page' : undefined}
                          className={`w-10 h-10 rounded-full border text-sm font-semibold transition ${
                            n === currentPage
                              ? 'bg-brand text-cream border-brand'
                              : 'border-warm-gray bg-white text-charcoal hover:border-brand hover:text-brand'
                          }`}
                        >
                          {n}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === pageCount}
                      className="h-10 px-4 rounded-full border border-warm-gray bg-white text-sm font-semibold text-charcoal transition hover:border-brand hover:text-brand disabled:opacity-40 disabled:hover:border-warm-gray disabled:hover:text-charcoal"
                      aria-label="Next page"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* 空态：无结果提示 + 清除筛选 / 回 Shop All */
            <div className="text-center py-20">
              <p className="text-charcoal text-lg font-semibold">No products found.</p>
              <p className="mt-2 text-sm text-charcoal-light max-w-md mx-auto">
                {isSearching
                  ? 'Check for spelling mistakes or try a different search term.'
                  : 'Try removing some filters to see more products.'}
              </p>
              <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
                {(activeFilterCount > 0 || sortBy !== 'featured') && !isSearching && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 rounded-full bg-brand text-cream text-sm font-semibold transition hover:bg-brand-dark"
                  >
                    Clear Filters
                  </button>
                )}
                <a
                  href={v2url('/products/')}
                  className="px-6 py-3 rounded-full border-2 border-brand text-brand text-sm font-semibold transition hover:bg-brand hover:text-cream"
                >
                  Shop All Products
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 移动端筛选抽屉（右侧滑出）：Sort + Collections（单选）+ Material（多选），底部 Show N products */}
      {filterOpen && (
        <div className="fixed inset-0 bg-charcoal/40 z-[1600] lg:hidden" onClick={() => setFilterOpen(false)} />
      )}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm z-[1700] bg-off-white flex flex-col transition-transform duration-300 ease-out lg:hidden ${
          filterOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Filters"
        aria-hidden={!filterOpen}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-warm-gray">
          <h2 className="text-lg font-bold text-charcoal">Filter &amp; Sort</h2>
          <button
            onClick={() => setFilterOpen(false)}
            className="w-10 h-10 rounded-full border border-warm-gray flex items-center justify-center text-2xl text-charcoal hover:bg-warm-gray transition"
            aria-label="Close filters"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Sort（单选） */}
          <p className="text-xs font-semibold text-charcoal-light uppercase tracking-wider mb-2">Sort By</p>
          <div className="mb-5">
            {SORT_KEYS.map((k) => {
              const active = sortBy === k;
              return (
                <button key={k} onClick={() => setFilter({ sort: k })} aria-pressed={active} className="flex items-center gap-3 w-full py-2.5 text-left">
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${active ? 'border-brand' : 'border-warm-gray'}`}>
                    {active && <span className="w-2.5 h-2.5 rounded-full bg-brand" />}
                  </span>
                  <span className={`text-sm ${active ? 'font-semibold text-charcoal' : 'text-charcoal-light'}`}>{SORT_LABELS[k]}</span>
                </button>
              );
            })}
          </div>

          {/* Collections（二级分类，单选） */}
          {showFacetFilters && collectionOptions.length > 0 && (
            <>
              <p className="text-xs font-semibold text-charcoal-light uppercase tracking-wider mb-2 pt-4 border-t border-warm-gray/70">Collections</p>
              <div className="mb-5">
                {collectionOptions.map((o) => {
                  const active = activeSub === o.key;
                  return (
                    <button key={o.key} onClick={() => toggleSub(o.key)} aria-pressed={active} className="flex items-center gap-3 w-full py-2.5 text-left">
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${active ? 'border-brand' : 'border-warm-gray'}`}>
                        {active && <span className="w-2.5 h-2.5 rounded-full bg-brand" />}
                      </span>
                      <span className={`text-sm ${active ? 'font-semibold text-charcoal' : 'text-charcoal-light'}`}>{o.label} ({o.count})</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Material（多选） */}
          {showFacetFilters && materialOptions.length > 0 && (
            <>
              <p className="text-xs font-semibold text-charcoal-light uppercase tracking-wider mb-2 pt-4 border-t border-warm-gray/70">Material</p>
              <div>
                {materialOptions.map((o) => {
                  const active = materialSel.includes(o.key);
                  return (
                    <button key={o.key} onClick={() => setFilter({ material: toggleInList(materialSel, o.key) })} aria-pressed={active} className="flex items-center gap-3 w-full py-2.5 text-left">
                      <span className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${active ? 'border-brand bg-brand' : 'border-warm-gray'}`}>
                        {active && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-cream">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      <span className={`text-sm ${active ? 'font-semibold text-charcoal' : 'text-charcoal-light'}`}>{o.label} ({o.count})</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="border-t border-warm-gray px-5 py-4">
          <button
            onClick={() => setFilterOpen(false)}
            className="w-full py-3.5 rounded-full bg-brand text-cream text-sm font-semibold transition hover:bg-brand-dark"
          >
            Show {filtered.length} Product{filtered.length === 1 ? '' : 's'}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="w-full mt-2.5 text-sm font-semibold text-brand hover:underline underline-offset-4"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </>
  );
}
