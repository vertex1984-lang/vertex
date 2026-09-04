import Reveal from '@/components/Reveal';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/**
 * V2 首页全宽 Brand Banner
 * 桌面：brand-banner.webp（1456×574 生活场景图）按 1456/380（约 3.8:1）锁定比例全宽展示，
 *        object-cover 从上下裁切（object-position 保持 center，沙发主体完整露出）；
 *        极宽屏高度超 85vh 时进一步从上下裁切；
 * 移动：brand-banner-mobile.webp（900×1200，正好 3:4）aspect-[3/4] 无裁切。
 * 促销文案叠加在左下角（小占比，参考 Parachute）：标题 + 副文案 + 描边小按钮。
 * 整图可点击跳转全部产品。两张图均带 ken-burns 缓慢缩放动画（与 hero 同款 12s keyframes）；
 * CSS animation 会覆盖 transform，故不使用 hover 缩放。
 */
export default function V2BrandBanner() {
  return (
    <section className="w-full">
      <Reveal>
        {/* 桌面端：锁定 1456/380（约 3.8:1）比例全宽展示，极宽屏超 85vh 时从上下进一步裁切 */}
        <a
          href={v2url('/products/')}
          className="group relative hidden sm:block w-full aspect-[1456/380] max-h-[85vh] overflow-hidden"
        >
          <img
            src={resolveUrl('/images/brand/brand-banner.webp')}
            alt="Makimoo — comfort essentials for every home"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
          />
          {/* 左下角促销文案（小占比，参考竞品样式） */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute left-0 bottom-0 p-8 lg:p-12 max-w-md">
            <h3 className="text-2xl lg:text-3xl font-medium text-cream tracking-tight mb-2 drop-shadow-md">
              Instant comfort shift.
            </h3>
            <p className="text-xs lg:text-sm text-cream/85 mb-4">
              New textures, new feeling.
            </p>
            <span className="inline-block px-5 py-2.5 border border-cream/80 text-cream text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors group-hover:bg-cream group-hover:text-brand">
              Discover More
            </span>
          </div>
        </a>

        {/* 移动端：竖版 3:4（与原图比例一致，无裁切），文案同样在左下角 */}
        <a
          href={v2url('/products/')}
          className="group relative block sm:hidden w-full aspect-[3/4] overflow-hidden"
        >
          <img
            src={resolveUrl('/images/brand/brand-banner-mobile.webp')}
            alt="Makimoo — comfort essentials for every home"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute left-0 bottom-0 p-6 max-w-xs">
            <h3 className="text-xl font-medium text-cream tracking-tight mb-1.5 drop-shadow-md">
              Instant comfort shift.
            </h3>
            <p className="text-xs text-cream/85 mb-3.5">
              New textures, new feeling.
            </p>
            <span className="inline-block px-4 py-2 border border-cream/80 text-cream text-[10px] font-semibold tracking-[0.2em] uppercase transition-colors group-hover:bg-cream group-hover:text-brand">
              Discover More
            </span>
          </div>
        </a>
      </Reveal>
    </section>
  );
}
