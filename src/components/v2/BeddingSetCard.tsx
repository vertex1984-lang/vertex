import { spotlightImage, formatPrice } from '@/components/v2/card-utils';
import { v2url } from '@/lib/v2paths';
import { resolveUrl } from '@/lib/paths';
import type { SetFamily } from '@/data/bedding-families';

/**
 * Bedding 套装家族卡（2026-09 共享）：/bedding/ 落地页、/bedding/[slug]/ 二级页与
 * /products?cat=bedding 选购视图共用。
 * 标题 = 产品短标题去掉尾部尺寸段（2026-09 用户定：颜色字段统一改成展示标题，
 * 字体小一号、一行截断；标题尾部 ", Queen" / ", 230 x 200cm" 是代表 SKU 自己的尺寸，
 * 与卡片尺寸带 "Twin / Full / Queen / King" 并列会矛盾，故裁掉）。
 * badges = 图片左上角叠层小标。展示规则（2026-09 用户定，写进 AGENTS.md）：
 * 卡片只叠「页面/分区标题未表达的另一维度」——标题是类型（x-Piece Sets）且页内多布料混排时
 * 叠布料标签（materials[0]，如 "100% Linen"；类型页/Bed Sets 合并页/落地页分区）；
 * 标题是布料/材质时叠 type 标签（SET_KIND_LABEL，如 "3-Piece Set"；/products?cat=bedding 材质分区）；
 * 面料页（/bedding/linen/ 等）整页同一布料，两维度都已表达 → 不叠任何标签。
 */
export default function BeddingSetCard({
  family,
  badges = [],
}: {
  family: SetFamily;
  badges?: string[];
}) {
  const img = spotlightImage(family.rep);
  const name = family.rep.title.replace(
    /,\s*(Twin|Full|Queen|King|\d+\s*x\s*\d+\s*cm)$/i,
    ''
  );
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
        <h3 className="text-xs lg:text-sm font-semibold text-charcoal truncate" title={name}>
          {name}
        </h3>
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
