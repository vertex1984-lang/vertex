import type { Metadata } from 'next';
import V2Lookbook from '@/components/v2/V2Lookbook';
import { lookbookHotspotsByImage, mergedLookbookItems } from '@/data/lookbook-hotspots';

export const metadata: Metadata = {
  title: 'The Lookbook – Every Room We Love',
  description:
    'Every styled corner in one place — filter by room or category and tap any look to shop it.',
};

/**
 * /scenes/ —— 全量种草图汇总页（2026-10-30 重构，用户定）：
 * 与 /inspiration 的 lookbook 区共用同一数据源（src/data/lookbook.ts），
 * 这里放全量 + 房间/类目筛选；/inspiration 只留前 12 张预览。
 * 2026-11-05 用户定：85 个 Shop the Look 场景图（全部有热区）合并进卡片列表——
 * 场景卡 addedAt 新→旧在前、原 LOOKBOOK 去重接后，场景卡跳 /scenes/[slug]/ 详情页；
 * 卡上产品圆点直跳 PDP（mergedLookbookItems / lookbookHotspotsByImage，
 * 见 src/data/lookbook-hotspots.ts；原 Shop the Look 热区瀑布流以新形态回归）。
 * 2026-10-30 用户定：桌面端瀑布流占满屏宽（图更大、杂志感），移动端图片全出血。
 */
export default function ScenesIndexPage() {
  return (
    <div className="pb-16 pt-6 lg:pt-10">
      <header className="mb-5 px-4 lg:px-6">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand">
          The Lookbook
        </p>
        <h1 className="mt-2 text-2xl lg:text-4xl font-extrabold tracking-tight text-charcoal">
          Rooms we love
        </h1>
        <p className="mt-2 max-w-md text-sm text-charcoal/60">
          Every styled corner in one place — filter by room or category, then tap a
          look to shop it.
        </p>
      </header>
      <div className="lg:px-6">
        {/* 卡片列表（场景图合并）与热区映射在服务端现算（依赖产品库），以 prop 传入客户端组件 */}
        <V2Lookbook items={mergedLookbookItems()} hotspotsByImage={lookbookHotspotsByImage()} />
      </div>
    </div>
  );
}
