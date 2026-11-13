'use client';

import { useState } from 'react';
import { customerUpdate, customerRecover, getCustomerToken, type CustomerProfile } from '@/lib/customer';

/**
 * 资料表单（批次 3 任务 1.1 重构）：由父组件在 customerGet 完成后才 mount
 * （initial state 直接取 profile 值）——修复批次 2 验收 P2-1「回访输入框空」：
 * 旧实现先渲染空 state 再靠 effect 回填，token 快但接口慢/失败时输入框呈空值。
 */
const input = 'w-full h-10 px-3 rounded-lg border border-warm-gray bg-white text-sm text-charcoal placeholder:text-charcoal-light/50 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition';
const label = 'mb-1 block text-[11px] font-semibold uppercase tracking-wide text-charcoal-light';
const PREFS_KEY = 'makimoo-prefs';

export default function ProfileForms({ profile }: { profile: CustomerProfile }) {
  // 姓名（初始值 = profile 现值，无回填竞态）
  const [firstName, setFirstName] = useState(profile.firstName ?? '');
  const [lastName, setLastName] = useState(profile.lastName ?? '');
  const [nameBusy, setNameBusy] = useState(false);
  const [nameMsg, setNameMsg] = useState('');
  // 密码
  const [pwd1, setPwd1] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [pwdBusy, setPwdBusy] = useState(false);
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdErr, setPwdErr] = useState('');
  // 重置邮件
  const [recoverMsg, setRecoverMsg] = useState('');
  // 订阅偏好占位
  const [marketing, setMarketing] = useState(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem(PREFS_KEY) === '{"marketing":true}';
    } catch {
      return false;
    }
  });

  async function saveName() {
    const token = getCustomerToken();
    if (!token) return;
    setNameBusy(true);
    const r = await customerUpdate(token.accessToken, { firstName: firstName.trim(), lastName: lastName.trim() });
    setNameBusy(false);
    setNameMsg(r.ok ? 'Name saved.' : r.message);
  }

  async function savePassword() {
    const token = getCustomerToken();
    if (!token) return;
    setPwdErr('');
    setPwdMsg('');
    if (pwd1.length < 5) {
      setPwdErr('Password must be at least 5 characters.');
      return;
    }
    if (pwd1 !== pwd2) {
      setPwdErr('Passwords do not match.');
      return;
    }
    setPwdBusy(true);
    const r = await customerUpdate(token.accessToken, { password: pwd1 });
    setPwdBusy(false);
    if (r.ok) {
      setPwdMsg('Password updated — use it next time you sign in.');
      setPwd1('');
      setPwd2('');
    } else {
      setPwdErr(r.message);
    }
  }

  async function sendRecover() {
    if (!profile.email) return;
    const r = await customerRecover(profile.email);
    setRecoverMsg(r.ok
      ? `Reset link sent to ${profile.email} — check your inbox (and spam folder).`
      : r.message);
  }

  function toggleMarketing(v: boolean) {
    setMarketing(v);
    // 本期仅本地存储；正式期接邮件系统（acceptsMarketing 变更走 Admin API，闸门 A）TODO
    localStorage.setItem(PREFS_KEY, JSON.stringify({ marketing: v }));
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-warm-gray bg-white p-5">
        <h2 className="text-sm font-semibold text-charcoal mb-1">Sign-in email</h2>
        <p className="text-sm text-charcoal-light">{profile.email}</p>
        {profile.createdAt && (
          <p className="mt-1 text-[11px] text-charcoal-light">
            Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        )}
      </section>

      {/* 姓名 */}
      <section className="rounded-2xl border border-warm-gray bg-white p-5">
        <h2 className="text-sm font-semibold text-charcoal mb-3">Name</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className={label}>First name</label><input className={input} value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
          <div><label className={label}>Last name</label><input className={input} value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button onClick={saveName} disabled={nameBusy} className="rounded-full bg-brand px-5 py-2 text-xs font-semibold text-cream transition hover:bg-brand-dark disabled:opacity-50">
            {nameBusy ? 'Saving…' : 'Save name'}
          </button>
          {nameMsg && <p className="text-xs font-medium text-emerald-600">{nameMsg}</p>}
        </div>
      </section>

      {/* 密码 */}
      <section className="rounded-2xl border border-warm-gray bg-white p-5">
        <h2 className="text-sm font-semibold text-charcoal mb-3">Password</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className={label}>New password</label><input className={input} type="password" value={pwd1} onChange={(e) => setPwd1(e.target.value)} autoComplete="new-password" /></div>
          <div><label className={label}>Repeat new password</label><input className={input} type="password" value={pwd2} onChange={(e) => setPwd2(e.target.value)} autoComplete="new-password" /></div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button onClick={savePassword} disabled={pwdBusy || !pwd1} className="rounded-full bg-brand px-5 py-2 text-xs font-semibold text-cream transition hover:bg-brand-dark disabled:opacity-50">
            {pwdBusy ? 'Updating…' : 'Update password'}
          </button>
          <button onClick={sendRecover} className="text-xs font-semibold text-brand hover:underline underline-offset-2">
            Email me a password reset link instead
          </button>
        </div>
        {pwdMsg && <p className="mt-2 text-xs font-medium text-emerald-600">{pwdMsg}</p>}
        {pwdErr && <p className="mt-2 text-xs font-medium text-red-600">{pwdErr}</p>}
        {recoverMsg && <p className="mt-2 text-xs font-medium text-charcoal-light">{recoverMsg}</p>}
      </section>

      {/* 订阅偏好（本期本地占位；正式期接邮件系统 + Admin API acceptsMarketing 同步 TODO） */}
      <section className="rounded-2xl border border-warm-gray bg-white p-5">
        <h2 className="text-sm font-semibold text-charcoal mb-2">Email preferences</h2>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={marketing}
            onChange={(e) => toggleMarketing(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[#8B5A2B]"
          />
          <span className="text-xs leading-relaxed text-charcoal-light">
            Email me new arrivals, restocks and offers (about twice a month). Unsubscribe any time.
          </span>
        </label>
      </section>
    </div>
  );
}
