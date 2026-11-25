'use client';

import { formatPrice } from '@/lib/currency';
import { v2url } from '@/lib/v2paths';
import { useCustomer } from '@/lib/use-customer';
import { OrderRow, fulfillmentLabel, orderDate, financialBadge } from '@/components/v2/AccountOrderBits';

/**
 * /account/orders（批次 2）：无 ?id= → 列表（近 10 单）；?id= → 详情
 * （静态导出无法做 [id] 动态路由——订单 id 运行时才存在、无法 generateStaticParams，
 * 故用 query 传参，与任务书七"冲突时以本文件为准"精神一致，已记录）。
 * 详情页含追踪入口：Track this order → /orders/track/?order=<订单号>（预填，B1）。
 */
export default function AccountOrdersPage() {
  const { profile, loading } = useCustomer();

  const orderId = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('id') || ''
    : '';
  const order = orderId && profile ? profile.orders.find((o) => o.id === orderId) : undefined;

  if (loading || !profile) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-warm-gray rounded w-1/3" />
        <div className="h-24 bg-warm-gray rounded-2xl" />
        <div className="h-24 bg-warm-gray rounded-2xl" />
      </div>
    );
  }

  // ── 详情视图 ──
  if (orderId) {
    if (!order) {
      return (
        <div className="rounded-2xl border border-warm-gray bg-white p-8 text-center">
          <p className="text-sm text-charcoal-light">Order not found in your recent orders.</p>
          <a href={v2url('/account/orders/')} className="mt-3 inline-block text-xs font-semibold text-brand hover:underline underline-offset-2">← Back to orders</a>
        </div>
      );
    }

    // 追踪入口（B1）：Shopify 订单号（name 如 #1042）映射查单页订单号预填；
    // 预售订单在台账里另有 MK-xxxx 号——预填 Shopify 号，台账订单号一致时直接命中
    const trackHref = v2url(`/orders/track/?order=${encodeURIComponent(order.name.replace(/^#/, 'MK-'))}`);
    const shipped = order.fulfillmentStatus === 'FULFILLED';

    return (
      <div className="space-y-5">
        <a href={v2url('/account/orders/')} className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline underline-offset-2">
          ← All orders
        </a>

        <div className="rounded-2xl border border-warm-gray bg-white p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-bold text-charcoal">Order {order.name}</h2>
            <span className="text-sm font-bold text-brand">
              {order.totalPrice ? formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode) : ''}
            </span>
          </div>
          <p className="mt-1 text-xs text-charcoal-light">
            Placed {orderDate(order.processedAt || '')}
            {order.financialStatus ? ` · ${financialBadge(order.financialStatus)}` : ''}
            {` · ${fulfillmentLabel(order)}`}
          </p>
          {order.statusUrl && (
            <a
              href={order.statusUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs font-semibold text-brand hover:underline underline-offset-2"
            >
              View in Shopify order status page ↗
            </a>
          )}

          {/* 追踪入口卡（B1）：预售/海运订单九段进度在查单页 */}
          <div className="mt-4 rounded-xl bg-cream border border-warm-gray p-3.5">
            <p className="text-xs font-semibold text-charcoal">Pre-order or sea-freight tracking</p>
            <p className="mt-0.5 text-[11px] text-charcoal-light">
              {shipped
                ? 'This order has shipped — carrier tracking is in your shipping confirmation email.'
                : 'Follow your order from workshop to door with your order number and email.'}
            </p>
            <a href={trackHref} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline underline-offset-2">
              Track this order →
            </a>
          </div>
        </div>

        {/* 行项目 */}
        <section className="rounded-2xl border border-warm-gray bg-white">
          <h3 className="border-b border-warm-gray px-5 py-3 text-sm font-semibold text-charcoal">Items</h3>
          <ul className="divide-y divide-warm-gray">
            {order.lineItems.edges.map(({ node: line }, i) => (
              <li key={i} className="flex items-center gap-3 px-5 py-3">
                {line.variant?.image?.url && (
                  <img src={line.variant.image.url} alt="" className="h-14 w-14 rounded-lg border border-warm-gray object-cover flex-shrink-0" loading="lazy" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-charcoal line-clamp-2">{line.title}</p>
                  {line.variant?.title && line.variant.title !== 'Default Title' && (
                    <p className="text-xs text-charcoal-light">{line.variant.title}</p>
                  )}
                </div>
                <p className="text-sm font-semibold text-charcoal flex-shrink-0">× {line.quantity}</p>
                <p className="w-16 text-right text-sm text-charcoal flex-shrink-0">
                  {line.variant?.price ? formatPrice(line.variant.price.amount, line.variant.price.currencyCode) : ''}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* 地址 + 金额明细 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <section className="rounded-2xl border border-warm-gray bg-white p-5">
            <h3 className="text-sm font-semibold text-charcoal mb-2">Shipping address</h3>
            {order.shippingAddress ? (
              <address className="not-italic text-xs leading-relaxed text-charcoal-light">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                {order.shippingAddress.address1}<br />
                {order.shippingAddress.address2 && <>{order.shippingAddress.address2}<br /></>}
                {order.shippingAddress.city}{order.shippingAddress.province ? `, ${order.shippingAddress.province}` : ''} {order.shippingAddress.zip}<br />
                {order.shippingAddress.country}
                {order.shippingAddress.phone && <><br />{order.shippingAddress.phone}</>}
              </address>
            ) : (
              <p className="text-xs text-charcoal-light">—</p>
            )}
          </section>
          <section className="rounded-2xl border border-warm-gray bg-white p-5">
            <h3 className="text-sm font-semibold text-charcoal mb-2">Totals</h3>
            <dl className="space-y-1.5 text-xs">
              {order.subtotalPrice && (
                <div className="flex justify-between"><dt className="text-charcoal-light">Subtotal</dt><dd className="text-charcoal">{formatPrice(order.subtotalPrice.amount, order.subtotalPrice.currencyCode)}</dd></div>
              )}
              {order.totalShippingPrice && (
                <div className="flex justify-between"><dt className="text-charcoal-light">Shipping</dt><dd className="text-charcoal">{formatPrice(order.totalShippingPrice.amount, order.totalShippingPrice.currencyCode)}</dd></div>
              )}
              {order.totalTax && (
                <div className="flex justify-between"><dt className="text-charcoal-light">Tax</dt><dd className="text-charcoal">{formatPrice(order.totalTax.amount, order.totalTax.currencyCode)}</dd></div>
              )}
              {order.totalPrice && (
                <div className="flex justify-between border-t border-warm-gray pt-1.5"><dt className="font-semibold text-charcoal">Total</dt><dd className="font-bold text-brand">{formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}</dd></div>
              )}
            </dl>
          </section>
        </div>
      </div>
    );
  }

  // ── 列表视图 ──
  const list = profile.orders.slice(0, 10);
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-charcoal mb-3">Orders ({profile.orders.length})</h2>
      {list.length === 0 ? (
        <div className="rounded-2xl border border-warm-gray bg-white p-8 text-center">
          <p className="text-sm text-charcoal-light">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {list.map((o) => <OrderRow key={o.id} order={o} />)}
          {profile.orders.length > 10 && (
            <p className="text-xs text-charcoal-light">Showing your 10 most recent orders.</p>
          )}
        </div>
      )}
    </div>
  );
}
