'use client';

import { v2url } from '@/lib/v2paths';
import { useCustomer } from '@/lib/use-customer';
import { OrderRow } from '@/components/v2/AccountOrderBits';

/**
 * /account 概览（批次 2）：欢迎语 + 最近订单卡 + 闸门 A 待接入占位。
 */
export default function AccountOverviewPage() {
  const { profile, loading, error } = useCustomer();

  if (loading || !profile) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-warm-gray rounded w-1/2" />
        <div className="h-28 bg-warm-gray rounded-2xl" />
        <div className="h-28 bg-warm-gray rounded-2xl" />
      </div>
    );
  }

  const firstName = profile.firstName?.trim();
  const recent = profile.orders.slice(0, 3);

  return (
    <div className="space-y-8">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <section>
        <h2 className="text-lg lg:text-2xl font-extrabold text-charcoal">
          {firstName ? `Hello, ${firstName}` : 'Hello'} 👋
        </h2>
        <p className="mt-1 text-sm text-charcoal-light">{profile.email}</p>
      </section>

      {/* 最近订单 */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-charcoal">Recent orders</h3>
          <a href={v2url('/account/orders/')} className="text-xs font-semibold text-brand hover:underline underline-offset-2">View all</a>
        </div>
        {recent.length === 0 ? (
          <div className="rounded-2xl border border-warm-gray bg-white p-8 text-center">
            <p className="text-sm text-charcoal-light">No orders yet.</p>
            <a href={v2url('/categories/')} className="mt-3 inline-block px-6 py-2.5 rounded-full border-2 border-brand text-brand text-xs font-semibold uppercase tracking-wide transition hover:bg-brand hover:text-cream">
              Start shopping
            </a>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recent.map((o) => <OrderRow key={o.id} order={o} />)}
          </div>
        )}
      </section>

      {/* 快捷入口 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a href={v2url('/account/wishlist/')} className="rounded-2xl border border-warm-gray bg-white p-4 transition hover:border-brand/50">
          <p className="text-sm font-semibold text-charcoal">Wishlist</p>
          <p className="mt-0.5 text-xs text-charcoal-light">Products you saved for later — synced across devices when signed in.</p>
        </a>
        <a href={v2url('/orders/track/')} className="rounded-2xl border border-warm-gray bg-white p-4 transition hover:border-brand/50">
          <p className="text-sm font-semibold text-charcoal">Track a pre-order</p>
          <p className="mt-0.5 text-xs text-charcoal-light">Follow your order from workshop to door, no sign-in needed.</p>
        </a>
      </section>

      {/* 闸门 A 待接入占位（真实取消/退换货等 Admin API 能力到位后启用） */}
      <section>
        <div className="rounded-2xl border border-dashed border-warm-gray bg-cream/60 p-4 opacity-80">
          <p className="text-sm font-semibold text-charcoal-light">Returns & self-service cancellation</p>
          <p className="mt-0.5 text-xs text-charcoal-light">Coming soon — manage returns and pre-order cancellation right from your account.</p>
        </div>
      </section>
    </div>
  );
}
