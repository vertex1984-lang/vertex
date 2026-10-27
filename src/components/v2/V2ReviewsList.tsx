'use client';

import { useEffect, useRef, useState } from 'react';
import type { ProductReview } from '@/data/product-reviews';

/** 预览条数（2026-10-13 用户定 v3.5.3）：折叠触发阈值仍为 3（>3 即折叠）；
 * 预览实际渲染 4 条——桌面两列网格 2×2 满排；第 4 条加 hidden lg:block，手机端横滑仍只见 3 条 */
const COLLAPSED_COUNT = 3;
const PREVIEW_COUNT = 4;
/** 全量直出阈值（2026-10-27 W8 领导定"评价数量=页面展示的评价条数"）：列表 ≤10 条时不再折叠
 * 预览，全部卡片直接渲染（顶部 Based on N 与下方卡片数严格相等）；折叠仅留给 >10 条的 B0 家族 */
const SHOW_ALL_MAX = 10;

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
  const mixed = [...pinned, ...out];
  // 低星卡保底（2026-10-13 用户定 v3.5.3）：≤2★ 卡不得进入折叠预览——少数派槽位均匀
  // 散布含前部槽位，2★ 卡可能落进前 4（第 4 卡仅 lg 以下隐藏、桌面仍可见）→ 逐张移到
  // index 4 之后（折叠预览只渲染前 4：桌面 4 条 2×2 / 手机 3 条 + 第 4 卡隐藏）；
  // 展开列表不受影响，分布条低星段不变。
  for (let guard = 0; guard < 8; guard++) {
    const idx = mixed.findIndex((r) => r.rating <= 2);
    if (idx < 0 || idx >= 4) break;
    const [lowCard] = mixed.splice(idx, 1);
    mixed.splice(4, 0, lowCard);
  }
  return mixed;
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
 * 评价卡列表（client）：折叠态 = 前 3 条（手机端横滑轮播露右缘提示可滑，lg+ 两列网格纵向排列），
 * "Show more reviews" 展开后转全量列表（两端一致，lg+ 同为两列网格）。
 * 2026-10-12 用户定：评价区与页面主区域同宽，lg+ 卡片两列排布以填满宽度。
 * 2026-10-10 领导定（悬浮胶囊 B 案）：展开态收起控制 = 视口底部居中悬浮胶囊
 * （移动端抬高避开吸底加购条），滚到列表末尾时自动隐藏（末尾保留常规 Show less 按钮收尾）；
 * 点击胶囊收起列表并平滑滚回评价区顶部。中途不再插按钮（2026-10-10 复审：夹在卡片中间怪）。
 * 2026-10-22 用户反馈修复：胶囊只在评价列表位于视口内时出现——原来只观察列表末尾，
 * 用户滚动离开评价区后（末尾在视口上方不相交）胶囊仍一直跟随；现同时观察列表容器，
 * 容器滚出视口即隐藏。
 */
export default function V2ReviewsList({ reviews }: { reviews: ProductReview[] }) {
  const [expanded, setExpanded] = useState(false);
  const tailRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [tailVisible, setTailVisible] = useState(false);
  const [listInView, setListInView] = useState(false);
  // W8（2026-10-27 领导定）：≤SHOW_ALL_MAX 条全量直出（数量=展示条数）；>阈值才折叠预览
  const collapsed = reviews.length > SHOW_ALL_MAX;
  const carousel = collapsed && !expanded;
  const mixed = starMix(reviews);
  // 预览渲染 4 条（桌面 2×2；第 4 条 lg 以下隐藏——手机端恒见 3 条）
  const visible = carousel ? mixed.slice(0, PREVIEW_COUNT) : mixed;
  const showLess = !carousel && collapsed;
  // 胶囊可见 = 展开态 + 评价列表在视口内 + 列表末尾未进入视口（2026-10-22 修复跟随问题）
  const pillVisible = showLess && listInView && !tailVisible;

  useEffect(() => {
    if (!showLess || typeof IntersectionObserver === 'undefined') {
      setTailVisible(false);
      setListInView(false);
      return;
    }
    const tail = tailRef.current;
    const list = listRef.current;
    const ioTail = tail ? new IntersectionObserver(([e]) => setTailVisible(e.isIntersecting)) : null;
    const ioList = list ? new IntersectionObserver(([e]) => setListInView(e.isIntersecting)) : null;
    if (tail && ioTail) ioTail.observe(tail);
    if (list && ioList) ioList.observe(list);
    if (!tail || !list) {
      // 元素缺失时回退旧行为：常显（交由末尾常规按钮兜底）
      setTailVisible(false);
      setListInView(true);
    }
    return () => {
      ioTail?.disconnect();
      ioList?.disconnect();
    };
  }, [showLess]);

  const collapseAndScroll = () => {
    setExpanded(false);
    document.getElementById('pdp2-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <div
        ref={listRef}
        className={
          carousel
            ? 'flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-2 lg:overflow-x-visible lg:pb-0'
            : 'grid grid-cols-1 gap-4 lg:grid-cols-2'
        }
      >
        {visible.map((r, i) => (
          <div
            key={i}
            className={
              carousel
                ? 'w-[58vw] max-w-[300px] flex-shrink-0 snap-start lg:w-auto lg:max-w-none' +
                  (i === PREVIEW_COUNT - 1 ? ' hidden lg:block' : '')
                : undefined
            }
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
      {showLess && (
        <div ref={tailRef} className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="px-6 py-3 rounded-full border border-brand text-brand text-sm font-semibold hover:bg-brand/5 transition"
          >
            Show less
          </button>
        </div>
      )}
      {showLess && pillVisible && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] lg:bottom-6 z-[1150]">
          <button
            type="button"
            onClick={collapseAndScroll}
            aria-label="Collapse reviews and return to top of section"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white border border-brand text-brand text-sm font-semibold shadow-lg hover:bg-brand/5 transition"
          >
            Show less
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
