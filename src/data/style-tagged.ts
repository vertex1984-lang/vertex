/**
 * Shop by Style 共享打标数据（2026-09 新增）：首页风格模块与 /featured-products/style/[style]/ 聚合页共用。
 * 与 featured-products/tagged.ts 的关键差异：风格**全类目参与**（含 Others/Decor/Dining），
 * 标签由 getStyleTag 规则现算（暂无持久化/人工覆盖；后续要人工改可仿 color/scene 加 product-tags.json 字段）。
 */
import {
  PRODUCTS_DATA,
  enrichProductsWithShopifyData,
  MakimooProduct,
} from '@/data/products';
import { MATERIALS_MAP } from '@/data/materials-map';
import { getStyleTag, STYLE_RULES, StyleTag } from '@/data/product-tags';
import { sortByWeight } from '@/lib/weights';

export interface StyledProduct extends MakimooProduct {
  styleTag: StyleTag;
}

// 打标用完整标题（素材库覆盖后、精简前），避免风格关键词被短标题截断
const fullTitleOf = (p: MakimooProduct) =>
  MATERIALS_MAP[p.asin.toLowerCase()]?.title || p.title;

// 全部在售产品（不过滤 NO_TAG_TYPES），按权重降序
export const ALL_STYLED: StyledProduct[] = sortByWeight(
  enrichProductsWithShopifyData(PRODUCTS_DATA)
    .filter((p) => p.hasShopifyData && p.shopifyAvailable)
    .map((p) => ({ ...p, styleTag: getStyleTag(fullTitleOf(p), p.productType) }))
);

/** 有 ≥1 个在售产品的风格 key（驱动静态页生成与首页展示）。
 *  展示顺序与 STYLE_RULES 数组顺序**解耦**（2026-09 用户定）：数组顺序是打标优先级
 *  （具体→宽泛，不能动）；展示顺序在下方显式定义——Modern/Farmhouse 受众最广排前，
 *  Hotel 与 Rattan & Woven 互换过位置；新增风格未列入的自动排在最后（按规则表顺序）。 */
const STYLE_DISPLAY_ORDER = [
  'modern',
  'farmhouse',
  'rattan-woven',
  'african-tribal',
  'hotel',
  'bohemian',
  'persian-vintage',
];

export const styleKeysWithProducts = () => {
  const keys = STYLE_RULES.map((r) => r.key).filter((key) =>
    ALL_STYLED.some((p) => p.styleTag.key === key)
  );
  return [
    ...STYLE_DISPLAY_ORDER.filter((k) => keys.includes(k)),
    ...keys.filter((k) => !STYLE_DISPLAY_ORDER.includes(k)),
  ];
};

// 风格一句话文案（聚合页描述 + 首页大卡副标题）
export const STYLE_BLURBS: Record<string, string> = {
  'african-tribal': 'Bold geometry and earthy tribal motifs with a collected soul.',
  'rattan-woven': 'Handwoven rattan, bamboo and shell — calm, natural, crafted.',
  bohemian: 'Free-spirited color and pattern, layered without rules.',
  'persian-vintage': 'Time-worn medallions and oriental florals, softly distressed.',
  farmhouse: 'Florals, lace and checks for a slow country morning.',
  hotel: 'Crisp white cotton and five-star bedding, every night.',
  modern: 'Clean lines, quiet solids and abstract geometry.',
};

export interface StyleCardData {
  key: string;
  label: string;
  count: number;
  blurb: string;
  /** 风格代表图（优先权重最高产品的 featuredImage 场景图，其次其首图） */
  image: string;
}

// 风格卡图片人工指定（2026-09 用户定）：key = 风格 key，value = 小写 asin。
// 指定后该风格卡用此产品的图（featuredImage > Shopify 首图 > 本地首图，与产品卡主图同优先级），
// 不受该产品是否在售影响（允许用缺货产品的图做风格门面）。
const STYLE_IMAGE_OVERRIDES: Record<string, string> = {
  hotel: 'duvset-white-full', // Elegant Crisp Solid 白色酒店风套件（用户指定）
};

/** 首页风格卡数据：按 STYLE_RULES 顺序，只含 ≥1 款在售产品的风格 */
export function styleCards(): StyleCardData[] {
  return styleKeysWithProducts().map((key) => {
    const rule = STYLE_RULES.find((r) => r.key === key)!;
    const products = ALL_STYLED.filter((p) => p.styleTag.key === key);
    // 人工指定图 > 自动选图（权重最高产品的 featuredImage，其次其首图）
    const overrideAsin = STYLE_IMAGE_OVERRIDES[key];
    const overrideProduct = overrideAsin
      ? enrichProductsWithShopifyData(PRODUCTS_DATA).find(
          (p) => p.asin.toLowerCase() === overrideAsin
        )
      : undefined;
    const withFeatured = products.find((p) => p.featuredImage);
    const first = overrideProduct || withFeatured || products[0];
    const image =
      first.featuredImage ||
      (first.shopifyImages && first.shopifyImages[0]) ||
      first.images[0]?.url ||
      '';
    return {
      key,
      label: rule.label,
      count: products.length,
      blurb: STYLE_BLURBS[key] || '',
      image,
    };
  });
}
