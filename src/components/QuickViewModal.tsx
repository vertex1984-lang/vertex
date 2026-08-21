'use client';

import { useState, useEffect } from 'react';
import { MakimooProduct } from '@/data/products';
import { resolveUrl, shopifyImageUrl } from '@/lib/paths';
import { addToShopifyCart, addToLocalCart, notifyCartUpdated, openMiniCart } from '@/lib/cart';
import { formatPrice } from '@/lib/currency';
import { useToast } from '@/components/Toast';

interface QuickViewModalProps {
  product: MakimooProduct;
  open: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);

  // Esc 关闭
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  // 打开时锁定背景滚动
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const image = product.featuredImage
    ? product.featuredImage
    : (product.shopifyImages && product.shopifyImages.length > 0)
      ? shopifyImageUrl(product.shopifyImages[0], 600)
      : product.images[0]?.url || '';
  // featuredImage 是场景图不缩放；素材白底图加内边距缩小产品占比
  const padImage = !product.featuredImage && (product.imageWhiteBg?.[0] ?? false);
  const hasShopifyData = product.hasShopifyData;
  const isInStock = hasShopifyData ? (product.shopifyAvailable ?? false) : false;
  const displayPrice = product.shopifyPrice || product.priceRange.minVariantPrice.amount;
  const displayCurrency = product.shopifyCurrencyCode || product.priceRange.minVariantPrice.currencyCode;
  // 简述：取描述前两句
  const shortDesc = product.description.split('.').filter((s) => s.trim().length > 5).slice(0, 2).join('. ').trim();

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      if (hasShopifyData && product.shopifyVariantId) {
        const result = await addToShopifyCart(product.shopifyVariantId, 1);
        if (!result) {
          toast('Failed to add to cart. Please try again.', 'error');
          return;
        }
        notifyCartUpdated();
      } else {
        addToLocalCart({
          id: product.id,
          title: product.title,
          image: resolveUrl(product.images[0]?.url || ''),
          price: displayPrice,
          quantity: 1,
          handle: product.handle,
        });
      }
      toast('Added to cart!');
      onClose();
      openMiniCart();
    } catch {
      toast('Something went wrong. Please try again.', 'error');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2500] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.title}`}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid sm:grid-cols-2 gap-6 p-6">
          <div className="aspect-square rounded-xl overflow-hidden bg-white border border-[#E8E2DA]">
            {image && (
              <img
                src={resolveUrl(image)}
                alt={product.title}
                className={`w-full h-full object-contain ${padImage ? 'p-6' : ''}`}
              />
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8B5A2B] mb-1">
              {product.productType || 'Product'}
            </p>
            <h3 className="text-lg font-bold text-[#333] leading-snug mb-3">{product.title}</h3>
            {isInStock ? (
              <p className="text-xl font-bold text-[#8B5A2B] mb-3">{formatPrice(displayPrice, displayCurrency)}</p>
            ) : (
              <p className="text-sm font-semibold text-[#999] mb-3">Out of Stock</p>
            )}
            {shortDesc && (
              <p className="text-sm text-[#555] leading-relaxed mb-5 line-clamp-3">{shortDesc}.</p>
            )}
            <div className="mt-auto flex flex-col gap-2.5">
              {isInStock && (
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="w-full px-5 py-3 rounded-full text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:opacity-60"
                  style={{ backgroundColor: '#8B5A2B' }}
                >
                  {adding ? 'Adding...' : 'Add to Cart'}
                </button>
              )}
              <a
                href={resolveUrl(`/products/${product.handle}/`)}
                className="w-full text-center px-5 py-3 rounded-full text-sm font-semibold border-2 transition hover:bg-[#E8E2DA]"
                style={{ borderColor: '#8B5A2B', color: '#8B5A2B' }}
              >
                View Full Details
              </a>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-11 h-11 rounded-full bg-white/90 text-[#333] hover:bg-white flex items-center justify-center text-2xl transition shadow-md"
          aria-label="Close quick view"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
