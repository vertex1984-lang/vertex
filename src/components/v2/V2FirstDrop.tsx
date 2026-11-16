import V2ProductCard from '@/components/v2/V2ProductCard';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { preorderOf } from '@/data/preorder';

/**
 * 首页「首发系列」区（2026-11-15 上线方案 1.1 / 1.7）：3 个首发预售 SKU 作为 First Drop
 * 故事位——hero 只放主力款（后续按 1.7 重做 hero 时引用同一配置源），本区放全三款
 * （每家族一张代表色卡，Pre-Order 徽标/交期由 V2ProductCard 自动带出）。
 * 数据源 = 预售配置（admin 发布可换款），配置一换本区自动跟随——与"临时三款可换"口径一致。
 */
const DROP_REPRESENTATIVES = [
  'long-staple-cotton-towel-sage-40x70-mk-towel-lsc-sage-40x70', // 引流
  'makimoo-100-linen-duvet-cover-set-3-piece-bedding-set-with-linen3-sage-queen', // 主力
  '100-percent-linen-duvet-cover-set-3-piece-king-size-bedding-linen3-sage-king', // 形象
];

export default function V2FirstDrop() {
  const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA);
  const byHandle = new Map(enriched.map((p) => [p.handle, p] as const));
  const picks = DROP_REPRESENTATIVES.map((h) => byHandle.get(h)).filter(
    (p): p is MakimooProduct => Boolean(p) && Boolean(preorderOf(p!.handle))
  );
  if (picks.length === 0) return null; // 首发配置未发布时零痕迹

  return (
    <section className="bg-off-white">
      <div className="max-w-[1520px] lg:w-[80%] mx-auto px-6 lg:px-10 py-14 lg:py-20">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand text-center">First Drop</p>
        <h2 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight text-charcoal text-center">
          Pre-Order Our First Release
        </h2>
        <p className="mt-2 text-sm text-charcoal-light text-center max-w-xl mx-auto leading-relaxed">
          Made to order in small batches — ships within 35 days, full refund anytime before it ships. Everything else is coming soon: join the list, we&rsquo;ll email you first.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {picks.map((p) => (
            <V2ProductCard key={p.handle} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
