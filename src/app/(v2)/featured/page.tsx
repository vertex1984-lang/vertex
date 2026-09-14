import type { Metadata } from 'next';
import V2FeaturedProducts from '@/components/v2/V2FeaturedProducts';
import V2BestSellersBento from '@/components/v2/V2BestSellersBento';
import V2NewArrivalsSpotlight from '@/components/v2/V2NewArrivalsSpotlight';
import {
  getFeaturedProducts,
  getBestSellerProducts,
  getNewArrivalProducts,
} from '@/data/featured-sections';

export const metadata: Metadata = {
  title: 'Featured | Makimoo',
  description:
    'Makimoo featured picks — editor-selected products, best sellers and new arrivals in one place.',
};

// 三个模块的锚点 id，导航 Featured 弹窗子项跳转到对应模块位置
const FEATURED_SECTION_IDS = {
  featured: 'featured-products',
  bestSellers: 'best-sellers',
  newArrivals: 'new-arrivals',
} as const;

/**
 * Featured 汇总页：Featured Products / Best Sellers / New Arrivals 三个模块，
 * 数据与首页一致（src/data/featured-sections.ts）。
 * 各模块外层 div 带锚点 id + scroll-mt（补偿 fixed 导航高度），支持 /featured#xxx 定位。
 * 无深色页头（用户要求移除），首个模块上方用 pt 留出 fixed 导航的高度。
 */
export default function V2FeaturedPage() {
  return (
    <>
      <div id={FEATURED_SECTION_IDS.featured} className="scroll-mt-32 pt-28 lg:pt-36">
        <V2FeaturedProducts products={getFeaturedProducts()} />
      </div>
      <div id={FEATURED_SECTION_IDS.bestSellers} className="scroll-mt-32">
        <V2BestSellersBento products={getBestSellerProducts().slice(0, 6)} />
      </div>
      <div id={FEATURED_SECTION_IDS.newArrivals} className="scroll-mt-32">
        <V2NewArrivalsSpotlight products={getNewArrivalProducts().slice(0, 5)} />
      </div>
    </>
  );
}
