'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { GA_MEASUREMENT_ID, COOKIE_CONSENT_KEY } from '@/lib/gtag';

/**
 * GA4 加载器（Consent Mode 严格模式）：
 * 仅在用户已同意（localStorage 'accepted'）时才渲染 gtag 脚本，
 * 初始 HTML / 未同意时完全不加载 googletagmanager。
 * CookieConsent 点 Accept 后通过 'makimoo:cookie-consent' 事件立即触发加载。
 */
export default function AnalyticsLoader() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted') {
      setAccepted(true);
    }
    const onConsent = (e: Event) => {
      if ((e as CustomEvent).detail === 'accepted') setAccepted(true);
    };
    window.addEventListener('makimoo:cookie-consent', onConsent);
    return () => window.removeEventListener('makimoo:cookie-consent', onConsent);
  }, []);

  if (!accepted) return null;

  // 全站为原生 <a> 整页跳转，gtag config 的自动 page_view 即可覆盖
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
