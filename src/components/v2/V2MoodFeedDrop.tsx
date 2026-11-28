import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import V2CarouselRow from '@/components/v2/V2CarouselRow';

/**
 * V2MoodFeedDrop —— /drop-home 试验页专用的类目卡区（2026-11-28 用户定）。
 * 由 V2MoodFeed 派生，但布局完全不同，且要保护现主页（V2MoodFeed 仍服务线上首页），
 * 所以独立成组件，不改 V2MoodFeed：
 *  - "Soft Essentials" 与 "Find Your Comfort" 两组合并为一个区域、一个标题；
 *  - 去除 Decor 卡；新增 Bedding 卡排第一位（图沿用 collections/cat-social-bedding.webp）；
 *  - 卡片改圆角（rounded-lg），一行可滑动；最小尺寸恒定（lg:min-w-[260px]），
 *    低于阈值不再压缩、横向滑动，宽屏 flex-1 随比例增大。
 */

const CARDS = [
  { image: '/images/collections/cat-social-bedding.webp', caption: 'Bedding', desc: 'Sheets, duvets & full sets', href: '/products/?cat=bedding', alt: 'Soft bedding set styled on a bed in warm light' },
  { image: '/images/mood/mood-living.webp', caption: 'Blankets', desc: 'Soft layers for slow afternoons', href: '/products/?cat=blankets', alt: 'Cozy living room sofa with cream faux-fur throw blanket in afternoon light' },
  { image: '/images/collections/cat-social-pillows.webp', caption: 'Pillows', desc: 'Bed, decorative & neck pillows', href: '/products/?cat=pillows', alt: 'Soft cream pillows styled on a bed in warm light' },
  { image: '/images/mood/mood-mats.webp', caption: 'Mats', desc: 'A warm welcome underfoot', href: '/products/?cat=mats', alt: 'Warm entryway with woven mat and slippers in morning light' },
  { image: '/images/mood/mood-towels.webp', caption: 'Towels', desc: 'Spa-soft, every single day', href: '/products/?cat=towels', alt: 'Bright bathroom spa corner with stacked cream cotton towels' },
  { image: '/images/collections/cat-social-cushions.webp', caption: 'Cushions', desc: 'For chairs, sofas & seats', href: '/products/?cat=cushions', alt: 'Cream cushions on a chair in warm home setting' },
];

export default function V2MoodFeedDrop() {
  return (
    <section className="mt-6 lg:mt-10 pb-11 lg:pb-16">
      <h2 className="px-6 lg:px-10 pt-6 pb-4 lg:pt-8 lg:pb-6 text-2xl lg:text-[32px] font-extrabold tracking-tight text-charcoal">
        Soft Essentials
      </h2>
      {/* 一行可滑动：移动端 64vw 横滑卡（max-w-[320px] 封顶，避免 640–1023px 窗口算出超大卡）；
          桌面 min-w-[400px] 恒定不压缩（溢出横滑），宽屏 flex-1 撑满；
          用 V2CarouselRow 包一层 → 桌面端内容溢出时显示左右箭头（与 Drop 01 / Next Drops 同组件）；
          px-6 lg:px-10 + scroll-px 与 Drop 01 区完全对齐（2026-11-28 用户定） */}
      <V2CarouselRow className="flex gap-3 lg:gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-6 lg:scroll-px-10 px-6 lg:px-10 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {CARDS.map((c) => (
          <a
            key={c.caption}
            href={v2url(c.href)}
            className="group relative block w-[64vw] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-lg aspect-square lg:w-auto lg:max-w-none lg:flex-1 lg:min-w-[400px]"
          >
            <img
              src={resolveUrl(c.image)}
              alt={c.alt}
              loading="lazy"
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 lg:bottom-5 lg:left-6">
              <p className="text-cream text-xs lg:text-sm font-semibold tracking-[0.2em] uppercase flex items-center gap-1.5">
                {c.caption}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="w-3.5 h-3.5 lg:w-4 lg:h-4 stroke-cream/80 transition-all duration-300 group-hover:stroke-cream group-hover:translate-x-0.5"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </p>
              <p className="mt-0.5 text-cream/80 text-[11px] lg:text-xs tracking-wide">
                {c.desc}
              </p>
            </div>
          </a>
        ))}
      </V2CarouselRow>
    </section>
  );
}
