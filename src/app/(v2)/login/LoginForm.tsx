'use client';

import { useEffect, useState } from 'react';
import { loginCustomer, customerRecover } from '@/lib/customer';
import { syncFavoritesWithCloud } from '@/lib/favorites';
import { trackLogin } from '@/lib/gtag';

/**
 * /login（批次 2 A4）：邮箱+密码（MVP 主通道）。
 * - ?next= 登录成功回跳来源页（仅允许站内相对路径，防开放重定向）
 * - ?expired=1 会话过期提示（AccountGuard 踢回时带）
 * - ?signedOut=1 已退出提示（AccountNav Sign out 落点）
 * - Apple/Google 一键：Storefront API 不支持第三方 OAuth（需身份桥接 + 闸门 A），
 *   本批次只留按钮位 disabled + "Coming soon"，方案见 docs/account-oauth-bridging.md
 */
export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [notice, setNotice] = useState('');
  const [nextPath, setNextPath] = useState('/account/');
  // 忘记密码小流（邮箱重置，Shopify 原生邮件）
  const [showRecover, setShowRecover] = useState(false);
  const [recoverMsg, setRecoverMsg] = useState('');

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    // 开放重定向防护：只接受站内相对路径（/ 开头且非 //）
    // ?next= 是批次 2 原参数；?redirect= 是 2026-11-21 T1 结算软提示用的别名（同口径）
    const n = sp.get('redirect') || sp.get('next') || '';
    if (n.startsWith('/') && !n.startsWith('//')) setNextPath(n);
    if (sp.get('expired') === '1') setNotice('Your session has expired. Please sign in again.');
    else if (sp.get('signedOut') === '1') setNotice('You have been signed out.');
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setErr('');
    if (!email.trim() || !password) {
      setErr('Please enter your email and password.');
      return;
    }
    setBusy(true);
    const r = await loginCustomer(email, password);
    if (!r.ok) {
      setBusy(false);
      setErr(r.message);
      return;
    }
    trackLogin('password');
    // 心愿单云端合并（后台静默做；进 /account/wishlist 时亦会再同步）
    try {
      const { customerGet } = await import('@/lib/customer');
      const me = await customerGet(r.data.accessToken);
      if (me.ok) void syncFavoritesWithCloud(me.data.id);
    } catch { /* 合并失败不阻断登录 */ }
    // 批次 3 任务 1.2（验收 P2-2「连续两次登录弹 expired」）：loginCustomer 内
    // localStorage.setItem 已同步完成，再延一帧跳转，确保写入对下一页的守卫可见
    requestAnimationFrame(() => {
      window.location.href = nextPath;
    });
  }

  async function sendRecover() {
    if (!email.trim()) {
      setRecoverMsg('Enter your email above first.');
      return;
    }
    const r = await customerRecover(email);
    setRecoverMsg(r.ok
      ? `If an account exists for ${email.trim()}, a reset link is on its way.`
      : r.message);
  }

  const inputCls = 'w-full h-11 px-4 rounded-lg border border-warm-gray bg-cream/60 text-sm text-charcoal placeholder:text-charcoal-light/50 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition';

  return (
    <div className="bg-off-white px-4 lg:px-10 pt-28 lg:pt-36 pb-16 lg:pb-24">
      <div className="mx-auto w-full max-w-md">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2 text-center">Account</p>
        <h1 className="text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal leading-tight mb-2 text-center">Sign in</h1>
        <p className="text-sm text-charcoal-light text-center mb-7">Orders, addresses and your wishlist — all in one place.</p>

        {notice && (
          <div className="mb-4 rounded-lg border border-warm-gray bg-cream px-4 py-2.5 text-center text-xs text-charcoal-light">{notice}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-warm-gray rounded-2xl p-5 lg:p-6 shadow-sm">
          {/* Apple / Google 按钮位（批次 2 不做第三方 OAuth：需身份桥接 + 闸门 A，见 docs/account-oauth-bridging.md） */}
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <button
              type="button"
              disabled
              title="Coming soon"
              aria-disabled="true"
              className="h-11 flex items-center justify-center gap-2 rounded-full border border-warm-gray bg-white text-sm font-semibold text-charcoal-light cursor-not-allowed opacity-60"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05 12.54c-.03-2.89 2.36-4.28 2.47-4.35-1.35-1.97-3.44-2.24-4.18-2.27-1.78-.18-3.47 1.05-4.37 1.05-.9 0-2.29-1.02-3.77-.99-1.94.03-3.72 1.13-4.72 2.86-2.01 3.49-.51 8.66 1.45 11.49.96 1.38 2.11 2.93 3.61 2.88 1.45-.06 2-.94 3.75-.94s2.25.94 3.78.91c1.56-.03 2.55-1.42 3.5-2.8 1.1-1.61 1.56-3.17 1.58-3.25-.03-.02-3.04-1.17-3.1-4.59zM14.16 4.06c.8-.97 1.34-2.32 1.19-3.66-1.15.05-2.55.77-3.38 1.74-.74.86-1.39 2.23-1.22 3.55 1.29.1 2.6-.65 3.41-1.63z"/></svg>
              Apple
            </button>
            <button
              type="button"
              disabled
              title="Coming soon"
              aria-disabled="true"
              className="h-11 flex items-center justify-center gap-2 rounded-full border border-warm-gray bg-white text-sm font-semibold text-charcoal-light cursor-not-allowed opacity-60"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.7-4.9H1.3v3.1C3.3 21.3 7.3 24 12 24z"/><path fill="#FBBC05" d="M5.3 14.4c-.2-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4v-3H1.3C.5 8.2 0 10 0 12s.5 3.8 1.3 5.4l4-3z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.3 0 3.3 2.7 1.3 6.6l4 3.1c1-2.8 3.6-4.9 6.7-4.9z"/></svg>
              Google
            </button>
          </div>
          <p className="mb-4 text-center text-[10px] text-charcoal-light/80" title="Third-party sign-in needs an identity bridge + Shopify Admin API">One-click sign-in is coming soon.</p>

          <div className="space-y-3">
            <div>
              <label htmlFor="login-email" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-charcoal-light">Email</label>
              <input id="login-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="login-password" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-charcoal-light">Password</label>
                <button type="button" onClick={() => setShowRecover((v) => !v)} className="mb-1 text-[11px] font-semibold text-brand hover:underline underline-offset-2">
                  Forgot password?
                </button>
              </div>
              <input id="login-password" type={showPwd ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} />
              {showPwd && (
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="mt-1 text-[11px] text-charcoal-light hover:underline underline-offset-2">Hide password</button>
              )}
            </div>
          </div>

          {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
          {showRecover && (
            <div className="mt-3 rounded-lg bg-cream border border-warm-gray px-3.5 py-2.5">
              <button type="button" onClick={sendRecover} className="text-xs font-semibold text-brand hover:underline underline-offset-2">
                Send reset link to the email above
              </button>
              {recoverMsg && <p className="mt-1 text-[11px] text-charcoal-light">{recoverMsg}</p>}
            </div>
          )}

          <button type="submit" disabled={busy} className="mt-5 w-full h-12 rounded-full bg-brand text-cream text-sm font-bold tracking-wide transition hover:bg-brand-dark active:scale-[0.99] disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="mt-4 text-center text-xs text-charcoal-light">
            New to Makimoo?{' '}
            <a href={`/register/${nextPath !== '/account/' ? `?next=${encodeURIComponent(nextPath)}` : ''}`} className="font-semibold text-brand hover:underline underline-offset-2">Create an account</a>
          </p>
        </form>
      </div>
    </div>
  );
}
