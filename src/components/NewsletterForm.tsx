'use client';

import { useState, FormEvent } from 'react';
import { subscribeCustomer } from '@/lib/customer';
import { useToast } from '@/components/Toast';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
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
    // 真实订阅：Shopify customerCreate（邮箱已注册也视为成功）
    const result = await subscribeCustomer(trimmed);
    if (result === 'error') {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again later.');
      toast('Subscription failed. Please try again.', 'error');
    } else {
      setStatus('success');
      setEmail('');
      toast('Thanks for subscribing!');
    }
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
          className={`flex-1 h-12 px-5 rounded-lg border-2 bg-white/10 text-white placeholder:text-white/50 outline-none text-base transition focus:ring-2 ${
            status === 'error'
              ? 'border-red-400 focus:border-red-300 focus:ring-red-300/30 animate-shake'
              : 'border-white/30 focus:border-white focus:ring-white/20'
          }`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="h-12 px-6 rounded-full text-sm font-semibold whitespace-nowrap transition hover:bg-[#F8F5F0] active:scale-95 disabled:opacity-70 disabled:cursor-wait"
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
