'use client';

import { useState } from 'react';

/**
 * V2 联系表单：旧版联系页无表单、只有 mailto 入口，
 * 这里表单提交行为保持 mailto —— 组装预填邮件后交给系统邮件客户端发送
 */
export default function V2ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');

  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  // 技术清单 1.3（2026-11-15）：mailto 伪表单换真实端点——
  // 演示期端点为占位（Formspree 免费版即可），上线前在 .env.local 配 NEXT_PUBLIC_CONTACT_ENDPOINT
  const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `[Makimoo Support] Message from ${name}`;
    const bodyLines = [
      message,
      '',
      '---',
      `Name: ${name}`,
      `Email: ${email}`,
    ];
    if (orderNumber.trim()) bodyLines.push(`Order Number: ${orderNumber.trim()}`);
    if (!CONTACT_ENDPOINT) {
      // 端点未配置（演示期）：退回 mailto，不伪装提交成功
      const href = `mailto:support@makimoohome.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
      window.location.href = href;
      return;
    }
    setStatus('sending');
    try {
      const r = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, orderNumber, message, _subject: subject }),
      });
      setStatus(r.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const inputCls =
    'w-full rounded-lg border border-warm-gray bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-brand placeholder:text-charcoal-light/60';

  return (
    <form onSubmit={handleSubmit} className="bg-cream rounded-2xl border border-warm-gray p-6 sm:p-8 lg:p-10">
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="v2-contact-name" className="block text-xs font-semibold uppercase tracking-wider text-charcoal-light mb-1.5">
            Name
          </label>
          <input
            id="v2-contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="v2-contact-email" className="block text-xs font-semibold uppercase tracking-wider text-charcoal-light mb-1.5">
            Email
          </label>
          <input
            id="v2-contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputCls}
          />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="v2-contact-order" className="block text-xs font-semibold uppercase tracking-wider text-charcoal-light mb-1.5">
          Order Number <span className="normal-case font-normal">(optional)</span>
        </label>
        <input
          id="v2-contact-order"
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="For order-related questions"
          className={inputCls}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="v2-contact-message" className="block text-xs font-semibold uppercase tracking-wider text-charcoal-light mb-1.5">
          Message
        </label>
        <textarea
          id="v2-contact-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
          className={`${inputCls} resize-y`}
        />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-4 rounded-full bg-brand text-cream text-sm font-semibold transition hover:bg-brand-dark disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : status === 'done' ? 'Message Sent ✓' : 'Send Message'}
      </button>
      {status === 'done' && (
        <p className="mt-3 text-xs font-medium text-emerald-600 text-center">
          Thanks — we received your message and will reply within 1 business day.
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="mt-3 text-xs font-medium text-red-600 text-center">
          Something went wrong. Please email support@makimoohome.com directly.
        </p>
      )}
      <p className="mt-4 text-xs text-charcoal-light text-center leading-relaxed">
        We reply within 1 business day — or email us directly at{' '}
        <a href="mailto:support@makimoohome.com" className="text-brand font-medium hover:underline">
          support@makimoohome.com
        </a>
        .
      </p>
    </form>
  );
}
