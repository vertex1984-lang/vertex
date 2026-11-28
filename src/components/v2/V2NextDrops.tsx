import V2CarouselRow from '@/components/v2/V2CarouselRow';
import V2WishCard from '@/components/v2/V2WishCard';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { NEXT_DROPS_WISHLIST, WishItem } from '@/data/next-drops';
import { v2url } from '@/lib/v2paths';

/**
 * V2NextDrops —— Drop 模式首页副本的「心愿解锁」区（2026-11-27，/drop-home 试验页专用）。
 * Kickstarter "即将上线" 等价物：Coming Soon 的独立设计款 + 心愿进度条，
 * 攒满目标数量即开 made-to-order 批次（"Help decide what we make next"）。
 * 数据在 src/data/next-drops.ts（10 款，wanted 演示写死）；完整列表页 = /next-drops/。
 */

export default function V2NextDrops() {
  const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA);
  const byHandle = new Map(enriched.map((p) => [p.handle, p] as const));
  const picks = NEXT_DROPS_WISHLIST.map((w) => ({ wish: w, product: byHandle.get(w.handle) })).filter(
    (x): x is { wish: WishItem; product: MakimooProduct } => Boolean(x.product)
  );
  if (picks.length === 0) return null;

  return (
    <section id="next-drops" className="bg-off-white">
      <div className="w-full pb-12 lg:pb-16">
        <div className="px-6 lg:px-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] lg:text-xs font-semibold tracking-[0.25em] uppercase text-brand mb-2">
              Next Drops
            </p>
            <h2 className="text-2xl lg:text-[32px] font-extrabold tracking-tight text-charcoal">
              Help decide what we make next.{' '}
              <span className="block lg:inline mt-1 lg:mt-0 text-lg lg:text-2xl font-semibold text-brand">
                Wishlist a design — when it hits its goal, we make the batch.
              </span>
            </h2>
          </div>
          <a
            href={v2url('/next-drops/')}
            className="group hidden lg:inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand"
          >
            <span className="border-b border-brand/40 pb-0.5 transition-colors group-hover:border-brand">
              View all {picks.length}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
        {/* 与 Drop 01 区同一滑动/定宽语言 */}
        <V2CarouselRow className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-6 lg:scroll-px-10 pb-2 px-6 lg:gap-6 lg:px-10 lg:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {picks.map(({ wish, product }) => (
            <div key={wish.handle} className="w-[68vw] shrink-0 snap-start lg:w-auto lg:flex-1 lg:min-w-[440px]">
              <V2WishCard wish={wish} product={product} />
            </div>
          ))}
        </V2CarouselRow>
        {/* 移动端 View all 入口（桌面端在标题行右侧） */}
        <p className="mt-4 px-6 lg:hidden">
          <a href={v2url('/next-drops/')} className="text-xs font-semibold text-brand border-b border-brand/40 pb-0.5">
            View all {picks.length} concepts →
          </a>
        </p>
      </div>
    </section>
  );
}
