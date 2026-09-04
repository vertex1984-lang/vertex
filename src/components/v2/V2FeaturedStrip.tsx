'use client';

import { useRef } from 'react';
import Reveal from '@/components/Reveal';
import V2ProductCard from '@/components/v2/V2ProductCard';
import { v2url } from '@/lib/v2paths';
import type { MakimooProduct } from '@/data/products';

interface V2FeaturedStripProps {
  products: MakimooProduct[];
}

/**
 * V2 首页 Featured Products 横向条（Parachute Best Sellers 风格大卡）
 * 标题区与滚动容器全宽贴边（px-6 / lg:px-10），右侧无内距，末卡直接打出屏幕右缘。
 * 桌面端提供左右翻页箭头（隐藏滚动条后桌面用户没有滑动入口，这是"滑不动"的主要原因）。
 * 数据由页面组装：FEATURED_ASINS 优先，不足 15 用 Best Sellers 逻辑补足。
 */
export default function V2FeaturedStrip({ products }: V2FeaturedStripProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const scrollByPage = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  const arrowCls =
    'hidden lg:flex absolute top-[38%] -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border border-warm-gray shadow-md items-center justify-center text-charcoal transition hover:bg-brand hover:text-cream hover:border-brand';

  return (
    <section className="bg-cream py-16 lg:py-24">
      <Reveal>
        <div className="px-6 lg:px-10 flex items-end justify-between gap-6 mb-10 lg:mb-12">
          <div>
            <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-3">
              Hand-Picked
            </p>
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-charcoal">
              Featured Products
            </h2>
          </div>
          <a
            href={v2url('/products/')}
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brand tracking-wide hover:underline underline-offset-4 flex-shrink-0"
          >
            Shop All
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </Reveal>

      {/* 横向滚动条：左侧 pl-6/lg:pl-10 全宽贴边，右侧无内距、末卡 bleed 到屏幕边缘 */}
      <Reveal delay={120}>
        <div
          className="relative w-full pl-6 lg:pl-10"
        >
          <div
            ref={trackRef}
            className="flex gap-5 lg:gap-6 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[48vw] sm:w-[40vw] lg:w-[min(24vw,420px)] flex-shrink-0 snap-start"
              >
                <V2ProductCard product={product} badge="Featured" />
              </div>
            ))}
          </div>

          {/* 桌面翻页箭头（移动端触摸滑动即可） */}
          <button
            onClick={() => scrollByPage(-1)}
            className={`${arrowCls} left-3 lg:left-4`}
            aria-label="Scroll products left"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scrollByPage(1)}
            className={`${arrowCls} right-4 lg:right-6`}
            aria-label="Scroll products right"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </Reveal>

      {/* 卡片条下方居中 Shop All 描边按钮（标题区右上角的 Shop All → 链接保留） */}
      <Reveal delay={200}>
        <div className="mt-10 lg:mt-12 text-center">
          <a
            href={v2url('/products/')}
            className="inline-block px-9 py-3.5 rounded-full border-2 border-brand text-brand text-sm font-semibold tracking-wide transition hover:bg-brand hover:text-cream"
          >
            Shop All
          </a>
        </div>
      </Reveal>
    </section>
  );
}
