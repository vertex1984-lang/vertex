'use client';

import { formatPrice } from '@/lib/currency';
import { v2url } from '@/lib/v2paths';
import type { CustomerOrder } from '@/lib/customer';

/**
 * 账号订单共享渲染件（批次 2）：状态映射 + 订单行卡（概览页 / 订单列表页共用）。
 */
export function fulfillmentLabel(o: Pick<CustomerOrder, 'fulfillmentStatus'>): string {
  switch (o.fulfillmentStatus) {
    case 'FULFILLED': return 'Shipped';
    case 'PARTIALLY_FULFILLED': return 'Partially shipped';
    case 'ON_HOLD': return 'On hold';
    case 'UNFULFILLED': return 'Preparing';
    default: return 'Processing';
  }
}

export function orderDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function financialBadge(cls: string | null | undefined): string {
  switch ((cls || '').toUpperCase()) {
    case 'PAID': return 'Paid';
    case 'PENDING': return 'Pending';
    case 'AUTHORIZED': return 'Authorized';
    case 'REFUNDED': return 'Refunded';
    case 'VOIDED': return 'Voided';
    default: return cls || '';
  }
}

export function OrderRow({ order }: { order: CustomerOrder }) {
  return (
    <a
      href={v2url(`/account/orders/?id=${encodeURIComponent(order.id)}`)}
      className="flex items-center justify-between gap-3 rounded-2xl border border-warm-gray bg-white p-4 transition hover:border-brand/50"
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-charcoal">#{order.orderNumber}</p>
        {/* Order 无 createdAt（验收 P0-3），下单时间用 processedAt */}
        <p className="text-xs text-charcoal-light">{orderDate(order.processedAt || '')}</p>
        <p className="mt-0.5 text-xs text-charcoal-light">
          {fulfillmentLabel(order)}{order.financialStatus ? ` · ${financialBadge(order.financialStatus)}` : ''}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-sm font-bold text-brand">
          {order.totalPrice ? formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode) : '—'}
        </span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal-light" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </a>
  );
}
