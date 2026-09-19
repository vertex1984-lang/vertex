import { resolveUrl, shopifyImageUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { productCategoryTag } from '@/data/subcategories';
import type { MakimooProduct } from '@/data/products';

/** 卡片实际渲染所需的最小字段：server 端选好产品后只传这些字段，避免把整个目录打进 client bundle。
 *  tagLabel 为可选附加字段：设置后类目标签位显示该值（Shop by Color 传场景名、Shop by Scene 传一级类目），
 *  否则回退到 productCategoryTag（二级类目 shortLabel 优先于 productType） */
export type V2CardProduct = Pick<
  MakimooProduct,
  | 'id'
  | 'title'
  | 'handle'
  | 'productType'
  | 'subcategory'
  | 'featuredImage'
  | 'shopifyImages'
  | 'shopifyPrice'
  | 'shopifyCurrencyCode'
  | 'images'
  | 'priceRange'
> & { tagLabel?: string };

interface V2ProductCardProps {
  product: V2CardProduct;
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

// Parachute 风格：大图 aspect-square + 分类 eyebrow + 产品名 + 价格，无卡片边框阴影
export default function V2ProductCard({ product }: V2ProductCardProps) {
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
      </div>
      <div className="pt-3.5">
        {/* 类目标签/标题/价格沿用 v1 classic ProductCard 的样式与颜色；带 tagLabel 时优先显示该值。
            badge / N Pack 标签已按用户要求全站移除（2026-09） */}
        <p className="text-xs font-semibold uppercase tracking-wider text-[#8B5A2B] mb-1">
          {product.tagLabel || productCategoryTag(product)}
        </p>
        {/* 标题全端单行截断（truncate + 省略号），字号全端统一 text-xs */}
        <h3 className="relative text-xs font-medium text-[#333] leading-snug truncate">
          {shortTitle(product.title)}
          {/* 标题下划线 hover 渐入（v1 同款） */}
          <span className="absolute bottom-0 left-0 w-0 h-px bg-[#8B5A2B] transition-all duration-300 group-hover:w-full" />
        </h3>
        <p className="mt-1 text-base sm:text-lg font-semibold text-[#8B5A2B]">
          {formatPrice(displayPrice, displayCurrency)}
        </p>
      </div>
    </a>
  );
}
