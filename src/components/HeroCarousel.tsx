'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { resolveUrl } from '@/lib/paths';

const slides = [
  {
    image: '/images/brand/hero-bg-3.webp',
    alt: 'Makimoo Hero Background 1',
    headline: 'Made for Better Living.',
    sub: 'Free shipping and 30-day worry-free returns on every single order.',
  },
  {
    image: '/images/brand/hero-bg-2.webp',
    alt: 'Makimoo Hero Background 2',
    headline: 'Sink Into Something Softer.',
    sub: 'Premium fabrics and plush 3D filling that stay comfortable season after season.',
  },
  {
    image: '/images/brand/hero-bg.webp',
    alt: 'Makimoo Hero Background 3',
    headline: 'Comfort, Beautifully Simple.',
    sub: 'Weather-resistant cushions & pillows crafted for every corner of your home.',
  },
];

const SWIPE_THRESHOLD = 50;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((index: number) => {
    if (isTransitioning || index === current) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [current, isTransitioning]);

  const goNext = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  // 预加载其余背景图，避免切换时白屏；首屏图加 preload 提示
  useEffect(() => {
    slides.forEach((slide, index) => {
      if (index === 0) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = resolveUrl(slide.image);
        document.head.appendChild(link);
        return;
      }
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
    <>
      {/* Background images（ken-burns 缓慢缩放） */}
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
        {slides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{
              opacity: index === current ? 1 : 0,
            }}
          >
            <div
              className="absolute inset-0 animate-ken-burns"
              style={{
                backgroundImage: `url(${resolveUrl(slide.image)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
        ))}

        {/* Left/Right arrow buttons（移动端隐藏，避免遮挡文案；滑动切换+圆点已足够） */}
        <button
          onClick={goPrev}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/25 hover:bg-white/50 backdrop-blur-sm hidden sm:flex items-center justify-center transition-all duration-300"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goNext}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/25 hover:bg-white/50 backdrop-blur-sm hidden sm:flex items-center justify-center transition-all duration-300"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot indicators（移动端贴底部，避开 CTA 按钮；触控目标 44px） */}
        <div className="absolute bottom-5 lg:bottom-[64px] left-1/2 -translate-x-1/2 z-20 flex">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className="w-11 h-11 flex items-center justify-center"
              aria-label={`Go to slide ${index + 1}`}
            >
              <span
                className={`block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === current
                    ? 'bg-white scale-110'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            </button>
          ))}
        </div>

        {/* 向下滚动提示箭头（纯 CSS 动画，无 JS；移动端隐藏减少干扰） */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 animate-bounce hidden lg:block" aria-hidden="true">
          <svg className="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* 渐变暗罩：左深右浅，突出文案区 */}
      <div
        className="absolute inset-0 z-[5]"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 55%, rgba(0,0,0,0.08) 100%)' }}
      />

      {/* Text content - switches with slide（逐行 stagger 淡入上移） */}
      <div className="relative z-10 max-w-2xl mx-auto lg:mt-[15px]" aria-live="polite">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="transition-opacity duration-700 ease-in-out"
            style={{
              opacity: index === current ? 1 : 0,
              position: index === current ? 'relative' : 'absolute',
              pointerEvents: index === current ? 'auto' : 'none',
              inset: index === current ? undefined : 0,
            }}
          >
            <h4
              className="hidden sm:block text-sm lg:text-base font-semibold tracking-widest uppercase text-white/80 mb-4 animate-fade-in-up"
              style={{ animationDelay: '0ms' }}
            >
              Makimoo Home
            </h4>
            <h1
              className="text-3xl lg:text-5xl font-extrabold text-white mb-6 sm:mb-4 lg:mb-5 leading-tight drop-shadow-md animate-fade-in-up"
              style={{ animationDelay: '150ms' }}
            >
              {slide.headline}
            </h1>
            <p
              className="hidden sm:block text-sm sm:text-base lg:text-lg text-white/85 font-medium mb-6 lg:mb-8 max-w-xs sm:max-w-xl mx-auto text-center animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              {slide.sub}
            </p>
            <a
              href={resolveUrl('/categories')}
              className="inline-block px-8 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up"
              style={{ backgroundColor: '#8B5A2B', border: '2px solid #8B5A2B', animationDelay: '450ms' }}
            >
              Shop the Collection
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
