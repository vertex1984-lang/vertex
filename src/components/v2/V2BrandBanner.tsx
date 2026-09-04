import Reveal from '@/components/Reveal';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/**
 * V2 首页全宽 Brand Banner（桌面 / 移动端同一张图 brand-banner.webp，1456×574）
 * 桌面：按 1456/418（约 3.5:1）锁定比例全宽展示，
 *       object-cover 从上下裁切（object-position 保持 center，沙发主体完整露出）；
 *       极宽屏高度超 93vh 时进一步从上下裁切。
 * 移动：同一张图按 4/3.97 展示（接近方形，不压扁成细条），object-cover 居中裁切两侧。
 * 促销文案叠加在左下角（小占比，参考 Parachute）：标题 + 副文案 + 胶囊按钮（与 hero 同款）。
 * 整图可点击跳转全部产品，带 ken-burns 缓慢缩放动画（与 hero 同款 12s keyframes）；
 * CSS animation 会覆盖 transform，故不使用 hover 缩放。
 */
export default function V2BrandBanner() {
  return (
    <section className="w-full">
      <Reveal>
        {/* 桌面端：1456/418 宽横幅 */}
        <a
          href={v2url('/products/')}
          className="group relative hidden sm:block w-full aspect-[1456/418] max-h-[93vh] overflow-hidden"
        >
          <img
            src={resolveUrl('/images/brand/brand-banner.webp')}
            alt="Makimoo — comfort essentials for every home"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
          />
          {/* 左下角促销文案（小占比，参考竞品样式） */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute left-0 bottom-0 p-11 lg:p-16 max-w-xl">
            <h3 className="text-[33px] lg:text-[40px] font-extrabold text-cream tracking-tight leading-tight mb-3">
              Instant comfort shift.
            </h3>
            <p className="text-[17px] lg:text-[20px] text-cream/85 mb-7">
              New textures, new feeling.
            </p>
            <span className="inline-block px-9 py-4 rounded-full bg-cream text-brand text-[15px] lg:text-[17px] font-semibold tracking-wide transition-all duration-300 group-hover:bg-brand group-hover:text-cream">
              Discover More
            </span>
          </div>
        </a>

        {/* 移动端：同一张桌面图，4/3.97 比例（较 4/3 高 30%），object-cover 居中裁切两侧 */}
        <a
          href={v2url('/products/')}
          className="group relative block sm:hidden w-full aspect-[4/3.97] overflow-hidden"
        >
          <img
            src={resolveUrl('/images/brand/brand-banner.webp')}
            alt="Makimoo — comfort essentials for every home"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute left-0 bottom-0 p-7 max-w-xs">
            <h3 className="text-[23px] font-extrabold text-cream tracking-tight leading-tight mb-2">
              Instant comfort shift.
            </h3>
            <p className="text-base text-cream/85 mb-5">
              New textures, new feeling.
            </p>
            <span className="inline-block px-7 py-3 rounded-full bg-cream text-brand text-sm font-semibold tracking-wide transition-all duration-300 group-hover:bg-brand group-hover:text-cream">
              Discover More
            </span>
          </div>
        </a>
      </Reveal>
    </section>
  );
}
