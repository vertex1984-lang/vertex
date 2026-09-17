import type { Metadata } from 'next';
import V2Hero from '@/components/v2/V2Hero';
import V2CategoryGrid from '@/components/v2/V2CategoryGrid';
import V2BrandBanner from '@/components/v2/V2BrandBanner';
import V2Recommended from '@/components/v2/V2Recommended';
import V2ShopByColor from '@/components/v2/V2ShopByColor';
import V2ShopByScene from '@/components/v2/V2ShopByScene';
import V2ShopByStyleBento from '@/components/v2/V2ShopByStyleBento';
import V2FeaturedProducts from '@/components/v2/V2FeaturedProducts';
import PressBar from '@/components/v2/PressBar';
import V2Newsletter from '@/components/v2/V2Newsletter';
import { getFeaturedProducts } from '@/data/featured-sections';
import {
  getShopByColorData,
  getShopBySceneData,
  getRecommendedData,
} from '@/data/home-sections';

export const metadata: Metadata = {
  title: 'Makimoo — Comfort, Woven Into Every Day',
  description:
    'Cushions, pillows, towels and soft home essentials crafted from honest materials. Free shipping over $49 and 30-day easy returns.',
};

// Featured 的数据源统一在 src/data/featured-sections.ts（与 Featured 汇总页共用）
const featuredProducts = getFeaturedProducts();
// Shop by Color / Scene / Recommended 的选品在 server 端完成（src/data/home-sections.ts），
// client 组件只接收精简卡片数据，避免把整个目录打进浏览器 bundle
const shopByColor = getShopByColorData();
const shopByScene = getShopBySceneData();
const recommended = getRecommendedData();

export default function V2HomePage() {
  return (
    <>
      <V2Hero />
      <V2CategoryGrid />
      <V2FeaturedProducts products={featuredProducts} />
      {/* banner 位于 Featured Products 与 Shop by Color 之间；下方保持与 Shop by Color 的间距 */}
      <V2BrandBanner />
      <V2ShopByColor colors={shopByColor.colors} productsByColor={shopByColor.productsByColor} />
      <V2ShopByScene scenes={shopByScene.scenes} />
      {/* Shop by Style（2026-09 定稿：画报错落网格方案；Lookbook/杂志大字两稿已删）。
          替换原 V2TrustStats（Comfort Loved by Millions 数据区，组件保留未删） */}
      <V2ShopByStyleBento />
      {/* 原 New Arrivals 位：按浏览历史推荐的关联促销区（无历史时回退 Best Sellers） */}
      <V2Recommended fallback={recommended.fallback} candidates={recommended.candidates} />
      <PressBar />
      <V2Newsletter />
    </>
  );
}
