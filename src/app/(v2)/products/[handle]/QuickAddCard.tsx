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
import { trackMetaItem } from '@/lib/meta-pixel';
import { useToast } from '@/components/Toast';
import { resolveUrl, shopifyImageUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { preorderOf } from '@/data/preorder';

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
    trackMetaItem('AddToCart', { item_id: card.handle, item_name: card.title, price, quantity: 1 });
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
        className="block aspect-square overflow-hidden bg-white mb-3"
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
      {/* 上线方案分层（2026-11-15）：仅预售可购层出 Pre-Order 快加；展示层换「到货通知」链（PDP 订阅框） */}
      {preorderOf(card.handle) ? (
        <button
          onClick={handleQuickAdd}
          disabled={adding || !card.inStock}
          className="mt-auto w-full h-11 rounded-full text-sm font-semibold text-cream bg-brand transition hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60"
        >
          {adding ? 'Adding...' : card.inStock ? 'Pre-Order Now' : 'Out of Stock'}
        </button>
      ) : (
        <a
          href={productUrl}
          className="mt-auto w-full h-11 rounded-full text-sm font-semibold border border-brand text-brand flex items-center justify-center transition hover:bg-brand/5"
        >
          Notify Me
        </a>
      )}
    </div>
  );
}
