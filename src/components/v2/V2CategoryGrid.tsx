import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

// V2 分类区（2026-10-07 用户定：只保留 4 张卡 Bedding/Pillows/Cushions/Decor，
// 占屏宽度打满、无版心限制；桌面端 lg:px-10（与 Best Sellers 一致）。
// 2026-10-08 用户定：移动端改单列竖排，卡片打满屏幕宽度，卡高 = 原 2列×2行四卡总高（≈屏宽，1:1 方卡）。
// 2026-10-08 ins 版：Bedding 卡移除（Hero 已展示 bedding 且有 Shop Beddings 入口），
// 剩 3 张，桌面端 3 列一行；卡面文字 = 类名 + 一行内容说明）。
// 图全部用 SeeAny 种草风图，统一奶油暖调配色；Cushions 用站内产品 B0F1XS7VKY 作参考生成。
const CATEGORIES = [
  { name: 'Pillows', desc: 'Bed, decorative & neck pillows', image: '/images/collections/cat-social-pillows.webp', href: '/products/?cat=pillows' },
  { name: 'Cushions', desc: 'For chairs, sofas & seats', image: '/images/collections/cat-social-cushions.webp', href: '/products/?cat=cushions' },
  { name: 'Decor', desc: 'Wall art & warm accents', image: '/images/collections/cat-social-decor.webp', href: '/products/?cat=decor' },
];

/** 类目卡：图上渐变 + 左下类名（ins 版 2026-10-08 测试副本：去掉 Shop Now，只留类名） */
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
      className={`group relative block overflow-hidden ${className}`}
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
        {/* 一行说明该页内容（2026-10-08 用户定：暗示点击去向） */}
        <p className="mt-0.5 text-[11px] lg:text-sm text-cream/80 tracking-wide">
          {cat.desc}
        </p>
      </div>
    </a>
  );
}

export default function V2CategoryGrid() {
  return (
    // 顶部间距收窄（2026-09-30 用户定：配合 Hero 桌面高，让 "Find Your Comfort"
    // 标题在首屏露出一部分，提示下方还有内容）
    <section className="pt-8 lg:pt-12 pb-10 lg:pb-12">
      {/* 标题区左对齐；ins 版（2026-10-08 测试副本）去掉 eyebrow，只留一行标题 */}
      <div className="px-3 lg:px-10 mb-6 lg:mb-10">
        <h2 className="text-2xl lg:text-5xl font-extrabold tracking-tight text-charcoal">
          Find Your Comfort
        </h2>
      </div>
      {/* 移动端（2026-10-08 用户定）：单列竖排、打满屏幕宽度（去掉 px-3），
          每张卡 aspect-square——高度 = 原 2列×2行四张卡的总高度（≈屏宽）；
          桌面端 3 列一行（Bedding 卡已移除），lg:px-10 与 Best Sellers 一致 */}
      <div className="lg:px-10 grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-5">
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.name} cat={cat} className="aspect-square" />
        ))}
      </div>
    </section>
  );
}
