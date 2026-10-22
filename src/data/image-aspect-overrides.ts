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
  'knitthrow-cream': '3/4',
  'knitthrow-grey': '3/4',
  'knitthrow-khaki': '3/4',
  'knitthrow-pink': '3/4',
  'bohothrow-sunset-127': '3/4',
  'bohothrow-sunset-130': '3/4',
  'bohothrow-olive-127': '3/4',
  'bohothrow-olive-130': '3/4',
  'bohothrow-teal-127': '3/4',
  'bohothrow-teal-130': '3/4',
  'bohothrow-burgundy-127': '3/4',
  'bohothrow-burgundy-130': '3/4',
  'jacthrow-hb-black-130x180': '3/4',
  'jacthrow-hb-black-150x200': '3/4',
  'jacthrow-hb-black-130x190': '3/4',
  'jacthrow-hb-khaki-130x180': '3/4',
  'jacthrow-hb-khaki-150x200': '3/4',
  'jacthrow-hb-khaki-130x190': '3/4',
  'jacthrow-paisley-beige-130x180': '3/4',
  'jacthrow-paisley-beige-150x200': '3/4',
  'jacthrow-paisley-beige-130x190': '3/4',
  'jacthrow-paisley-blue-130x180': '3/4',
  'jacthrow-paisley-blue-150x200': '3/4',
  'jacthrow-paisley-blue-130x190': '3/4',
  'chunkythrow-orange-127': '3/4',
  'chunkythrow-orange-130': '3/4',
  'chunkythrow-oat-127': '3/4',
  'chunkythrow-oat-130': '3/4',
  'chunkythrow-cream-127': '3/4',
  'chunkythrow-cream-130': '3/4',
  'chunkythrow-grey-127': '3/4',
  'chunkythrow-grey-130': '3/4',
  '1688-969627065032-c21': '3/4',
  '1688-969627065032-c22': '3/4',
  '1688-969627065032-c23': '3/4',
  '1688-969627065032-c24': '3/4',
  '1688-969627065032-c26': '3/4',
  '1688-969627065032-c27': '3/4',
  '1688-969627065032-c28': '3/4',
  '1688-969627065032-c29': '3/4',
  '1688-969627065032-c31': '3/4',
  '1688-969627065032-c32': '3/4',
  '1688-969627065032-c33': '3/4',
  '1688-969627065032-c34': '3/4',
  '1688-969627065032-c36': '3/4',
  '1688-969627065032-c37': '3/4',
  '1688-969627065032-c38': '3/4',
  '1688-969627065032-c39': '3/4',
  '1688-969627065032-c41': '3/4',
  '1688-969627065032-c42': '3/4',
  '1688-969627065032-c43': '3/4',
  '1688-969627065032-c25': '3/4',
  '1688-969627065032-c30': '3/4',
  '1688-969627065032-c35': '3/4',
  '1688-969627065032-c40': '3/4',
  // 2026-10-21：Embossed Velvet 绒球四件套（7 色 × 4 尺寸，3:4 PDP 主图）
  'pompom4-swirl-twin': '3/4',
  'pompom4-swirl-full': '3/4',
  'pompom4-swirl-queen': '3/4',
  'pompom4-swirl-king': '3/4',
  'pompom4-vine-twin': '3/4',
  'pompom4-vine-full': '3/4',
  'pompom4-vine-queen': '3/4',
  'pompom4-vine-king': '3/4',
  'pompom4-leaf-twin': '3/4',
  'pompom4-leaf-full': '3/4',
  'pompom4-leaf-queen': '3/4',
  'pompom4-leaf-king': '3/4',
  'pompom4-blush-twin': '3/4',
  'pompom4-blush-full': '3/4',
  'pompom4-blush-queen': '3/4',
  'pompom4-blush-king': '3/4',
  'pompom4-ink-twin': '3/4',
  'pompom4-ink-full': '3/4',
  'pompom4-ink-queen': '3/4',
  'pompom4-ink-king': '3/4',
  'pompom4-bloom-twin': '3/4',
  'pompom4-bloom-full': '3/4',
  'pompom4-bloom-queen': '3/4',
  'pompom4-bloom-king': '3/4',
  'pompom4-damask-twin': '3/4',
  'pompom4-damask-full': '3/4',
  'pompom4-damask-queen': '3/4',
  'pompom4-damask-king': '3/4',
  // 2026-10-22：Cotton Percale 提花四件套（4 色 × 仅 Queen，3:4 PDP 主图）
  'percalejac-haze-queen': '3/4',
  'percalejac-rose-queen': '3/4',
  'percalejac-grey-queen': '3/4',
  'percalejac-oatbeige-queen': '3/4',
  // 2026-10-22：Cotton Percale 细条纹提花四件套（单色 × 仅 Queen，3:4 PDP 主图）
  'percalestripe-petal-queen': '3/4',
  // 2026-10-22：Cotton Percale 拼接提花四件套（单色 × 仅 Queen，3:4 PDP 主图）
  'percalepatch-stone-queen': '3/4',
  // 2026-10-22：Washed Cotton 鼠尾草绿细条纹四件套（单色 × 仅 Queen，3:4 PDP 主图）
  'washstripe-sagegreen-queen': '3/4',
  // 2026-10-22：Washed Cotton 奶白暗纹提花四件套（单色 × 仅 Queen，3:4 PDP 主图）
  'washjac-cream-queen': '3/4',
};

/**
 * 产品卡 1:1 方图白名单（2026-10-22 用户定）：卡面主图不裁切、卡片容器用 aspect-square。
 * 默认全站卡片容器是 aspect-[3/4]（GroupProductCard tallImage），1:1 图会被 cover 裁两侧；
 * 名单内 ASIN 的主图本身产品占图比已很高（如 linen3-ivory-queen 种草图 v2），裁切反而丢信息。
 * 粒度 = 变体级：组卡切到该色变体时容器变方图，其他色保持 3:4。
 */
export const CARD_SQUARE_IMAGE_ASINS = new Set<string>([
  // 当前为空：linen3-ivory 曾列入，2026-10-22 用户改定"容器恢复 3:4 + 主图不裁"——
  // 改走 images[0] 指 1-3x4.webp 方案（图与容器同比例即零裁切），方图机制保留备用
]);
