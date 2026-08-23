'use client';

import { useState, useEffect, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { MakimooProduct, PRODUCTS_DATA, getProductsByCategory, enrichProductsWithShopifyData } from '@/data/products';
import { getProductSpecs } from '@/lib/specs';
import { trackEvent } from '@/lib/gtag';

const CATEGORY_DEFS = [
  { label: 'Cushions', value: 'cushions' },
  { label: 'Pillows', value: 'pillows' },
  { label: 'Towels', value: 'towels' },
  { label: 'Mats', value: 'mats' },
  { label: 'Holiday', value: 'holiday' },
  { label: 'Others', value: 'others' },
];

const PAGE_SIZE = 24;
const SECTION_PREVIEW = 8;

type SortKey = 'featured' | 'price-asc' | 'price-desc';
const SORT_KEYS: SortKey[] = ['featured', 'price-asc', 'price-desc'];

// 价格档位（按全站价格分布定档：36/38/32/15/10）
const PRICE_BUCKETS = [
  { value: 'under-15', label: 'Under $15', test: (v: number) => v < 15 },
  { value: '15-25', label: '$15 – $25', test: (v: number) => v >= 15 && v < 25 },
  { value: '25-40', label: '$25 – $40', test: (v: number) => v >= 25 && v < 40 },
  { value: '40-70', label: '$40 – $70', test: (v: number) => v >= 40 && v < 70 },
  { value: 'over-70', label: 'Over $70', test: (v: number) => v >= 70 },
];

// 尺寸分档：按最长边（cm）
const SIZE_BANDS = [
  { value: 's', label: 'S · under 45 cm', test: (d: number) => d < 45 },
  { value: 'm', label: 'M · 45 – 80 cm', test: (d: number) => d >= 45 && d <= 80 },
  { value: 'l', label: 'L · over 80 cm', test: (d: number) => d > 80 },
];

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

// 产品最长边（cm），无尺寸数据返回 null
function longestDimOf(asin: string): number | null {
  const dims = getProductSpecs(asin)?.dimensionsCm;
  return dims && dims.length > 0 ? Math.max(...dims) : null;
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
  price: string[];
  material: string[];
  size: string[];
  stock: boolean;
  sort: SortKey;
}

// 筛选行：label + 可多选的 chips（带数量）；chips 独立容器，换行与首行 chip 对齐而非 label
function FilterRow({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { key: string; label: string; count: number }[];
  selected: string[];
  onToggle: (key: string) => void;
}) {
  if (options.length === 0) return null;
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs font-semibold text-[#999] uppercase tracking-wider w-24 flex-shrink-0 pt-1.5">{label}</span>
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {options.map((o) => {
          const active = selected.includes(o.key);
          return (
            <button
              key={o.key}
              onClick={() => onToggle(o.key)}
              aria-pressed={active}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                active ? 'text-white' : 'bg-[#F8F5F0] text-[#555] hover:bg-[#E8E2DA]'
              }`}
              style={active ? { backgroundColor: '#8B5A2B' } : {}}
            >
              {o.label} ({o.count})
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  // mounted 标志：防止静态 HTML（预渲染 All 产品）在 JS 执行前闪现
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(() => readUrlParam('cat'));
  const [searchQuery, setSearchQuery] = useState(() => readUrlParam('q'));
  const [sortBy, setSortBy] = useState<SortKey>(() => {
    const s = readUrlParam('sort') as SortKey;
    return SORT_KEYS.includes(s) ? s : 'featured';
  });
  const [priceSel, setPriceSel] = useState<string[]>(() => readUrlList('price'));
  const [materialSel, setMaterialSel] = useState<string[]>(() => readUrlList('material'));
  const [sizeSel, setSizeSel] = useState<string[]>(() => readUrlList('size'));
  const [inStockOnly, setInStockOnly] = useState(() => readUrlParam('stock') === '1');
  const [filtersOpen, setFiltersOpen] = useState(
    () => readUrlList('price').length + readUrlList('material').length + readUrlList('size').length > 0 || readUrlParam('stock') === '1'
  );
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

  // 当前类目下的产品（筛选选项按类目内聚合，筛选只在类目视图生效）
  const categoryProducts = useMemo(
    () =>
      activeCategory
        ? allProducts.filter(
            (p) =>
              p.productType.toLowerCase() === activeCategory.toLowerCase() ||
              p.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()))
          )
        : allProducts,
    [allProducts, activeCategory]
  );

  // 筛选选项聚合（当前类目内带产品数）
  const priceOptions = useMemo(
    () =>
      PRICE_BUCKETS.map((b) => ({
        key: b.value,
        label: b.label,
        count: categoryProducts.filter((p) => b.test(priceOf(p))).length,
      })),
    [categoryProducts]
  );
  const materialOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of categoryProducts) {
      for (const m of materialsOf(p.asin)) counts.set(m, (counts.get(m) || 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ key: label, label, count }));
  }, [categoryProducts]);
  const sizeOptions = useMemo(
    () =>
      SIZE_BANDS.map((b) => ({
        key: b.value,
        label: b.label,
        count: categoryProducts.filter((p) => {
          const d = longestDimOf(p.asin);
          return d !== null && b.test(d);
        }).length,
      })),
    [categoryProducts]
  );

  // 统一写 URL（分类 + 全部筛选 + 排序，可分享）
  const writeUrl = (b: FilterBundle) => {
    const url = new URL(window.location.href);
    const set = (k: string, v: string) => (v ? url.searchParams.set(k, v) : url.searchParams.delete(k));
    set('cat', b.cat);
    set('price', b.price.join(','));
    set('material', b.material.join(','));
    set('size', b.size.join(','));
    set('stock', b.stock ? '1' : '');
    set('sort', b.sort === 'featured' ? '' : b.sort);
    window.history.replaceState(null, '', url.toString());
  };

  // 统一更新筛选状态：合并变更 → 写回 state + URL，重置分页
  const setFilter = (over: Partial<FilterBundle>) => {
    const b: FilterBundle = {
      cat: activeCategory,
      price: priceSel,
      material: materialSel,
      size: sizeSel,
      stock: inStockOnly,
      sort: sortBy,
      ...over,
    };
    if (over.cat !== undefined) setActiveCategory(over.cat);
    if (over.price) setPriceSel(over.price);
    if (over.material) setMaterialSel(over.material);
    if (over.size) setSizeSel(over.size);
    if (over.stock !== undefined) setInStockOnly(over.stock);
    if (over.sort) setSortBy(over.sort);
    setVisibleCount(PAGE_SIZE);
    writeUrl(b);
  };

  // 切换分类：筛选只在单个类目内生效，切类目时清空全部筛选和排序
  const selectCategory = (value: string) => {
    setFilter({ cat: value, price: [], material: [], size: [], stock: false, sort: 'featured' });
  };

  const clearAll = () => {
    setSearchQuery('');
    setFilter({ cat: '', price: [], material: [], size: [], stock: false, sort: 'featured' });
  };

  const isSearching = searchQuery.trim().length > 0;
  const isFiltering = priceSel.length > 0 || materialSel.length > 0 || sizeSel.length > 0 || inStockOnly;
  const activeFilterCount = priceSel.length + materialSel.length + sizeSel.length + (inStockOnly ? 1 : 0);

  // 当前筛选结果：分类 → 搜索 → 价格 → 材质 → 尺寸 → 现货
  // （启用材质/尺寸筛选时，没有对应数据的产品不显示）
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
    if (priceSel.length > 0) {
      result = result.filter((p) =>
        priceSel.some((v) => PRICE_BUCKETS.find((b) => b.value === v)?.test(priceOf(p)))
      );
    }
    if (materialSel.length > 0) {
      result = result.filter((p) => {
        const mats = materialsOf(p.asin);
        return mats.length > 0 && materialSel.some((m) => mats.includes(m));
      });
    }
    if (sizeSel.length > 0) {
      result = result.filter((p) => {
        const d = longestDimOf(p.asin);
        return d !== null && sizeSel.some((v) => SIZE_BANDS.find((b) => b.value === v)?.test(d));
      });
    }
    if (inStockOnly) {
      result = result.filter(isInStock);
    }
    return result;
  }, [allProducts, activeCategory, searchQuery, isSearching, priceSel, materialSel, sizeSel, inStockOnly]);

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
        <div className="sticky top-[96px] lg:top-[112px] z-30 -mx-6 lg:-mx-10 px-6 lg:px-10 py-3 mb-4" style={{ backgroundColor: '#F8F5F0' }}>
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

        {/* 筛选区：只在类目视图显示（All/搜索视图不筛选），默认收起，点击展开 */}
        {mounted && activeCategory && (
          <>
            <div className="mb-3 text-center lg:text-left">
              <button
                onClick={() => setFiltersOpen((o) => !o)}
                aria-expanded={filtersOpen}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-[#333] border border-[#E8E2DA] hover:border-[#8B5A2B] transition inline-flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 6h16M7 12h10M10 18h4" />
                </svg>
                Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform duration-200 ${filtersOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>

            {/* 筛选面板：价格 / 材质 / 尺寸 / 现货，全部与 URL 同步，切类目自动清空 */}
            {filtersOpen && (
              <div className="bg-white rounded-xl border border-[#E8E2DA] p-4 mb-6 space-y-3">
                <FilterRow label="Price" options={priceOptions} selected={priceSel} onToggle={(v) => setFilter({ price: toggleInList(priceSel, v) })} />
                <FilterRow label="Material" options={materialOptions} selected={materialSel} onToggle={(v) => setFilter({ material: toggleInList(materialSel, v) })} />
                <FilterRow label="Size" options={sizeOptions} selected={sizeSel} onToggle={(v) => setFilter({ size: toggleInList(sizeSel, v) })} />
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-[#999] uppercase tracking-wider w-24 flex-shrink-0 pt-1.5">Availability</span>
                  <div className="flex flex-wrap items-center gap-2 flex-1">
                    <button
                      onClick={() => setFilter({ stock: !inStockOnly })}
                      aria-pressed={inStockOnly}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        inStockOnly ? 'text-white' : 'bg-[#F8F5F0] text-[#555] hover:bg-[#E8E2DA]'
                      }`}
                      style={inStockOnly ? { backgroundColor: '#8B5A2B' } : {}}
                    >
                      In Stock Only
                    </button>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearAll}
                        className="ml-auto text-xs font-semibold text-[#8B5A2B] hover:underline underline-offset-4"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

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
        ) : isSearching || activeCategory || isFiltering ? (
          /* 分类视图 / 搜索视图 / 筛选视图：完整网格 + 排序 + 分批加载 */
          <>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <p className="text-sm text-[#777]">
                {isSearching
                  ? `${filtered.length} result${filtered.length === 1 ? '' : 's'} for "${searchQuery.trim()}"`
                  : `${filtered.length} product${filtered.length === 1 ? '' : 's'}`}
              </p>
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
                  onClick={clearAll}
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
