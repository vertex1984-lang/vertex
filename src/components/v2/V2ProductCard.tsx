'use client';

import { resolveUrl, shopifyImageUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { COMING_SOON_LABEL, isComingSoonAmount } from '@/lib/currency';
import { productCategoryTag } from '@/data/subcategories';
import { preorderOf } from '@/data/preorder';
import { trackSelectItem, type GaItem } from '@/lib/gtag';
import type { MakimooProduct } from '@/data/products';

/** 卡片实际渲染所需的最小字段：server 端选好产品后只传这些字段，避免把整个目录打进 client bundle。
 *  tagLabel 为可选附加字段：设置后类目标签位显示该值（Shop by Color 传场景名、Shop by Scene 传一级类目），
 *  否则回退到 productCategoryTag（Bedding 显示材质；其他类目二级 shortLabel 优先于 productType）。
 *  familyKey / familyColor（2026-10-20 用户定：全站产品卡统一为家族卡——同族合并一张卡，From 最低价）：
 *  家族合并 key（familyKeyOf 口径：变体组 `${组id}::${颜色}`，无组 = asin 小写）与家族颜色（colorLine 用）；
 *  可选——仅家族卡推荐位（V2Recommended 等，经 toCardProduct 构造）填充，直接传 MakimooProduct 的老调用点不带 */
export type V2CardProduct = Pick<
  MakimooProduct,
  | 'id'
  | 'asin'
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
  | 'rating'
  | 'reviewCount'
  | 'compareAtPrice'
> & { tagLabel?: string; familyKey?: string; familyColor?: string };

interface V2ProductCardProps {
  product: V2CardProduct;
  /** 2026-10-19 用户定：全站产品卡统一 3:4 竖图（object-cover 裁两侧），默认开启；传 false 回退 1:1 方图 */
  tallImage?: boolean;
  /** 2026-10-19 用户定：bedding 页 1:1 图在 3:4 容器中裁剪左:右=2:1（object-position 66.67%） */
  cropBiasRight?: boolean;
  /** 2026-11-26 首发预售进度条（首页预售区专用，可选）：claimed=已售、total=限量总数 */
  scarcity?: { claimed: number; total: number };
  /** 2026-11-26 用户定（首页预售区）：标题/预售信息压到图片下端（渐变罩 + 白字），
      不渲染图下类目/价格块 */
  overlayInfo?: boolean;
  /** 2026-11-27 用户定：预售卡同款多尺寸只出一张卡，标题尾标注全部可售尺寸（如 "Queen/King"） */
  sizesLabel?: string;
}

/** 简短展示名：去掉品牌前缀和括号内的颜色/规格说明；
 *  Bedding 再去掉材质词（与 classic ProductCard 的 displayTitle 同规则——材质已由卡片标签位展示，标题不重复）；
 *  2026-11-27：材质词按完整面料名匹配（Linen Feel / Cotton Feel / Cotton Percale 两词面料整体剥离，
 *  不再留下残词 "Feel"/"Percale"）；keepMaterial=true（压图卡无标签位）时保留面料名 */
function shortTitle(title: string, productType?: string, keepMaterial = false): string {
  let t = title
    .replace(/^Makimoo\s+/i, '')
    .replace(/\s*\(.*?\)\s*/g, ' ');
  if (productType?.toLowerCase() === 'bedding' && !keepMaterial) {
    t = t
      .replace(/^(100%\s+)?(linen feel|cotton feel|cotton percale|microfiber|linen|cotton|polyester|bamboo)\s+/i, '')
      .replace(/\b100%\s+(microfiber|linen|cotton|polyester|bamboo)\s*/gi, '');
  }
  // Towels（mk-towel-lsc 短标题 "Long-Staple Cotton Towel, 30\" x 56\" - Cream"）：
  // 卡标题不写尺寸和颜色（2026-10-16 用户定：尺寸/颜色只在 PDP 内展示）
  if (productType?.toLowerCase() === 'towels') {
    t = t.replace(/,\s*\d+(?:\.\d+)?"\s*x\s*\d+(?:\.\d+)?"\s*-\s*.+$/, '');
  }
  return t.replace(/\s+/g, ' ').trim();
}

function formatPrice(amount: string, currency: string): string {
  const value = parseFloat(amount);
  if (Number.isNaN(value)) return '';
  const symbol = currency === 'USD' ? '$' : `${currency} `;
  return `${symbol}${value.toFixed(2)}`;
}

// Parachute 风格：大图 aspect-square + 分类 eyebrow + 产品名 + 价格，无卡片边框阴影
export default function V2ProductCard({ product, tallImage = true, cropBiasRight = false, scarcity, overlayInfo = false, sizesLabel }: V2ProductCardProps) {
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
  // 压图卡标题（2026-11-27）：保留完整面料名（无标签位展示材质）；
  // 同款多尺寸合并一卡时，尾部单尺寸替换为全部可售尺寸（", Queen" → ", Queen/King"）
  const overlayTitle = (() => {
    const t = shortTitle(product.title, product.productType, true);
    return sizesLabel
      ? t.replace(/,\s*(twin|full|queen|king|cal king)$/i, `, ${sizesLabel}`)
      : t;
  })();
  // 预售商品（2026-11-10 预售系统第一批）：左上角徽章 + 价格下交期行
  const po = preorderOf(product.handle);
  // SALE（批次 1 促销展示层）：划线价 > 现价时显示徽章 + 划线原价
  const showSale =
    !!product.compareAtPrice &&
    (parseFloat(product.compareAtPrice) || 0) > (parseFloat(displayPrice) || 0);

  // GA4: select_item（商品卡点击）
  const trackCardClick = () => {
    const item: GaItem = {
      item_id: product.handle,
      item_name: product.title,
      item_category: product.productType,
      price: parseFloat(displayPrice) || 0,
      quantity: 1,
    };
    trackSelectItem(item, 'product-card', 'Product Card');
  };

  return (
    <a href={v2url(`/products/${product.handle}/`)} className="group block h-full" onClick={trackCardClick}>
      {/* overlayInfo 卡（预售压图卡）圆角（2026-11-27 用户定，仅此模式，普通产品卡保持直角） */}
      <div className={`relative ${tallImage ? 'aspect-[3/4]' : 'aspect-square'} overflow-hidden bg-warm-gray${overlayInfo ? ' rounded-xl' : ''}`}>
        {/* 预售徽章：左上角，不随 hover 缩放（Z Gallerie 状态药丸式） */}
        {po && (
          <span className="absolute left-2 top-2 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-charcoal/85 text-cream backdrop-blur-sm">
            Pre-Order
          </span>
        )}
        {/* SALE 徽章：右上角（批次 1 促销展示层） */}
        {showSale && (
          <span className="absolute right-2 top-2 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand text-cream">
            Sale
          </span>
        )}
        {/* 双图叠放：hover 时第二张淡入；整体保留缓慢放大 */}
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
          {image && (
            <img
              src={resolveUrl(image.url)}
              alt={image.altText || product.title}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover${cropBiasRight ? ' object-[66.67%_50%]' : ''}`}
            />
          )}
          {hoverImage && (
            <img
              src={resolveUrl(hoverImage.url)}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100${cropBiasRight ? ' object-[66.67%_50%]' : ''}`}
            />
          )}
        </div>
        {/* 压图信息层（overlayInfo 模式，2026-11-26 首页预售区）：底部渐变罩 + 白字，
            只显示标题/预售交期/进度条，类目与价格不展示 */}
        {overlayInfo && (
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-charcoal/75 via-charcoal/35 to-transparent px-3.5 pb-3 pt-10">
            <h3 className="text-sm font-semibold text-cream leading-snug line-clamp-2">
              {overlayTitle}
            </h3>
            {/* 交期行不展示（2026-11-26 用户定：压图卡只留标题 + 进度条） */}
            {scarcity && (
              <div className="mt-1.5">
                <div className="h-[3px] w-full rounded-full bg-cream/25 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cream transition-all"
                    style={{ width: `${Math.min(100, (scarcity.claimed / scarcity.total) * 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] font-medium text-cream/85">
                  {scarcity.claimed >= scarcity.total
                    ? 'Sold out for this drop'
                    : scarcity.total - scarcity.claimed <= 5
                      ? `Only ${scarcity.total - scarcity.claimed} left`
                      : scarcity.claimed === 0
                        ? `${scarcity.total} available — be the first`
                        : `${scarcity.claimed} of ${scarcity.total} claimed`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {!overlayInfo && (
      <div className="pt-3.5">
        {/* 类目标签/标题/价格沿用 v1 classic ProductCard 的样式与颜色；带 tagLabel 时优先显示该值。
            badge / N Pack 标签已按用户要求全站移除（2026-09） */}
        <p className="text-xs font-semibold uppercase tracking-wider text-[#8B5A2B] mb-1">
          {product.tagLabel || productCategoryTag(product)}
        </p>
        {/* 标题最多两行（2026-10-16 用户定：移动端单行截断大量标题显示不全，改两行 clamp，
            超出两行才省略号；不定最小行高——一行/两行标题与价格的间距保持一致，同日用户定），
            字号全端统一 text-xs */}
        <h3 className="relative text-xs font-medium text-[#333] leading-snug line-clamp-2">
          {shortTitle(product.title, product.productType)}
          {/* 标题下划线 hover 渐入（v1 同款；两行标题下划线跟随最后一行宽度即可） */}
          <span className="absolute bottom-0 left-0 w-0 h-px bg-[#8B5A2B] transition-all duration-300 group-hover:w-full" />
        </h3>
        <p className="mt-1 text-base sm:text-lg font-semibold text-[#8B5A2B]">
          {/* 0 价 = 未上架（Coming Soon，2026-11-07 用户定），价格位不渲染 $0.00 */}
          {isComingSoonAmount(displayPrice) ? COMING_SOON_LABEL : (
            <>
              {showSale && (
                <span className="mr-1.5 text-sm sm:text-base font-normal text-charcoal-light/70 line-through">
                  {formatPrice(product.compareAtPrice!, displayCurrency)}
                </span>
              )}
              {formatPrice(displayPrice, displayCurrency)}
            </>
          )}
        </p>
        {/* 预售交期行（具体日期，非模糊周数；Parachute 式卡片可见交期） */}
        {po && (
          <p className="mt-0.5 text-[11px] text-charcoal-light">Pre-Order · Arrives by {po.arrivesShort}</p>
        )}
        {/* 首发预售进度条（2026-11-26）：安静细线 + 数量文案，凸显稀缺性；
            文案随进度变化——0 起售鼓励首单、≤5 件催促、售罄明示 */}
        {scarcity && (
          <div className="mt-1.5">
            <div className="h-[3px] w-full rounded-full bg-warm-gray overflow-hidden">
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{ width: `${Math.min(100, (scarcity.claimed / scarcity.total) * 100)}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] font-medium text-charcoal-light">
              {scarcity.claimed >= scarcity.total
                ? 'Sold out for this drop'
                : scarcity.total - scarcity.claimed <= 5
                  ? `Only ${scarcity.total - scarcity.claimed} left`
                  : scarcity.claimed === 0
                    ? `${scarcity.total} available — be the first`
                    : `${scarcity.claimed} of ${scarcity.total} claimed`}
            </p>
          </div>
        )}
      </div>
      )}
    </a>
  );
}
