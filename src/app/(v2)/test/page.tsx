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
 * /test/ 测试版首页（2026-10-10，iOS 26 Safari 刘海染色采样源诊断，用户定）：
 * 区块与正式首页完全一致，差异全部由 V2Header 的 isTest 分支实现：
 * 1. 恢复移动端公告条，背景换鲜绿示踪色 #16a34a —— 真机看刘海颜色即可定位采样源：
 *    绿 = 采到公告条（absolute 子层规避失效）；暖棕 = 采到 hero 照片；
 *    米色 = spacer/body 回落（目标结果）
 * 2. 移动端恢复默认透明头部（撤销恒实底；透明态是 SSR 首帧终态，无需 JS 水合，
 *    头部先于 hero 完成渲染）
 * 3. hero 维持 CSS 背景图，天然最后加载
 * 正式版（/）不受任何影响；诊断结束后此目录删除。
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
