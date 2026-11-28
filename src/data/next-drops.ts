/**
 * Next Drops 心愿解锁数据（2026-11-27，/drop-home 试验页 + /next-drops 专区页共用）。
 * 演示版：wanted 本地写死；正式版第一期由 admin 发布时写入（与预售 claimed 同机制），
 * 第二期接 CF 后端真实计数 + Want it 邮箱收集。
 * 选品口径：未上架（无 Shopify 映射）的 in-house 设计，按 wanted 倒序。
 */

export interface WishItem {
  handle: string;
  name: string;
  fabric: string;
  wanted: number;
  goal: number;
}

export const NEXT_DROPS_WISHLIST: WishItem[] = [
  { handle: 'makimoo-queen-bedding-set-4-piece-linen-feel-heart-tan-queen-mk-heart4-tan-queen', name: 'Tan Heart Bedding Set', fabric: 'Linen Feel', wanted: 327, goal: 500 },
  { handle: 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-haze-queen', name: 'Dusty Blue Jacquard Bedding Set', fabric: 'Cotton Percale', wanted: 289, goal: 500 },
  { handle: 'makimoo-queen-bedding-set-4-piece-linen-feel-butterfly-mocha-queen-mk-btfly4-mocha-queen', name: 'Mocha Butterfly Bedding Set', fabric: 'Linen Feel', wanted: 214, goal: 500 },
  { handle: 'makimoo-queen-bedding-set-4-piece-washed-cotton-jacquard-cream-queen', name: 'Cream Jacquard Bedding Set', fabric: 'Washed Cotton', wanted: 203, goal: 500 },
  { handle: 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-rose-queen', name: 'Dusty Pink Jacquard Bedding Set', fabric: 'Cotton Percale', wanted: 176, goal: 500 },
  { handle: 'makimoo-queen-bedding-set-4-piece-linen-feel-floral-grey-queen-mk-floral4-grey-queen', name: 'Grey Floral Bedding Set', fabric: 'Linen Feel', wanted: 158, goal: 500 },
  { handle: 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-stripe-petal-queen', name: 'Blush Pink Stripe Bedding Set', fabric: 'Cotton Percale', wanted: 141, goal: 500 },
  { handle: 'makimoo-queen-bedding-set-4-piece-linen-feel-print-blue-queen-mk-print4-blue-queen', name: 'Blue Print Bedding Set', fabric: 'Linen Feel', wanted: 96, goal: 500 },
  { handle: 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-patchwork-stone-queen', name: 'Stone Grey Patchwork Bedding Set', fabric: 'Cotton Percale', wanted: 88, goal: 500 },
  { handle: 'makimoo-queen-bedding-set-4-piece-washed-cotton-stripe-sage-queen', name: 'Sage Stripe Bedding Set', fabric: 'Washed Cotton', wanted: 67, goal: 500 },
];
