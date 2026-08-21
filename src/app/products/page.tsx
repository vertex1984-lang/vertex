'use client';

import { useState, useEffect, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { MakimooProduct, PRODUCTS_DATA, getProductsByCategory, enrichProductsWithShopifyData } from '@/data/products';
import { trackEvent } from '@/lib/gtag';

const CATEGORY_DEFS = [
  { label: 'Dining', value: 'dining' },
  { label: 'Cushions', value: 'cushions' },
  { label: 'Pillows', value: 'pillows' },
  { label: 'Travel', value: 'travel' },
  { label: 'Home Fragrance', value: 'home-fragrance' },
  { label: 'Others', value: 'others' },
];

const PAGE_SIZE = 24;
const SECTION_PREVIEW = 8;

type SortKey = 'featured' | 'price-asc' | 'price-desc';

function isInStock(p: MakimooProduct): boolean {
  return p.hasShopifyData === true && p.shopifyAvailable === true;
}

function priceOf(p: MakimooProduct): number {
  return parseFloat(p.shopifyPrice || p.priceRange.minVariantPrice.amount) || 0;
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

export default function ProductsPage() {
  // mounted 标志：防止静态 HTML（预渲染 All 产品）在 JS 执行前闪现
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(() => readUrlParam('cat'));
  const [searchQuery, setSearchQuery] = useState(() => readUrlParam('q'));
  const [sortBy, setSortBy] = useState<SortKey>('featured');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // 首次挂载后立即标记为已挂载，此时 state 已从 URL 正确初始化
  useEffect(() => {
    setMounted(true);
    // GA4: search（URL 带 ?q= 参数进入时触发一次）
    const q = new URLSearchParams(window.location.search).get('q');
    if (q && q.trim()) {
      trackEvent('search', { search_term: q.trim() });
    }
  }, []);

  // 全部产品（含 Shopify 价格/库存、素材库标题/图片覆盖）
  const allProducts = useMemo(() => enrichProductsWithShopifyData(PRODUCTS_DATA), []);

  // 分类计数（0 的分类不显示 pill，也不在 All 视图分区）
  const categories = useMemo(
    () =>
      CATEGORY_DEFS.map((cat) => ({
        ...cat,
        count: getProductsByCategory(cat.value).length,
      })).filter((cat) => cat.count > 0),
    []
  );

  // 切换分类：同步 URL 参数（可分享），重置排序/分页
  const selectCategory = (value: string) => {
    setActiveCategory(value);
    setSortBy('featured');
    setVisibleCount(PAGE_SIZE);
    const url = new URL(window.location.href);
    if (value) url.searchParams.set('cat', value);
    else url.searchParams.delete('cat');
    window.history.replaceState(null, '', url.toString());
  };

  const isSearching = searchQuery.trim().length > 0;

  // 当前筛选结果
  const filtered = useMemo(() => {
    let result = allProducts;
    if (activeCategory) {
      result = result.filter(
        (p) =>
          p.productType.toLowerCase() === activeCategory.toLowerCase() ||
          p.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()))
      );
    }
    if (isSearching) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allProducts, activeCategory, searchQuery, isSearching]);

  const sortedFiltered = useMemo(() => applySort(filtered, sortBy), [filtered, sortBy]);

  const gridCls = 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6';

  return (
    <div className="px-6 lg:px-10 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#333] mb-3">
            {activeCategory
              ? categories.find((c) => c.value === activeCategory)?.label || 'Products'
              : 'All Products'}
          </h1>
          <p className="text-[#555]">Browse our complete collection of comfort essentials.</p>
        </div>

        {/* 吸顶过滤区：搜索 + 分类，长列表滚动时随时可切（top 值 = Header 高度） */}
        <div className="sticky top-[96px] lg:top-[112px] z-30 -mx-6 lg:-mx-10 px-6 lg:px-10 py-3 mb-6" style={{ backgroundColor: '#F8F5F0' }}>
          {/* Search */}
          <div className="max-w-md mx-auto mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 px-5 pl-11 rounded-lg border-2 border-[#E8E2DA] focus:border-[#8B5A2B] focus:ring-2 focus:ring-[#8B5A2B]/20 outline-none bg-white text-base"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              />
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888]"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16" y2="16" />
              </svg>
            </div>
          </div>

          {/* Category Filter - 带数量；JS 未加载时不标记当前分类 */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => selectCategory('')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                mounted && activeCategory === ''
                  ? 'text-white'
                  : 'bg-white text-[#333] hover:bg-[#E8E2DA]'
              }`}
              style={mounted && activeCategory === '' ? { backgroundColor: '#8B5A2B' } : {}}
            >
              All ({allProducts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => selectCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                  mounted && activeCategory === cat.value
                    ? 'text-white'
                    : 'bg-white text-[#333] hover:bg-[#E8E2DA]'
                }`}
                style={mounted && activeCategory === cat.value ? { backgroundColor: '#8B5A2B' } : {}}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {!mounted ? (
          /* JS 加载前的占位：骨架屏与新卡片同比例，避免布局跳动 */
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
        ) : isSearching || activeCategory ? (
          /* 分类视图 / 搜索视图：完整网格 + 排序 + 分批加载 */
          <>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <p className="text-sm text-[#777]">
                {isSearching
                  ? `${filtered.length} result${filtered.length === 1 ? '' : 's'} for "${searchQuery.trim()}"`
                  : `${filtered.length} product${filtered.length === 1 ? '' : 's'}`}
              </p>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value as SortKey); setVisibleCount(PAGE_SIZE); }}
                className="h-10 px-3 rounded-lg border-2 border-[#E8E2DA] bg-white text-sm text-[#333] outline-none focus:border-[#8B5A2B]"
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {sortedFiltered.length > 0 ? (
              <>
                <div className={gridCls}>
                  {sortedFiltered.slice(0, visibleCount).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {visibleCount < sortedFiltered.length && (
                  <div className="text-center mt-10">
                    <p className="text-sm text-[#999] mb-3">
                      Showing {visibleCount} of {sortedFiltered.length}
                    </p>
                    <button
                      onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                      className="px-8 py-3 rounded-full text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                      style={{ backgroundColor: '#8B5A2B' }}
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-[#555] text-lg">No products found.</p>
                <button
                  onClick={() => {
                    selectCategory('');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-5 py-2 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: '#8B5A2B' }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        ) : (
          /* All 视图：按分类分区展示，每区前 8 个 + View All */
          <div className="space-y-14">
            {categories.map((cat) => {
              const sectionProducts = inStockFirst(
                allProducts.filter(
                  (p) =>
                    p.productType.toLowerCase() === cat.value.toLowerCase() ||
                    p.tags.some((t) => t.toLowerCase().includes(cat.value.toLowerCase()))
                )
              );
              return (
                <section key={cat.value}>
                  <div className="flex items-end justify-between mb-5">
                    <div>
                      <h2 className="text-xl lg:text-2xl font-extrabold text-[#333]">{cat.label}</h2>
                      <p className="text-sm text-[#999] mt-0.5">{cat.count} products</p>
                    </div>
                    {cat.count > SECTION_PREVIEW && (
                      <button
                        onClick={() => selectCategory(cat.value)}
                        className="text-sm font-semibold text-[#8B5A2B] hover:underline underline-offset-4 flex items-center gap-1"
                      >
                        View All
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className={gridCls}>
                    {sectionProducts.slice(0, SECTION_PREVIEW).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
