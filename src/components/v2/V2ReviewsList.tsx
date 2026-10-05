'use client';

import { useEffect, useState } from 'react';
import type { ProductReview } from '@/data/product-reviews';

/** 预览条数：超过则折叠，"Show more reviews" 展开（2026-10-04 用户定：预览 3 条，手机端横滑约可见 1.7 张） */
const COLLAPSED_COUNT = 3;

/** 预览置顶（2026-10-05 用户定）：带图且星级 >3 的评价在折叠预览中置顶（保持数据序、不设上限）；
 *  展开态保持原始数据顺序（方案 A）；无图家族不受影响。 */
function pinnedPreview(rs: ProductReview[]): ProductReview[] {
  const has = rs.filter((r) => r.image && r.rating > 3);
  if (has.length === 0) return rs;
  return [...has, ...rs.filter((r) => !has.includes(r))];
}

function Star({ fill }: { fill: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth={fill ? 0 : 1.5}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

function ReviewCard({ review }: { review: ProductReview }) {
  const [zoom, setZoom] = useState(false);
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoom(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [zoom]);
  return (
    <div className="rounded-xl border border-warm-gray bg-white p-5 lg:p-6">
      <div className="flex items-center gap-1 text-brand">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} fill={n <= review.rating} />
        ))}
      </div>
      {review.title && <p className="mt-2.5 text-sm font-bold text-charcoal">{review.title}</p>}
      <p className="mt-1.5 text-sm text-charcoal-light leading-relaxed">{review.text}</p>
      {review.image && (
        <button
          type="button"
          onClick={() => setZoom(true)}
          aria-label="View customer photo"
          className="mt-3 block cursor-zoom-in"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={review.image}
            alt={review.imageAlt || 'Customer photo'}
            width={72}
            height={72}
            loading="lazy"
            className="h-[72px] w-[72px] rounded-lg object-cover border border-warm-gray"
          />
        </button>
      )}
      <p className="mt-3 text-xs text-[#999]">
        <span className="font-semibold text-charcoal">{review.author}</span>
        {review.date && (
          <>
            <span className="mx-1.5">·</span>
            {review.date}
          </>
        )}
      </p>
      {zoom && review.image && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Customer photo"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6 cursor-zoom-out"
          onClick={() => setZoom(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={review.image}
            alt={review.imageAlt || 'Customer photo'}
            className="max-h-[85vh] max-w-full rounded-xl shadow-2xl"
          />
          <button
            type="button"
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl text-charcoal leading-none hover:bg-white"
            onClick={() => setZoom(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * 评价卡列表（client）：折叠态 = 前 3 条（手机端横滑轮播露右缘提示可滑，lg+ 纵向堆叠），
 * "Show more reviews" 展开后转全量纵向列表（两端一致）。
 */
export default function V2ReviewsList({ reviews }: { reviews: ProductReview[] }) {
  const [expanded, setExpanded] = useState(false);
  const collapsed = reviews.length > COLLAPSED_COUNT;
  const carousel = collapsed && !expanded;
  const visible = carousel ? pinnedPreview(reviews).slice(0, COLLAPSED_COUNT) : reviews;
  return (
    <>
      <div
        className={
          carousel
            ? 'flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:overflow-x-visible lg:pb-0'
            : 'flex flex-col gap-4'
        }
      >
        {visible.map((r, i) => (
          <div
            key={i}
            className={carousel ? 'w-[58vw] max-w-[300px] flex-shrink-0 snap-start lg:w-auto lg:max-w-none' : undefined}
          >
            <ReviewCard review={r} />
          </div>
        ))}
      </div>
      {carousel && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="px-6 py-3 rounded-full border border-brand text-brand text-sm font-semibold hover:bg-brand/5 transition"
          >
            Show more reviews
          </button>
        </div>
      )}
      {!carousel && collapsed && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="px-6 py-3 rounded-full border border-brand text-brand text-sm font-semibold hover:bg-brand/5 transition"
          >
            Show less
          </button>
        </div>
      )}
    </>
  );
}
