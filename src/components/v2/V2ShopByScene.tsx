'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Reveal from '@/components/Reveal';
import V2ProductCard from '@/components/v2/V2ProductCard';
import { v2url } from '@/lib/v2paths';
import type { SceneOption } from '@/data/home-sections';

// 场景胶囊的线条小图标（24 视图框、描边风格，随文字色）
const SCENE_ICONS: Record<string, React.ReactNode> = {
  'living-room': (
    <>
      <path d="M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
      <path d="M3 13a2 2 0 0 1 4 0v1h10v-1a2 2 0 0 1 4 0v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3Z" />
      <path d="M5 20v-1.5M19 20v-1.5" />
    </>
  ),
  bedroom: (
    <>
      <path d="M3 18V7" />
      <path d="M3 13h18v5" />
      <path d="M3 16h18" />
      <path d="M6 13v-1.5a1 1 0 0 1 1-1h2.5a1 1 0 0 1 1 1V13" />
    </>
  ),
  kitchen: (
    <>
      <path d="M4 10h16v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5Z" />
      <path d="M2 10h20" />
      <path d="M9 7V4.5M15 7V4.5" />
    </>
  ),
  bathroom: (
    <>
      <path d="M3 12h18" />
      <path d="M4 12v2a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-2" />
      <path d="M6 12V5a2 2 0 0 1 4 0v1" />
      <path d="M7.5 21 6.5 22M16.5 21l1 1" />
    </>
  ),
  'dining-room': (
    <>
      <path d="M6 3v5a2 2 0 0 0 2 2 2 0 0 0 2-2V3" />
      <path d="M8 10v11" />
      <path d="M16 3c-1.4 2-2 4.3-2 6.5V13h2v8" />
      <path d="M16 3v6.5" />
    </>
  ),
  'garden-lawn': (
    <>
      <circle cx="12" cy="7" r="4" />
      <path d="M12 11v9" />
      <path d="M8.5 20h7" />
    </>
  ),
  entryway: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="1" />
      <circle cx="14.5" cy="12" r="0.9" />
    </>
  ),
  'beach-pool': (
    <>
      <path d="M12 3a8 8 0 0 1 8 8H4a8 8 0 0 1 8-8Z" />
      <path d="M12 11v7a2 2 0 0 0 4 0" />
    </>
  ),
  travel: (
    <>
      <rect x="5" y="8" width="14" height="12" rx="2" />
      <path d="M9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8" />
      <path d="M5 12.5h14" />
    </>
  ),
};

interface V2ShopBySceneProps {
  // 服务端已选好（src/data/home-sections.ts）：≥4 款在售（标题去重后）的场景 + 每场权重前 8 的精简卡片
  scenes: SceneOption[];
}

/**
 * V2 首页 Shop by Scene 区（位于 Shop by Color 下方）
 * 胶囊场景行（图标 + 文字，点击切换 + 可横滑，右缘渐隐箭头提示），
 * 产品区：桌面端与 Shop by Color 同款单行横滑（触摸滑动 + 鼠标拖拽，无箭头），最多 8 款；
 * 移动端 2 列平铺、最多 3 行（6 款），遇奇数款去掉最后 1 款，避免最后一行只落单 1 张卡。
 * 移动端卡片区支持左右滑手势切换上一个/下一个场景（横向位移 >60px 且明显大于纵向才触发，不干扰上下滚动）。
 * 底部 SHOP {SCENE} 按钮跳 /featured-products/scene/{key}/ 场景聚合页。
 * 数据由 server 端选好传入（只含在售产品并按标题去重），组件本身不 import 目录数据。
 */
