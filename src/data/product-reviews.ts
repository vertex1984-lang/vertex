/**
 * 产品真实评价（2026-09 新增）：PDP 评价区的数据来源。
 *
 * 填写规范（合规红线，务必遵守）：
 * 1. 只收录**自有产品 Amazon 店铺的真实买家评价**，每个产品精选 3-5 条作为启动；
 * 2. 作者一律脱敏为 "名 + 姓首字母"（如 "Emily R."），不带任何可识别个人信息；
 * 3. 可修正语法、删减冗余，但**不得改写原意、不得提升评分**；保留少量 4 星更可信；
 * 4. 前端统一标注来源 "Verified Amazon Purchase"；
 * 5. 定位是启动数据——接入站内原生评价收集后逐步替换。
 *
 * rating/reviewCount 汇总字段仍在 products.ts 里按产品填（控制星级汇总行与 JSON-LD），
 * 本文件提供评价正文列表；两者都没有时 PDP 不渲染评价区。
 */

export interface ProductReview {
  /** 脱敏后作者名，如 "Emily R." */
  author: string;
  /** 1-5 星（保留原始评分） */
  rating: number;
  /** 评价标题（可选） */
  title?: string;
  /** 评价正文（可轻度编辑，不得改写原意） */
  text: string;
  /** 购买/评价时间，如 "August 2026"（可选） */
  date?: string;
}

/** key = 产品 asin 小写 */
export const PRODUCT_REVIEWS: Record<string, ProductReview[]> = {
  // 示例（填入真实数据前请先删除本示例）：
  // 'linen3-oatmeal-queen': [
  //   { author: 'Emily R.', rating: 5, title: 'Softens beautifully', text: '...', date: 'August 2026' },
  // ],
};

export function getProductReviews(asin: string): ProductReview[] {
  return PRODUCT_REVIEWS[asin.toLowerCase()] || [];
}
