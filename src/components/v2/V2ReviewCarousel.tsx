'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ReviewItem {
  author: string;
  rating: number;
  body: string;
  /** 被评价产品的精简标题 */
  product: string;
  /** 产品实拍图（构建期由 page.tsx 从目录解析） */
  image: string;
  /** 产品详情页链接 */
  href: string;
}

const INTERVAL = 6000;
const FADE_MS = 250;

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex text-[#FFB800]" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24"
          fill={i <= rating ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth={i <= rating ? 0 : 1.5}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/* 首页 Review 区（2026-09 重构 v2）：左右分屏大卡轮播——左侧产品实拍图，右侧引文；
   移动端上图下文。自动轮播（悬停暂停）+ 圆点指示；桌面端另有左右箭头。 */
export default function V2ReviewCarousel({ items }: { items: ReviewItem[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadingRef = useRef(false);
  const indexRef = useRef(index);
  indexRef.current = index;

  const goTo = useCallback((next: number) => {
    if (fadingRef.current || items.length === 0) return;
    fadingRef.current = true;
    setVisible(false);
    setTimeout(() => {
      setIndex(((next % items.length) + items.length) % items.length);
      setVisible(true);
      fadingRef.current = false;
    }, FADE_MS);
  }, [items.length]);

  const startAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => goTo(indexRef.current + 1), INTERVAL);
  }, [goTo]);

  useEffect(() => {
    startAuto();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startAuto]);

  const manualGo = (next: number) => {
    goTo(next);
    startAuto(); // 手动切换后重置自动轮播计时
  };

  if (items.length === 0) return null;
  const review = items[index];

  // Review JSON-LD（hardcode 占位评价，随真实数据一并替换）
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Makimoo Home Comfort Essentials',
    brand: { '@type': 'Brand', name: 'Makimoo' },
    review: items.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.body,
    })),
  };

  return (
    <section className="py-14 lg:py-24 px-3 lg:px-10 border-t border-[#E8E2DA]/70">
      {/* SEO：评论结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        className="relative max-w-5xl mx-auto"
        onMouseEnter={() => { if (timerRef.current) clearInterval(timerRef.current); }}
        onMouseLeave={startAuto}
      >
        <p className="text-center text-xs lg:text-sm font-semibold tracking-[0.3em] uppercase text-brand mb-8 lg:mb-12">
          Loved by Homes Everywhere
        </p>

        {/* 分屏大卡：左图右文；移动端上图下文 */}
        <div
          className={`bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-sm transition-opacity ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDuration: `${FADE_MS}ms` }}
          aria-live="polite"
        >
          <div className="grid lg:grid-cols-2">
            <a href={review.href} className="block relative aspect-[4/3] lg:aspect-auto lg:min-h-[380px] overflow-hidden group">
              <img
                src={review.image}
                alt={review.product}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </a>
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
              <Stars rating={review.rating} />
              <blockquote className="mt-4 font-serif text-lg sm:text-xl lg:text-2xl leading-relaxed text-charcoal">
                &ldquo;{review.body}&rdquo;
              </blockquote>
              <p className="mt-5 text-xs font-semibold tracking-[0.2em] uppercase text-charcoal-light">
                {review.author}
              </p>
              <a
                href={review.href}
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline underline-offset-4 w-fit"
              >
                {review.product}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* 左右箭头：桌面端显示在大卡两侧 */}
        <button
          onClick={() => manualGo(index - 1)}
          aria-label="Previous review"
          className="hidden lg:flex absolute -left-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#D8D2C8] items-center justify-center text-[#999] hover:text-brand hover:border-brand transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={() => manualGo(index + 1)}
          aria-label="Next review"
          className="hidden lg:flex absolute -right-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#D8D2C8] items-center justify-center text-[#999] hover:text-brand hover:border-brand transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>

        {/* 圆点指示 */}
        <div className="mt-7 flex justify-center gap-2.5">
          {items.map((r, i) => (
            <button
              key={r.author}
              onClick={() => manualGo(i)}
              aria-label={`Go to review ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-brand' : 'w-1.5 bg-[#D8D2C8] hover:bg-[#B8B0A4]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
