'use client';

/**
 * V2CardImageCarousel — 搜索层 Recommended Products 卡片套图轮播（2026-10-21 任务3，参照 Zara Home）。
 *
 * 桌面：hover 图区两侧淡入圆形小箭头，点击切换套图（首张无左箭头 / 末张无右箭头，不循环）；
 * 移动：横向手势滑动切换（首尾同理不循环）。单图产品不渲染箭头、无手势（无圆点，2026-10-21 用户定）。
 *
 * 实现：多图全部叠放、按 index 切 opacity——切换无闪白、无网络延迟；全 lazy 加载不变。
 * touch 用 ref + addEventListener(passive:false)：React 合成 onTouchMove 挂在 root 上是
 * passive 的，preventDefault 无效；这里横向意图成立才 preventDefault，页面纵向滚动不受干扰。
 * 滑动后抑制误触点击（onClickCapture），避免切图手势触发卡片跳转。
 * 箭头用 div role="button"（<a> 内不允许嵌套 <button>），onClick 里 preventDefault +
 * stopPropagation 阻止卡片跳转。
 */

import { useEffect, useRef, useState } from 'react';
import { resolveUrl } from '@/lib/paths';

interface V2CardImageCarouselProps {
  /** 已去重的套图 URL 列表（≥1 张；调用方负责构建与去重） */
  urls: string[];
  alt: string;
}

export default function V2CardImageCarousel({ urls, alt }: V2CardImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const count = urls.length;
  const single = count <= 1;
  const boxRef = useRef<HTMLDivElement>(null);
  const swipedRef = useRef(false);

  // 移动端横向滑动切图（首尾不循环；横向意图成立才接管，纵向滚动不受影响）
  useEffect(() => {
    const box = boxRef.current;
    if (!box || single) return;
    let startX = 0;
    let startY = 0;
    let horizontal: boolean | null = null;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      horizontal = null;
      swipedRef.current = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (horizontal === null) {
        const t = e.touches[0];
        const dx = t.clientX - startX;
        const dy = t.clientY - startY;
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
        // 横向位移明显大于纵向才判定为切图手势（留 4px 容差，避免斜滑误判）
        horizontal = Math.abs(dx) > Math.abs(dy) + 4;
      }
      if (horizontal) {
        e.preventDefault();
        swipedRef.current = true;
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (horizontal !== true) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      if (dx <= -40) setIndex((i) => Math.min(i + 1, count - 1));
      else if (dx >= 40) setIndex((i) => Math.max(i - 1, 0));
    };

    box.addEventListener('touchstart', onTouchStart, { passive: true });
    box.addEventListener('touchmove', onTouchMove, { passive: false });
    box.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      box.removeEventListener('touchstart', onTouchStart);
      box.removeEventListener('touchmove', onTouchMove);
      box.removeEventListener('touchend', onTouchEnd);
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

  return (
    <div ref={boxRef} className="relative h-full w-full" onClickCapture={onClickCapture}>
      {/* hover 慢放大保留（与全站卡片一致）；多图叠放按 index 切 opacity */}
      <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
        {urls.map((u, i) => (
          <img
            key={u}
            src={resolveUrl(u)}
            alt={i === 0 ? alt : ''}
            aria-hidden={i > 0}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* 桌面 hover 淡入；首张无左箭头、末张无右箭头（不循环）。z-10 与 Top Rated 角标同级不重叠 */}
      {!single && index > 0 && (
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
      {!single && index < count - 1 && (
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
