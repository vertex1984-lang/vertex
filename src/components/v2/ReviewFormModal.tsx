'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * 写评价弹层（2026-10-10 用户定）：游客可直接打开填写——星级 + 标题 + 内容 + 附件
 * （图片 jpg/png/webp/gif/avif/heic、视频 mp4/mov/webm；本地 objectURL 预览，≤6 个，
 * 图 ≤10MB、视频 ≤100MB，超限行内红字）。提交需要登录——登录方案待定，当前占位：
 * 校验通过后点击 Submit 显示 "Sign in to submit your review" 提示，不伪装提交。
 * 正式版扩展点：占位处原位接登录方案 → 本地待发队列/后端；附件真实上传等对象存储接入。
 * 形态：桌面居中弹层 / 移动端底部抽屉；ESC + 遮罩点击关闭，关闭即重置（含 revoke objectURL）。
 */
interface ReviewFormModalProps {
  open: boolean;
  onClose: () => void;
  productTitle?: string;
}

interface Attachment {
  id: string;
  file: File;
  url: string;
  kind: 'image' | 'video';
}

const MAX_FILES = 6;
const MAX_IMAGE_MB = 10;
const MAX_VIDEO_MB = 100;
const ACCEPT =
  'image/jpeg,image/png,image/webp,image/gif,image/avif,image/heic,image/heif,video/mp4,video/quicktime,video/webm';

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

export default function ReviewFormModal({ open, onClose, productTitle }: ReviewFormModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [fileError, setFileError] = useState('');
  const [touched, setTouched] = useState(false);
  const [signInNotice, setSignInNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentsRef = useRef<Attachment[]>([]);

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

  // 卸载兜底回收（正常路径由重置/删除即时回收）
  useEffect(() => {
    return () => {
      attachmentsRef.current.forEach((a) => URL.revokeObjectURL(a.url));
    };
  }, []);

  // 关闭即重置并回收 objectURL
  useEffect(() => {
    if (open) return;
    setRating(0);
    setHoverRating(0);
    setTitle('');
    setContent('');
    setAttachments((prev) => {
      prev.forEach((a) => URL.revokeObjectURL(a.url));
      return [];
    });
    setFileError('');
    setTouched(false);
    setSignInNotice(false);
  }, [open]);

  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  if (!open) return null;

  const titleValid = title.trim().length > 0 && title.trim().length <= 80;
  const contentValid = content.trim().length > 0 && content.trim().length <= 1000;
  const ratingValid = rating >= 1 && rating <= 5;
  const canSubmit = ratingValid && titleValid && contentValid;

  const handleFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const errors: string[] = [];
    const next: Attachment[] = [];
    for (const file of Array.from(list)) {
      if (attachments.length + next.length >= MAX_FILES) {
        errors.push(`Up to ${MAX_FILES} files.`);
        break;
      }
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      if (!isImage && !isVideo) {
        errors.push(`${file.name}: unsupported format.`);
        continue;
      }
      const maxMB = isImage ? MAX_IMAGE_MB : MAX_VIDEO_MB;
      if (file.size > maxMB * 1024 * 1024) {
        errors.push(`${file.name}: over ${maxMB}MB.`);
        continue;
      }
      next.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        url: URL.createObjectURL(file),
        kind: isImage ? 'image' : 'video',
      });
    }
    if (errors.length > 0) setFileError(errors.join(' '));
    else setFileError('');
    if (next.length > 0) setAttachments((prev) => [...prev, ...next]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((a) => a.id !== id);
    });
    setFileError('');
  };

  const handleSubmit = () => {
    setTouched(true);
    setSignInNotice(false);
    if (!canSubmit) return;
    // 登录方案待定：占位提示（不伪装提交）。正式版原位接 AuthModal → 本地待发队列。
    setSignInNotice(true);
  };

  const showRatingError = touched && !ratingValid;
  const showTitleError = touched && title.trim().length === 0;
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
        <div className="px-6 pt-5 pb-2 sm:pt-6">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand">Review</p>
          <h3 className="text-lg font-extrabold tracking-tight text-charcoal mt-1">
            {productTitle ? `Review: ${productTitle}` : 'Write a Review'}
          </h3>
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

          {/* 标题 */}
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label htmlFor="review-title" className="text-sm font-semibold text-charcoal">
                Title
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
            {showTitleError && <p className="mt-1 text-xs text-red-600">Please enter a title.</p>}
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

          {/* 附件 */}
          <div>
            <p className="text-sm font-semibold text-charcoal mb-1.5">
              Photos / videos <span className="font-normal text-charcoal-light">(optional)</span>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT}
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              aria-label="Add photos or videos"
            />
            <div className="grid grid-cols-3 gap-2.5">
              {attachments.map((a) => (
                <div key={a.id} className="relative aspect-square rounded-lg border border-warm-gray overflow-hidden bg-off-white">
                  {a.kind === 'image' ? (
                    // heic 等浏览器不支持的格式 onError 兜底为文件卡
                    <img
                      src={a.url}
                      alt={a.file.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <video src={a.url} muted playsInline controls className="w-full h-full object-cover" />
                  )}
                  {a.kind === 'image' && (
                    <span className="absolute bottom-1 left-1 right-1 text-[10px] text-charcoal-light truncate bg-white/80 rounded px-1">
                      {a.file.name}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAttachment(a.id)}
                    aria-label={`Remove ${a.file.name}`}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/95 shadow text-charcoal text-sm leading-none flex items-center justify-center hover:bg-white"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {attachments.length < MAX_FILES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border border-dashed border-warm-gray text-charcoal-light hover:border-brand hover:text-brand transition flex flex-col items-center justify-center gap-1 text-[11px]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add
                </button>
              )}
            </div>
            {fileError && <p className="mt-1.5 text-xs text-red-600">{fileError}</p>}
            <p className="mt-1.5 text-[11px] text-charcoal-light">
              Up to {MAX_FILES} files · images ≤{MAX_IMAGE_MB}MB · videos ≤{MAX_VIDEO_MB}MB (JPG, PNG, WEBP, GIF, HEIC, MP4, MOV, WEBM)
            </p>
          </div>

          {/* 提交 */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full px-6 py-3 rounded-full bg-brand text-white text-sm font-semibold hover:opacity-90 transition"
            >
              Submit review
            </button>
            {signInNotice && (
              <p role="status" className="mt-2.5 text-xs text-charcoal-light text-center">
                Sign in to submit your review — sign-in is coming soon.
              </p>
            )}
            {touched && !canSubmit && !signInNotice && (
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
      </div>
    </div>,
    document.body
  );
}
