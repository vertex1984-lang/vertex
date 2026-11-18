'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { resolveUrl } from '@/lib/paths';
import {
  getLocalCart,
  updateLocalCartQuantity,
  removeFromLocalCart,
  getShopifyCart,
  updateShopifyCartLine,
  removeShopifyCartLine,
  addToShopifyCart,
  notifyCartUpdated,
  LocalCartItem,
} from '@/lib/cart';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { formatPrice } from '@/lib/currency';
import { trackBeginCheckout, GaItem } from '@/lib/gtag';
import { PreorderLineNote } from '@/components/v2/PreorderBox';
import { validateCheckout } from '@/lib/checkout-guard';
import { useToast } from '@/components/Toast';
import PayIcons from '@/components/v2/PayIcons';

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
  };
}

export default function MiniCart() {
  const [open, setOpen] = useState(false);
  const [localItems, setLocalItems] = useState<LocalCartItem[]>([]);
  const [shopifyCart, setShopifyCart] = useState<ShopifyCart | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [addingHandle, setAddingHandle] = useState<string | null>(null);
  // 结算前置校验进行中（批次 5 T2：按钮 loading 态防双击双开）
  const [guardBusy, setGuardBusy] = useState(false);
  const { toast } = useToast();

  const refresh = useCallback(async () => {
    setLocalItems(getLocalCart());
    const cart = await getShopifyCart();
    setShopifyCart((cart as ShopifyCart) ?? null);
  }, []);

  // 结算前置校验（批次 5 T2 设计书任务 2，与 cart 页同构）：
  // ① 同步占位窗（手势栈内防拦截）→ ② L1 cart 有效性 + L2 checkoutUrl 可达 →
  // ③ 成功才发 GA4 begin_checkout 并改址；⑤ 失败关占位窗 + 友好提示，不伪装成功
  const handleMiniCartCheckout = async () => {
    if (!shopifyCart?.checkoutUrl || guardBusy) return; // 防双击双开
    setGuardBusy(true);
    // ① 同步占位窗：必须在用户手势同步栈内 open（await 后再 open 被弹窗拦截器拦掉）
    const win = window.open('', '_blank');
    win?.document.write('<p style="font-family:sans-serif;padding:2rem">Redirecting to checkout…</p>');
    // ② 前置校验（getShopifyCart 内建自愈：坏 cartId 自动清理）
    const guard = await validateCheckout(() => getShopifyCart() as Promise<ShopifyCart | null>);
    if (guard.ok) {
      // ③ GA4：begin_checkout 只在「校验成功、即将跳转」时发（从 onClick 开头搬家到位）
      const items: GaItem[] = shopifyCart.lines.edges.map(({ node: line }) => ({
        item_id: line.merchandise.product.handle,
        item_name: line.merchandise.product.title,
        price: parseFloat(line.merchandise.price.amount),
        quantity: line.quantity,
      }));
      trackBeginCheckout(parseFloat(shopifyCart.cost.subtotalAmount.amount) || 0, items);
      // ④ 占位窗改址（占位窗被拦截器误杀的兜底：退回直接 open）
      if (win) {
        win.location.href = shopifyCart.checkoutUrl;
      } else {
        window.open(shopifyCart.checkoutUrl, '_blank');
      }
      setGuardBusy(false);
      return;
    }
    // ⑤ 失败：关占位窗 + 友好提示 + 购物车 UI 恢复（Shopify 行清空、本地行保留）
    win?.close();
    if (guard.reason === 'cart-invalid') {
      toast('Your cart session expired — please add items again.');
      setShopifyCart(null);
      notifyCartUpdated();
    } else {
      toast("Checkout isn't available right now — please try again shortly.");
    }
    setGuardBusy(false);
  };

  // 打开事件 + 购物车变化时刷新
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('makimoo:minicart-open', onOpen);
    window.addEventListener('makimoo:cart-updated', refresh);
    return () => {
      window.removeEventListener('makimoo:minicart-open', onOpen);
      window.removeEventListener('makimoo:cart-updated', refresh);
    };
  }, [refresh]);

  // 打开时拉取最新 Shopify 购物车；锁定背景滚动
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return;
    }
    refresh();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, refresh]);

  // Esc 关闭
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const updateLocalQuantity = (id: string, qty: number) => {
    const updated = qty < 1 ? removeFromLocalCart(id) : updateLocalCartQuantity(id, qty);
    setLocalItems([...updated]);
  };

  const updateShopifyQuantity = async (lineId: string, qty: number) => {
    setUpdatingId(lineId);
    const cart = qty < 1 ? await removeShopifyCartLine(lineId) : await updateShopifyCartLine(lineId, qty);
    if (cart) setShopifyCart(cart as ShopifyCart);
    setUpdatingId(null);
  };

  const removeShopifyLine = async (lineId: string) => {
    setUpdatingId(lineId);
    const cart = await removeShopifyCartLine(lineId);
    if (cart) setShopifyCart(cart as ShopifyCart);
    setUpdatingId(null);
  };

  const shopifyLines = useMemo(() => shopifyCart?.lines?.edges ?? [], [shopifyCart]);
  const hasItems = localItems.length > 0 || shopifyLines.length > 0;

  // 全量产品 enrich 一次，用于购物车交叉推荐
  const enriched = useMemo(() => enrichProductsWithShopifyData(PRODUCTS_DATA), []);

  // 推荐：在售且不在购物车的产品，同类目优先、低价优先，取 2 个
  const recommendations = useMemo(() => {
    if (!hasItems) return [];
    const cartHandles = new Set<string>([
      ...localItems.map(i => i.handle),
      ...shopifyLines.map(({ node }) => node.merchandise.product.handle),
    ]);
    const cartTypes = new Set(
      Array.from(cartHandles)
        .map(h => enriched.find(p => p.handle === h)?.productType)
        .filter((t): t is string => !!t)
    );
    const inStock = (p: MakimooProduct) =>
      p.hasShopifyData && p.shopifyAvailable && !!p.shopifyVariantId && !cartHandles.has(p.handle);
    return enriched
      .filter(inStock)
      .sort((a, b) => {
        const sameCatA = cartTypes.has(a.productType) ? 0 : 1;
        const sameCatB = cartTypes.has(b.productType) ? 0 : 1;
        if (sameCatA !== sameCatB) return sameCatA - sameCatB;
        const priceOf = (p: MakimooProduct) =>
          parseFloat(p.shopifyPrice || p.priceRange.minVariantPrice.amount);
        return priceOf(a) - priceOf(b);
      })
      .slice(0, 2);
  }, [hasItems, localItems, shopifyLines, enriched]);

  // 点击推荐 "+"：加购后触发 cart-updated，本抽屉监听到会自动刷新（推荐项随之消失）
  const handleAddRecommendation = async (p: MakimooProduct) => {
    if (!p.shopifyVariantId || addingHandle) return;
    setAddingHandle(p.handle);
    try {
      const ok = await addToShopifyCart(p.shopifyVariantId, 1);
      if (ok) notifyCartUpdated();
    } finally {
      setAddingHandle(null);
    }
  };

  const localSubtotal = localItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const shopifySubtotal = shopifyCart ? parseFloat(shopifyCart.cost.subtotalAmount.amount) : 0;
  const subtotal = localSubtotal + shopifySubtotal;

  return (
    <>
      {/* Overlay — 条件渲染而非 opacity-0：iOS 26 Safari 刘海采样器会读取
          opacity:0 的 fixed 元素背景色，display:none 才除外 */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[1600]"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-md z-[1700] flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: '#F8F5F0', boxShadow: '-4px 0 20px rgba(0,0,0,0.15)', paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E2DA]">
          <h2 className="text-lg font-bold text-[#333]">Your Cart</h2>
          <div className="flex items-center gap-2">
            {/* 2026-10-21 用户定：购物车抽屉头部加首页图标链接 */}
            <a
              href={resolveUrl('/')}
              className="w-9 h-9 rounded-full border border-[#E8E2DA] flex items-center justify-center text-[#333] hover:bg-[#E8E2DA] hover:text-[#8B5A2B] transition"
              aria-label="Go to homepage"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10.5 12 3l9 7.5" />
                <path d="M5 9.5V21h14V9.5" />
              </svg>
            </a>
            <button
              onClick={() => setOpen(false)}
              className="w-9 h-9 rounded-full border border-[#E8E2DA] flex items-center justify-center text-xl text-[#333] hover:bg-[#E8E2DA] hover:text-[#8B5A2B] transition"
              aria-label="Close cart"
            >
              &times;
            </button>
          </div>
        </div>

        {!hasItems ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <p className="text-[#555]">Your cart is empty.</p>
            <a
              href={resolveUrl('/categories')}
              className="px-6 py-3 rounded-full text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              style={{ backgroundColor: '#8B5A2B' }}
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {shopifyLines.map(({ node: line }) => (
                <div
                  key={line.id}
                  className={`flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm transition-opacity ${
                    updatingId === line.id ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <a href={resolveUrl(`/products/${line.merchandise.product.handle}/`)} onClick={() => setOpen(false)}>
                    {line.merchandise.product.images.edges[0]?.node && (
                      <img
                        src={line.merchandise.product.images.edges[0].node.url}
                        alt={line.merchandise.product.images.edges[0].node.altText || line.merchandise.product.title}
                        loading="lazy"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                  </a>
                  <div className="flex-1 min-w-0">
                    <a href={resolveUrl(`/products/${line.merchandise.product.handle}/`)} onClick={() => setOpen(false)}>
                      <h3 className="text-sm font-medium text-[#333] hover:text-[#8B5A2B] transition line-clamp-2">
                        {line.merchandise.product.title}
                      </h3>
                    </a>
                    <p className="text-sm text-[#8B5A2B] font-semibold mt-1">
                      {formatPrice(line.merchandise.price.amount, line.merchandise.price.currencyCode)}
                    </p>
                    {/* 预售商品交期提示（UO 式：结账前二次可见） */}
                    <PreorderLineNote handle={line.merchandise.product.handle} className="mt-0.5 text-[11px] font-semibold text-[#8B5A2B]" />
                  </div>
                  <div className="flex items-center border rounded-lg overflow-hidden flex-shrink-0">
                    <button
                      onClick={() => updateShopifyQuantity(line.id, line.quantity - 1)}
                      disabled={updatingId === line.id}
                      className="w-11 h-11 flex items-center justify-center hover:bg-[#E8E2DA] transition"
                    >
                      -
                    </button>
                    <span className="px-2 py-1 text-sm font-medium min-w-[1.75rem] text-center">{line.quantity}</span>
                    <button
                      onClick={() => updateShopifyQuantity(line.id, line.quantity + 1)}
                      disabled={updatingId === line.id}
                      className="w-11 h-11 flex items-center justify-center hover:bg-[#E8E2DA] transition"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeShopifyLine(line.id)}
                    disabled={updatingId === line.id}
                    className="text-[#999] hover:text-red-500 transition p-1 flex-shrink-0"
                    title="Remove"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              ))}

              {localItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                  <a href={resolveUrl(`/products/${item.handle}/`)} onClick={() => setOpen(false)}>
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </a>
                  <div className="flex-1 min-w-0">
                    <a href={resolveUrl(`/products/${item.handle}/`)} onClick={() => setOpen(false)}>
                      <h3 className="text-sm font-medium text-[#333] hover:text-[#8B5A2B] transition line-clamp-2">{item.title}</h3>
                    </a>
                    <p className="text-sm text-[#8B5A2B] font-semibold mt-1">{formatPrice(item.price, 'USD')}</p>
                    <PreorderLineNote handle={item.handle} className="mt-0.5 text-[11px] font-semibold text-[#8B5A2B]" />
                  </div>
                  <div className="flex items-center border rounded-lg overflow-hidden flex-shrink-0">
                    <button
                      onClick={() => updateLocalQuantity(item.id, item.quantity - 1)}
                      className="w-11 h-11 flex items-center justify-center hover:bg-[#E8E2DA] transition"
                    >
                      -
                    </button>
                    <span className="px-2 py-1 text-sm font-medium min-w-[1.75rem] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateLocalQuantity(item.id, item.quantity + 1)}
                      className="w-11 h-11 flex items-center justify-center hover:bg-[#E8E2DA] transition"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => updateLocalQuantity(item.id, 0)}
                    className="text-[#999] hover:text-red-500 transition p-1 flex-shrink-0"
                    title="Remove"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              ))}

              {/* 交叉推荐：在售且不在购物车的低价品，同类目优先 */}
              {recommendations.length > 0 && (
                <div className="border-t border-[#E8E2DA] pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#999] mb-3">
                    You May Also Need
                  </p>
                  <div className="space-y-3">
                    {recommendations.map(p => (
                      <div key={p.handle} className="flex items-center gap-3 bg-white rounded-xl p-2.5 shadow-sm">
                        <a href={resolveUrl(`/products/${p.handle}/`)} onClick={() => setOpen(false)}>
                          <img
                            src={resolveUrl(p.shopifyImages?.[0] || p.images[0]?.url || '')}
                            alt={p.title}
                            loading="lazy"
                            className={`w-12 h-12 rounded-lg object-cover ${p.imageWhiteBg?.[0] ? 'bg-white object-contain p-1' : ''}`}
                          />
                        </a>
                        <div className="flex-1 min-w-0">
                          <a href={resolveUrl(`/products/${p.handle}/`)} onClick={() => setOpen(false)}>
                            <h4 className="text-xs font-medium text-[#333] hover:text-[#8B5A2B] transition line-clamp-2">
                              {p.title}
                            </h4>
                          </a>
                          <p className="text-xs text-[#8B5A2B] font-semibold mt-0.5">
                            {formatPrice(
                              p.shopifyPrice || p.priceRange.minVariantPrice.amount,
                              p.shopifyCurrencyCode || p.priceRange.minVariantPrice.currencyCode
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAddRecommendation(p)}
                          disabled={addingHandle === p.handle}
                          aria-label={`Add ${p.title} to cart`}
                          className="w-8 h-8 rounded-full border border-[#8B5A2B] text-[#8B5A2B] flex items-center justify-center flex-shrink-0 text-sm transition hover:bg-[#8B5A2B] hover:text-white disabled:opacity-50"
                        >
                          {addingHandle === p.handle ? '...' : '+'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer: 免邮进度条 + subtotal + actions */}
            <div className="border-t border-[#E8E2DA] px-6 py-5">
              {/* 免邮进度条（$50 为 hardcode 占位阈值，待真实包邮规则确认后替换） */}
              {(() => {
                const FREE_SHIPPING_THRESHOLD = 50;
                const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
                const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
                return remaining > 0 ? (
                  <div className="mb-4">
                    <p className="text-xs text-[#555] mb-2">
                      You&apos;re <span className="font-semibold text-[#8B5A2B]">{formatPrice(remaining, 'USD')}</span> away from free shipping
                    </p>
                    <div className="h-1.5 rounded-full bg-[#E8E2DA] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%`, background: 'linear-gradient(to right, #A67C52, #8B5A2B)' }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 flex items-center gap-2 text-green-600">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <p className="text-xs font-semibold">You&apos;ve unlocked free shipping!</p>
                  </div>
                );
              })()}
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-[#555]">Subtotal</span>
                <span className="text-lg font-bold text-[#8B5A2B]">{formatPrice(subtotal, 'USD')}</span>
              </div>
              <div className="flex gap-3">
                <a
                  href={resolveUrl('/cart')}
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center px-4 py-3 rounded-full text-sm font-semibold border-2 transition hover:bg-[#E8E2DA]"
                  style={{ borderColor: '#8B5A2B', color: '#8B5A2B' }}
                >
                  View Cart
                </a>
                {shopifyCart?.checkoutUrl && (
                  <button
                    onClick={handleMiniCartCheckout}
                    disabled={guardBusy}
                    className="flex-1 px-4 py-3 rounded-full text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:hover:translate-y-0"
                    style={{ backgroundColor: '#8B5A2B' }}
                  >
                    {guardBusy ? 'Checking out…' : 'Checkout'}
                  </button>
                )}
              </div>
              {/* 支付方式信任图标条（批次 5 T2：footer 按钮组下方，flex-wrap 保 375px 不溢出） */}
              {shopifyCart?.checkoutUrl && <PayIcons className="mt-3" />}
            </div>
          </>
        )}
      </div>
    </>
  );
}
