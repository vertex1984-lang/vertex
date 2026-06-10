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
