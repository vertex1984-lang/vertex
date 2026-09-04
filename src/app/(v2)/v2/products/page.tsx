'use client';

import { useState, useEffect, useMemo, useRef, type ReactNode } from 'react';
import V2ProductCard from '@/components/v2/V2ProductCard';
import { MakimooProduct, PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';
import { CATEGORY_DEFS, getSubcategoryDef } from '@/data/subcategories';
import { getProductSpecs } from '@/lib/specs';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { trackEvent } from '@/lib/gtag';

// 每页数量与 (classic) 产品列表页一致
const PAGE_SIZE = 24;

// 网格穿插块（第 1 页、无搜索词时）：有对应场景图的分类
const PROMO_CATS = ['cushions', 'pillows', 'towels', 'mats', 'holiday', 'others'];

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
  const gridRef = useRef<HTMLDivElement>(null);

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

  // Collections 筛选项与材质选项已不再在页面上展示（筛选 UI 移除），
  // 但 URL 参数（cat/sub/material）从 V2Header 导航、Material Guide 等入口带入仍生效。

  // 筛选作用域：有类目按类目（V2 裸 /products 即 Shop All，不跳转，展示全部）
  const scopeProducts = useMemo(() => {
    let list = activeCategory ? categoryProducts : allProducts;
    if (activeSub) {
      list = list.filter((p) => p.subcategory === activeSub);
    }
    return list;
  }, [allProducts, categoryProducts, activeCategory, activeSub]);

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

  const gridCls = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6';

  const subDef = activeSub ? getSubcategoryDef(activeSub) : undefined;
  const pageTitle = isSearching
    ? 'Search Results'
    : subDef?.label || categoryDef?.label || 'Shop All';
  const pageIntro = isSearching
    ? `Results for "${searchQuery.trim()}".`
    : subDef?.blurb ||
      categoryDef?.intro ||
      'Cushions, pillows, towels, mats and more — every Makimoo essential in one place.';

  // 网格穿插块（Parachute 集合页节奏）：只在第 1 页且无搜索词时显示，翻页/搜索后为纯产品网格
  // 穿插位 1：第 9 位（前两行纯产品之后），横版场景大图（占 2 列 × 1 行），
  //           用当前分类场景图，无分类用品牌竖图，底部渐变 + 分类名 + Shop Now
  // 穿插位 2：第 17 位，竖版图文卡（lg 占 1 列 × 2 行），居中标语
  const showPromos = currentPage === 1 && !isSearching;
  const promoCat = activeCategory.toLowerCase();
  const promoHeroImage = PROMO_CATS.includes(promoCat)
    ? `/images/collections/${promoCat}.webp`
    : '/images/brand/brand-banner-mobile.webp';
  const promoHeroLabel = categoryDef?.label || 'Shop All';
  const promoHeroHref = activeCategory
    ? v2url(`/products/?cat=${encodeURIComponent(activeCategory)}`)
    : v2url('/products/');

  const gridItems: ReactNode[] = [];
  paged.forEach((product, i) => {
    if (showPromos && i === 8) {
      gridItems.push(
        <a
          key="promo-wide"
          href={promoHeroHref}
          className="group relative col-span-2 aspect-[16/9] lg:aspect-[2/1] overflow-hidden rounded-lg"
        >
          <img
            src={resolveUrl(promoHeroImage)}
            alt={promoHeroLabel}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
            <p className="text-cream text-xl lg:text-2xl font-extrabold tracking-tight">
              {promoHeroLabel}
            </p>
            <p className="mt-1 text-cream/80 text-xs font-semibold uppercase tracking-[0.2em]">
              Shop Now
            </p>
          </div>
        </a>
      );
    }
    if (showPromos && i === 16) {
      gridItems.push(
        <div
          key="promo-tall"
          className="relative col-span-2 lg:col-span-1 lg:row-span-2 aspect-[3/4] lg:aspect-auto overflow-hidden rounded-lg"
        >
          <img
            src={resolveUrl('/images/brand/makimoo-design.webp')}
            alt="Crafted for Slow Mornings"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <p className="text-cream text-lg lg:text-xl font-extrabold tracking-tight text-center">
              Crafted for Slow Mornings
            </p>
          </div>
        </div>
      );
    }
    gridItems.push(<V2ProductCard key={product.id} product={product} />);
  });

  return (
    <>
      {/* 浅色单色页头（Parachute 集合页风格）：与页面底色一体，V2Header 在本页从首屏即实底 */}
      <section className="bg-off-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-32 lg:pt-36 pb-8 lg:pb-12">
          <nav className="text-xs lg:text-sm text-charcoal-light mb-3 lg:mb-4" aria-label="Breadcrumb">
            <a href={v2url('/')} className="hover:text-brand transition-colors">
              Home
            </a>
            <span className="mx-1.5">/</span>
            {mounted && activeSub && subDef && categoryDef ? (
              <>
                <a
                  href={v2url(`/products/?cat=${activeCategory}`)}
                  className="hover:text-brand transition-colors"
                >
                  {categoryDef.label}
                </a>
                <span className="mx-1.5">/</span>
                <span className="text-charcoal">{subDef.label}</span>
              </>
            ) : (
              <span className="text-charcoal">{mounted ? pageTitle : 'Shop All'}</span>
            )}
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-charcoal">
                {mounted ? pageTitle : 'Shop All'}
              </h1>
              <p className="mt-3 lg:mt-4 text-sm lg:text-base text-charcoal-light max-w-2xl">
                {mounted ? pageIntro : ' '}
              </p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <p className="text-sm text-charcoal-light tabular-nums">
                {mounted ? `${filtered.length} results` : ' '}
              </p>
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
        </div>
      </section>

      {/* 产品区：无筛选侧栏（Parachute 集合页风格），网格全宽贴边 px-6 / lg:px-10 */}
      <section className="bg-off-white">
        <div className="px-6 lg:px-10 py-10 lg:py-14">
          <div
            ref={gridRef}
            className="min-w-0 scroll-mt-44 lg:scroll-mt-40"
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
                {gridItems}
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
        </div>
      </section>

    </>
  );
}
