import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import GroupProductCard from '@/components/v2/GroupProductCard';
import { resolveUrl } from '@/lib/paths';
import { CATEGORY_DEFS } from '@/data/subcategories';
import { PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';
import { collapseToFamilies } from '@/lib/family-cards';
import { buildGroupCards, type GroupCard } from '@/lib/group-cards';

export const metadata: Metadata = {
  title: 'Best Sellers',
  description:
    'Shop Makimoo best sellers — the comfort essentials our customers love most, across bedding, pillows, cushions, towels, mats and more.',
};

/**
 * 选品规则（2026-10-20 用户定）：类目均衡配额——每个一级类目按权重取 Top 4 个家族
 * （7 类共 28 款；纯权重 Top N 实测 75% 是床品+枕头，榜单会严重偏科。Dining 类目 2026-10-21
 *  全站下线，产品并入 Decor，榜单随之减为 7 类）。
 * 2026-10-22 用户定（一组一卡 + 色卡）：配额口径从家族（组::颜色）升级为变体组——
 * 每类 Top 4 个组，组内全部颜色由卡面色卡展示。
 * 展示不分区：单一网格。2026-10-21 用户定：round-robin 交错混排改为软分区平铺
 * （每类 4 张连续，xl 四列 = 每行一个类目；原交错混排首屏覆盖全类目但视觉杂，已弃用）。
 */
const PER_CAT = 4;

const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA);
// 组卡（2026-10-22 用户定：一组一卡 + 色卡）：
// 每类用未去重的 enriched 在售列表成族（需看到全部尺寸 SKU 才有正确 From 价），
// 并成组卡后权重序取前 4
const byCat: GroupCard[][] = CATEGORY_DEFS.map((cat) =>
  buildGroupCards(
    collapseToFamilies(
      enriched.filter(
        (p) => p.hasShopifyData && p.shopifyAvailable && p.productType.toLowerCase() === cat.value
      )
    )
  ).slice(0, PER_CAT)
);

// 2026-10-21 用户定：round-robin 交错改为"软分区"平铺——每类 4 张连续排列
// （xl 四列 = 每行恰好一个类目，行内图片风格统一，混排杂感大降；不加分区标题，仍是单网格）。
// 代价：首屏不再覆盖全类目（原 round-robin 的初衷），用户已权衡接受。
// 历史：round-robin 交错混排（第 1 排 = 每类第 1 名…），首屏覆盖全部类目
const cards: GroupCard[] = byCat.flat();

/** Best Sellers 独立页：不分区的全站榜单（单一网格，选品规则见上）。 */
export default function BestSellersPage() {
  return (
    <>
      {/* 页头：暖金卧室场景背景图 + 深色渐变罩层保证文字可读（pt 补偿 fixed 导航）。
          2026-10-21 用户定：换氛围感更强的 hero-bg-3（暖金晨光；hero-autumn 是首页 hero 不重复使用，
          hero-bg-3 原属已退役的 HeroCarousel 死代码，释放可用）；高度加高、标题字号收小 */}
      <section className="relative text-cream pt-16 lg:pt-24 pb-24 lg:pb-40 overflow-hidden">
        <img
          src={resolveUrl('/images/brand/hero-bg-3.webp')}
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
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight leading-[1.05] mb-4">
              Best Sellers
            </h1>
            <p className="text-sm lg:text-base text-cream/80 max-w-xl">
              The most-loved picks across the whole store — ranked by what our customers actually reorder.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 全站榜单：28 个组卡单网格（7 类 × Top 4 软分区平铺，每行一个类目；reserveSwatchRow
          固定色卡行占位，单色/无变体组也留行高，卡片信息区对齐），网格口径同 /products?cat= 列表页 */}
      <section className="py-8 lg:py-12">
        <div className="px-3 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
            {cards.map((c) => (
              <GroupProductCard key={c.key} card={c} compactText reserveSwatchRow />
            ))}
          </div>
        </div>
      </section>
      {/* 底部深色 CTA 带（Loved by Thousands）已按用户要求移除（2026-09） */}
    </>
  );
}
