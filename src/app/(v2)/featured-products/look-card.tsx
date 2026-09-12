import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { shortTitle, formatPrice, spotlightImage } from '@/components/v2/V2OverlayCard';
import { TaggedProduct } from './tagged';

/** 产品卡：图 + 标题 + 价格（2026-09 用户要求：color/scene 聚合页卡片不再打 color/scene 标签） */
export default function LookCard({ product }: { product: TaggedProduct }) {
  const image = spotlightImage(product);
  const whiteBg = product.imageWhiteBg?.[0];
  const price = product.shopifyPrice || product.priceRange.minVariantPrice.amount;
  const currency = product.shopifyCurrencyCode || product.priceRange.minVariantPrice.currencyCode;
  return (
    <a href={v2url(`/products/${product.handle}/`)} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-white border border-warm-gray/60">
        {image && (
          <img
            src={resolveUrl(image.url)}
            alt={image.altText || product.title}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              whiteBg ? 'p-5 sm:p-7' : ''
            }`}
          />
        )}
      </div>
      <h3 className="mt-3 text-sm font-bold text-charcoal leading-snug line-clamp-2 group-hover:text-brand transition-colors">
        {shortTitle(product.title)}
      </h3>
      <p className="mt-1 text-sm font-semibold text-charcoal">{formatPrice(price, currency)}</p>
    </a>
  );
}
