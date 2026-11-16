import ReviewCta from './ReviewCta';

/**
 * PDP 评价位·品牌级引用块（2026-11-15 上线方案 1.6 评价策略）：无单品真实评价时
 * 顶替评价区（page.tsx 条件渲染，有真实评价后让位 V2ProductReviews）。
 * 内容（方案 1.6 空位口径）：
 * - 品牌级证据补位："★ 4.6 · Rated by 14,000+ customers on Amazon"——措辞锚定品牌、
 *   不锚定单品，不出现"该单品在亚马逊有售"的暗示；
 * - 透明度叙事（预售款）："launching as a pre-sale — be one of the first"（主动说破新款首发）；
 * - 面料/工艺实证 chips（材质来自商品 specs；备料实拍照片资产到位后可扩图，本期文字位）；
 * - 退款承诺加重露出："Full refund anytime before it ships"；
 * - 写评价入口（种子评价管道：D32 签收邮件邀请落本区锚点）。
 * 锚点 id="reviews" 保持（追踪入口/邮件深链落点不失效）。信任条数字（14,000+）属
 * FTC substantiation 范围须可举证——业务侧责任，见方案 1.6。
 */
export default function V2BrandReviewBlock({
  productTitle,
  material,
  isPreorder = false,
}: {
  productTitle?: string;
  material?: string;
  isPreorder?: boolean;
}) {
  const proofChips: { label: string; value: string }[] = [];
  if (material) proofChips.push({ label: 'Material', value: material });
  proofChips.push(
    { label: 'Craft', value: 'Made to order in small batches' },
    { label: 'Inspection', value: 'Inspected & photographed before packing' }
  );

  return (
    <section id="reviews" className="bg-off-white scroll-mt-28">
      <div className="max-w-[1520px] lg:w-[80%] mx-auto px-6 lg:px-10 pt-4 pb-14 lg:py-20">
        <div className="pb-10 lg:pb-14 mb-10 lg:mb-14 border-b border-warm-gray/60">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand">Reviews</p>
          <h2 className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal">
            <span className="text-brand" aria-hidden="true">★ 4.6</span>
            <span className="text-charcoal-light font-bold text-base lg:text-xl">
              Rated by 14,000+ customers on Amazon
            </span>
          </h2>
          <p className="mt-3 max-w-2xl text-sm lg:text-base text-charcoal-light leading-relaxed">
            Makimoo brand rating across our home textile lines.
            {isPreorder && (
              <> This style is launching as a pre-sale — be one of the first to own it.</>
            )}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {proofChips.map((c) => (
              <span
                key={c.label}
                className="rounded-full border border-warm-gray bg-white px-3.5 py-1.5 text-xs text-charcoal-light"
              >
                <span className="font-semibold text-charcoal">{c.label}:</span> {c.value}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm font-semibold text-brand">
            Full refund anytime before it ships.
          </p>
          <div className="mt-5">
            <ReviewCta productTitle={productTitle} />
          </div>
        </div>
      </div>
    </section>
  );
}
