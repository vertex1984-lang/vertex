import Reveal from '@/components/Reveal';
import V2ProductCard from '@/components/v2/V2ProductCard';
import { v2url } from '@/lib/v2paths';
import type { MakimooProduct } from '@/data/products';

interface V2FeaturedStripProps {
  products: MakimooProduct[];
}

/**
 * V2 首页 Featured Products 横向条（替换原第一个 StorySplit 位置）
 * 标题区限宽对齐站点网格；滚动容器打满屏宽，首卡与标题区左缘对齐。
 * 数据由页面组装：FEATURED_ASINS 优先，不足 15 用 Best Sellers 逻辑补足。
 */
export default function V2FeaturedStrip({ products }: V2FeaturedStripProps) {
  if (products.length === 0) return null;

  return (
    <section className="bg-cream py-16 lg:py-24">
      <Reveal>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-end justify-between gap-6 mb-10 lg:mb-12">
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

      {/* 横向滚动条 bleed 全屏宽：左 padding 对齐 1400px 限宽线，右侧可滚出屏幕边缘 */}
      <Reveal delay={120}>
        <div className="w-full pl-6 lg:pl-[max(2.5rem,calc((100vw-1400px)/2+2.5rem))]">
          <div className="flex gap-5 lg:gap-6 overflow-x-auto snap-x snap-mandatory pb-2 pr-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[70vw] sm:w-[40vw] lg:w-[calc(20%-16px)] flex-shrink-0 snap-start"
              >
                <V2ProductCard product={product} badge="Featured" />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
