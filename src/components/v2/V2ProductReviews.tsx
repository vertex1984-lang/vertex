import { getVariantReviewStats } from '@/data/product-reviews';
import V2ReviewsList from './V2ReviewsList';
import ReviewCta from './ReviewCta';
import StarDisplay from './StarDisplay';

/**
 * PDP 评价区（2026-10-12 合并版，新旧两种 PDP 变体共用，page.tsx 渲染于 Recently Viewed 正上方）。
 * 布局（用户定）：宽容器与主区域同宽（1520px/80%）；顶部摘要带 = 大均分+星级+Based on 与
 * 五星分布条同排靠左（不分置两端、不上下堆叠）；摘要带下方 REVIEWS/What Buyers Say 标题 +
 * 评价卡（桌面两列网格，移动端横滑轮播）；写评价入口（ReviewCta）与评分摘要在同一区域
 * （2026-10-12 用户定：桌面端排评分分布条右端，移动端自然堆叠，不分隔成两个区域）。
 * 数据（2026-10-10 领导定，去统一化）：全部走 getVariantReviewStats 变体评价计划——
 * B0 家族 = 真实总数 + 卡片实算；AI 家族 = 每变体确定性 N∈[100,2000]、均分 4.1-4.3、
 * 约 1/3 家族分布含 1-2★ 段；低星家族额外展示 1★/2★ 补充卡（2026-10-13 领导定），与卡片区解耦。
 * "Based on N customer reviews" 合规文案唯一出处 = 本区（购买区不再重复）。
 * 合规红线：不出现任何验证声明 / Amazon 字样。数据来自 src/data/product-reviews.ts；
 * 无数据时整体不渲染。锚点 id="reviews"（老 PDP 气泡锚跳用；
 * 新 PDP 锚跳 page.tsx 外层包裹的 id="pdp2-reviews"）。
 */
export default function V2ProductReviews({ asin, productTitle }: { asin: string; productTitle?: string }) {
  const stats = getVariantReviewStats(asin);
  if (!stats || stats.reviews.length === 0) return null;

  return (
    <section id="reviews" className="bg-off-white scroll-mt-28">
      {/* 移动端顶部间距收紧（2026-10-12 用户定：评分摘要与上方品牌区间空隙过大），桌面端保持 py-20 */}
      {/* 移动端顶部间距收紧（2026-10-12 用户定：评分摘要与上方品牌区间空隙过大），桌面端保持 py-20 */}
      <div className="max-w-[1520px] lg:w-[80%] mx-auto px-6 lg:px-10 pt-4 pb-14 lg:py-20">
        {/* 摘要带（2026-10-12 用户定）：分数块 + 分布条 + 写评价入口合并同一区域——
            桌面端三栏同排（CTA 紧随分布条靠左），移动端自然换行堆叠在分布条下方；
            不再用分隔线把 Write a Review 与评分拆成两个区域 */}
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
            {/* CTA：桌面端紧随分布条靠左对齐（不吸附右端，2026-10-12 用户定）；
                移动端自然堆叠并与上方评分拉开间距（mt-4） */}
            <div className="w-full mt-4 lg:mt-0 lg:w-auto">
              <ReviewCta wide productTitle={productTitle} />
            </div>
          </div>
        </div>

        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2 text-center">Reviews</p>
        <h2 className="text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal mb-8 text-center">
          What Buyers Say
        </h2>
        <V2ReviewsList reviews={stats.reviews} />
      </div>
    </section>
  );
}
