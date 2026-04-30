'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { MakimooProduct, PRODUCTS_DATA, getProductsByCategory, searchProducts, enrichProductsWithShopifyData } from '@/data/products';

const categories = [
  { label: 'All', value: '' },
  { label: 'Dining', value: 'dining' },
  { label: 'Cushions', value: 'cushions' },
  { label: 'Pillows', value: 'pillows' },
  { label: 'Travel', value: 'travel' },
  { label: 'Home Fragrance', value: 'home-fragrance' },
  { label: 'Others', value: 'others' },
];

export default function ProductsPage() {
  // mounted 标志：防止静态 HTML（预渲染 All 产品）在 JS 执行前闪现
  const [mounted, setMounted] = useState(false);

  // 惰性初始化：客户端首次渲染时同步读取 URL 中的 cat 参数
  const [activeCategory, setActiveCategory] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('cat') || '';
    }
    return '';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filtered, setFiltered] = useState<MakimooProduct[]>(
    () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const cat = params.get('cat') || '';
        return cat ? getProductsByCategory(cat) : enrichProductsWithShopifyData(PRODUCTS_DATA);
      }
      return enrichProductsWithShopifyData(PRODUCTS_DATA);
    }
  );

  // 首次挂载后立即标记为已挂载，此时 state 已从 URL 正确初始化
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let result = enrichProductsWithShopifyData(PRODUCTS_DATA);
    if (activeCategory) {
      result = getProductsByCategory(activeCategory);
    }
    if (searchQuery.trim()) {
      result = searchProducts(searchQuery).filter(p =>
        activeCategory ? getProductsByCategory(activeCategory).includes(p) : true
      );
    }
    setFiltered(result);
  }, [activeCategory, searchQuery]);

  return (
    <div className="px-6 lg:px-10 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#333] mb-3">All Products</h1>
          <p className="text-[#555]">Browse our complete collection of comfort essentials.</p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pl-11 rounded-lg border-2 border-[#E8E2DA] focus:border-[#8B5A2B] outline-none bg-white text-sm"
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

        {/* Category Filter - 始终显示，但在 JS 未加载时不标记当前分类（由 CSS 控制） */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                mounted && activeCategory === cat.value
                  ? 'text-white'
                  : 'bg-white text-[#333] hover:bg-[#E8E2DA]'
              }`}
              style={mounted && activeCategory === cat.value ? { backgroundColor: '#8B5A2B' } : {}}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid - JS 未加载前隐藏，避免闪现 All 产品 */}
        {mounted ? (
          filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[#555] text-lg">No products found.</p>
              <button
                onClick={() => {
                  setActiveCategory('');
                  setSearchQuery('');
                }}
                className="mt-4 px-5 py-2 rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: '#8B5A2B' }}
              >
                Clear Filters
              </button>
            </div>
          )
        ) : (
          /* JS 加载前的占位：显示骨架屏，避免布局跳动 */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-56 lg:h-64 bg-[#E8E2DA]" />
                <div className="p-4">
                  <div className="h-3 bg-[#E8E2DA] rounded w-16 mb-2" />
                  <div className="h-4 bg-[#E8E2DA] rounded w-full mb-2" />
                  <div className="h-4 bg-[#E8E2DA] rounded w-3/4 mb-3" />
                  <div className="h-5 bg-[#E8E2DA] rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
