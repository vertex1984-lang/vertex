import { PAY_METHODS, PAY_NOTE } from '@/data/payments';

/**
 * 支付方式信任图标条（批次 5 T2 设计书任务 1，2026-11-17；2026-11-18 升级矢量徽章）：
 * 购买区/购物车静态转化信任信号——**内联 SVG 品牌 logo**（零外链依赖，外链挂了变红叉
 * 比没有更伤信任；文字徽章版观感不足已替换）。商家展示"接受的支付方式"属指示性使用，
 * 行业通用做法（Shopify 官方 checkout 同）。config 驱动（payments.ts）——通道增删只改
 * config，新品牌在此组件加对应 SVG 分支（或换正式素材）。
 * 非交互元素：hover 不变色；PAY_NOTE 微文案次级色不抢 CTA 视觉。
 * 挂点：PDP S2 购买区退款行下 / cart 结算按钮下 / MiniCart footer 按钮组下（移动端优先，
 * flex-wrap 保证 375px 不溢出）。
 */

/** 单个品牌徽章（统一 38×24 白底圆角块；Amex 整块蓝底；未知品牌回退文字块） */
function PayBrand({ id, label }: { id: string; label: string }) {
  const frame = 'inline-flex h-6 w-[38px] items-center justify-center rounded border border-warm-gray bg-white select-none overflow-hidden';
  switch (id) {
    case 'visa':
      // Visa 深蓝斜体字标（官方字体的简化近似，指示性使用）
      return (
        <span className={frame} title={label} aria-hidden="true">
          <svg width="30" height="10" viewBox="0 0 30 10">
            <text x="15" y="8.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontStyle="italic" fontWeight="bold" fontSize="9" fill="#1A1F71" letterSpacing="0.4">VISA</text>
          </svg>
        </span>
      );
    case 'mastercard':
      // 红橙双圆（官方几何标志简化；右圆微透明使交叠区自然过渡）
      return (
        <span className={frame} title={label} aria-hidden="true">
          <svg width="30" height="18" viewBox="0 0 30 18">
            <circle cx="11" cy="9" r="8.5" fill="#EB001B" />
            <circle cx="19" cy="9" r="8.5" fill="#F79E1B" fillOpacity="0.9" />
          </svg>
        </span>
      );
    case 'amex':
      // American Express 蓝底白字方块
      return (
        <span className={frame} title={label} aria-hidden="true">
          <svg width="34" height="18" viewBox="0 0 34 18">
            <rect width="34" height="18" rx="2.5" fill="#1F72CD" />
            <text x="17" y="12.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="8" fill="#FFFFFF" letterSpacing="0.6">AMEX</text>
          </svg>
        </span>
      );
    default:
      // 未提供矢量素材的支付方式：回退文字徽章（将来 PayPal 等开通时替换素材或补 SVG 分支）
      return (
        <span className="inline-flex h-6 items-center rounded border border-warm-gray bg-white px-2 text-[10px] font-bold tracking-wide text-charcoal-light select-none" title={label} aria-hidden="true">
          {label}
        </span>
      );
  }
}

export default function PayIcons({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`} aria-label="Accepted payment methods">
      {PAY_METHODS.map((m) => (
        <PayBrand key={m.id} id={m.id} label={m.label} />
      ))}
      <span className="ml-0.5 text-xs text-charcoal-light/80">{PAY_NOTE}</span>
    </div>
  );
}
