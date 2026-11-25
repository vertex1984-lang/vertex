'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { customerGet, getCustomerToken } from '@/lib/customer';
import { resolveUrl } from '@/lib/paths';

/**
 * 写评价弹层（2026-10-10 用户定；2026-11-12 批次 3 评价闭环接入真实提交）：
 * 星级（必填）+ 标题（可选）+ 内容（必填）+ 昵称（可选，缺省 Anonymous）。
 * 提交 = POST makimoo-admin /api/reviews（x-review-token 共享密钥，同 wishlist 模式）→
 * 状态 pending → admin /reviews 审核通过并发布后上墙；成功帧提示
 * "Thanks — your review will appear after moderation."
 * 晒图（5.2 占位）：上传按钮位 disabled + "Coming soon"（真实上传等对象存储/返券闸门 A）。
 * 形态：桌面居中弹层 / 移动端底部抽屉；ESC + 遮罩点击关闭，关闭即重置。
 */

/** 与 makimoo-admin REVIEW_TOKEN 同值（演示版写死；正式版换环境变量并评审鉴权方案） */
const REVIEW_API = process.env.NEXT_PUBLIC_REVIEWS_API || 'http://localhost:4200/api/reviews';
const REVIEW_TOKEN = process.env.NEXT_PUBLIC_REVIEW_TOKEN || 'makimoo-review-demo-token';

interface ReviewFormModalProps {
  open: boolean;
  onClose: () => void;
  productTitle?: string;
  /** 站内 handle（评价匹配键）；缺省从 PDP 路径解析 */
  handle?: string;
}

function StarButton({
  value,
  filled,
  onRate,
  onHover,
  onLeave,
}: {
  value: number;
  filled: boolean;
  onRate: (v: number) => void;
  onHover: (v: number) => void;
  onLeave: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
      onClick={() => onRate(value)}
      onMouseEnter={() => onHover(value)}
      onMouseLeave={onLeave}
      className="p-0.5"
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.5}
        className={filled ? 'text-brand' : 'text-warm-gray'}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </button>
  );
}

/** 从当前 PDP 路径解析 handle（/products/<handle>/） */
function handleFromPath(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const m = window.location.pathname.match(/\/products\/([^/]+)/);
  return m?.[1];
}

