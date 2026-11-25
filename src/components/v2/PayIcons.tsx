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
    case 'apple-pay':
      // Apple Pay：苹果标 + Pay 字标（官方形态的简化近似，单色黑；指示性使用）
      return (
        <span className={frame} title={label} aria-hidden="true">
          <svg width="34" height="14" viewBox="0 0 34 14">
            {/* 苹果轮廓（叶 + 果身，单 path 简化形） */}
            <path
              d="M8.6 4.1c.5-.6.8-1.4.7-2.1-.7 0-1.5.5-2 1.1-.4.5-.8 1.3-.7 2.1.8 0 1.5-.5 2-1.1zM10.4 7.5c0-1.6 1.3-2.4 1.4-2.4-.8-1.1-2-.9-2.4-.9-.5-.1-1 .3-1.3.3-.3 0-.7-.3-1.2-.3-1 0-2.1.6-2.7 1.7-.7 1.3-.4 3.3.6 4.6.5.6 1.1 1.4 1.9 1.3.4 0 .7-.3 1.3-.3.6 0 .8.3 1.3.3.8 0 1.4-.9 1.9-1.5.3-.5.5-.9.6-1.2-1.3-.5-1.4-1.5-1.4-1.6z"
              fill="#000000"
            />
            <text x="12.5" y="11" fontFamily="Arial, Helvetica, sans-serif" fontWeight="600" fontSize="10" fill="#000000" letterSpacing="0.2">Pay</text>
          </svg>
        </span>
      );
    case 'google-pay':
      // Google Pay：G 字标（官方四色 G：蓝/绿/黄/红，标准 Google G 路径）+ Pay 字标
      return (
        <span className={frame} title={label} aria-hidden="true">
          <svg width="36" height="14" viewBox="0 0 36 14">
            <g transform="translate(0.4 0.25) scale(0.75)">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.876 2.684-6.615z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
              <path fill="#FBBC04" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
            </g>
            <text x="15" y="11" fontFamily="Arial, Helvetica, sans-serif" fontWeight="600" fontSize="10" fill="#5F6368" letterSpacing="0.2">Pay</text>
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
