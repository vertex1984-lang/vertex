'use client';

import { useEffect, useState } from 'react';
import { v2url } from '@/lib/v2paths';
import { useCustomer } from '@/lib/use-customer';
import { orderEmailHash, type TrackedOrder } from '@/lib/track';
import { fetchMyCoupons, type MyCoupon } from '@/lib/rewards';
import AccountPreorderCard from '@/components/v2/AccountPreorderCard';
import { OrderRow } from '@/components/v2/AccountOrderBits';

/**
 * /account 概览（批次 2 + 批次 3 任务 4）：欢迎语 + 预售进度卡（登录邮箱哈希命中
 * order-status.json 的订单才渲染，无命中零噪音）+ 最近订单卡 + 闸门 A 待接入占位。
 */
export default function AccountOverviewPage() {
  const { profile, loading, error } = useCustomer();
  // 预售进度（任务 4）：null = 匹配中（不渲染区块）
  const [preorders, setPreorders] = useState<TrackedOrder[] | null>(null);
  // My Rewards 摘要（2026-11-21 登录激励批次 T2）：null = 加载中（不渲染）
  const [coupons, setCoupons] = useState<MyCoupon[] | null>(null);

  useEffect(() => {
    if (!profile) return;
    fetchMyCoupons(profile.email).then(setCoupons);
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/data/order-status.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(String(res.status));
        const file = (await res.json()) as { orders?: TrackedOrder[] };
        // 逐单比对：sha256(email:orderNo:SALT) 前 16 位 == emailHash（无邮箱明文）
        const hits: TrackedOrder[] = [];
        for (const o of file.orders ?? []) {
          const h = await orderEmailHash(profile.email, o.orderNo);
          if (h === o.emailHash) hits.push(o);
        }
        if (!cancelled) setPreorders(hits.slice(0, 3));
      } catch {
        if (!cancelled) setPreorders([]);
      }
    })();
    return () => { cancelled = true; };
  }, [profile]);

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

      {/* 预售进度（批次 3 任务 4）：命中才渲染，无命中零噪音 */}
      {preorders !== null && preorders.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-charcoal">Your pre-orders</h3>
          <div className="space-y-2.5">
            {preorders.map((o) => <AccountPreorderCard key={o.orderNo} order={o} />)}
          </div>
        </section>
      )}

      {/* My Rewards 摘要（T2）：有券才渲染卡片（无券零噪音），点进 Rewards 页看明细 */}
      {coupons !== null && coupons.length > 0 && (
        <section>
          <div className="rounded-2xl border border-brand/35 bg-brand/5 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-charcoal">My Rewards · {coupons.length} code{coupons.length > 1 ? 's' : ''}</p>
                <p className="mt-0.5 text-xs text-charcoal-light">
                  Latest: <span className="font-mono font-bold text-brand">{coupons[0].code}</span> — {coupons[0].percentOff}% off, single use
                </p>
              </div>
              <a href={v2url('/account/rewards/')} className="text-xs font-semibold text-brand hover:underline underline-offset-2 whitespace-nowrap">
                View rewards
              </a>
            </div>
          </div>
        </section>
      )}

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

      {/* 闸门 A 待接入占位（真实取消/退换货等 Admin API 能力到位后启用；订单自动回流同依赖，TODO） */}
      <section>
        <div className="rounded-2xl border border-dashed border-warm-gray bg-cream/60 p-4 opacity-80">
          <p className="text-sm font-semibold text-charcoal-light">Returns & self-service cancellation</p>
          <p className="mt-0.5 text-xs text-charcoal-light">Coming soon — manage returns and pre-order cancellation right from your account.</p>
        </div>
      </section>
    </div>
  );
}
