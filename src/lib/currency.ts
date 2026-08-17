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
