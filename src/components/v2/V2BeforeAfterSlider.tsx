'use client';

import { useRef, useState } from 'react';
import { resolveUrl, shopifyImageUrl } from '@/lib/paths';
import { formatPrice } from '@/lib/currency';
import { v2url } from '@/lib/v2paths';

/** 热区产品点卡片数据（由服务端 page 用 getProductByHandle  enrich 后传入） */
export interface BeforeAfterHotspot {
  handle: string;
  title: string;
  image: string;
  price: string;
  currency: string;
  x: number;
  y: number;
  label: string;
}

function cardImageUrl(image: string) {
  return image.includes('cdn.shopify.com') ? shopifyImageUrl(image, 400) : resolveUrl(image);
}

/**
 * V2BeforeAfterSlider —— Before/After 拖动对比滑块（/inspiration 页用）。
 * 左侧 Before（空房），右侧 After（布置后）。
 * 交互（2026-10-29 用户定）：只能"拖动"改变分割线——按下后需横向移动超过阈值
 * 才进入拖动（按按下时的相对位移计算），单纯点击/轻触不改变位置，
 * 这样图上可以叠加产品跳转热区而不冲突。
 * 热区圆点只显示在 After 侧（圆点层随分割线同步裁剪），点击圆点弹出产品小卡，
 * 小卡整卡跳转 PDP；从圆点上起手不会带动滑块。
 */
export default function V2BeforeAfterSlider({
  before,
  after,
  alt,
  hotspots = [],
}: {
  before: string;
  after: string;
  alt: string;
  hotspots?: BeforeAfterHotspot[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  // pending: 已按下但未超过拖动阈值；dragging: 拖动中
  const pending = useRef(false);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startPos = useRef(50);
  // 分割线初始居中（2026-10-29 用户定）
  const [pos, setPos] = useState(50);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);

  const activeHotspot = hotspots.find((h) => h.handle === activeHandle) ?? null;

  const clamp = (p: number) => Math.min(96, Math.max(4, p));

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pending.current = true;
    dragging.current = false;
    startX.current = e.clientX;
    startPos.current = pos;
    // 点到空白处时收起已打开的产品小卡
    setActiveHandle(null);
    try {
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } catch {}
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pending.current) return;
    const el = ref.current;
    if (!el) return;
    const dx = e.clientX - startX.current;
    // 阈值：横向移动超过 8px 才算拖动；纯点击不改变分割线
    if (!dragging.current && Math.abs(dx) <= 8) return;
    dragging.current = true;
    const w = el.getBoundingClientRect().width;
    const next = clamp(startPos.current + (dx / w) * 100);
    setPos(next);
    // 分割线拖过激活圆点时收起小卡（圆点已被 Before 侧盖住）
    if (activeHandle) {
      const ah = hotspots.find((h) => h.handle === activeHandle);
      if (ah && next > ah.x) setActiveHandle(null);
    }
  };
  const stop = () => {
    pending.current = false;
    dragging.current = false;
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[3/4] w-full overflow-hidden select-none touch-none cursor-ew-resize bg-cream"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerCancel={stop}
      role="slider"
      aria-label="Before and after comparison"
      aria-valuenow={Math.round(pos)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') setPos((p) => Math.max(4, p - 5));
        if (e.key === 'ArrowRight') setPos((p) => Math.min(96, p + 5));
      }}
    >
      {/* After（底层，右侧完整显示） */}
      <img
        src={resolveUrl(after)}
        alt={alt}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Before（顶层，裁到左侧） */}
      <img
        src={resolveUrl(before)}
        alt=""
        aria-hidden
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      {/* 热区产品点：只显示在 After 侧（随分割线同步裁剪）；产品小卡在独立未裁剪层渲染 */}
      {hotspots.length > 0 && (
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
        >
          {hotspots.map((h) => (
            <div
              key={h.handle}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              <button
                type="button"
                aria-label={`${h.title} — ${h.label}`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHandle(activeHandle === h.handle ? null : h.handle);
                }}
                className="group relative block"
              >
                <span className="absolute inset-0 rounded-full bg-white/60 animate-ping [animation-duration:2.5s]" />
                <span
                  className={`relative flex h-7 w-7 lg:h-8 lg:w-8 items-center justify-center rounded-full border-2 border-white shadow-lg transition ${
                    activeHandle === h.handle ? 'bg-brand scale-110' : 'bg-white/90 group-hover:bg-brand'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      activeHandle === h.handle ? 'bg-white' : 'bg-brand group-hover:bg-white'
                    }`}
                  />
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
      {/* 产品小卡层：不随分割线裁剪，定位到激活圆点旁，整卡跳 PDP */}
      {activeHotspot && (
        <div className="pointer-events-none absolute inset-0 z-10">
          <a
            href={v2url(`/products/${activeHotspot.handle}/`)}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className={`pointer-events-auto absolute block w-52 -translate-x-1/2 ${
              activeHotspot.y > 55 ? '-translate-y-[calc(100%+1rem)]' : 'translate-y-4'
            } ${
              activeHotspot.x <= 30
                ? 'translate-x-[-10%]'
                : activeHotspot.x >= 70
                  ? 'translate-x-[-90%]'
                  : ''
            }`}
            style={{ left: `${activeHotspot.x}%`, top: `${activeHotspot.y}%` }}
          >
            <span className="flex items-center gap-2.5 rounded-xl border border-warm-gray bg-cream/95 p-2.5 text-left shadow-xl backdrop-blur">
              <span className="block h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-warm-gray bg-white">
                <img
                  src={cardImageUrl(activeHotspot.image)}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold leading-snug text-charcoal line-clamp-2">
                  {activeHotspot.title}
                </span>
                <span className="mt-0.5 block text-sm font-bold text-brand">
                  {formatPrice(activeHotspot.price, activeHotspot.currency)}
                </span>
                <span className="mt-0.5 block text-[10px] text-charcoal/45">
                  Tap to shop
                </span>
              </span>
            </span>
          </a>
        </div>
      )}

      {/* 角标 */}
      <span className="pointer-events-none absolute left-3 top-3 bg-black/45 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 bg-black/45 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white">
        After
      </span>

      {/* 分割线 + 手柄 */}
      <div
        className="pointer-events-none absolute inset-y-0"
        style={{ left: `${pos}%` }}
        aria-hidden
      >
        <div className="absolute inset-y-0 -ml-px w-0.5 bg-white/90 shadow-[0_0_6px_rgba(0,0,0,0.35)]" />
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-charcoal"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 6l-5 6 5 6" />
            <path d="M15 6l5 6-5 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
