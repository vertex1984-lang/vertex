'use client';

import Script from 'next/script';
import { GA_MEASUREMENT_ID } from '@/lib/gtag';

/**
 * GA4 加载器：无条件加载（2026-09-28 起）。
 * 原 Consent Mode 严格模式随 CookieConsent 一并移除——美国市场无强制 Cookie
 * 同意法规，弹窗干扰首访用户；移除弹窗后 GA4 直接加载，避免统计断流。
 */
export default function AnalyticsLoader() {
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
