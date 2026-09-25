import { spotlightImage, formatPrice } from '@/components/v2/card-utils';
import { v2url } from '@/lib/v2paths';
import { resolveUrl } from '@/lib/paths';
import type { SetFamily } from '@/data/bedding-families';

/**
 * Bedding 套装家族卡（2026-09 共享）：/bedding/ 落地页、/bedding/[slug]/ 二级页与
 * /products?cat=bedding 选购视图共用。
 * 标题 = `材质 — 颜色`（2026-09 用户定；无颜色时只显示材质，无材质时回退原逻辑）。
 * colorOnly = 面料二级 PLP 用：面料已是页面主题，标题只留颜色（2026-09 用户定：卡片减负）。
 * badges = 图片左上角叠层小标（只放 "4-Piece Set" 类型标；材质标 2026-09 用户定从图上移除）。
 */
export default function BeddingSetCard({
  family,
  badges = [],
  colorOnly = false,
}: {
  family: SetFamily;
  badges?: string[];
  colorOnly?: boolean;
}) {
  const img = spotlightImage(family.rep);
  const fabric = family.materials[0];
  const name = colorOnly
    ? family.color || fabric || 'Washed Cotton Comforter Set'
    : fabric
      ? family.color
        ? `${fabric} — ${family.color}`
        : fabric
      : family.kind === 'comforter'
        ? 'Washed Cotton Comforter Set'
        : family.color;
  return (
    <a
      href={v2url(`/products/${family.rep.handle}/`)}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden bg-warm-gray">
        <img
          src={resolveUrl(img.url)}
          alt={img.altText}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {badges.length > 0 && (
          <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
            {badges.map((b) => (
              <span
                key={b}
                className="px-2.5 py-1 rounded-full bg-cream/90 text-charcoal text-[10px] font-semibold tracking-wide"
              >
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
      {/* 白色信息区：标题/价格小号字 + 紧凑内边距（2026-09 用户定：除尺寸行外文字缩小、白色区压缩） */}
      <div className="p-3 lg:p-4">
        <h3 className="text-sm lg:text-base font-semibold text-charcoal">{name}</h3>
        {family.sizes.length > 0 && (
          <p className="mt-1 text-[11px] lg:text-xs text-[#999] whitespace-nowrap">
            {family.sizes.map((s) => s.charAt(0) + s.slice(1).toLowerCase()).join(' / ')}
          </p>
        )}
        {family.fromPrice && (
          <p className="mt-1.5 text-sm lg:text-base font-semibold text-brand">
            From {formatPrice(family.fromPrice, family.currency)}
          </p>
        )}
      </div>
    </a>
  );
}
