import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/** 热门入口（2026-10-20 用户定：减少死链流失） */
const POPULAR = [
  {
    label: 'Shop by Category',
    href: '/categories/',
    image: '/images/collections/bedding.webp',
    caption: 'Browse every corner of comfort.',
  },
  {
    label: 'Best Sellers',
    href: '/best-sellers/',
    image: '/images/collections/cushions.webp',
    caption: 'Our most loved pieces.',
  },
  {
    label: 'New Arrivals',
    href: '/new-arrivals/',
    image: '/images/collections/blanket.webp',
    caption: 'Just landed.',
  },
];

/**
 * 404 内容（2026-10-20 改版）：(v2)/not-found.tsx 与根 not-found.tsx 共用。
 * 根 not-found 不走 (v2) 布局（全局死链兜底），由它自己手动套 V2Header/V2Footer。
 * 热门入口 = 图片大卡（mega menu 图卡同款：图 + 大写小标题 + 下划线跳转链接；
 * 2026-10-20 A/B 对比后用户选定 B，文字 pill 版已删）
 */
export default function V2NotFound() {
  return (
    <div className="px-6 lg:px-10 py-16 lg:py-24 text-center">
      <p className="text-sm font-semibold tracking-widest uppercase text-brand mb-3">404</p>
      <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-charcoal mb-4">Page Not Found</h1>
      <p className="text-base text-charcoal-light max-w-md mx-auto mb-8">
        Looks like this page wandered off. Let&apos;s get you back to comfort.
      </p>
      <a
        href={resolveUrl('/')}
        className="inline-block px-7 py-3 rounded-full text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
        style={{ backgroundColor: '#8B5A2B' }}
      >
        Back to Home
      </a>

      {/* 热门入口：图片大卡（mega menu 图卡同款：图 + 大写小标题 + 下划线跳转链接） */}
      <div className="mt-14 lg:mt-16">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#999] mb-4">
          Popular Destinations
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-3xl mx-auto text-left">
          {POPULAR.map((p) => (
            <a key={p.href} href={v2url(p.href)} className="group block">
              <div className="aspect-[4/5] overflow-hidden bg-warm-gray">
                <img
                  src={resolveUrl(p.image)}
                  alt={p.caption}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-charcoal">
                {p.label}
              </p>
              <p className="mt-1 text-xs text-[#999]">{p.caption}</p>
              <span className="mt-1.5 inline-block text-xs font-medium text-charcoal underline underline-offset-4 transition-colors group-hover:text-brand">
                Shop now
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
