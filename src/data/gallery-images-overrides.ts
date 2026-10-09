/**
 * 详情页/列表主图画廊覆盖表（asin → 本地图片路径列表）
 *
 * 为什么需要它：老产品（不在 materials-map 素材库里的）页面图片走
 * shopify-map.ts 的 Shopify CDN 图，而 shopify-map.ts 由 scripts/build-shopify-map.js
 * 自动生成，手动改动会在下次构建时被冲掉。本地重拍/AI 生成的灰底主图放在
 * public/images/products/<ASIN>/ 下，通过本表覆盖显示，不受数据再生成影响
 * （同 detail-images-overrides.ts / specs-overrides.ts 的先例）。
 *
 * 注意：数组顺序即画廊顺序，第 1 张为主图；whiteBg 标记仍由
 * materials-map.ts 底部的 SITE_ONLY_WHITEBG 维护，二者需保持等长。
 */
export const GALLERY_IMAGES_OVERRIDES: Record<string, string[]> = {
  // 2026-10-10 坐垫灰底棚拍主图（1.webp 为新生成图，其余为原图后移）
  'b0cj8tjl56': [
    '/images/products/B0CJ8TJL56/1.webp',
    '/images/products/B0CJ8TJL56/2.webp',
    '/images/products/B0CJ8TJL56/3.webp',
    '/images/products/B0CJ8TJL56/4.webp',
    '/images/products/B0CJ8TJL56/5.webp',
  ],
  'b0cjhslcz5': [
    '/images/products/B0CJHSLCZ5/1.webp',
    '/images/products/B0CJHSLCZ5/2.webp',
    '/images/products/B0CJHSLCZ5/3.webp',
    '/images/products/B0CJHSLCZ5/4.webp',
  ],
  'b0f1y4j48t': [
    '/images/products/B0F1Y4J48T/1.webp',
    '/images/products/B0F1Y4J48T/2.webp',
    '/images/products/B0F1Y4J48T/3.webp',
    '/images/products/B0F1Y4J48T/4.webp',
    '/images/products/B0F1Y4J48T/5.webp',
  ],
  'b0f1y91hpr': [
    '/images/products/B0F1Y91HPR/1.webp',
    '/images/products/B0F1Y91HPR/2.webp',
    '/images/products/B0F1Y91HPR/3.webp',
    '/images/products/B0F1Y91HPR/4.webp',
    '/images/products/B0F1Y91HPR/5.webp',
    '/images/products/B0F1Y91HPR/jimeng-2026-04-02-1125-Warm photorealistic lifestyle product ph....webp',
    '/images/products/B0F1Y91HPR/jimeng-2026-04-02-5812-Photorealistic commercial lifestyle prod....webp',
  ],
  'b0c39zmk7h': [
    '/images/products/B0C39ZMK7H/1.webp',
    '/images/products/B0C39ZMK7H/2.webp',
    '/images/products/B0C39ZMK7H/3.webp',
    '/images/products/B0C39ZMK7H/4.webp',
    '/images/products/B0C39ZMK7H/5.webp',
    '/images/products/B0C39ZMK7H/6.webp',
    '/images/products/B0C39ZMK7H/7.webp',
    '/images/products/B0C39ZMK7H/8.webp',
  ],
};
