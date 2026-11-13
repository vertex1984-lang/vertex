/**
 * 买家真实评价（2026-11-12 批次 3 评价闭环）：makimoo-admin /reviews 审核通过后发布写入，
 * 构建期读取，与 product-reviews.ts 的计划评价合并展示（真实评价置顶、计入统计）。
 *
 * 数据来源：src/data/reviews.json（双加载器模式，照 preorder.ts 抄；空配置 = 无影响）。
 * 匹配键 = 站内 handle（PDP 提交时原样上报，审核不改）。
 */

import * as reviewsNs from './reviews.json';
import type { ProductReview, VariantReviewStats } from './product-reviews';

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

/**
 * 合并口径（批次 3 任务 2.4，验收报告批次 2 遗留口径延续）：
 * - 真实评价（admin approved）置顶展示；无真实评价时保持计划评价现状（原样返回）；
 * - 有真实评价时并入统计重算：base.buckets 的 pct 反推绝对计数 + 每条真实评价 +1，
 *   重算均分与分布（reviewCount 同步加真实条数）；
 * - base 为 null 且有真实评价 → 用真实评价构造统计（评价区照常渲染）。
 */
export function mergeReviewStats(
  base: VariantReviewStats | null,
  adminReviews: ProductReview[]
): VariantReviewStats | null {
  if (adminReviews.length === 0) return base;
  if (!base) {
    const counts = new Map<number, number>();
    for (const r of adminReviews) counts.set(r.rating, (counts.get(r.rating) || 0) + 1);
    const total = adminReviews.length;
    const sum = adminReviews.reduce((s, r) => s + r.rating, 0);
    return {
      reviewCount: total,
      rating: sum / total,
      buckets: [5, 4, 3, 2, 1].map((star) => ({
        star,
        pct: ((counts.get(star) || 0) / total) * 100,
      })),
      reviews: adminReviews,
      isB0: false,
    };
  }
  // base 存在：绝对计数 = round(pct × reviewCount)，逐星并入真实评价计数后重算
  const counts = new Map<number, number>();
  for (const b of base.buckets) {
    counts.set(b.star, Math.round((b.pct / 100) * base.reviewCount));
  }
  for (const r of adminReviews) counts.set(r.rating, (counts.get(r.rating) || 0) + 1);
  const total = base.reviewCount + adminReviews.length;
  let sum = 0;
  for (const entry of Array.from(counts.entries())) sum += entry[0] * entry[1];
  return {
    reviewCount: total,
    rating: total > 0 ? sum / total : base.rating,
    buckets: [5, 4, 3, 2, 1].map((star) => ({
      star,
      pct: total > 0 ? ((counts.get(star) || 0) / total) * 100 : 0,
    })),
    // 真实评价置顶（ newest-first 由调用方排序逻辑兜底），计划评价跟随
    reviews: [...adminReviews, ...base.reviews],
    isB0: base.isB0,
  };
}
