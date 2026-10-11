import type { Metadata } from 'next';
import V2Hero from '@/components/v2/V2Hero';
import V2TrustBar from '@/components/v2/V2TrustBar';
import V2MoodFeed from '@/components/v2/V2MoodFeed';
import V2BrandBanner from '@/components/v2/V2BrandBanner';
import V2SloganBanner from '@/components/v2/V2SloganBanner';
import V2Recommended from '@/components/v2/V2Recommended';
import { getRecommendedData } from '@/data/home-sections';

export const metadata: Metadata = {
  title: 'Makimoo TEST 7 — 刘海采样诊断页（勿外传）',
  robots: { index: false, follow: false },
  // 第七轮（2026-10-10）：撤掉第六轮的 appleWebApp meta（真机实测无效——
  // 该 meta 仅对"添加到主屏幕"的 web app 生效，常规 Safari 浏览不读取）；
  // 本轮改测 parachutehome 同构方案（见 V2Header isTest 分支），无需 meta
};

// 与正式首页同一口径：server 端选品，client 组件只收精简卡片数据
const recommended = getRecommendedData();

/**
 * /test/ 测试版首页 · 第七轮（2026-10-10，iOS 26 Safari 刘海染色，用户定）：
 * 已钉死：Safari 26 动态重采样——公告条无论何时出现（首帧/hero 后/延迟 3s），
 * 出现瞬间刘海米色→橘色跳变；theme-color 与 apple status-bar meta 均无效；
 * DOM 层规避（absolute 子层/spacer/opacity:0）全部无效——采样器只认"视口顶部
 * 实际绘制的彩条颜色"。parachutehome 黑公告条不染色的原因 = 其公告条是
 * static（滚动即滚走、不在采样范围）且 sticky 导航首屏位于公告条下方、
 * 不在 ≤4px 采样点，采样落空回落白底。本轮全站同构 parachute 结构（仅本页）：
 * 公告条 static 置顶可滚走、导航 sticky 贴刘海下缘（见 V2Header isTest 分支）；
 * hero 用负 margin 上滑到 sticky 导航下方，保持"透明头部压大图"的原视觉。
 * 页面中央红底 TEST N 标记用于确认线上部署版本（第几轮就是数字几）。
 * 差异由 V2Header isTest 分支实现，正式版不受影响。
 */
export default function TestHomePage() {
  return (
    <>
      {/* 版本标记：确认线上是否已部署到最新一轮测试 */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] bg-red-600 text-white text-3xl font-extrabold px-6 py-3 rounded-xl shadow-2xl pointer-events-none">
        TEST 7
      </div>
      {/* hero 上滑到 sticky 导航下方（导航行高：移动 52px=py-1.5+logo h-10，
          桌面 88px=py-4+h-14），保持透明头部压大图的视觉 */}
      <div className="-mt-[52px] lg:-mt-[88px]">
        <V2Hero />
      </div>
      <V2TrustBar />
      <V2MoodFeed />
      <V2BrandBanner />
      <V2SloganBanner />
      <V2Recommended fallback={recommended.fallback} candidates={recommended.candidates} />
    </>
  );
}
