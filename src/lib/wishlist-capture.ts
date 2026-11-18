/* ============================================================================
 * 游客心愿单捕获触发（批次 5 心愿单选品，2026-11-17 设计书任务 4）：
 * 未登录用户新增收藏时，弹捕获面板（WishlistCaptureModal 监听本 lib 派发的事件）——
 * A 路引导注册（本地收藏注册后自动上云，syncFavoritesWithCloud 现成），
 * B 路留 email + 营销许可 → admin /api/wishlist-capture 台账（选品数据闭环）。
 *
 * 触发三条件（设计书硬约束，同时满足）：新增收藏（调用方保证）∧ 未登录 ∧ 冷却期外。
 * 冷却：localStorage mk-wl-capture-cooldown 记到期时间戳，30 天内不再弹——
 * 收藏功能本身不受影响（只是不弹面板）。诚实原则：面板文案不承诺上架日期。
 *
 * 鉴权：**复用 x-wishlist-token**（不新增令牌——CORS 铁律三次踩坑的教训，
 * cors.ts Allow-Headers 已含，零回归风险）。演示版直连 :4200，正式版 env 可配。
 * ========================================================================== */

import { getCustomerToken } from './customer';

const CAPTURE_API =
  process.env.NEXT_PUBLIC_WISHLIST_CAPTURE_API || 'http://localhost:4200/api/wishlist-capture';
/** 与 vertex favorites.ts / makimoo-admin WISHLIST_TOKEN 同值（演示版写死；正式版换环境变量） */
const WISHLIST_TOKEN = process.env.NEXT_PUBLIC_WISHLIST_TOKEN || 'makimoo-wishlist-demo-token';

const COOLDOWN_KEY = 'mk-wl-capture-cooldown';
const COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000; // 30 天

/** 触发面板载荷（productId 口径 = product.id，makimoo-ASIN，与云收藏/聚合同 key） */
export interface CaptureProductInfo {
  productId: string;
  title: string;
  /** 面板缩略图 URL（可空串，空则只显示名） */
  image?: string;
}

/** 面板事件名（WishlistCaptureModal 监听） */
export const WISHLIST_CAPTURE_EVENT = 'makimoo:wishlist-capture';

function readCooldownUntil(): number {
  if (typeof window === 'undefined') return 0;
  const raw = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
  return Number.isFinite(raw) && raw > 0 ? raw : 0;
}

export function isCaptureCoolingDown(): boolean {
  return Date.now() < readCooldownUntil();
}

/** 写冷却：面板被关闭或提交成功后调用——30 天内不再弹 */
export function setCaptureCooldown(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_MS));
}

/**
 * 触发判定（调用方已保证「新增收藏」）：
 * 登录态（token 有效含过期校验）永不弹；冷却期内不弹；其余派发事件给全局面板。
 */
export function maybeTriggerCapture(info: CaptureProductInfo): void {
  if (typeof window === 'undefined') return;
  if (getCustomerToken() !== null) return; // 登录态：收藏直接走云同步，不打扰
  if (isCaptureCoolingDown()) return; // 冷却：只收藏，不弹面板
  window.dispatchEvent(new CustomEvent(WISHLIST_CAPTURE_EVENT, { detail: info }));
}

/** B 路提交：email + 营销许可落 admin 台账。失败返回 ok:false（调用方展示错误，不伪装成功） */
export async function submitCapture(
  productId: string,
  email: string,
  marketingConsent: boolean
): Promise<{ ok: boolean; duplicate?: boolean }> {
  try {
    const r = await fetch(CAPTURE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-wishlist-token': WISHLIST_TOKEN },
      body: JSON.stringify({ productId, email: email.trim(), marketingConsent }),
    });
    if (!r.ok) return { ok: false };
    const j = (await r.json()) as { ok?: boolean; duplicate?: boolean };
    return { ok: j.ok === true, duplicate: j.duplicate };
  } catch {
    return { ok: false };
  }
}
