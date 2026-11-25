// lookbook 图卡产品热区映射 + 场景图合并（2026-11-05 用户定）。
// 热区数据源：scenes.ts（Shop the Look 场景，按 heroImage 匹配）+ inspiration-scenes.ts
// （Before & After，坐标标在 after 图上、按 after 图匹配）。
// 合并：85 个场景图（全部有热区，协作者分支批次）并入 lookbook——场景卡在前
// （addedAt 新→旧），原 LOOKBOOK 去重后接在后；场景卡 href = /scenes/[slug]/ 详情页。
// 场景的 room/category 自动推导（用户定）：类目 = 热区产品 productType 多数决；
// 房间 = 热区产品场景标签（getSceneTag，完整标题口径）多数决映射。
// 注意：本模块依赖 scenes.ts → products.ts 全量产品库，**只能在服务端页面
// （/scenes、/inspiration 的 page.tsx）import**，结果以 prop 传给 V2Lookbook；
// 不要从客户端组件引入，否则产品库会进浏览器 bundle。

import { SCENES, type SceneDef } from '@/data/scenes';
import { INSPIRATION_SCENES } from '@/data/inspiration-scenes';
import { LOOKBOOK } from '@/data/lookbook';
import { getProductByHandle, enrichProductsWithShopifyData } from '@/data/products';
import { MATERIALS_MAP } from '@/data/materials-map';
import { getSceneTag } from '@/data/product-tags';
import type { LookbookCardItem, LookbookHotspot } from '@/components/v2/V2Lookbook';
import type { LookbookRoom, LookbookCategory } from '@/data/lookbook';

/** 热点补产品信息（2026-11-09 领导要求恢复悬停预览卡）：scenes.ts 热点自带
    title/image/price；inspiration-scenes 热点（SceneHotspotRef）只有坐标，
    服务端经产品库 + Shopify enrich 补齐，供 lookbook 悬停小卡展示。
    handle 解析失败 → 返回 null（该死点不渲染），并计入构建阻断计数 */
let unresolvedHotspots = 0;
function enrichHotspot(h: LookbookHotspot, ctx: string): LookbookHotspot | null {
  const p = getProductByHandle(h.handle);
  if (!p) {
    // 构建期硬校验（2026-11-09 用户定）：热区 handle 指向不存在的产品 = 死点
    // （无悬浮卡 + 点击 404），报错阻断上线
    console.warn(`[lookbook] 热区 handle 在产品库中不存在: ${ctx} · ${h.label || ''} · ${h.handle}`);
    unresolvedHotspots++;
    return null;
  }
  if (h.title && h.image) return h;
  const ep = enrichProductsWithShopifyData([p])[0];
  return {
    ...h,
    title: h.title || ep.title,
    image: h.image || ep.featuredImage || ep.images?.[0]?.url || '',
    price: h.price || ep.shopifyPrice || ep.priceRange?.minVariantPrice?.amount || '',
    currency: h.currency || ep.shopifyCurrencyCode || ep.priceRange?.minVariantPrice?.currencyCode || 'USD',
  };
}

/** image 路径 → 该图上的产品热区（坐标为图片百分比 0-100，相对渲染框）。
    2026-11-09：产品库中不存在 handle 的死点不渲染（no-dead-dots，与 V2PdpScenes 一致）；
    且只要有死点即抛错阻断构建，防止此类问题悄悄发布 */
export function lookbookHotspotsByImage(): Record<string, LookbookHotspot[]> {
  const map: Record<string, LookbookHotspot[]> = {};
  unresolvedHotspots = 0;
  const put = (h: LookbookHotspot | null, img: string) => {
    if (!h) return;
    (map[img] ??= []).push(h);
  };
  for (const s of SCENES) {
    if (s.hotspots?.length) for (const h of s.hotspots) put(enrichHotspot(h, `scenes/${s.slug}`), s.heroImage);
  }
  for (const s of INSPIRATION_SCENES) {
    if (s.hotspots?.length) for (const h of s.hotspots) put(enrichHotspot(h, `inspiration:${s.title}`), s.after);
  }
  if (unresolvedHotspots > 0) {
    throw new Error(
      `[lookbook] 构建阻断: ${unresolvedHotspots} 个场景热区 handle 在产品库中不存在——` +
        '请修正 scenes.ts / inspiration-scenes.ts 中的 handle，或在 Shopify 上架对应商品后重试',
    );
  }
  return map;
}

/** 产品场景标签 key → lookbook 房间（kitchen 并入 dining，同 lookbook 原标注口径；
    garden-lawn/beach-pool/travel 无对应房间，归 living-room 兜底） */
