/**
 * PDP 购买区信任徽章行（两版 PDP 共用）。
 * 2026-09-29 用户定：购买区只留最核心的两条（免邮门槛 + 30 天退货）——
 * 年销背书 / Secure checkout / 卡组织图标一度并入本组件，实测购买区信息仍过密，已全部移除；
 * 更多信任元素改由购买区下方的滚动信任条（marquee）承担。
 * 全是真实可兑现信息，无虚构数据。服务端组件，无交互。
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
];

export default function PdpTrustBadges({ className = '' }: { className?: string }) {
  return (
    /* 两列网格保证恰好一行两枚（窄屏设备实测 flex-wrap 会散成两行） */
    <div className={`grid grid-cols-2 gap-x-3 ${className}`}>
      {BADGES.map((b) => (
        <span
          key={b.label}
          className="inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap text-charcoal-light"
        >
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
