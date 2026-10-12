'use client';

import { useState } from 'react';
import ReviewFormModal from './ReviewFormModal';

/**
 * 评价区入口 CTA：亚马逊式三件套（小标题 + 副文案 + 按钮），在 V2ProductReviews
 * 摘要带内与评分同区展示（2026-10-12 用户定：桌面端在分布条右端，移动端自然堆叠，
 * 不再带顶部分隔线）。
 * 2026-10-10 用户定：点击打开写评价弹层（ReviewFormModal，游客可填）；
 * 提交登录门槛在弹层内占位（登录方案待定后原位接入）。
 */
export default function ReviewCta({ wide = false, productTitle }: { wide?: boolean; productTitle?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`text-center ${wide ? 'lg:text-left' : ''}`}>
      <h3 className="hidden lg:block text-sm font-bold text-charcoal">Review this product</h3>
      <p className="hidden lg:block mt-1 text-xs text-charcoal-light">Share your thoughts with other buyers</p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:mt-3 px-6 py-2.5 rounded-full border border-brand text-brand text-sm font-semibold hover:bg-brand/5 transition"
      >
        Write a Review
      </button>
      <ReviewFormModal open={open} onClose={() => setOpen(false)} productTitle={productTitle} />
    </div>
  );
}
