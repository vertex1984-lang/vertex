import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import ProductCard from '@/components/ProductCard';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { getBestSellersByCategory } from '@/data/featured-sections';

export const metadata: Metadata = {
  title: 'Best Sellers | Makimoo',
  description:
    'Shop Makimoo best sellers by category — the comfort essentials our customers love most, in bedding, pillows, cushions, towels, mats and blankets.',
};

const sections = getBestSellersByCategory();

/**
 * Best Sellers 独立页：按类目分区的榜单。
 * 每个类目按权重展示 4 款产品，卡片网格与 /products?cat= 列表页一致（无筛选栏）；
 * 产品选择为权重驱动（sortByWeight 降序 + 标题去重），见 featured-sections.ts。
 */
export default function BestSellersPage() {
  return (
    <>
      {/* 页头：客厅场景背景图 + 深色渐变罩层保证文字可读（pt 补偿 fixed 导航，高度比原设计高约 10%） */}
      <section className="relative text-cream pt-36 lg:pt-44 pb-16 lg:pb-24 overflow-hidden">
        <img
          src={resolveUrl('/images/brand/hero-bg-2.webp')}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/60 to-charcoal/30" />
        <div className="relative px-6 lg:px-10">
          <Reveal>
            <p className="text-xs lg:text-sm font-semibold tracking-[0.3em] uppercase text-cream/70 mb-4">
              Customer Favorites
            </p>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] mb-5">
              Best Sellers
            </h1>
            <p className="text-base text-cream/80 max-w-xl">
              The most-loved picks in every category — ranked by what our customers actually reorder.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 类目榜单：每类 4 款，产品卡网格同 /products?cat= 页，奇偶区交替底色 */}
      {sections.map((sec, i) => (
        <section key={sec.cat} className={`py-8 lg:py-12 ${i % 2 === 1 ? 'bg-off-white' : ''}`}>
          <div className="px-6 lg:px-10">
            <Reveal>
              <div className="flex items-end justify-between gap-6 mb-8 lg:mb-10">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-charcoal mb-2">
                    {sec.label}
                  </h2>
                  <p className="text-sm text-charcoal-light max-w-xl">{sec.intro}</p>
                </div>
                <a
                  href={v2url(`/products?cat=${sec.cat}`)}
                  className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brand tracking-wide hover:underline underline-offset-4 flex-shrink-0"
                >
                  View All {sec.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {sec.products.map((p) => (
                <ProductCard key={p.id} product={p} href={v2url(`/products/${p.handle}/`)} />
              ))}
            </div>
            <a
              href={v2url(`/products?cat=${sec.cat}`)}
              className="sm:hidden mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand tracking-wide"
            >
              View All {sec.label}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </section>
      ))}

      {/* 深色 CTA 带 */}
      <section className="bg-charcoal text-cream py-16 lg:py-20">
        <Reveal>
          <div className="px-6 lg:px-10 text-center">
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Loved by Thousands, Returned by Few
            </h2>
            <p className="text-cream/70 text-base max-w-xl mx-auto mb-8">
              Every best seller ships free over $49 — with 30 days to make sure it earns its place.
            </p>
            <a
              href={v2url('/products/')}
              className="inline-block px-9 py-3.5 rounded-full bg-cream text-charcoal text-sm font-semibold tracking-wide uppercase transition hover:bg-brand hover:text-cream"
            >
              Shop All Products
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
