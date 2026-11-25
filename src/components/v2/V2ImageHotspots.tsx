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

/**
 * V2ImageHotspots —— 静态场景图 + 产品热区圆点（PDP 双图区种草图用，2026-10-30 用户定）。
 * 交互与 V2BeforeAfterSlider 的热区一致：点圆点弹产品小卡，小卡整卡跳 PDP，
 * 点图空白处收起小卡；本 PDP 产品（isCurrent）品牌色特别标记、不可跳转。
 * 圆点锚定 object-cover 图片的实际显示区域，容器宽高比变化（如桌面全高通栏）时不错位。
 * className 用于外部覆盖尺寸（如桌面端 lg:aspect-auto lg:h-full）。
 */
export default function V2ImageHotspots({
  image,
  alt,
  hotspots = [],
  className = '',
}: {
  image: string;
  alt: string;
  hotspots?: BeforeAfterHotspot[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useCoverRect(ref);
  const anchored = anchorHotspots(hotspots, rect);
  // 悬停弹卡（2026-11-09 领导定，与 lookbook 一致）+ 点击固定（触屏设备无 hover）。
  // 指针在圆点↔小卡之间移动有 120ms 宽限，防止跨间隙时卡片闪烁
  const [hoverHandle, setHoverHandle] = useState<string | null>(null);
  const [pinnedHandle, setPinnedHandle] = useState<string | null>(null);
  const leaveTimer = useRef<number | null>(null);
  const cancelClear = () => {
    if (leaveTimer.current !== null) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };
  const scheduleClear = () => {
    cancelClear();
    leaveTimer.current = window.setTimeout(() => {
      setHoverHandle(null);
      leaveTimer.current = null;
    }, 120);
  };
  const visibleHandle = hoverHandle ?? pinnedHandle;
  const activeHotspot = anchored.find((h) => h.handle === visibleHandle) ?? null;

  return (
    <div
      ref={ref}
      className={`relative aspect-[3/4] w-full overflow-hidden select-none bg-cream ${className}`}
      onPointerDown={() => {
        setPinnedHandle(null);
        setHoverHandle(null);
      }}
    >
      <img
        src={resolveUrl(image)}
        alt={alt}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {anchored.map((h) => (
        <HotspotDot
          key={h.handle}
          h={h}
          active={visibleHandle === h.handle}
          onToggle={() =>
            setPinnedHandle(pinnedHandle === h.handle ? null : h.handle)
          }
          onMouseEnter={() => {
            cancelClear();
            setHoverHandle(h.handle);
          }}
          onMouseLeave={scheduleClear}
        />
      ))}
      {activeHotspot && (
        <HotspotCardLayer
          hotspot={activeHotspot}
          onMouseEnter={() => {
            cancelClear();
            setHoverHandle(activeHotspot.handle);
          }}
          onMouseLeave={scheduleClear}
        />
      )}
    </div>
  );
}
