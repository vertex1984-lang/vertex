import Reveal from '@/components/Reveal';
import V2ProductCard from '@/components/v2/V2ProductCard';
import { resolveUrl, shopifyImageUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { productCategoryTag } from '@/data/subcategories';
import type { MakimooProduct } from '@/data/products';

interface V2FeaturedProductsProps {
  products: MakimooProduct[];
}

/** 简短展示名：去掉品牌前缀和括号内的颜色/规格说明（与 V2ProductCard 同一规则） */
function shortTitle(title: string): string {
  return title
    .replace(/^Makimoo\s+/i, '')
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatPrice(amount: string, currency: string): string {
  const value = parseFloat(amount);
  if (Number.isNaN(value)) return '';
  const symbol = currency === 'USD' ? '$' : `${currency} `;
  return `${symbol}${value.toFixed(2)}`;
}

/** 焦点图优先级与 V2ProductCard 一致：featuredImage（场景图）> Shopify CDN 图 > 本地图 */
function spotlightImage(product: MakimooProduct) {
  if (product.featuredImage) return { url: product.featuredImage, altText: product.title };
  if (product.shopifyImages && product.shopifyImages.length > 0)
    return { url: shopifyImageUrl(product.shopifyImages[0], 1200), altText: product.title };
  return product.images[0];
}

/**
 * V2 首页 Featured Products 区：编辑画报式不对称网格（bento），
 * 与 Best Sellers / New Arrivals 的横向滚动条形成展示对比。
 * 左侧大幅焦点卡（1 号产品，竖图满高，图上渐变遮罩 + 类目/标题/价格/Shop Now + 超大序号 01），
 * 右侧 2×2 小卡网格（02–05，V2ProductCard）；移动端焦点卡置顶、小卡两列。
 * 数据由页面传入（FEATURED_ASINS，取前 5 个）。
 */
export default function V2FeaturedProducts({ products }: V2FeaturedProductsProps) {
  if (products.length === 0) return null;

  const spotlight = products[0];
  const rest = products.slice(1, 5);
  const image = spotlightImage(spotlight);
  const displayPrice = spotlight.shopifyPrice || spotlight.priceRange.minVariantPrice.amount;
  const displayCurrency =
    spotlight.shopifyCurrencyCode || spotlight.priceRange.minVariantPrice.currencyCode;

  return (
    <section className="pt-4 lg:pt-6 pb-16 lg:pb-24">
      {/* 标题行：左侧 eyebrow + 标题 + 文案，右侧 View All 链接（与 Best Sellers 头部呼应） */}
      <Reveal>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-end justify-between gap-6 mb-10 lg:mb-12">
          <div>
            <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-3">
              Editor&apos;s Picks
            </p>
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-charcoal mb-4">
              Featured Products
            </h2>
            <p className="text-base text-charcoal-light max-w-xl">
              One spotlight, four companions — the pieces our editors would bring home first.
            </p>
          </div>
          <a
            href={v2url('/products/')}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 lg:items-stretch">
          {/* 左侧焦点大卡：竖图满高，图上文字 + 超大序号 */}
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
              {/* 底部渐变遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
              {/* 超大半透明序号 */}
              <span
                aria-hidden="true"
                className="absolute top-4 left-5 text-6xl lg:text-7xl font-extrabold leading-none text-cream/40 select-none"
              >
                01
              </span>
              <span className="absolute top-5 right-5 px-2.5 py-1 rounded-full bg-cream text-brand text-[10px] font-semibold tracking-widest uppercase shadow-sm">
                Featured
              </span>
              {/* 图上底部文字区 */}
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

          {/* 右侧 2×2 小卡网格，错峰入场 */}
          <div className="grid grid-cols-2 gap-5 lg:gap-6">
            {rest.map((product, i) => (
              <Reveal key={product.id} delay={(i + 1) * 100} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -top-2 -left-1 z-10 text-2xl font-extrabold leading-none text-brand/25 select-none pointer-events-none"
                >
                  {String(i + 2).padStart(2, '0')}
                </span>
                <V2ProductCard product={product} badge="Featured" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
