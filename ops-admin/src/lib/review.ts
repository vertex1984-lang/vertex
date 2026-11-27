/** 买家评价条目（批次 3 评价闭环；前台提交 pending → admin 审核 → 发布只含 approved 到 vertex reviews.json） */

export interface ReviewRecord {
  id: string;
  /** 站内 handle（vertex PDP 匹配键；提交时原样上报） */
  handle: string;
  /** 商品标题冗余（审核列表展示用） */
  productTitle?: string;
  /** 昵称（可空 = 前台渲染为 Anonymous） */
  author?: string;
  title?: string;
  text: string;
  /** 1-5 */
  rating: number;
  /** 返券标记：仅记录不发放（真实发放等闸门 A Admin API，TODO） */
  couponFlag?: boolean;
  /** 提交时已登录的买家邮箱（2026-11-21 T2：approve 时据此发评价券；缺省 = 匿名提交不发券） */
  customerEmail?: string;
  at: string;
  status: 'pending' | 'approved' | 'rejected';
  moderatedAt?: string;
}
