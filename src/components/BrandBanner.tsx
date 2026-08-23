'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { resolveUrl } from '@/lib/paths';

/** 数字滚动动画：active 后从 0 涨到 target（easeOutCubic） */
function useCountUp(target: number, active: boolean, startDelay = 0, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const timer = setTimeout(() => {
      const step = (t: number) => {
        if (start === null) start = t;
        const p = Math.min((t - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(target * eased);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, startDelay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [active, target, startDelay, duration]);

  return value;
}

/** 进入视口后延迟淡入上移的子元素 */
function Item({
  visible,
  delay,
  className,
  children,
}: {
  visible: boolean;
  delay: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s ease-out ${delay}ms, transform 0.7s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const STAR_PATH = 'M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z';
const ARROW_PATH = 'M5 12h14M13 6l6 6-6 6';

export default function BrandBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const sold = useCountUp(1, visible, 450); // 1M+
  const reviews = useCountUp(100, visible, 600); // 100K+
  const rating = useCountUp(4.5, visible, 750); // 4.5

  const soldText = sold >= 1 ? '1M+' : `${sold.toFixed(1)}M+`;
  const reviewsText = `${Math.round(reviews)}K+`;
  const ratingText = rating.toFixed(1);

  return (
    <div ref={ref}>
      {/* Brand Banner - Desktop（品牌影响力：销量 / 评价 / 评分 / 品质） */}
      <div className="relative w-full hidden sm:block overflow-hidden" style={{ aspectRatio: '1456 / 574' }}>
        <img
          src={resolveUrl('/images/brand/brand-banner.webp')}
          alt="Makimoo Brand Banner"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-black/5 pointer-events-none" />
        <div className="absolute inset-0 flex items-center">
          <div className="px-10 lg:px-20 max-w-2xl">
            <Item visible={visible} delay={0}>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-0.5 bg-white/70" />
                <p className="text-white/85 text-base font-semibold tracking-widest uppercase">
                  Trusted Worldwide
                </p>
              </div>
            </Item>
            <Item visible={visible} delay={120}>
              <h2 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
                Comfort Loved<br />by Millions
              </h2>
            </Item>
            <Item visible={visible} delay={240}>
              <p className="text-white/85 text-lg leading-relaxed mb-7 max-w-md">
                Premium quality at honest prices — comfort essentials for every home.
              </p>
            </Item>
            <Item visible={visible} delay={360}>
              <div className="flex items-start gap-10 mb-9">
                <div>
                  <p className="text-3xl lg:text-4xl font-extrabold text-white drop-shadow tabular-nums">{soldText}</p>
                  <p className="text-white/75 text-xs mt-1.5 leading-snug">Items sold worldwide<br />every year</p>
                </div>
                <div className="w-px self-stretch bg-white/25" />
                <div>
                  <p className="text-3xl lg:text-4xl font-extrabold text-white drop-shadow tabular-nums">{reviewsText}</p>
                  <p className="text-white/75 text-xs mt-1.5 leading-snug">Customer reviews<br />received</p>
                </div>
                <div className="w-px self-stretch bg-white/25" />
                <div>
                  <p className="text-3xl lg:text-4xl font-extrabold text-white drop-shadow inline-flex items-center gap-1.5 tabular-nums">
                    {ratingText}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#F5B942" stroke="none"><path d={STAR_PATH} /></svg>
                  </p>
                  <p className="text-white/75 text-xs mt-1.5 leading-snug">Average rating<br />out of 5 stars</p>
                </div>
              </div>
            </Item>
            <Item visible={visible} delay={520}>
              <a
                href={resolveUrl('/categories')}
                className="group/btn inline-flex items-center gap-2.5 px-10 py-4 rounded-full text-lg font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-xl"
                style={{ backgroundColor: '#8B5A2B' }}
              >
                Explore Our Collections
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover/btn:translate-x-1"
                >
                  <path d={ARROW_PATH} />
                </svg>
              </a>
            </Item>
          </div>
        </div>
      </div>

      {/* Brand Banner - Mobile（竖版 3:4 底图，文字底部排布） */}
      <div className="relative w-full sm:hidden overflow-hidden mt-[50px]" style={{ aspectRatio: '3 / 4' }}>
        <img
          src={resolveUrl('/images/brand/brand-banner-mobile.webp')}
          alt="Makimoo Brand Banner"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/5 pointer-events-none" />
        <div className="absolute inset-0 flex items-end">
          <div className="px-6 pb-9 w-full">
            <Item visible={visible} delay={0}>
              <p className="text-white/85 text-xs font-semibold tracking-widest uppercase mb-2">
                Trusted Worldwide
              </p>
            </Item>
            <Item visible={visible} delay={120}>
              <h2 className="text-4xl font-extrabold text-white leading-tight mb-3 drop-shadow-md">
                Comfort Loved by Millions
              </h2>
            </Item>
            <Item visible={visible} delay={240}>
              <p className="text-white/85 text-sm leading-relaxed mb-5 max-w-xs">
                Premium quality at honest prices — comfort essentials for every home.
              </p>
            </Item>
            <Item visible={visible} delay={360}>
              <div className="flex items-start gap-5 mb-6">
                <div>
                  <p className="text-3xl font-extrabold text-white drop-shadow tabular-nums">{soldText}</p>
                  <p className="text-white/75 text-[11px] mt-1 leading-snug">Items sold<br />per year</p>
                </div>
                <div className="w-px self-stretch bg-white/25" />
                <div>
                  <p className="text-3xl font-extrabold text-white drop-shadow tabular-nums">{reviewsText}</p>
                  <p className="text-white/75 text-[11px] mt-1 leading-snug">Customer<br />reviews</p>
                </div>
                <div className="w-px self-stretch bg-white/25" />
                <div>
                  <p className="text-3xl font-extrabold text-white drop-shadow inline-flex items-center gap-1 tabular-nums">
                    {ratingText}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#F5B942" stroke="none"><path d={STAR_PATH} /></svg>
                  </p>
                  <p className="text-white/75 text-[11px] mt-1 leading-snug">Avg. rating<br />of 5 stars</p>
                </div>
              </div>
            </Item>
            <Item visible={visible} delay={520}>
              <a
                href={resolveUrl('/categories')}
                className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: '#8B5A2B' }}
              >
                Explore Our Collections
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover/btn:translate-x-1"
                >
                  <path d={ARROW_PATH} />
                </svg>
              </a>
            </Item>
          </div>
        </div>
      </div>
    </div>
  );
}
