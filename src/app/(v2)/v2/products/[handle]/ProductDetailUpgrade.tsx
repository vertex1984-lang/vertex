'use client';

/**
 * PDP v2 升级版详情页（仅 NEW_PRODUCT_HANDLES 白名单内商品使用）。
 * 功能：图集（缩略图在下）/ 花色切换 / 尺寸选择 / 锚点 Tab（非吸顶）/ 详情附图 /
 *      扩展规格表 / 示例评价区 / 信任徽章 / 移动端吸底加购。
 * 美术：全部使用 V2 设计 token（brand/charcoal/warm-gray/off-white/cream）。
 */

import { useState, useEffect } from 'react';
import { getProductByHandle, PRODUCTS_DATA } from '@/data/products';
import { MATERIALS_MAP } from '@/data/materials-map';
import { getVariantGroupOf } from '@/data/variant-groups';
import { resolveUrl, shopifyImageUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { addToShopifyCart, addToLocalCart, notifyCartUpdated, openMiniCart } from '@/lib/cart';
import { formatPrice } from '@/lib/currency';
import { trackEvent, GA_CURRENCY, GaItem } from '@/lib/gtag';
import { isFavorite, toggleFavorite } from '@/lib/favorites';
import { addRecentlyViewed } from '@/lib/recently-viewed';
import { useToast } from '@/components/Toast';
import ImageLightbox from '@/components/ImageLightbox';
import { getProductSpecs, formatDimensionsDual, formatWeightDual } from '@/lib/specs';

interface ProductDetailUpgradeProps {
  handle: string;
  /** 同款异色成员（含缩略图 URL），由服务端 page 组装传入 */
  colorVariants?: { asin: string; handle: string; color: string; thumb: string; inStock: boolean }[];
}

// ⚠️ DEMO 数据（设计演示用示例，非真实评价）：接入 Judge.me / Shopify Reviews 后删除替换。
const DEMO_RATING = { average: 4.8, count: 127 };
const DEMO_RATING_BARS = [
  { stars: 5, pct: 82 },
  { stars: 4, pct: 12 },
  { stars: 3, pct: 4 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];
const DEMO_REVIEWS = [
  {
    author: 'Melissa T.',
    location: 'Austin, TX',
    rating: 5,
    date: 'August 2026',
    title: 'Looks even better in person',
    body: 'The colors are rich but not loud, and it lays completely flat — exactly like the photos. No curling edges at all.',
    verified: true,
  },
  {
    author: 'James & Nora H.',
    location: 'Portland, OR',
    rating: 5,
    date: 'July 2026',
    title: 'Perfect for our living room',
    body: 'Great coverage for our seating area and the low profile means the robot vacuum glides right over it. Everyday crumbs hide surprisingly well.',
    verified: true,
  },
  {
    author: 'Karen W.',
    location: 'Raleigh, NC',
    rating: 4,
    date: 'July 2026',
    title: 'Beautiful rug, pleasingly slim',
    body: 'Love the pattern and palette. Keep in mind it is a low-pile rug, so do not expect plush — exactly what we wanted, and spills spot-cleaned easily.',
    verified: true,
  },
];

const SECTIONS = [
  { id: 'pdp2-description', label: 'Description' },
  { id: 'pdp2-specs', label: 'Specifications' },
  { id: 'pdp2-reviews', label: 'Reviews' },
];

// 尺寸选项（占位数据：当前尺寸可选中，其余灰色"即将推出"；
// 真实多尺寸上架后替换为变体数据，灰色项改为可跳转链接）
const SIZE_PRESETS = ['140 x 200 cm', '160 x 200 cm', '160 x 230 cm', '180 x 250 cm', '100 x 200 cm', '100 x 160 cm'];

const ACCORDION_SECTIONS = [
  {
    title: 'Shipping & Delivery',
    body: 'Free shipping on all orders. Orders are processed within 1-2 business days and typically arrive within 5-10 business days depending on your location.',
  },
  {
    title: 'Returns & Refunds',
    body: 'We offer an extended 30-day return period. If you are not satisfied, contact us and we will cover the return shipping cost.',
  },
  {
    title: 'Care & Maintenance',
    body: 'The low-pile surface stands up to daily foot traffic and is simple to vacuum. Spot-clean spills quickly to preserve the colors.',
  },
];

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex text-[#FFB800]" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth={i <= Math.round(rating) ? 0 : 1.5}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetailUpgrade({ handle, colorVariants = [] }: ProductDetailUpgradeProps) {
  const { toast } = useToast();
  const product = getProductByHandle(handle);
  const [selectedImage, setSelectedImage] = useState(0);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [fav, setFav] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  // GA4: view_item
  useEffect(() => {
    if (!product) return;
    const price = parseFloat(product.shopifyPrice || product.priceRange.minVariantPrice.amount);
    trackEvent('view_item', {
      currency: GA_CURRENCY,
      value: price,
      items: [{
        item_id: product.handle,
        item_name: product.title,
        item_category: product.productType,
        price,
        quantity: 1,
      } satisfies GaItem],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle]);

  // 锚点滚动监听（Tab 高亮）
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-25% 0px -65% 0px' }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // 收藏态同步 + 最近浏览
  useEffect(() => {
    if (!product) return;
    addRecentlyViewed(product.handle);
    const sync = () => setFav(isFavorite(product.id));
    sync();
    window.addEventListener('makimoo:favorites-updated', sync);
    return () => window.removeEventListener('makimoo:favorites-updated', sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!product) {
    return (
      <div className="bg-off-white px-6 lg:px-10 pt-40 pb-24 text-center">
        <p className="text-lg text-charcoal-light">Product not found.</p>
        <a href={v2url('/products/')} className="mt-4 inline-block text-brand underline underline-offset-4">
          Browse all products
        </a>
      </div>
    );
  }

  const productImages = (product.shopifyImages && product.shopifyImages.length > 0)
    ? product.shopifyImages.map((url, i) => ({
        url,
        mainUrl: shopifyImageUrl(url, 1200),
        lightboxUrl: shopifyImageUrl(url, 2048),
        thumbUrl: shopifyImageUrl(url, 200),
        altText: product.title,
        whiteBg: product.imageWhiteBg?.[i] ?? false,
      }))
    : product.images.map((img, i) => ({
        url: img.url, mainUrl: img.url, lightboxUrl: img.url, thumbUrl: img.url,
        altText: img.altText, whiteBg: product.imageWhiteBg?.[i] ?? false,
      }));

  // 详情附图：素材条目配置了 detailImages 用之；无则复用套图兜底
  const detailImages = (product.detailImages && product.detailImages.length > 0)
    ? product.detailImages
    : product.images.map((img) => img.url);

  const hasShopifyData = product.hasShopifyData;
  const isInStock = hasShopifyData ? (product.shopifyAvailable ?? false) : false;
  const displayPrice = product.shopifyPrice || product.priceRange.minVariantPrice.amount;
  const displayCurrency = product.shopifyCurrencyCode || product.priceRange.minVariantPrice.currencyCode;
  const showCompareAt = product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(displayPrice);

  // 标题：enrich 短标题（新标题公式已写入 short-titles）+ 原始长标题副行
  const shortTitle = product.title;
  const longTitle = PRODUCTS_DATA.find((p) => p.handle === handle)?.title ?? product.title;

  // 变体组（同款异色）
  const group = getVariantGroupOf(product.asin);
  const currentColor = group?.members.find((m) => m.handle === handle)?.color ?? null;

  // 规格
  const specs = getProductSpecs(product.asin);
  const materialSku = MATERIALS_MAP[product.asin.toLowerCase()]?.sku;
  const dimsStr = formatDimensionsDual(specs?.dimensionsCm);
  const weightStr = formatWeightDual(product.shopifyWeight, product.shopifyWeightUnit);
  const colorStr = product.title.match(/\(([^)]+)\)\s*$/)?.[1] ?? currentColor;
  // 绒高：仅当商品自身描述里有明确数值时才展示（防编造）
  const pileMatch = product.description.match(/(\d+(?:\.\d+)?)\s*cm\s*(?:pile|build|height|thick)/i)
    || product.description.match(/(?:pile|profile|thick)[^\d]{0,15}(\d+(?:\.\d+)?)\s*cm/i);
  const pileStr = pileMatch ? `${pileMatch[1]} cm` : null;

  // 尺寸选项（预设 ∪ 当前实际尺寸）
  const currentSizeStr = specs?.dimensionsCm ? `${specs.dimensionsCm[0]} x ${specs.dimensionsCm[1]} cm` : null;
  const sizeOptions = currentSizeStr && !SIZE_PRESETS.includes(currentSizeStr)
    ? [...SIZE_PRESETS, currentSizeStr]
    : SIZE_PRESETS;

  const quickSpecs = [
    pileStr ? { icon: 'layers', label: 'Pile', value: `Low profile ${pileStr}` } : null,
    specs?.material ? { icon: 'swatch', label: 'Material', value: specs.material } : null,
    { icon: 'sparkle', label: 'Care', value: 'Vacuum & spot clean' },
  ].filter(Boolean) as { icon: string; label: string; value: string }[];

  const specRows: { label: string; value: string; muted?: boolean }[] = [
    { label: 'Brand', value: 'Makimoo' },
    { label: 'Category', value: product.productType },
    ...(specs?.material ? [{ label: 'Material', value: specs.material }] : []),
    ...(colorStr ? [{ label: 'Color', value: colorStr }] : []),
    ...(dimsStr ? [{ label: 'Dimensions', value: dimsStr }] : []),
    ...(pileStr ? [{ label: 'Pile Height', value: pileStr }] : []),
    ...(weightStr ? [{ label: 'Weight', value: weightStr }] : []),
    ...(materialSku ? [{ label: 'SKU', value: materialSku }] : []),
    { label: 'Care', value: 'Vacuum regularly; spot-clean spills promptly' },
    { label: 'Availability', value: isInStock ? 'In Stock' : 'Currently Unavailable', muted: !isInStock },
  ];

  const handleAddToCart = async () => {
    setAddingToCart(true);
    const price = parseFloat(displayPrice);
    trackEvent('add_to_cart', {
      currency: GA_CURRENCY,
      value: price * quantity,
      items: [{
        item_id: product.handle,
        item_name: product.title,
        item_category: product.productType,
        price,
        quantity,
      } satisfies GaItem],
    });
    try {
      if (product.hasShopifyData && product.shopifyVariantId) {
        const result = await addToShopifyCart(product.shopifyVariantId, quantity);
        if (result) {
          notifyCartUpdated();
          openMiniCart();
          toast('Added to cart!');
        } else {
          toast('Failed to add to cart. Please try again.', 'error');
        }
      } else {
        addToLocalCart({
          id: product.id,
          title: product.title,
          image: resolveUrl(product.shopifyImages?.[0] || product.images[0]?.url || ''),
          price: displayPrice,
          quantity,
          handle: product.handle,
        });
        notifyCartUpdated();
        openMiniCart();
        toast('Added to cart!');
      }
    } catch {
      toast('Something went wrong. Please try again.', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleFavorite = () => {
    const nowFav = toggleFavorite(product.id);
    toast(nowFav ? 'Saved to favorites' : 'Removed from favorites');
  };

  // 运保 + 信任徽章 + 手风琴（桌面在左栏图集下方，移动端在右栏底部）
  const shippingCareBlock = (
    <>
      <p className="text-sm text-charcoal-light mb-6">
        {isInStock ? 'Ships within 1-2 business days · ' : ''}
        <a href={v2url('/shipping-returns/')} className="text-brand hover:underline">Shipping &amp; returns policy</a>
      </p>
      <div className="grid grid-cols-4 gap-2 py-5 border-t border-b border-warm-gray mb-2">
        {[
          { icon: 'truck', label: 'Free Shipping' },
          { icon: 'return', label: '30-Day Returns' },
          { icon: 'lock', label: 'Secure Payment' },
          { icon: 'badge', label: 'Quality Checked' },
        ].map((badge) => (
          <div key={badge.label} className="flex flex-col items-center text-center gap-1.5">
            <TrustIcon name={badge.icon} />
            <span className="text-xs sm:text-sm text-charcoal-light leading-tight">{badge.label}</span>
          </div>
        ))}
      </div>
      <div className="border-b border-warm-gray">
        {ACCORDION_SECTIONS.map((section, i) => (
          <div key={section.title} className="border-t border-warm-gray">
            <button
              onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
              className="w-full flex items-center justify-between py-4 text-left"
              aria-expanded={openAccordion === i}
            >
              <span className="text-sm font-semibold text-charcoal">{section.title}</span>
              <svg
                className={`w-4 h-4 text-brand transition-transform duration-300 ${openAccordion === i ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: openAccordion === i ? '200px' : '0' }}
            >
              <p className="text-sm text-charcoal-light leading-relaxed pb-4">{section.body}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="bg-off-white pb-24 lg:pb-0">
      {/* 面包屑 */}
      <div className="px-6 lg:px-10 pt-6">
        <nav className="max-w-[1400px] mx-auto flex items-center gap-2 text-sm text-charcoal-light">
          <a href={v2url('/')} className="hover:text-brand">Home</a>
          <span>/</span>
          <a href={v2url('/products/')} className="hover:text-brand">Products</a>
          <span>/</span>
          <span className="text-charcoal truncate max-w-[180px] sm:max-w-md">{shortTitle}</span>
        </nav>
      </div>

      {/* ① 顶部：左图集 + 右购买信息 */}
      <section className="px-6 lg:px-10 mt-6 lg:mt-10">
        <div className="max-w-[1400px] mx-auto grid gap-10 lg:gap-14 lg:grid-cols-2">
          {/* 左：图集（大图 + 缩略图横排在下，全端一致） */}
          <div>
            <div
              className="aspect-square rounded-2xl overflow-hidden border border-warm-gray cursor-zoom-in relative group bg-white"
              onClick={() => setLightboxOpen(true)}
            >
              {!mainImageLoaded && <div className="absolute inset-0 animate-pulse bg-warm-gray" />}
              <img
                key={productImages[selectedImage]?.mainUrl}
                src={resolveUrl(productImages[selectedImage]?.mainUrl || '')}
                alt={productImages[selectedImage]?.altText || product.title}
                onLoad={() => setMainImageLoaded(true)}
                ref={(el) => { if (el && el.complete && el.naturalWidth > 0) setMainImageLoaded(true); }}
                className={`relative w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.04] ${
                  productImages[selectedImage]?.whiteBg ? 'object-contain p-6 sm:p-8' : ''
                } ${mainImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
              <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-brand opacity-0 group-hover:opacity-100 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/>
                </svg>
              </div>
            </div>
            {productImages.length > 1 && (
              <div className="flex gap-2.5 lg:gap-3 mt-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedImage(i); setMainImageLoaded(false); }}
                    className={`w-16 h-16 lg:w-20 lg:h-20 rounded-lg lg:rounded-xl overflow-hidden border-2 transition flex-shrink-0 bg-white ${
                      selectedImage === i ? 'border-brand' : 'border-warm-gray hover:border-brand/40'
                    }`}
                  >
                    <img src={resolveUrl(img.thumbUrl)} alt={img.altText} loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {/* 运保 + 信任徽章 + 手风琴（桌面端位置：图集下方；移动端在右栏） */}
            <div className="hidden lg:block mt-10">
              {shippingCareBlock}
            </div>
          </div>

          {/* 右：购买信息栏 */}
          <div className="lg:pt-2">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-brand text-cream">
                  {product.productType}
                </span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${isInStock ? 'text-brand' : 'text-charcoal-light'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isInStock ? 'bg-brand' : 'bg-charcoal-light'}`} />
                  {isInStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <button
                onClick={handleToggleFavorite}
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition hover:scale-105 active:scale-95 flex-shrink-0 ${
                  fav ? 'border-brand text-brand bg-brand/5' : 'border-warm-gray text-charcoal-light hover:text-brand hover:border-brand'
                }`}
                aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            <h1 className="text-[1.65rem] lg:text-4xl font-extrabold tracking-tight text-charcoal leading-tight mb-2">{shortTitle}</h1>
            {longTitle !== shortTitle && (
              <p className="text-sm text-charcoal-light leading-relaxed mb-4 line-clamp-2">{longTitle}</p>
            )}

            <button onClick={() => scrollToSection('pdp2-reviews')} className="flex items-center gap-2 mb-5 group">
              <Stars rating={DEMO_RATING.average} />
              <span className="text-sm font-semibold text-charcoal">{DEMO_RATING.average}</span>
              <span className="text-sm text-brand group-hover:underline">{DEMO_RATING.count} reviews</span>
            </button>

            {isInStock ? (
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl lg:text-4xl font-extrabold text-brand">{formatPrice(displayPrice, displayCurrency)}</span>
                {showCompareAt && (
                  <>
                    <span className="text-lg text-charcoal-light line-through">{formatPrice(product.compareAtPrice!, displayCurrency)}</span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-light text-cream">
                      Save {Math.round((1 - parseFloat(displayPrice) / parseFloat(product.compareAtPrice!)) * 100)}%
                    </span>
                  </>
                )}
              </div>
            ) : (
              <div className="mb-6">
                <span className="text-xl font-semibold text-charcoal-light">Out of Stock</span>
              </div>
            )}

            {/* Details 五点卖点（紧凑单列；按领导要求置于花色上方，平衡上半部分） */}
            {isInStock && (
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-light mb-3">Details</p>
                <ul className="space-y-2.5">
                  {(product.featureBullets ?? product.description.split(/\.\s+/).filter((s) => s.trim().length > 10)).slice(0, 5).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                      <span className="text-sm text-charcoal-light leading-relaxed">{feature.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 花色切换器（同款异色圆点，点击跳转对应花色页） */}
            {colorVariants.length > 1 && (() => {
              const current = colorVariants.find((v) => v.handle === handle);
              return (
                <div className="mb-7">
                  <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-light mb-3">
                    Color{current ? `: ${current.color}` : ''}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {colorVariants.map((v) => {
                      const isCurrent = v.handle === handle;
                      return (
                        <a
                          key={v.asin}
                          href={v2url(`/products/${v.handle}/`)}
                          title={v.color}
                          aria-label={`${v.color}${isCurrent ? ' (current)' : ''}`}
                          className={`relative w-[88px] h-[88px] rounded-full overflow-hidden border-2 transition hover:scale-105 ${
                            isCurrent ? 'border-brand shadow-md' : 'border-warm-gray hover:border-brand/40'
                          }`}
                        >
                          <img
                            src={resolveUrl(v.thumb)}
                            alt={v.color}
                            loading="lazy"
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] object-cover"
                          />
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* 尺寸选择器（当前尺寸选中；其余灰色 Coming soon） */}
            {currentSizeStr && (
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-light mb-3">Size</p>
                <div className="flex flex-wrap gap-3">
                  {sizeOptions.map((size) => {
                    const active = size === currentSizeStr;
                    return (
                      <button
                        key={size}
                        onClick={() => { if (!active) toast('This size is coming soon'); }}
                        title={active ? size : 'Coming soon'}
                        aria-pressed={active}
                        aria-disabled={!active}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition ${
                          active
                            ? 'border-brand bg-brand text-cream cursor-default'
                            : 'border-warm-gray bg-white text-charcoal-light/70 cursor-not-allowed hover:border-brand/30'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 规格速览 chips */}
            <div className="grid grid-cols-2 gap-2.5 mb-7">
              {quickSpecs.map((spec) => (
                <div key={spec.label} className="flex items-start gap-2.5 rounded-xl bg-white border border-warm-gray px-3.5 py-3">
                  <QuickSpecIcon name={spec.icon} />
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wide text-charcoal-light font-semibold">{spec.label}</p>
                    <p className="text-sm font-medium text-charcoal truncate">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 数量 + 加购 */}
            {isInStock && (
              <div className="flex flex-col sm:flex-row gap-3.5 mb-3">
                <div className="flex items-center border border-warm-gray rounded-full overflow-hidden bg-white self-start">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 hover:bg-off-white transition flex items-center justify-center text-charcoal text-xl"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number" value={quantity} min={1} max={99} readOnly
                    className="w-14 h-12 border-none text-center text-base font-semibold text-charcoal bg-white outline-none"
                    aria-label="Quantity"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 hover:bg-off-white transition flex items-center justify-center text-charcoal text-xl"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                {product.hasShopifyData && product.shopifyVariantId ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-cream bg-brand transition hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60"
                  >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M6 6L5 3H2"/>
                    </svg>
                  </button>
                ) : (
                  <a
                    href={product.amazonUrl}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-cream bg-brand transition hover:bg-brand-dark"
                  >
                    Shop on Amazon
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M7 17L17 7M17 7H7M17 7v10"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
            <p className="text-sm text-charcoal-light mb-6">
              {isInStock ? 'Ships within 1-2 business days · ' : ''}
              <a href={v2url('/shipping-returns/')} className="text-brand hover:underline">Shipping &amp; returns policy</a>
            </p>

            {/* 运保 + 信任徽章 + 手风琴（移动端位置） */}
            <div className="lg:hidden">
              {shippingCareBlock}
            </div>
          </div>
        </div>
      </section>

      {/* ② 锚点 Tab 条（不吸顶：顶部导航已吸顶） */}
      <div className="mt-12 bg-white border-y border-warm-gray">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex gap-1 sm:gap-2 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`px-4 sm:px-6 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeSection === section.id
                  ? 'text-brand border-brand'
                  : 'text-charcoal-light border-transparent hover:text-charcoal'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* ③ Description：详情附图大图叙事（五点卖点已上移至购买区花色上方） */}
      <section id="pdp2-description" className="px-6 lg:px-10 py-14 scroll-mt-28 lg:scroll-mt-36">
        <div className="max-w-[1400px] mx-auto">
          <div className="space-y-6">
            {detailImages.map((src, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-warm-gray">
                <img src={resolveUrl(src)} alt={`${product.title} - detail ${i + 1}`} loading="lazy" className="w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ④ Specifications */}
      <section id="pdp2-specs" className="px-6 lg:px-10 py-14 scroll-mt-28 lg:scroll-mt-36">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase text-brand mb-2">Specifications</p>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-charcoal mb-8">Product Details at a Glance</h2>
          <div className="max-w-3xl bg-white rounded-2xl border border-warm-gray overflow-hidden">
            <table className="w-full">
              <tbody>
                {specRows.map((row, i) => (
                  <tr key={row.label} className={i > 0 ? 'border-t border-warm-gray' : ''}>
                    <td className="py-3.5 pl-6 pr-4 text-sm text-charcoal-light w-2/5 align-top">{row.label}</td>
                    <td className={`py-3.5 pr-6 text-sm font-medium align-top ${row.muted ? 'text-red-500' : 'text-charcoal'}`}>
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ⑤ Reviews（示例评价，接入真实数据后替换） */}
      <section id="pdp2-reviews" className="px-6 lg:px-10 py-14 scroll-mt-28 lg:scroll-mt-36 bg-off-white">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase text-brand mb-2">Reviews</p>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-charcoal mb-8">What Customers Say</h2>
          <div className="grid lg:grid-cols-[300px_1fr] gap-10">
            <div className="bg-white rounded-2xl border border-warm-gray p-6 self-start">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-5xl font-extrabold text-charcoal leading-none">{DEMO_RATING.average}</span>
                <span className="text-sm text-charcoal-light mb-1">out of 5</span>
              </div>
              <Stars rating={DEMO_RATING.average} size={18} />
              <p className="text-sm text-charcoal-light mt-2 mb-5">Based on {DEMO_RATING.count} reviews</p>
              <div className="space-y-2">
                {DEMO_RATING_BARS.map((bar) => (
                  <div key={bar.stars} className="flex items-center gap-2.5">
                    <span className="text-xs text-charcoal-light w-7">{bar.stars} ★</span>
                    <div className="flex-1 h-2 rounded-full bg-warm-gray overflow-hidden">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${bar.pct}%` }} />
                    </div>
                    <span className="text-xs text-charcoal-light w-9 text-right">{bar.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {DEMO_REVIEWS.map((review) => (
                <div key={review.author} className="bg-white rounded-2xl border border-warm-gray p-6 flex flex-col shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <Stars rating={review.rating} />
                    <span className="text-xs text-charcoal-light">{review.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-charcoal mb-2">{review.title}</h3>
                  <p className="text-sm text-charcoal-light leading-relaxed flex-1">{review.body}</p>
                  <div className="mt-4 pt-4 border-t border-warm-gray">
                    <p className="text-sm font-semibold text-charcoal">
                      {review.author}
                      <span className="font-normal text-charcoal-light"> · {review.location}</span>
                    </p>
                    {review.verified && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Verified Buyer
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-[#B0A391] mt-6">
            Sample reviews shown for design preview — real customer reviews coming soon.
          </p>
        </div>
      </section>

      {/* 全屏图片查看器 */}
      {lightboxOpen && (
        <ImageLightbox
          images={productImages.map((img) => ({ mainUrl: img.lightboxUrl, thumbUrl: img.thumbUrl, altText: img.altText }))}
          index={selectedImage}
          onIndexChange={(i) => { setSelectedImage(i); setMainImageLoaded(false); }}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* 移动端吸底加购条 */}
      {isInStock && (
        <div
          className="fixed bottom-0 left-0 right-0 z-[1200] lg:hidden bg-white border-t border-warm-gray shadow-[0_-4px_16px_rgba(60,45,30,0.10)] px-4 pt-3 flex items-center gap-3"
          style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
        >
          <img
            src={resolveUrl(productImages[0]?.thumbUrl || '')}
            alt={product.title}
            className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-brand leading-tight">{formatPrice(displayPrice, displayCurrency)}</p>
            <p className="text-[11px] text-charcoal-light truncate">{shortTitle}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="h-11 px-6 rounded-full text-sm font-semibold text-cream transition active:scale-95 disabled:opacity-60 flex-shrink-0 bg-brand"
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- 小图标 ---------- */

function QuickSpecIcon({ name }: { name: string }) {
  const common = 'w-[18px] h-[18px] text-brand flex-shrink-0 mt-0.5';
  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'layers':
      return <svg className={common} viewBox="0 0 24 24" {...stroke}><path d="M12 2L2 7l10 5 10-5-10-5zM2 12l10 5 10-5M2 17l10 5 10-5" /></svg>;
    case 'swatch':
      return <svg className={common} viewBox="0 0 24 24" {...stroke}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>;
    case 'sparkle':
      return <svg className={common} viewBox="0 0 24 24" {...stroke}><path d="M12 3l1.9 5.8L20 10l-5.8 1.9L12 18l-2.2-6.1L4 10l6.1-1.2L12 3z"/><path d="M19 15l.9 2.6L22 18.5l-2.1.9L19 22l-.9-2.6-2.1-.9 2.1-.9L19 15z"/></svg>;
    default:
      return null;
  }
}

function TrustIcon({ name }: { name: string }) {
  const cls = 'w-[22px] h-[22px] text-brand';
  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'truck':
      return <svg className={cls} viewBox="0 0 24 24" {...stroke}><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/></svg>;
    case 'return':
      return <svg className={cls} viewBox="0 0 24 24" {...stroke}><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>;
    case 'lock':
      return <svg className={cls} viewBox="0 0 24 24" {...stroke}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>;
    case 'badge':
      return <svg className={cls} viewBox="0 0 24 24" {...stroke}><path d="M12 2l2.4 2.4h3.4v3.4L20 10l-2.2 2.2v3.4h-3.4L12 18l-2.4-2.4H6.2v-3.4L4 10l2.2-2.2V4.4h3.4L12 2z"/><path d="M9 10l2 2 4-4"/></svg>;
    default:
      return null;
  }
}
