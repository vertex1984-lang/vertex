/**
 * 促销活动配置（2026-11-12 批次 1；配置由 makimoo-admin 发布写入，本文件只做加载与解析）。
 *
 * 数据来源：src/data/admin-promotions.json（运营后台发布时写入，空配置 = 无促销，横幅自动回退）。
 * 兼容两种加载环境：Next/webpack（JSON 有 default 导出）与 build 脚本 CJS 直载（module.exports 即
 * JSON 本体）——与 preorder.ts / products.ts 顶部同一模式，禁止 import x from './x.json' 直用。
 *
 * 档期口径：start ≤ now ≤ end 为"在线"。构建期过滤一次（打进静态 HTML 的初帧），
 * 客户端 PromotionsBanner 水合后每 30s 按真实时间复核 + 倒计时（活动到期前端自动回退，
 * 无需重新构建 / 重新发布，与预售横幅同一策略）。
 *
 * 折扣码不在发布产物中（批次 1 不同步 Shopify，等闸门 A Admin API token）。
 */

export interface PromotionConfig {
  /** 活动类型（批次 1 只有 banner / flash） */
  type: 'banner' | 'flash';
  /** 活动名（唯一标识，如 BFCM-2026；GA4 promotion_id 用） */
  name: string;
  /** 横幅主文案 */
  bannerLine: string;
  /** 折扣标签（如 "30% Off"） */
  discountLabel: string;
  /** 开始时间 ISO */
  start: string;
  /** 结束时间 ISO（到期自动回退） */
  end: string;
}

import * as adminPromotionsNs from './admin-promotions.json';

type AdminPromotionsFile = {
  generatedAt?: string;
  promotions?: PromotionConfig[];
};

// Next/webpack 下 JSON 有 default 导出；build 脚本 CJS 直载时 namespace 即 JSON 本体
const adminPromotionsFile: AdminPromotionsFile =
  (adminPromotionsNs as unknown as { default?: AdminPromotionsFile }).default ??
  (adminPromotionsNs as unknown as AdminPromotionsFile);

function isOnline(p: PromotionConfig, now: number): boolean {
  const s = new Date(p.start).getTime();
  const e = new Date(p.end).getTime();
  if (Number.isNaN(s) || Number.isNaN(e) || e < s) return false;
  return s <= now && now <= e;
}

/** 构建期过滤出的"在线"活动（SSG 首帧口径；客户端横幅会按真实时间复核） */
export const ACTIVE_PROMOTIONS: PromotionConfig[] = (adminPromotionsFile.promotions ?? []).filter((p) =>
  isOnline(p, Date.now())
);

/** 运行时在线判定（客户端倒计时 / 到期回退用） */
export function onlinePromotionAt(now: number): PromotionConfig | undefined {
  return (adminPromotionsFile.promotions ?? []).filter((p) => isOnline(p, now))[0];
}
