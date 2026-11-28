'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * V2CarouselRow —— 定宽卡片横向滚动行（2026-11-27 用户定）：
 * 卡片恒定宽度，视口放不下时容器可横滑；桌面端（lg+）且内容溢出时
 * 显示左右悬浮箭头（滚到尽头侧箭头淡出）。移动端维持触摸滑动、不显示箭头。
 * 隐藏原生滚动条 + snap 的工具类由调用方通过 className 传入（与 The Latest 区同模式）。
 */
export default function V2CarouselRow({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setScrollable(el.scrollWidth - el.clientWidth > 8);
      setAtStart(el.scrollLeft <= 4);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, []);

  const nudge = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  // 箭头在有鼠标的设备上任何宽度都显示（2026-11-27 用户反馈：窗口拖到 lg 以下箭头不该消失）；
  // 触屏设备（手机/平板）不显示，维持触摸滑动
  const arrowCls =
    'hidden [@media(hover:hover)_and_(pointer:fine)]:flex absolute top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 border border-warm-gray shadow-md items-center justify-center text-charcoal transition-opacity hover:bg-white disabled:opacity-0 disabled:pointer-events-none';

  return (
    <div className="relative">
      <div ref={ref} className={className}>
        {children}
      </div>
      {scrollable && (
        <>
          <button type="button" onClick={() => nudge(-1)} disabled={atStart} aria-label="Scroll left" className={`${arrowCls} left-3`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button type="button" onClick={() => nudge(1)} disabled={atEnd} aria-label="Scroll right" className={`${arrowCls} right-3`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
