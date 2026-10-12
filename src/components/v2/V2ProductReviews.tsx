import { getProductReviews } from '@/data/product-reviews';
import V2ReviewsList from './V2ReviewsList';

/**
 * PDP 评价区（2026-10-12 重构，新旧两种 PDP 变体共用，page.tsx 渲染于 Recently Viewed 正上方）。
 * 顶部摘要带（大均分 + 星级 + "Based on N customer reviews" + 五星分布条）由购买区下移至此（用户定）；
 * 分布条口径与原购买区一致：按 product-reviews.ts 列表现算，hasRating && reviews.length >= 4 才显示。
 * "Based on N customer reviews" 为全站合规文案唯一出处（购买区不再重复）。
 * 合规红线：不出现任何验证声明 / Amazon 字样。
 * 数据来自 src/data/product-reviews.ts；无数据时整体不渲染。锚点 id="reviews"（老 PDP 星级行锚跳用；
 * 新 PDP 锚跳 page.tsx 外层包裹的 id="pdp2-reviews"）。
 */
export default function V2ProductReviews({ asin, rating, reviewCount }: { asin: string; rating?: number; reviewCount?: number }) {
  const reviews = getProductReviews(asin);
  if (reviews.length === 0) return null;

  const hasRating = rating != null && reviewCount != null && reviewCount > 0;
  const showDist = hasRating && reviews.length >= 4;
  const buckets = showDist
    ? [5, 4, 3, 2, 1].map((star) => ({
        star,
        pct: (reviews.filter((r) => r.rating === star).length / reviews.length) * 100,
      }))
    : [];

  return (
    <section id="reviews" className="bg-off-white scroll-mt-28">
      <div className="max-w-[1520px] lg:w-[80%] mx-auto px-6 lg:px-10 py-14 lg:py-20">
        {/* 摘要带：分数块与分布条同排靠左（2026-10-12 用户定：不分置两端、不上下堆叠） */}
        {hasRating && (
          <div className="flex items-center gap-6 lg:gap-14 pb-10 lg:pb-14 mb-10 lg:mb-14 border-b border-warm-gray/60">
            <div className="flex-shrink-0">
              <p className="text-5xl lg:text-6xl font-extrabold tracking-tight text-charcoal leading-none">
                {rating!.toFixed(1)}
              </p>
              <div className="mt-3 flex text-brand">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    width="20" height="20" viewBox="0 0 24 24"
                    fill={i <= Math.round(rating!) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth={i <= Math.round(rating!) ? 0 : 1.5}
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="mt-3 text-xs text-charcoal-light">
                Based on {reviewCount!.toLocaleString()} customer reviews
              </p>
            </div>
            {showDist && (
              <div className="flex-1 max-w-[400px] space-y-1">
                {buckets.map(({ star, pct }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="w-5 text-right text-[11px] text-charcoal-light">{star}★</span>
                    <div className="flex-1 h-1 rounded-full bg-warm-gray overflow-hidden">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-[11px] text-charcoal-light">{Math.round(pct)}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2 text-center">Reviews</p>
        <h2 className="text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal mb-8 text-center">
          What Buyers Say
        </h2>
        <V2ReviewsList reviews={reviews} />
      </div>
    </section>
  );
}
