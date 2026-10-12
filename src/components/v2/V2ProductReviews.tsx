import { getVariantReviewStats } from '@/data/product-reviews';
import V2ReviewsList from './V2ReviewsList';
import ReviewCta from './ReviewCta';
import StarDisplay from './StarDisplay';

/**
 * PDP 评价区（2026-10 重构，新旧两种 PDP 变体共用，page.tsx 经插槽渲染函数传入）。
 * 2026-10-07 领导定：本区下移至信任条之后、相关商品之前（对齐亚马逊 Customer reviews 位）；
 * 购买区分布卡撤出（分数收进评级气泡 V2RatingPopover），分布条移至本区。
 * 2026-10-10 领导定（去统一化）：分布条 / Based on N / 大评分全部走 getVariantReviewStats
 * 变体评价计划（每变体确定性 N∈[100,2000]、均分 4.1-4.3、约 1/3 家族分布含 1-2★ 段），
 * 与卡片区解耦（亚马逊"热门评价子集"同款逻辑）；1-2 星不生成卡片，只体现在分布条。
 * "Based on N customer reviews" 合规文案唯一出处 = 本区。数据来自 src/data/product-reviews.ts；
 * 无数据时整体不渲染。锚点 id="reviews"。
 * 2026-10-10 领导定（参考亚马逊桌面版，解决评价区比上下内容窄的不协调）：
 * wide=true（新品变体）容器与上下模块同宽（80%/1520px），lg+ 左右分栏——左栏摘要
 * （标题左对齐 + 大评分 + Based on + 分布条），右栏评论列表（单列）；移动端保持原堆叠布局。
 * wide=false（老品变体）维持 max-w-3xl 窄版（与相邻 Details 同宽）。
 * 合规红线：不出现任何验证声明 / Amazon 字样。
 */
export default function V2ProductReviews({ asin, wide = false, productTitle }: { asin: string; wide?: boolean; productTitle?: string }) {
  const stats = getVariantReviewStats(asin);
  if (!stats || stats.reviews.length === 0) return null;
  const total = stats.reviewCount;
  const buckets = stats.buckets;

  return (
    <section id="reviews" className="bg-off-white scroll-mt-28">
      <div
        className={
          wide
            ? 'max-w-[1520px] lg:w-[80%] lg:max-w-none mx-auto px-6 lg:px-10 pb-14 lg:pb-20'
            : 'max-w-3xl mx-auto px-6 lg:px-10 pb-14 lg:pb-20'
        }
      >
        <div className={wide ? 'lg:grid lg:grid-cols-[minmax(0,4fr)_minmax(0,9fr)] lg:gap-12 xl:gap-16' : undefined}>
          <div>
            <p
              className={`text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2 text-center ${wide ? 'lg:text-left' : ''}`}
            >
              Reviews
            </p>
            <h2
              className={`text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal mb-6 text-center ${wide ? 'lg:text-left' : ''}`}
            >
              What Buyers Say
            </h2>
            {wide && (
              <div className="hidden lg:flex items-center gap-2.5 mb-1.5">
                <span className="text-3xl font-extrabold text-charcoal leading-none">{stats.rating.toFixed(1)}</span>
                <StarDisplay rating={stats.rating} size={18} />
              </div>
            )}
            <div className={`max-w-xs ${wide ? 'lg:mx-0' : ''} mx-auto mb-4 lg:mb-8`}>
              <div className="space-y-1">
                {buckets.map(({ star, pct }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="w-6 text-right text-[11px] text-charcoal-light">{star}★</span>
                    <div className="flex-1 h-1.5 rounded-full bg-warm-gray overflow-hidden">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-[11px] text-charcoal-light">{Math.round(pct)}%</span>
                  </div>
                ))}
              </div>
              <p className={`mt-2.5 text-xs text-charcoal-light text-center ${wide ? 'lg:text-left' : ''}`}>
                Based on {total.toLocaleString()} customer reviews
              </p>
            </div>
            <ReviewCta wide={wide} productTitle={productTitle} />
          </div>
          <div className={wide ? 'min-w-0' : undefined}>
            <V2ReviewsList reviews={stats.reviews} />
          </div>
        </div>
      </div>
    </section>
  );
}
