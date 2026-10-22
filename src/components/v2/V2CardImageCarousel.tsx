'use client';

/**
 * V2CardImageCarousel — 搜索层 Recommended Products 卡片套图轮播（2026-10-21 任务3，参照 Zara Home）。
 * 2026-10-21 动画升级：叠放淡入淡出 → translateX 滑轨（Zara 式平滑滑动，用户定）。
 *
 * 桌面：hover 图区两侧淡入圆形小箭头，点击轨道平滑滑动切换套图（首张无左箭头 / 末张无右
 * 箭头，不循环）。
 * 移动：横向手势图片 1:1 跟手（transition 临时关闭、ref 直改 style 不触发重渲染），松手按
 * 阈值吸附落位 / 弹回原位；首图继续右拖 / 末图继续左拖按 EDGE_RESISTANCE 衰减（橡皮筋），
 * 松手弹回。无圆点（用户定）。单图产品不渲染轨道与箭头。
 *
 * 实现要点：
 * - 轨道 flex 一排整宽 slide，外层 overflow-hidden 裁切；hover 慢放大包在轨道外层不受影响。
 * - 多图全部渲染（各 slide 内 img lazy），轨道只位移：切换无闪白、无网络延迟。
 * - touch 用 ref + addEventListener(passive:false)：React 合成 onTouchMove 挂在 root 上是
 *   passive 的，preventDefault 无效；横向意图成立（|dx|>|dy|+4）才接管，页面纵向滚动不受干扰。
 * - 松手后手动写最终 transform（React 对相同 style 字符串不会重写 DOM，等值 diff 会漏掉
 *   手势期间的手动位移，必须显式落位），transition 交还 class 过渡。
 * - 滑动后 onClickCapture 抑制误触点击；箭头 div role="button"（<a> 内不允许嵌 <button>），
 *   onClick preventDefault + stopPropagation 阻止卡片跳转。
 */

import { useEffect, useRef, useState } from 'react';
import { resolveUrl } from '@/lib/paths';

interface V2CardImageCarouselProps {
  /** 已去重的套图 URL 列表（≥1 张；调用方负责构建与去重） */
  urls: string[];
  alt: string;
}

/** 松手落位阈值：横向位移超过该值判定翻页，否则弹回 */
const SWIPE_THRESHOLD = 40;
/** 首末张越界拖动的橡皮筋衰减系数 */
const EDGE_RESISTANCE = 0.35;

export default function V2CardImageCarousel({ urls, alt }: V2CardImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const count = urls.length;
  const single = count <= 1;
  const boxRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const swipedRef = useRef(false);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  // 移动端横向滑动：跟手拖动 + 松手吸附（首尾不循环，越界橡皮筋）
  useEffect(() => {
    const box = boxRef.current;
    const track = trackRef.current;
    if (!box || !track || single) return;

    let startX = 0;
    let startY = 0;
    let baseIndex = 0;
    let horizontal: boolean | null = null;
    let active = false;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      baseIndex = indexRef.current;
      horizontal = null;
      active = true;
      swipedRef.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!active) return;
      const t = e.touches[0];
      const mx = t.clientX - startX;
      const my = t.clientY - startY;
      if (horizontal === null) {
        if (Math.abs(mx) < 10 && Math.abs(my) < 10) return;
        // 横向位移明显大于纵向才判定为切图手势（留 4px 容差，避免斜滑误判）
        horizontal = Math.abs(mx) > Math.abs(my) + 4;
      }
      if (!horizontal) return;
      e.preventDefault();
      swipedRef.current = true;
      // 首图右拖 / 末图左拖：橡皮筋衰减（配合不循环）
      const atEdge = (baseIndex === 0 && mx > 0) || (baseIndex === count - 1 && mx < 0);
      const eff = atEdge ? mx * EDGE_RESISTANCE : mx;
      track.style.transition = 'none';
      track.style.transform = `translateX(calc(${-baseIndex * 100}% + ${eff}px))`;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!active) return;
      active = false;
      if (horizontal !== true) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      let target = baseIndex;
      if (dx <= -SWIPE_THRESHOLD && baseIndex < count - 1) target = baseIndex + 1;
      else if (dx >= SWIPE_THRESHOLD && baseIndex > 0) target = baseIndex - 1;
      // 交还 class 过渡并显式落位/弹回（等值 diff 会漏掉手动位移，必须显式写）
      track.style.transition = '';
      track.style.transform = `translateX(-${target * 100}%)`;
      setIndex(target);
    };

    box.addEventListener('touchstart', onTouchStart, { passive: true });
    box.addEventListener('touchmove', onTouchMove, { passive: false });
    box.addEventListener('touchend', onTouchEnd, { passive: true });
    box.addEventListener('touchcancel', onTouchEnd, { passive: true });
    return () => {
      box.removeEventListener('touchstart', onTouchStart);
      box.removeEventListener('touchmove', onTouchMove);
      box.removeEventListener('touchend', onTouchEnd);
      box.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [single, count]);

  // 滑动切图后抑制误触点击（防止手势结束触发卡片跳转）
  const onClickCapture = (e: React.SyntheticEvent) => {
    if (swipedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      swipedRef.current = false;
    }
  };

  const prev = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => Math.max(i - 1, 0));
  };
  const next = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => Math.min(i + 1, count - 1));
  };

  // 单图：无轨道无箭头，仅保留 hover 慢放大
  if (single) {
    return (
      <div ref={boxRef} className="relative h-full w-full">
        <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
          <img src={resolveUrl(urls[0])} alt={alt} loading="lazy" className="h-full w-full object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div ref={boxRef} className="relative h-full w-full overflow-hidden" onClickCapture={onClickCapture}>
      {/* hover 慢放大保留（与全站卡片一致）；滑轨 450ms ease-out 滑动 */}
      <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
        <div
          ref={trackRef}
          className="flex h-full w-full transition-[transform] duration-[450ms] [transition-timing-function:cubic-bezier(0.22,0.61,0.36,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {urls.map((u, i) => (
            <div key={u} className="h-full w-full flex-shrink-0">
              <img
                src={resolveUrl(u)}
                alt={i === 0 ? alt : ''}
                aria-hidden={i > 0}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 桌面 hover 淡入；首张无左箭头、末张无右箭头（不循环）。z-10 与 Top Rated 角标同级不重叠 */}
      {index > 0 && (
        <div
          role="button"
          aria-label="Previous image"
          onClick={prev}
          className="absolute left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#333] shadow-sm opacity-0 transition-opacity duration-200 hover:bg-white group-hover:opacity-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </div>
      )}
      {index < count - 1 && (
        <div
          role="button"
          aria-label="Next image"
          onClick={next}
          className="absolute right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#333] shadow-sm opacity-0 transition-opacity duration-200 hover:bg-white group-hover:opacity-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </div>
      )}
    </div>
  );
}
