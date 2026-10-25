'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * 后退/前进时恢复滚动位置（2026-10-26 用户定：从 PDP 退回 /products?cat=bedding
 * 等列表页时聚焦在点击前的位置，而不是回到顶部）。
 *
 * 全站产品卡是普通 <a>（整页加载，非 SPA 路由），所以：
 * - 判定依据用 performance navigation type === 'back_forward'（整页加载后退），
 *   外加模块级 popstate 标记兜底（SPA 跳转场景）；
 * - 浏览器原生恢复在客户端渲染的列表页会"高度没就绪被钳到顶部"，
 *   因此恢复时用轮询 scrollTo，直到页面高度足够或超时。
 */

let popPending = false;
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    popPending = true;
  });
}

function isBackForwardNavigation(): boolean {
  if (popPending) {
    popPending = false;
    return true;
  }
  try {
    const nav = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    return nav?.type === 'back_forward';
  } catch {
    return false;
  }
}

export default function ScrollRestoration() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const key = `${pathname}?${searchParams.toString()}`;

  // 持续记录当前页滚动位置（整页卸载前经 pagehide 兜底存一次）
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const save = () => {
      try {
        sessionStorage.setItem(`scroll:${key}`, String(window.scrollY));
      } catch {
        /* sessionStorage 不可用时静默跳过 */
      }
    };
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        save();
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pagehide', save);
    return () => {
      save();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pagehide', save);
    };
  }, [key]);

  // 挂载后：仅后退/前进导航才恢复；普通跳转不处理（浏览器默认到顶）
  useEffect(() => {
    if (!isBackForwardNavigation()) return;
    let target = 0;
    try {
      target = Number(sessionStorage.getItem(`scroll:${key}`) || 0);
    } catch {
      /* ignore */
    }
    if (!target) return;
    // 列表页客户端渲染 + 图片懒加载，页面高度晚到：
    // 反复应用 scrollTo，直到就位（高度足够）或超时 6s
    const start = Date.now();
    let timer = 0;
    const tick = () => {
      window.scrollTo(0, target);
      const arrived = Math.abs(window.scrollY - target) <= 50;
      if (!arrived && Date.now() - start < 6000) {
        timer = window.setTimeout(tick, 150);
      }
    };
    tick();
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
