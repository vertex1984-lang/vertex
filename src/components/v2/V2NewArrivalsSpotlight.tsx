import Reveal from '@/components/Reveal';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { productCategoryTag } from '@/data/subcategories';
import { shortTitle, formatPrice, spotlightImage } from '@/components/v2/card-utils';
import type { MakimooProduct } from '@/data/products';

interface V2NewArrivalsSpotlightProps {
  products: MakimooProduct[];
}

/**
 * New Arrivals 左大卡 + 右列表（Featured 汇总页专用，区别于首页横向拖拽条 V2NewArrivals）：
 * 桌面端 5:7 两列——左侧 1 张 4:5 竖版焦点大卡（图上渐变 + 文字 + New 角标），
 * 右侧 4 张横版小卡（图左文右）纵向堆叠、与左卡总高对齐；移动端纵向堆叠。
 * 数据由页面传入（getNewArrivalProducts()，取前 5 个）。
 */
export default function V2NewArrivalsSpotlight({ products }: V2NewArrivalsSpotlightProps) {
  if (products.length === 0) return null;

  const spotlight = products[0];
  const list = products.slice(1, 5);
  const image = spotlightImage(spotlight);
  const displayPrice = spotlight.shopifyPrice || spotlight.priceRange.minVariantPrice.amount;
  const displayCurrency =
    spotlight.shopifyCurrencyCode || spotlight.priceRange.minVariantPrice.currencyCode;

  return (
    <section className="bg-off-white py-16 lg:py-24">
      {/* 标题行：与 Featured Products 头部同款 */}
      <Reveal>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-end justify-between gap-6 mb-10 lg:mb-12">
          <div>
            <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-3">
              Just Landed
            </p>
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-charcoal mb-4">
              New Arrivals
            </h2>
            <p className="text-base text-charcoal-light max-w-xl">
              Fresh textures and easy-living essentials, newly added to the collection.
            </p>
          </div>
          <a
            href={v2url('/new-arrivals/')}
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brand tracking-wide hover:underline underline-offset-4 flex-shrink-0"
          >
            View All
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </Reveal>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-5 lg:gap-8 lg:items-stretch">
          {/* 左：4:5 竖版焦点大卡 */}
          <Reveal className="lg:h-full">
            <a
              href={v2url(`/products/${spotlight.handle}/`)}
              className="group relative block w-full h-full aspect-[4/5] lg:aspect-auto overflow-hidden rounded-lg bg-warm-gray"
            >
              {image && (
                <img
                  src={resolveUrl(image.url)}
                  alt={image.altText || spotlight.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
              <span className="absolute top-5 right-5 px-2.5 py-1 rounded-full bg-cream text-brand text-[10px] font-semibold tracking-widest uppercase shadow-sm">
                New
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-cream/70 mb-1.5">
                  {productCategoryTag(spotlight)}
                </p>
                <h3 className="text-xl lg:text-2xl font-bold text-cream leading-snug mb-2 line-clamp-2">
                  {shortTitle(spotlight.title)}
                </h3>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg lg:text-xl font-semibold text-cream">
                    {formatPrice(displayPrice, displayCurrency)}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase text-cream/70 transition-colors group-hover:text-cream">
                    Shop Now
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          </Reveal>

          {/* 右：横版小卡（图左文右）纵向堆叠，与左卡总高对齐 */}
          <div className="flex flex-col gap-5 lg:gap-6 lg:h-full">
            {list.map((product, i) => {
              const thumb = spotlightImage(product);
              const price = product.shopifyPrice || product.priceRange.minVariantPrice.amount;
              const currency =
                product.shopifyCurrencyCode || product.priceRange.minVariantPrice.currencyCode;
              return (
                <Reveal key={product.id} delay={(i + 1) * 100} className="lg:flex-1">
                  <a
                    href={v2url(`/products/${product.handle}/`)}
                    className="group flex items-center gap-4 lg:gap-6 h-full bg-white rounded-lg border border-warm-gray/60 p-3 lg:p-4 transition hover:border-brand/40 hover:shadow-md"
                  >
                    <div className="w-24 lg:w-32 aspect-square flex-shrink-0 overflow-hidden rounded-md bg-warm-gray">
                      {thumb && (
                        <img
                          src={resolveUrl(thumb.url)}
                          alt={thumb.altText || product.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] lg:text-xs font-semibold uppercase tracking-wider text-brand mb-1">
                        {productCategoryTag(product)}
                      </p>
                      <h3 className="text-sm lg:text-base font-bold text-charcoal leading-snug mb-1.5 line-clamp-2">
                        {shortTitle(product.title)}
                      </h3>
                      <p className="text-sm lg:text-base font-semibold text-charcoal">
                        {formatPrice(price, currency)}
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase text-brand flex-shrink-0 pr-2">
                      Shop Now
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
