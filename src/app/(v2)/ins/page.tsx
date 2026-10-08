import type { Metadata } from 'next';
import InsHero from '@/components/ins/InsHero';
import InsTrustBar from '@/components/ins/InsTrustBar';
import InsMoodFeed from '@/components/ins/InsMoodFeed';
import InsBrandBanner from '@/components/ins/InsBrandBanner';
import InsSloganBanner from '@/components/ins/InsSloganBanner';
import V2Recommended from '@/components/v2/V2Recommended';
import { getRecommendedData } from '@/data/home-sections';

// /ins 为测试版页面（2026-10-08 用户定：ins 种草流版上线到子路径，不占首页、不进 sitemap/搜索索引）
export const metadata: Metadata = {
  title: 'Makimoo — Comfort, Woven Into Every Day',
  description:
    'Cushions, pillows, towels and soft home essentials crafted from honest materials. Free shipping over $49 and 30-day easy returns.',
  robots: { index: false, follow: false },
};

// Recommended 的选品在 server 端完成（src/data/home-sections.ts），
// client 组件只接收精简卡片数据，避免把整个目录打进浏览器 bundle
const recommended = getRecommendedData();

/**
 * /ins 测试版首页（ins 种草流版）：组件独立放在 src/components/ins/，不影响正式首页。
 * Hero（标语 + Shop Beddings 按钮）→ 信任条（底色同页面、短发丝线）→
 * InsMoodFeed（"Find Your Comfort" 统一板块，7 张种草卡）→
 * 品牌视频横幅（Better Texture + 透明 Fabric Guide 按钮）→ Slogan 大图 → Recommended 兜底。
 */
export default function InsHomePage() {
  return (
    <>
      <InsHero />
      <InsTrustBar />
      <InsMoodFeed />
      <InsBrandBanner />
      <InsSloganBanner />
      <V2Recommended fallback={recommended.fallback} candidates={recommended.candidates} />
    </>
  );
}
