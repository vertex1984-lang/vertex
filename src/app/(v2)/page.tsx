import type { Metadata } from 'next';
import V2Hero from '@/components/v2/V2Hero';
import V2CategoryGrid from '@/components/v2/V2CategoryGrid';
import V2BrandBanner from '@/components/v2/V2BrandBanner';
import V2ShopByColor from '@/components/v2/V2ShopByColor';
import V2ShopByScene from '@/components/v2/V2ShopByScene';
import V2ShopByStyleBento from '@/components/v2/V2ShopByStyleBento';
import V2TrustBanner from '@/components/v2/V2TrustBanner';
import {
  getShopByColorData,
  getShopBySceneData,
} from '@/data/home-sections';

export const metadata: Metadata = {
  title: 'Makimoo — Comfort, Woven Into Every Day',
  description:
    'Cushions, pillows, towels and soft home essentials crafted from honest materials. Free shipping over $49 and 30-day easy returns.',
};

// Shop by Color / Scene 的选品在 server 端完成（src/data/home-sections.ts），
// client 组件只接收精简卡片数据，避免把整个目录打进浏览器 bundle
const shopByColor = getShopByColorData();
const shopByScene = getShopBySceneData();

export default function V2HomePage() {
  return (
    <>
      <V2Hero />
      <V2CategoryGrid />
      {/* Shop by Style（2026-09 定稿：画报错落网格方案；Lookbook/杂志大字两稿已删）。
          替换原 V2TrustStats（Comfort Loved by Millions 数据区，组件保留未删）。
          2026-09-22 起与 Featured Products 调换位置，上移至 CategoryGrid 之后 */}
      <V2ShopByStyleBento />
      {/* banner 位于 Shop by Style 与 Shop by Color 之间；下方保持与 Shop by Color 的间距 */}
      <V2BrandBanner />
      <V2ShopByColor colors={shopByColor.colors} productsByColor={shopByColor.productsByColor} />
      <V2ShopByScene scenes={shopByScene.scenes} />
      {/* Featured Products（Best Sellers）与 You May Also Like（V2Recommended）两区
          已按用户要求从首页移除（2026-09-22，组件保留未删） */}
      {/* 信任横幅（2026-09-22 用户定）：横板大图 + 平台信任状文案，替代原 Review 轮播
          （V2ReviewCarousel 组件保留未删）；Newsletter 模块已按用户要求移除（2026-09） */}
      <V2TrustBanner />
    </>
  );
}
