'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  WISHLIST_CAPTURE_EVENT,
  setCaptureCooldown,
  submitCapture,
  type CaptureProductInfo,
} from '@/lib/wishlist-capture';

/**
 * 游客心愿单捕获面板（批次 5 设计书任务 4，2026-11-17）：
 * 未登录用户新增收藏时由 wishlist-capture.ts 的事件触发（全站单例，挂 root layout）。
 * - A 路：引导登录/注册（本地收藏注册后自动上云——syncFavoritesWithCloud 现成，面板只做引导）
 * - B 路：留 email + 营销许可 → /api/wishlist-capture（consent 默认不勾——设计书硬约束）
 * - 成功/关闭都写 30 天冷却（收藏功能本身不受影响）
 * - 诚实原则：文案只说 "we'll let you know"，不承诺具体上架日期；失败明示不伪装成功
 * - 移动端优先：375px 不溢出、内容可滚动、按钮可点
 */
export default function WishlistCaptureModal() {
  const [info, setInfo] = useState<CaptureProductInfo | null>(null);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false); // 默认不勾
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const open = (e: Event) => {
      const detail = (e as CustomEvent<CaptureProductInfo>).detail;
      if (!detail?.productId) return;
      setInfo(detail);
      setEmail('');
      setConsent(false); // 每次打开重置为默认不勾
      setDone(false);
      setErr('');
    };
    window.addEventListener(WISHLIST_CAPTURE_EVENT, open);
    return () => window.removeEventListener(WISHLIST_CAPTURE_EVENT, open);
  }, []);

  if (!mounted || !info) return null;

  function close() {
    setCaptureCooldown(); // 关闭即冷却 30 天——不打扰
    setInfo(null);
  }

  async function submit(pid: string) {
    const clean = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setErr('Please enter a valid email address.');
      return;
    }
    setBusy(true);
    setErr('');
    const r = await submitCapture(pid, clean, consent);
    setBusy(false);
    if (!r.ok) {
      setErr('Could not save right now. Please try again.');
      return;
    }
    setDone(true);
    setCaptureCooldown(); // 提交成功也冷却——同款不会再骚扰
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/45 p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Save item to wishlist"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="w-full sm:max-w-md bg-off-white rounded-t-2xl sm:rounded-2xl border border-warm-gray shadow-xl max-h-[90vh] overflow-y-auto">
        {/* 头：标题 + 关闭 */}
        <div className="flex items-start justify-between gap-3 p-5 pb-0">
          <h2 className="text-base sm:text-lg font-bold text-charcoal leading-snug">
            Save it — we&rsquo;ll let you know when it&rsquo;s available
          </h2>
          <button
            onClick={close}
            aria-label="Close"
            className="shrink-0 w-8 h-8 -mr-1 -mt-1 rounded-full flex items-center justify-center text-charcoal-light hover:bg-warm-gray hover:text-charcoal transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 副行：当前收藏的那一件 */}
        <div className="px-5 pt-3">
          <div className="flex items-center gap-3 rounded-xl border border-warm-gray bg-white p-2.5">
            {info.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={info.image} alt="" className="w-11 h-11 rounded-lg object-cover bg-white shrink-0" />
            ) : (
              <div className="w-11 h-11 rounded-lg bg-warm-gray shrink-0" />
            )}
            <p className="text-xs sm:text-sm text-charcoal-light leading-snug line-clamp-2">{info.title}</p>
          </div>
        </div>

        {done ? (
          /* B 路成功态：不承诺日期 */
          <div className="p-5">
            <div className="rounded-xl border border-brand/35 bg-brand/5 p-4 text-center">
              <p className="text-sm font-semibold text-charcoal">Saved ✓</p>
              <p className="mt-1 text-xs text-charcoal-light leading-relaxed">
                We have your email — we&rsquo;ll let you know when this becomes available.
              </p>
            </div>
            <button
              onClick={close}
              className="mt-3 w-full h-11 rounded-full border border-brand text-brand text-sm font-semibold transition hover:bg-brand/5"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-5">
            {/* A 路：注册引导（收藏注册后自动上云） */}
            <a
              href="/login/"
              className="flex items-center justify-center w-full h-12 rounded-full bg-brand text-cream text-sm font-semibold transition hover:bg-brand-dark active:scale-[0.98]"
            >
              Sign in to sync across devices
            </a>

            {/* B 路：留邮箱 */}
            <div className="mt-4 flex items-center gap-3">
              <span className="flex-1 h-px bg-warm-gray" />
              <span className="text-xs text-charcoal-light">Or leave your email</span>
              <span className="flex-1 h-px bg-warm-gray" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submit(info.productId); }}
              placeholder="Your email address"
              aria-label="Email for availability updates"
              className="mt-3 w-full h-11 px-4 rounded-full border border-warm-gray bg-white text-sm text-charcoal placeholder:text-charcoal-light/60 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
            />
            {/* 营销许可：默认不勾（设计书硬约束） */}
            <label className="mt-3 flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#8B5A2B]"
              />
              <span className="text-xs text-charcoal-light leading-relaxed">
                Email me new arrivals &amp; pre-order updates
              </span>
            </label>
            {err && <p role="alert" className="mt-2 text-xs text-red-600">{err}</p>}
            <button
              onClick={() => submit(info.productId)}
              disabled={busy}
              className="mt-3 w-full h-12 rounded-full border-2 border-brand text-brand text-sm font-bold transition hover:bg-brand/5 active:scale-[0.98] disabled:opacity-60"
            >
              {busy ? 'Saving…' : 'Save'}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
