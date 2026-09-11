import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import V2ProductCard from '@/components/v2/V2ProductCard';
import V2Newsletter from '@/components/v2/V2Newsletter';
import {
  shortTitle,
  formatPrice,
  spotlightImage,
} from '@/components/v2/V2OverlayCard';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { productCategoryTag } from '@/data/subcategories';
import { getNewArrivalProducts, getFeaturedProducts } from '@/data/featured-sections';

export const metadata: Metadata = {
  title: 'New Arrivals | Makimoo',
  description:
    'Just landed at Makimoo — fresh textures and easy-living essentials, newly added to the collection.',
};

// 类目 → 入口图卡 / 类目参数 映射
const CAT_META: Record<string, { image: string; cat: string }> = {
  Bedding: { image: '/images/collections/bedding.webp', cat: 'bedding' },
  Pillows: { image: '/images/collections/pillows.webp', cat: 'pillows' },
  Cushions: { image: '/images/collections/cushions.webp', cat: 'cushions' },
  Towels: { image: '/images/collections/towels.webp', cat: 'towels' },
  Mats: { image: '/images/collections/mats.webp', cat: 'mats' },
  Blankets: { image: '/images/collections/blanket.webp', cat: 'blankets' },
  Others: { image: '/images/collections/others.webp', cat: 'others' },
};

const newArrivals = getNewArrivalProducts();
const heroImage = newArrivals[0] ? spotlightImage(newArrivals[0]) : null;
// New in Each Category：新品实际覆盖的类目
const newCategories = Array.from(new Set(newArrivals.map((p) => p.productType)))
  .filter((t) => CAT_META[t])
  .map((t) => ({ label: t, ...CAT_META[t] }));
const featuredTeaser = getFeaturedProducts().slice(0, 5);

/**
 * New Arrivals 独立页
 * 1) 100vh 左右分屏 hero（左排版栏 + 右满高大图）；
 * 2) 新品 feed：8 个新品按批次（September Drop）大条目交替排列（图 2/3 宽 + 侧边信息栏）；
 * 3) 关联促销 New in Each Category；4) Newsletter（新品通知）；5) Featured teaser + CTA。
 */
