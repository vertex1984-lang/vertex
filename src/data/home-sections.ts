/**
 * 首页 Shop by Color / Shop by Scene / Recommended 三个 client 组件的服务端数据源。
 * 产品筛选、标签计算、权重排序全部在这里（server 端）完成，client 组件只接收选好的
 * 精简卡片数据（V2CardProduct），避免把 PRODUCTS_DATA / SHOPIFY_MAP / MATERIALS_MAP /
 * product-tags.json 整个打进浏览器 bundle。
 * 选择逻辑与原 client 端 useMemo 完全一致（同一过滤条件、同一排序、同一切片）。
 */

import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { MATERIALS_MAP } from '@/data/materials-map';
import {
  getColorTag,
  getSceneTag,
  COLOR_RULES,
  SCENE_RULES,
  NO_TAG_TYPES,
} from '@/data/product-tags';
import { sortByWeight } from '@/lib/weights';
import { getBestSellerProducts } from '@/data/featured-sections';
import type { V2CardProduct } from '@/components/v2/V2ProductCard';
import PRODUCT_TAGS from '@/data/product-tags.json';

type PersistedTag = { color: string | null; scene: string | null; pieces: number | null };
const TAGS = PRODUCT_TAGS as Record<string, PersistedTag>;

const MAX_PER_COLOR = 10;
const MAX_PER_SCENE = 8;
// 场景至少有这么款在售产品才展示（太少的场景卡片排不满，观感差）
const MIN_PRODUCTS = 4;
const MAX_RECOMMENDED = 10;

// 标题去重 key（同 featured-sections）：同款多色/多尺寸只占一个卡片位
const titleKey = (title: string) =>
  title.toLowerCase().replace(/\(.*?\)/g, '').slice(0, 30).trim();

/** 只保留 V2ProductCard 渲染所需字段，减小传给 client 的体积 */
export function toCardProduct(p: MakimooProduct): V2CardProduct {
  return {
    id: p.id,
    asin: p.asin,
    title: p.title,
    handle: p.handle,
    productType: p.productType,
    subcategory: p.subcategory,
    featuredImage: p.featuredImage,
    shopifyImages: p.shopifyImages,
    shopifyPrice: p.shopifyPrice,
    shopifyCurrencyCode: p.shopifyCurrencyCode,
    images: p.images,
    priceRange: p.priceRange,
  };
}

// 在售产品 + 类目/色系/场景标签（只算一次，三个区共用）。
// Others / Decor / Dining 类目不参与 color/scene 分类（2026-09 用户定）：不打标签
//（color=null / scene=''，自然不会命中任何 COLOR_RULES / SCENE_RULES），只按类目参与推荐打分
function taggedInStock() {
  return enrichProductsWithShopifyData(PRODUCTS_DATA)
    .filter((p) => p.hasShopifyData && p.shopifyAvailable)
    .map((p) => {
      const fullTitle = MATERIALS_MAP[p.asin.toLowerCase()]?.title || p.title;
      const persisted = TAGS[p.asin.toLowerCase()];
      const isExcluded = NO_TAG_TYPES.has(p.productType);
      return {
        product: p,
        color: isExcluded ? null : persisted?.color ?? getColorTag(fullTitle, p.asin)?.key ?? null,
        scene: isExcluded ? '' : persisted?.scene ?? getSceneTag(fullTitle, p.productType).key,
      };
    });
}

export interface ColorOption {
  key: string;
  label: string;
  hex: string;
}

export interface ShopByColorData {
  colors: ColorOption[];
  productsByColor: Record<string, V2CardProduct[]>;
}

// Shop by Color：有 ≥1 款在售产品的色系按 COLOR_RULES 顺序展示，每色系按权重取前 MAX_PER_COLOR。
// 卡片类目标签位统一显示场景名（tagLabel）：色系区内产品类目各异（Bedding/Microfiber…），
// 显示场景标签（Bedroom/Living Room…）口径统一；无场景标签的产品回退到子类目/productType
export function getShopByColorData(): ShopByColorData {
  const tagged = taggedInStock();
  const sceneLabelByHandle = new Map(
    tagged.map((t) => [
      t.product.handle,
      SCENE_RULES.find((r) => r.key === t.scene)?.label,
    ])
  );
  const colors = COLOR_RULES.filter((rule) => tagged.some((t) => t.color === rule.key));
  const productsByColor: Record<string, V2CardProduct[]> = {};
  for (const rule of colors) {
    productsByColor[rule.key] = sortByWeight(
      tagged.filter((t) => t.color === rule.key).map((t) => t.product)
    )
      .slice(0, MAX_PER_COLOR)
      .map((p) => {
        const card = toCardProduct(p);
        const sceneLabel = sceneLabelByHandle.get(p.handle);
        if (sceneLabel) card.tagLabel = sceneLabel;
        return card;
      });
  }
  return {
    colors: colors.map(({ key, label, hex }) => ({ key, label, hex })),
    productsByColor,
  };
}

export interface SceneOption {
  key: string;
  label: string;
  products: V2CardProduct[];
}

export interface ShopBySceneData {
  scenes: SceneOption[];
}

// Shop by Scene：有 ≥MIN_PRODUCTS 款在售产品（按标题去重后）的场景按 SCENE_RULES 顺序展示，
// 场景内按权重排序（去重保留权重最高的一款），取前 MAX_PER_SCENE。
// 卡片类目标签位统一显示一级类目 productType（tagLabel）：productCategoryTag 对设置了二级类目
// 的产品会显示 Microfiber 等 shortLabel，同一区内 Bedding/Microfiber 混排观感不统一（2026-09 用户定）
export function getShopBySceneData(): ShopBySceneData {
  const tagged = taggedInStock();
  const scenes = SCENE_RULES.map((rule) => {
    const seen = new Set<string>();
    const products = sortByWeight(
      tagged.filter((t) => t.scene === rule.key).map((t) => t.product)
    )
      .filter((p) => {
        const key = titleKey(p.title);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, MAX_PER_SCENE);
    return { rule, products };
  }).filter((s) => s.products.length >= MIN_PRODUCTS);
  return {
    scenes: scenes.map((s) => ({
      key: s.rule.key,
      label: s.rule.label,
      products: s.products.map((p) => ({ ...toCardProduct(p), tagLabel: p.productType })),
    })),
  };
}

/** 推荐打分用的在售产品：精简卡片 + 类目/色系/场景标签 */
export interface RecommendedCandidate {
  card: V2CardProduct;
  category: string;
  color: string | null;
  scene: string;
}

export interface RecommendedData {
  // 无浏览历史时的兜底榜单（Best Sellers 前 MAX_RECOMMENDED）
  fallback: V2CardProduct[];
  // 全部在售产品按 handle 索引，供 client 按 localStorage 浏览历史做个性化推荐
  candidates: Record<string, RecommendedCandidate>;
}

export function getRecommendedData(): RecommendedData {
  const candidates: Record<string, RecommendedCandidate> = {};
  for (const t of taggedInStock()) {
    candidates[t.product.handle] = {
      card: toCardProduct(t.product),
      category: t.product.productType,
      color: t.color,
      scene: t.scene,
    };
  }
  return {
    fallback: getBestSellerProducts().slice(0, MAX_RECOMMENDED).map(toCardProduct),
    candidates,
  };
}
