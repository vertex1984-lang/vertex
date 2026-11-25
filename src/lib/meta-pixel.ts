// TODO(2026-11-23 本地补位): 协作方分支引用了本模块但未提交入库。
// 这是为让 feat/batch-20261122-incentives-trust 本地可构建测试而写的最小实现，
// 等协作方提供正式版 meta-pixel.ts 后应删除并替换。
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackMetaCheckout(value: number, items: unknown[]): void {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'InitiateCheckout', { value, currency: 'USD', contents: items });
  }
}
