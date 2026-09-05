'use client';

import { useState, useEffect } from 'react';
import { getProductByHandle } from '@/data/products';
import { resolveUrl, shopifyImageUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { addToShopifyCart, addToLocalCart, notifyCartUpdated, openMiniCart } from '@/lib/cart';
import { formatPrice } from '@/lib/currency';
import { trackEvent, GA_CURRENCY, GaItem } from '@/lib/gtag';
import { isFavorite, toggleFavorite } from '@/lib/favorites';
import { addRecentlyViewed } from '@/lib/recently-viewed';
import { useToast } from '@/components/Toast';
import BoughtTogether from '@/components/BoughtTogether';
import ImageLightbox from '@/components/ImageLightbox';
import { getProductSpecs, formatWeightDual, formatDimensionsDual } from '@/lib/specs';

interface V2ProductDetailClientProps {
  handle: string;
}

// PDP 手风琴内容（hardcode 占位文案，与 shipping-returns 页面政策一致；后续可改成按产品配置）
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
    title: 'Materials & Care',
    body: 'Premium outdoor polyester fabric with UV-fade resistance and a water-repellent surface. Spot clean and air dry for hassle-free maintenance.',
  },
];

// Frequently Bought Together 搭配购开关：产品数量太少时推荐意义不大，暂时隐藏。
// 组件保留在 src/components/BoughtTogether.tsx，恢复展示时改为 true 即可。
const SHOW_BOUGHT_TOGETHER = false;

