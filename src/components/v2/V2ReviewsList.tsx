'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ProductReview } from '@/data/product-reviews';

/**
 * 评价卡列表（client）+ 排序切换 + 翻页（2026-10-27 W9 用户定）：
 * - 排序切换（与 "What Buyers Say" 标题同排，站内 pill 风格）：
 *   Top Reviews = 综合排序（带图 → 星级降序 → 正文长度降序，好评多字带图在前，默认）；
 *   Most Recent = 时间顺序（date "Month YYYY" 降序，最新在前，无日期垫底）。
 *   取代 2026-10-06 用户定的"星级穿插展示（starMix）"与"绝不按评分排序"旧规则。
 * - 翻页（用户定"10 条以上翻页"）：列表 > PAGE_SIZE 时分页展示，每页 10 条，
 *   Prev/页码/Next 居中 pill 控件；≤10 条全量直出（无任何按钮，数量=展示条数 W8 口径）。
 *   切换排序重置回第 1 页；翻页后平滑滚回评价区顶部。
 * - 取代 2026-10-13 的折叠预览（桌面 4/手机 3）机制：分页替代折叠，低星卡随排序自然落位
 *  （综合排序低分在尾页；时间序按真实日期落位）。
 * - ReviewCard（买家秀点击放大）沿用原实现。
 */

const PAGE_SIZE = 10;

type SortMode = 'featured' | 'recent';

const MONTH_INDEX: Record<string, number> = {
  January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
  July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
};

/** "October 2026" → 排序键（年*12+月）；无日期/不可解析垫底（-1） */
function dateKey(r: ProductReview): number {
  if (!r.date) return -1;
  const m = r.date.match(/^([A-Za-z]+) (\d{4})$/);
  if (!m) return -1;
  const mi = MONTH_INDEX[m[1]];
  if (mi === undefined) return -1;
  return Number(m[2]) * 12 + mi;
}

function sortReviews(rs: ProductReview[], mode: SortMode): ProductReview[] {
  const arr = [...rs];
  if (mode === 'featured') {
    arr.sort((a, b) => {
      const ia = a.image ? 1 : 0;
      const ib = b.image ? 1 : 0;
      if (ia !== ib) return ib - ia;
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.text.length - a.text.length;
    });
  } else {
    arr.sort((a, b) => dateKey(b) - dateKey(a));
  }
  return arr;
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

const pillBase = 'rounded-full text-sm font-semibold transition cursor-pointer';
const sortPillCls = (active: boolean) =>
  `${pillBase} px-4 py-2 border ` +
  (active ? 'bg-brand text-white border-brand' : 'border-warm-gray text-charcoal-light hover:border-brand hover:text-brand');

export default function V2ReviewsList({
  reviews,
  eyebrow,
  title,
}: {
  reviews: ProductReview[];
  eyebrow?: string;
  title?: string;
}) {
  const [sort, setSort] = useState<SortMode>('featured');
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => sortReviews(reviews, sort), [reviews, sort]);
  const pageCount = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = pageCount > 1;
  const pageItems = paginated ? sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : sorted;

  const switchSort = (mode: SortMode) => {
    setSort(mode);
    setPage(1);
  };

  const gotoPage = (p: number) => {
    setPage(p);
    document.getElementById('pdp2-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      {(eyebrow || title) && (
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 mb-8">
          <div className="text-center">
            {eyebrow && <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2">{eyebrow}</p>}
            {title && <h2 className="text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal">{title}</h2>}
          </div>
          <div className="flex items-center gap-2" role="group" aria-label="Sort reviews">
            <button
              type="button"
              aria-pressed={sort === 'featured'}
              onClick={() => switchSort('featured')}
              className={sortPillCls(sort === 'featured')}
            >
              Top Reviews
            </button>
            <button
              type="button"
              aria-pressed={sort === 'recent'}
              onClick={() => switchSort('recent')}
              className={sortPillCls(sort === 'recent')}
            >
              Most Recent
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {pageItems.map((r, i) => (
          <ReviewCard key={`${r.author}|${r.text.slice(0, 40)}|${i}`} review={r} />
        ))}
      </div>

      {paginated && (
        <nav aria-label="Review pages" className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => gotoPage(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
            className={`${pillBase} px-5 py-2.5 border border-brand text-brand hover:bg-brand/5 disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            Previous
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((pn) => (
            <button
              key={pn}
              type="button"
              onClick={() => gotoPage(pn)}
              aria-label={`Page ${pn}`}
              aria-current={pn === page ? 'page' : undefined}
              className={
                `${pillBase} h-10 w-10 border ` +
                (pn === page
                  ? ' bg-brand text-white border-brand'
                  : ' border-warm-gray text-charcoal-light hover:border-brand hover:text-brand')
              }
            >
              {pn}
            </button>
          ))}
          <button
            type="button"
            onClick={() => gotoPage(page + 1)}
            disabled={page === pageCount}
            aria-label="Next page"
            className={`${pillBase} px-5 py-2.5 border border-brand text-brand hover:bg-brand/5 disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
