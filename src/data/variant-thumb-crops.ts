/**
 * PDP 色点缩略图指定版（原挂画家族专用，2026-09-28 领导要求：圆点展示完整本体花型；
 * 2026-10-02 起兼作"强制指定色点图"表——BEDSET4 灰/粉/白三色色点改为直接用主图，
 * 因为它们的白底图是折叠包装图，做色点不直观）。
 * 挂画条目由 scripts/build-variant-thumbs.js 生成；products/[handle]/page.tsx 的色点 thumb 优先取本表。
 * 新挂画上架：scripts/build-variant-thumbs.js 的 SOURCES 补坐标后重跑。
 */
export const VARIANT_THUMB_CROPS: Record<string, string> = {
  '1688-730512046265-c14': '/images/products/1688-730512046265-C14/thumb-crop.webp',
  '1688-730512046265-c15': '/images/products/1688-730512046265-C15/thumb-crop.webp',
  '1688-730512046265-c16': '/images/products/1688-730512046265-C16/thumb-crop.webp',
  '1688-730512046265-c17': '/images/products/1688-730512046265-C17/thumb-crop.webp',
  '1688-730512046265-c18': '/images/products/1688-730512046265-C18/thumb-crop.webp',
  '1688-730512046265-c19': '/images/products/1688-730512046265-C19/thumb-crop.webp',
  // BEDSET4 灰/粉/白：色点直接用主图（2026-10-02 新生成的场景主图）
  'bedset4-gray-twin': '/images/products/BEDSET4-GRAY-TWIN/1.webp',
  'bedset4-gray-full': '/images/products/BEDSET4-GRAY-FULL/1.webp',
  'bedset4-gray-queen': '/images/products/BEDSET4-GRAY-QUEEN/1.webp',
  'bedset4-gray-king': '/images/products/BEDSET4-GRAY-KING/1.webp',
  'bedset4-pink-twin': '/images/products/BEDSET4-PINK-TWIN/1.webp',
  'bedset4-pink-full': '/images/products/BEDSET4-PINK-FULL/1.webp',
  'bedset4-pink-queen': '/images/products/BEDSET4-PINK-QUEEN/1.webp',
  'bedset4-pink-king': '/images/products/BEDSET4-PINK-KING/1.webp',
  'bedset4-white-twin': '/images/products/BEDSET4-WHITE-TWIN/1.webp',
  'bedset4-white-full': '/images/products/BEDSET4-WHITE-FULL/1.webp',
  'bedset4-white-queen': '/images/products/BEDSET4-WHITE-QUEEN/1.webp',
  'bedset4-white-king': '/images/products/BEDSET4-WHITE-KING/1.webp',
};
