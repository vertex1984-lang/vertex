export const GA_MEASUREMENT_ID = 'G-2X2ZQCJB0T';

/**
 * GA4 电商事件上报币种 —— Shopify 店铺切换货币时只需改这一处
 * （同时记得把 GA 后台 管理 → 媒体资源设置 里的币种改成一致）
 */
export const GA_CURRENCY = 'USD';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * GA4 事件上报封装：gtag 未加载（被拦截/离线/SSR）时静默返回
 */
export function trackEvent(action: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', action, params);
}

// GA4 电商事件商品项结构
export interface GaItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  price: number;
  quantity: number;
}

// Cookie 同意状态 localStorage key（'accepted' | 'declined'）
export const COOKIE_CONSENT_KEY = 'makimoo-cookie-consent';
