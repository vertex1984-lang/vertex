import V2CarouselRow from '@/components/v2/V2CarouselRow';
import V2ProductCard from '@/components/v2/V2ProductCard';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { preorderOf, mergedPreorderOf, PREORDER_SALE_DEADLINE_LABEL } from '@/data/preorder';

/**
 * V2DropLatest —— Drop 模式首页副本的「Drop 01 在售批次」区（2026-11-27，/drop-home 试验页专用）。
 * 与首页 V2FirstDrop 同一卡片/合并/进度条逻辑，差异只在叙事层：
 * Drop 编号 eyebrow + 右侧截止徽章（潮牌 Drop 语言），导流 /pre-order/。
 */
// 与 V2FirstDrop 同口径：最新 4 款 Queen 代表（合并卡自动带出 Queen/King 全尺寸）
const DROP_REPRESENTATIVES = [
  'makimoo-queen-bedding-set-4-piece-linen-feel-sketch-rose-ivory-queen-mk-skrose4-ivory-queen', // Sketch Rose
  'makimoo-queen-bedding-set-4-piece-linen-feel-scarlet-toile-queen-mk-toile4-scarlet-queen', // Scarlet Toile
  'makimoo-queen-bedding-set-4-piece-cotton-feel-champagne-cream-queen-mk-champ4-cream-queen', // Champagne
  'makimoo-queen-bedding-set-4-piece-cotton-percale-cherry-bloom-queen-mk-cherry4-bloom-queen', // Cherry Cream
];

export default function V2DropLatest() {
  const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA);
  const byHandle = new Map(enriched.map((p) => [p.handle, p] as const));
  const picks = DROP_REPRESENTATIVES.map((h) => byHandle.get(h)).filter(
    (p): p is MakimooProduct => Boolean(p) && Boolean(preorderOf(p!.handle))
  );
  if (picks.length === 0) return null;

  return (
    <section id="drop-01" className="bg-off-white scroll-mt-[60px] lg:scroll-mt-[96px]">
      <div className="w-full py-12 lg:py-16">
        <div className="px-6 lg:px-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] lg:text-xs font-semibold tracking-[0.25em] uppercase text-brand mb-2">
              Drop 01 · First Release
            </p>
            <h2 className="text-2xl lg:text-[32px] font-extrabold tracking-tight text-charcoal">
              The Latest.{' '}
              <span className="block lg:inline mt-1 lg:mt-0 text-lg lg:text-2xl font-semibold text-brand">
                Pre-order now — 30% off · In-house design.
              </span>
            </h2>
          </div>
          {/* 截止徽章（Kickstarter 倒计时语言；静态文案，正式版接倒计时组件） */}
          <p className="hidden lg:block shrink-0 rounded-full border border-brand/40 px-4 py-1.5 text-xs font-semibold text-brand">
            Ends {PREORDER_SALE_DEADLINE_LABEL}
          </p>
        </div>
        <V2CarouselRow className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-6 lg:scroll-px-10 pb-2 px-6 lg:gap-6 lg:px-10 lg:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {picks.map((p) => {
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
      </div>
    </section>
  );
}
