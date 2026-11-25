'use client';

import { useEffect, useState } from 'react';
import { customerRegister, loginCustomer } from '@/lib/customer';
import { syncFavoritesWithCloud } from '@/lib/favorites';
import { trackSignUp } from '@/lib/gtag';
import { requestSignupCoupon } from '@/lib/rewards';

/**
 * /register（批次 2 A4 轻注册）：只填邮箱+密码，姓名可选（首单再补地址——口径硬约束）。
 * 注册成功自动登录并跳转；成功帧显示迎新券占位文案（B6：真实发放等闸门 A，TODO）。
 *
 * 2026-11-21 登录激励批次（T1/T3）：
 * - ?email= 预填（游客下单后建号引导 / 站内链接带邮箱，仅 URL 参数传递，不落新存储）
 * - ?redirect= 同 /login 的回跳别名（结算软提示链入口；与 ?next= 同口径）
 * - 注册成功即申请迎新券（reason='signup'，admin 开关控制；granted=true 才显示迎新文案行）
 */
export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const [nextPath, setNextPath] = useState('/account/');
  // 迎新券是否已入账（admin 开关关闭 = false = 不显示文案行）
  const [welcomeGranted, setWelcomeGranted] = useState(false);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    // ?redirect= 与 ?next= 同口径（T1 建号引导/结算软提示别名；开放重定向防护不变）
    const n = sp.get('redirect') || sp.get('next') || '';
    if (n.startsWith('/') && !n.startsWith('//')) setNextPath(n);
    const pre = sp.get('email') || '';
    if (pre.includes('@')) setEmail(pre.trim());
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setErr('');
    if (!email.trim() || !password) {
      setErr('Please enter your email and a password.');
      return;
    }
    if (password.length < 5) {
      setErr('Password must be at least 5 characters.');
      return;
    }
    setBusy(true);
    const reg = await customerRegister(email, password, firstName || undefined, lastName || undefined);
    if (!reg.ok) {
      setBusy(false);
      setErr(reg.message);
      return;
    }
    // 注册即登录（Shopify 不自动发 token，需再走一次 accessTokenCreate）
    const login = await loginCustomer(email, password);
    trackSignUp('email_password');
    if (login.ok) {
      try {
        const { customerGet } = await import('@/lib/customer');
        const me = await customerGet(login.data.accessToken);
        if (me.ok) void syncFavoritesWithCloud(me.data.id);
      } catch { /* 合并失败不阻断 */ }
    }
    // T3 注册发券（reason='signup'）：admin 开关开启且未发过 → granted=true；
    // 失败/开关关闭静默（不阻断注册主流程）
    requestSignupCoupon(email).then(setWelcomeGranted).catch(() => {});
    setDone(true);
    setBusy(false);
    // 短暂展示迎新帧后进入账户
    setTimeout(() => { window.location.href = nextPath; }, 2600);
  }

  if (done) {
    return (
      <div className="bg-off-white px-4 lg:px-10 pt-28 lg:pt-36 pb-16 lg:pb-24">
        <div className="mx-auto w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF8F0" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-charcoal mb-2">Welcome — you&apos;re in.</h1>
          {/* B6 占位 + T3 迎新券（开关开启且发放成功才显示；文案对齐任务书口径） */}
          {welcomeGranted ? (
            <p className="text-sm font-semibold text-brand leading-relaxed">
              A 10% welcome code is in your account rewards.
            </p>
          ) : (
            <p className="text-sm text-charcoal-light leading-relaxed">
              Your first-order discount will be emailed to you.
            </p>
          )}
          {/* TODO(闸门 A)：Admin API 创建专属折扣码 + 邮件序列触发迎新券 */}
        </div>
      </div>
    );
  }

  const inputCls = 'w-full h-11 px-4 rounded-lg border border-warm-gray bg-cream/60 text-sm text-charcoal placeholder:text-charcoal-light/50 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition';

  return (
    <div className="bg-off-white px-4 lg:px-10 pt-28 lg:pt-36 pb-16 lg:pb-24">
      <div className="mx-auto w-full max-w-md">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2 text-center">Account</p>
        <h1 className="text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal leading-tight mb-2 text-center">Create your account</h1>
        <p className="text-sm text-charcoal-light text-center mb-7">Just an email to start — add your details later at checkout.</p>

        <form onSubmit={handleSubmit} className="bg-white border border-warm-gray rounded-2xl p-5 lg:p-6 shadow-sm">
          <div className="space-y-3">
            <div>
              <label htmlFor="reg-email" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-charcoal-light">Email *</label>
              <input id="reg-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
            </div>
            <div>
              <label htmlFor="reg-password" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-charcoal-light">Password *</label>
              <input id="reg-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 5 characters" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-first" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-charcoal-light">First name (optional)</label>
                <input id="reg-first" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label htmlFor="reg-last" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-charcoal-light">Last name (optional)</label>
                <input id="reg-last" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

          <button type="submit" disabled={busy} className="mt-5 w-full h-12 rounded-full bg-brand text-cream text-sm font-bold tracking-wide transition hover:bg-brand-dark active:scale-[0.99] disabled:opacity-60">
            {busy ? 'Creating account…' : 'Create account'}
          </button>

          <p className="mt-4 text-center text-xs text-charcoal-light">
            Already have an account?{' '}
            <a href={`/login/${nextPath !== '/account/' ? `?next=${encodeURIComponent(nextPath)}` : ''}`} className="font-semibold text-brand hover:underline underline-offset-2">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
}
