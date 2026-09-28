/**
 * 支付方式信任行（PDP buy box 用，两版详情页共用）。
 * 图标为官方全彩品牌 SVG 原图（public/icons/pay/，Wikimedia Commons / simple-icons 来源），
 * 展示"支持的支付方式"属标准指示性使用；芯片容器与站点 token 一致。
 * 放置于 Add to Cart 下方：付费落地用户最关心的"能不能安全付款"一眼可答。
 */

import { resolveUrl } from '@/lib/paths';

const PAY_METHODS = [
  { key: 'visa', alt: 'Visa' },
  { key: 'mastercard', alt: 'Mastercard' },
  { key: 'amex', alt: 'American Express' },
];

const CHIP_CLS =
  'h-8 px-2.5 rounded-md border border-warm-gray bg-white flex items-center justify-center';

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
      {PAY_METHODS.map((m) => (
        <span key={m.key} className={CHIP_CLS}>
          <img
            src={resolveUrl(`/icons/pay/${m.key}.svg`)}
            alt={m.alt}
            title={m.alt}
            className="h-[21px] w-auto"
            draggable={false}
          />
        </span>
      ))}
    </div>
  );
}
