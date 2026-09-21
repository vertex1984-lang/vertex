'use client';

import { useRef, useState } from 'react';

/* 横向滚动条容器：触屏走原生滚动；桌面端额外支持鼠标按住拖拽滚动（窄桌面窗口显示移动端横滑条时用，2026-09 用户定）。
   拖拽距离超过阈值时吞掉随后的 click，避免松手误触卡片链接。 */
export default function DragScroll({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ down: false, startX: 0, startScroll: 0, moved: false });
  const [grabbing, setGrabbing] = useState(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return; // 触屏/触控笔交给原生滚动
    const el = ref.current;
    if (!el) return;
    e.preventDefault(); // 阻止图片原生拖拽与文本选中
    state.current = { down: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
    setGrabbing(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    const el = ref.current;
    if (!s.down || !el) return;
    const dx = e.clientX - s.startX;
    if (Math.abs(dx) > 4) s.moved = true;
    if (s.moved) el.scrollLeft = s.startScroll - dx;
  };

  const endDrag = () => {
    state.current.down = false;
    setGrabbing(false);
  };

  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (state.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      state.current.moved = false;
    }
  };

  return (
    <div
      ref={ref}
      className={`${className} select-none ${grabbing ? 'cursor-grabbing' : 'cursor-grab'}`}
      /* 拖拽时临时关掉 scroll-snap，避免吸附与拖拽互相拉扯（与 V2Recommended 同策略） */
      style={grabbing ? { scrollSnapType: 'none' } : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={onClickCapture}
    >
      {children}
    </div>
  );
}
