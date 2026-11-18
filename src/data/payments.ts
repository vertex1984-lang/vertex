/**
 * 支付方式 config（批次 5 T2 支付前端，2026-11-17 设计书任务 1）：
 * 结账由 Shopify 托管；此处只列 Shopify checkout 标准支持集（事实口径）。
 * 运营/领导侧增删通道或换正式品牌素材时**只改本文件**，组件零改动。
 * 诚实原则：微文案不写 "SSL secured / Secure checkout" 等直至领导复核。
 */
export interface PayMethod {
  id: string;
  label: string;
}

export const PAY_METHODS: PayMethod[] = [
  { id: 'visa', label: 'Visa' },
  { id: 'mastercard', label: 'Mastercard' },
  { id: 'amex', label: 'Amex' },
  // PayPal / Apple Pay / Google Pay 暂不支持（2026-11-18 运营定：现阶段仅主流信用卡）——
  // 通道开通后取消下行注释即可，组件零改动（诚实口径：站内宣传的支付方式必须真实可用）
  // { id: 'paypal', label: 'PayPal' },
  // { id: 'apple-pay', label: 'Apple Pay' },
  // { id: 'google-pay', label: 'Google Pay' },
];

export const PAY_NOTE = 'Checkout powered by Shopify';
