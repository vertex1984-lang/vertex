import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import BeddingSetCard from '@/components/v2/BeddingSetCard';
import { resolveUrl } from '@/lib/paths';
import { CATEGORY_DEFS } from '@/data/subcategories';
import { PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';
import { collapseToFamilies, toFamilyCard } from '@/lib/family-cards';
import type { BlanketFamily } from '@/data/blanket-families';

export const metadata: Metadata = {
  title: 'Best Sellers',
  description:
    'Shop Makimoo best sellers — the comfort essentials our customers love most, across bedding, pillows, cushions, towels, mats and more.',
};

/**
 * 选品规则（2026-10-20 用户定）：类目均衡配额——每个一级类目按权重取 Top 4 个家族
 * （8 类共 32 款；纯权重 Top N 实测 75% 是床品+枕头，榜单会严重偏科）。
 * 展示不分区：单一网格，round-robin 交错混排（第 1 排 = 每类第 1 名，第 2 排 = 每类第 2 名…），
 * 首屏即覆盖全部类目。
 */
const PER_CAT = 4;

const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA);
// 家族卡（2026-10-20 用户定：全站产品卡统一为家族卡）：
// 每类用未去重的 enriched 在售列表成族（需看到全部尺寸 SKU 才有正确 From 价），权重序取前 4
const byCat: BlanketFamily[][] = CATEGORY_DEFS.map((cat) =>
  collapseToFamilies(
    enriched.filter(
      (p) => p.hasShopifyData && p.shopifyAvailable && p.productType.toLowerCase() === cat.value
    )
  ).slice(0, PER_CAT)
);

// round-robin 交错：rank 优先、类目其次（类目顺序 = CATEGORY_DEFS 注册表序）
const families: BlanketFamily[] = [];
for (let rank = 0; rank < PER_CAT; rank++) {
  for (const list of byCat) {
    if (list[rank]) families.push(list[rank]);
  }
}

/** Best Sellers 独立页：不分区的全站榜单（单一网格，选品规则见上）。 */
export default function BestSellersPage() {
  return (
    <>
      {/* 页头：客厅场景背景图 + 深色渐变罩层保证文字可读（pt 补偿 fixed 导航，高度比原设计高约 10%） */}
      <section className="relative text-cream pt-14 lg:pt-14 pb-16 lg:pb-24 overflow-hidden">
        <img
          src={resolveUrl('/images/brand/hero-bg-2.webp')}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/60 to-charcoal/30" />
        <div className="relative px-6 lg:px-10">
          <Reveal>
            <p className="text-xs lg:text-sm font-semibold tracking-[0.3em] uppercase text-cream/70 mb-4">
              Customer Favorites
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] mb-5">
              Best Sellers
            </h1>
            <p className="text-base text-cream/80 max-w-xl">
              The most-loved picks across the whole store — ranked by what our customers actually reorder.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 全站榜单：32 个家族卡单网格（8 类 × Top 4 交错混排），网格口径同 /products?cat= 列表页 */}
      <section className="py-8 lg:py-12">
        <div className="px-3 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
            {families.map((f) => (
              <BeddingSetCard key={f.key} family={toFamilyCard(f)} compactText />
            ))}
          </div>
        </div>
      </section>
      {/* 底部深色 CTA 带（Loved by Thousands）已按用户要求移除（2026-09） */}
    </>
  );
}
