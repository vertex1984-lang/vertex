'use client';

import { useState, useEffect } from 'react';
import V2ProductCard from '@/components/v2/V2ProductCard';
import DragScroll from '@/components/v2/DragScroll';
import { getRecentlyViewed } from '@/lib/recently-viewed';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';

interface V2RecentlyViewedProps {
  /** 当前产品 handle，展示时排除自身 */
  currentHandle?: string;
}

// RecentlyViewed 的 V2 包装版：逻辑不变（localStorage 读取 + 排除自身 + 取前 8 个），
// 卡片换成 V2ProductCard（链接走 v2url）。
// 版式（2026-09-29 用户定）：与 PDP "You May Also Like" 完全同款——80% 宽容器、同字号标题、
// DragScroll 拖拽横滑、卡片同宽（桌面约 4.5 张可见，右缘露半张暗示可滑）
export default function V2RecentlyViewed({ currentHandle }: V2RecentlyViewedProps) {
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
    <section className="bg-off-white">
      <div className="mx-auto max-w-[1520px] lg:w-[80%] lg:max-w-none px-6 lg:px-10 pb-14 lg:pb-20">
        <div className="mb-6 lg:mb-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2">Your Browsing</p>
          <h2 className="text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal">Recently Viewed</h2>
        </div>
        {/* 横滑：触摸原生滚动 + 桌面鼠标拖拽（与 You May Also Like 同款），snap 吸附、隐藏滚动条 */}
        <DragScroll className="flex gap-4 lg:gap-5 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {products.map((product) => (
            <div key={product.id} className="w-[38vw] sm:w-[30vw] lg:w-[calc((100%-5rem)/4.5)] flex-shrink-0 snap-start">
              <V2ProductCard product={product} />
            </div>
          ))}
        </DragScroll>
      </div>
    </section>
  );
}
