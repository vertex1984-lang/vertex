/**
 * Meta Pixel（Facebook 追踪代码）埋点封装（2026-11-19，对应波次 3 挂账「Meta Pixel」）。
 *
 * Pixel ID：环境变量 NEXT_PUBLIC_META_PIXEL_ID（.env.local）。**无值时 fbq 未注入、
 * 全部事件 no-op、MetaLoader 不加载脚本**，不阻塞构建（与 GA4 NEXT_PUBLIC_GA_ID 同逻辑；
 * ID 由领导侧 Meta Business Suite → Events Manager 创建数据源后提供，填入即激活）。
 *
 * 禁令：purchase / refund 事件**只由 Shopify 原生 Facebook 渠道上报**（买家跳 Shopify
 * 托管页付款，那边自动上报且带精确金额）——站点代码禁止发送，防 Facebook 后台订单双计、
 * 污染广告优化模型（与 GA4 的 purchase 禁令同口径，见 lib/gtag.ts 头注）。
 *
 * Consent：US 市场默认授权（横幅已移除，main 775d1ac）——MetaLoader 默认注入；
 * 仅 localStorage makimoo-consent === 'declined'（旧横幅时代明确拒绝的存量访客）跳过。
 * CONSENT_GRANTED_EVENT 兼容保留（横幅若回归，Accept 照常触发）。见 components/MetaLoader.tsx。
 *
 * PageView / 广告归因：全站为原生 <a> 整页跳转（MPA），fbevents.js 注入后 Pixel 自动
 * 上报一次 PageView；广告点击归因（fbclid → _fbp cookie）由 Pixel 自动处理，站点零额外代码。
 *
 * content_ids 口径：**handle**（与 GA4 item_id 同源同值）。Meta 只在跑动态商品广告
 * （DPA + catalog feed）时才要求 content_ids 严格匹配商品目录 ID——现无 catalog，
 * 若将来跑 DPA，只改本文件映射一处即可全局生效。
 */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

export function metaEnabled(): boolean {
  return META_PIXEL_ID !== '';
}

/** CookieConsent Accept 后派发（MetaLoader 监听注入）；常量收口在 lib 防两组件字符串漂移 */
export const CONSENT_GRANTED_EVENT = 'makimoo:consent-granted';

declare global {
  interface Window {
    /** Meta base code 定义的 fbq（未配 ID / 未授权 / SSR 时不存在 → trackMeta 静默） */
    fbq?: (...args: unknown[]) => void;
  }
}

/** Meta 事件上报封装：fbq 未注入（未配 ID / 未授权 / 被拦截 / SSR）时静默返回 */
export function trackMeta(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (!metaEnabled()) return;
  if (typeof window.fbq !== 'function') return;
  window.fbq('track', event, params);
}

// ── 标准事件语义封装（参数从 GA4 GaItem 同源映射，两套像素一处数据）──

import { GA_CURRENCY, type GaItem } from './gtag';

/** 单商品标准事件：ViewContent（PDP 浏览）/ AddToCart（加购成功） */
export function trackMetaItem(event: 'ViewContent' | 'AddToCart', item: GaItem) {
  trackMeta(event, {
    content_type: 'product',
    content_ids: [item.item_id],
    content_name: item.item_name,
    value: item.price * item.quantity,
    currency: GA_CURRENCY,
  });
}

/** InitiateCheckout（点结算且校验成功、即将跳 Shopify checkout——T2 前置校验成功分支同点） */
export function trackMetaCheckout(value: number, items: GaItem[]) {
  trackMeta('InitiateCheckout', {
    content_type: 'product',
    content_ids: items.map((i) => i.item_id),
    value,
    currency: GA_CURRENCY,
    num_items: items.reduce((sum, i) => sum + i.quantity, 0),
  });
}

/** AddToCart 批量版（场景页"一键组合加购"等多商品入口；value = 组合总价） */
export function trackMetaBundle(event: 'AddToCart', items: GaItem[], value: number) {
  trackMeta(event, {
    content_type: 'product',
    content_ids: items.map((i) => i.item_id),
    content_name: items[0]?.item_name,
    value,
    currency: GA_CURRENCY,
  });
}
