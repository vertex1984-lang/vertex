/* ============================================================================
 * checkoutUrl 前置校验（批次 5 T2 支付前端，2026-11-17 设计书任务 2）：
 * 两处裸跳点（cart 页 + MiniCart）的 `window.open(checkoutUrl)` 改为跳前校验——
 * cart 过期/网络错误不再把买家带进 Shopify 错误页，失败给友好提示、不伪装成功。
 *
 * L1 cart 有效性：调用方传 getCart（cart 页/MiniCart 传 getShopifyCart——其内部对
 *   cart 已过期/被删除有自愈：自动清坏 cartId 返回 null）。query 失败/cart null/
 *   无 checkoutUrl 一律视为 cart-invalid。
 * L2 checkoutUrl 网络可达：`fetch(url, { method:'HEAD', mode:'no-cors' })` +
 *   AbortController 3.5s 超时。no-cors 返回 opaque response——resolve ≠ HTTP 200，
 *   只代表网络层可达（挡断网/DNS/坏域名），这正是我们要的全部语义；跨域细节由
 *   Shopify checkout 托管页自己负责，前端不越俎代庖。
 *
 * ⚠ 配套坑位（调用方必读）：window.open 放在 await 之后会被浏览器弹窗拦截器拦掉
 *   （脱离用户手势上下文）。调用方必须用「同步占位窗」方案——点击的同步栈内先
 *   window.open('', '_blank') 占位，校验完成后对占位窗改址或关闭（见 cart/MiniCart）。
 * ========================================================================== */

export type CheckoutGuardResult =
  | { ok: true }
  | { ok: false; reason: 'cart-invalid' | 'unreachable' };

const PROBE_TIMEOUT_MS = 3500;

/** L2：checkoutUrl 网络层可达探测（opaque response，reject/超时 = 不可达） */
async function probeCheckoutUrl(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    await fetch(url, { method: 'HEAD', mode: 'no-cors', signal: controller.signal });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 两级串行校验，任一失败短路返回：
 * L1 失败 → { ok:false, reason:'cart-invalid' }（调用方提示 + 清 cartId 刷新购物车）
 * L2 失败 → { ok:false, reason:'unreachable' }（调用方提示 + 关占位窗）
 */
export async function validateCheckout(
  getCart: () => Promise<{ checkoutUrl?: string } | null>
): Promise<CheckoutGuardResult> {
  // L1：cart 有效性（cartId 可能已过期——query 失败/空 cart 视为无效）
  const cart = await getCart();
  if (!cart?.checkoutUrl) return { ok: false, reason: 'cart-invalid' };
  // L2：checkoutUrl 网络可达
  const reachable = await probeCheckoutUrl(cart.checkoutUrl);
  if (!reachable) return { ok: false, reason: 'unreachable' };
  return { ok: true };
}
