'use client';

import { useRef, type MouseEvent, type PointerEvent, type ReactNode } from 'react';

/**
 * 横向拖拽滚动行（2026-10-20 用户定）：快链/筛选项排在屏宽不足时不再换行，
 * 保持单行可滚动——桌面鼠标按住拖拽，移动端原生横滑；滚动条隐藏。
 *
 * 用法：替换原 `flex flex-wrap` 的 <nav> 容器，className 里把 flex-wrap 改为 flex-nowrap
 * （display 类由调用方保留，组件不强制 flex，兼容 `hidden lg:flex` 这类条件显示）。
 * 拖拽位移超过 5px 视为滚动手势，抑制这一次的点击，避免误触链接。
 * 子元素强制 shrink-0：不换行时保持自然宽度溢出滚动，而不是被压缩换行。
 * 链接子项需禁原生拖拽（onDragStart preventDefault + -webkit-user-drag:none），
 * 否则浏览器拖链接的 dragstart 会触发 pointercancel 打断滚动手势。
 */
export default function V2DragScrollRow({
  className = '',
  ariaLabel,
  children,
}: {
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const drag = useRef({ startX: 0, startScroll: 0, active: false, moved: false });

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return; // 触屏/触控笔走原生横滑
    const el = ref.current;
    if (!el || el.scrollWidth <= el.clientWidth) return; // 未溢出无需拖拽
    drag.current = { startX: e.clientX, startScroll: el.scrollLeft, active: true, moved: false };
    // 注意：不能在这里 setPointerCapture——捕获会把随后的 click 重定向到 nav 本身，
    // 导致普通点击无法触发链接跳转。改为真正开始拖动时才捕获（见 onPointerMove）。
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    const el = ref.current;
    if (!d.active || !el) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) <= 5) return;
    if (!d.moved) {
      try { el.setPointerCapture(e.pointerId); } catch { /* 指针已释放等边界情况 */ }
    }
    d.moved = true;
    el.scrollLeft = d.startScroll - dx;
  };

  const endDrag = () => {
    drag.current.active = false;
    // 拖拽后的那次 click 由 onClickCapture 抑制并复位；若浏览器没派发 click
    // （捕获目标边界情况），用计时器兜底复位，避免吃掉下一次正常点击。
    if (drag.current.moved) {
      setTimeout(() => { drag.current.moved = false; }, 0);
    }
  };

  const onClickCapture = (e: MouseEvent<HTMLElement>) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      className={`overflow-x-auto select-none cursor-grab [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [&>*]:shrink-0 [&_a]:[-webkit-user-drag:none] ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
    </nav>
  );
}
