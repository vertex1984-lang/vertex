/**
 * PDP 色点缩略图裁剪版（挂画家族专用，2026-09-28 领导要求：圆点展示完整本体花型）
 * 由 scripts/build-variant-thumbs.js 生成——从各产品 1.webp 场景图按画框坐标裁出 thumb-crop.webp。
 * products/[handle]/page.tsx 的色点 thumb 优先取本表；不在表内的产品走默认白底/首图逻辑。
 * 新挂画上架：scripts/build-variant-thumbs.js 的 SOURCES 补坐标后重跑。
 */
export const VARIANT_THUMB_CROPS: Record<string, string> = {
  '1688-730512046265-c14': '/images/products/1688-730512046265-C14/thumb-crop.webp',
  '1688-730512046265-c15': '/images/products/1688-730512046265-C15/thumb-crop.webp',
  '1688-730512046265-c16': '/images/products/1688-730512046265-C16/thumb-crop.webp',
  '1688-730512046265-c17': '/images/products/1688-730512046265-C17/thumb-crop.webp',
  '1688-730512046265-c18': '/images/products/1688-730512046265-C18/thumb-crop.webp',
  '1688-730512046265-c19': '/images/products/1688-730512046265-C19/thumb-crop.webp',
};
