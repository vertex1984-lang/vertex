'use client';

import { useEffect, useRef, useState } from 'react';
import { getCustomerToken } from '@/lib/customer';
import { trackViewPromotion } from '@/lib/gtag';
import { resolveUrl } from '@/lib/paths';

/**
 * 结算软提示（2026-11-21 T1，对标 Sephora 软屏障——竞品调研 P0a）：
 * 未登录态在 cart 页结算按钮附近与 MiniCart footer 展示一行
 * "Sign in for order tracking & member perks"（链 /login，带 redirect 回跳当前页）。
 * - 已登录不渲染（getCustomerToken 判定，客户端挂载后才知道登录态 → 默认渲染前不闪：
 *   用 mounted 门控，SSR 输出 null，水合后未登录才出现）
 * - 纯静态组件，不新增接口；GA4 view_promotion 只在未登录渲染时触发一次
 *   （promotion_id 对齐 gtag.ts GaPromotion 口径）
 */
export default function SignInPrompt({ slot }: { slot: 'cart-page' | 'mini-cart' }) {
  const [visible, setVisible] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    if (getCustomerToken()) return; // 已登录：零打扰
    setVisible(true);
    if (!fired.current) {
      fired.current = true;
      trackViewPromotion({
        promotion_id: `signin-checkout-${slot}`,
        promotion_name: 'Sign in for order tracking & member perks',
        creative_slot: slot,
      });
    }
  }, [slot]);

  if (!visible) return null;

  // 回跳当前页（含查询参数；登录成功后回到结算语境）
  const back = typeof window !== 'undefined'
    ? encodeURIComponent(window.location.pathname + window.location.search)
    : '';

  return (
    <p
      className="text-xs text-charcoal-light text-center leading-relaxed"
      data-testid={`signin-prompt-${slot}`}
    >
      <a
        href={resolveUrl(`/login/?redirect=${back}`)}
        className="font-semibold text-brand hover:underline underline-offset-2"
      >
        Sign in
      </a>{' '}
      for order tracking &amp; member perks
    </p>
  );
}
