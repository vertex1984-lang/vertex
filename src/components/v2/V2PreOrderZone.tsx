import V2ProductCard from '@/components/v2/V2ProductCard';
import { MakimooProduct } from '@/data/products';
import { mergedPreorderGroups, MergedPreorder } from '@/data/preorder';

/**
 * 类目页预售专区（2026-11-26 用户定，首发 bedding 页用）：
 * 正常网格上方的推广条——Apple 式一行标题 + 压图白字卡（含购买进度条），
 * 与首页 The Latest 区同一视觉语言。
 * 选品 = 预售配置 ∩ 传入的本类目产品（配置驱动，admin 换款自动跟随）；
 * 同款多尺寸合并一卡（2026-11-27 用户定：代表卡进 PDP，进度条/尺寸按全组口径）；
 * 正常网格不排除预售款（同日用户定方案 A：专区是推广位，允许与下方网格重复）。
 */
export default function V2PreOrderZone({ products }: { products: MakimooProduct[] }) {
  const byHandle = new Map(products.map((p) => [p.handle, p] as const));
  const picks = mergedPreorderGroups()
    .map((g) => ({ product: byHandle.get(g.repHandle), group: g }))
    .filter((x): x is { product: MakimooProduct; group: MergedPreorder } => Boolean(x.product));
  if (picks.length === 0) return null; // 本类目无预售配置时零痕迹

  return (
    <div className="mb-10 lg:mb-14">
      {/* Apple 式标题（同首页 The Latest 口径） */}
      <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight text-charcoal">
        The First Drop.{' '}
        <span className="block lg:inline mt-1 lg:mt-0 text-base lg:text-xl font-semibold text-brand">
          Pre-order now — 30% off · In-house design.
        </span>
      </h2>
      {/* 移动端横滑（隐藏滚动条 + snap），桌面 4 列网格 */}
      <div className="mt-5 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {picks.map(({ product, group }) => (
          <div key={product.handle} className="w-[62vw] shrink-0 snap-start lg:w-auto">
            <V2ProductCard
              product={product}
              overlayInfo
              sizesLabel={group.sizesLabel}
              scarcity={{ claimed: group.claimed, total: group.total }}
            />
          </div>
        ))}
      </div>
      {/* 与正常网格的区隔（2026-11-26 方案）：发丝线 + All Bedding 小标题 */}
      <div className="mt-10 lg:mt-12 border-t border-warm-gray/70" />
      <h3 className="mt-4 mb-4 text-lg lg:text-2xl font-extrabold text-[#333]">All Bedding</h3>
    </div>
  );
}
