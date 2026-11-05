import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/**
 * V2InspirationTeaser —— 首页 Inspiration 引流模块（2026-10-30）。
 * 三张种草图横排 + "Get Inspired" CTA → /inspiration/（灵感中心）。
 * 位置：SloganBanner 之后、Recommended 之前（页尾转化前的内容缓冲带）。
 * 移动端：1 张横图 + 2 张半宽，整区打满屏幕宽度（2026-11-02 用户定）；桌面端：3 张 3:4 等宽，整区占屏宽 88%。
 * 2026-11-02 用户定：每张卡跳转到对应房间筛选的种草图汇总页（/scenes/?room=xxx），不再统一跳 /inspiration/。
 */

const TEASER_IMAGES = [
  {
    image: '/images/inspiration/scene-5-after.webp',
    alt: 'Fireplace living room styled with a vintage Persian rug and orange throw',
    label: 'Living Room',
    href: '/scenes/?room=living-room',
  },
  {
    image: '/images/pdp-lifestyle/bedding-linen-farmhouse.webp',
    alt: 'Farmhouse bedroom with washed linen bedding in soft light',
    label: 'Bedroom',
    href: '/scenes/?room=bedroom',
  },
  {
    image: '/images/inspiration/scene-7-after.webp',
    alt: 'Dining nook styled with a Persian rug and a soft throw on the chair',
    label: 'Dining Nook',
    href: '/scenes/?room=dining',
  },
];

export default function V2InspirationTeaser() {
  return (
    // 2026-11-02 用户定：移动端整区打满屏幕宽度（px-0，标题行保留 px-4）；
    // 桌面端整区占屏宽 80% → 88%；上下空隙收窄（py-12/lg:py-16 → py-8/lg:py-12）
    <section className="mx-auto max-w-[1520px] px-0 py-8 lg:w-[88%] lg:max-w-none lg:px-10 lg:py-12">
      <div className="flex items-end justify-between gap-4 px-4 lg:px-0">
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

      {/* 2026-11-02 用户定：移动端卡片间隙收窄到 4px（全出血视觉），桌面端保持 gap-5 */}
      <div className="mt-6 grid grid-cols-2 gap-1 lg:grid-cols-3 lg:gap-5">
        {TEASER_IMAGES.map((t, idx) => (
          <a
            key={t.image}
            href={v2url(t.href)}
            className={`group relative block overflow-hidden rounded-none lg:rounded-lg bg-cream ${
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
