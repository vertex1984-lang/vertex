import Reveal from '@/components/Reveal';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

// V2 分类网格：沿用现有 cat 查询参数（与 (classic) 产品页一致）
const CATEGORIES = [
  { name: 'Cushions', image: '/images/collections/cushions.webp', href: '/products/?cat=cushions' },
  { name: 'Pillows', image: '/images/collections/pillows.webp', href: '/products/?cat=pillows' },
  { name: 'Towels', image: '/images/collections/towels.webp', href: '/products/?cat=towels' },
  { name: 'Mats', image: '/images/collections/mats.webp', href: '/products/?cat=mats' },
  { name: 'Holiday', image: '/images/collections/holiday.webp', href: '/products/?cat=holiday' },
  { name: 'Others', image: '/images/collections/others.webp', href: '/products/?cat=others' },
];

export default function V2CategoryGrid() {
  return (
    <section className="pt-16 lg:pt-24">
      {/* 标题区限宽居中；图片网格全宽 bleed */}
      <Reveal>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center mb-10 lg:mb-14">
          <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-3">
            Shop by Category
          </p>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-charcoal mb-4">
            Find Your Comfort
          </h2>
          <p className="text-base text-charcoal-light max-w-xl mx-auto">
            Six curated collections, one goal — a warmer, softer home.
          </p>
        </div>
      </Reveal>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 px-2 lg:px-3">
        {CATEGORIES.map((cat, i) => (
          <Reveal key={cat.name} delay={i * 70} className="h-full">
            <a
              href={v2url(cat.href)}
              className="group relative block aspect-[4/5] overflow-hidden rounded-lg"
            >
              <img
                src={resolveUrl(cat.image)}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* 底部渐变遮罩 + 分类名 */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7">
                <h3 className="text-xl lg:text-2xl font-bold text-cream tracking-wide">{cat.name}</h3>
                <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase text-cream/70 transition-colors group-hover:text-cream">
                  Shop Now
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
