import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/**
 * V2MoodFeed —— ins 版首页 "Find Your Comfort" 种草图流（2026-10-08 测试副本）。
 * 2026-10-08 用户定改版：原种草图流与类目卡两个板块合并为一个统一板块——
 * 共用 "Find Your Comfort" 标题，卡片统一样式（小 caps 类名 + 一行描述）。
 * 2026-10-21 用户定：Dining 卡随类目全站下线移除（图 mood-dining.webp 保留在 images/mood/ 备用）；
 * Blankets 卡不再通栏宽幅，6 张卡全部为方卡自然排列。
 * 布局：移动端单列全出血方卡连排；桌面端 2列×2行方卡 + "Find Your Comfort" 标题 + 末行 2 张方卡。
 * 氛围图由 scripts/seeany-mood-feed.js 按全站种草图风格约定生成。
 */

const CARDS = [
  { image: '/images/mood/mood-living.webp', caption: 'Blankets', desc: 'Soft layers for slow afternoons', href: '/products/?cat=blankets', alt: 'Cozy living room sofa with cream faux-fur throw blanket in afternoon light' },
  { image: '/images/collections/cat-social-pillows.webp', caption: 'Pillows', desc: 'Bed, decorative & neck pillows', href: '/products/?cat=pillows', alt: 'Soft cream pillows styled on a bed in warm light' },
  { image: '/images/mood/mood-mats.webp', caption: 'Mats', desc: 'A warm welcome underfoot', href: '/products/?cat=mats', alt: 'Warm entryway with woven mat and slippers in morning light' },
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
        <p className="text-cream text-xs lg:text-sm font-semibold tracking-[0.2em] uppercase flex items-center gap-1.5">
          {card.caption}
          {/* 可点击标识：类名右侧极简 chevron（2026-10-29 用户定：只要箭头不要横线，
              跟随文字而不是角落悬浮）；hover 全白 + 右移一点 */}
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
          {card.desc}
        </p>
      </div>
    </a>
  );
}

export default function V2MoodFeed() {
  const upper = CARDS.slice(0, 4); // Blankets / Pillows / Mats / Towels
  const lower = CARDS.slice(4);    // Cushions / Decor
  return (
    // 上边距收窄（2026-10-26 用户定：缩小与信任条之间的空隙，原 mt-6 lg:mt-10）
    <section className="mt-3 lg:mt-5 pb-10 lg:pb-12">
      {/* 桌面端：2列×2行方卡 + "Find Your Comfort" 标题 + 末行 2 张方卡（2026-10-21 用户定：
          Blankets 不再通栏，6 卡全部方卡自然排列；标题保持在倒数第二行上方）。
          移动端：单列全出血方卡连排，标题同样在 Cushions 卡上方 */}
      <div className="lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-5">
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
