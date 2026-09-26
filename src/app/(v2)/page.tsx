import type { Metadata } from 'next';
import V2Hero from '@/components/v2/V2Hero';
import V2TrustBar from '@/components/v2/V2TrustBar';
import V2CategoryGrid from '@/components/v2/V2CategoryGrid';
import V2BrandBanner from '@/components/v2/V2BrandBanner';
import V2Recommended from '@/components/v2/V2Recommended';
import V2ShopByColor from '@/components/v2/V2ShopByColor';
import V2ShopByScene from '@/components/v2/V2ShopByScene';
import V2FeaturedProducts from '@/components/v2/V2FeaturedProducts';
import V2TrustBanner from '@/components/v2/V2TrustBanner';
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

/**
 * 首页区块顺序（2026-09 用户定）：
 * Hero → 信任条（V2TrustBar，真实文案）→ 品类网格 → Best Sellers（沿用 Featured 数据规则，
 * 替换原 Shop by Style Bento，组件 V2ShopByStyleBento 保留磁盘备用）→ 品牌视频横幅 →
 * Shop by Color → Shop by Scene → 品牌故事+评价双卡（V2TrustBanner，自 main 恢复）→
 * Recommended（Recently Viewed 老客横轨，暂不改动）。
 * Review 轮播（V2ReviewCarousel）不再上首页（双卡右栏已含短评价），组件保留磁盘备用。
 */
export default function V2HomePage() {
  return (
    <>
      <V2Hero />
      <V2TrustBar />
      <V2CategoryGrid />
      <V2FeaturedProducts products={featuredProducts} />
      {/* banner 位于 Best Sellers 与 Shop by Color 之间（2026-09 用户定挪位）；样式不变 */}
      <V2BrandBanner />
      <V2ShopByColor colors={shopByColor.colors} productsByColor={shopByColor.productsByColor} />
      <V2ShopByScene scenes={shopByScene.scenes} />
      {/* 品牌故事 + 评价双卡：样式不动，位置在 Scene 之后（2026-09 用户定） */}
      <V2TrustBanner />
      {/* 原 New Arrivals 位：按浏览历史推荐的关联促销区（无历史时回退 Best Sellers） */}
      <V2Recommended fallback={recommended.fallback} candidates={recommended.candidates} />
    </>
  );
}
