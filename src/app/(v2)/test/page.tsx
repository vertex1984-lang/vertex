import type { Metadata } from 'next';
import V2Hero from '@/components/v2/V2Hero';
import V2TrustBar from '@/components/v2/V2TrustBar';
import V2MoodFeed from '@/components/v2/V2MoodFeed';
import V2BrandBanner from '@/components/v2/V2BrandBanner';
import V2SloganBanner from '@/components/v2/V2SloganBanner';
import V2Recommended from '@/components/v2/V2Recommended';
import { getRecommendedData } from '@/data/home-sections';

export const metadata: Metadata = {
  title: 'Makimoo TEST 6 — 刘海采样诊断页（勿外传）',
  robots: { index: false, follow: false },
  // 第六轮（2026-10-10）：meta 主动控制状态栏——apple web app  capable +
  // black-translucent（状态栏半透明、页面透出米色、状态栏文字白色），
  // 参考 volcengine.com/article/2767547；常规 Safari 浏览下大概率无效（历史上
  // 仅对主屏幕 web app 生效），本轮实测验证
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

// 与正式首页同一口径：server 端选品，client 组件只收精简卡片数据
const recommended = getRecommendedData();

/**
 * /test/ 测试版首页 · 第六轮（2026-10-10，iOS 26 Safari 刘海染色，用户定）：
 * 已钉死：Safari 26 动态重采样——公告条无论何时出现（首帧/hero 后/延迟 3s），
 * 出现瞬间刘海米色→橘色跳变；时序方案全部排除；公告条必须置顶（用户定）。
 * 本轮：meta 主动控制（apple-mobile-web-app-capable + status-bar-style
 * black-translucent），公告条置顶立即显示。页面中央红底 TEST N 标记用于确认
 * 线上部署版本（第几轮就是数字几）。
 * 差异由 V2Header isTest 分支 + 本页 metadata 实现，正式版不受影响。
 */
export default function TestHomePage() {
  return (
    <>
      {/* 版本标记：确认线上是否已部署到最新一轮测试 */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] bg-red-600 text-white text-3xl font-extrabold px-6 py-3 rounded-xl shadow-2xl pointer-events-none">
        TEST 6
      </div>
      <V2Hero />
      <V2TrustBar />
      <V2MoodFeed />
      <V2BrandBanner />
      <V2SloganBanner />
      <V2Recommended fallback={recommended.fallback} candidates={recommended.candidates} />
    </>
  );
}
