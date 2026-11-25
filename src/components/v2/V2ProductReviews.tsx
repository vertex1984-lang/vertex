import { getRealReviewStats } from '@/data/real-reviews';
import V2ReviewsList from './V2ReviewsList';
import ReviewCta from './ReviewCta';
import StarDisplay from './StarDisplay';

/**
 * PDP 评价区（2026-10-12 合并版；2026-11-15 上线方案 1.6 评价策略重构）：
 * 只渲染 admin 审核发布的真实买家评价（reviews.json，按 handle）——
 * AI 计划评价全面下线；无真实评价时整区不渲染（返回 null），
 * 评价位由 V2BrandReviewBlock（品牌级引用 + 空位内容）顶替（page.tsx 条件渲染）。
 * 布局同前：摘要带（大均分 + 星级 + Based on 与五星分布条同排）+ REVIEWS/What Buyers Say
 * 标题 + 评价卡（桌面两列网格，移动端横滑轮播）；写评价入口与摘要在同一区域。
 * "Based on N customer reviews" = 真实评价数（合规：不提 Amazon、无验证声明）。
 * 锚点 id="reviews"（老 PDP 气泡锚跳用；新 PDP 锚跳 page.tsx 外层包裹的 id="pdp2-reviews"）。
 */
export default function V2ProductReviews({ handle, productTitle }: { handle?: string; productTitle?: string }) {
  const stats = getRealReviewStats(handle);
  if (!stats) return null;

  return (
    <section id="reviews" className="bg-off-white scroll-mt-28">
      {/* 移动端顶部间距收紧（2026-10-12 用户定），桌面端保持 py-20 */}
      <div className="max-w-[1520px] lg:w-[80%] mx-auto px-6 lg:px-10 pt-4 pb-14 lg:py-20">
        {/* 摘要带：分数块 + 分布条 + 写评价入口同一区域（桌面三栏同排，移动端堆叠） */}
        <div className="pb-10 lg:pb-14 mb-10 lg:mb-14 border-b border-warm-gray/60">
          <div className="flex flex-wrap items-center gap-6 lg:gap-14">
            <div className="flex-shrink-0">
              <p className="text-5xl lg:text-6xl font-extrabold tracking-tight text-charcoal leading-none">
                {stats.rating.toFixed(1)}
              </p>
              <div className="mt-3">
                <StarDisplay rating={stats.rating} size={20} />
              </div>
              <p className="mt-3 text-xs text-charcoal-light">
                Based on {stats.reviewCount.toLocaleString()} customer reviews
              </p>
            </div>
            <div className="flex-1 max-w-[400px] space-y-1">
              {stats.buckets.map(({ star, pct }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-5 text-right text-[11px] text-charcoal-light">{star}★</span>
                  <div className="flex-1 h-1 rounded-full bg-warm-gray overflow-hidden">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-[11px] text-charcoal-light">{Math.round(pct)}%</span>
                </div>
              ))}
            </div>
            <div className="w-full mt-4 lg:mt-0 lg:w-auto">
              <ReviewCta wide productTitle={productTitle} handle={handle} />
            </div>
          </div>
        </div>

        {/* 标题 + 排序切换器（W9 用户定）在 V2ReviewsList（client，与切换器共享状态） */}
        <V2ReviewsList reviews={stats.reviews} eyebrow="Reviews" title="What Buyers Say" />
      </div>
    </section>
  );
}
