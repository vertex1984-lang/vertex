'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { resolveUrl } from '@/lib/paths';

export interface LightboxImage {
  mainUrl: string;
  thumbUrl: string;
  altText?: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}

/**
 * 全屏图片查看器：
 * - 左右箭头 / 键盘 ← → 切换（循环），Esc 关闭
 * - 单击图片在 1x / 2.5x 间切换缩放，缩放时鼠标移动平移查看
 * - 底部缩略图条（可横向滚动，自动跟随当前图）
 * - 顶部计数 + 关闭按钮；点击空白区域（未缩放时）关闭
 */
export default function ImageLightbox({ images, index, onIndexChange, onClose }: ImageLightboxProps) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const thumbsRef = useRef<HTMLDivElement>(null);
  // 触摸滑动切换（未缩放时）：记录起点
  const touchStartX = useRef<number | null>(null);

  const prev = useCallback(() => {
    setZoomed(false);
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const next = useCallback(() => {
    setZoomed(false);
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  // 键盘导航 + 锁定背景滚动
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [prev, next, onClose]);

  // 缩略图条自动滚动到当前图
  useEffect(() => {
    const el = thumbsRef.current?.children[index] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [index]);

  const current = images[index];
  if (!current) return null;

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!zoomed) {
      // 记录点击位置作为缩放中心
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setOrigin({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    }
    setZoomed(!zoomed);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!zoomed) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setOrigin({
      x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)),
    });
  };

  // 触屏：未缩放时左右滑动切换图片；缩放后单指拖动平移
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!zoomed) return;
    const t = e.touches[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setOrigin({
      x: Math.max(0, Math.min(100, ((t.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((t.clientY - rect.top) / rect.height) * 100)),
    });
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (zoomed || touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 50) {
      if (dx > 0) prev(); else next();
    }
  };

  const arrowCls =
    'absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition backdrop-blur-sm border border-white/20 z-10';

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex flex-col animate-[fadeIn_0.2s_ease-out]"
      onClick={() => { if (!zoomed) onClose(); }}
    >
      {/* 顶栏：计数 + 关闭 */}
      <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <span className="text-white/70 text-sm font-medium tracking-wide">
          {index + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition border border-white/20"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 主图区 */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center px-14 lg:px-20">
        {images.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous image" className={`${arrowCls} left-3 lg:left-6`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next image" className={`${arrowCls} right-3 lg:right-6`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </>
        )}
        <div
          className={`max-w-full max-h-full overflow-hidden rounded-lg ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
          onClick={handleImageClick}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            key={current.mainUrl}
            src={resolveUrl(current.mainUrl)}
            alt={current.altText || ''}
            draggable={false}
            className="max-w-full max-h-[70vh] lg:max-h-[76vh] object-contain select-none transition-transform duration-300"
            style={zoomed ? { transform: 'scale(2.5)', transformOrigin: `${origin.x}% ${origin.y}%` } : undefined}
          />
        </div>
        {/* 缩放提示 */}
        <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/40 text-xs pointer-events-none hidden lg:block">
          {zoomed ? 'Click to zoom out · Move mouse to pan' : 'Click image to zoom'}
        </p>
      </div>

      {/* 缩略图条 */}
      {images.length > 1 && (
        <div className="flex-shrink-0 px-5 py-4" onClick={(e) => e.stopPropagation()}>
          <div ref={thumbsRef} className="flex gap-2.5 justify-start lg:justify-center overflow-x-auto max-w-3xl mx-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => { setZoomed(false); onIndexChange(i); }}
                aria-label={`View image ${i + 1}`}
                className={`w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                  i === index ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img src={resolveUrl(img.thumbUrl)} alt="" loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
