'use client';

import { useEffect, useRef, useState } from 'react';
import type { ProductReview } from '@/data/product-reviews';
import StarDisplay from './StarDisplay';

/**
 * 评级气泡（2026-10-07 领导定，对齐亚马逊）：购买区只留一行评分，桌面悬停 / 手机点按
 * 展开分布卡（5 行条 + global ratings + See customer reviews 锚链接）。
 * 合规：气泡内用 "N global ratings" 措辞；"Based on N customer reviews" 唯一出处仍在底部评价区。
 * 交互：mouseenter 打开 / mouseleave 收起（桌面）；click 仅打开（避免 hover 后误关）；
 *       手机点外部或 Esc 收起。触发行点击不收起，供触屏二次确认。
 */
export default function V2RatingPopover({
  rating,
  reviewCount,
  reviews,
  buckets: bucketsProp,
}: {
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  /** 分布数据（2026-10-10 去统一化：传入变体评价计划的分布；缺省回退卡片实算） */
  buckets?: { star: number; pct: number }[];
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  const buckets =
    bucketsProp ??
    [5, 4, 3, 2, 1].map((star) => ({
      star,
      pct: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
    }));

  return (
    <div
      ref={wrapRef}
      className="relative w-fit"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-label={`Rated ${rating.toFixed(1)} out of 5 stars. Show rating distribution.`}
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <StarDisplay rating={rating} size={18} />
        <span className="text-sm text-charcoal-light">
          {rating.toFixed(1)} ({reviewCount.toLocaleString()} reviews)
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-charcoal-light transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Rating distribution"
          className="absolute left-0 top-full mt-2 z-[1100] w-[300px] max-w-[calc(100vw-3rem)] rounded-xl border border-warm-gray bg-white shadow-xl p-5"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-charcoal">{rating.toFixed(1)}</span>
            <StarDisplay rating={rating} size={16} />
          </div>
          <p className="mt-1 text-xs text-charcoal-light">
            {reviewCount.toLocaleString()} global ratings
          </p>
          <div className="mt-3 space-y-1">
            {buckets.map(({ star, pct }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="w-6 text-right text-[11px] text-charcoal-light">{star}★</span>
                <div className="flex-1 h-1.5 rounded-full bg-warm-gray overflow-hidden">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-[11px] text-charcoal-light">{Math.round(pct)}%</span>
              </div>
            ))}
          </div>
          <a
            href="#pdp2-reviews"
            onClick={() => setOpen(false)}
            className="mt-4 flex items-center justify-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            See customer reviews
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
