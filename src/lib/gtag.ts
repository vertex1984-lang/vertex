/**
 * GA4 埋点封装（2026-11-12 批次 1 补齐官方电商事件清单，见设计方案 v3 第五章）。
 *
 * 测量 ID：环境变量 NEXT_PUBLIC_GA_ID（.env.local）。**无值时全部事件 no-op、
 * AnalyticsLoader 不加载脚本**，不阻塞构建（正式上线在 Vercel 配同名环境变量）。
 * 历史硬编码 ID（迁移前）：G-2X2ZQCJB0T。
 *
 * 禁令：purchase / refund 事件只由 Shopify 原生 GA4 通道上报（跨域交接点），
 * 站点代码禁止发送（防双计），见任务书坑 6。
 *
 * 上报币种 —— Shopify 店铺切换货币时只需改这一处
 * （同时记得把 GA 后台 管理 → 媒体资源设置 里的币种改成一致）
 */
export const GA_CURRENCY = 'USD';

/** GA4 官方电商事件商品项结构（item 数组格式照官方文档字段名） */
export interface GaItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_list_id?: string;
  item_list_name?: string;
  price: number;
  quantity: number;
}

/** 促销位结构（view_promotion / select_promotion 官方字段） */
export interface GaPromotion {
  promotion_id: string;
  promotion_name: string;
  creative_name?: string;
  creative_slot?: string;
  items?: GaItem[];
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** 环境变量驱动：无 ID → gtag 未注入 window → trackEvent 静默 no-op（不阻塞构建） */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export function gaEnabled(): boolean {
  return GA_MEASUREMENT_ID !== '';
}

/**
 * GA4 事件上报封装：gtag 未加载（未配 ID/被拦截/离线/SSR）时静默返回
 */
export function trackEvent(action: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (!gaEnabled()) return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', action, params);
}

// ── 官方电商事件（参数名照 GA4 官方文档；items 数组统一 GaItem 结构）──

/** 商品卡曝光（首页/类目/搜索等列表首屏）：view_item_list */
export function trackViewItemList(items: GaItem[], listId: string, listName: string) {
  trackEvent('view_item_list', { item_list_id: listId, item_list_name: listName, items });
}

/** 商品卡点击：select_item */
export function trackSelectItem(item: GaItem, listId: string, listName: string) {
  trackEvent('select_item', { item_list_id: listId, item_list_name: listName, items: [item] });
}

/** PDP 浏览（ProductDetailUpgrade / V2ProductDetailClient 挂载时已各自接入） */
export function trackViewItem(item: GaItem) {
  trackEvent('view_item', { currency: GA_CURRENCY, value: item.price * item.quantity, items: [item] });
}

/** 购物车浏览（/cart 页加载完成且非空时） */
export function trackViewCart(value: number, items: GaItem[]) {
  trackEvent('view_cart', { currency: GA_CURRENCY, value, items });
}

/** 进结算（Checkout 点击、跳转 checkoutUrl 前的跨域交接点） */
export function trackBeginCheckout(value: number, items: GaItem[]) {
  trackEvent('begin_checkout', { currency: GA_CURRENCY, value, items });
}

/** 横幅/活动位曝光：view_promotion */
export function trackViewPromotion(promotion: GaPromotion) {
  trackEvent('view_promotion', { ...promotion });
}

/** 横幅/活动位点击：select_promotion */
export function trackSelectPromotion(promotion: GaPromotion) {
  trackEvent('select_promotion', { ...promotion });
}

/** 站内搜索 */
export function trackSearch(searchTerm: string) {
  trackEvent('search', { search_term: searchTerm });
}

/** 注册（当前站内唯一注册点 = 页脚订阅 Shopify customerCreate 成功；method 标识来源） */
export function trackSignUp(method: string) {
  trackEvent('sign_up', { method });
}

/** 登录（预留：站内无登录 UI，账号体系在闸门 A 后批次 2；接口先备好） */
export function trackLogin(method: string) {
  trackEvent('login', { method });
}

/** 心愿单收藏（收藏爱心点击且为"加入"动作时） */
export function trackAddToWishlist(item: GaItem) {
  trackEvent('add_to_wishlist', { currency: GA_CURRENCY, value: item.price * item.quantity, items: [item] });
}

// ── 自定义事件（设计方案 v3 第五章）──

/** 预售时间线查询（追踪页提交出结果时；只传命中与否与段数，严禁传订单号/邮箱） */
export function trackPreorderTimelineView(params: { result: 'hit' | 'miss'; milestone_count?: number }) {
  trackEvent('preorder_timeline_view', params);
}

/** 场景热区点击（PDP 场景图/lookbook 热区产品卡点击，站点独有行为资产） */
export function trackShopTheLookClick(item: GaItem) {
  trackEvent('shop_the_look_click', { currency: GA_CURRENCY, value: item.price, items: [item] });
}
