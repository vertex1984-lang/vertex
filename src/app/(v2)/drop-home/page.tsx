import type { Metadata } from 'next';
import V2HeroDrop from '@/components/v2/V2HeroDrop';
import V2HowItWorksBar from '@/components/v2/V2HowItWorksBar';
import V2DropLatest from '@/components/v2/V2DropLatest';
import V2NextDrops from '@/components/v2/V2NextDrops';
import V2Manifesto from '@/components/v2/V2Manifesto';
import V2MoodFeedDrop from '@/components/v2/V2MoodFeedDrop';
import V2InspirationRooms from '@/components/v2/V2InspirationRooms';
import { resolveUrl } from '@/lib/paths';

export const metadata: Metadata = {
  title: { absolute: 'Makimoo – Drop 01 · The First Collection (preview)' },
  description: 'Drop-mode homepage preview. Not linked from the live site.',
  robots: { index: false, follow: false },
};

/**
 * /drop-home —— Drop 模式首页试验副本（2026-11-27 用户定：做成副本，不动现主页）。
 * 依据《Drop模式战略与首页方案-2026-11.md》第六节：
 * Hero（Drop 01 文案层 + 双 CTA + 截止徽章）→ How it works 流程说明条（2026-11-28 起为
 * 紧贴 hero 的连贯横条 V2HowItWorksBar，原卡片区撤下）→
 * Drop 01 在售批次（合并卡 + 进度条）→ Next Drops 心愿解锁区 → Manifesto 品质叙事 →
 * 留存段：MoodFeedDrop（合并类目卡横滑行，2026-11-28 起不再共用现主页 V2MoodFeed）→
 * Inspiration 三房间分区（V2InspirationRooms，2026-11-28 用户定，取代 InspirationTeaser）。
 * 2026-11-28 用户定：BrandBanner 视频区撤下（视频移作 Manifesto 背景），Manifesto 文案精简；
 * 底部 Recommended（Based on Your Browsing）撤下（组件保留 V2Recommended.tsx，现主页在用）。
 * 与现首页差异：去掉 TrustBar（由 How it works 取代信任锚点位）、SloganBanner（由 Manifesto 取代）。
 */
export default function DropHomePage() {
  return (
    <>
      <link rel="preload" as="image" href={resolveUrl('/images/brand/hero-drop-mobile.webp')} media="(max-width: 1023px)" />
      <link rel="preload" as="image" href={resolveUrl('/images/brand/hero-drop-desktop.webp')} media="(min-width: 1024px)" />
      <div className="-mt-[48px] lg:-mt-[76px]">
        <V2HeroDrop />
      </div>
      {/* 紧贴 hero 的流程说明条（2026-11-28 用户定，仿 Parachute）；原 V2HowItWorks 卡片区
          内容重复，已撤下（组件保留在 V2HowItWorks.tsx，可恢复） */}
      <V2HowItWorksBar />
      <V2DropLatest />
      <V2NextDrops />
      <V2Manifesto />
      <V2MoodFeedDrop />
      {/* BrandBanner（Inspiration 视频区）已撤下：视频素材移给 Manifesto 做背景（2026-11-28 用户定），
          组件保留在 V2BrandBanner.tsx 供现主页继续使用 */}
      <V2InspirationRooms />
    </>
  );
}
