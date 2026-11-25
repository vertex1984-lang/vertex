'use client';

import Script from 'next/script';
import { GA_MEASUREMENT_ID, gaEnabled } from '@/lib/gtag';

/**
 * GA4 加载器（2026-11-12 批次 1 改造）：
 * - 测量 ID 来自环境变量 NEXT_PUBLIC_GA_ID，无值时整块不渲染（全部事件 no-op，零报错）
 * - Consent Mode v2：默认全 denied（含 v2 必收的 ad_user_data / ad_personalization），
 *   用户在 CookieConsent 横幅选择后 update（见 components/CookieConsent.tsx）
 * - 单个内联脚本按序执行：定义 gtag 队列 → consent default → config → 再注入 gtag.js，
 *   保证 consent default 先于 gtag.js 生效
 */
export default function AnalyticsLoader() {
  if (!gaEnabled()) return null; // 无测量 ID：不加载、不上报、不阻塞构建
  // 全站为原生 <a> 整页跳转，gtag config 的自动 page_view 即可覆盖
  return (
    <Script id="ga4-init" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = window.gtag || gtag;
        gtag('consent', 'default', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        });
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}');
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';
        document.head.appendChild(s);
      `}
    </Script>
  );
}
