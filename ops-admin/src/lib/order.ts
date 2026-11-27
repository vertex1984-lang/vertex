/** 订单台账条目（批次 1 免登录查单；发布产物为 vertex 的 admin-order-status.json + public/data/order-status.json 双份） */
import crypto from 'crypto';

/** 演示版 SALT：与 vertex/src/lib/track.ts 保持一致；正式版换环境变量（ORDER_TRACK_SALT），两侧同步 */
export const ORDER_TRACK_SALT = 'MAKIMOO-TRACK-SALT-V1';

/** 里程碑九段 key（2026-11-15 按上线方案 1.3 交付时间表重构，替代旧六段；顺序即时间线顺序）
 *  D0 下单确认 / D2 生产启动 / D6 生产完工【检查点①】/ D13 离港【检查点②】/ D20 到港预告
 *  / D25 清关完成 / D27 美国仓入库+尾程派送 / D32 送达；与 vertex/src/lib/track.ts 保持同步 */
export const MILESTONE_KEYS = [
  'ordered', 'production_started', 'production_done', 'departed', 'arrival_notice',
  'customs_cleared', 'warehouse', 'out_for_delivery', 'delivered',
] as const;
export type MilestoneKey = (typeof MILESTONE_KEYS)[number];

export const MILESTONE_LABELS: Record<MilestoneKey, string> = {
  ordered: '已下单',
  production_started: '生产启动（D2）',
  production_done: '生产完工（D6·检查点①）',
  departed: '已离港（D13·检查点②）',
  arrival_notice: '到港预告（D20）',
  customs_cleared: '清关完成（D25）',
  warehouse: '美国仓入库（D27）',
  out_for_delivery: '派送中',
  delivered: '已签收（D32）',
};

export interface OrderItem {
  title: string;
  qty: number;
}

export interface OrderMilestone {
  key: MilestoneKey;
  /** 到达时间 ISO；空串 = 未到达 */
  at: string;
  /** 实拍图 URL（vertex/public 下相对路径，如 /images/orders/mk-xxx/1.jpg） */
  photo?: string;
  note?: string;
}

export interface OrderRecord {
  id: string;
  /** 订单号（唯一键，重复提交即覆盖基础字段；里程碑进度保留） */
  orderNo: string;
  /** 邮箱：仅后台台账保存；发布产物只含 emailHash，绝无明文 */
  email: string;
  items: OrderItem[];
  /** 到货窗口文案（如 "Arrives Dec 17 – Dec 20"），原样进时间线页 */
  promiseLabel: string;
  /** 固定九段；录单时 ordered 段自动填当前时间 */
  milestones: OrderMilestone[];
  note?: string;
  at: string;
  status: 'pending' | 'published';
  publishedAt?: string;
}

/**
 * 邮箱哈希：sha256(email + ':' + orderNo + ':' + SALT) 前 16 位 hex。
 * 归一化口径（必须与 vertex/src/lib/track.ts 一致）：email trim+小写、orderNo trim+大写。
 */
export function orderEmailHash(email: string, orderNo: string): string {
  const normalized = `${email.trim().toLowerCase()}:${orderNo.trim().toUpperCase()}:${ORDER_TRACK_SALT}`;
  return crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 16);
}

/** 空白九段里程碑（at 全空串） */
export function emptyMilestones(): OrderMilestone[] {
  return MILESTONE_KEYS.map((key) => ({ key, at: '' }));
}

/** 录单时补 ordered 段：订单成立即已下单 */
export function milestonesAtCreation(now: string): OrderMilestone[] {
  return emptyMilestones().map((m) => (m.key === 'ordered' ? { ...m, at: now } : m));
}
