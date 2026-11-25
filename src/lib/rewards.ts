'use client';

/**
 * 登录激励券码（2026-11-21 批次，vertex 前台侧）：
 * - rewardsEmailHash：与 makimoo-admin/src/lib/rewards.ts 的 REWARDS_SALT **必须一致**
 *   （两侧各一份常量，改一处必须同步另一处，同 order-status SALT 模式）。
 *   浏览器 Web Crypto 实现（admin 侧为 node crypto，口径同为 sha256(email:SALT) 全量 hex）。
 * - /account My Rewards：GET /api/rewards?emailHash=<hash>（x-rewards-token 共享密钥，
 *   同 wishlist/reviews/notify 模式；新令牌已同步 admin lib/cors.ts Allow-Headers）。
 * - 注册发券：POST /api/rewards { reason:'signup', email } → { granted }——
 *   granted=true 才显示迎新文案（admin 开关关闭时全链路静默）。
 */

export const REWARDS_SALT = 'MAKIMOO-REWARDS-SALT-V1';

const REWARDS_API = process.env.NEXT_PUBLIC_REWARDS_API || 'http://localhost:4200/api/rewards';
const REWARDS_TOKEN = process.env.NEXT_PUBLIC_REWARDS_TOKEN || 'makimoo-rewards-demo-token';

/** 与 makimoo-admin/src/lib/rewards.ts rewardsEmailHash 完全同源的浏览器实现 */
export async function rewardsEmailHash(email: string): Promise<string> {
  const normalized = `${email.trim().toLowerCase()}:${REWARDS_SALT}`;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** 前台投影（admin GET ?emailHash= 返回；无邮箱明文） */
export interface MyCoupon {
  code: string;
  reason: 'review' | 'signup' | 'notify-consent';
  percentOff: number;
  createdAt: string;
  status: string;
}

/** 按登录邮箱拉取已获券（失败静默返回 []——券卡缺席不阻塞账户页） */
export async function fetchMyCoupons(email: string): Promise<MyCoupon[]> {
  try {
    const hash = await rewardsEmailHash(email);
    const r = await fetch(`${REWARDS_API}?emailHash=${encodeURIComponent(hash)}`, {
      headers: { 'x-rewards-token': REWARDS_TOKEN },
      cache: 'no-store',
    });
    if (!r.ok) return [];
    const j = (await r.json()) as { items?: MyCoupon[] };
    return j.items ?? [];
  } catch {
    return [];
  }
}

/** 注册成功后申请迎新券（admin 开关关闭 / 已发过 → granted=false，调用方据此决定是否显示文案） */
export async function requestSignupCoupon(email: string): Promise<boolean> {
  try {
    const r = await fetch(REWARDS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-rewards-token': REWARDS_TOKEN },
      body: JSON.stringify({ email: email.trim(), reason: 'signup' }),
    });
    if (!r.ok) return false;
    const j = (await r.json()) as { granted?: boolean };
    return j.granted === true;
  } catch {
    return false;
  }
}
