'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { CONSENT_GRANTED_EVENT, META_PIXEL_ID, metaEnabled } from '@/lib/meta-pixel';

/**
 * Meta Pixel 加载器（2026-11-19，对齐 components/AnalyticsLoader 的 GA4 模式）：
 * - Pixel ID 来自 NEXT_PUBLIC_META_PIXEL_ID，无值时整块不渲染（零注入、零报错）
 * - Consent 门控（2026-11-26 改版，配合 CookieConsent 横幅全站移除 · main 775d1ac）：
 *   US 市场默认授权——**默认注入**，仅当 localStorage makimoo-consent === 'declined'
 *   （旧横幅时代用户明确拒绝过的存量访客）才跳过。未写入任何值 = 无横幅时代的访客 = 视同 granted。
 *   旧横幅若回归：Accept 会派发 CONSENT_GRANTED_EVENT（本监听兼容保留），Decline 写 'declined'。
 * - base code 注入后 Pixel 自动上报一次 PageView（MPA 整页导航天然每页一次）；
 *   广告点击归因（fbclid/_fbp）由 Pixel 自动处理
 */
export default function MetaLoader() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const sync = () => setGranted(localStorage.getItem('makimoo-consent') !== 'declined');
    sync(); // 默认 granted：仅显式 declined 的存量访客跳过
    window.addEventListener(CONSENT_GRANTED_EVENT, sync); // 兼容：横幅回归时 Accept 仍可触发
    return () => window.removeEventListener(CONSENT_GRANTED_EVENT, sync);
  }, []);

  if (!metaEnabled() || !granted) return null;

  return (
    <Script id="meta-pixel-init" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  );
}
