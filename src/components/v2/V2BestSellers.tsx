import Reveal from '@/components/Reveal';
import V2ProductCard from '@/components/v2/V2ProductCard';
import { v2url } from '@/lib/v2paths';
import type { MakimooProduct } from '@/data/products';

interface V2BestSellersProps {
  products: MakimooProduct[];
}

export default function V2BestSellers({ products }: V2BestSellersProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <Reveal>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-end justify-between gap-6 mb-10 lg:mb-12">
          <div>
            <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-3">
              Customer Favorites
            </p>
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-charcoal">
              Best Sellers
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

      {/* 横向滚动：移动端卡片大、桌面端约 4 张可视；原生触摸滚动 + snap，隐藏滚动条 */}
      <Reveal delay={120}>
        <div className="max-w-[1400px] mx-auto pl-6 lg:px-10">
          <div className="flex gap-5 lg:gap-6 overflow-x-auto snap-x snap-mandatory pb-2 pr-6 lg:pr-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[68vw] sm:w-[42vw] lg:w-[calc(25%-18px)] flex-shrink-0 snap-start"
              >
                <V2ProductCard product={product} badge="Best Seller" />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
