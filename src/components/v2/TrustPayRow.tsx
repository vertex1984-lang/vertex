/**
 * 支付方式信任行（PDP buy box 用，两版详情页共用）。
 * 单色描边风格与 PDP 信任徽章一致；纯内联 SVG/text 芯片，无外部资源依赖。
 * 放置于 Add to Cart 下方：付费落地用户最关心的"能不能安全付款"一眼可答。
 */

const CHIP_CLS =
  'h-7 px-2.5 rounded-md border border-warm-gray bg-white flex items-center justify-center text-[11px] font-extrabold tracking-tight text-charcoal-light select-none';

export default function TrustPayRow({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center flex-wrap gap-x-2 gap-y-2 ${className}`}>
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-light mr-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        Secure checkout
      </span>
      <span className={CHIP_CLS}>
        <span className="italic">VISA</span>
      </span>
      <span className={CHIP_CLS} aria-label="Mastercard">
        <svg width="26" height="16" viewBox="0 0 26 16" fill="none">
          <circle cx="10" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="16" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
      <span className={CHIP_CLS}>AMEX</span>
      <span className={CHIP_CLS}>
        <span className="italic">PayPal</span>
      </span>
      <span className={CHIP_CLS}>Apple Pay</span>
    </div>
  );
}
