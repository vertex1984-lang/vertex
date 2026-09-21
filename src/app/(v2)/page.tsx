import type { Metadata } from 'next';
import V2Hero from '@/components/v2/V2Hero';
import V2CategoryGrid from '@/components/v2/V2CategoryGrid';
import V2BrandBanner from '@/components/v2/V2BrandBanner';
import V2Recommended from '@/components/v2/V2Recommended';
import V2ShopByColor from '@/components/v2/V2ShopByColor';
import V2ShopByScene from '@/components/v2/V2ShopByScene';
import V2ShopByStyleBento from '@/components/v2/V2ShopByStyleBento';
import V2FeaturedProducts from '@/components/v2/V2FeaturedProducts';
import V2ReviewCarousel, { ReviewItem } from '@/components/v2/V2ReviewCarousel';
import { getFeaturedProducts } from '@/data/featured-sections';
import {
  getShopByColorData,
  getShopBySceneData,
  getRecommendedData,
} from '@/data/home-sections';
import { getProductByHandle } from '@/data/products';
import { v2url } from '@/lib/v2paths';

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

// Review 区：占位评价文案 + 被评价产品 handle（待真实评价数据接入后整体替换）；
// 图片与链接在构建期从目录解析，避免把目录打进客户端 bundle
const REVIEW_DEFS = [
  {
    author: 'Sarah M.', rating: 5,
    body: 'The cushions are thick, the fabric feels premium, and they have survived two rainstorms without fading. Could not be happier.',
    handle: 'set-of-4-outdoor-dining-chair-cushions-comfort-patio-seating-b0bbzsgdbq',
  },
  {
    author: 'James L.', rating: 5,
    body: 'Used it on a 10-hour flight and actually slept. The snap buttons keep it in place and the cover washes easily.',
    handle: 'memory-foam-travel-pillow-neck-pillow-with-360-degree-head-s-b0bxckknn8',
  },
  {
    author: 'Emily R.', rating: 4,
    body: 'The pillow inserts are full and hold their shape well. One star off because shipping took a few days longer than expected.',
    handle: 'throw-pillow-inserts-45cm-x-45cm-18-x-18-cushion-inserts-hol-b0cqc6h9mz',
  },
  {
    author: 'Daniel K.', rating: 5,
    body: 'You can tell these were designed with care. The ties are sturdy and the fabric is soft but durable. Will buy again.',
    handle: 'set-of-2-outdoor-dining-chair-cushions-comfort-patio-seating-b0bcjqyyl1',
  },
  {
    author: 'Olivia T.', rating: 5,
    body: 'My wooden chairs went from torture devices to the most comfortable seats in the house. The colors match the photos exactly.',
    handle: 'set-of-4-outdoor-dining-chair-cushions-comfort-patio-seating-b0c33lpy5g',
  },
  {
    author: 'Michael B.', rating: 4,
    body: 'Solid construction and fair pricing. The 30-day return policy made it an easy decision, but I am keeping them.',
    handle: 'throw-pillow-inserts-30-x-50cm-12-x-20-cushion-inserts-hollo-b0cqbzm49v',
  },
];
const reviewItems: ReviewItem[] = REVIEW_DEFS.flatMap((r) => {
  const p = getProductByHandle(r.handle);
  const image = p?.shopifyImages?.[0];
  if (!p || !image) return [];
  return [{
    author: r.author,
    rating: r.rating,
    body: r.body,
    product: p.title,
    image,
    href: v2url(`/products/${p.handle}/`),
  }];
});

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
      {/* Review 区：图文分屏大卡轮播（左图右文，移动端上图下文；2026-09 重构）。
          Newsletter 模块已按用户要求移除（2026-09） */}
      <V2ReviewCarousel items={reviewItems} />
    </>
  );
}
