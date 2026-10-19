/**
 * image-aspect-overrides.ts — PDP 主图区宽高比覆盖（独立文件，不受 materials-map 再生成影响）
 * 2026-10-19 用户定：Percale Coconut / Sky 两个产品线主图换 3:4 竖版场景图，
 * PDP 图集区容器比例随之适配 3:4（其余产品保持默认 aspect-[1/1.05] / lg:aspect-square）。
 * key = asin 小写；value = CSS aspect-ratio（如 '3/4'）
 */
export const IMAGE_ASPECT_OVERRIDES: Record<string, string> = {
  'percale-coconut-twin': '3/4',
  'percale-coconut-full': '3/4',
  'percale-coconut-queen': '3/4',
  'percale-coconut-king': '3/4',
  'percale-sky-twin': '3/4',
  'percale-sky-full': '3/4',
  'percale-sky-queen': '3/4',
  'percale-sky-king': '3/4',
};
