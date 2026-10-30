import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/**
 * V2InspirationTeaser —— 首页 Inspiration 引流模块（2026-10-30）。
 * 三张种草图横排 + "Get Inspired" CTA → /inspiration/（灵感中心）。
 * 位置：SloganBanner 之后、Recommended 之前（页尾转化前的内容缓冲带）。
 * 移动端：1 张横图 + 2 张半宽；桌面端：3 张 3:4 等宽。
 */

const TEASER_IMAGES = [
  {
    image: '/images/inspiration/scene-5-after.webp',
    alt: 'Fireplace living room styled with a vintage Persian rug and orange throw',
    label: 'Living Room',
  },
  {
    image: '/images/pdp-lifestyle/bedding-linen-farmhouse.webp',
    alt: 'Farmhouse bedroom with washed linen bedding in soft light',
    label: 'Bedroom',
  },
  {
    image: '/images/inspiration/scene-7-after.webp',
    alt: 'Dining nook styled with a Persian rug and a soft throw on the chair',
    label: 'Dining Nook',
  },
];

export default function V2InspirationTeaser() {
  return (
    <section className="mx-auto max-w-[1520px] px-6 py-12 lg:w-[80%] lg:max-w-none lg:px-10 lg:py-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand">
            Inspiration
          </p>
          <h2 className="mt-2 text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal">
            Rooms we love
          </h2>
        </div>
        <a
          href={v2url('/inspiration/')}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand"
        >
          <span className="border-b border-brand/40 pb-0.5 transition-colors group-hover:border-brand">
            Get Inspired
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5">
        {TEASER_IMAGES.map((t, idx) => (
          <a
            key={t.image}
            href={v2url('/inspiration/')}
            className={`group relative block overflow-hidden rounded-lg bg-cream ${
              // 移动端：首图通栏（col-span-2），后两张半宽；桌面端三等宽
              idx === 0 ? 'col-span-2 aspect-[16/9] lg:col-span-1 lg:aspect-[3/4]' : 'aspect-[3/4]'
            }`}
          >
            <img
              src={resolveUrl(t.image)}
              alt={t.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-4 text-cream text-xs font-semibold tracking-[0.2em] uppercase">
              {t.label}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
