import type { Metadata } from 'next';
import V2Hero from '@/components/v2/V2Hero';
import V2TrustBar from '@/components/v2/V2TrustBar';
import V2MoodFeed from '@/components/v2/V2MoodFeed';
import V2BrandBanner from '@/components/v2/V2BrandBanner';
import V2SloganBanner from '@/components/v2/V2SloganBanner';
import V2Recommended from '@/components/v2/V2Recommended';
import { getRecommendedData } from '@/data/home-sections';

export const metadata: Metadata = {
  title: 'Makimoo — Comfort, Woven Into Every Day',
  description:
    'Cushions, pillows, towels and soft home essentials crafted from honest materials. Free shipping over $49 and 30-day easy returns.',
};

// Recommended 的选品在 server 端完成（src/data/home-sections.ts），
// client 组件只接收精简卡片数据，避免把整个目录打进浏览器 bundle
const recommended = getRecommendedData();

/**
 * 首页区块顺序 —— ins 种草流版（2026-10-08 测试副本）：
 * Hero（一行标语 + Shop Beddings 按钮）→ 信任条（原四格版式，底色与页面一致、短发丝线分隔）→
 * V2MoodFeed（"Find Your Comfort" 统一板块：7 张种草卡，2026-10-08 用户定合并原图流与类目卡）→
 * 品牌视频横幅（含 Better Texture 文案 + 透明 Fabric Guide 按钮）→
 * Slogan 大图（替代原 TrustBanner 双卡长文案）→ Recommended（页尾转化兜底）。
 * 移除：Best Sellers 产品轨（入口保留在 /best-sellers/ 页）、Shop by Color、
 * Shop by Scene、首页的 V2CategoryGrid（组件保留，/categories 页仍在用）。
 */
export default function V2HomePage() {
  return (
    <>
      <V2Hero />
      <V2TrustBar />
      <V2MoodFeed />
      <V2BrandBanner />
      <V2SloganBanner />
      {/* 页尾转化兜底：按浏览历史推荐（无历史时回退 Best Sellers） */}
      <V2Recommended fallback={recommended.fallback} candidates={recommended.candidates} />
    </>
  );
}
