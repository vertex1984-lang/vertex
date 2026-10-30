'use client';

import { useEffect, useState } from 'react';
import { resolveUrl, shopifyImageUrl } from '@/lib/paths';
import { formatPrice } from '@/lib/currency';
import { v2url } from '@/lib/v2paths';

/** 热区产品点卡片数据（由页面用 getProductByHandle enrich 后传入） */
export interface BeforeAfterHotspot {
  handle: string;
  title: string;
  image: string;
  price: string;
  currency: string;
  x: number;
  y: number;
  label: string;
  /** 是否为本 PDP 在售产品（2026-10-30 用户定）：品牌色实心点 + "This item" 小牌，
      小卡展示 "You're viewing this product"，不可跳转 */
  isCurrent?: boolean;
}

function cardImageUrl(image: string) {
  return image.includes('cdn.shopify.com') ? shopifyImageUrl(image, 400) : resolveUrl(image);
}

/** 实际显示的图片区域（容器百分比）。object-cover 裁切时图可能超出容器，
    热区坐标是相对原图的，必须换算到图片实际显示区域才能贴在产品上（2026-10-30 用户定） */
export interface CoverRect {
  l: number;
  t: number;
  w: number;
  h: number;
}

/** 测量容器内 object-cover 图片的实际显示区域（imgAspect = 图宽/图高，inspiration 素材均为 3:4 = 0.75） */
export function useCoverRect(
  ref: React.RefObject<HTMLElement | null>,
  imgAspect = 0.75,
): CoverRect {
  const [rect, setRect] = useState<CoverRect>({ l: 0, t: 0, w: 100, h: 100 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const { width: W, height: H } = el.getBoundingClientRect();
      if (!W || !H) return;
      if (W / H > imgAspect) {
        // 容器比图宽：图按宽放大，上下被裁
        const h = ((W / imgAspect) / H) * 100;
        setRect({ l: 0, t: (100 - h) / 2, w: 100, h });
      } else {
        // 容器比图窄：图按高放大，左右被裁
        const w = (H * imgAspect / W) * 100;
        setRect({ l: (100 - w) / 2, t: 0, w, h: 100 });
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, imgAspect]);
  return rect;
}

/** 把相对原图的热区坐标换算为相对容器的坐标（锚定图片实际显示区域） */
export function anchorHotspots(
  hotspots: BeforeAfterHotspot[],
  rect: CoverRect,
): BeforeAfterHotspot[] {
  return hotspots.map((h) => ({
    ...h,
    x: rect.l + (h.x / 100) * rect.w,
    y: rect.t + (h.y / 100) * rect.h,
  }));
}

/** 热区圆点（定位在图百分比坐标处）。isCurrent 点用品牌色实心 + "This item" 小牌特别标记 */
export function HotspotDot({
  h,
  active,
  onToggle,
}: {
  h: BeforeAfterHotspot;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${h.x}%`, top: `${h.y}%` }}
    >
      <button
        type="button"
        aria-label={`${h.title} — ${h.label}`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="group relative block"
      >
        {h.isCurrent && (
          <span className="absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap text-white shadow">
            This item
          </span>
        )}
        <span className="absolute inset-0 rounded-full bg-white/60 animate-ping [animation-duration:2.5s]" />
        <span
          className={`relative flex items-center justify-center rounded-full border-2 border-white shadow-lg transition ${
            h.isCurrent
              ? 'h-8 w-8 lg:h-9 lg:w-9 bg-brand'
              : `h-7 w-7 lg:h-8 lg:w-8 ${
                  active ? 'bg-brand scale-110' : 'bg-white/90 group-hover:bg-brand'
                }`
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              h.isCurrent || active ? 'bg-white' : 'bg-brand group-hover:bg-white'
            }`}
          />
        </span>
      </button>
    </div>
  );
}

/** 激活圆点的产品小卡层（不随分割线裁剪，定位到圆点旁）。
    普通产品整卡跳 PDP；本 PDP 产品（isCurrent）不可跳转，提示 "You're viewing this product" */
export function HotspotCardLayer({ hotspot: h }: { hotspot: BeforeAfterHotspot }) {
  const posClass = `pointer-events-auto absolute block w-52 -translate-x-1/2 ${
    h.y > 55 ? '-translate-y-[calc(100%+1rem)]' : 'translate-y-4'
  } ${
    h.x <= 30 ? 'translate-x-[-10%]' : h.x >= 70 ? 'translate-x-[-90%]' : ''
  }`;
  const posStyle = { left: `${h.x}%`, top: `${h.y}%` };
  const inner = (
    <span className="flex items-center gap-2.5 rounded-xl border border-warm-gray bg-cream/95 p-2.5 text-left shadow-xl backdrop-blur">
      <span className="block h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-warm-gray bg-white">
        <img
          src={cardImageUrl(h.image)}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold leading-snug text-charcoal line-clamp-2">
          {h.title}
        </span>
        <span className="mt-0.5 block text-sm font-bold text-brand">
          {formatPrice(h.price, h.currency)}
        </span>
        <span className="mt-0.5 block text-[10px] text-charcoal/45">
          {h.isCurrent ? "You're viewing this product" : 'Tap to shop'}
        </span>
      </span>
    </span>
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {h.isCurrent ? (
        <div
          className={posClass}
          style={posStyle}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {inner}
        </div>
      ) : (
        <a
          href={v2url(`/products/${h.handle}/`)}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className={posClass}
          style={posStyle}
        >
          {inner}
        </a>
      )}
    </div>
  );
}
