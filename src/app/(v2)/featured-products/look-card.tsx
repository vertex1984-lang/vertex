import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { shortTitle, formatPrice, spotlightImage } from '@/components/v2/V2OverlayCard';
import { TaggedProduct } from './tagged';

/** 产品卡：图 + 标签行（色系色点 + 场景 pill）+ 标题 + 价格 */
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
      {/* 标签行：唯一色系色点 + 唯一场景 pill */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {product.colorTag && (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-charcoal-light">
            <span
              className="w-3 h-3 rounded-full border border-charcoal/20 flex-shrink-0"
              style={{ backgroundColor: product.colorTag.hex }}
            />
            {product.colorTag.label}
          </span>
        )}
        <span className="px-2 py-0.5 rounded-full border border-brand/40 text-brand text-[10px] font-semibold uppercase tracking-wider">
          {product.sceneTag.label}
        </span>
      </div>
      <h3 className="mt-2 text-sm font-bold text-charcoal leading-snug line-clamp-2 group-hover:text-brand transition-colors">
        {shortTitle(product.title)}
      </h3>
      <p className="mt-1 text-sm font-semibold text-charcoal">{formatPrice(price, currency)}</p>
    </a>
  );
}
