'use client';

import { useRef, useState } from 'react';
import { resolveUrl } from '@/lib/paths';
import {
  HotspotDot,
  HotspotCardLayer,
  useCoverRect,
  anchorHotspots,
  type BeforeAfterHotspot,
} from '@/components/v2/hotspots';

export type { BeforeAfterHotspot } from '@/components/v2/hotspots';

/**
 * V2BeforeAfterSlider —— Before/After 拖动对比滑块（/inspiration 页、PDP 双图区用）。
 * 左侧 Before（空房），右侧 After（布置后）。
 * 交互（2026-10-29 用户定）：只能"拖动"改变分割线——按下后需横向移动超过阈值
 * 才进入拖动（按按下时的相对位移计算），单纯点击/轻触不改变位置，
 * 这样图上可以叠加产品跳转热区而不冲突。
 * 热区圆点只显示在 After 侧（圆点层随分割线同步裁剪），点击圆点弹出产品小卡，
 * 小卡整卡跳转 PDP；从圆点上起手不会带动滑块。
 * 本 PDP 产品对应的圆点（isCurrent）做品牌色特别标记，小卡不可跳转（2026-10-30 用户定）。
 * className 用于外部覆盖尺寸（如 PDP 双图区桌面端限高 lg:aspect-auto lg:h-full）。
 * 移动端触摸（2026-10-30 用户定）：touch-pan-y——横向手势拖动分割线，竖向手势正常滚页面。
 * Before/After 角标（2026-10-30 用户定）：sticky 吸附在头部下方跟随滚动，行程限制在
 * 图片上半部分（h-1/2 容器），即滚动到图片中线为止；因此裁切层（overflow-hidden）
 * 必须隔离在内层 div，角标层在其外。
 */
export default function V2BeforeAfterSlider({
  before,
  after,
  alt,
  hotspots = [],
  className = '',
}: {
  before: string;
  after: string;
  alt: string;
  hotspots?: BeforeAfterHotspot[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // 圆点锚定 object-cover 图片实际显示区域，容器宽高比变化时不错位（2026-10-30）
  const rect = useCoverRect(ref);
  const anchored = anchorHotspots(hotspots, rect);
  // pending: 已按下但未超过拖动阈值；dragging: 拖动中
  const pending = useRef(false);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startPos = useRef(50);
  // 分割线初始居中（2026-10-29 用户定）
  const [pos, setPos] = useState(50);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);

  const activeHotspot = anchored.find((h) => h.handle === activeHandle) ?? null;

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
      const ah = anchored.find((h) => h.handle === activeHandle);
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
      className={`relative aspect-[3/4] w-full select-none touch-pan-y cursor-ew-resize bg-cream ${className}`}
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
      {/* 裁切层（overflow-hidden 隔离在此层，否则角标 sticky 失效） */}
      <div className="absolute inset-0 overflow-hidden">
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
        {anchored.length > 0 && (
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
          >
            {anchored.map((h) => (
              <HotspotDot
                key={h.handle}
                h={h}
                active={activeHandle === h.handle}
                onToggle={() =>
                  setActiveHandle(activeHandle === h.handle ? null : h.handle)
                }
              />
            ))}
          </div>
        )}
        {/* 产品小卡层：不随分割线裁剪，定位到激活圆点旁，整卡跳 PDP（isCurrent 除外） */}
        {activeHotspot && <HotspotCardLayer hotspot={activeHotspot} />}

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

      {/* 角标（2026-10-30 用户定）：sticky 跟随页面向下滚动，到图片中线为止——
          故放在溢出裁切层之外、包裹图片上半部分的容器里（h-1/2 即行程终点为中线），
          top 偏移量避开 sticky 头部（52/88px） */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-1/2 items-start justify-between px-3 pt-3" aria-hidden>
        <span className="sticky top-[calc(52px+env(safe-area-inset-top,0px)+12px)] lg:top-[calc(88px+env(safe-area-inset-top,0px)+12px)] bg-black/45 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white">
          Before
        </span>
        <span className="sticky top-[calc(52px+env(safe-area-inset-top,0px)+12px)] lg:top-[calc(88px+env(safe-area-inset-top,0px)+12px)] bg-black/45 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white">
          After
        </span>
      </div>
    </div>
  );
}
