import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

// V2 分类区（2026-10-07 用户定：只保留 4 张卡 Bedding/Pillows/Cushions/Decor，
// 全端平铺、占屏宽度打满——移动端 px-3（与 bed-sets 列表页一致）、桌面端 lg:px-10（与 Best Sellers 一致），无版心限制。
// 移动端 2列×2行，桌面端 4 列一行，全端 1:1 方卡）。
// 4 张全部用 SeeAny 种草风图，统一奶油暖调配色；Cushions 用站内产品 B0F1XS7VKY 作参考生成。
const CATEGORIES = [
  { name: 'Bedding', image: '/images/collections/cat-social-bedding.webp', href: '/products/?cat=bedding' },
  { name: 'Pillows', image: '/images/collections/cat-social-pillows.webp', href: '/products/?cat=pillows' },
  { name: 'Cushions', image: '/images/collections/cat-social-cushions.webp', href: '/products/?cat=cushions' },
  { name: 'Decor', image: '/images/collections/cat-social-decor.webp', href: '/products/?cat=decor' },
];

/** 类目卡：图上渐变 + 左下类名 + Shop Now */
function CategoryCard({
  cat,
  className = '',
}: {
  cat: (typeof CATEGORIES)[number];
  className?: string;
}) {
  return (
    <a
      href={v2url(cat.href)}
      className={`group relative block overflow-hidden rounded-xl ${className}`}
    >
      <img
        src={resolveUrl(cat.image)}
        alt={cat.name}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-5">
        <h3 className="text-base lg:text-2xl font-bold text-cream tracking-wide">
          {cat.name}
        </h3>
        <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase text-cream/70 transition-colors group-hover:text-cream">
          Shop Now
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </a>
  );
}

export default function V2CategoryGrid() {
  return (
    // 顶部间距收窄（2026-09-30 用户定：配合 Hero 桌面高，让 "Find Your Comfort"
    // 标题在首屏露出一部分，提示下方还有内容）
    <section className="pt-8 lg:pt-12 pb-10 lg:pb-12">
      {/* 标题区左对齐，与 Best Sellers 同款（2026-10-07 用户定：卡片打满全宽，标题随卡片对齐）。
          2026-09-30 用户定：本区去掉滚动渐入（Reveal），全端直接加载显示 */}
      <div className="px-3 lg:px-10 mb-6 lg:mb-10">
        <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-3">
          Shop by Category
        </p>
        <h2 className="text-2xl lg:text-5xl font-extrabold tracking-tight text-charcoal">
          Find Your Comfort
        </h2>
      </div>
      {/* 全端平铺：移动端 2列×2行、桌面端 4列一行；移动端边距 px-3 与 bed-sets 列表页一致
          （2026-10-07 用户定：px-6 太宽），桌面端 lg:px-10 与 Best Sellers 一致 */}
      <div className="px-3 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-5">
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.name} cat={cat} className="aspect-square" />
        ))}
      </div>
    </section>
  );
}
