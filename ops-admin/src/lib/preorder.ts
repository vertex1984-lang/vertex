/** 预售配置条目（后台侧；发布产物为 vertex/src/data/admin-preorder.json） */
export interface PreorderEntry {
  id: string;
  /** 站内 handle（唯一键，重复提交即覆盖） */
  handle: string;
  /** 商品标题（冗余，列表展示用） */
  title: string;
  regularPrice: string;
  arrivesLabel: string;
  arrivesShort: string;
  deadline: string;
  deadlineLabel: string;
  reason: string;
  note?: string;
  at: string;
  status: 'pending' | 'published';
  publishedAt?: string;
}

/** 全站横幅口径（后台可编辑） */
export interface PreorderSale {
  deadline: string;
  deadlineLabel: string;
  bannerLine: string;
}

export const DEFAULT_PREORDER_SALE: PreorderSale = {
  deadline: '2026-11-17T23:59:00-08:00',
  deadlineLabel: 'Nov 17',
  bannerLine: 'Pre-Order Event · Up to 30% Off',
};
