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
import { dedupeFamilyColors, clusterFamilies } from '@/lib/listing-dedupe';
import { getBestSellerProducts } from '@/data/featured-sections';
import { getVariantGroupOf } from '@/data/variant-groups';
import { buildBlanketFamilies } from '@/data/blanket-families';
import { familyKeyOf, familyColorOf } from '@/lib/family-cards';
import { buildGroupCards, groupKeyOfProduct, type GroupCard } from '@/lib/group-cards';
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

/** 只保留 V2ProductCard 渲染所需字段，减小传给 client 的体积。
 *  familyKey / familyColor（2026-10-20 用户定：全站产品卡统一为家族卡）：
 *  client 端按 familyKey 合并同族 SKU 为一张家族卡，familyColor 作卡片 colorLine */
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
    rating: p.rating,
    reviewCount: p.reviewCount,
    familyKey: familyKeyOf(p),
    familyColor: familyColorOf(p),
  };
}

// 在售产品 + 类目/色系/场景标签（只算一次，三个区共用）。
// Others / Decor 类目不参与 color/scene 分类（2026-09 用户定）：不打标签
//（color=null / scene=''，自然不会命中任何 COLOR_RULES / SCENE_RULES），只按类目参与推荐打分；
// Dining 类目 2026-10-21 全站下线，原 Dining 产品并入 Decor，同样不打标签
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
// 色系内先做变体族同色去重（同族同色的不同尺寸只占一个卡位，2026-09 用户定与列表页同步）。
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
    productsByColor[rule.key] = dedupeFamilyColors(sortByWeight(
      tagged.filter((t) => t.color === rule.key).map((t) => t.product)
    ))
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

// Shop by Scene：有 ≥MIN_PRODUCTS 款在售产品（变体族同色去重 + 按标题兜底去重后）的场景按
// SCENE_RULES 顺序展示，场景内按权重排序并做家族聚拢（同族色卡相邻），取前 MAX_PER_SCENE。
// 卡片类目标签位统一显示一级类目 productType（tagLabel）：productCategoryTag 对设置了二级类目
// 的产品会显示 Microfiber 等 shortLabel，同一区内 Bedding/Microfiber 混排观感不统一（2026-09 用户定）
export function getShopBySceneData(): ShopBySceneData {
  const tagged = taggedInStock();
  const scenes = SCENE_RULES.map((rule) => {
    const seen = new Set<string>();
    const products = clusterFamilies(
      dedupeFamilyColors(sortByWeight(
        tagged.filter((t) => t.scene === rule.key).map((t) => t.product)
      )).filter((p) => {
        const key = titleKey(p.title);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
    ).slice(0, MAX_PER_SCENE);
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

/**
 * PDP "You May Also Like" 关联推荐（2026-09-29 用户定：信任条下方、Brand Story 上方）。
 * 相对当前商品打分（PDP 意图明确，不看浏览历史）：同类目 +3、同色系 +2、同场景 +1；
 * 排除当前商品与当前变体组全体成员（同款异色/多尺寸已在购买区色点/尺寸选择器展示），
 * 标题去重（同款只占一位）后按分数降序，同分按全站 Best Sellers 顺序；不足 10 用它补足。
 * 组卡（2026-10-22 用户定：一组一卡 + 色卡）：打分排序后按组 key 合并（同组只留最高分
 * 成员决定卡位与首屏选中色 initialColor），色卡变体 = 同组全部在售颜色，取前 10 个组。
 */
export function getPdpRelatedFamilies(handle: string): GroupCard[] {
  const tagged = taggedInStock();
  // 组卡表：同组在售成员并卡（buildBlanketFamilies 需看到全部尺寸 SKU 才有正确 From 价），
  // 卡面标题走 familyCardDisplay（2026-10-21 用户定：全站卡面标题对齐一级类目 PLP）
  const groupCardByKey = new Map(
    buildGroupCards(buildBlanketFamilies(tagged.map((t) => t.product))).map((c) => [c.key, c])
  );
  const toGroupCard = (p: MakimooProduct): GroupCard | null => {
    const c = groupCardByKey.get(groupKeyOfProduct(p));
    // 首屏选中色 = 该命中成员的家族颜色（卡面主图/价格/评分 = 打分最高成员的色）
    return c ? { ...c, initialColor: familyColorOf(p) || undefined } : null;
  };

  const current = tagged.find((t) => t.product.handle === handle);
  if (!current)
    return getBestSellerProducts()
      .slice(0, MAX_RECOMMENDED)
      .flatMap((p) => {
        const c = toGroupCard(p);
        return c ? [c] : [];
      });

  const excludeAsins = new Set<string>([current.product.asin.toLowerCase()]);
  getVariantGroupOf(current.product.asin)?.members.forEach((m) =>
    excludeAsins.add(m.asin.toLowerCase())
  );

  // 同分 tiebreak：全站 Best Sellers 顺序
  const bestOrder = new Map(getBestSellerProducts().map((p, i) => [p.handle, i]));

  const seen = new Set<string>();
  const scored = tagged
    .filter((t) => !excludeAsins.has(t.product.asin.toLowerCase()))
    .map((t) => {
      let score = 0;
      if (t.product.productType === current.product.productType) score += 3;
      if (t.color && t.color === current.color) score += 2;
      if (t.scene && t.scene === current.scene) score += 1;
      return { product: t.product, score };
    })
    .filter((s) => s.score > 0)
    .filter((s) => {
      const key = titleKey(s.product.title);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        (bestOrder.get(a.product.handle) ?? 9999) - (bestOrder.get(b.product.handle) ?? 9999)
    );

  // 组合并：按组 key 折叠（分数降序遍历，同组首个 = 最高分成员），取前 10 个组
  const picks: MakimooProduct[] = [];
  const pickedGroups = new Set<string>();
  for (const s of scored) {
    if (picks.length >= MAX_RECOMMENDED) break;
    const key = groupKeyOfProduct(s.product);
    if (pickedGroups.has(key)) continue;
    pickedGroups.add(key);
    picks.push(s.product);
  }

  // 不足 10 个组时用全站 Best Sellers 补足（同口径排除与去重）
  if (picks.length < MAX_RECOMMENDED) {
    const pickedHandles = new Set(picks.map((p) => p.handle));
    for (const p of getBestSellerProducts()) {
      if (picks.length >= MAX_RECOMMENDED) break;
      if (excludeAsins.has(p.asin.toLowerCase()) || pickedHandles.has(p.handle)) continue;
      const groupKey = groupKeyOfProduct(p);
      if (pickedGroups.has(groupKey)) continue;
      const key = titleKey(p.title);
      if (seen.has(key)) continue;
      seen.add(key);
      pickedGroups.add(groupKey);
      picks.push(p);
    }
  }
  return picks.flatMap((p) => {
    const c = toGroupCard(p);
    return c ? [c] : [];
  });
}
