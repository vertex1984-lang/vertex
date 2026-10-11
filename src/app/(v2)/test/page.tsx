import type { Metadata } from 'next';
import V2Hero from '@/components/v2/V2Hero';
import V2TrustBar from '@/components/v2/V2TrustBar';
import V2MoodFeed from '@/components/v2/V2MoodFeed';
import V2BrandBanner from '@/components/v2/V2BrandBanner';
import V2SloganBanner from '@/components/v2/V2SloganBanner';
import V2Recommended from '@/components/v2/V2Recommended';
import { getRecommendedData } from '@/data/home-sections';

export const metadata: Metadata = {
  title: 'Makimoo TEST — 刘海采样诊断页（勿外传）',
  robots: { index: false, follow: false },
};

// 与正式首页同一口径：server 端选品，client 组件只收精简卡片数据
const recommended = getRecommendedData();

/**
 * /test/ 测试版首页 · 第三轮（2026-10-10，iOS 26 Safari 刘海染色，用户定）：
 * 前两轮已证实：公告条置顶 → 刘海采公告条颜色（绿示踪实证）；
 * 无公告条 + 透明头部 → 刘海恒米色（已应用到正式版）。
 * 本轮验证「公告条挪到导航行下方」：移动端顶部 = 米色 spacer → 透明导航行
 * （hero 图透上来）→ 橙色公告条。若刘海仍米色，该版式可推广到全站移动端，
 * 公告条得以在移动端保留。
 * 差异全部由 V2Header 的 isTest 分支实现（flex 重排），正式版不受影响。
 */
export default function TestHomePage() {
  return (
    <>
      <V2Hero />
      <V2TrustBar />
      <V2MoodFeed />
      <V2BrandBanner />
      <V2SloganBanner />
      <V2Recommended fallback={recommended.fallback} candidates={recommended.candidates} />
    </>
  );
}
