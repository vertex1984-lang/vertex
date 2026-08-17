'use client';

import { useState, useEffect } from 'react';
import { resolveUrl } from '@/lib/paths';
import { removeFromLocalCart, updateLocalCartQuantity, getShopifyCart, updateShopifyCartLine, removeShopifyCartLine, LocalCartItem } from '@/lib/cart';
import { formatPrice, STORE_CURRENCY } from '@/lib/currency';
import { trackEvent, GA_CURRENCY, GaItem } from '@/lib/gtag';

interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    product: {
      title: string;
      handle: string;
      images: { edges: { node: { url: string; altText: string } }[] };
    };
  };
}

interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: { edges: { node: ShopifyCartLine }[] };
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
}

export default function CartPage() {
  const [localItems, setLocalItems] = useState<LocalCartItem[]>([]);
  const [shopifyCart, setShopifyCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(true);
  // 加载完成前不写回 localStorage，避免用初始空数组覆盖已保存的购物车
  const [loaded, setLoaded] = useState(false);
  const [updatingLineId, setUpdatingLineId] = useState<string | null>(null);

  useEffect(() => {
    // Load local cart
    const saved = localStorage.getItem('makimoo-cart');
    if (saved) {
      try {
        setLocalItems(JSON.parse(saved));
      } catch {
        setLocalItems([]);
      }
    }

    // Load Shopify cart
    getShopifyCart().then((cart) => {
      if (cart) {
        setShopifyCart(cart as ShopifyCart);
      }
      setLoading(false);
      setLoaded(true);
    }).catch(() => {
      setLoading(false);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem('makimoo-cart', JSON.stringify(localItems));
  }, [localItems, loaded]);

  const updateLocalQuantity = (id: string, qty: number) => {
    if (qty < 1) {
      const updated = removeFromLocalCart(id);
      setLocalItems(updated);
      return;
    }
    const updated = updateLocalCartQuantity(id, qty);
    setLocalItems([...updated]);
  };

  const removeLocal = (id: string) => {
    const updated = removeFromLocalCart(id);
    setLocalItems(updated);
  };

  const updateShopifyQuantity = async (lineId: string, qty: number) => {
    setUpdatingLineId(lineId);
    const cart = qty < 1
      ? await removeShopifyCartLine(lineId)
      : await updateShopifyCartLine(lineId, qty);
    if (cart) setShopifyCart(cart as ShopifyCart);
    setUpdatingLineId(null);
  };

  const removeShopifyLine = async (lineId: string) => {
    setUpdatingLineId(lineId);
    const cart = await removeShopifyCartLine(lineId);
    if (cart) setShopifyCart(cart as ShopifyCart);
    setUpdatingLineId(null);
  };

  // Calculate totals
  const localSubtotal = localItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const shopifySubtotal = shopifyCart ? parseFloat(shopifyCart.cost.subtotalAmount.amount) : 0;
  const totalSubtotal = localSubtotal + shopifySubtotal;

  const handleCheckout = () => {
    // GA4: begin_checkout（合并 Shopify 行 + 本地行）
    const items: GaItem[] = [
      ...(shopifyCart?.lines.edges.map(({ node: line }) => ({
        item_id: line.merchandise.product.handle,
        item_name: line.merchandise.product.title,
        price: parseFloat(line.merchandise.price.amount),
        quantity: line.quantity,
      })) ?? []),
      ...localItems.map((item) => ({
        item_id: item.handle,
        item_name: item.title,
        price: parseFloat(item.price),
        quantity: item.quantity,
      })),
    ];
    trackEvent('begin_checkout', {
      currency: GA_CURRENCY,
      value: totalSubtotal,
      items,
    });

    if (shopifyCart?.checkoutUrl) {
      window.open(shopifyCart.checkoutUrl, '_blank');
    } else {
      alert('Please purchase on Amazon using the product links for items not yet available in our store.');
    }
  };

  if (loading) {
    return (
      <div className="px-6 lg:px-10 py-10">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-9 w-48 bg-[#E8E2DA] rounded mb-8" />
          <div className="space-y-4 mb-8">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
                <div className="w-20 h-20 bg-[#E8E2DA] rounded-lg flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-[#E8E2DA] rounded w-2/3 mb-2" />
                  <div className="h-4 bg-[#E8E2DA] rounded w-24" />
                </div>
                <div className="h-8 w-24 bg-[#E8E2DA] rounded-lg" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="h-4 bg-[#E8E2DA] rounded w-full mb-3" />
            <div className="h-4 bg-[#E8E2DA] rounded w-full mb-3" />
            <div className="h-6 bg-[#E8E2DA] rounded w-40 ml-auto mb-4" />
            <div className="h-12 bg-[#E8E2DA] rounded-full w-full" />
          </div>
        </div>
      </div>
    );
  }

  const hasItems = localItems.length > 0 || (shopifyCart?.lines?.edges?.length ?? 0) > 0;

  return (
    <div className="px-6 lg:px-10 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#333] mb-8">Shopping Cart</h1>

        {!hasItems ? (
          <div className="text-center py-20">
            <p className="text-lg text-[#555] mb-6">Your cart is empty.</p>
            <a
              href={resolveUrl('/products')}
              className="inline-block px-7 py-3 rounded-full text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              style={{ backgroundColor: '#8B5A2B' }}
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <>
            {/* Shopify Cart Items */}
            {shopifyCart && shopifyCart.lines.edges.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-[#333] mb-4">Store Items</h2>
                <div className="space-y-4">
                  {shopifyCart.lines.edges.map(({ node: line }) => (
                    <div
                      key={line.id}
                      className={`flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm transition-opacity ${
                        updatingLineId === line.id ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      <a href={resolveUrl(`/products/${line.merchandise.product.handle}/`)}>
                        {line.merchandise.product.images.edges[0]?.node && (
                          <img
                            src={line.merchandise.product.images.edges[0].node.url}
                            alt={line.merchandise.product.images.edges[0].node.altText || line.merchandise.product.title}
                            loading="lazy"
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                      </a>
                      <div className="flex-1">
                        <a href={resolveUrl(`/products/${line.merchandise.product.handle}/`)}>
                          <h3 className="font-medium text-[#333] hover:text-[#8B5A2B] transition">{line.merchandise.product.title}</h3>
                        </a>
                        {line.merchandise.title !== 'Default Title' && (
                          <p className="text-xs text-[#888]">{line.merchandise.title}</p>
                        )}
                        <p className="text-sm text-[#8B5A2B] font-semibold">
                          {formatPrice(line.merchandise.price.amount, line.merchandise.price.currencyCode)}
                        </p>
                      </div>
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateShopifyQuantity(line.id, line.quantity - 1)}
                          disabled={updatingLineId === line.id}
                          className="px-3 py-1.5 hover:bg-[#E8E2DA] transition"
                        >
                          -
                        </button>
                        <span className="px-3 py-1.5 text-sm font-medium min-w-[2rem] text-center">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() => updateShopifyQuantity(line.id, line.quantity + 1)}
                          disabled={updatingLineId === line.id}
                          className="px-3 py-1.5 hover:bg-[#E8E2DA] transition"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeShopifyLine(line.id)}
                        disabled={updatingLineId === line.id}
                        className="text-[#999] hover:text-red-500 transition p-1"
                        title="Remove"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Local Cart Items (Amazon products) */}
            {localItems.length > 0 && (
              <div className="mb-8">
                {shopifyCart && shopifyCart.lines.edges.length > 0 && (
                  <h2 className="text-lg font-bold text-[#333] mb-4">Amazon Items</h2>
                )}
                <div className="space-y-4">
                  {localItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm"
                    >
                      <a href={resolveUrl(`/products/${item.handle}/`)}>
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </a>
                      <div className="flex-1">
                        <a href={resolveUrl(`/products/${item.handle}/`)}>
                          <h3 className="font-medium text-[#333] hover:text-[#8B5A2B] transition">{item.title}</h3>
                        </a>
                        <p className="text-sm text-[#8B5A2B] font-semibold">{formatPrice(item.price, STORE_CURRENCY)}</p>
                      </div>
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateLocalQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1.5 hover:bg-[#E8E2DA] transition"
                        >
                          -
                        </button>
                        <span className="px-3 py-1.5 text-sm font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateLocalQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1.5 hover:bg-[#E8E2DA] transition"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeLocal(item.id)}
                        className="text-[#999] hover:text-red-500 transition p-1"
                        title="Remove"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cart Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#555]">Store Subtotal</span>
                <span className="text-sm text-[#333]">{formatPrice(shopifySubtotal, shopifyCart?.cost.subtotalAmount.currencyCode || STORE_CURRENCY)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-[#555]">Amazon Items Subtotal</span>
                <span className="text-sm text-[#333]">{formatPrice(localSubtotal, STORE_CURRENCY)}</span>
              </div>
              <div className="border-t border-[#E8E2DA] pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-[#333]">Total</span>
                  <span className="text-xl font-bold text-[#8B5A2B]">{formatPrice(totalSubtotal, shopifyCart?.cost.totalAmount.currencyCode || STORE_CURRENCY)}</span>
                </div>
              </div>

              {shopifyCart?.checkoutUrl && (
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-full text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ backgroundColor: '#8B5A2B' }}
                >
                  Proceed to Checkout
                </button>
              )}

              {localItems.length > 0 && (
                <p className="mt-3 text-xs text-[#555] text-center">
                  Amazon items will need to be purchased separately on Amazon.
                  Store items can be checked out via Shopify.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
