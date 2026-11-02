/**
 * PLP 网格种草图位（2026-11-01 新增，用户定）：类目结果页产品卡网格中插入种草图，
 * 提升视觉效果、丰富内容（参考 Parachute / UO 的 editorial tile 做法）。
 * - 节奏（2026-11-01 用户定）：数普通产品卡，第 4 张后插 1 张、再数 8 张（第 12 张后）插 1 张、
 *   再数 4 张（第 16 张后）插 1 张……即间隔 4、8、4、8 依次类推；afterIndex = 第 N 张产品卡之后（1 起计）
 * - 占比（2026-11-01 用户定）：占两个产品卡宽度；桌面端 3:2 横图（1440×960），
 *   移动端打满屏宽 1:1 方图（1080×1080，V2EditorialTile 双 img 按断点切换）
 * - 图源：大片图文件夹精选（现有图为临时裁剪，后续用户会换正式图）；
 *   选图原则 = 图中床品能对应在售产品，点击跳对应 PDP（"Shop this look"）
 * - 已接入：/bedding/4-piece-sets/（V2FabricShop flat 模式）、/products?cat=bedding（V2BeddingShop，2026-11-01 用户定）
 * - bedding 类目页图源不复用子分类页已用的三张（sage/checker/jacquard-haze），另选 6 张（2026-11-01 用户定）
 */

export interface EditorialTile {
  /** 桌面端图片路径：3:2 横版（public 下，经 resolveUrl） */
  image: string;
  /** 移动端图片路径：1:1 方图（2026-11-01 用户定，由 3:4 改来） */
  mobileImage: string;
  /** 图片 alt */
  alt: string;
  /** 点击跳转（PDP handle，经 v2url 包 /products/<handle>/） */
  handle: string;
  /** 图下说明短句（标题行） */
  caption: string;
  /** 插在「第 N 张产品卡之后」（1 起计，间隔 4/8/4/8 依次类推） */
  afterIndex: number;
}

export const PLP_EDITORIAL_TILES: Record<string, EditorialTile[]> = {
  '4-piece-sets': [
    {
      image: '/images/editorial/plp-sage-stripe-3x2.webp',
      mobileImage: '/images/editorial/plp-sage-stripe-1x1.webp',
      alt: 'Sage stripe washed cotton bedding set styled in a sunlit bedroom with an arched window',
      handle: 'makimoo-queen-bedding-set-4-piece-washed-cotton-stripe-sage-queen',
      caption: 'Sage Stripes, Slow Mornings',
      afterIndex: 4,
    },
    {
      image: '/images/editorial/plp-checker-black-3x2.webp',
      mobileImage: '/images/editorial/plp-checker-black-1x1.webp',
      alt: 'Black and cream checkerboard bedding set styled in a modern bedroom',
      handle: 'makimoo-queen-bedding-set-4-piece-cotton-feel-checker-black-queen-1071466105053-c11',
      caption: 'The Checkerboard Edit',
      afterIndex: 12,
    },
    {
      image: '/images/editorial/plp-jacquard-haze-3x2.webp',
      mobileImage: '/images/editorial/plp-jacquard-haze-1x1.webp',
      alt: 'Dusty blue stripe jacquard bedding set styled in a cozy cabin bedroom',
      handle: 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-haze-queen',
      caption: 'Dusty Blue, Cabin Mornings',
      afterIndex: 16,
    },
  ],
  // /products?cat=bedding（2026-11-01 用户定）：融合打乱视图，同 4/8/4/8 节奏；
  // 不复用 4-piece-sets 已用的三张图
  bedding: [
    {
      image: '/images/editorial/plp-coconut-white-3x2.webp',
      mobileImage: '/images/editorial/plp-coconut-white-1x1.webp',
      alt: 'Coconut white cotton percale bedding set styled in a bright modern bedroom',
      handle: 'makimoo-queen-duvet-cover-set-3-piece-cotton-percale-coconut-queen',
      caption: 'Coconut White, Kept Simple',
      afterIndex: 4,
    },
    {
      image: '/images/editorial/plp-floral-grey-3x2.webp',
      mobileImage: '/images/editorial/plp-floral-grey-1x1.webp',
      alt: 'Grey floral linen-feel bedding set styled in a classic bedroom',
      handle: 'makimoo-queen-bedding-set-4-piece-linen-feel-floral-grey-queen-mk-floral4-grey-queen',
      caption: 'Grey Florals, Quiet Drama',
      afterIndex: 12,
    },
    {
      image: '/images/editorial/plp-petal-pink-3x2.webp',
      mobileImage: '/images/editorial/plp-petal-pink-1x1.webp',
      alt: 'Blush pink sheet set styled in a soft sunlit bedroom',
      handle: 'makimoo-queen-sheet-set-4-piece-cotton-percale-jacquard-stripe-petal-queen',
      caption: 'Blush Pink, Soft Focus',
      afterIndex: 16,
    },
    {
      image: '/images/editorial/plp-polka-navy-3x2.webp',
      mobileImage: '/images/editorial/plp-polka-navy-1x1.webp',
      alt: 'Deep navy sheet set styled in a crisp white bedroom',
      handle: 'makimoo-queen-sheet-set-4-piece-cotton-feel-polka-blue-queen',
      caption: 'Navy, Crisp and Calm',
      afterIndex: 24,
    },
    {
      image: '/images/editorial/plp-linen-sage-3x2.webp',
      mobileImage: '/images/editorial/plp-linen-sage-1x1.webp',
      alt: 'Sage green linen bedding set styled in a warm eclectic bedroom',
      handle: 'makimoo-100-linen-duvet-cover-set-3-piece-bedding-set-with-linen3-sage-queen',
      caption: 'Sage Linen, Lived In',
      afterIndex: 28,
    },
    {
      image: '/images/editorial/plp-dustyblue-3x2.webp',
      mobileImage: '/images/editorial/plp-dustyblue-1x1.webp',
      alt: 'Dusty blue linen duvet cover styled in a coastal bedroom',
      handle: 'makimoo-100-linen-duvet-cover-only-dusty-blue-soft-washed-linen3-dustyblue-duvet',
      caption: 'Dusty Blue, Coastal Air',
      afterIndex: 36,
    },
  ],
};
