'use client';

import { useEffect, useState } from 'react';
import { CONSENT_GRANTED_EVENT } from '@/lib/meta-pixel';

/**
 * Consent Mode v2 简易横幅（2026-11-12 批次 1，演示版）：
 * 底部小条，Accept / Decline 两键；选择存 localStorage（makimoo-consent），
 * analytics_storage 按选择 granted / denied（广告三类保持 denied，站点不做广告追踪）。
 * 首访默认 denied（AnalyticsLoader 的 consent default），选择后 gtag consent update。
 * GA 未配 ID（NEXT_PUBLIC_GA_ID 为空）时横幅照常显示，consent update 静默 no-op。
 */
const CONSENT_KEY = 'makimoo-consent';
export type ConsentChoice = 'granted' | 'denied';

/** 把选择同步给 GA4（gtag 未注入时静默） */
function applyConsent(choice: ConsentChoice) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', {
    analytics_storage: choice,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

export default function CookieConsent() {
  // null = 未挂载（SSG 水合安全）；undefined = 已挂载且历史选择已应用；'show' = 待选择
  const [state, setState] = useState<null | 'show' | 'done'>(null);

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY) as ConsentChoice | null;
    if (saved === 'granted' || saved === 'denied') {
      applyConsent(saved); // 复访：把上次选择立即同步给 GA4（早于页面事件）
      setState('done');
    } else {
      setState('show');
    }
  }, []);

  function choose(choice: ConsentChoice) {
    localStorage.setItem(CONSENT_KEY, choice);
    applyConsent(choice);
    // Meta Pixel 联动（2026-11-19）：Accept 后通知 MetaLoader 注入 fbevents.js——
    // 授权前页面无任何 Meta 脚本（Decline/未选 = 全程零注入）；复访场景 MetaLoader
    // 挂载时自读 localStorage，不走本事件
    if (choice === 'granted' && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(CONSENT_GRANTED_EVENT));
    }
    setState('done');
  }

  if (state !== 'show') return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[2000] border-t border-warm-gray bg-cream/95 backdrop-blur shadow-[0_-4px_16px_rgba(60,45,30,0.10)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 py-3 sm:flex-row">
        <p className="text-center text-xs leading-relaxed text-charcoal-light sm:text-left">
          We use cookies to understand how you shop and improve our store. You can accept or decline —
          your choice is saved on this device.
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <button
            onClick={() => choose('denied')}
            className="h-9 rounded-full border border-warm-gray px-4 text-xs font-semibold text-charcoal-light transition hover:bg-off-white"
          >
            Decline
          </button>
          <button
            onClick={() => choose('granted')}
            className="h-9 rounded-full bg-brand px-4 text-xs font-semibold text-cream transition hover:bg-brand-dark"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
