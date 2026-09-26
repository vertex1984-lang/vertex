import Reveal from '@/components/Reveal';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

// V2 分类区（2026-09 用户定：全端 Bento 平铺，替代原桌面横滑条）：
// Bedding 通栏/2×2 大卡 + 2列×3行（桌面 3列×2行）小卡，小卡只留类名，Others 不展示。
// 排列顺序与顶部导航一致（2026-09 用户定）；2026-09 用户定：Holiday 换 Decor（图 1688-730512046265-C15/1.webp）
const CATEGORIES = [
  { name: 'Bedding', image: '/images/collections/bedding.webp', href: '/products/?cat=bedding' },
  { name: 'Pillows', image: '/images/collections/pillows.webp', href: '/products/?cat=pillows' },
  { name: 'Cushions', image: '/images/collections/cushions.webp', href: '/products/?cat=cushions' },
  { name: 'Towels', image: '/images/collections/towels.webp', href: '/products/?cat=towels' },
  { name: 'Mats', image: '/images/collections/mats.webp', href: '/products/?cat=mats' },
  { name: 'Blankets', image: '/images/products/1688-969627065032-C37/4.webp', href: '/products/?cat=blankets' },
  { name: 'Decor', image: '/images/products/1688-730512046265-C15/1.webp', href: '/products/?cat=decor' },
  { name: 'Others', image: '/images/collections/others.webp', href: '/products/?cat=others' },
];

// Bento 展示 7 张：首张大卡 + 后 6 张小卡，Others 不上（2026-09 用户定）
const BENTO_COUNT = 7;

/** 类目卡：图上渐变 + 左下类名；大卡多一行 Shop Now */
function CategoryCard({
  cat,
  big = false,
  className = '',
}: {
  cat: (typeof CATEGORIES)[number];
  big?: boolean;
  className?: string;
}) {
  return (
    <a
      href={v2url(cat.href)}
      className={`group relative block overflow-hidden rounded-lg ${className}`}
    >
      <img
        src={resolveUrl(cat.image)}
        alt={cat.name}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
      <div className={`absolute bottom-0 left-0 right-0 ${big ? 'p-4 lg:p-6' : 'p-3 lg:p-5'}`}>
        <h3 className={`${big ? 'text-lg lg:text-2xl' : 'text-base lg:text-xl'} font-bold text-cream tracking-wide`}>
          {cat.name}
        </h3>
        {big && (
          <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase text-cream/70 transition-colors group-hover:text-cream">
            Shop Now
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        )}
      </div>
    </a>
  );
}

export default function V2CategoryGrid() {
  const [first, ...rest] = CATEGORIES.slice(0, BENTO_COUNT);
  return (
    <section className="pt-10 lg:pt-24 pb-10 lg:pb-12">
      {/* 标题区限宽居中。移动端标题区间距收窄（2026-09 用户定：Bento 平铺尽量一屏内看完） */}
      <Reveal>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center mb-6 lg:mb-14">
          <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-3">
            Shop by Category
          </p>
          <h2 className="text-2xl lg:text-5xl font-extrabold tracking-tight text-charcoal">
            Find Your Comfort
          </h2>
        </div>
      </Reveal>
      {/* 移动端：Bedding 通栏大卡（16/9）+ 2列×3行小卡；桌面端：左 2/5 大卡（高度跟随右侧两行
          小卡，lg:h-full 自动对应）+ 右 3列×2行小卡（2026-09 用户定方案 A；
          小卡 2026-09 用户定全端统一 1:1，此前 4/3、桌面 4/5 均弃用） */}
      <Reveal>
        <div className="px-3 lg:px-10 lg:max-w-[1800px] lg:mx-auto grid grid-cols-2 lg:grid-cols-[2fr_3fr] gap-2 lg:gap-5">
          <CategoryCard
            cat={first}
            big
            className="col-span-2 lg:col-span-1 aspect-[16/9] lg:aspect-auto lg:h-full"
          />
          <div className="contents lg:grid lg:grid-cols-3 lg:grid-rows-2 lg:gap-5">
            {rest.map((cat) => (
              <CategoryCard key={cat.name} cat={cat} className="aspect-square" />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
