import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/**
 * V2MoodFeed —— ins 版首页 "Find Your Comfort" 种草图流（2026-10-08 测试副本）。
 * 2026-10-08 用户定改版：原种草图流与类目卡两个板块合并为一个统一板块——
 * 共用 "Find Your Comfort" 标题，7 张卡统一卡片样式（小 caps 类名 + 一行描述）：
 * 沙发毯图改 Blankets、Pillows 上移到图流第二格、Towels 下沉到第二行、阅读角卡删除
 * （图 mood-nook.webp 已备份到用户桌面备用）。
 * 布局：移动端单列全出血方卡连排；桌面端首张 Blankets 通栏宽幅（21:9 裁切）+ 3列×2行方卡。
 * 氛围图由 scripts/seeany-mood-feed.js 按全站种草图风格约定生成。
 */

const CARDS = [
  { image: '/images/mood/mood-living.webp', caption: 'Blankets', desc: 'Soft layers for slow afternoons', href: '/products/?cat=blankets', alt: 'Cozy living room sofa with cream faux-fur throw blanket in afternoon light' },
  { image: '/images/collections/cat-social-pillows.webp', caption: 'Pillows', desc: 'Bed, decorative & neck pillows', href: '/products/?cat=pillows', alt: 'Soft cream pillows styled on a bed in warm light' },
  { image: '/images/mood/mood-mats.webp', caption: 'Mats', desc: 'A warm welcome underfoot', href: '/products/?cat=mats', alt: 'Warm entryway with woven mat and slippers in morning light' },
  { image: '/images/mood/mood-dining.webp', caption: 'Dining', desc: 'Rattan trays & morning rituals', href: '/products/?cat=dining', alt: 'Morning dining table with rattan tray and ceramics' },
  { image: '/images/mood/mood-towels.webp', caption: 'Towels', desc: 'Spa-soft, every single day', href: '/products/?cat=towels', alt: 'Bright bathroom spa corner with stacked cream cotton towels' },
  { image: '/images/collections/cat-social-cushions.webp', caption: 'Cushions', desc: 'For chairs, sofas & seats', href: '/products/?cat=cushions', alt: 'Cream cushions on a chair in warm home setting' },
  { image: '/images/collections/cat-social-decor.webp', caption: 'Decor', desc: 'Wall art & warm accents', href: '/products/?cat=decor', alt: 'Warm wall art and home accents in beige tones' },
];

function MoodCard({
  card,
  className = '',
}: {
  card: (typeof CARDS)[number];
  className?: string;
}) {
  return (
    <a
      href={v2url(card.href)}
      className={`group relative block overflow-hidden ${className}`}
    >
      <img
        src={resolveUrl(card.image)}
        alt={card.alt}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {/* 卡面文字统一两行：小 caps 类名 + 一行描述；底部浅渐变保证可读 */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-4 lg:bottom-5 lg:left-6">
        <p className="text-cream text-xs lg:text-sm font-semibold tracking-[0.2em] uppercase">
          {card.caption}
        </p>
        <p className="mt-0.5 text-cream/80 text-[11px] lg:text-xs tracking-wide">
          {card.desc}
        </p>
      </div>
    </a>
  );
}

export default function InsMoodFeed() {
  const [first, ...rest] = CARDS;
  const upper = rest.slice(0, 4); // Pillows / Mats / Dining / Towels
  const lower = rest.slice(4);    // Cushions / Decor
  return (
    <section className="mt-6 lg:mt-10 pb-10 lg:pb-12">
      {/* 桌面端：首张 Blankets 通栏宽幅 + 2列×3行方卡（2026-10-08 用户定，原 3列×2行）；
          "Find Your Comfort" 标题移到倒数第二行上方（顶部标题移除，2026-10-08 用户定）。
          移动端：单列全出血方卡连排，标题同样在 Cushions 卡上方 */}
      <div className="lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-5">
        <MoodCard card={first} className="aspect-square lg:aspect-[21/9] lg:col-span-2" />
        {upper.map((c) => (
          <MoodCard key={c.caption} card={c} className="aspect-square" />
        ))}
        <h2 className="px-3 lg:px-0 pt-8 pb-4 lg:pt-12 lg:pb-6 lg:col-span-2 text-2xl lg:text-5xl font-extrabold tracking-tight text-charcoal">
          Find Your Comfort
        </h2>
        {lower.map((c) => (
          <MoodCard key={c.caption} card={c} className="aspect-square" />
        ))}
      </div>
    </section>
  );
}
