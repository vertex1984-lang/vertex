/**
 * PDP 购买区信任徽章行（2026-09-28 付费落地信任增强 A，两版 PDP 共用）：
 * 放在 Add to Cart 与 TrustPayRow 之间，把决策点最缺的三条真实承诺补齐——
 * 免邮门槛 / 30 天退货免运费 / 平台在售年销体量（安全支付由 TrustPayRow 卡组织图标承担，不重复）。
 * 全是真实可兑现信息，无虚构数据。服务端组件，无交互。
 * 2026-09-28 去重：购买区下方原堆了徽章行+支付行+两条配送行+四徽章区+首访卡五层重复信息，
 * 全部收敛为本组件 + TrustPayRow + EstimatedDelivery 单行；年销徽章并入主流零售平台背书（首访卡随之删除）。
 */

const BADGES = [
  {
    label: 'Free shipping over $49',
    icon: (
      <>
        <path d="M14 17h-9V5h9v12Z" />
        <path d="M14 9h4l3 3v5h-3" />
        <circle cx="8" cy="17.5" r="1.8" />
        <circle cx="17.5" cy="17.5" r="1.8" />
      </>
    ),
  },
  {
    label: '30-day free returns',
    icon: (
      <>
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
      </>
    ),
  },
  {
    label: '500K+ sold a year on major retail platforms',
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <polyline points="8.5 12 11 14.5 15.5 10" />
      </>
    ),
  },
];

export default function PdpTrustBadges({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-x-5 gap-y-2 ${className}`}>
      {BADGES.map((b) => (
        <span key={b.label} className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-light">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="text-brand flex-shrink-0"
          >
            {b.icon}
          </svg>
          {b.label}
        </span>
      ))}
    </div>
  );
}
