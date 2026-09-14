/**
 * Complete the Look 共享打标数据：featured-products 主页与 color/scene 分类页共用。
 * 标签持久化在 src/data/product-tags.json（scripts/generate-tags.js 生成，key = 小写 asin）；
 * asin 不在 JSON 里（新品未重跑脚本）时回退到 getColorTag/getSceneTag 现算。
 */
import {
  PRODUCTS_DATA,
  enrichProductsWithShopifyData,
  MakimooProduct,
} from '@/data/products';
import { MATERIALS_MAP } from '@/data/materials-map';
import {
  getColorTag,
  getSceneTag,
  COLOR_RULES,
  SCENE_RULES,
  ColorTag,
  SceneTag,
} from '@/data/product-tags';
import PRODUCT_TAGS from '@/data/product-tags.json';
import { sortByWeight } from '@/lib/weights';

export interface TaggedProduct extends MakimooProduct {
  colorTag: ColorTag | null;
  sceneTag: SceneTag;
}

// 全部在售产品（**Others 除外**：2026-09 用户定，Others 不参与 color/scene 分类，自动被展示排除）；
// 规则要求每产品恰好一个 color 和一个 scene。
// 打标用完整标题（素材库覆盖后、精简前），避免颜色/场景关键词被短标题截断
const fullTitleOf = (p: MakimooProduct) =>
  MATERIALS_MAP[p.asin.toLowerCase()]?.title || p.title;

type PersistedTag = { color: string | null; scene: string | null; pieces: number | null };
const TAGS = PRODUCT_TAGS as Record<string, PersistedTag>;

const persistedTagOf = (asin: string) => TAGS[asin.toLowerCase()];

const colorTagOf = (p: MakimooProduct, fullTitle: string): ColorTag | null => {
  const entry = persistedTagOf(p.asin);
  if (!entry) return getColorTag(fullTitle, p.asin);
  const rule = entry.color && COLOR_RULES.find((c) => c.key === entry.color);
  return rule ? { key: rule.key, label: rule.label, hex: rule.hex } : null;
};

const sceneTagOf = (p: MakimooProduct, fullTitle: string): SceneTag => {
  const entry = persistedTagOf(p.asin);
  const rule = entry && SCENE_RULES.find((s) => s.key === entry.scene);
  return rule ? { key: rule.key, label: rule.label } : getSceneTag(fullTitle, p.productType);
};

// 2026-09 起接入权重排序：color/scene 分类页按总分降序展示（同分按类目平均分）
export const ALL: TaggedProduct[] = sortByWeight(
  enrichProductsWithShopifyData(PRODUCTS_DATA)
    .filter((p) => p.hasShopifyData && p.shopifyAvailable && p.productType !== 'Others')
    .map((p) => {
      const fullTitle = fullTitleOf(p);
      return {
        ...p,
        colorTag: colorTagOf(p, fullTitle),
        sceneTag: sceneTagOf(p, fullTitle),
      };
    })
);

/**
 * generateStaticParams 驱动：product-tags.json 里出现、且在规则表中有定义、
 * 且实际有 ≥1 个在售产品的分类 key（空分类不生成静态页）。
 */
const persistedKeysWithProducts = (
  field: 'color' | 'scene',
  rules: { key: string }[],
  hasProduct: (key: string) => boolean
) =>
  rules
    .map((r) => r.key)
    .filter((key) => Object.values(TAGS).some((t) => t[field] === key) && hasProduct(key));

export const sceneKeysWithProducts = () =>
  persistedKeysWithProducts('scene', SCENE_RULES, (key) => ALL.some((p) => p.sceneTag.key === key));

export const colorKeysWithProducts = () =>
  persistedKeysWithProducts('color', COLOR_RULES, (key) =>
    ALL.some((p) => p.colorTag?.key === key)
  );

// 场景一句话文案
export const SCENE_BLURBS: Record<string, string> = {
  'living-room': 'Throws, covers and soft grounding for the room you live in.',
  bedroom: 'Duvet sets, inserts and blankets for the best sleep of your day.',
  kitchen: 'Cushioned mats and honest tools for the hardest-working room.',
  bathroom: 'Hotel-style cotton towels and soft landing mats.',
  'dining-room': 'Seat comfort for long dinners and slow mornings.',
  'garden-lawn': 'Outdoor cushions and patio pieces, weather-ready.',
  entryway: 'First impressions, softened at the door.',
  'beach-pool': 'Oversized, quick-drying and sand-friendly.',
  travel: 'Neck support and carry-easy comfort for the road.',
};
