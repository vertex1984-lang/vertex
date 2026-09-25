import { getProductReviews } from '@/data/product-reviews';

/** 单颗星（fill=false 时描边空心） */
function Star({ fill }: { fill: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth={fill ? 0 : 1.5}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

interface V2ProductReviewsProps {
  asin: string;
  rating?: number;
  reviewCount?: number;
}

/**
 * PDP 真实评价区（2026-09 新增，新旧两种 PDP 变体共用，page.tsx 渲染）。
 * 数据来自 src/data/product-reviews.ts（Amazon 真实评价脱敏精选，填写规范见该文件头注释）；
 * 无数据时整体不渲染。锚点 id="reviews"，供 PDP 头部星级行点击跳转。
 */
export default function V2ProductReviews({ asin, rating, reviewCount }: V2ProductReviewsProps) {
  const reviews = getProductReviews(asin);
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="bg-off-white scroll-mt-28">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 pb-14 lg:pb-20">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2 text-center">Reviews</p>
        <h2 className="text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal mb-8 text-center">
          What Buyers Say
        </h2>
        <div className="space-y-4">
          {reviews.map((r, i) => (
            <div key={i} className="rounded-xl border border-warm-gray bg-white p-5 lg:p-6">
              <div className="flex items-center gap-1 text-brand">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} fill={n <= r.rating} />
                ))}
              </div>
              {r.title && <p className="mt-2.5 text-sm font-bold text-charcoal">{r.title}</p>}
              <p className="mt-1.5 text-sm text-charcoal-light leading-relaxed">{r.text}</p>
              <p className="mt-3 text-xs text-[#999]">
                <span className="font-semibold text-charcoal">{r.author}</span>
                <span className="mx-1.5">·</span>Verified Amazon Purchase
                {r.date && (
                  <>
                    <span className="mx-1.5">·</span>
                    {r.date}
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
        {rating != null && reviewCount != null && reviewCount > 0 && (
          <p className="mt-5 text-center text-xs text-[#999]">
            Rated {rating.toFixed(1)} / 5 from {reviewCount.toLocaleString()} Amazon reviews — a selection shown above.
          </p>
        )}
      </div>
    </section>
  );
}
