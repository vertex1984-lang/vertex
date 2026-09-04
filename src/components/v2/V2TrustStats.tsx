'use client';

import { useRef, useState } from 'react';
import Reveal from '@/components/Reveal';
import V2ProductCard from '@/components/v2/V2ProductCard';
import { v2url } from '@/lib/v2paths';
import type { MakimooProduct } from '@/data/products';

const STAR_PATH = 'M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z';

const STATS = [
  { value: '1M+', label: 'Items sold worldwide every year' },
  { value: '100K+', label: 'Customer reviews received' },
  { value: '4.5', label: 'Average rating out of 5 stars', star: true },
];

interface V2TrustStatsProps {
  products: MakimooProduct[];
}

/**
 * V2 首页信任数据区块（原 banner 叠加文案的排版版）
 * cream 色带打满屏宽；左侧文字贴左，右侧 5-6 个产品卡横向条（触摸滑动 + 鼠标拖拽）。
 * 移动端上下堆叠：文字在上，产品条在下。
 */
export default function V2TrustStats({ products }: V2TrustStatsProps) {
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
    <section className="bg-off-white py-10 lg:py-16">
      <Reveal>
        <div className="px-6 py-10 sm:px-10 lg:pl-24 lg:pr-0 lg:py-14">
          <div className="lg:flex lg:items-center lg:gap-12">
            {/* 左侧：文字内容贴左 */}
            <div className="text-left lg:w-[34%] lg:flex-shrink-0">
              <p className="text-[11px] lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-3 lg:mb-4">
                Trusted Worldwide
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-charcoal mb-8 lg:mb-12">
                Comfort Loved by Millions
              </h2>
              {/* 数据一排展示（移动端同结构，字号缩小）；从第二项起带分隔线 */}
              <div className="flex items-stretch mb-8 lg:mb-10">
                {STATS.map((stat, i) => (
                  <div
                    key={stat.value}
                    className={i === 0 ? 'pr-4 sm:pr-6 lg:pr-8' : 'px-4 sm:px-6 lg:px-8 border-l border-warm-gray'}
                  >
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal tabular-nums inline-flex items-center gap-1.5">
                      {stat.value}
                      {stat.star && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#F5B942" stroke="none" aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5">
                          <path d={STAR_PATH} />
                        </svg>
                      )}
                    </p>
                    <p className="text-[11px] sm:text-xs text-charcoal-light mt-1.5 max-w-[110px] sm:max-w-[140px] leading-snug">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              <a
                href={v2url('/best-sellers/')}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand tracking-wide hover:underline underline-offset-4"
              >
                Explore Our Best Sellers
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>

            {/* 右侧：产品卡横向条（可拖拽），右端打出屏幕边缘；移动端在文字下方 */}
            {products.length > 0 && (
              <div className="mt-10 lg:mt-0 lg:flex-1 lg:min-w-0">
                <div
                  ref={trackRef}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={endDrag}
                  onPointerLeave={endDrag}
                  onClickCapture={onClickCapture}
                  className={`flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                    dragging ? 'cursor-grabbing' : 'cursor-grab'
                  }`}
                >
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="w-[48vw] sm:w-[36vw] lg:w-[280px] flex-shrink-0 snap-start"
                    >
                      <V2ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
