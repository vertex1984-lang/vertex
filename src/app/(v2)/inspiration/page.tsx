import type { Metadata } from 'next';
import V2Lookbook from '@/components/v2/V2Lookbook';
import { lookbookHotspotsByImage, mergedLookbookItems } from '@/data/lookbook-hotspots';
import { v2url } from '@/lib/v2paths';

export const metadata: Metadata = {
  title: 'Inspiration – Styled Rooms & Looks',
  description:
    'Real rooms, styled. Browse the lookbook — every look is shoppable.',
};

/**
 * /inspiration —— 灵感中心：
 * 2026-11-02 用户定：Before & After 区块下线（B&A 只在 PDP 展示），
 * 本页只保留 The Lookbook 种草图预览（前 12 张）+ View all → /scenes/
 * （全量筛选瀑布流，与 /scenes/ 共用同一数据源）。
 * 2026-11-05 用户定：数据源改为合并列表（85 个场景图 addedAt 新→旧在前 +
 * 原 LOOKBOOK 去重，见 src/data/lookbook-hotspots.ts），预览前 12 张 = 最新场景卡，
 * 全部带产品热区圆点（直跳 PDP）。
 */
export default function InspirationPage() {
  return (
    <div className="pb-16 pt-6 lg:pt-10">
      {/* ── The Lookbook 预览（前 12 张，全量在 /scenes/；移动端图片全出血）── */}
      <div className="px-0 lg:px-6">
        <div className="mb-5 flex items-end justify-between gap-4 px-4 lg:px-0">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand">
              The Lookbook
            </p>
            <h1 className="mt-2 text-2xl lg:text-4xl font-extrabold tracking-tight text-charcoal">
              Rooms we love
            </h1>
          </div>
          <a
            href={v2url('/scenes/')}
            className="shrink-0 text-sm font-semibold text-brand underline underline-offset-4 transition-colors hover:text-charcoal"
          >
            View all
          </a>
        </div>
        <V2Lookbook preview={12} items={mergedLookbookItems()} hotspotsByImage={lookbookHotspotsByImage()} />
        {/* 底部出口：与标题右侧 View all 同款（2026-10-30 用户定：预览末尾再加一个） */}
        <div className="mt-8 text-center">
          <a
            href={v2url('/scenes/')}
            className="text-sm font-semibold text-brand underline underline-offset-4 transition-colors hover:text-charcoal"
          >
            View all
          </a>
        </div>
      </div>
    </div>
  );
}
