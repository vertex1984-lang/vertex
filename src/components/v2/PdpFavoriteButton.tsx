'use client';

import { useEffect, useState } from 'react';
import { isFavorite, toggleFavorite } from '@/lib/favorites';
import { maybeTriggerCapture } from '@/lib/wishlist-capture';
import { trackAddToWishlist } from '@/lib/gtag';

/**
 * PDP 收藏按钮（批次 5 设计书任务 3，2026-11-17）：心形 + Save/Saved。
 * - 与 PLP 卡片同一 localStorage key（makimoo-favorites）+ 同一广播事件（makimoo:favorites-updated），
 *   状态全站互通（Header 角标、/favorites/ 页、卡片心形自动同步）
 * - 新增收藏时触发游客捕获判定（maybeTriggerCapture：未登录 ∧ 冷却外 → 弹 WishlistCaptureModal）
 * - S2 款贴在风险逆转行旁（CTA 附近），S1/Coming Soon 款在 NotifyMe 订阅框旁——同一组件两个挂点
 */
export default function PdpFavoriteButton({
  productId,
  title,
  image,
  price,
  category,
}: {
  productId: string;
  title: string;
  image?: string;
  price?: number;
  category?: string;
}) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    const sync = () => setFav(isFavorite(productId));
    sync();
    window.addEventListener('makimoo:favorites-updated', sync);
    return () => window.removeEventListener('makimoo:favorites-updated', sync);
  }, [productId]);

  function handleClick() {
    const nowFav = toggleFavorite(productId);
    if (nowFav) {
      // GA4 add_to_wishlist（与 PLP 卡片同参数口径）
      trackAddToWishlist({
        item_id: productId,
        item_name: title,
        item_category: category || '',
        price: price || 0,
        quantity: 1,
      });
      // 游客捕获判定（内部自判登录态/冷却，条件不满足为空操作）
      maybeTriggerCapture({ productId, title, image });
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={fav}
      className={`inline-flex items-center gap-1.5 h-10 px-4 rounded-full text-xs font-semibold border transition active:scale-[0.98] ${
        fav
          ? 'border-brand bg-brand/5 text-brand'
          : 'border-warm-gray bg-white text-charcoal-light hover:border-brand/50 hover:text-brand'
      }`}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={fav ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {fav ? 'Saved' : 'Save'}
    </button>
  );
}
