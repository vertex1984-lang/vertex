import { resolveUrl } from '@/lib/paths';
import { PREORDER_SALE_DEADLINE_LABEL } from '@/data/preorder';

/**
 * V2HeroDrop —— Drop 模式首页副本的 Hero（2026-11-27，/drop-home 试验页专用）。
 * 视觉沿用 V2Hero 的雾气大图与排版骨架，只改文案层：
 * Drop 编号 eyebrow + 系列主标 + 模式副标 + 双 CTA（Shop the Drop / How it works）
 * + 右上预售截止徽章。参考：潮牌 Drop 站首屏（编号/稀缺感）+ Kickstarter 截止倒计时。
 */
export default function V2HeroDrop() {
  const heroImage = {
    // 2026-11-27 v2 用户定：Drop 拼版图（首发四款场景合成，scripts/_gen-hero-drop.js 产出）
    desktop: '/images/brand/hero-drop-desktop.webp',
    mobile: '/images/brand/hero-drop-mobile.webp',
    alt: 'Makimoo Drop 01 first collection: four in-house designed bedding sets',
  };
  return (
    // 移动端压低版 hero（2026-11-27 v2 用户定：626/920≈0.68，首屏容纳 hero + 规则区）；
    // 桌面端维持 lg:h-[87vh]
    <section className="relative aspect-[626/920] lg:aspect-auto lg:h-[87vh] lg:min-h-[560px] overflow-hidden bg-[#cfc0a8]">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center lg:hidden"
          style={{ backgroundImage: `url(${resolveUrl(heroImage.mobile)})` }}
          role="img"
          aria-label={heroImage.alt}
        />
        <div
          className="absolute inset-0 hidden bg-cover bg-center lg:block"
          style={{ backgroundImage: `url(${resolveUrl(heroImage.desktop)})` }}
          aria-hidden="true"
        />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-28 lg:h-32 bg-gradient-to-b from-black/45 to-transparent pointer-events-none" />
      </div>

      {/* 预售截止徽章（Kickstarter 倒计时语言；静态文案，正式版接 deadline 倒计时） */}
      <div className="absolute right-4 top-14 lg:right-10 lg:top-28 z-10 rounded-full bg-charcoal/60 backdrop-blur-sm px-3.5 py-1.5 text-[10px] lg:text-xs font-semibold tracking-wide text-cream">
        Pre-order ends {PREORDER_SALE_DEADLINE_LABEL} · 30% off
      </div>

      <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 flex flex-col justify-end pb-[16%] -translate-y-[7%] lg:max-w-none lg:px-[7vw] lg:-translate-y-[calc(70px+7%)] lg:justify-end lg:pb-[8vh]">
        <p className="text-[11px] lg:text-sm font-bold tracking-[0.3em] uppercase text-cream/85 mb-2 lg:mb-3 animate-fade-in-up">
          Drop 01 · Now Live
        </p>
        <h1 className="text-[32px] lg:text-[50px] lg:leading-[1.05] font-extrabold tracking-tight leading-[1.05] text-cream max-w-3xl mb-2 lg:mb-3 animate-fade-in-up">
          The First Collection
        </h1>
        <p className="text-sm lg:text-lg text-cream/90 max-w-xl mb-[18px] lg:mb-7 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          In-house designs. Finely crafted. 30% off at launch.
        </p>
        <div className="flex flex-wrap items-center gap-3 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          {/* 主 CTA：实心，锚到本页 Drop 01 预售区 */}
          <a
            href="#drop-01"
            className="inline-block px-6 py-2.5 lg:px-7 lg:py-3 rounded-full bg-cream text-brand text-xs lg:text-sm font-semibold tracking-wide transition-all duration-300 hover:shadow-xl hover:bg-white"
          >
            Shop the Drop
          </a>
          {/* 次 CTA：描边，锚到 How it works 说明带 */}
          <a
            href="#how-it-works"
            className="inline-block px-6 py-2.5 lg:px-7 lg:py-3 rounded-full bg-transparent border-2 border-cream text-cream text-xs lg:text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-cream hover:text-brand hover:shadow-xl"
          >
            How it works
          </a>
        </div>
      </div>
    </section>
  );
}
