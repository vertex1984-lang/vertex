import V2CarouselRow from '@/components/v2/V2CarouselRow';
import V2ProductCard from '@/components/v2/V2ProductCard';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { preorderOf, mergedPreorderOf } from '@/data/preorder';

/**
 * 首页「首发预售」区（2026-11-26 v4 用户定）：TrustBar 下第一屏全宽卡片区——
 * 标题 "The Latest" + 一行显著预售福利文案；卡片信息压图（渐变罩白字，不显示类目/价格），
 * 卡片恒定宽度横滑（2026-11-27 用户定，桌面溢出显箭头）；进度条凸显稀缺（claimed/total = admin 预售配置）。
 * "Pre-Order Details" 导流到 /pre-order/ 完整页。
 */
// 2026-11-27 用户定：首页只放 4 张卡 = 最新上传的 4 款，按上传顺序（Queen 款代表）
const DROP_REPRESENTATIVES = [
  'makimoo-queen-bedding-set-4-piece-linen-feel-sketch-rose-ivory-queen-mk-skrose4-ivory-queen', // Sketch Rose
  'makimoo-queen-bedding-set-4-piece-linen-feel-scarlet-toile-queen-mk-toile4-scarlet-queen', // Scarlet Toile
  'makimoo-queen-bedding-set-4-piece-cotton-feel-champagne-cream-queen-mk-champ4-cream-queen', // Champagne
  'makimoo-queen-bedding-set-4-piece-cotton-percale-cherry-bloom-queen-mk-cherry4-bloom-queen', // Cherry Cream
];

export default function V2FirstDrop() {
  const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA);
  const byHandle = new Map(enriched.map((p) => [p.handle, p] as const));
  const picks = DROP_REPRESENTATIVES.map((h) => byHandle.get(h)).filter(
    (p): p is MakimooProduct => Boolean(p) && Boolean(preorderOf(p!.handle))
  );
  if (picks.length === 0) return null; // 首发配置未发布时零痕迹

  return (
    <section id="first-drop" className="bg-off-white scroll-mt-[60px] lg:scroll-mt-[96px]">
      <div className="w-full py-12 lg:py-16">
        {/* Apple 式标题（2026-11-26 用户定）：主句深色粗体 + 副句 brand 色小字（贴合站点色系），左对齐 */}
        <div className="px-6 lg:px-10">
          <h2 className="text-2xl lg:text-[32px] font-extrabold tracking-tight text-charcoal">
            The Latest.{' '}
            <span className="block lg:inline mt-1 lg:mt-0 text-lg lg:text-2xl font-semibold text-brand">
              Pre-order now — 30% off · In-house design.
            </span>
          </h2>
        </div>
        {/* 卡片最小 440px、可随屏宽增大（2026-11-27 用户定：flex-1 等分填满，
            空间不足时守住 440px 下限转为横滑 + 箭头）；移动端 68vw 触摸滑动 */}
        <V2CarouselRow className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-6 lg:scroll-px-10 pb-2 px-6 lg:gap-6 lg:px-10 lg:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {picks.map((p) => {
            // 同款多尺寸合并一卡（2026-11-27 用户定）：进度条按 Queen+King 全组合计，标题标注全部可售尺寸
            const merged = mergedPreorderOf(p.handle);
            return (
              <div key={p.handle} className="w-[68vw] shrink-0 snap-start lg:w-auto lg:flex-1 lg:min-w-[440px]">
                <V2ProductCard
                  product={p}
                  overlayInfo
                  sizesLabel={merged?.sizesLabel}
                  scarcity={merged ? { claimed: merged.claimed, total: merged.total } : undefined}
                />
              </div>
            );
          })}
        </V2CarouselRow>
        {/* 规则页入口不放首页（2026-11-27 用户定）：/pre-order/ 只从预售款 PDP 的 PreorderBox 进入 */}
      </div>
    </section>
  );
}
