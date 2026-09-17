import Reveal from '@/components/Reveal';
import V2ProductCard from '@/components/v2/V2ProductCard';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { productCategoryTag } from '@/data/subcategories';
import { shortTitle, formatPrice, spotlightImage } from '@/components/v2/card-utils';
import type { MakimooProduct } from '@/data/products';

interface V2BestSellersBentoProps {
  products: MakimooProduct[];
}

/** 图上文字卡（焦点大卡 / 宽幅卡共用）：渐变遮罩 + 序号 + 角标 + 类目/标题/价格/Shop Now */
function OverlayCard({
  product,
  rank,
  className,
}: {
  product: MakimooProduct;
  rank: number;
  className: string;
}) {
  const image = spotlightImage(product);
  const displayPrice = product.shopifyPrice || product.priceRange.minVariantPrice.amount;
  const displayCurrency =
    product.shopifyCurrencyCode || product.priceRange.minVariantPrice.currencyCode;
  return (
    <a
      href={v2url(`/products/${product.handle}/`)}
      className={`group relative block w-full overflow-hidden rounded-lg bg-warm-gray ${className}`}
    >
      {image && (
        <img
          src={resolveUrl(image.url)}
          alt={image.altText || product.title}
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
        {String(rank).padStart(2, '0')}
      </span>
      <span className="absolute top-5 right-5 px-2.5 py-1 rounded-full bg-cream text-brand text-[10px] font-semibold tracking-widest uppercase shadow-sm">
        Best Seller
      </span>
      {/* 图上底部文字区 */}
      <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-cream/70 mb-1.5">
          {productCategoryTag(product)}
        </p>
        <h3 className="text-xl lg:text-2xl font-bold text-cream leading-snug mb-2 line-clamp-2">
          {shortTitle(product.title)}
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
  );
}

/**
 * Best Sellers 反转 bento（Featured 汇总页专用，区别于首页横向条 V2FeaturedStrip
 * 和 Featured Products 的「左双大卡 + 右 2×2」）：
 * 桌面端 8:5 两列——左侧 2×2 小卡网格（02–05），右侧 1 张纵向通高焦点大卡（01），
 * 底部 1 张横版宽幅卡（06）收尾；移动端全部纵向堆叠（大卡 4:5、宽幅 16:9）。
 * 数据由页面传入（getBestSellerProducts()，取前 6 个）。
 */
export default function V2BestSellersBento({ products }: V2BestSellersBentoProps) {
  if (products.length === 0) return null;

  const spotlight = products[0];
  const grid = products.slice(1, 5);
  const wide = products[5];

  return (
    <section className="py-16 lg:py-24">
      {/* 标题行：与 Featured Products 头部同款 */}
      <Reveal>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-end justify-between gap-6 mb-10 lg:mb-12">
          <div>
            <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-3">
              Customer Favorites
            </p>
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-charcoal mb-4">
              Best Sellers
            </h2>
            <p className="text-base text-charcoal-light max-w-xl">
              The pieces our customers keep coming back for.
            </p>
          </div>
          <a
            href={v2url('/best-sellers/')}
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
        <div className="grid grid-cols-1 lg:grid-cols-[8fr_5fr] gap-5 lg:gap-6 lg:items-stretch">
          {/* 左列：2×2 小卡网格（02–05），总高与右侧通高大卡自然对齐 */}
          <div className="grid grid-cols-2 gap-5 lg:gap-6">
            {grid.map((product, i) => (
              <Reveal key={product.id} delay={(i + 1) * 100} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -top-2 -left-1 z-10 text-2xl font-extrabold leading-none text-brand/25 select-none pointer-events-none"
                >
                  {String(i + 2).padStart(2, '0')}
                </span>
                <V2ProductCard product={product} badge="Best Seller" />
              </Reveal>
            ))}
          </div>

          {/* 右列：纵向通高焦点大卡（01），移动端 4:5 */}
          <Reveal className="lg:h-full">
            <OverlayCard product={spotlight} rank={1} className="aspect-[4/5] lg:aspect-auto lg:h-full" />
          </Reveal>
        </div>

        {/* 底部横版宽幅卡（06）收尾 */}
        {wide && (
          <Reveal delay={200}>
            <OverlayCard product={wide} rank={6} className="mt-5 lg:mt-6 aspect-[16/9] lg:aspect-[21/9]" />
          </Reveal>
        )}
      </div>
    </section>
  );
}
