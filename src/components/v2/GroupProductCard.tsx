'use client';

import { useState } from 'react';
import { formatPrice } from '@/components/v2/card-utils';
import { v2url } from '@/lib/v2paths';
import { resolveUrl } from '@/lib/paths';
import type { GroupCard } from '@/lib/group-cards';

/**
 * 组卡（2026-10-22 用户定，「一组一卡 + 色卡」）：同一变体组只出一张卡，
 * 卡面用圆形实拍小图色卡展示全部颜色（取代原颜色文字行 colorLine，尺寸信息不保留）：
 * - 初始显示组代表主图 + "From $xx"（组内最低价）+ 组代表评分；
 * - 点色卡（preventDefault 不跳页）联动切换卡面主图/价格/评分为该色口径，
 *   之后点卡身跳转当前选中色成员的 PDP；
 * - 色卡 24px（移动端）/ 28px（桌面）、间距 8px；颜色 >6 时显示前 5 个 + "+N" 圆点
 *   （点 +N 进组代表款 PDP）；缺货成员灰显但仍可点看；
 * - 无变体组单品 = 无色卡单卡（variants 为空，价格不带 From 前缀）。
 * 视觉版式完全沿用 BeddingSetCard（字级/间距/圆角/价格色），只把颜色文字行换成色卡行；
 * 注意：卡身是 <a>，色卡只能用 <button>（嵌套 <a> 会被 HTML 解析器拆出导致水合错位）。
 */

/** 2026-10-08 用户定：全站产品卡标签（badge）暂不展示（同 BeddingSetCard 开关，保留口径） */
const SHOW_CARD_BADGES = false;

export default function GroupProductCard({
  card,
  badges = [],
  compactText = false,
  /** 2026-10-19 用户定：全站产品卡统一 3:4 竖图（object-cover 裁两侧），默认开启 */
  tallImage = true,
  anchorRight = false,
  anchorLeft = false,
  paddedWhiteBg = false,
  paddedGrayBg = false,
  cropBiasRight = false,
  /** 混类网格卡片信息区对齐（原 reserveColorLine 口径）：无色卡组也渲染色卡行占位，全网格同高 */
  reserveSwatchRow = false,
}: {
  card: GroupCard;
  badges?: string[];
  compactText?: boolean;
  tallImage?: boolean;
  anchorRight?: boolean;
  anchorLeft?: boolean;
  paddedWhiteBg?: boolean;
  paddedGrayBg?: boolean;
  cropBiasRight?: boolean;
  reserveSwatchRow?: boolean;
}) {
  const [sel, setSel] = useState(() =>
    card.initialColor ? card.variants.findIndex((v) => v.color === card.initialColor) : -1
  );
  const v = sel >= 0 ? card.variants[sel] : undefined;
  const isGroup = card.variants.length > 0;
  const imgUrl = v?.imageUrl ?? card.imageUrl;
  const imgAlt = v?.imageAlt ?? card.imageAlt;
  // 2026-10-24 用户定：按当前显示图切换裁剪——套装场景图变体居中 50%（折叠图为 3:4 原图，无需焦点偏移）
  const centerCrop = (v ? v.centerCrop : card.centerCrop) === true;
  /** 卡面 1:1 方图不裁切（CARD_SQUARE_IMAGE_ASINS 白名单，2026-10-22 用户定）：按当前显示图（选中变体或卡面）判定 */
  const squareImg = (v ? v.squareImage : card.squareImage) === true;
  const href = v2url(`/products/${v?.handle ?? card.handle}/`);
  const name = (card.titleOverride || card.rep.title).replace(
    /,\s*(Twin|Full|Queen|King|\d+\s*x\s*\d+\s*cm)$/i,
    ''
  );
  const price = v ? v.price : card.fromPrice;
  const currency = v ? v.currency : card.currency;
  // 颜色 >6 时显示前 5 个 + "+N" 圆点（2026-10-22 用户定）
  const shown = card.variants.length > 6 ? card.variants.slice(0, 5) : card.variants;
  const overflow = card.variants.length - shown.length;

  return (
    <a href={href} className="group block overflow-hidden">
      <div className={`relative ${tallImage && !squareImg ? 'aspect-[3/4]' : 'aspect-square'} overflow-hidden ${paddedWhiteBg ? 'bg-white' : 'bg-warm-gray'}`}>
        <img
          src={resolveUrl(imgUrl)}
          alt={imgAlt}
          loading="lazy"
          className={`absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105 ${
            paddedGrayBg ? 'object-contain' : paddedWhiteBg ? 'object-contain p-2 sm:p-7' : `object-cover${anchorRight ? ' object-right' : ''}${anchorLeft ? ' object-left' : ''}${cropBiasRight ? ' object-[66.67%_50%]' : ''}${centerCrop ? ' object-center' : ''}`
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
      {/* 白色信息区：标题/价格小号字 + 紧凑内边距（同 BeddingSetCard 版式） */}
      <div className="p-3 lg:p-4">
        <h3
          className={`${compactText ? 'text-[11px] lg:text-xs' : 'text-xs lg:text-sm'} font-semibold text-charcoal leading-snug line-clamp-2`}
          title={name}
        >
          {name}
        </h3>
        {/* 色卡行（2026-10-22 用户定：整行取代原颜色文字行）：圆形实拍小图，选中态 border-brand shadow-md
            （同 PDP 色点）；缺货灰显可点；点色卡只换卡面不跳页 */}
        {card.variants.length > 1 ? (
          <div className="mt-1.5 flex items-center gap-2">
            {shown.map((sv, i) => (
              <button
                key={sv.asin}
                type="button"
                title={sv.color}
                aria-label={sv.color}
                aria-pressed={sel === i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSel(i);
                }}
                className={`relative shrink-0 w-6 h-6 lg:w-7 lg:h-7 rounded-full overflow-hidden border-2 transition hover:scale-105 ${
                  sel === i ? 'border-brand shadow-md' : 'border-warm-gray hover:border-brand/40'
                }${sv.inStock ? '' : ' opacity-40 grayscale'}`}
              >
                <img
                  src={resolveUrl(sv.thumb)}
                  alt=""
                  loading="lazy"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] object-cover"
                />
              </button>
            ))}
            {overflow > 0 && (
              <button
                type="button"
                title={`+${overflow} more colors`}
                aria-label={`+${overflow} more colors`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = v2url(`/products/${card.handle}/`);
                }}
                className="shrink-0 w-6 h-6 lg:w-7 lg:h-7 rounded-full border-2 border-warm-gray bg-white text-[10px] font-semibold text-[#777] flex items-center justify-center transition hover:border-brand/40"
              >
                +{overflow}
              </button>
            )}
          </div>
        ) : reserveSwatchRow ? (
          /* 占位行：与色卡行同高（24/28px），混类网格卡片信息区对齐 */
          <div className="mt-1.5 h-6 lg:h-7" aria-hidden="true" />
        ) : null}
        {price && (
          <p
            className={`mt-1.5 ${compactText ? 'text-xs lg:text-sm' : 'text-sm lg:text-base'} font-semibold text-brand`}
          >
            {isGroup ? `From ${formatPrice(price, currency)}` : formatPrice(price, currency)}
          </p>
        )}
      </div>
    </a>
  );
}
