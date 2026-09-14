import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { StyleCardData } from '@/data/style-tagged';

/**
 * 风格入口卡（首页 Shop by Style 与 /featured-products/style/ 汇总页共用）：
 * 代表图 + 渐变遮罩 + 偏小字号风格名 + 件数（无 CTA 箭头，2026-09 用户定）。
 * big = 2×2 主卡（Bento 用）；wide = 桌面端拉宽补齐行（Bento 用）。
 */
export default function V2StyleCard({
  card,
  big,
  wide,
}: {
  card: StyleCardData;
  big?: boolean;
  wide?: boolean;
}) {
  return (
    <a
      href={v2url(`/featured-products/style/${card.key}/`)}
      className={`group relative block overflow-hidden rounded-xl bg-warm-gray ${
        big
          ? 'col-span-2 row-span-2 lg:col-span-2 lg:row-span-2 aspect-[2/1] lg:aspect-auto'
          : wide
            ? 'lg:col-span-2 aspect-square lg:aspect-[2/1]'
            : 'aspect-square'
      }`}
    >
      <img
        src={resolveUrl(card.image)}
        alt={card.label}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
        <p className={`font-extrabold tracking-tight text-cream ${big ? 'text-xl lg:text-2xl' : 'text-sm lg:text-lg'}`}>
          {card.label}
        </p>
        {big && card.blurb && (
          <p className="mt-1 text-xs lg:text-sm text-cream/85 max-w-md">{card.blurb}</p>
        )}
        <p className="mt-1 text-[10px] lg:text-xs font-semibold uppercase tracking-widest text-cream/80">
          {card.count} pieces
        </p>
      </div>
    </a>
  );
}
