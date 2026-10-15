import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/**
 * V2 首页全宽 Brand Banner（品牌意境视频 brand-banner.mp4，自动播放/静音/循环）
 * 桌面：按 1456/560（约 2.6:1，2026-10-08 用户定加高，原 1456/459.8）锁定比例全宽展示，object-cover 从上下裁切（object-position 保持 center）；
 *       极宽屏高度超 93vh 时进一步从上下裁切。
 * 移动：同一路视频按 4/3.97 展示（接近方形，不压扁成细条），object-cover 居中裁切两侧。
 * poster 用视频首帧（brand-banner-poster.webp），视频加载前立即有画面；
 * preload="metadata" 避免阻塞首屏，muted+playsInline 保证 iOS/安卓可自动播放。
 * 2026-10-14 用户定：横幅改为 /scenes/ 场景页入口（原 Fabric Guide 入口下线），
 * 文案改 "Shop the Look, / Everything You See." + Explore Scenes 按钮，整图可点。
 */
export default function V2BrandBanner() {
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
    <section className="w-full">
      <div>
        {/* 桌面端：1456/560 宽横幅 */}
        <a
          href={v2url('/scenes/')}
          className="group relative hidden sm:block w-full aspect-[1456/560] max-h-[93vh] overflow-hidden"
        >
          <video {...videoProps}>
            <source src={resolveUrl('/videos/brand-banner.mp4')} type="video/mp4" />
          </video>
          {/* 左下角促销文案（小占比，参考竞品样式；2026-10-08 ins 版恢复） */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute left-0 bottom-0 p-11 lg:p-16 max-w-xl">
            <h3 className="text-2xl sm:text-[33px] lg:text-[40px] font-extrabold text-cream tracking-tight leading-tight mb-3">
              Shop the Look,
            </h3>
            <p className="text-sm sm:text-[17px] lg:text-[20px] text-cream/85 mb-7">
              Everything You See.
            </p>
            <span className="inline-block px-9 py-4 rounded-full bg-transparent border-2 border-cream text-cream text-xs sm:text-[15px] lg:text-[17px] font-semibold tracking-wide transition-all duration-300 group-hover:bg-cream group-hover:text-brand">
              Explore Scenes
            </span>
          </div>
        </a>

        {/* 移动端：同一路视频，4/3.97 比例（较 4/3 高 30%），object-cover 居中裁切两侧 */}
        <a
          href={v2url('/scenes/')}
          className="group relative block sm:hidden w-full aspect-[4/3.97] overflow-hidden"
        >
          <video {...videoProps}>
            <source src={resolveUrl('/videos/brand-banner-mobile.mp4')} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute left-0 bottom-0 p-7 max-w-xs">
            <h3 className="text-[23px] font-extrabold text-cream tracking-tight leading-tight mb-2">
              Shop the Look,
            </h3>
            <p className="text-base text-cream/85 mb-5">
              Everything You See.
            </p>
            <span className="inline-block px-7 py-3 rounded-full bg-transparent border-2 border-cream text-cream text-sm font-semibold tracking-wide transition-all duration-300 group-hover:bg-cream group-hover:text-brand">
              Explore Scenes
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
