import { resolveUrl, shopifyImageUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { productCategoryTag } from '@/data/subcategories';
import type { MakimooProduct } from '@/data/products';

/**
 * 大图占屏式产品卡（图上渐变遮罩 + 文字）：三个精选独立页
 * （/featured-products、/best-sellers、/new-arrivals）与 Featured 汇总页共用。
 * 尺寸（aspect / 高度）由调用方通过 className 给定。
 */

/** 简短展示名：去掉品牌前缀和括号内的颜色/规格说明（与 V2ProductCard 同一规则） */
export function shortTitle(title: string): string {
  return title
    .replace(/^Makimoo\s+/i, '')
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatPrice(amount: string, currency: string): string {
  const value = parseFloat(amount);
  if (Number.isNaN(value)) return '';
  const symbol = currency === 'USD' ? '$' : `${currency} `;
  return `${symbol}${value.toFixed(2)}`;
}

/** 焦点图优先级与 V2ProductCard 一致：featuredImage（场景图）> Shopify CDN 图 > 本地图 */
export function spotlightImage(product: MakimooProduct) {
  if (product.featuredImage) return { url: product.featuredImage, altText: product.title };
  if (product.shopifyImages && product.shopifyImages.length > 0)
    return { url: shopifyImageUrl(product.shopifyImages[0], 1200), altText: product.title };
  return product.images[0];
}

interface V2OverlayCardProps {
  product: MakimooProduct;
  /** 超大半透明序号（可选，从 1 起） */
  rank?: number;
  /** 右上角标文案（可选，如 "Best Seller" / "New"） */
  badge?: string;
  /** 尺寸类名，如 "aspect-[4/5]" / "h-full" */
  className?: string;
}

export default function V2OverlayCard({ product, rank, badge, className = '' }: V2OverlayCardProps) {
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
      {rank !== undefined && (
        <span
          aria-hidden="true"
          className="absolute top-4 left-5 text-6xl lg:text-7xl font-extrabold leading-none text-cream/40 select-none"
        >
          {String(rank).padStart(2, '0')}
        </span>
      )}
      {badge && (
        <span className="absolute top-5 right-5 px-2.5 py-1 rounded-full bg-cream text-brand text-[10px] font-semibold tracking-widest uppercase shadow-sm">
          {badge}
        </span>
      )}
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