const SCENE_TO_ROOM: Record<string, LookbookRoom> = {
  'living-room': 'living-room',
  bedroom: 'bedroom',
  bathroom: 'bathroom',
  'dining-room': 'dining',
  kitchen: 'dining',
  entryway: 'entryway',
  'garden-lawn': 'living-room',
  'beach-pool': 'living-room',
  travel: 'living-room',
};

const LOOKBOOK_CATS: readonly string[] = [
  'bedding',
  'pillows',
  'cushions',
  'towels',
  'blankets',
  'mats',
];

/** 场景 slug 房间关键词（有序，先命中先赢；2026-11-05 用户定自动推导的主信号——
    产品场景标签投票按产品类型兜底到 bedroom，会把 patio/pool 场景错判，只作兜底）。
    kitchen 并入 dining（lookbook 无 kitchen 房间）；露台/阳光房等户外词归 living-room */
const ROOM_SLUG_RULES: [LookbookRoom, RegExp][] = [
  ['bathroom', /\b(bath|bathroom|pool|soak|shower|spa)\b/],
  ['dining', /\b(kitchen|dining|breakfast|cafe|bistro)\b/],
  ['entryway', /\b(entryway|foyer|hallway)\b/],
  [
    'living-room',
    /\b(patio|terrace|porch|sunroom|courtyard|garden|greenhouse|balcony|lounge|hearth|library|study|nook|sofa|living|vinyl|window-seat|workshop|bench)\b/,
  ],
];

function roomFromSlug(slug: string): LookbookRoom | undefined {
  for (const [room, re] of ROOM_SLUG_RULES) {
    if (re.test(slug)) return room;
  }
  return undefined;
}

/** 人工标注覆盖（2026-11-05 用户定：后续人工标注，优先级高于一切自动推导）。
    key = 场景 slug；room/category 只填要改的字段即可；category 填 '' 表示
    故意不归任何类目（只在 All Categories 出现） */
const SCENE_LABEL_OVERRIDES: Record<
  string,
  { room?: LookbookRoom; category?: LookbookCategory | '' }
> = {
  // 示例：'golden-swirl-suite': { room: 'bedroom', category: 'bedding' },
};

/** 多数决取第一（平票保持热区出现顺序，Map 插入序；forEach 写法兼容 es5 target） */
function topVote<K>(votes: Map<K, number>): K | undefined {
  let bestK: K | undefined;
  let bestN = -1;
  votes.forEach((n, k) => {
    if (n > bestN) {
      bestK = k;
      bestN = n;
    }
  });
  return bestK;
}

/** 场景 → room/category：人工覆盖（SCENE_LABEL_OVERRIDES）> slug 房间关键词（仅 room）>
    热区产品多数决（打标用素材库完整标题，同 generate-tags 口径） */
function sceneRoomAndCategory(scene: SceneDef): {
  room: LookbookRoom;
  category: LookbookCategory | '';
} {
  const override = SCENE_LABEL_OVERRIDES[scene.slug];
  const roomVotes = new Map<LookbookRoom, number>();
  const catVotes = new Map<LookbookCategory, number>();
  for (const h of scene.hotspots) {
    const p = getProductByHandle(h.handle);
    if (!p) continue;
    const fullTitle = MATERIALS_MAP[p.asin.toLowerCase()]?.title || p.title;
    const tag = getSceneTag(fullTitle, p.productType);
    const room = SCENE_TO_ROOM[tag.key];
    if (room) roomVotes.set(room, (roomVotes.get(room) || 0) + 1);
    const t = p.productType.toLowerCase();
    if (LOOKBOOK_CATS.includes(t)) {
      catVotes.set(t as LookbookCategory, (catVotes.get(t as LookbookCategory) || 0) + 1);
    }
  }
  return {
    room: override?.room ?? roomFromSlug(scene.slug) ?? topVote(roomVotes) ?? 'living-room',
    // 无软装配饰热区的场景（如纯挂画墙）：category 置 ''，只在 All Categories 下出现
    // （覆盖表显式填 '' 时优先于多数决，故用 !== undefined 判定）
    category: override?.category !== undefined ? override.category : topVote(catVotes) ?? '',
  };
}

/** 合并后的 lookbook 卡片列表：场景卡（addedAt 新→旧）在前，原 LOOKBOOK 去重接后 */
export function mergedLookbookItems(): LookbookCardItem[] {
  const sceneItems: LookbookCardItem[] = [...SCENES]
    .sort((a, b) => (b.addedAt ?? '').localeCompare(a.addedAt ?? ''))
    .map((s) => {
      const { room, category } = sceneRoomAndCategory(s);
      return {
        image: s.heroImage,
        alt: s.heroAlt,
        room,
        category,
        href: `/scenes/${s.slug}/`,
      };
    });
  const seen = new Set(sceneItems.map((i) => i.image));
  const rest = LOOKBOOK.filter((i) => !seen.has(i.image));
  return [...sceneItems, ...rest];
}
