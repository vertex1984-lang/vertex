'use client';

import { useState, useEffect, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { MakimooProduct, PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';
import { CATEGORY_DEFS, getSubcategoriesOf, getSubcategoryDef } from '@/data/subcategories';
import { getProductSpecs } from '@/lib/specs';
import { resolveUrl } from '@/lib/paths';
import { trackEvent } from '@/lib/gtag';

const PAGE_SIZE = 24;

type SortKey = 'featured' | 'price-asc' | 'price-desc';
const SORT_KEYS: SortKey[] = ['featured', 'price-asc', 'price-desc'];

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

// 筛选行：label + chips（带数量）；chips 独立容器，换行与首行 chip 对齐而非 label
// 轻量无边框设计：chips 白底描边浮在页面米色底上，选中为棕色实心
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
    // 移动端 label 独占一行（chips 空间太窄），sm 起恢复左右排布
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-2">
      <span className="text-xs font-semibold text-[#999] uppercase tracking-wider sm:w-24 flex-shrink-0 sm:pt-1.5">{label}</span>
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {options.map((o) => {
          const active = selected.includes(o.key);
          return (
            <button
              key={o.key}
              onClick={() => onToggle(o.key)}
              aria-pressed={active}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                active
                  ? 'text-white border border-transparent'
                  : 'bg-white text-[#555] border border-[#E8E2DA] hover:border-[#8B5A2B] hover:text-[#8B5A2B]'
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
  // mounted 标志：防止静态 HTML 在 JS 执行前闪现
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(() => readUrlParam('cat'));
  const [activeSub, setActiveSub] = useState(() => readUrlParam('sub'));
  // 搜索词只从 URL 读取（页面搜索框已移除，入口在 Header 搜索）
  const [searchQuery] = useState(() => readUrlParam('q'));
  const [sortBy, setSortBy] = useState<SortKey>(() => {
    const s = readUrlParam('sort') as SortKey;
    return SORT_KEYS.includes(s) ? s : 'featured';
  });
  const [materialSel, setMaterialSel] = useState<string[]>(() => readUrlList('material'));
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

  // 裸 /products（无 cat、无搜索词）已取消：重定向到分类汇总页
  useEffect(() => {
    if (mounted && !activeCategory && !isSearching) {
      window.location.replace(resolveUrl('/categories'));
    }
  }, [mounted, activeCategory, isSearching]);

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

  // 当前类目 + 二级分类下的产品（材质筛选按此范围聚合，筛选只在类目内生效）
  const scopeProducts = useMemo(() => {
    let list = categoryProducts;
    if (activeSub) {
      list = list.filter((p) => p.subcategory === activeSub);
    }
    return list;
  }, [categoryProducts, activeSub]);

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

  // 统一写 URL（分类 + 二级分类 + 筛选 + 排序，可分享）
  const writeUrl = (b: FilterBundle) => {
    const url = new URL(window.location.href);
    const set = (k: string, v: string) => (v ? url.searchParams.set(k, v) : url.searchParams.delete(k));
    set('cat', b.cat);
    set('sub', b.sub);
    set('material', b.material.join(','));
    set('sort', b.sort === 'featured' ? '' : b.sort);
    window.history.replaceState(null, '', url.toString());
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
    setVisibleCount(PAGE_SIZE);
    writeUrl(b);
  };

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
  // （启用材质筛选时，没有材质数据的产品不显示）
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

  const gridCls = 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6';

  const subDef = activeSub ? getSubcategoryDef(activeSub) : undefined;
  const pageTitle = isSearching
    ? 'Search Results'
    : subDef?.label || categoryDef?.label || 'Products';
  const pageSubtitle = isSearching
    ? ''
    : subDef
      ? [categoryDef?.label, categoryDef?.intro].filter(Boolean).join(' — ')
      : categoryDef?.intro || '';

  return (
    <div className="px-6 lg:px-10 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 lg:mb-14">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#333] mb-3">{pageTitle}</h1>
          {pageSubtitle && <p className="text-[#555]">{pageSubtitle}</p>}
        </div>

        {/* 筛选区（桌面端 lg+）：只在类目视图显示（搜索视图不筛选），常态展开；Collections = 二级分类单选。无边框轻量排布，行间细分隔线 */}
        {mounted && activeCategory && !isSearching && (collectionOptions.length > 0 || materialOptions.length > 0) && (
          <div className="hidden lg:block mb-8 space-y-3">
            {collectionOptions.length > 0 && (
              <>
                <FilterRow label="Collections" options={collectionOptions} selected={activeSub ? [activeSub] : []} onToggle={toggleSub} />
                {materialOptions.length > 0 && <div className="border-b border-[#E8E2DA]/70" />}
              </>
            )}
            <FilterRow label="Material" options={materialOptions} selected={materialSel} onToggle={(v) => setFilter({ material: toggleInList(materialSel, v) })} />
            {activeFilterCount > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-[#8B5A2B] hover:underline underline-offset-4"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        )}

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
        ) : (
          /* 类目视图 / 搜索视图：完整网格 + 排序 + 分批加载 */
          <>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <p className="text-sm text-[#777]">
                {isSearching
                  ? `${filtered.length} result${filtered.length === 1 ? '' : 's'} for "${searchQuery.trim()}"`
                  : `${filtered.length} product${filtered.length === 1 ? '' : 's'}`}
              </p>
              {/* 移动端：筛选+排序抽屉入口（带激活数量角标） */}
              <button
                onClick={() => setFilterOpen(true)}
                className="lg:hidden relative h-10 px-4 rounded-lg border-2 border-[#E8E2DA] bg-white text-sm font-semibold text-[#333] inline-flex items-center gap-2"
                aria-label="Open filters"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Filter &amp; Sort
                {activeFilterCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full text-white text-[11px] font-bold flex items-center justify-center"
                    style={{ backgroundColor: '#8B5A2B' }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <select
                value={sortBy}
                onChange={(e) => setFilter({ sort: e.target.value as SortKey })}
                className="hidden lg:block h-10 px-3 rounded-lg border-2 border-[#E8E2DA] bg-white text-sm text-[#333] outline-none focus:border-[#8B5A2B]"
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

      {/* 移动端筛选抽屉（右侧滑出）：Sort + Collections（单选）+ Material（多选），底部 Show N products */}
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

          {/* Collections（二级分类，单选） */}
          {collectionOptions.length > 0 && (
            <>
              <p className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-2 pt-4 border-t border-[#E8E2DA]/70">Collections</p>
              <div className="mb-5">
                {collectionOptions.map((o) => {
                  const active = activeSub === o.key;
                  return (
                    <button key={o.key} onClick={() => toggleSub(o.key)} aria-pressed={active} className="flex items-center gap-3 w-full py-2.5 text-left">
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${active ? 'border-[#8B5A2B]' : 'border-[#D8D2C8]'}`}>
                        {active && <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#8B5A2B' }} />}
                      </span>
                      <span className={`text-sm ${active ? 'font-semibold text-[#333]' : 'text-[#555]'}`}>{o.label} ({o.count})</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Material（多选） */}
          {materialOptions.length > 0 && (
            <>
              <p className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-2 pt-4 border-t border-[#E8E2DA]/70">Material</p>
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
                      <span className={`text-sm ${active ? 'font-semibold text-[#333]' : 'text-[#555]'}`}>{o.label} ({o.count})</span>
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
            Show {filtered.length} Product{filtered.length === 1 ? '' : 's'}
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
