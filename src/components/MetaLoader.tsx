'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { CONSENT_GRANTED_EVENT, META_PIXEL_ID, metaEnabled } from '@/lib/meta-pixel';

/**
 * Meta Pixel 加载器（2026-11-19，对齐 components/AnalyticsLoader 的 GA4 模式）：
 * - Pixel ID 来自 NEXT_PUBLIC_META_PIXEL_ID，无值时整块不渲染（零注入、零报错）
 * - Consent 联动：CookieConsent 横幅 **Accept 后才注入** fbevents.js（授权前页面无任何
 *   Meta 脚本——比 GA4 的 always-load+denied 更严格，Decline = 零第三方脚本，审计友好）；
 *   复访已 Accept 过（localStorage makimoo-consent）→ 挂载即注入
 * - base code 注入后 Pixel 自动上报一次 PageView（MPA 整页导航天然每页一次）；
 *   广告点击归因（fbclid/_fbp）由 Pixel 自动处理
 */
export default function MetaLoader() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const sync = () => setGranted(localStorage.getItem('makimoo-consent') === 'granted');
    sync(); // 复访：上次已 Accept → 立即注入（早于本页其余 Meta 事件）
    window.addEventListener(CONSENT_GRANTED_EVENT, sync); // 本页首次 Accept → 动态注入
    return () => window.removeEventListener(CONSENT_GRANTED_EVENT, sync);
  }, []);

  if (!metaEnabled() || !granted) return null;

  return (
    <Script id="meta-pixel-init" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  );
}
