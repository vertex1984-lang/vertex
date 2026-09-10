'use client';

/**
 * PDP v2 快速加购卡片（Complete the Look 区块用）：
 * 图 + 名 + 价 + 一键加购；走 vertex 的真实 Shopify Cart API，
 * 失败/无 variant 时回退本地购物车。
 */

import { useState } from 'react';
import { addToShopifyCart, addToLocalCart, notifyCartUpdated, openMiniCart } from '@/lib/cart';
import { formatPrice } from '@/lib/currency';
import { trackEvent, GA_CURRENCY, GaItem } from '@/lib/gtag';
import { useToast } from '@/components/Toast';
import { resolveUrl, shopifyImageUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

export interface QuickAddCardData {
  id: string;
  title: string;
  handle: string;
  image: string;
  price: string;
  currency: string;
  inStock: boolean;
  whiteBg: boolean;
  productType: string;
  variantId?: string;
}

export default function QuickAddCard({ card }: { card: QuickAddCardData }) {
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);

  const handleQuickAdd = async () => {
    setAdding(true);
    const price = parseFloat(card.price);
    trackEvent('add_to_cart', {
      currency: GA_CURRENCY,
      value: price,
      items: [{
        item_id: card.handle,
        item_name: card.title,
        item_category: card.productType,
        price,
        quantity: 1,
      } satisfies GaItem],
    });
    try {
      if (card.variantId) {
        const result = await addToShopifyCart(card.variantId, 1);
        if (result) {
          notifyCartUpdated();
          openMiniCart();
          toast('Added to cart!');
        } else {
          toast('Failed to add to cart. Please try again.', 'error');
        }
      } else {
        addToLocalCart({
          id: card.id,
          title: card.title,
          image: resolveUrl(card.image),
          price: card.price,
          quantity: 1,
          handle: card.handle,
        });
        notifyCartUpdated();
        openMiniCart();
        toast('Added to cart!');
      }
    } catch {
      toast('Something went wrong. Please try again.', 'error');
    } finally {
      setAdding(false);
    }
  };

  const imgUrl = card.image.includes('cdn.shopify.com') ? shopifyImageUrl(card.image, 600) : card.image;
  const productUrl = v2url(`/products/${card.handle}/`);

  return (
    <div className="flex flex-col group">
      <a
        href={productUrl}
        className="block aspect-square rounded-xl overflow-hidden border border-warm-gray bg-white mb-3"
        aria-label={card.title}
      >
        <img
          src={resolveUrl(imgUrl)}
          alt={card.title}
          loading="lazy"
          className={`w-full h-full transition-transform duration-300 group-hover:scale-[1.04] ${
            card.whiteBg ? 'object-contain p-4' : 'object-cover'
          }`}
        />
      </a>
      <a
        href={productUrl}
        className="text-sm font-semibold text-charcoal leading-snug line-clamp-2 hover:text-brand mb-1"
      >
        {card.title}
      </a>
      <span className="text-base font-bold text-brand mb-3">{formatPrice(card.price, card.currency)}</span>
      <button
        onClick={handleQuickAdd}
        disabled={adding || !card.inStock}
        className="mt-auto w-full h-11 rounded-full text-sm font-semibold text-cream bg-brand transition hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60"
      >
        {!card.inStock ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}
