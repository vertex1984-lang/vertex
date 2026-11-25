/**
 * 免登录查单（2026-11-12 批次 1）：订单追踪页的哈希与里程碑口径。
 *
 * 数据来源：/data/order-status.json（makimoo-admin 发布时同时写入
 * vertex/src/data/admin-order-status.json 与 vertex/public/data/order-status.json，
 * 前台客户端运行时 fetch public 份，无邮箱明文、只有 16 位哈希）。
 *
 * SALT（演示版写死字符串）：vertex（本文件）与 makimoo-admin（src/lib/order.ts）
 * 两处各放一份相同常量，**改一处必须同步另一处**；正式版换环境变量注入。
 *
 * 归一化口径（两侧必须一致，否则哈希对不上）：email trim + 小写、orderNo trim + 大写。
 */

/** 演示版 SALT：正式版换环境变量（ORDER_TRACK_SALT），两侧同步 */
export const ORDER_TRACK_SALT = 'MAKIMOO-TRACK-SALT-V1';

/** 里程碑九段（2026-11-15 按上线方案 1.3 交付时间表重构，替代旧六段；顺序即时间线顺序）
 *  D0 下单确认 / D2 生产启动 / D6 生产完工【检查点①：成品照+抽检】/ D13 离港【检查点②：船名航次】
 *  / D20 到港预告 / D25 清关完成 / D27 美国仓入库+尾程派送 / D32 送达（+评价邀请） */
export const MILESTONE_KEYS = [
  'ordered', 'production_started', 'production_done', 'departed', 'arrival_notice',
  'customs_cleared', 'warehouse', 'out_for_delivery', 'delivered',
] as const;
export type MilestoneKey = (typeof MILESTONE_KEYS)[number];

/** 追踪页时间线展示文案（站内英文口径） */
export const MILESTONE_LABELS: Record<MilestoneKey, string> = {
  ordered: 'Order placed',
  production_started: 'In production',
  production_done: 'Production completed',
  departed: 'Departed on vessel',
  arrival_notice: 'Arriving at port',
  customs_cleared: 'Customs cleared',
  warehouse: 'At US warehouse',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
};

/** 发布产物单条订单（public/data/order-status.json 的 orders[] 元素） */
export interface TrackedOrder {
  orderNo: string;
  /** sha256(email + ':' + orderNo + ':' + SALT) 前 16 位 hex（邮箱明文不落盘） */
  emailHash: string;
  items: { title: string; qty: number }[];
  promiseLabel: string;
  milestones: { key: MilestoneKey; at: string; photo?: string; note?: string }[];
}

/** 与 makimoo-admin/src/lib/order.ts orderEmailHash 完全同源的浏览器实现（Web Crypto） */
export async function orderEmailHash(email: string, orderNo: string): Promise<string> {
  const normalized = `${email.trim().toLowerCase()}:${orderNo.trim().toUpperCase()}:${ORDER_TRACK_SALT}`;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);
}

/** 订单号归一比较（录入侧大写存储；查询侧大小写不敏感） */
export function sameOrderNo(a: string, b: string): boolean {
  return a.trim().toUpperCase() === b.trim().toUpperCase();
}
