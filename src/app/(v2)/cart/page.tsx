'use client';

import { useState, useEffect } from 'react';
import V2PageHeader from '@/components/v2/V2PageHeader';
import { removeFromLocalCart, updateLocalCartQuantity, getShopifyCart, updateShopifyCartLine, removeShopifyCartLine, LocalCartItem } from '@/lib/cart';
import { formatPrice, STORE_CURRENCY } from '@/lib/currency';
import { trackEvent, GA_CURRENCY, GaItem } from '@/lib/gtag';
import { v2url } from '@/lib/v2paths';

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

export default function V2CartPage() {
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

  const hasItems = localItems.length > 0 || (shopifyCart?.lines?.edges?.length ?? 0) > 0;
  const hasShopifyLines = (shopifyCart?.lines?.edges?.length ?? 0) > 0;

  // 数量步进器（Shopify 行带更新中禁用态）
  const stepper = (qty: number, onChange: (qty: number) => void, disabled = false) => (
    <div className="flex items-center border border-warm-gray rounded-full overflow-hidden bg-white">
      <button
        onClick={() => onChange(qty - 1)}
        disabled={disabled}
        className="w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center text-charcoal hover:bg-off-white transition disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="px-2 text-sm font-medium min-w-[2rem] text-center text-charcoal">{qty}</span>
      <button
        onClick={() => onChange(qty + 1)}
        disabled={disabled}
        className="w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center text-charcoal hover:bg-off-white transition disabled:opacity-40"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );

  const removeBtn = (onRemove: () => void, disabled = false) => (
    <button
      onClick={onRemove}
      disabled={disabled}
      className="text-charcoal-light/60 hover:text-brand transition p-1 disabled:opacity-40"
      title="Remove"
      aria-label="Remove item"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    </button>
  );

  return (
    <>
      <V2PageHeader
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Shopping Cart' }]}
        title="Shopping Cart"
        subtitle="Review your items and check out securely via Shopify."
      />

      <section className="bg-off-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 lg:py-16">
          {loading ? (
            /* 加载骨架：行卡片 + 摘要卡同位占位 */
            <div className="max-w-5xl mx-auto animate-pulse lg:grid lg:grid-cols-[1fr_380px] lg:gap-10 lg:items-start">
              <div className="space-y-4 mb-8 lg:mb-0">
                {[0, 1].map((i) => (
                  <div key={i} className="flex items-center gap-4 bg-white rounded-2xl border border-warm-gray p-4 sm:p-5">
                    <div className="w-20 h-20 lg:w-24 lg:h-24 bg-warm-gray rounded-lg flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-4 bg-warm-gray rounded w-2/3 mb-2" />
                      <div className="h-4 bg-warm-gray rounded w-24" />
                    </div>
                    <div className="h-9 w-28 bg-warm-gray rounded-full" />
                  </div>
                ))}
              </div>
              <div className="bg-cream rounded-2xl border border-warm-gray p-6 lg:p-8">
                <div className="h-4 bg-warm-gray rounded w-full mb-3" />
                <div className="h-4 bg-warm-gray rounded w-full mb-3" />
                <div className="h-6 bg-warm-gray rounded w-40 ml-auto mb-5" />
                <div className="h-12 bg-warm-gray rounded-full w-full" />
              </div>
            </div>
          ) : !hasItems ? (
            /* 空购物车态 */
            <div className="text-center py-16 lg:py-24">
              <p className="text-xl font-bold text-charcoal mb-2">Your cart is empty.</p>
              <p className="text-sm text-charcoal-light mb-8">
                Browse our collections and find something comfortable.
              </p>
              <a
                href={v2url('/products/')}
                className="inline-block px-8 py-3.5 rounded-full bg-brand text-cream text-sm font-semibold transition hover:bg-brand-dark"
              >
                Continue Shopping
              </a>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-10 lg:items-start">
              <div>
                {/* Shopify Cart Items */}
                {shopifyCart && hasShopifyLines && (
                  <div className="mb-8">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-light mb-4">
                      Store Items
                    </h2>
                    <div className="space-y-4">
                      {shopifyCart.lines.edges.map(({ node: line }) => (
                        <div
                          key={line.id}
                          className={`flex items-center gap-4 bg-white rounded-2xl border border-warm-gray p-4 sm:p-5 transition-opacity ${
                            updatingLineId === line.id ? 'opacity-50 pointer-events-none' : ''
                          }`}
                        >
                          <a href={v2url(`/products/${line.merchandise.product.handle}/`)} className="flex-shrink-0">
                            {line.merchandise.product.images.edges[0]?.node && (
                              <img
                                src={line.merchandise.product.images.edges[0].node.url}
                                alt={line.merchandise.product.images.edges[0].node.altText || line.merchandise.product.title}
                                loading="lazy"
                                className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-lg"
                              />
                            )}
                          </a>
                          <div className="flex-1 min-w-0">
                            <a href={v2url(`/products/${line.merchandise.product.handle}/`)}>
                              <h3 className="font-semibold text-charcoal hover:text-brand transition truncate">
                                {line.merchandise.product.title}
                              </h3>
                            </a>
                            {line.merchandise.title !== 'Default Title' && (
                              <p className="text-xs text-charcoal-light mt-0.5">{line.merchandise.title}</p>
                            )}
                            <p className="text-sm text-brand font-semibold mt-1">
                              {formatPrice(line.merchandise.price.amount, line.merchandise.price.currencyCode)}
                            </p>
                          </div>
                          {stepper(
                            line.quantity,
                            (qty) => updateShopifyQuantity(line.id, qty),
                            updatingLineId === line.id
                          )}
                          {removeBtn(() => removeShopifyLine(line.id), updatingLineId === line.id)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Local Cart Items (Amazon products) */}
                {localItems.length > 0 && (
                  <div className="mb-8 lg:mb-0">
                    {hasShopifyLines && (
                      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-light mb-4">
                        Amazon Items
                      </h2>
                    )}
                    <div className="space-y-4">
                      {localItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 bg-white rounded-2xl border border-warm-gray p-4 sm:p-5"
                        >
                          <a href={v2url(`/products/${item.handle}/`)} className="flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-lg"
                            />
                          </a>
                          <div className="flex-1 min-w-0">
                            <a href={v2url(`/products/${item.handle}/`)}>
                              <h3 className="font-semibold text-charcoal hover:text-brand transition truncate">
                                {item.title}
                              </h3>
                            </a>
                            <p className="text-sm text-brand font-semibold mt-1">
                              {formatPrice(item.price, STORE_CURRENCY)}
                            </p>
                          </div>
                          {stepper(item.quantity, (qty) => updateLocalQuantity(item.id, qty))}
                          {removeBtn(() => removeLocal(item.id))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 订单摘要卡 */}
              <aside className="bg-cream rounded-2xl border border-warm-gray p-6 lg:p-8 lg:sticky lg:top-32">
                <h2 className="text-lg font-bold text-charcoal mb-5">Order Summary</h2>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-charcoal-light">Store Subtotal</span>
                  <span className="text-sm text-charcoal">
                    {formatPrice(shopifySubtotal, shopifyCart?.cost.subtotalAmount.currencyCode || STORE_CURRENCY)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-charcoal-light">Amazon Items Subtotal</span>
                  <span className="text-sm text-charcoal">{formatPrice(localSubtotal, STORE_CURRENCY)}</span>
                </div>
                <div className="border-t border-warm-gray pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-charcoal">Total</span>
                    <span className="text-xl font-extrabold text-brand">
                      {formatPrice(totalSubtotal, shopifyCart?.cost.totalAmount.currencyCode || STORE_CURRENCY)}
                    </span>
                  </div>
                </div>

                {shopifyCart?.checkoutUrl && (
                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 rounded-full bg-brand text-cream text-sm font-semibold transition hover:bg-brand-dark"
                  >
                    Proceed to Checkout
                  </button>
                )}

                {localItems.length > 0 && (
                  <p className="mt-4 text-xs text-charcoal-light text-center leading-relaxed">
                    Amazon items will need to be purchased separately on Amazon.
                    Store items can be checked out via Shopify.
                  </p>
                )}

                <a
                  href={v2url('/products/')}
                  className="mt-4 block text-center text-sm font-semibold text-brand hover:underline underline-offset-4"
                >
                  Continue Shopping
                </a>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
