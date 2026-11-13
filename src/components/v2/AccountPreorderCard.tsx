'use client';

import { v2url } from '@/lib/v2paths';
import { MILESTONE_KEYS, MILESTONE_LABELS, type MilestoneKey, type TrackedOrder } from '@/lib/track';

/**
 * 预售进度卡·紧凑版（批次 3 任务 4）：账号概览展示当前客户名下的预售订单进度。
 * 数据 = lib/track.ts 的 emailHash 匹配 /data/order-status.json（无邮箱明文）。
 * 复用追踪页六段口径：显示当前阶段（最后一个已到达段）+ 到货窗口 + 查看详情链。
 */
export default function AccountPreorderCard({ order }: { order: TrackedOrder }) {
  const reached = order.milestones.filter((m) => m.at);
  const currentKey = (reached[reached.length - 1]?.key ?? 'ordered') as MilestoneKey;
  const currentIdx = MILESTONE_KEYS.indexOf(currentKey);
  const pct = ((currentIdx + 1) / MILESTONE_KEYS.length) * 100;

  return (
    <div className="rounded-2xl border border-brand/40 bg-white p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-charcoal">
          Pre-order <span className="text-charcoal-light font-normal">#{order.orderNo}</span>
        </p>
        <a
          href={v2url(`/orders/track/?order=${encodeURIComponent(order.orderNo)}`)}
          className="text-xs font-semibold text-brand hover:underline underline-offset-2"
        >
          View full timeline →
        </a>
      </div>
      {/* 进度条：六段线性 */}
      <div className="mt-2.5">
        <div className="h-1.5 rounded-full bg-warm-gray overflow-hidden">
          <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <p className="text-xs font-semibold text-brand">{MILESTONE_LABELS[currentKey]}</p>
          <p className="text-[11px] text-charcoal-light">{reached.length}/6 steps</p>
        </div>
      </div>
      {/* 到货窗口（承诺 35 天口径，配置驱动）+ 下一阶段预告 */}
      <p className="mt-2 text-xs text-charcoal">
        <span className="font-semibold">{order.promiseLabel}</span>
      </p>
      {currentIdx < MILESTONE_KEYS.length - 1 && (
        <p className="mt-0.5 text-[11px] text-charcoal-light">
          Next: {MILESTONE_LABELS[MILESTONE_KEYS[currentIdx + 1]]}
        </p>
      )}
    </div>
  );
}
