/**
 * 买家真实评价（2026-11-12 批次 3 评价闭环；2026-11-15 上线方案 1.6 评价策略重构）：
 * 只显示 makimoo-admin 审核发布（approved）的真实买家评价——AI 计划评价（product-reviews.ts）
 * 按上线评价策略全面下线：不再注入 rating/reviewCount、不再渲染评价区（FTC fabricated
 * reviews 风险，方案 1.6 点名）；无真实评价时 PDP 评价位由 V2BrandReviewBlock
 * （品牌级引用 + 空位内容）顶替，评价模块隐藏。
 * 数据来源：src/data/reviews.json（双加载器模式，照 preorder.ts 抄）。匹配键 = 站内 handle。
 * 命名说明：模块名 real-reviews（非 reviews）——CJS 直载加载器按 .js/.json/.ts 顺序探测，
 * reviews.ts 会被同名 reviews.json 遮蔽（build-weights.js 实测踩坑），改名后全环境无歧义。
 */

import * as reviewsNs from './reviews.json';
import type { ProductReview } from './product-reviews';

type ReviewsFile = {
  generatedAt?: string;
  reviews?: { handle: string; author?: string; title?: string; text: string; rating: number; date?: string }[];
};

// Next/webpack 下 JSON 有 default 导出；build 脚本 CJS 直载时 namespace 即 JSON 本体
const reviewsFile: ReviewsFile =
  (reviewsNs as unknown as { default?: ReviewsFile }).default ??
  (reviewsNs as unknown as ReviewsFile);

/** 按 handle 取已审核的真实评价（转 ProductReview 形态，供评价列表直接渲染） */
export function getAdminReviews(handle: string | undefined): ProductReview[] {
  if (!handle) return [];
  return (reviewsFile.reviews ?? [])
    .filter((r) => r.handle === handle)
    .map((r) => ({
      author: r.author?.trim() || 'Anonymous',
      rating: Math.min(5, Math.max(1, Math.round(r.rating))),
      title: r.title || undefined,
      text: r.text,
      date: r.date || undefined,
    }));
}

/** 真实评价聚合（唯一展示口径）：评价模块渲染 + PDP 星级行 + JSON-LD 同源；无真实评价 = null */
export interface RealReviewStats {
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  /** 五星分布（5→1），真实评价实算 */
  buckets: { star: number; pct: number }[];
}

export function getRealReviewStats(handle: string | undefined): RealReviewStats | null {
  const reviews = getAdminReviews(handle);
  if (reviews.length === 0) return null;
  const total = reviews.length;
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  const counts = new Map<number, number>();
  for (const r of reviews) counts.set(r.rating, (counts.get(r.rating) || 0) + 1);
  return {
    rating: sum / total,
    reviewCount: total,
    reviews,
    buckets: [5, 4, 3, 2, 1].map((star) => ({
      star,
      pct: ((counts.get(star) || 0) / total) * 100,
    })),
  };
}
