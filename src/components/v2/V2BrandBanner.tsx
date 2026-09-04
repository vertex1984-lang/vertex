import Reveal from '@/components/Reveal';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/**
 * V2 首页全宽 Brand Banner（桌面 / 移动端同一张图、同一高度比例）
 * brand-banner.webp（1456×574 生活场景图）按 1456/320（约 4.55:1，参考 Parachute 横幅比例）锁定比例全宽展示，
 * object-cover 从上下裁切（object-position 保持 center，沙发主体完整露出）；
 * 极宽屏高度超 70vh 时进一步从上下裁切。移动端同比例，仅文案字号/间距缩小。
 * 促销文案叠加在左下角（小占比，参考 Parachute）：标题 + 副文案 + 胶囊按钮（与 hero 同款）。
 * 整图可点击跳转全部产品，带 ken-burns 缓慢缩放动画（与 hero 同款 12s keyframes）；
 * CSS animation 会覆盖 transform，故不使用 hover 缩放。
 */
export default function V2BrandBanner() {
  return (
    <section className="w-full">
      <Reveal>
        <a
          href={v2url('/products/')}
          className="group relative block w-full aspect-[1456/320] max-h-[70vh] overflow-hidden"
        >
          <img
            src={resolveUrl('/images/brand/brand-banner.webp')}
            alt="Makimoo — comfort essentials for every home"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
          />
          {/* 左下角促销文案（小占比，参考竞品样式）；移动端整体缩小以适配同比例高度 */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute left-0 bottom-0 p-4 sm:p-8 lg:p-12 max-w-md">
            <h3 className="text-base sm:text-2xl lg:text-3xl font-extrabold text-cream tracking-tight leading-tight mb-1 sm:mb-2">
              Instant comfort shift.
            </h3>
            <p className="text-[11px] sm:text-sm lg:text-base text-cream/85 mb-2 sm:mb-5">
              New textures, new feeling.
            </p>
            <span className="inline-block px-4 py-1.5 sm:px-7 sm:py-3 rounded-full bg-cream text-brand text-[10px] sm:text-sm font-semibold tracking-wide transition-all duration-300 group-hover:bg-brand group-hover:text-cream">
              Discover More
            </span>
          </div>
        </a>
      </Reveal>
    </section>
  );
}
