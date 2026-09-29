'use client';

import { useEffect, useState } from 'react';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/**
 * PDP 品牌故事 + 面料指南板块（2026-09-29 用户定，参照 Parachute "Thoughtfully designed" 模块）：
 * 每个板块约占一个手机屏幕——上方大图 + 下方文字区（短横线轮播指示器）。
 * 品牌故事自动轮转两版（6 秒一切，手动点指示器后重置计时）：
 *   ① 品牌公信力：年销体量 / Amazon 评价 / 行业年限
 *   ② 布料、工艺与做工
 * 面料指南为静态板块（仅 bedding PDP 渲染），与品牌故事同一视觉语言。
 */

const ROTATE_MS = 6000;

const STORY_SLIDES = [
  {
    image: '/images/about/about-story.webp',
    imageAlt: 'A cozy Makimoo living room styled with soft home textiles',
    eyebrow: 'Our Story',
    title: 'A Trusted Name in Home Comfort',
    body: 'Millions of customers worldwide choose Makimoo — with 500K+ items sold every year, tens of thousands of reviews on Amazon, and over 10 years of experience in home textiles.',
  },
  {
    image: '/images/fabric-guide/fabric-linen.webp',
    imageAlt: 'Close-up of Makimoo washed linen fabric',
    eyebrow: 'Materials & Craft',
    title: 'Honest Fabrics, Careful Workmanship',
    body: 'From long-staple cotton to washed linen, we pick fabrics for how they feel and how they last. Every weave, stitch and finish is checked piece by piece before it leaves our workshop.',
  },
];

export default function PdpStoryBlocks({ showFabricGuide = false }: { showFabricGuide?: boolean }) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % STORY_SLIDES.length), ROTATE_MS);
    return () => clearInterval(timer);
  }, [slide]); // slide 变化（含手动点指示器）后重置计时

  const current = STORY_SLIDES[slide];

  return (
    <>
      {/* ── 品牌故事（自动轮转）── */}
      <section className="bg-cream">
        {/* 图片区：两帧叠放交叉淡入 */}
        <div className="relative aspect-[4/3] lg:aspect-[21/9] overflow-hidden">
          {STORY_SLIDES.map((s, i) => (
            <img
              key={s.image}
              src={resolveUrl(s.image)}
              alt={i === slide ? s.imageAlt : ''}
              aria-hidden={i !== slide}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                i === slide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
        {/* 文字区：key 驱动淡入动画；指示器为短横线（Parachute 同款） */}
        <div className="px-6 lg:px-10 py-8 lg:py-12">
          <div className="max-w-2xl mx-auto lg:text-center">
            <div className="flex gap-2 mb-5 lg:justify-center">
              {STORY_SLIDES.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() => setSlide(i)}
                  aria-label={`Story slide ${i + 1}: ${s.eyebrow}`}
                  className={`h-1 w-7 rounded-full transition-colors ${i === slide ? 'bg-brand' : 'bg-warm-gray'}`}
                />
              ))}
            </div>
            <div key={slide} className="animate-fade-in-up">
              <p className="text-[11px] lg:text-xs font-semibold tracking-[0.25em] uppercase text-brand mb-2.5">
                {current.eyebrow}
              </p>
              <h2 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-charcoal leading-tight mb-3 lg:mb-4">
                {current.title}
              </h2>
              <p className="text-sm lg:text-base text-charcoal-light leading-relaxed">
                {current.body}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 面料指南（仅 bedding；静态，与品牌故事同一版式）── */}
      {showFabricGuide && (
        <section className="bg-off-white">
          <div className="relative aspect-[4/3] lg:aspect-[21/9] overflow-hidden">
            <img
              src={resolveUrl('/images/fabric-guide/fabric-banner.webp')}
              alt="Makimoo fabric close-ups: linen, washed cotton and more"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="px-6 lg:px-10 py-8 lg:py-12">
            <div className="max-w-2xl mx-auto lg:text-center">
              <p className="text-[11px] lg:text-xs font-semibold tracking-[0.25em] uppercase text-brand mb-2.5">
                Makimoo Fabrics
              </p>
              <h2 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-charcoal leading-tight mb-3 lg:mb-4">
                What Fabric Is Best for You?
              </h2>
              <p className="text-sm lg:text-base text-charcoal-light leading-relaxed mb-5">
                Linen, washed cotton, satin and more — compare the feel, breathability and care of every fabric we use, and find the one made for your sleep.
              </p>
              <a href={v2url('/fabric-guide/')} className="inline-flex items-center gap-2 text-sm font-semibold text-brand group">
                <span className="border-b border-brand/40 pb-0.5 transition-colors group-hover:border-brand">
                  Explore the Fabric Guide
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
