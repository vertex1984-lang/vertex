/**
 * 店铺当前币种 —— Shopify 后台切换货币时改这一处（并同步 lib/gtag.ts 的 GA_CURRENCY）。
 * 后续做 EUR/GBP/USD 多币种切换时，这里会改为按用户选择动态取值。
 */
export const STORE_CURRENCY = 'USD';

/**
 * Format a price with the appropriate currency symbol.
 * EUR → €13.99, USD → $13.99, GBP → £13.99, etc.
 */
export function formatPrice(amount: string | number, currencyCode: string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  const symbol = CURRENCY_SYMBOLS[currencyCode] || currencyCode + ' ';
  return `${symbol}${num.toFixed(2)}`;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  CAD: 'CA$',
  AUD: 'A$',
};

/**
 * Coming Soon 价格口径（2026-11-07 用户定）：0 价 = 未上架/规划商品
 * （planned 数据 price 0.00 + availableForSale false），价格位一律显示
 * "Coming Soon"，绝不渲染 "$0.00"。SceneView / SceneModule 场景价签既有
 * `parseFloat(price) > 0 ? formatPrice(...) : 'Coming Soon'` 先例，卡片组件统一跟进；
 * 价格 > 0 但缺货仍走 Out of Stock 口径，不受影响。
 */
export const COMING_SOON_LABEL = 'Coming Soon';

/** 金额不是正数（0 / 负数 / 非法值）→ 视为未上架，价格位应显示 COMING_SOON_LABEL */
export function isComingSoonAmount(amount: string | number | null | undefined): boolean {
  const num = typeof amount === 'number' ? amount : parseFloat(amount ?? '');
  return !Number.isFinite(num) || num <= 0;
}
