'use client';

import { useEffect, useState } from 'react';
import { customerUpdate, customerRecover, getCustomerToken } from '@/lib/customer';
import { useCustomer } from '@/lib/use-customer';

/**
 * /account/profile（批次 2 B3）：改姓名 / 改密码 / 密码重置邮件 / 订阅偏好占位。
 * 订阅偏好本期仅存 localStorage（key: makimoo-prefs），正式期接邮件系统（TODO）。
 */
const input = 'w-full h-10 px-3 rounded-lg border border-warm-gray bg-white text-sm text-charcoal placeholder:text-charcoal-light/50 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition';
const label = 'mb-1 block text-[11px] font-semibold uppercase tracking-wide text-charcoal-light';
const PREFS_KEY = 'makimoo-prefs';

export default function AccountProfilePage() {
  const { profile, loading, refresh } = useCustomer();
  // 姓名
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName ?? '');
      setLastName(profile.lastName ?? '');
    }
    try {
      setMarketing(localStorage.getItem(PREFS_KEY) === '{"marketing":true}');
    } catch { /* ignore */ }
  }, [profile]);

  async function saveName() {
    const token = getCustomerToken();
    if (!token) return;
    setNameBusy(true);
    const r = await customerUpdate(token.accessToken, { firstName: firstName.trim(), lastName: lastName.trim() });
    setNameBusy(false);
    setNameMsg(r.ok ? 'Name saved.' : r.message);
    if (r.ok) refresh();
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
    if (!profile?.email) return;
    const r = await customerRecover(profile.email);
    // 防枚举：统一成功话术
    setRecoverMsg(r.ok
      ? `Reset link sent to ${profile.email} — check your inbox (and spam folder).`
      : r.message);
  }

  function toggleMarketing(v: boolean) {
    setMarketing(v);
    // 本期仅本地存储；正式期接邮件系统（acceptsMarketing 变更走 Admin API，闸门 A）TODO
    localStorage.setItem(PREFS_KEY, JSON.stringify({ marketing: v }));
  }

  if (loading || !profile) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-warm-gray rounded w-1/3" />
        <div className="h-32 bg-warm-gray rounded-2xl" />
        <div className="h-32 bg-warm-gray rounded-2xl" />
      </div>
    );
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
