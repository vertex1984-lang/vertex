'use client';

import { useRef, useState } from 'react';
import Reveal from '@/components/Reveal';
import V2ProductCard from '@/components/v2/V2ProductCard';
import type { MakimooProduct } from '@/data/products';

interface V2NewArrivalsProps {
  products: MakimooProduct[];
}

/**
 * V2 首页 New Arrivals 模块（Parachute 分类导览版式）
 * 左侧固定介绍栏（600px：eyebrow + 标题 + 两段介绍文案，文字限宽 380px、多出宽度留白），
 * 右侧横向滚动产品卡。卡片复用 V2ProductCard（与 Featured 条同款同尺寸：方图 + 分类 eyebrow + 产品名 + 价格）。
 * 桌面端左右翻页箭头 + 鼠标按住拖拽（拖拽超 5px 抑制误触点击），移动端原生触摸滑动。
 */
export default function V2NewArrivals({ products }: V2NewArrivalsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ startX: 0, scrollLeft: 0, dragging: false, moved: false });
  const [dragging, setDragging] = useState(false);

  if (products.length === 0) return null;

  const scrollByPage = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

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
    <section className="bg-cream py-16 lg:py-24">
      <Reveal>
        <div className="lg:flex lg:items-stretch">
          {/* 左侧介绍栏：移动端在上，桌面端固定宽左栏（宽度 600px，文字保持原缩进断行，多出宽度留白） */}
          <div className="px-6 lg:pl-28 lg:pr-6 mb-8 lg:mb-0 lg:w-[600px] lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center">
            <div className="lg:max-w-[380px]">
              <p className="text-sm lg:text-base font-semibold tracking-[0.25em] uppercase text-brand mb-4">
                Just Landed
              </p>
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-charcoal leading-tight mb-5">
                New Arrivals
              </h2>
              <p className="text-base lg:text-lg text-charcoal-light leading-relaxed mb-5">
                Fresh textures and easy-living essentials, newly added to the collection.
              </p>
              <p className="text-base lg:text-lg text-charcoal-light leading-relaxed">
                Honest materials, thoughtful details — soft cushions, cozy pillows and everyday
                comforts crafted to settle into every corner of your home.
              </p>
            </div>
          </div>

          {/* 右侧横向滚动产品卡（V2ProductCard，与 Featured 同款）：右侧无内距、末卡 bleed 到屏幕边缘 */}
          <div className="relative flex-1 min-w-0 pl-6 lg:pl-4">
            <div
              ref={trackRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerLeave={endDrag}
              onClickCapture={onClickCapture}
              className={`flex gap-5 lg:gap-6 overflow-x-auto snap-x snap-mandatory pb-2 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                dragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="w-[56vw] sm:w-[42vw] lg:w-[min(25vw,440px)] flex-shrink-0 snap-start"
                >
                  <V2ProductCard product={product} badge="New" />
                </div>
              ))}
            </div>

            {/* 桌面翻页箭头（移动端触摸滑动即可） */}
            <button
              onClick={() => scrollByPage(-1)}
              className="hidden lg:flex absolute top-[38%] -translate-y-1/2 left-7 z-10 w-12 h-12 rounded-full bg-white border border-warm-gray shadow-md items-center justify-center text-charcoal transition hover:bg-brand hover:text-cream hover:border-brand"
              aria-label="Scroll new arrivals left"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollByPage(1)}
              className="hidden lg:flex absolute top-[38%] -translate-y-1/2 right-4 z-10 w-12 h-12 rounded-full bg-white border border-warm-gray shadow-md items-center justify-center text-charcoal transition hover:bg-brand hover:text-cream hover:border-brand"
              aria-label="Scroll new arrivals right"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
