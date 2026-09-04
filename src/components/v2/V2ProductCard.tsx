import { resolveUrl, shopifyImageUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { productCategoryTag } from '@/data/subcategories';
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

/** 从标题提取件数："Set of 4" / "4 Pack" / "2-Pack" / "Pack of 2" / "4-Piece" → 4/4/2/2/4（与 classic ProductCard 同一规则） */
function getPackCount(title: string): number | null {
  const m = title.match(/set of (\d+)|(\d+)[\s-]?pack|pack of (\d+)|(\d+)[\s-]?piece/i);
  if (!m) return null;
  const n = parseInt(m[1] || m[2] || m[3] || m[4], 10);
  return n > 1 ? n : null;
}

function formatPrice(amount: string, currency: string): string {
  const value = parseFloat(amount);
  if (Number.isNaN(value)) return '';
  const symbol = currency === 'USD' ? '$' : `${currency} `;
  return `${symbol}${value.toFixed(2)}`;
}

// Parachute 风格：大图 aspect-square + 分类 eyebrow + 产品名 + 价格，无卡片边框阴影
export default function V2ProductCard({ product, badge }: V2ProductCardProps) {
  // 优先级与 classic ProductCard 一致：featuredImage（场景图）> Shopify CDN 图 > 本地图
  const image = product.featuredImage
    ? { url: product.featuredImage, altText: product.title }
    : product.shopifyImages && product.shopifyImages.length > 0
      ? { url: shopifyImageUrl(product.shopifyImages[0], 600), altText: product.title }
      : product.images[0];
  // hover 切换的第二顺位图：Shopify CDN 第二张 > 本地第二张（与主图同源则不渲染）
  const secondImage =
    product.shopifyImages && product.shopifyImages.length > 1
      ? { url: shopifyImageUrl(product.shopifyImages[1], 600), altText: product.title }
      : product.images.length > 1
        ? product.images[1]
        : undefined;
  const hoverImage =
    image && secondImage && resolveUrl(secondImage.url) !== resolveUrl(image.url)
      ? secondImage
      : undefined;
  const displayPrice = product.shopifyPrice || product.priceRange.minVariantPrice.amount;
  const displayCurrency = product.shopifyCurrencyCode || product.priceRange.minVariantPrice.currencyCode;
  const packCount = getPackCount(product.title);

  return (
    <a href={v2url(`/products/${product.handle}/`)} className="group block h-full">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-warm-gray">
        {/* 双图叠放：hover 时第二张淡入；整体保留缓慢放大 */}
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
          {image && (
            <img
              src={resolveUrl(image.url)}
              alt={image.altText || product.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {hoverImage && (
            <img
              src={resolveUrl(hoverImage.url)}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
        </div>
        {(badge || packCount) && (
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {badge && (
              <span className="px-2.5 py-1 rounded-full bg-cream text-brand text-[10px] font-semibold tracking-widest uppercase shadow-sm">
                {badge}
              </span>
            )}
            {packCount && (
              <span className="px-2.5 py-1 rounded-full bg-brand text-cream text-[10px] font-semibold tracking-widest uppercase shadow-sm">
                {packCount} Pack
              </span>
            )}
          </div>
        )}
      </div>
      <div className="pt-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-light mb-1">
          {productCategoryTag(product)}
        </p>
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
