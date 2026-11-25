'use client';

import { useEffect, useState } from 'react';
import { useCustomer } from '@/lib/use-customer';
import { fetchMyCoupons, type MyCoupon } from '@/lib/rewards';

/**
 * My Rewards 卡（2026-11-21 登录激励批次 T2）：列出当前登录账号已获券码 + 使用说明。
 * 数据 = GET /api/rewards?emailHash=<sha256(email:SALT)>（无邮箱明文跨域传输；
 * admin 发放开关关闭时链路静默，这里永远空列表）。AccountGuard 已保证登录态。
 */

const REASON_LINE: Record<MyCoupon['reason'], string> = {
  review: 'Earned for a published review',
  signup: 'Welcome reward',
  'notify-consent': 'Earned for joining the notify list',
};

export default function RewardsClient() {
  const { profile, loading } = useCustomer();
  const [coupons, setCoupons] = useState<MyCoupon[] | null>(null); // null = 加载中

  useEffect(() => {
    if (!profile?.email) return;
    let cancelled = false;
    fetchMyCoupons(profile.email).then((items) => {
      if (!cancelled) setCoupons(items);
    });
    return () => { cancelled = true; };
  }, [profile]);

  if (loading || !profile) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-24 bg-warm-gray rounded-2xl" />
        <div className="h-24 bg-warm-gray rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-charcoal mb-3">My Rewards</h2>
        {coupons === null ? (
          <div className="h-24 animate-pulse rounded-2xl bg-warm-gray" />
        ) : coupons.length === 0 ? (
          <div className="rounded-2xl border border-warm-gray bg-white p-8 text-center">
            <p className="text-sm text-charcoal">No rewards yet.</p>
            <p className="mt-1.5 text-xs text-charcoal-light leading-relaxed">
              Write a signed-in review, join a notify list, or create your account to start earning.
            </p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {coupons.map((c) => (
              <li key={c.code} className="sm:flex sm:items-center sm:gap-3 rounded-2xl border border-warm-gray bg-white p-4">
                {/* 移动端上下堆叠（375px 描述列不再被券码徽章+Single use 挤窄），桌面端单行 */}
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-cream px-3 py-1.5 font-mono text-sm font-bold tracking-wide text-brand">
                    {c.code}
                  </span>
                  <span className="ml-auto sm:ml-0 text-[11px] uppercase tracking-wide text-charcoal-light/70 whitespace-nowrap">Single use</span>
                </div>
                <div className="mt-2 sm:mt-0 sm:ml-3 sm:min-w-0 sm:flex-1">
                  <p className="text-sm font-semibold text-charcoal">{c.percentOff}% off</p>
                  <p className="text-xs text-charcoal-light">{REASON_LINE[c.reason] ?? 'Reward'}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="text-xs text-charcoal-light leading-relaxed">
        Available at checkout when payment goes live. Rewards are tied to your account — no codes to keep track of.
      </p>
    </div>
  );
}
