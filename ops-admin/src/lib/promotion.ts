/** 促销活动条目（批次 1：banner / flash 两种；发布产物为 vertex/src/data/admin-promotions.json，构建期按档期过滤） */
export type PromotionType = 'banner' | 'flash';

export interface PromotionEntry {
  id: string;
  type: PromotionType;
  /** 活动名（后台标识用，不进前台） */
  name: string;
  /** 横幅主文案（banner / flash 都显示在顶部横幅） */
  bannerLine: string;
  /** 折扣标签（如 "30% Off"，横幅与活动位共用） */
  discountLabel: string;
  /** 开始时间 ISO */
  start: string;
  /** 结束时间 ISO（在线判定 start ≤ now ≤ end，到期前端自动回退） */
  end: string;
  /** 折扣码（占位字段：批次 1 不同步 Shopify，等闸门 A Admin API token） */
  code?: string;
  note?: string;
  at: string;
  status: 'pending' | 'published';
  publishedAt?: string;
}

/** 后台展示用的档期状态（由 start/end 与当前时间现算，不落库） */
export type PromotionStage = 'scheduled' | 'online' | 'ended';

export function promotionStageOf(p: Pick<PromotionEntry, 'start' | 'end'>, now = Date.now()): PromotionStage {
  const s = new Date(p.start).getTime();
  const e = new Date(p.end).getTime();
  if (Number.isNaN(s) || Number.isNaN(e) || e < s) return 'scheduled';
  if (now < s) return 'scheduled';
  if (now > e) return 'ended';
  return 'online';
}

export const PROMOTION_STAGE_LABELS: Record<PromotionStage, string> = {
  scheduled: '排期',
  online: '在线',
  ended: '结束',
};
