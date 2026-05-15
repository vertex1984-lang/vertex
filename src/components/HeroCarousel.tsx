'use client';

import { useState, useEffect, useCallback } from 'react';
import { resolveUrl } from '@/lib/paths';

const slides = [
  {
    image: '/images/brand/hero-bg.webp',
    alt: 'Makimoo Hero Background 1',
    subtitle: 'Outdoor & Indoor Cushions Collection',
    title: 'Simple Life, Better Comfort',
  },
  {
    image: '/images/brand/hero-bg-2.webp',
    alt: 'Makimoo Hero Background 2',
    subtitle: 'Pillow & Cushions Collection',
    title: 'Simple Life, Better Comfort',
  },
  {
    image: '/images/brand/hero-bg-3.webp',
    alt: 'Makimoo Hero Background 3',
    subtitle: 'Pillow & Cushions Collection',
    title: 'Simple Life, Better Comfort',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  return (
    <>
      {/* Background images */}
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{
              backgroundImage: `url(${resolveUrl(slide.image)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: index === current ? 1 : 0,
            }}
          />
        ))}

        {/* Left/Right arrow buttons */}
        <button
          onClick={goPrev}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/30 hover:bg-white/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B5A2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goNext}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/30 hover:bg-white/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B5A2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === current
                  ? 'bg-[#8B5A2B] scale-110'
                  : 'bg-white/60 hover:bg-white/90'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 z-[5]"
        style={{ backgroundColor: 'rgba(248, 245, 240, 0.7)' }}
      />

      {/* Text content - switches with slide */}
      <div className="relative z-10 max-w-2xl mx-auto lg:mt-[15px]">
        {/* Render all text layers, fade in/out */}
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
            <h4 className="text-lg font-semibold tracking-widest uppercase text-[#333] mb-3">
              Makimoo Home
            </h4>
            <h1 className="text-3xl lg:text-5xl font-extrabold text-[#8B5A2B] mb-6 leading-tight">
              {slide.subtitle}
            </h1>
            <p className="text-base lg:text-lg text-[#333] font-medium mb-8 max-w-xl mx-auto text-center">
              {slide.title}
            </p>
            <a
              href={resolveUrl('/products')}
              className="px-7 py-3 rounded-full text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              style={{ backgroundColor: '#8B5A2B', border: '2px solid #8B5A2B' }}
            >
              Shop the Collection
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
