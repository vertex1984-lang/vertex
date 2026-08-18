'use client';

import { useState, useEffect } from 'react';
import { resolveUrl } from '@/lib/paths';
import { COOKIE_CONSENT_KEY } from '@/lib/gtag';

/**
 * Cookie 同意横幅：首次访问显示，选择存 localStorage（不再显示）。
 * Accept 会 dispatch 'makimoo:cookie-consent' 事件，AnalyticsLoader 收到后立即加载 GA4。
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  const choose = (value: 'accepted' | 'declined') => {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
    window.dispatchEvent(new CustomEvent('makimoo:cookie-consent', { detail: value }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[1800]">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E8E2DA] p-5">
        <p className="text-sm text-[#333] leading-relaxed mb-4">
          We use cookies to analyze site traffic and improve your experience. See our{' '}
          <a href={resolveUrl('/privacy')} className="text-[#8B5A2B] underline hover:no-underline">
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => choose('accepted')}
            className="flex-1 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            style={{ backgroundColor: '#8B5A2B' }}
          >
            Accept
          </button>
          <button
            onClick={() => choose('declined')}
            className="flex-1 px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition hover:bg-[#E8E2DA]"
            style={{ borderColor: '#8B5A2B', color: '#8B5A2B' }}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