export default function ReviewFormModal({ open, onClose, productTitle, handle }: ReviewFormModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitErr, setSubmitErr] = useState('');
  const [submitted, setSubmitted] = useState(false);
  // 登录身份（2026-11-21 T2 评价送券）：有会话时静默取邮箱随评价提交（approve 后发券）；
  // 未登录显示一行 earning 提示（仅提示不强制，保持匿名 pending 流程不变）
  const [customerEmail, setCustomerEmail] = useState('');
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    if (!open) return;
    const token = getCustomerToken();
    if (!token) return;
    setHasSession(true);
    customerGet(token.accessToken).then((r) => {
      if (r.ok) setCustomerEmail(r.data.email.trim().toLowerCase());
    });
  }, [open]);

  // ESC 关闭 + 背景滚动锁（QuickViewModal 同款）
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // 关闭即重置
  useEffect(() => {
    if (open) return;
    setRating(0);
    setHoverRating(0);
    setTitle('');
    setContent('');
    setAuthor('');
    setTouched(false);
    setBusy(false);
    setSubmitErr('');
    setSubmitted(false);
  }, [open]);

  if (!open) return null;

  const contentValid = content.trim().length > 0 && content.trim().length <= 1000;
  const titleValid = title.trim().length <= 80;
  const ratingValid = rating >= 1 && rating <= 5;
  const canSubmit = ratingValid && contentValid && titleValid;

  const handleSubmit = async () => {
    setTouched(true);
    setSubmitErr('');
    if (!canSubmit || busy) return;
    const resolvedHandle = handle || handleFromPath();
    if (!resolvedHandle) {
      setSubmitErr('Could not determine this product. Please try again from the product page.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(REVIEW_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-review-token': REVIEW_TOKEN },
        body: JSON.stringify({
          handle: resolvedHandle,
          productTitle: productTitle || undefined,
          rating,
          title: title.trim() || undefined,
          text: content.trim(),
          author: author.trim() || undefined,
          // T2 评价送券：仅登录用户携带身份（匿名提交不带 → 不参与发券）
          ...(customerEmail ? { customerEmail } : {}),
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setSubmitErr(j.error || 'Could not submit right now. Please try again.');
        setBusy(false);
        return;
      }
      setSubmitted(true); // 成功帧；1.8s 后自动关闭（重置由 close effect 完成）
      setTimeout(() => onClose(), 1800);
    } catch {
      setSubmitErr('Network error. Please try again.');
      setBusy(false);
    }
  };

  const showRatingError = touched && !ratingValid;
  const showContentError = touched && content.trim().length === 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[1250] bg-black/50 flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Write a review"
    >
      <div
        className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {submitted ? (
          /* 成功帧：待审核提示（任务 2.2 验收口径） */
          <div className="px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF8F0" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-base font-bold text-charcoal">Thanks — your review will appear after moderation.</p>
            <p className="mt-2 text-xs text-charcoal-light">You can close this window now.</p>
            {/* T2：登录身份评价审核通过后自动发券（发放由 admin 开关控制，这里只做预期提示） */}
            {customerEmail && (
              <p className="mt-3 text-xs font-semibold text-brand">
                Signed in — you&apos;ll earn a reward code if this review is approved.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="px-6 pt-5 pb-2 sm:pt-6">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand">Review</p>
              <h3 className="text-lg font-extrabold tracking-tight text-charcoal mt-1">
                {productTitle ? `Review: ${productTitle}` : 'Write a Review'}
              </h3>
              {/* T2 提示（仅提示不强制；匿名评价流程不变） */}
              {!hasSession && (
                <p className="mt-1 text-xs text-charcoal-light">
                  <a
                    href={resolveUrl(`/login/?redirect=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname + window.location.search : '')}`)}
                    className="font-semibold text-brand hover:underline underline-offset-2"
                  >
                    Sign in
                  </a>{' '}
                  before reviewing to earn rewards.
                </p>
              )}
            </div>

            <div className="px-6 pb-6 pt-2 space-y-5">
              {/* 星级 */}
              <div>
                <p className="text-sm font-semibold text-charcoal mb-1.5">Overall rating</p>
                <div className="flex items-center gap-0.5" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((v) => (
                    <StarButton
                      key={v}
                      value={v}
                      filled={v <= (hoverRating || rating)}
                      onRate={setRating}
                      onHover={setHoverRating}
                      onLeave={() => setHoverRating(0)}
                    />
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-xs text-charcoal-light">{rating} / 5</span>
                  )}
                </div>
                {showRatingError && <p className="mt-1 text-xs text-red-600">Please select a rating.</p>}
              </div>

              {/* 标题（可选，批次 3 字段口径：星级+文案必填，其余可选） */}
              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <label htmlFor="review-title" className="text-sm font-semibold text-charcoal">
                    Title <span className="font-normal text-charcoal-light">(optional)</span>
                  </label>
                  <span className="text-xs text-charcoal-light">{title.length}/80</span>
                </div>
                <input
                  id="review-title"
                  type="text"
                  value={title}
                  maxLength={80}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Sum up your experience in a few words"
                  className="w-full rounded-lg border border-warm-gray px-3.5 py-2.5 text-sm text-charcoal placeholder:text-charcoal-light/70 focus:outline-none focus:border-brand"
                />
              </div>

              {/* 内容 */}
              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <label htmlFor="review-content" className="text-sm font-semibold text-charcoal">
                    Your review
                  </label>
                  <span className="text-xs text-charcoal-light">{content.length}/1000</span>
                </div>
                <textarea
                  id="review-content"
                  value={content}
                  maxLength={1000}
                  rows={5}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What did you like or dislike? How did you use it?"
                  className="w-full rounded-lg border border-warm-gray px-3.5 py-2.5 text-sm text-charcoal placeholder:text-charcoal-light/70 focus:outline-none focus:border-brand resize-y"
                />
                {showContentError && <p className="mt-1 text-xs text-red-600">Please write your review.</p>}
              </div>

              {/* 昵称（可选，批次 3 任务 2.2；缺省匿名） */}
              <div>
                <label htmlFor="review-author" className="mb-1.5 block text-sm font-semibold text-charcoal">
                  Display name <span className="font-normal text-charcoal-light">(optional)</span>
                </label>
                <input
                  id="review-author"
                  type="text"
                  value={author}
                  maxLength={40}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Anonymous"
                  className="w-full rounded-lg border border-warm-gray px-3.5 py-2.5 text-sm text-charcoal placeholder:text-charcoal-light/70 focus:outline-none focus:border-brand"
                />
              </div>

              {/* 晒图（5.2 占位）：真实上传等对象存储接入（返券发放=闸门 A） */}
              <div>
                <p className="text-sm font-semibold text-charcoal mb-1.5">
                  Photos <span className="font-normal text-charcoal-light">(optional)</span>
                </p>
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  aria-disabled="true"
                  className="w-full rounded-lg border border-dashed border-warm-gray px-4 py-3 text-xs font-semibold text-charcoal-light cursor-not-allowed opacity-60 flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add photos — Coming soon
                </button>
              </div>

              {/* 提交 */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={busy}
                  className="w-full px-6 py-3 rounded-full bg-brand text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                >
                  {busy ? 'Submitting…' : 'Submit review'}
                </button>
                {submitErr && (
                  <p role="alert" className="mt-2.5 text-xs text-red-600 text-center">{submitErr}</p>
                )}
                {touched && !canSubmit && !submitErr && !busy && (
                  <p className="mt-2.5 text-xs text-red-600 text-center">Please complete the required fields above.</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 text-charcoal hover:bg-white flex items-center justify-center text-2xl leading-none transition shadow-md"
              aria-label="Close review form"
            >
              &times;
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
