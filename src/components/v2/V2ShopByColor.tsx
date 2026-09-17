'use client';

import { useEffect, useRef, useState } from 'react';
import Reveal from '@/components/Reveal';
import V2ProductCard, { V2CardProduct } from '@/components/v2/V2ProductCard';
import { v2url } from '@/lib/v2paths';
import type { ColorOption } from '@/data/home-sections';

interface V2ShopByColorProps {
  // 服务端已选好（src/data/home-sections.ts）：有 ≥1 款在售产品的色系 + 每色系权重前 10 的精简卡片
  colors: ColorOption[];
  productsByColor: Record<string, V2CardProduct[]>;
}

/**
 * V2 首页 Shop by Color 区（替换原 Best Sellers 横条）
 * 顶部可横滑色板行（圆圈色块 + 名称，选中态描边），下方展示该色系在售产品（最多 10 款），
 * 底部 SHOP {COLOR} 按钮跳 /featured-products/color/{key}/ 色系聚合页。
 * 产品条滑动方式同 Shop by Category：触摸滑动 + 鼠标拖拽，无翻页箭头。
 * 数据由 server 端选好传入（只含在售产品，来源 product-tags.json / 规则现算），组件本身不 import 目录数据。
 */
export default function V2ShopByColor({ colors, productsByColor }: V2ShopByColorProps) {
  const [activeColor, setActiveColor] = useState<string>(colors[0]?.key ?? '');

  const products = productsByColor[activeColor] ?? [];
  const activeRule = colors.find((c) => c.key === activeColor);

  // 产品横滑轨道：触摸滑动 + 鼠标拖拽（同 Shop by Category，无翻页箭头）
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ startX: 0, scrollLeft: 0, dragging: false, moved: false, captured: false });
  const [dragging, setDragging] = useState(false);

  // pointer capture 推迟到拖动超阈值才启用：pointerdown 就 capture 会把 click 重定向到轨道，吞掉卡片跳转
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const track = trackRef.current;
    if (!track) return;
    e.preventDefault();
    dragState.current = { startX: e.clientX, scrollLeft: track.scrollLeft, dragging: true, moved: false, captured: false };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const state = dragState.current;
    const track = trackRef.current;
    if (!state.dragging || !track) return;
    const delta = e.clientX - state.startX;
    if (Math.abs(delta) > 5) {
      state.moved = true;
      // 真正开始拖拽后才接管指针：拖出轨道区域也不中断；拖拽时禁用 scroll-snap，避免吸附与拖拽打架造成顿挫
      if (!state.captured) {
        track.setPointerCapture(e.pointerId);
        state.captured = true;
      }
    }
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

  // 色板行右侧"还有更多"箭头：可继续右滑时显示，滚到底自动隐藏
  const swatchRef = useRef<HTMLDivElement>(null);
  const [moreRight, setMoreRight] = useState(false);
  useEffect(() => {
    const el = swatchRef.current;
    if (!el) return;
    const check = () => setMoreRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    check();
    el.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      el.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [colors.length]);

  if (colors.length === 0) return null;

  return (
    <section className="bg-white pt-16 lg:pt-24 pb-16 lg:pb-24">
      <Reveal>
        <div className="px-6 lg:px-10">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-charcoal mb-8 lg:mb-10">
            Shop by Color
          </h2>

          {/* 色板行：可横滑，选中色描边；右侧渐隐 + 箭头提示还有更多（滚到底隐藏）。
              p-1 -m-1：给选中态的 ring 描边留 4px 空间，防止被滚动容器裁掉 */}
          <div className="relative mb-10 lg:mb-12">
            <div
              ref={swatchRef}
              className="flex gap-6 lg:gap-8 overflow-x-auto p-1 -m-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {colors.map((rule) => {
                const active = rule.key === activeColor;
                return (
                  <button
                    key={rule.key}
                    onClick={() => setActiveColor(rule.key)}
                    aria-pressed={active}
                    className="flex flex-col items-center gap-2.5 flex-shrink-0 group"
                  >
                    <span
                      className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full border transition ${
                        active
                          ? 'ring-2 ring-offset-2 ring-charcoal border-warm-gray'
                          : 'border-warm-gray group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-warm-gray'
                      }`}
                      style={{ backgroundColor: rule.hex }}
                    />
                    <span
                      className={`text-xs lg:text-sm transition ${
                        active
                          ? 'font-bold text-charcoal underline underline-offset-4'
                          : 'text-charcoal-light group-hover:text-charcoal'
                      }`}
                    >
                      {rule.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {moreRight && (
              <>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent" />
                <button
                  onClick={() =>
                    swatchRef.current?.scrollBy({ left: 200, behavior: 'smooth' })
                  }
                  aria-label="More colors"
                  className="absolute right-0 top-1/2 -translate-y-1/2 -mt-1 w-9 h-9 rounded-full bg-white border border-warm-gray shadow-md flex items-center justify-center text-charcoal transition hover:bg-charcoal hover:text-cream hover:border-charcoal"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 产品区：单行可横滑（触摸滑动 + 鼠标拖拽，同 Shop by Category，无箭头），最多 10 款。
            左缘缝隙用外层 padding 实现：padding 放在滚动容器上会被 scroll-snap 视为可滚动内容，加载时首卡自动吸附回 x=0，缝隙被吃掉 */}
        <div className="pl-6 lg:pl-10">
          <div
            ref={trackRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onClickCapture={onClickCapture}
            className={`flex gap-5 lg:gap-6 overflow-x-auto pb-2 pr-6 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
              dragging ? 'cursor-grabbing snap-none' : 'snap-x snap-mandatory cursor-grab'
            }`}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[56vw] sm:w-[42vw] lg:w-[min(25vw,440px)] flex-shrink-0 snap-start"
              >
                <V2ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* SHOP {COLOR} 按钮 → 色系聚合页（与 Shop by Category 按钮同款） */}
        {activeRule && (
          <div className="mt-10 lg:mt-12 text-center">
            <a
              href={v2url(`/featured-products/color/${activeRule.key}/`)}
              className="inline-block px-7 py-3 rounded-full border-2 border-brand text-brand text-xs lg:px-9 lg:py-3.5 lg:text-sm font-semibold tracking-wide uppercase transition hover:bg-brand hover:text-cream"
            >
              Shop {activeRule.label}
            </a>
          </div>
        )}
      </Reveal>
    </section>
  );
}
