'use client';

import { useRef, useState } from 'react';
import Reveal from '@/components/Reveal';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

// V2 分类横滑条：沿用现有 cat 查询参数（与 (classic) 产品页一致）
const CATEGORIES = [
  { name: 'Cushions', image: '/images/collections/cushions.webp', href: '/products/?cat=cushions' },
  { name: 'Pillows', image: '/images/collections/pillows.webp', href: '/products/?cat=pillows' },
  { name: 'Towels', image: '/images/collections/towels.webp', href: '/products/?cat=towels' },
  { name: 'Mats', image: '/images/collections/mats.webp', href: '/products/?cat=mats' },
  { name: 'Holiday', image: '/images/collections/holiday.webp', href: '/products/?cat=holiday' },
  { name: 'Others', image: '/images/collections/others.webp', href: '/products/?cat=others' },
];

export default function V2CategoryGrid() {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ startX: 0, scrollLeft: 0, dragging: false, moved: false });
  const [dragging, setDragging] = useState(false);

  // 鼠标拖拽滚动（移动端原生触摸滑动，无需处理）
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const track = trackRef.current;
    if (!track) return;
    dragState.current = { startX: e.clientX, scrollLeft: track.scrollLeft, dragging: true, moved: false };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const state = dragState.current;
    const track = trackRef.current;
    if (!state.dragging || !track) return;
    const delta = e.clientX - state.startX;
    if (Math.abs(delta) > 5) state.moved = true;
    track.scrollLeft = state.scrollLeft - delta;
  };
  const endDrag = () => {
    dragState.current.dragging = false;
    setDragging(false);
  };
  // 拖拽后抑制误触点击
  const onClickCapture = (e: React.SyntheticEvent) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragState.current.moved = false;
    }
  };

  return (
    <section className="pt-16 lg:pt-24">
      {/* 标题区限宽居中；卡片横滑条全宽 bleed，左缘对齐内容线 */}
      <Reveal>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center mb-10 lg:mb-14">
          <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-3">
            Shop by Category
          </p>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-charcoal mb-4">
            Find Your Comfort
          </h2>
          <p className="text-base text-charcoal-light max-w-xl mx-auto">
            Six curated collections, one goal — a warmer, softer home.
          </p>
        </div>
      </Reveal>
      <Reveal>
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={onClickCapture}
          className={`flex gap-3 lg:gap-4 overflow-x-auto snap-x snap-mandatory pl-6 lg:pl-10 pr-6 pb-2 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            dragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {CATEGORIES.map((cat) => (
            <a
              key={cat.name}
              href={v2url(cat.href)}
              draggable={false}
              className="group relative block flex-shrink-0 snap-start w-[56vw] sm:w-[38vw] lg:w-[min(30vw,480px)] aspect-[4/5] overflow-hidden rounded-lg"
            >
              <img
                src={resolveUrl(cat.image)}
                alt={cat.name}
                loading="lazy"
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* 底部渐变遮罩 + 分类名 */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-cream tracking-wide">{cat.name}</h3>
                <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase text-cream/70 transition-colors group-hover:text-cream">
                  Shop Now
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