export default function NewArrivalsPage() {
  return (
    <>
      {/* Hero：左右分屏 100vh（左栏 pt-32 补偿 fixed 导航） */}
      <section className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-screen bg-off-white">
        <div className="flex flex-col justify-center px-6 lg:px-16 pt-32 pb-12 lg:py-0">
          <Reveal>
            <p className="text-xs lg:text-sm font-semibold tracking-[0.3em] uppercase text-brand mb-4">
              September 2026 Drop
            </p>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-charcoal leading-[0.95] mb-6">
              Just Landed.
              <br />
              New Arrivals
            </h1>
            <p className="text-base lg:text-lg text-charcoal-light max-w-md mb-8 leading-relaxed">
              Fresh textures and easy-living essentials — the newest pieces in the
              collection, photographed as they landed.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#the-drop"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand text-cream text-sm font-semibold tracking-wide uppercase transition hover:bg-brand-dark"
              >
                Shop the Drop
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M6 13l6 6 6-6" />
                </svg>
              </a>
              <p className="text-sm text-charcoal-light">
                {newArrivals.length} new pieces
              </p>
            </div>
          </Reveal>
        </div>
        <div className="relative min-h-[60vh] lg:min-h-screen overflow-hidden bg-warm-gray">
          {heroImage && (
            <img
              src={resolveUrl(heroImage.url)}
              alt={heroImage.altText || 'New arrival'}
              className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
            />
          )}
        </div>
      </section>

      {/* 新品 feed：大条目交替排列 */}
      <section id="the-drop" className="scroll-mt-32 py-16 lg:py-24">
        <div className="px-6 lg:px-10">
          <Reveal>
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-charcoal mb-3">
              The Drop
            </h2>
            <p className="text-base text-charcoal-light max-w-xl mb-10 lg:mb-16">
              Every new piece below is in stock and ships free over $49.
            </p>
          </Reveal>
          <div className="flex flex-col gap-12 lg:gap-20">
            {newArrivals.map((product, i) => {
              const img = spotlightImage(product);
              const price = product.shopifyPrice || product.priceRange.minVariantPrice.amount;
              const currency =
                product.shopifyCurrencyCode || product.priceRange.minVariantPrice.currencyCode;
              const reversed = i % 2 === 1;
              return (
                <Reveal key={product.id}>
                  <div
                    className={`flex flex-col gap-6 lg:gap-10 lg:items-center ${
                      reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
                    }`}
                  >
                    {/* 图：占 2/3 宽 */}
                    <a
                      href={v2url(`/products/${product.handle}/`)}
                      className="group relative block lg:w-2/3 aspect-[4/3] overflow-hidden rounded-lg bg-warm-gray flex-shrink-0"
                    >
                      {img && (
                        <img
                          src={resolveUrl(img.url)}
                          alt={img.altText || product.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <span className="absolute top-5 left-5 px-2.5 py-1 rounded-full bg-cream text-brand text-[10px] font-semibold tracking-widest uppercase shadow-sm">
                        New
                      </span>
                    </a>
                    {/* 侧边信息栏 */}
                    <div className="lg:flex-1 min-w-0">
                      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-charcoal-light mb-2">
                        September Drop · {String(i + 1).padStart(2, '0')}
                      </p>
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand mb-2">
                        {productCategoryTag(product)}
                      </p>
                      <h3 className="text-xl lg:text-3xl font-bold text-charcoal leading-snug mb-3">
                        {shortTitle(product.title)}
                      </h3>
                      <p className="text-lg lg:text-xl font-semibold text-charcoal mb-5">
                        {formatPrice(price, currency)}
                      </p>
                      <a
                        href={v2url(`/products/${product.handle}/`)}
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-brand text-brand text-sm font-semibold tracking-wide uppercase transition hover:bg-brand hover:text-cream"
                      >
                        Shop Now
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 关联促销①：New in Each Category（按新品实际覆盖的类目生成） */}
      {newCategories.length > 0 && (
        <section className="bg-off-white py-16 lg:py-24">
          <div className="px-6 lg:px-10">
            <Reveal>
              <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-3">
                By Category
              </p>
              <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-charcoal mb-10 lg:mb-14">
                New in Each Category
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
              {newCategories.map((card, i) => (
                <Reveal key={card.label} delay={i * 80}>
                  <a href={v2url(`/products?cat=${card.cat}`)} className="group block">
                    <div className="aspect-square overflow-hidden rounded-lg bg-warm-gray">
                      <img
                        src={resolveUrl(card.image)}
                        alt={card.label}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-charcoal group-hover:text-brand transition-colors">
                      {card.label}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 关联促销②：新品通知订阅 */}
      <V2Newsletter />

      {/* 关联促销③：Featured teaser 横条 */}
      <section className="py-16 lg:py-24">
        <Reveal>
          <div className="px-6 lg:px-10 flex items-end justify-between gap-6 mb-10 lg:mb-12">
            <div>
              <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-3">
                Editor&apos;s Picks
              </p>
              <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-charcoal">
                Featured Products, Next
              </h2>
            </div>
            <a
              href={v2url('/featured-products/')}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brand tracking-wide hover:underline underline-offset-4 flex-shrink-0"
            >
              View Featured Products
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="pl-6 lg:pl-10">
            <div className="flex gap-5 lg:gap-6 overflow-x-auto snap-x snap-mandatory pb-2 pr-6 lg:pr-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {featuredTeaser.map((product) => (
                <div
                  key={product.id}
                  className="w-[68vw] sm:w-[42vw] lg:w-[calc(20%-20px)] flex-shrink-0 snap-start"
                >
                  <V2ProductCard product={product} badge="Featured" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
