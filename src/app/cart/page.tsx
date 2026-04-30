'use client';

import { useState, useEffect } from 'react';
import { resolveUrl } from '@/lib/paths';
import { removeFromLocalCart, updateLocalCartQuantity, getShopifyCart, LocalCartItem } from '@/lib/cart';

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
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('makimoo-cart', JSON.stringify(localItems));
  }, [localItems]);

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

  // Calculate totals
  const localSubtotal = localItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const shopifySubtotal = shopifyCart ? parseFloat(shopifyCart.cost.subtotalAmount.amount) : 0;
  const totalSubtotal = localSubtotal + shopifySubtotal;

  const handleCheckout = () => {
    if (shopifyCart?.checkoutUrl) {
      window.open(shopifyCart.checkoutUrl, '_blank');
    } else {
      alert('Please purchase on Amazon using the product links for items not yet available in our store.');
    }
  };

  if (loading) {
    return (
      <div className="px-6 lg:px-10 py-20 text-center">
        <p className="text-[#555]">Loading cart...</p>
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
                      className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm"
                    >
                      {line.merchandise.product.images.edges[0]?.node && (
                        <img
                          src={line.merchandise.product.images.edges[0].node.url}
                          alt={line.merchandise.product.images.edges[0].node.altText || line.merchandise.product.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-[#333]">{line.merchandise.product.title}</h3>
                        {line.merchandise.title !== 'Default Title' && (
                          <p className="text-xs text-[#888]">{line.merchandise.title}</p>
                        )}
                        <p className="text-sm text-[#8B5A2B] font-semibold">
                          ${line.merchandise.price.amount} {line.merchandise.price.currencyCode}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-[#333]">
                        Qty: {line.quantity}
                      </div>
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
                        <p className="text-sm text-[#8B5A2B] font-semibold">${item.price}</p>
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
                <span className="text-sm text-[#333]">${shopifySubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-[#555]">Amazon Items Subtotal</span>
                <span className="text-sm text-[#333]">${localSubtotal.toFixed(2)}</span>
              </div>
              <div className="border-t border-[#E8E2DA] pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-[#333]">Total</span>
                  <span className="text-xl font-bold text-[#8B5A2B]">${totalSubtotal.toFixed(2)}</span>
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