export default function V2ProductDetailClient({ handle }: V2ProductDetailClientProps) {
  const { toast } = useToast();
  const product = getProductByHandle(handle);
  const [selectedImage, setSelectedImage] = useState(0);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [fav, setFav] = useState(false);

  // GA4: view_item（产品详情页浏览）
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

  // 记录最近浏览 + 同步收藏态
  useEffect(() => {
    if (!product) return;
    addRecentlyViewed(product.handle);
    const sync = () => setFav(isFavorite(product.id));
    sync();
    window.addEventListener('makimoo:favorites-updated', sync);
    return () => window.removeEventListener('makimoo:favorites-updated', sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle]);

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

  // 图片优先级与 (classic) 一致：Shopify CDN > 本地 images
  const productImages = (product.shopifyImages && product.shopifyImages.length > 0)
    ? product.shopifyImages.map((url, i) => ({
        url,
        mainUrl: shopifyImageUrl(url, 1200),
        lightboxUrl: shopifyImageUrl(url, 2048),
        thumbUrl: shopifyImageUrl(url, 200),
        altText: product.title,
        width: 800,
        height: 800,
        whiteBg: product.imageWhiteBg?.[i] ?? false,
      }))
    : product.images.map((img, i) => ({ ...img, mainUrl: img.url, lightboxUrl: img.url, thumbUrl: img.url, whiteBg: product.imageWhiteBg?.[i] ?? false }));

  // Use Shopify price if available; no Shopify data = not in stock, no price
  const hasShopifyData = product.hasShopifyData;
  const isInStock = hasShopifyData ? (product.shopifyAvailable ?? false) : false;
  const displayPrice = product.shopifyPrice || product.priceRange.minVariantPrice.amount;
  const displayCurrency = product.shopifyCurrencyCode || product.priceRange.minVariantPrice.currencyCode;

  // 规格：重量（Shopify）+ 尺寸/材质（提取表，规格行无数据则不显示）
  const specs = getProductSpecs(product.asin);
  const weightStr = formatWeightDual(product.shopifyWeight, product.shopifyWeightUnit);
  const dimsStr = formatDimensionsDual(specs?.dimensionsCm);

  const handleAddToCart = async () => {
    setAddingToCart(true);

    const trackAddToCart = () => {
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
    };

    try {
      if (product.hasShopifyData && product.shopifyVariantId) {
        // Use Shopify Cart API
        const result = await addToShopifyCart(product.shopifyVariantId, quantity);
        if (result) {
          notifyCartUpdated();
          trackAddToCart();
          openMiniCart();
          toast('Added to cart!');
        } else {
          toast('Failed to add to cart. Please try again.', 'error');
        }
      } else {
        // Fallback to local cart
        addToLocalCart({
          id: product.id,
          title: product.title,
          image: resolveUrl(product.images[0]?.url || ''),
          price: displayPrice,
          quantity,
          handle: product.handle,
        });
        trackAddToCart();
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

  return (
    <>
      {/* 主区：左图库（约 58%）+ 右购买区（sticky）；pt-32/36 让内容避开 fixed 导航 */}
      <section className="bg-off-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-32 lg:pt-40 pb-8 lg:pb-14">
          <div className="grid lg:grid-cols-[7fr_5fr] gap-8 lg:gap-14">
            {/* Gallery：桌面端缩略图竖排在左，移动端横排在下 */}
            <div className="flex flex-col-reverse lg:flex-row gap-3 lg:gap-4">
              {productImages.length > 1 && (
                <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto lg:max-h-[640px] flex-shrink-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {productImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedImage(i); setMainImageLoaded(false); }}
                      className={`w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition flex-shrink-0 bg-white ${
                        selectedImage === i ? 'border-brand' : 'border-transparent hover:border-warm-gray'
                      }`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img src={resolveUrl(img.thumbUrl)} alt={img.altText || ''} loading="lazy" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              <div
                className="flex-1 aspect-square rounded-xl overflow-hidden cursor-zoom-in relative group bg-white border border-warm-gray"
                onClick={() => setLightboxOpen(true)}
              >
                {/* 主图加载前 pulse 骨架占位 */}
                {!mainImageLoaded && <div className="absolute inset-0 animate-pulse bg-warm-gray" />}
                <img
                  key={productImages[selectedImage]?.mainUrl}
                  src={resolveUrl(productImages[selectedImage]?.mainUrl || '')}
                  alt={productImages[selectedImage]?.altText || product.title}
                  width={productImages[selectedImage]?.width}
                  height={productImages[selectedImage]?.height}
                  onLoad={() => setMainImageLoaded(true)}
                  // 图已在缓存中提前加载完成时 onLoad 不会触发，挂载时直接检查 complete 兜底
                  ref={(el) => { if (el && el.complete && el.naturalWidth > 0) setMainImageLoaded(true); }}
                  className={`relative w-full h-full object-contain transition-all duration-300 group-hover:scale-105 ${
                    productImages[selectedImage]?.whiteBg ? 'p-6 sm:p-8' : ''
                  } ${
                    mainImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>
            </div>

            {/* 购买区：desktop sticky（fixed header 实底后总高约 120px，top-32=128px 避开） */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-brand text-cream">
                  {product.productType}
                </span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${isInStock ? 'text-brand' : 'text-charcoal-light'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isInStock ? 'bg-brand' : 'bg-charcoal-light'}`} />
                  {isInStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <h1 className="text-2xl lg:text-[32px] font-extrabold tracking-tight text-charcoal leading-tight mb-4">
                {product.title}
              </h1>

              {/* Rating：仅在有真实评价数据时显示 */}
              {product.rating != null && product.reviewCount != null && product.reviewCount > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-brand">
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} width="18" height="18" viewBox="0 0 24 24"
                        fill={i <= Math.round(product.rating!) ? 'currentColor' : 'none'}
                        stroke="currentColor" strokeWidth={i <= Math.round(product.rating!) ? 0 : 1.5}
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-charcoal-light">
                    {product.rating.toFixed(1)} ({product.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
              )}

              {/* Price：划线价和 Save 徽章仅在有真实 compareAtPrice 且高于现价时显示 */}
              {isInStock ? (
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl lg:text-3xl font-bold text-charcoal">{formatPrice(displayPrice, displayCurrency)}</span>
                  {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(displayPrice) && (
                    <>
                      <span className="text-lg text-charcoal-light line-through">{formatPrice(product.compareAtPrice, displayCurrency)}</span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-light text-cream">
                        Save {Math.round((1 - parseFloat(displayPrice) / parseFloat(product.compareAtPrice)) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <div className="mb-6">
                  <span className="text-xl font-semibold text-charcoal-light">Out of Stock</span>
                </div>
              )}

              {/* 规格摘要：尺寸 / 材质（有数据才显示） */}
              {(dimsStr || specs?.material) && (
                <div className="flex flex-wrap gap-x-6 gap-y-1.5 mb-6 text-sm text-charcoal-light">
                  {dimsStr && (
                    <span>
                      <span className="font-semibold text-charcoal">Size:</span> {dimsStr}
                    </span>
                  )}
                  {specs?.material && (
                    <span>
                      <span className="font-semibold text-charcoal">Material:</span> {specs.material}
                    </span>
                  )}
                </div>
              )}

              {/* Actions：数量 + Add to Cart 全宽 + 收藏 */}
              {isInStock ? (
                <div className="flex gap-3 mb-3">
                  <div className="flex items-center border border-warm-gray rounded-full overflow-hidden bg-white flex-shrink-0">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-11 h-12 hover:bg-off-white transition flex items-center justify-center text-charcoal text-lg font-medium"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      min={1}
                      max={99}
                      readOnly
                      className="w-10 h-12 border-none text-center text-base font-semibold text-charcoal bg-white outline-none"
                      aria-label="Quantity"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-11 h-12 hover:bg-off-white transition flex items-center justify-center text-charcoal text-lg font-medium"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  {product.hasShopifyData && product.shopifyVariantId ? (
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="flex-1 h-12 rounded-full bg-brand text-cream text-sm font-semibold tracking-wide transition hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60"
                    >
                      {addingToCart ? 'Adding...' : 'Add to Cart'}
                    </button>
                  ) : (
                    <a
                      href={product.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-12 rounded-full bg-brand text-cream text-sm font-semibold tracking-wide transition hover:bg-brand-dark flex items-center justify-center gap-2"
                    >
                      Shop on Amazon
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M7 17L17 7M17 7H7M17 7v10"/>
                      </svg>
                    </a>
                  )}
                  {/* 收藏按钮 */}
                  <button
                    onClick={handleToggleFavorite}
                    className={`w-12 h-12 rounded-full border flex items-center justify-center transition hover:scale-105 active:scale-95 flex-shrink-0 ${
                      fav ? 'border-brand text-brand bg-brand/5' : 'border-warm-gray text-charcoal-light hover:text-brand hover:border-brand'
                    }`}
                    aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="mb-3 text-center py-3.5 px-6 rounded-full bg-warm-gray text-charcoal-light font-semibold text-sm">
                  Currently Unavailable
                </div>
              )}

              {/* 配送/退换说明 */}
              <p className="text-xs text-charcoal-light mb-8">
                Free shipping on orders over $49 · 30-day easy returns
              </p>

              {/* 手风琴：Shipping / Returns / Materials（hardcode 占位文案） */}
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
            </div>
          </div>
        </div>
      </section>

      {/* 下部：产品描述（限宽居中） */}
      <section className="bg-off-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 py-14 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2 text-center">Details</p>
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-charcoal mb-6 text-center">
            About This Product
          </h2>
          <div className="space-y-4">
            {product.description.split('.').filter(s => s.trim().length > 10).map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span className="text-base text-charcoal-light leading-relaxed">{feature.trim()}</span>
              </div>
            ))}
          </div>

          {/* Product Specifications */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-charcoal mb-4">Specifications</h3>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-warm-gray">
                  <td className="py-3 text-sm text-charcoal-light w-1/3">Brand</td>
                  <td className="py-3 text-sm text-charcoal font-medium">Makimoo</td>
                </tr>
                <tr className="border-b border-warm-gray">
                  <td className="py-3 text-sm text-charcoal-light">Category</td>
                  <td className="py-3 text-sm text-charcoal font-medium">{product.productType}</td>
                </tr>
                {weightStr && (
                  <tr className="border-b border-warm-gray">
                    <td className="py-3 text-sm text-charcoal-light">Weight</td>
                    <td className="py-3 text-sm text-charcoal font-medium">{weightStr}</td>
                  </tr>
                )}
                {dimsStr && (
                  <tr className="border-b border-warm-gray">
                    <td className="py-3 text-sm text-charcoal-light">Dimensions</td>
                    <td className="py-3 text-sm text-charcoal font-medium">{dimsStr}</td>
                  </tr>
                )}
                {specs?.material && (
                  <tr className="border-b border-warm-gray">
                    <td className="py-3 text-sm text-charcoal-light">Material</td>
                    <td className="py-3 text-sm text-charcoal font-medium">{specs.material}</td>
                  </tr>
                )}
                <tr className="border-b border-warm-gray">
                  <td className="py-3 text-sm text-charcoal-light">Price</td>
                  <td className={`py-3 text-sm font-medium ${isInStock ? 'text-charcoal' : 'text-charcoal-light'}`}>
                    {isInStock ? formatPrice(displayPrice, displayCurrency) : 'Out of Stock'}
                  </td>
                </tr>
                <tr className="border-b border-warm-gray">
                  <td className="py-3 text-sm text-charcoal-light">Availability</td>
                  <td className={`py-3 text-sm font-medium ${isInStock ? 'text-brand' : 'text-charcoal-light'}`}>
                    {isInStock ? 'In Stock' : 'Currently Unavailable'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Frequently Bought Together（搭配购，全宽横版；当前产品不在售时内部不渲染）。
          由 SHOW_BOUGHT_TOGETHER 控制，暂时隐藏 */}
      {SHOW_BOUGHT_TOGETHER && (
        <section className="bg-off-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-14">
            <BoughtTogether product={product} />
          </div>
        </section>
      )}

      {/* 全屏图片查看器（缩放/切换/缩略图条） */}
      {lightboxOpen && (
        <ImageLightbox
          images={productImages.map((img) => ({ mainUrl: img.lightboxUrl, thumbUrl: img.thumbUrl, altText: img.altText }))}
          index={selectedImage}
          onIndexChange={(i) => { setSelectedImage(i); setMainImageLoaded(false); }}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* 移动端吸底加购条（桌面端隐藏；safe-area 适配刘海屏） */}
      {isInStock && (
        <div
          className="fixed bottom-0 left-0 right-0 z-[1200] lg:hidden bg-off-white border-t border-warm-gray shadow-[0_-4px_16px_rgba(60,45,30,0.10)] px-4 pt-3 flex items-center gap-3"
          style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
        >
          <img
            src={resolveUrl(productImages[0]?.thumbUrl || '')}
            alt={product.title}
            className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
          />
          <span className="text-base font-bold text-brand flex-shrink-0">
            {formatPrice(displayPrice, displayCurrency)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="flex-1 h-11 rounded-full bg-brand text-cream text-sm font-semibold transition active:scale-95 disabled:opacity-60"
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      )}
    </>
  );
}
