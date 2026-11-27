import crypto from 'crypto';

/**
 * 登录激励券码（2026-11-21 批次，依据《Makimoo-登录与结算价值-竞品调研-20261121.md》
 * P0b 评价送券 + P1 注册/预约发券；站内发放与展示，**不依赖 Shopify 折扣码**
 * （真实折扣等闸门 A Admin API 凭证，本批次只做台账 + 前台展示）。
 *
 * 数据：db.json 新集合 couponGrants（见 lib/db.ts）。
 * 隐私口径：对外（vertex 前台）只用 emailHash（sha256(email:SALT)），邮箱明文只落
 * admin 本地台账（与 notifySubscribes 同级，不出 admin 数据面）。
 * 发放路径仅三条：reason='review'（评价审核通过且评价带登录身份）/ 'signup'（注册成功）
 * / 'notify-consent'（到货通知 + marketing consent）。reason 之外一律不发。
 *
 * SALT 口径：与 vertex/src/lib/rewards.ts 的 REWARDS_SALT **必须一致**（两侧各一份常量，
 * 改一处必须同步另一处，同 order-status SALT 模式）。
 */
export const REWARDS_SALT = 'MAKIMOO-REWARDS-SALT-V1';

export type CouponGrantReason = 'review' | 'signup' | 'notify-consent';

export interface CouponGrantRecord {
  id: string;
  /** sha256(email.trim().toLowerCase() + ':' + REWARDS_SALT) 全量 hex */
  emailHash: string;
  /** 邮箱明文（小写归一；仅 admin 本地台账展示，前台接口不下发） */
  customerEmail: string;
  /** 券码（唯一，格式 MK<percent>-XXXX-XXXX） */
  code: string;
  reason: CouponGrantReason;
  /** 折扣比例（整数 10 = 10% off；快照自发放时的 rewardsConfig） */
  percentOff: number;
  /** 关联来源：review = 评价 id；signup/notify-consent 留空 */
  sourceId?: string;
  createdAt: string;
  /** active（本批次无核销；闸门 A 接 Shopify 折扣码后再加 used/expired） */
  status: 'active';
}

/** 券码发放配置（T3：admin 配置位；开关关闭 = 全链路不发放、站内不显示文案） */
export interface RewardsConfig {
  /** 总开关：false 时三条发放路径全部静默不发 */
  enabled: boolean;
  /** 折扣比例（% off，默认 10）；单次使用 */
  percentOff: number;
  at: string;
}

export const DEFAULT_REWARDS_CONFIG: RewardsConfig = {
  enabled: false,
  percentOff: 10,
  at: new Date().toISOString(),
};

/** 与 vertex 前台完全同源的邮箱哈希（归一：trim + 小写） */
export function rewardsEmailHash(email: string): string {
  const normalized = `${email.trim().toLowerCase()}:${REWARDS_SALT}`;
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomCodeBlock(len = 4): string {
  const bytes = crypto.randomBytes(len);
  let out = '';
  for (let i = 0; i < len; i++) out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  return out;
}

/** 生成券码（唯一性由调用方对已存 grants 校验兜底重试） */
export function generateCouponCode(percentOff: number): string {
  return `MK${percentOff}-${randomCodeBlock()}-${randomCodeBlock()}`;
}
