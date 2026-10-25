/**
 * Shop the Look 单场景沉浸式组合页数据（2026-10-14 MVP）。
 * 场景全景图当前复用 pdp-lifestyle 现有种草图占位，后续按 docs/lifestyle-image-rules.md
 * 生成多商品全景图后替换（替换时同步重标热区坐标）。
 *
 * 热区坐标为图片百分比（0-100），相对于 <img> 渲染框，桌面/移动端自适应。
 * 选品走服务端 enrich，前台组件只拿精简卡片字段（口径同 home-sections.ts）。
 */

import { PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';

export interface SceneHotspotRef {
  /** 站内产品 handle（PRODUCTS_DATA 里的 handle，非 Shopify handle） */
  handle: string;
  /** 热区圆点中心在图上的百分比坐标 */
  x: number;
  y: number;
  /** 圆点 aria-label / 小卡上的位置说明 */
  label: string;
}

export interface SceneDef {
  slug: string;
  /** 场景名（列表卡与详情页标题） */
  title: string;
  /** 风格标签（换风格切换器上显示） */
  style: string;
  /** 一句话氛围文案 */
  tagline: string;
  heroImage: string;
  heroAlt: string;
  hotspots: SceneHotspotRef[];
}

const BOUCLE_WHITE = 'boucle-pillow-covers-white-45x45-mk-pc-boucle-white-45';
const BOUCLE_ROSE = 'boucle-pillow-covers-dustyrose-45x45-mk-pc-boucle-dustyrose-45';
const BOUCLE_SAGE = 'boucle-pillow-covers-sage-45x45-mk-pc-boucle-sage-45';
const BLANKET_CREAM =
  'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c26';
const CHAIR_CUSHION_CREAM = 'corduroy-chair-cushions-cream-95x45-mk-cushion-cord-cream';
const CHAIR_CUSHION_BLUE = 'corduroy-chair-cushions-dusty-blue-95x45-mk-cushion-cord-dustyblue';
const CORD_ROSE = 'corduroy-pillow-covers-dustyrose-45x45-mk-pc-cord-dustyrose-45';
const CORD_CARAMEL = 'corduroy-pillow-covers-caramel-45x45-mk-pc-cord-caramel-45';
const CORD_BLUE = 'corduroy-pillow-covers-dustyblue-45x45-mk-pc-cord-dustyblue-45';
const COTTON_CREAM = 'cotton-like-pillow-covers-cream-40x40-mk-pc-ctn-cream';
const OUTDOOR_CUSHION = 'outdoor-patio-cushion-rocking-chair-cushion-tufted-pads-set--b0cbt7b1ty';

export const SCENES: SceneDef[] = [
  {
    slug: 'entryway-bench',
    title: 'Come On In',
    style: 'Nordic Calm',
    tagline: 'A soft landing the moment you walk through the door.',
    heroImage: '/images/pdp-lifestyle/scene-entryway-bench.webp',
    heroAlt:
      'Bright entryway with a dark wooden bench, a cream bouclé pillow and slippers on a fluffy rug',
    hotspots: [
      { handle: BOUCLE_WHITE, x: 57, y: 49, label: 'On the bench' },
    ],
  },
  {
    slug: 'slow-morning-bedroom',
    title: 'The Slow Morning Bedroom',
    style: 'Cream',
    tagline: 'Bouclé pillows, a soft throw, and nowhere to be.',
    heroImage: '/images/pdp-lifestyle/pillow-boucle-bed.webp',
    heroAlt:
      'Sunlit bedroom with a wooden bed, cream and dusty rose bouclé pillows and a caramel knit throw',
    hotspots: [
      { handle: BOUCLE_WHITE, x: 33, y: 43, label: 'On the bed, left' },
      { handle: BOUCLE_ROSE, x: 64, y: 46, label: 'On the bed, right' },
      { handle: BLANKET_CREAM, x: 83, y: 84, label: 'End of the bed' },
    ],
  },
  {
    slug: 'sunny-reading-nook',
    title: 'The Sunny Reading Nook',
    style: 'Nordic Airy',
    tagline: 'A window seat, an open book, and pillows that hold you.',
    heroImage: '/images/pdp-lifestyle/pillow-boucle-nook.webp',
    heroAlt:
      'Bright window seat with cream and dusty rose bouclé pillows, a knit throw and an open book',
    hotspots: [
      { handle: BOUCLE_WHITE, x: 37, y: 40, label: 'By the window' },
      { handle: BOUCLE_ROSE, x: 75, y: 39, label: 'Corner of the seat' },
      { handle: BLANKET_CREAM, x: 88, y: 58, label: 'Over the edge' },
    ],
  },
  {
    slug: 'sage-sofa-afternoon',
    title: 'A Sage Sofa Afternoon',
    style: 'Soft Sage',
    tagline: 'Coffee, a magazine, and pillows in muted greens.',
    heroImage: '/images/pdp-lifestyle/pillow-boucle-sofa.webp',
    heroAlt:
      'Warm living room sofa with cream and sage bouclé pillows, a knit throw and a coffee on the table',
    hotspots: [
      { handle: BOUCLE_WHITE, x: 37, y: 41, label: 'Sofa, left' },
      { handle: BOUCLE_SAGE, x: 75, y: 36, label: 'Sofa, right' },
      { handle: BLANKET_CREAM, x: 15, y: 55, label: 'Over the armrest' },
    ],
  },
  {
    slug: 'corner-cafe-chair',
    title: 'The Corner Café Chair',
    style: 'Vintage Warm',
    tagline: 'A tufted seat, a hot cappuccino, a slower morning.',
    heroImage: '/images/pdp-lifestyle/cushion-lifestyle-cafe.webp',
    heroAlt:
      'Vintage café corner with a caramel corduroy tufted chair cushion by a rainy window',
    hotspots: [
      { handle: CHAIR_CUSHION_CREAM, x: 73, y: 58, label: 'On the bistro chair' },
    ],
  },
  {
    slug: 'golden-hour-corner',
    title: 'The Golden Hour Corner',
    style: 'Retro Mix',
    tagline: 'Dusk light, vinyl crackle, one perfectly soft pillow.',
    heroImage: '/images/pdp-lifestyle/pillow-boucle-wide.webp',
    heroAlt:
      'Leather lounge chair with a dusty rose bouclé pillow in warm dusk light beside a record player',
    hotspots: [
      { handle: BOUCLE_ROSE, x: 58, y: 51, label: 'On the leather chair' },
    ],
  },
  {
    slug: 'florist-workshop',
    title: "The Florist's Workshop",
    style: 'Garden Fresh',
    tagline: 'Peonies, twine, and a seat that waits for you.',
    heroImage: '/images/pdp-lifestyle/cushion-lifestyle-florist.webp',
    heroAlt:
      'Florist shop window with a wooden chair with a cream corduroy tufted cushion and pink peonies',
    hotspots: [
      { handle: CHAIR_CUSHION_CREAM, x: 28, y: 60, label: 'By the workbench' },
    ],
  },
  {
    slug: 'porch-at-dusk',
    title: 'The Porch at Dusk',
    style: 'Tropical Calm',
    tagline: 'Iced tea, ceiling fan, and a cushion built for long evenings.',
    heroImage: '/images/pdp-lifestyle/cushion-solids-porch.webp',
    heroAlt:
      'Tropical porch with a wicker chair with a deep green tufted cushion, iced tea on a side table',
    hotspots: [
      { handle: OUTDOOR_CUSHION, x: 55, y: 64, label: 'On the wicker chair' },
    ],
  },
  {
    slug: 'cat-nap-bed',
    title: 'The Cat-Nap Bed',
    style: 'Warm Minimal',
    tagline: 'Morning sun, corduroy pillows, and the cat approves.',
    heroImage: '/images/pdp-lifestyle/pillow-lifestyle-tall.webp',
    heroAlt:
      'Sunlit bedroom with dusty rose and caramel corduroy pillows, a knit throw and a cat on the bed',
    hotspots: [
      { handle: CORD_ROSE, x: 34, y: 45, label: 'Pillow, left' },
      { handle: CORD_CARAMEL, x: 63, y: 42, label: 'Pillow, right' },
      { handle: BLANKET_CREAM, x: 67, y: 68, label: 'Across the bed' },
    ],
  },
  {
    slug: 'vinyl-corner',
    title: 'The Vinyl Corner',
    style: 'Retro Warm',
    tagline: 'Records, rain on the window, and a chair that hugs back.',
    heroImage: '/images/pdp-lifestyle/pillow-lifestyle-wide.webp',
    heroAlt:
      'Cozy reading chair with caramel corduroy, green knit and cream tassel pillows beside a record player',
    hotspots: [
      { handle: CORD_CARAMEL, x: 52, y: 45, label: 'Center pillow' },
      { handle: BOUCLE_SAGE, x: 76, y: 42, label: 'Green knit pillow' },
      { handle: COTTON_CREAM, x: 40, y: 55, label: 'Tassel pillow' },
    ],
  },
  {
    slug: 'coastal-breakfast',
    title: 'Coastal Breakfast',
    style: 'Coastal Blue',
    tagline: 'Blue hydrangeas, iced coffee, and a seat by the sea.',
    heroImage: '/images/pdp-lifestyle/cushion-solids-coastal.webp',
    heroAlt:
      'Coastal dining nook with a wooden chair with a navy tufted cushion and blue pillow by the window',
    hotspots: [
      { handle: CHAIR_CUSHION_BLUE, x: 88, y: 58, label: 'On the dining chair' },
      { handle: CORD_BLUE, x: 62, y: 51, label: 'The blue pillow' },
    ],
  },
];

/** 详情页/弹层用的精简产品卡片字段 */
export interface SceneHotspotCard {
  handle: string;
  title: string;
  image: string;
  price: string;
  currency: string;
  inStock: boolean;
  variantId?: string;
  x: number;
  y: number;
  label: string;
}

export interface SceneViewData {
  slug: string;
  title: string;
  style: string;
  tagline: string;
  heroImage: string;
  heroAlt: string;
  hotspots: SceneHotspotCard[];
}

function buildScene(def: SceneDef): SceneViewData {
  const byHandle = new Map(
    enrichProductsWithShopifyData(PRODUCTS_DATA).map((p) => [p.handle, p])
  );
  const hotspots: SceneHotspotCard[] = [];
  for (const h of def.hotspots) {
    const p = byHandle.get(h.handle);
    if (!p) continue;
    hotspots.push({
      handle: p.handle,
      title: p.title,
      image: p.shopifyImages?.[0] ?? p.featuredImage ?? p.images[0]?.url ?? '',
      price: p.shopifyPrice ?? p.priceRange.minVariantPrice.amount,
      currency: p.shopifyCurrencyCode ?? p.priceRange.minVariantPrice.currencyCode,
      inStock: Boolean(p.hasShopifyData && p.shopifyAvailable),
      variantId: p.shopifyVariantId,
      x: h.x,
      y: h.y,
      label: h.label,
    });
  }
  return {
    slug: def.slug,
    title: def.title,
    style: def.style,
    tagline: def.tagline,
    heroImage: def.heroImage,
    heroAlt: def.heroAlt,
    hotspots,
  };
}

export function getSceneViewData(slug: string): SceneViewData | null {
  const def = SCENES.find((s) => s.slug === slug);
  return def ? buildScene(def) : null;
}

/** /scenes/ 瀑布流页：一次取全部场景（含热区卡片数据） */
export function getAllSceneViewData(): SceneViewData[] {
  return SCENES.map(buildScene);
}

/** 列表页 / 首页入口 / 换风格切换器用的轻量卡片 */
export function getSceneCards(): Pick<
  SceneDef,
  'slug' | 'title' | 'style' | 'tagline' | 'heroImage' | 'heroAlt'
>[] {
  return SCENES.map(({ slug, title, style, tagline, heroImage, heroAlt }) => ({
    slug,
    title,
    style,
    tagline,
    heroImage,
    heroAlt,
  }));
}
