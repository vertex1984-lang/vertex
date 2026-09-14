import type { Metadata } from 'next';
import V2Hero from '@/components/v2/V2Hero';
import V2CategoryGrid from '@/components/v2/V2CategoryGrid';
import V2BrandBanner from '@/components/v2/V2BrandBanner';
import V2Recommended from '@/components/v2/V2Recommended';
import V2TrustStats from '@/components/v2/V2TrustStats';
import V2ShopByColor from '@/components/v2/V2ShopByColor';
import V2ShopByScene from '@/components/v2/V2ShopByScene';
import V2FeaturedProducts from '@/components/v2/V2FeaturedProducts';
import PressBar from '@/components/v2/PressBar';
import V2Newsletter from '@/components/v2/V2Newsletter';
import { getFeaturedProducts } from '@/data/featured-sections';

export const metadata: Metadata = {
  title: 'Makimoo — Comfort, Woven Into Every Day',
  description:
    'Cushions, pillows, towels and soft home essentials crafted from honest materials. Free shipping over $49 and 30-day easy returns.',
};

// Featured 的数据源统一在 src/data/featured-sections.ts（与 Featured 汇总页共用）
const featuredProducts = getFeaturedProducts();

export default function V2HomePage() {
  return (
    <>
      <V2Hero />
      <V2CategoryGrid />
      <V2FeaturedProducts products={featuredProducts} />
      {/* banner 位于 Featured Products 与 Shop by Color 之间；下方保持与 Shop by Color 的间距 */}
      <V2BrandBanner />
      <V2ShopByColor />
      <V2ShopByScene />
      <V2TrustStats />
      {/* 原 New Arrivals 位：按浏览历史推荐的关联促销区（无历史时回退 Best Sellers） */}
      <V2Recommended />
      <PressBar />
      <V2Newsletter />
    </>
  );
}
