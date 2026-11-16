'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/gtag';

/**
 * 到货通知订阅框（2026-11-15 上线方案 1.1 / 技术清单 2.1）：展示层（S1）与 Coming Soon
 * 页面的购买按钮替身——"页面完整保留，购买按钮换为到货通知邮件订阅，不留无解释的灰色按钮"。
 * 数据落 makimoo-admin 台账（/api/subscribe，x-notify-token 共享密钥，同 wishlist/reviews
 * 模式）——按 handle 分组名单，正式版可迁 Shopify customer tags/Klaviyo（技术清单备选）。
 * 预计开放时间：临时统一文案（per-SKU expectedNote 配置位 TODO）。
 * 埋点：GA4 generate_lead（官方事件，1.4 订阅数据度量）。
 */
const NOTIFY_API = process.env.NEXT_PUBLIC_NOTIFY_API || 'http://localhost:4200/api/subscribe';
const NOTIFY_TOKEN = process.env.NEXT_PUBLIC_NOTIFY_TOKEN || 'makimoo-notify-demo-token';

export default function NotifyMe({ handle, comingSoon = false }: { handle: string; comingSoon?: boolean }) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  async function submit() {
    const clean = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setErr('Please enter a valid email address.');
      return;
    }
    setBusy(true);
    setErr('');
    try {
      const r = await fetch(NOTIFY_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-notify-token': NOTIFY_TOKEN },
        body: JSON.stringify({ handle, email: clean }),
      });
      if (!r.ok) {
        const j = (await r.json().catch(() => ({}))) as { error?: string };
        setErr(j.error || 'Something went wrong. Please try again.');
        setBusy(false);
        return;
      }
      setDone(true);
      setBusy(false);
      trackEvent('generate_lead', { handle }); // GA4 官方事件：订阅即留资（方案 1.4）
    } catch {
      setErr('Network error. Please try again.');
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-brand/35 bg-brand/5 p-5">
        <p className="text-sm font-semibold text-charcoal">You&rsquo;re on the list ✓</p>
        <p className="mt-1.5 text-xs text-charcoal-light leading-relaxed">
          We&rsquo;ll email you the moment this becomes available. No spam — unsubscribe anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-warm-gray bg-white p-5">
      <p className="text-sm font-semibold text-charcoal">
        {comingSoon ? 'Coming Soon — Be First to Know' : 'Not Available Yet — Be First to Know'}
      </p>
      <p className="mt-1.5 text-xs text-charcoal-light leading-relaxed">
        This style opens for pre-order soon. Join the list and we&rsquo;ll email you the moment it does.
      </p>
      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          placeholder="Your email address"
          aria-label="Email for restock notification"
          className="flex-1 h-11 px-4 rounded-full border border-warm-gray bg-white text-sm text-charcoal placeholder:text-charcoal-light/60 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
        />
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className="h-11 px-6 rounded-full bg-brand text-cream text-sm font-semibold transition hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60"
        >
          {busy ? 'Joining…' : 'Notify Me'}
        </button>
      </div>
      {err && <p role="alert" className="mt-2 text-xs text-red-600">{err}</p>}
    </div>
  );
}
