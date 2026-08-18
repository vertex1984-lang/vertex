'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { getRecentlyViewed } from '@/lib/recently-viewed';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';

interface RecentlyViewedProps {
  /** 当前产品 handle，展示时排除自身 */
  currentHandle?: string;
}

export default function RecentlyViewed({ currentHandle }: RecentlyViewedProps) {
  // localStorage 仅客户端可读，mount 后再取，避免 SSR 水合不一致
  const [products, setProducts] = useState<MakimooProduct[]>([]);

  useEffect(() => {
    const handles = getRecentlyViewed().filter((h) => h !== currentHandle).slice(0, 8);
    const found = handles
      .map((h) => PRODUCTS_DATA.find((p) => p.handle === h))
      .filter(Boolean) as MakimooProduct[];
    setProducts(enrichProductsWithShopifyData(found));
  }, [currentHandle]);

  if (products.length === 0) return null;

  return (
    <section className="px-6 lg:px-10 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-sm font-semibold tracking-widest uppercase text-brand mb-2">Your Browsing</p>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-charcoal">Recently Viewed</h2>
        </div>
        {/* 横滑：原生触摸滚动 + snap，隐藏滚动条 */}
        <div className="flex gap-4 lg:gap-5 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {products.map((product) => (
            <div key={product.id} className="w-52 sm:w-64 lg:w-72 flex-shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
