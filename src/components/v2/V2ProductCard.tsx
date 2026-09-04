import { resolveUrl, shopifyImageUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import type { MakimooProduct } from '@/data/products';

interface V2ProductCardProps {
  product: MakimooProduct;
  badge?: string;
}

/** 简短展示名：去掉品牌前缀和括号内的颜色/规格说明 */
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

// Parachute 风格：大图 aspect-square + 小标签 + 产品名 + 价格，无卡片边框阴影
export default function V2ProductCard({ product, badge }: V2ProductCardProps) {
  const image =
    product.shopifyImages && product.shopifyImages.length > 0
      ? { url: shopifyImageUrl(product.shopifyImages[0], 600), altText: product.title }
      : product.images[0];
  const displayPrice = product.shopifyPrice || product.priceRange.minVariantPrice.amount;
  const displayCurrency = product.shopifyCurrencyCode || product.priceRange.minVariantPrice.currencyCode;

  return (
    <a href={v2url(`/products/${product.handle}/`)} className="group block h-full">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-warm-gray">
        {image && (
          <img
            src={resolveUrl(image.url)}
            alt={image.altText || product.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        {badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-cream text-brand text-[10px] font-semibold tracking-widest uppercase shadow-sm">
            {badge}
          </span>
        )}
      </div>
      <div className="pt-3.5">
        <h3 className="text-sm font-semibold text-charcoal leading-snug line-clamp-2 transition-colors group-hover:text-brand">
          {shortTitle(product.title)}
        </h3>
        <p className="mt-1 text-sm text-charcoal-light">
          {formatPrice(displayPrice, displayCurrency)}
        </p>
      </div>
    </a>
  );
}
