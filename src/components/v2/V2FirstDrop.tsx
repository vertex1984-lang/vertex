import V2ProductCard from '@/components/v2/V2ProductCard';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { preorderOf, PREORDER_CONFIGS, PREORDER_LIMIT_PER_DROP } from '@/data/preorder';

/**
 * 首页「首发预售」区（2026-11-26 v4 用户定）：TrustBar 下第一屏全宽卡片区——
 * 标题 "The Latest" + 一行显著预售福利文案；卡片信息压图（渐变罩白字，不显示类目/价格），
 * 移动端横向滚动（不要两列网格），桌面 4 列全宽；进度条凸显稀缺（claimed/total = admin 预售配置）。
 * "Pre-Order Details" 导流到 /pre-order/ 完整页。
 */
const DROP_REPRESENTATIVES = [
  'long-staple-cotton-towel-sage-40x70-mk-towel-lsc-sage-40x70', // 引流
  'makimoo-100-linen-duvet-cover-set-3-piece-bedding-set-with-linen3-sage-queen', // 主力
  '100-percent-linen-duvet-cover-set-3-piece-king-size-bedding-linen3-sage-king', // 形象
  '100-linen-duvet-cover-set-queen-size-3-piece-bedding-set-1-linen3-dustyblue-queen', // 第二色系
];

export default function V2FirstDrop() {
  const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA);
  const byHandle = new Map(enriched.map((p) => [p.handle, p] as const));
  const claimedOf = new Map(PREORDER_CONFIGS.map((c) => [c.handle, c.claimed] as const));
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
        {/* 移动端横向滑动（隐藏原生滚动条 + scroll-px 让 snap 吸附也保留左留白）；
            桌面 4 列全宽网格 */}
        <div className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-6 lg:scroll-px-10 pb-2 px-6 lg:px-10 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {picks.map((p) => {
            const claimed = claimedOf.get(p.handle);
            return (
              <div key={p.handle} className="w-[68vw] shrink-0 snap-start lg:w-auto">
                <V2ProductCard
                  product={p}
                  overlayInfo
                  scarcity={typeof claimed === 'number' ? { claimed, total: PREORDER_LIMIT_PER_DROP } : undefined}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
