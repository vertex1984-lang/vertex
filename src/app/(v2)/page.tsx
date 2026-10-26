import type { Metadata } from 'next';
import V2Hero from '@/components/v2/V2Hero';
import V2TrustBar from '@/components/v2/V2TrustBar';
import V2MoodFeed from '@/components/v2/V2MoodFeed';
import V2BrandBanner from '@/components/v2/V2BrandBanner';
import V2SloganBanner from '@/components/v2/V2SloganBanner';
import V2Recommended from '@/components/v2/V2Recommended';
import { getRecommendedData } from '@/data/home-sections';
import { resolveUrl } from '@/lib/paths';

export const metadata: Metadata = {
  // absolute：跳过根布局 "%s | Makimoo" 模板，避免品牌名重复（2026-10-20 用户提）
  // 2026-10-20 用户定：标题格式对齐 Parachute（slogan + 品类描述），
  // Chrome tab 悬停卡片显示完整标题，slogan + 描述一眼看全；
  // tab slogan 用完整版 "Comfort, Woven Into Every Day"（2026-10-20 用户定：与首页 hero 一致）
  title: { absolute: 'Makimoo – Comfort, Woven Into Every Day. Bedding, pillows, cushions, decor and more.' },
  description:
    'Cushions, pillows, towels and soft home essentials crafted from honest materials. Free shipping over $49 and 30-day easy returns.',
};

// Recommended 的选品在 server 端完成（src/data/home-sections.ts），
// client 组件只接收精简卡片数据，避免把整个目录打进浏览器 bundle
const recommended = getRecommendedData();

/**
 * 首页区块顺序 —— ins 种草流版（2026-10-08 测试副本）：
 * Hero（一行标语 + Shop Beddings 按钮）→ 信任条（原四格版式，底色与页面一致、短发丝线分隔）→
 * V2MoodFeed（"Find Your Comfort" 统一板块：6 张种草卡方卡自然排列，2026-10-21 用户定 Dining 卡下线、
 * Blankets 不再通栏）→ 品牌视频横幅（"Shop the Look, / Everything You See." + Explore Scenes 按钮，
 * /scenes/ 入口）→ Slogan 大图（替代原 TrustBanner 双卡长文案）→ Recommended（页尾转化兜底）。
 * 移除：Best Sellers 产品轨（入口保留在 /best-sellers/ 页）、Shop by Color、
 * Shop by Scene、首页的 V2CategoryGrid（组件保留，/categories 页仍在用）。
 */
export default function V2HomePage() {
  return (
    <>
      {/* hero 大图预加载（2026-10-12 用户反馈加载中公告条与 hero 间有瞬态缝隙）：
          HTML 解析即发起 fetch，不必等 CSS 渲染后才加载背景图，缩短垫层暴露时间；
          移动端/桌面端按 media 各只预载对应的一张（rel=preload 为 body-ok link，放此处合法） */}
      <link rel="preload" as="image" href={resolveUrl('/images/brand/hero-autumn-mobile.webp')} media="(max-width: 1023px)" />
      <link rel="preload" as="image" href={resolveUrl('/images/brand/hero-autumn-desktop.webp')} media="(min-width: 1024px)" />
      {/* hero 上滑到 sticky 导航下方（导航行高：移动 52px=py-1.5+logo h-10，
          桌面 88px=py-4+h-14），保持透明头部压大图的视觉（2026-10-11 sticky 全站推广） */}
      <div className="-mt-[52px] lg:-mt-[88px]">
        <V2Hero />
      </div>
      <V2TrustBar />
      <V2MoodFeed />
      {/* Shop the Look 横幅位置 2026-10-21 用户定回滚：保持在 MoodFeed 之后、SloganBanner 之前
          （同日早些时候"挪到标题下 Cushions 卡上"的改动已撤销） */}
      <V2BrandBanner />
      <V2SloganBanner />
      {/* 页尾转化兜底：按浏览历史推荐（无历史时回退 Best Sellers） */}
      <V2Recommended fallback={recommended.fallback} candidates={recommended.candidates} />
    </>
  );
}
