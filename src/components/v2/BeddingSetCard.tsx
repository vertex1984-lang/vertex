import { spotlightImage, formatPrice } from '@/components/v2/card-utils';
import { v2url } from '@/lib/v2paths';
import { resolveUrl } from '@/lib/paths';
import type { SetFamily } from '@/data/bedding-families';

/** 家族卡最小数据形状：SetFamily（bedding）与 BlanketFamily（blankets）均满足；
 *  colors = 卡面颜色变体行（2026-10-02 pillows 合并卡用，如 "Black / Grey / Pink"）；
 *  titleOverride = 卡片展示标题覆盖（2026-10-09 pillows 卡片标题规则用，pillowCardTitle），
 *  仅影响卡面标题，href/PDP 仍用产品原标题 */
export type FamilyCardData = Pick<SetFamily, 'rep' | 'sizes' | 'fromPrice' | 'currency'> & {
  colors?: string[];
  titleOverride?: string;
};

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

/** 2026-10-08 用户定：全站产品卡标签（badge）暂不展示。规则保留——上面的展示规则注释与
 *  各 Shop 组件的 cardBadges 计算逻辑均未删，后续可能再启用：把开关改回 true 即可恢复。 */
const SHOW_CARD_BADGES = false;

/** 2026-10-08 用户定：全站产品卡不再展示变体信息行（尺寸带 sizes / 颜色变体行 colors）。
 *  数据口径保留（pillowSizesOf、buildSetFamilies 尺寸带、合并卡 colors 等均未动），
 *  恢复时把开关改回 true 即可。 */
const SHOW_CARD_VARIANT_INFO = false;

export default function BeddingSetCard({
  family,
  badges = [],
  sizesSuffix = '',
  paddedWhiteBg = false,
  compactText = false,
}: {
  family: FamilyCardData;
  badges?: string[];
  /** 尺寸行统一后缀（blankets 传 "cm"：sizes 不带单位，显示为 "120 x 200 / 150 x 200 cm"，避免每段重复单位过长） */
  sizesSuffix?: string;
  /** 白底图模式（2026-09-30 用户定：pillows 白底产品图完整展示）：
   *  object-contain + p-2 sm:p-7 留白边，容器白底（与 ProductCard 白底规则一致），
   *  默认 false = object-cover 打满（场景图，bedding/blankets 不变） */
  paddedWhiteBg?: boolean;
  /** 2026-10-08 用户定：Pillows / Bedding 类目卡片标题与价格再缩小一档（其他类目后续逐一统一，暂不动） */
  compactText?: boolean;
}) {
  const img = spotlightImage(family.rep);
  const name = (family.titleOverride || family.rep.title).replace(
    /,\s*(Twin|Full|Queen|King|\d+\s*x\s*\d+\s*cm)$/i,
    ''
  );
  return (
    <a
      href={v2url(`/products/${family.rep.handle}/`)}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className={`relative aspect-square overflow-hidden ${paddedWhiteBg ? 'bg-white' : 'bg-warm-gray'}`}>
        <img
          src={resolveUrl(img.url)}
          alt={img.altText}
          loading="lazy"
          className={`absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105 ${
            paddedWhiteBg ? 'object-contain p-2 sm:p-7' : 'object-cover'
          }`}
        />
        {SHOW_CARD_BADGES && badges.length > 0 && (
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
      {/* 白色信息区：标题/价格小号字 + 紧凑内边距（2026-09 用户定：除尺寸行外文字缩小、白色区压缩）；
          compactText（2026-10-08 用户定）= Pillows / Bedding 类目卡片标题与价格再缩小一档，其他类目不变 */}
      <div className="p-3 lg:p-4">
        <h3
          className={`${compactText ? 'text-[11px] lg:text-xs' : 'text-xs lg:text-sm'} font-semibold text-charcoal truncate`}
          title={name}
        >
          {name}
        </h3>
        {SHOW_CARD_VARIANT_INFO && family.sizes.length > 0 && (
          /* truncate + title：尺寸段多时在卡片边缘省略号截断（hover 显全），不再硬截数字中间（2026-09-27） */
          <p
            className="mt-1 text-[11px] lg:text-xs text-[#999] whitespace-nowrap truncate"
            title={family.sizes.join(' / ') + (sizesSuffix ? ` ${sizesSuffix}` : '')}
          >
            {family.sizes.map((s) => s.charAt(0) + s.slice(1).toLowerCase()).join(' / ')}
            {sizesSuffix ? ` ${sizesSuffix}` : ''}
          </p>
        )}
        {SHOW_CARD_VARIANT_INFO && family.colors && family.colors.length > 0 && (
          /* 颜色变体行（2026-10-02 pillows 合并卡）：与尺寸行同款小字灰色，截断 hover 显全 */
          <p
            className="mt-1 text-[11px] lg:text-xs text-[#999] whitespace-nowrap truncate"
            title={family.colors.join(' / ')}
          >
            {family.colors.join(' / ')}
          </p>
        )}
        {family.fromPrice && (
          <p
            className={`mt-1.5 ${compactText ? 'text-xs lg:text-sm' : 'text-sm lg:text-base'} font-semibold text-brand`}
          >
            From {formatPrice(family.fromPrice, family.currency)}
          </p>
        )}
      </div>
    </a>
  );
}