export default function V2ShopByScene({ scenes }: V2ShopBySceneProps) {
  const [activeScene, setActiveScene] = useState<string>(
    scenes[0]?.key ?? ''
  );
  const activeIndex = scenes.findIndex((s) => s.key === activeScene);
  const active = scenes[activeIndex];

  // 只有用户主动切换（点胶囊/滑手势）时才置位；dev 下 StrictMode 会重复执行 effect，
  // 用"是否交互过"而不是"是否首次执行"做判断，避免首挂载把整页拉下来
  const sceneTouched = useRef(false);
  const selectScene = (key: string) => {
    sceneTouched.current = true;
    setActiveScene(key);
  };

  const switchScene = (step: 1 | -1) => {
    const next = scenes[activeIndex + step];
    if (next) selectScene(next.key);
  };

  // 胶囊行右侧"还有更多"箭头：可继续右滑时显示，滚到底自动隐藏
  const pillRef = useRef<HTMLDivElement>(null);
  const [moreRight, setMoreRight] = useState(false);
  useEffect(() => {
    const el = pillRef.current;
    if (!el) return;
    const check = () => setMoreRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    check();
    el.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      el.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [scenes.length]);

  // 场景切换后，把选中胶囊滚动到可视区中间（手势切换时胶囊行可能看不到选中项）。
  // 仅响应用户主动切换：否则页面刚加载就把整页往下拉到胶囊行（从其它页点 logo 回主页会落在 Shop by Color 处）
  useEffect(() => {
    if (!sceneTouched.current) return;
    pillRef.current
      ?.querySelector('[aria-pressed="true"]')
      ?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [activeScene]);

  // 移动端卡片区左右滑手势切换场景：横向位移 >60px 且 |dx| > 1.5|dy| 才触发，不干扰页面上下滚动。
  // 只挂在移动端平铺容器上：桌面横滑轨道自带触摸滚动，挂外层会让触屏笔记本滑产品轨时误触场景切换并丢失滚动位置
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    swipeStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = swipeStart.current;
    swipeStart.current = null;
    if (!s) return;
    const dx = e.changedTouches[0].clientX - s.x;
    const dy = e.changedTouches[0].clientY - s.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      switchScene(dx < 0 ? 1 : -1);
    }
  };

  // 移动端平铺列表：最多 3 行 × 2 列 = 6 款；奇数款去掉最后 1 款，避免末行单卡
  const mobileProducts = useMemo(() => {
    const list = (active?.products ?? []).slice(0, 6);
    return list.length % 2 === 1 ? list.slice(0, -1) : list;
  }, [active]);

  // 桌面端产品横滑轨道：触摸滑动 + 鼠标拖拽（同 Shop by Category / Shop by Color，无箭头）
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

  if (scenes.length === 0) return null;

  return (
    <section className="bg-off-white pt-8 lg:pt-12 pb-8 lg:pb-24">
      <Reveal>
        <div className="px-3 lg:px-10">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight text-charcoal mb-8 lg:mb-10">
            Shop by Scene
          </h2>

          {/* 场景胶囊行：图标+文字，点击切换 + 可横滑；右缘渐隐 + 箭头提示还有更多（滚到底隐藏） */}
          <div className="relative mb-10 lg:mb-12">
            <div
              ref={pillRef}
              className="flex gap-3 lg:gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {scenes.map(({ key, label }) => {
                const isActive = key === activeScene;
                return (
                  <button
                    key={key}
                    onClick={() => selectScene(key)}
                    aria-pressed={isActive}
                    className={`flex items-center gap-2 flex-shrink-0 px-5 py-2.5 rounded-full border text-sm font-semibold tracking-wide transition ${
                      isActive
                        ? 'bg-charcoal text-cream border-charcoal'
                        : 'bg-white text-charcoal-light border-warm-gray hover:border-charcoal hover:text-charcoal'
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {SCENE_ICONS[key]}
                    </svg>
                    {label}
                  </button>
                );
              })}
            </div>
            {moreRight && (
              <>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-off-white via-off-white/80 to-transparent" />
                <button
                  onClick={() =>
                    pillRef.current?.scrollBy({ left: 200, behavior: 'smooth' })
                  }
                  aria-label="More scenes"
                  className="absolute right-0 top-1/2 -translate-y-1/2 -mt-1 w-9 h-9 rounded-full bg-white border border-warm-gray shadow-md flex items-center justify-center text-charcoal transition hover:bg-charcoal hover:text-cream hover:border-charcoal"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* 产品区：key 重挂载触发淡入过渡。
              桌面端单行横滑（拖拽同 Shop by Color，无箭头）；移动端 2 列平铺最多 3 行 */}
          <div key={activeScene} className="animate-fade-in-up">
            {/* 桌面端横滑条（移动端隐藏）。负 margin + 内 padding 让轨道全宽 bleed 且左缘对齐内容线；
                padding 放在滚动容器上会被 scroll-snap 视为可滚动内容，加载时首卡自动吸附回 x=0，缝隙被吃掉 */}
            <div className="hidden lg:block -mx-10 pl-10">
              <div
                ref={trackRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerLeave={endDrag}
                onClickCapture={onClickCapture}
                className={`flex gap-6 overflow-x-auto pb-2 pr-10 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                  dragging ? 'cursor-grabbing snap-none' : 'snap-x snap-mandatory cursor-grab'
                }`}
              >
                {active?.products.map((product) => (
                  <div
                    key={product.id}
                    className="w-[min(25vw,440px)] flex-shrink-0 snap-start"
                  >
                    <V2ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>

            {/* 移动端平铺：2 列最多 3 行，奇数款已去掉末尾 1 款（桌面端隐藏）。
                gap-2 与分类页移动端一致，卡更宽图更大；左右滑手势切换场景只挂在这个容器上 */}
            <div
              className="lg:hidden grid grid-cols-2 gap-2"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {mobileProducts.map((product) => (
                <V2ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* SHOP {SCENE} 按钮 → 场景聚合页（与 Shop by Category 按钮同款） */}
          {active && (
            <div className="mt-10 lg:mt-12 text-center">
              <a
                href={v2url(`/featured-products/scene/${active.key}/`)}
                className="inline-block px-7 py-3 rounded-full border-2 border-brand text-brand text-xs lg:px-9 lg:py-3.5 lg:text-sm font-semibold tracking-wide uppercase transition hover:bg-brand hover:text-cream"
              >
                Shop {active.label}
              </a>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
