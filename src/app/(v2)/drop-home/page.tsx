import type { Metadata } from 'next';
import V2HeroDrop from '@/components/v2/V2HeroDrop';
import V2HowItWorks from '@/components/v2/V2HowItWorks';
import V2DropLatest from '@/components/v2/V2DropLatest';
import V2NextDrops from '@/components/v2/V2NextDrops';
import V2Manifesto from '@/components/v2/V2Manifesto';
import V2MoodFeed from '@/components/v2/V2MoodFeed';
import V2BrandBanner from '@/components/v2/V2BrandBanner';
import V2InspirationTeaser from '@/components/v2/V2InspirationTeaser';
import V2Recommended from '@/components/v2/V2Recommended';
import { getRecommendedData } from '@/data/home-sections';
import { resolveUrl } from '@/lib/paths';

export const metadata: Metadata = {
  title: { absolute: 'Makimoo – Drop 01 · The First Collection (preview)' },
  description: 'Drop-mode homepage preview. Not linked from the live site.',
  robots: { index: false, follow: false },
};

const recommended = getRecommendedData();

/**
 * /drop-home —— Drop 模式首页试验副本（2026-11-27 用户定：做成副本，不动现主页）。
 * 依据《Drop模式战略与首页方案-2026-11.md》第六节：
 * Hero（Drop 01 文案层 + 双 CTA + 截止徽章）→ How it works 说明带 →
 * Drop 01 在售批次（合并卡 + 进度条）→ Next Drops 心愿解锁区 → Manifesto 品质叙事 →
 * 留存段沿用现版（MoodFeed / BrandBanner / InspirationTeaser）→ Recommended 兜底。
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
      <V2HowItWorks />
      <V2DropLatest />
      <V2NextDrops />
      <V2Manifesto />
      <V2MoodFeed />
      <V2BrandBanner />
      <V2InspirationTeaser />
      <V2Recommended fallback={recommended.fallback} candidates={recommended.candidates} />
    </>
  );
}
