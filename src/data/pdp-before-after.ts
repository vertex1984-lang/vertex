// PDP → Before/After 场景对比映射（2026-10-29 P2）
// 原则：图里主角产品必须和 PDP 产品对应（同家族+同色系），
// 所以只挂颜色匹配的 handle，家族内其它颜色暂不展示对比图。
// 场景图复用 /inspiration 的 8 套素材（public/images/inspiration/）。
// 双图区（2026-10-29 用户定）：左种草图（The Look，纯展示）+ 右对比滑块（Before & After），
// 种草图取同房间故事线里"另一套"场景的 after 图，避免和对比图重复。
// 热区（2026-10-30 用户定）：种草图/对比图都展示场景内产品圆点；
// currentHandle 命中的圆点 = 本 PDP 在售产品，品牌色特别标记、小卡不可跳转。

import {
  INSPIRATION_SCENES,
  RUG,
  BLANKET_CREAM,
  BEDDING_IVORY,
  type InspirationScene,
} from './inspiration-scenes';

export interface PdpBeforeAfterData {
  /** 对比滑块场景 */
  scene: InspirationScene;
  /** 种草图（纯展示静态图） */
  lifestyle: { image: string; alt: string };
  /** 种草图所属场景（取其 hotspots 做热区圆点） */
  lifestyleScene: InspirationScene;
  /** 本 PDP 产品对应的热区 handle（圆点特别标记 + 小卡用当前 PDP 信息） */
  currentHandle: string;
}

const lifestyleOf = (sceneId: number, alt: string) => ({
  image: `/images/inspiration/scene-${sceneId}-after.webp`,
  alt,
});

// 场景速查：INSPIRATION_SCENES[0]=scene-1 客厅 / [1]=scene-2 卧室 /
// [4]=scene-5 壁炉客厅 / [7]=scene-8 藤编卧室
const entry = (
  scene: InspirationScene,
  lifestyleScene: InspirationScene,
  lifestyleAlt: string,
  currentHandle: string,
): PdpBeforeAfterData => ({
  scene,
  lifestyle: lifestyleOf(lifestyleScene.id, lifestyleAlt),
  lifestyleScene,
  currentHandle,
});

/** PDP handle → 双图区数据 */
const PDP_SCENE_MAP: Record<string, PdpBeforeAfterData> = {
  // 波斯地毯：图中为红色复古波斯毯（最接近 GT006 彩色款；c3 米色 medallion 风格同类）
  // 对比 = scene-1 客厅，种草 = scene-5 壁炉客厅
  'vintage-area-rug-with-colorful-anatolian-persian-tribal-745181807454':
    entry(INSPIRATION_SCENES[0], INSPIRATION_SCENES[4],
      'Fireplace living room styled with a vintage Persian rug and orange throw', RUG),
  'elegant-distressed-oriental-vintage-area-rug-traditional-745181807454-c3':
    entry(INSPIRATION_SCENES[0], INSPIRATION_SCENES[4],
      'Fireplace living room styled with a vintage Persian rug and orange throw', RUG),
  // 波斯地毯 C6（GT027 藏蓝橙大奖章，2026-10-30 用户定：场景图与该款匹配）：
  // 对比 = scene-1 客厅，种草 = scene-5 壁炉客厅
  'vintage-medallion-indoor-area-rug-for-living-room-bedroom-745181807454-c6':
    entry(INSPIRATION_SCENES[0], INSPIRATION_SCENES[4],
      'Fireplace living room styled with a vintage Persian rug and orange throw', RUG),
  // 仿兔毛毯 Cream Yellow（图中米白毯）：对比 = scene-2 卧室，种草 = scene-8 藤编卧室
  'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-969627065032-c26':
    entry(INSPIRATION_SCENES[1], INSPIRATION_SCENES[7],
      'Rattan bedroom styled with white bedding and a soft throw', BLANKET_CREAM),
  'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-969627065032-c27':
    entry(INSPIRATION_SCENES[1], INSPIRATION_SCENES[7],
      'Rattan bedroom styled with white bedding and a soft throw', BLANKET_CREAM),
  'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-969627065032-c28':
    entry(INSPIRATION_SCENES[1], INSPIRATION_SCENES[7],
      'Rattan bedroom styled with white bedding and a soft throw', BLANKET_CREAM),
  // 亚麻床品 Ivory（图中白色床品）：对比 = scene-2 卧室，种草 = scene-8 藤编卧室
  'makimoo-100-linen-duvet-cover-set-3-pieces-queen-size-with-linen3-ivory-queen':
    entry(INSPIRATION_SCENES[1], INSPIRATION_SCENES[7],
      'Rattan bedroom styled with ivory linen bedding and layered throws', BEDDING_IVORY),
  'makimoo-100-linen-duvet-cover-set-3-piece-twin-breathable-linen3-ivory-twin':
    entry(INSPIRATION_SCENES[1], INSPIRATION_SCENES[7],
      'Rattan bedroom styled with ivory linen bedding and layered throws', BEDDING_IVORY),
  'makimoo-100-linen-duvet-cover-set-king-3-piece-bedding-with-linen3-ivory-king':
    entry(INSPIRATION_SCENES[1], INSPIRATION_SCENES[7],
      'Rattan bedroom styled with ivory linen bedding and layered throws', BEDDING_IVORY),
  'makimoo-100-percent-linen-duvet-cover-set-full-size-3-piece-linen3-ivory-full':
    entry(INSPIRATION_SCENES[1], INSPIRATION_SCENES[7],
      'Rattan bedroom styled with ivory linen bedding and layered throws', BEDDING_IVORY),
  'makimoo-100-linen-duvet-cover-only-ivory-soft-washed-linen3-ivory-duvet':
    entry(INSPIRATION_SCENES[1], INSPIRATION_SCENES[7],
      'Rattan bedroom styled with ivory linen bedding and layered throws', BEDDING_IVORY),
};

export function getPdpBeforeAfter(handle: string): PdpBeforeAfterData | null {
  return PDP_SCENE_MAP[handle] ?? null;
}
