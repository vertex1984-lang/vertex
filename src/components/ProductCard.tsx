'use client';

import { useState, useEffect } from 'react';
import { MakimooProduct } from '@/data/products';
import { productCategoryTag } from '@/data/subcategories';
import { resolveUrl, shopifyImageUrl } from '@/lib/paths';
import { formatPrice } from '@/lib/currency';
import { isFavorite, toggleFavorite } from '@/lib/favorites';
import { useToast } from '@/components/Toast';
import QuickViewModal from '@/components/QuickViewModal';

interface ProductCardProps {
  product: MakimooProduct;
  /** featured: 首页 Featured 区块专用，保留旧的固定高度+渐变底图区样式 */
  variant?: 'default' | 'featured';
}

/** 从标题提取件数："Set of 4" / "4 Pack" / "2-Pack" / "Pack of 2" → 4/4/2/2 */
function getPackCount(title: string): number | null {
  const m = title.match(/set of (\d+)|(\d+)[\s-]?pack|pack of (\d+)|(\d+)[\s-]?piece/i);
  if (!m) return null;
  const n = parseInt(m[1] || m[2] || m[3] || m[4], 10);
  return n > 1 ? n : null;
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { toast } = useToast();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [fav, setFav] = useState(false);

  // 收藏态在 mount 后从 localStorage 读，并监听全局收藏事件同步
  useEffect(() => {
    const sync = () => setFav(isFavorite(product.id));
    sync();
    window.addEventListener('makimoo:favorites-updated', sync);
    return () => window.removeEventListener('makimoo:favorites-updated', sync);
  }, [product.id]);

  // Priority: featuredImage > Shopify CDN image > local image
  const image = product.featuredImage
    ? { url: product.featuredImage, altText: product.title, width: 800, height: 800 }
    : (product.shopifyImages && product.shopifyImages.length > 0)
      ? { url: shopifyImageUrl(product.shopifyImages[0], 600), altText: product.title, width: 800, height: 800 }
      : product.images[0];
  const hasShopifyData = product.hasShopifyData;
  const isInStock = hasShopifyData ? (product.shopifyAvailable ?? false) : false;
  const displayPrice = product.shopifyPrice || product.priceRange.minVariantPrice.amount;
  const displayCurrency = product.shopifyCurrencyCode || product.priceRange.minVariantPrice.currencyCode;
  const packCount = getPackCount(product.title);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowFav = toggleFavorite(product.id);
    toast(nowFav ? 'Saved to favorites' : 'Removed from favorites');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <>
      <a
        href={resolveUrl(`/products/${product.handle}/`)}
        className="group h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      >
        <div className={variant === 'featured'
          ? 'relative h-40 sm:h-52 lg:h-64 overflow-hidden bg-gradient-to-br from-[#F8F5F0] to-[#E8E2DA]'
          : 'relative aspect-square overflow-hidden bg-white border-b border-[#E8E2DA]'
        }>
          {image && (
            <img
              src={resolveUrl(image.url)}
              alt={image.altText || product.title}
              width={image.width}
              height={image.height}
              loading="lazy"
              className={`w-full h-full ${variant === 'featured' ? 'object-cover' : 'object-contain'} transition-transform duration-500 group-hover:scale-110 ${!isInStock ? 'grayscale-[40%]' : ''} ${variant !== 'featured' && product.imageWhiteBg?.[0] ? 'p-5 sm:p-7' : ''}`}
            />
          )}
          {!isInStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="px-3 py-1 bg-[#333]/80 text-white text-xs font-semibold rounded-full">Out of Stock</span>
            </div>
          )}
          {packCount && (
            <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#8B5A2B] text-white text-[11px] font-semibold rounded-full shadow">
              {packCount} Pack
            </span>
          )}
          {/* 收藏按钮 */}
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-2 left-2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center transition hover:scale-110 active:scale-95 ${
              fav ? 'text-red-500' : 'text-[#999] hover:text-[#8B5A2B]'
            }`}
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          {/* Quick View 按钮（hover 出现） */}
          <button
            onClick={handleQuickView}
            className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-[#555] hover:text-[#8B5A2B] transition-all duration-300 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
            aria-label="Quick view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          {isInStock && (
            <div className="absolute bottom-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#8B5A2B] text-white shadow-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          )}
        </div>
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8B5A2B] mb-1">
            {productCategoryTag(product)}
          </p>
          {/* 标题固定两行高度（line-clamp-2 + min-h），避免同行卡片高度不一 */}
          <h3 className="relative text-sm sm:text-base font-medium text-[#333] line-clamp-2 leading-snug min-h-[2.75em] mb-2 sm:mb-3">
            {product.title}
            {/* 标题下划线 hover 渐入 */}
            <span className="absolute bottom-0 left-0 w-0 h-px bg-[#8B5A2B] transition-all duration-300 group-hover:w-full" />
          </h3>
          {/* 价格钉在卡片底部，保证同行卡片底部对齐 */}
          <div className="mt-auto">
            {isInStock ? (
              <p className="text-base sm:text-lg font-semibold text-[#8B5A2B]">
                {formatPrice(displayPrice, displayCurrency)}
              </p>
            ) : (
              <p className="text-base sm:text-lg font-semibold text-[#999]">
                Out of Stock
              </p>
            )}
          </div>
        </div>
      </a>
      <QuickViewModal product={product} open={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
    </>
  );
}
