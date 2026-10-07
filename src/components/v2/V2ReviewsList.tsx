'use client';

import { useEffect, useState } from 'react';
import type { ProductReview } from '@/data/product-reviews';

/** 预览条数：超过则折叠，"Show more reviews" 展开（2026-10-04 用户定：预览 3 条，手机端横滑约可见 1.7 张） */
const COLLAPSED_COUNT = 3;

/** 星级穿插展示（2026-10-06 用户定）：预览不要求全 5 星（家族有 4★ 时必入预览前 3），
 *  展开态按亚马逊式"有用票"观感穿插，绝不呈现按评分排序的形态。确定性算法（按家族首作者名
 *  哈希在变体中选型），跨构建稳定；带图且 >3★ 置顶规则保留（2026-10-05 用户定）。
 *  算法：非 5★ 组成少数派序列（首条必为 4★[若有]，其余按变体轮转 4/3），均匀散布进 5★ 之间，
 *  首个少数派槽位固定在 index 1-2（保证进预览）。 */
function starMix(rs: ProductReview[]): ProductReview[] {
  const pinned = rs.filter((r) => r.image && r.rating > 3);
  const rest = rs.filter((r) => !pinned.includes(r));
  if (rest.length <= COLLAPSED_COUNT) return [...pinned, ...rest];
  const seed = (rs[0]?.author || 'x').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const variant = seed % 3;
  const fives = rest.filter((r) => r.rating >= 5);
  const fours = rest.filter((r) => r.rating === 4);
  const lows = rest.filter((r) => r.rating <= 3);
  // 少数派序列（'4'/'3' 标记）：首条 4★，之后按变体决定起始侧交替取用，余量补尾
  const seq: number[] = [];
  let r4 = fours.length, r3 = lows.length;
  if (r4 > 0) { seq.push(4); r4--; }
  let side = variant % 2 === 0 ? 3 : 4;
  while (r4 > 0 || r3 > 0) {
    if (side === 4 && r4 > 0) { seq.push(4); r4--; }
    else if (r3 > 0) { seq.push(3); r3--; }
    else { seq.push(4); r4--; }
    side = side === 4 ? 3 : 4;
  }
  // 散布槽位：首槽 1 或 2，其余向尾端等距；碰撞向后走
  const m = seq.length;
  const total = rest.length;
  const slots: number[] = [];
  for (let k = 0; k < m; k++) {
    let p = k === 0 ? 1 + (variant % 2) : Math.round(1 + (variant % 2) + (k * (total - 1 - (variant % 2))) / m);
    if (p >= total) p = total - 1;
    while (slots.includes(p)) p = (p + 1) % total;
    slots.push(p);
  }
  const out: ProductReview[] = [];
  let mi = 0;
  for (let i = 0; i < total; i++) {
    if (mi < m && slots[mi] === i) out.push(seq[mi++] === 4 ? fours.splice(0, 1)[0] : lows.splice(0, 1)[0]);
    else out.push(fives.splice(0, 1)[0]);
  }
  return [...pinned, ...out];
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
  const visible = carousel ? starMix(reviews).slice(0, COLLAPSED_COUNT) : starMix(reviews);
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
