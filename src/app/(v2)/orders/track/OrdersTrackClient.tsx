'use client';

/**
 * 免登录查单页（2026-11-12 批次 1）：订单号 + 邮箱 → 本地 Web Crypto 算 emailHash
 * → fetch /data/order-status.json（admin 发布写入，无邮箱明文）→ 命中渲染九段垂直时间线。
 * 命中时上报 GA4 自定义事件 preorder_timeline_view（不含订单号/邮箱等 PII）。
 * 设计：V2 token（brand/cream/warm-gray/charcoal），移动端优先。
 */
import { useEffect, useRef, useState } from 'react';
import {
  MILESTONE_KEYS,
  MILESTONE_LABELS,
  orderEmailHash,
  sameOrderNo,
  type MilestoneKey,
  type TrackedOrder,
} from '@/lib/track';
import { trackPreorderTimelineView } from '@/lib/gtag';
import { getCustomerToken } from '@/lib/customer';
import { resolveUrl } from '@/lib/paths';

type Phase = 'idle' | 'checking' | 'hit' | 'miss';

/** ISO → "Dec 17"（无年份：承诺窗口都在当季） */
function formatDay(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export default function OrdersTrackClient() {
  const [orderNo, setOrderNo] = useState('');
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState('');
  // 建号引导（2026-11-21 T1.2）：游客查单命中且未登录时展示「保存信息」注册入口
  //（邮箱从本次查询字段回填，仅 URL 参数传递，不落新存储；已登录不渲染）
  const [nudge, setNudge] = useState(false);
  // 时间线到达时间客户端现算展示（水合安全：只在提交后渲染结果区）
  const lastLookup = useRef(0);

  useEffect(() => {
    // ?order= 预填（批次 2：账户订单详情 "Track this order" 入口带订单号跳转）
    const sp = new URLSearchParams(window.location.search);
    const pre = sp.get('order');
    if (pre) setOrderNo(pre);
    lastLookup.current = 0;
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (phase === 'checking') return;
    const no = orderNo.trim();
    const em = email.trim();
    if (!no || !em) {
      setError('Please enter both your order number and email.');
      return;
    }
    setError('');
    setPhase('checking');
    try {
      // 每次查询都拉最新发布数据（静态文件，浏览器缓存可能导致旧进度）
      const res = await fetch('/data/order-status.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const file = (await res.json()) as { orders?: TrackedOrder[] };
      const hash = await orderEmailHash(em, no);
      const hit = (file.orders ?? []).find(
        (o) => sameOrderNo(o.orderNo, no) && o.emailHash === hash
      );
      lastLookup.current = Date.now();
      if (hit) {
        setOrder(hit);
        setPhase('hit');
        setNudge(!getCustomerToken()); // 游客才展示建号引导（已登录零打扰）
        trackPreorderTimelineView({ result: 'hit', milestone_count: hit.milestones.filter((m) => m.at).length });
      } else {
        setOrder(null);
        setPhase('miss');
        trackPreorderTimelineView({ result: 'miss' });
      }
    } catch {
      setPhase('idle');
      setError('Something went wrong loading order data. Please try again.');
    }
  }

  const milestoneAt = (key: MilestoneKey) => order?.milestones.find((m) => m.key === key);
  const reachedCount = order ? order.milestones.filter((m) => m.at).length : 0;

  return (
    <div className="bg-off-white px-4 lg:px-10 pt-28 lg:pt-36 pb-16 lg:pb-24">
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2 text-center">Order Tracking</p>
        <h1 className="text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal leading-tight mb-2 text-center">
          Track Your Order
        </h1>
        <p className="text-sm text-charcoal-light text-center mb-8">
          Enter the order number and email you used at checkout — no account needed.
        </p>

        {/* 查单表单 */}
        <form onSubmit={handleSubmit} className="bg-white border border-warm-gray rounded-2xl p-5 lg:p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="track-order-no" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-charcoal-light">
                Order number
              </label>
              <input
                id="track-order-no"
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
                placeholder="MK-20261112-001"
                autoComplete="off"
                className="w-full h-11 px-4 rounded-lg border border-warm-gray bg-cream/60 text-sm text-charcoal placeholder:text-charcoal-light/50 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
              />
            </div>
            <div>
              <label htmlFor="track-email" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-charcoal-light">
                Email
              </label>
              <input
                id="track-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full h-11 px-4 rounded-lg border border-warm-gray bg-cream/60 text-sm text-charcoal placeholder:text-charcoal-light/50 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
              />
            </div>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={phase === 'checking'}
            className="mt-5 w-full h-12 rounded-full bg-brand text-cream text-sm font-bold tracking-wide transition hover:bg-brand-dark active:scale-[0.99] disabled:opacity-60"
          >
            {phase === 'checking' ? 'Checking…' : 'Track order'}
          </button>
        </form>

        {/* 未命中 */}
        {phase === 'miss' && (
          <div className="mt-6 rounded-2xl border border-warm-gray bg-white p-5 text-center">
            <p className="text-sm font-medium text-charcoal">
              We couldn&apos;t find that order — double-check your order number and email.
            </p>
            <p className="mt-1.5 text-xs text-charcoal-light">
              Orders become trackable once your order has been confirmed. Still stuck?{' '}
              <a href="/contact/" className="text-brand underline underline-offset-2">Contact us</a>.
            </p>
          </div>
        )}

        {/* 命中：承诺窗口 + 九段时间线（2026-11-15 按上线方案 1.3，分母取模型段数防写死） */}
        {phase === 'hit' && order && (
          <div className="mt-6">
            <div className="rounded-2xl border border-warm-gray bg-white p-5 lg:p-6 shadow-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-charcoal">Order {order.orderNo}</p>
                <p className="text-xs text-charcoal-light">{reachedCount}/{MILESTONE_KEYS.length} steps completed</p>
              </div>
              {/* 承诺窗口（承诺 35 天到货口径，配置驱动） */}
              <p className="mt-1 text-sm text-charcoal">
                <span className="font-semibold text-brand">{order.promiseLabel}</span>
              </p>
              {/* 商品行 */}
              <ul className="mt-3 border-t border-warm-gray pt-3 space-y-1">
                {order.items.map((it, i) => (
                  <li key={i} className="text-xs text-charcoal-light">
                    {it.title} <span className="text-charcoal/60">× {it.qty}</span>
                  </li>
                ))}
              </ul>

              {/* 垂直时间线：九段固定，未到达段灰显 */}
              <ol className="mt-6">
                {MILESTONE_KEYS.map((key, i) => {
                  const m = milestoneAt(key);
                  const reached = Boolean(m?.at);
                  const isLast = i === MILESTONE_KEYS.length - 1;
                  return (
                    <li key={key} className="relative flex gap-4 pb-7 last:pb-0">
                      {/* 连接线 */}
                      {!isLast && (
                        <span
                          aria-hidden="true"
                          className={`absolute left-[9px] top-5 bottom-0 w-px ${reached ? 'bg-brand/50' : 'bg-warm-gray'}`}
                        />
                      )}
                      {/* 节点 */}
                      <span
                        aria-hidden="true"
                        className={`relative z-10 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                          reached ? 'border-brand bg-brand' : 'border-warm-gray bg-white'
                        }`}
                      >
                        {reached && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFF8F0" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <p className={`text-sm font-semibold ${reached ? 'text-charcoal' : 'text-charcoal-light/70'}`}>
                            {MILESTONE_LABELS[key]}
                          </p>
                          <p className="text-xs text-charcoal-light">
                            {m?.at ? formatDay(m.at) : 'Pending'}
                          </p>
                        </div>
                        {m?.note && <p className="mt-0.5 text-xs leading-relaxed text-charcoal-light">{m.note}</p>}
                        {/* 工厂实拍图（可选；photo 字段缺失时防御式不渲染） */}
                        {m?.photo && (
                          <img
                            src={m.photo}
                            alt={`${MILESTONE_LABELS[key]} photo`}
                            loading="lazy"
                            className="mt-2 w-full max-w-[260px] rounded-xl border border-warm-gray"
                          />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
            <p className="mt-4 text-center text-[11px] leading-relaxed text-charcoal-light">
              Changed your mind? You can cancel free of charge any time before your order departs the port.
            </p>
            {/* T1.2 游客建号引导（email 预填回填本次查询邮箱；注册成功进 /account） */}
            {nudge && (
              <div className="mt-4 rounded-2xl border border-brand/35 bg-brand/5 p-5 text-center">
                <p className="text-sm font-semibold text-charcoal">Save your info for faster checkout next time</p>
                <p className="mt-1.5 text-xs text-charcoal-light leading-relaxed">
                  Create an account with {email.trim()} to track orders and collect member perks.
                </p>
                <a
                  href={resolveUrl(`/register/?email=${encodeURIComponent(email.trim())}&next=${encodeURIComponent('/account/')}`)}
                  className="mt-3 inline-block px-6 py-2.5 rounded-full bg-brand text-cream text-xs font-semibold transition hover:bg-brand-dark"
                >
                  Create your account
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
