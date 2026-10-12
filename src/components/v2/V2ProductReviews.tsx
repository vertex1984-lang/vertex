import { getProductReviews } from '@/data/product-reviews';
import V2ReviewsList from './V2ReviewsList';

/**
 * PDP 评价区（2026-10 重构，新旧两种 PDP 变体共用，page.tsx 渲染）。
 * 均分/星级/分布条已上移至购买区（ProductDetailUpgrade / V2ProductDetailClient），
 * 本区 = 标题 + 评价卡列表（预览 3 条，Show more 展开，交互见 V2ReviewsList）。
 * 数据来自 src/data/product-reviews.ts；无数据时整体不渲染。锚点 id="reviews"。
 * 合规红线：不出现任何验证声明 / Amazon 字样。
 */
export default function V2ProductReviews({ asin }: { asin: string }) {
  const reviews = getProductReviews(asin);
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="bg-off-white scroll-mt-28">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 pb-14 lg:pb-20">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2 text-center">Reviews</p>
        <h2 className="text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal mb-8 text-center">
          What Buyers Say
        </h2>
        <V2ReviewsList reviews={reviews} />
      </div>
    </section>
  );
}
