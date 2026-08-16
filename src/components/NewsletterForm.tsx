'use client';

import { useState, FormEvent } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (status === 'loading' || status === 'success') return;

    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');
    // 纯前端模拟提交（无后端）
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1200);
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 text-white w-full lg:w-auto lg:min-w-[380px]">
        <span className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <p className="text-sm font-semibold">Thanks for subscribing!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full lg:w-auto lg:min-w-[380px]" noValidate>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
          placeholder="Enter your email"
          required
          className="flex-1 px-5 py-3.5 rounded-lg border-2 border-white/30 bg-white/10 text-white placeholder:text-white/50 outline-none text-sm transition focus:border-white focus:ring-4 focus:ring-white/20"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3.5 rounded-full text-sm font-semibold whitespace-nowrap transition hover:bg-[#F8F5F0] disabled:opacity-70 disabled:cursor-wait"
          style={{ backgroundColor: '#fff', color: '#8B5A2B' }}
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
      {status === 'error' && (
        <p className="mt-2 text-sm text-white/90">{errorMsg}</p>
      )}
    </form>
  );
}
