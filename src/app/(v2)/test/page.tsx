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
 * /test/ 测试版首页 · 第四轮（2026-10-10，iOS 26 Safari 刘海染色，用户定）：
 * 已证实：公告条置顶 → 刘海采公告条色（绿示踪）；无公告条+透明头部 → 恒米色（已上线）；
 * 公告条挪导航行下方 → 用户否（公告条必须置顶）；收起后 opacity:0 → 照样被采（滚动仍橘）。
 * 本轮：公告条置顶但【最后加载】——初始 display:none，hero 移动端背景图加载完成后
 * 直接显示（无动画）。验证 Safari 是否在公告条晚到时重新采样（若是，刘海米色→橘色跳变）。
 * 加载顺序：① 首帧 SSR（米色 spacer + 透明导航行）→ ② hero CSS 背景图 → ③ 公告条。
 * 差异全部由 V2Header 的 isTest 分支实现，正式版不受影响。
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
