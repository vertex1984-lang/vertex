/**
 * 首页信任条（2026-09 新增）：紧贴 Hero 下方的一条窄带，只放真实可兑现的信任信息——
 * 文案 2026-09 用户提供："Makimoo — A Trusted Name on Major Retail Platforms ·
 * Over half a million products sold every year — and counting"（基于主流平台真实销售体量）。
 * 不放星级/评价数/媒体 logo（新站无真实数据，虚构属 deceptive marketing）。
 * 版式（2026-09 用户要求加强设计感）：加宽字距的品牌小标 + 细竖线分隔 + 主副文案双色层次，
 * 上下细线收边，浅暖底与公告条区分；移动端竖排居中，副文案短写 "500,000+"（= half a million，
 * 意思不变）+ text-balance，避免长尾词单独折行。服务端组件，无交互。
 * 2026-09-28：四格图标信任卡方案被用户否决（侵入 Hero、移动端过大），恢复本窄带版式，
 * 仅按用户要求整体加大字号（品牌标 xs/sm、主副文案 sm/base、行高微增）。
 */
export default function V2TrustBar() {
  return (
    <section className="bg-[#F5F0E9] border-y border-[#E8E2DA]">
      <div className="max-w-[1400px] mx-auto px-6 py-5 lg:py-6 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-5 text-center">
        <span className="text-xs lg:text-sm font-bold tracking-[0.35em] uppercase text-brand">
          Makimoo
        </span>
        <span aria-hidden="true" className="hidden sm:block w-px h-5 bg-[#D8CCBC]" />
        <p className="text-sm lg:text-base font-semibold text-charcoal text-balance">
          A Trusted Name on Major Retail Platforms
        </p>
        <span aria-hidden="true" className="hidden sm:inline text-[#C9BBA8]">·</span>
        <p className="text-sm lg:text-base text-charcoal-light text-balance">
          500,000+ products sold every year — and counting
        </p>
      </div>
    </section>
  );
}
