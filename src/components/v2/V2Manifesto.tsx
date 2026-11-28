import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/**
 * V2Manifesto —— Drop 模式首页副本的品牌品质叙事位（2026-11-27，/drop-home 试验页专用）。
 * 潮牌 Lookbook 式编辑位：质感画面 + 信条，链 fabric-guide 落地品质证据。
 * 2026-11-28 用户定：背景由 trust-texture 静态图换成原 BrandBanner 的品牌意境视频
 * （brand-banner.mp4 / -mobile.mp4，自动播放/静音/循环，poster 用视频首帧）；
 * 文案大幅精简（只留 eyebrow + 一行信条 + 链接，去掉 "Designed in-house" 与整句描述）。
 */
export default function V2Manifesto() {
  const videoProps = {
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    preload: 'metadata' as const,
    poster: resolveUrl('/images/brand/brand-banner-poster.webp'),
    className: 'absolute inset-0 w-full h-full object-cover object-center',
  };

  return (
    <section className="pt-6 lg:pt-10 pb-11 lg:pb-16">
      {/* 视频高度沿用原 Inspiration（BrandBanner）区比例（2026-11-28 用户定）：
          移动 4/3.97，桌面 1456/560 且 max-h-93vh */}
      <div className="group relative block w-full overflow-hidden aspect-[4/3.97] sm:aspect-[1456/560] sm:max-h-[93vh]">
        {/* 桌面端视频 / 移动端视频（与 BrandBanner 同源两路，按断点切换） */}
        <video {...videoProps} className={`${videoProps.className} hidden sm:block`}>
          <source src={resolveUrl('/videos/brand-banner.mp4')} type="video/mp4" />
        </video>
        <video {...videoProps} className={`${videoProps.className} sm:hidden`}>
          <source src={resolveUrl('/videos/brand-banner-mobile.mp4')} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/20 to-transparent" />
        <div className="absolute bottom-5 left-4 right-4 lg:bottom-10 lg:left-10 lg:right-auto lg:max-w-2xl">
          <p className="text-[10px] lg:text-xs font-semibold tracking-[0.3em] uppercase text-cream/80 mb-2 lg:mb-3">
            Our Craft
          </p>
          {/* 2026-11-28 用户定：文案凸显高品质布料 + 精细做工；链接文字改 Discover More */}
          <p className="text-cream text-xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Premium fabrics. Finely crafted.
          </p>
          <a
            href={v2url('/fabric-guide/')}
            className="mt-3 lg:mt-5 inline-block text-[11px] lg:text-sm font-semibold text-cream border-b border-cream/50 pb-0.5 hover:border-cream transition-colors"
          >
            Discover More →
          </a>
        </div>
      </div>
    </section>
  );
}
