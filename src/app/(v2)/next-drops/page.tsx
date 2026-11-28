import type { Metadata } from 'next';
import V2WishCard from '@/components/v2/V2WishCard';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { NEXT_DROPS_WISHLIST, WishItem } from '@/data/next-drops';

export const metadata: Metadata = {
  title: 'Next Drops — Help decide what we make next',
  description:
    'Wishlist a Makimoo concept design. When a design hits its wishlist goal, we produce a small made-to-order batch and notify everyone who wanted it.',
};

/**
 * /next-drops —— 心愿解锁专区页（2026-11-27，Drop 模式试验）。
 * 机制说明（Kickstarter goal 语言）+ 全部 Concept 设计的心愿卡网格。
 * 演示版 wanted 写死（src/data/next-drops.ts）；正式版第一期 admin 写入，第二期 CF 后端真实计数。
 */
export default function NextDropsPage() {
  const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA);
  const byHandle = new Map(enriched.map((p) => [p.handle, p] as const));
  const picks = NEXT_DROPS_WISHLIST.map((w) => ({ wish: w, product: byHandle.get(w.handle) })).filter(
    (x): x is { wish: WishItem; product: MakimooProduct } => Boolean(x.product)
  );

  return (
    <div className="mx-auto max-w-[1520px] px-4 lg:px-10 py-10 lg:py-14">
      <p className="text-[11px] lg:text-xs font-semibold tracking-[0.25em] uppercase text-brand">
        Next Drops
      </p>
      <h1 className="mt-2 text-2xl lg:text-4xl font-extrabold tracking-tight text-charcoal">
        Help decide what we make next.
      </h1>
      {/* 机制说明：三行讲清心愿 → 解锁 → 生产，与首页 How it works 同一口径 */}
      <div className="mt-4 max-w-3xl text-sm lg:text-base leading-relaxed text-charcoal-light space-y-2">
        <p>
          These are studio concepts — designed in-house, not yet in production. Tap{' '}
          <strong className="text-charcoal">Want it</strong> on the ones you love.
        </p>
        <p>
          When a design hits <strong className="text-charcoal">500 wishes</strong>, we cut a small
          made-to-order batch and open pre-orders — everyone on the wishlist gets first access and
          the launch price.
        </p>
        <p>No overstock. No waste. Only what people actually want.</p>
      </div>

      <div className="mt-8 lg:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {picks.map(({ wish, product }) => (
          <V2WishCard key={wish.handle} wish={wish} product={product} />
        ))}
      </div>
    </div>
  );
}
