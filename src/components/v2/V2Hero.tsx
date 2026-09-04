'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

// 全端统一 3 张轮播（ken-burns + 5s 自动切换 + 触摸滑动 + dots 指示器）
const slides = [
  { image: '/images/brand/hero-bg.webp', alt: 'Makimoo cushions styled in a warm living room' },
  { image: '/images/brand/hero-bg-2.webp', alt: 'Soft Makimoo pillows on a cozy bed' },
  { image: '/images/brand/hero-bg-3.webp', alt: 'Makimoo home textiles in natural light' },
];

const SWIPE_THRESHOLD = 50;

export default function V2Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrent(((index % slides.length) + slides.length) % slides.length);
  }, []);

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  // 预加载其余背景图，避免切换时白屏
  useEffect(() => {
    slides.forEach((slide, index) => {
      if (index === 0) return;
      const img = new Image();
      img.src = resolveUrl(slide.image);
    });
  }, []);

  // Auto-rotate every 5 seconds（hover 或用户偏好减少动态时暂停）
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext, paused]);

  return (
    <section className="relative h-[92vh] min-h-[560px] overflow-hidden">
      {/* Background carousel（ken-burns 缓慢缩放 + 淡切） */}
      <div
        className="absolute inset-0 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const delta = e.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(delta) < SWIPE_THRESHOLD) return;
          if (delta < 0) goNext();
          else goPrev();
        }}
      >
        {/* 全端统一：3 张淡切轮播 */}
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: index === current ? 1 : 0 }}
          >
            <div
              className="absolute inset-0 animate-ken-burns bg-cover bg-center"
              style={{ backgroundImage: `url(${resolveUrl(slide.image)})` }}
              role="img"
              aria-label={slide.alt}
            />
          </div>
        ))}

        {/* 渐变暗罩：底部深、顶部浅，保证下方 cream 文案可读 */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/25 to-charcoal/10" />

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className="w-11 h-11 flex items-center justify-center"
              aria-label={`Go to slide ${index + 1}`}
            >
              <span
                className={`block h-2.5 rounded-full transition-all duration-300 ${
                  index === current ? 'w-6 bg-cream' : 'w-2.5 bg-cream/50 hover:bg-cream/80'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Text content：垂直居中偏下（为 fixed Header 留出顶部视觉空间） */}
      <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center pt-[12vh]">
        <p
          className="text-xs lg:text-sm font-semibold tracking-[0.3em] uppercase text-cream/80 mb-5 animate-fade-in-up"
          style={{ animationDelay: '0ms' }}
        >
          Makimoo Home
        </p>
        <h1
          className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-cream max-w-3xl mb-6 animate-fade-in-up"
          style={{ animationDelay: '150ms' }}
        >
          Comfort, Woven Into Every Day
        </h1>
        <p
          className="text-base lg:text-lg text-cream/85 max-w-xl mb-9 animate-fade-in-up"
          style={{ animationDelay: '300ms' }}
        >
          Cushions, pillows and soft essentials crafted from honest materials —
          made for slow mornings, long evenings and everything in between.
        </p>
        <div className="animate-fade-in-up" style={{ animationDelay: '450ms' }}>
          <a
            href={v2url('/products/')}
            className="inline-block px-9 py-4 rounded-full bg-cream text-brand text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-brand hover:text-cream hover:shadow-xl"
          >
            Shop the Collection
          </a>
        </div>
      </div>
    </section>
  );
}
