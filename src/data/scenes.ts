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
  /**
   * 热区唯一键（可选）。同一场景同一产品出现多次时必须给不同 spotId，
   * 否则 React key 与选中集合会互相覆盖。
   */
  spotId?: string;
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
  /** 上线时间（ISO）。列表按它倒序，新场景排最前；无值视为最旧。 */
  addedAt?: string;
  /** 宽幅场景（横图）：详情页按全宽自然比例展示，不做 82vh 限高。 */
  heroWide?: boolean;
}

const BOUCLE_WHITE = 'boucle-pillow-covers-white-45x45-mk-pc-boucle-white-45';
const BOUCLE_ROSE = 'boucle-pillow-covers-dustyrose-45x45-mk-pc-boucle-dustyrose-45';
const BOUCLE_SAGE = 'boucle-pillow-covers-sage-45x45-mk-pc-boucle-sage-45';
const KNIT_THROW_KHAKI = 'makimoo-openwork-knit-throw-blanket-with-tassels-50-x-71-in-khaki';
const CHUNKY_THROW_OAT = 'makimoo-chunky-knit-throw-blanket-with-tassels-50-x-68-in-oat';
const CHAIR_CUSHION_CREAM = 'corduroy-chair-cushions-cream-95x45-mk-cushion-cord-cream';
const CUSHION_COFFEE = 'outdoor-patio-cushion-rocking-chair-cushion-tufted-pads-set--b0cbt7rfk2';
const CHAIR_CUSHION_NAVY = 'makimoo-2-pack-outdoor-chair-cushions-water-resistant-solid-b0f1v8vmp4';
const CORD_ROSE = 'corduroy-pillow-covers-dustyrose-45x45-mk-pc-cord-dustyrose-45';
const CORD_CARAMEL = 'corduroy-pillow-covers-caramel-45x45-mk-pc-cord-caramel-45';
const CORD_BLUE = 'corduroy-pillow-covers-dustyblue-45x45-mk-pc-cord-dustyblue-45';
const OUTDOOR_CUSHION_GREEN = 'makimoo-outdoor-chair-cushions-2-pack-waterproof-tufted-b0gjsttgy5';
const CTN_BLUE_45 = 'cotton-like-pillow-covers-dustyblue-45x45-mk-pc-ctn-dustyblue-45';
const CORD_ROSE_45 = 'corduroy-pillow-covers-dustyrose-45x45-mk-pc-cord-dustyrose-45';
const CORD_CARAMEL_45 = 'corduroy-pillow-covers-caramel-45x45-mk-pc-cord-caramel-45';
const CORD_OLIVE_45 = 'corduroy-pillow-covers-olive-45x45-mk-pc-cord-olive-45';
const CORD_CHARCOAL_45 = 'corduroy-pillow-covers-charcoal-45x45-mk-pc-cord-charcoal-45';
const CHUNKY_THROW_ORANGE = 'makimoo-chunky-knit-throw-blanket-with-tassels-50-x-68-in-orange';
const CHUNKY_THROW_CREAM = 'makimoo-chunky-knit-throw-blanket-with-tassels-50-x-68-in-cream';
const CHUNKY_THROW_GREY = 'makimoo-chunky-knit-throw-blanket-with-tassels-50-x-68-in-grey';
const KNIT_THROW_CREAM = 'makimoo-openwork-knit-throw-blanket-with-tassels-50-x-71-in-cream';
const LINEN_BLUE = '100-linen-duvet-cover-set-queen-size-3-piece-bedding-set-1-linen3-dustyblue-queen';
const BEDSET_LILAC = 'makimoo-4-piece-bedding-set-queen-duvet-cover-88-x-88-in-bedset4-lilac-queen';
const POMPOM_LILAC = 'makimoo-queen-bedding-set-4-piece-embossed-velvet-pom-pom-bloom-queen';
const FAUX_FUR_RUG_WHITE =
  'nordic-oval-plush-area-rug-tie-dyed-silky-faux-fur-shag-1688-996768645117-c3';
const LINEN_OAT = '100-linen-duvet-cover-set-queen-3-piece-bedding-set-with-linen3-oatmeal-queen';
const LINEN_SAGE = 'makimoo-100-linen-duvet-cover-set-3-piece-bedding-set-with-linen3-sage-queen';
const JACTHROW_P_BLUE = 'makimoo-jacquard-knit-throw-blanket-lightweight-nordic-130-x-190-cm-paisley-blue';
const CTN_CREAM_45 = 'cotton-like-pillow-covers-cream-45x45-mk-pc-ctn-cream-45';
const SATEEN_MUSTARD = 'makimoo-queen-bedding-set-4-piece-cotton-sateen-mustard-queen';
const RABBIT_RUG_CREAM = 'luxurious-plush-faux-rabbit-fur-area-rug-ultra-soft-carpet-1688-595229918569-c2';
const RABBIT_THROW_PURPLE = 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c43';
const BEDSET_BEIGE = 'makimoo-queen-size-4-piece-bedding-set-duvet-cover-fitted-bedset4-beige-queen';
const PILLOW_INSERT_WIDE = 'throw-pillow-inserts-30-x-50cm-12-x-20-cushion-inserts-hollo-b0cqbzm49v';
const LINEN_IVORY = 'makimoo-100-linen-duvet-cover-set-3-pieces-queen-size-with-linen3-ivory-queen';
const CHAIR_CUSHION_BLUE = 'corduroy-chair-cushions-dusty-blue-95x45-mk-cushion-cord-dustyblue';
const BEDSET_PINK_FULL = '4-piece-duvet-cover-bedding-set-with-fitted-sheet-and-2-bedset4-pink-full';
const BEDSET_PINK_QUEEN = 'makimoo-queen-duvet-cover-set-4-pieces-with-fitted-sheet-bedset4-pink-queen';
const PERCALEJAC_OATBEIGE = 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-oatbeige-queen';
const SATEEN_TAUPE = 'makimoo-queen-bedding-set-4-piece-cotton-sateen-taupe-queen';
const POMPOM_BLUSH = 'makimoo-queen-bedding-set-4-piece-embossed-velvet-pom-pom-blush-queen';
const BOHO_TEAL = 'makimoo-bohemian-chevron-knit-throw-blanket-with-tassels-50-x-71-in-teal';
const POMPOM_VINE = 'makimoo-queen-bedding-set-4-piece-embossed-velvet-pom-pom-vine-queen';
const SATEEN_CREAM = 'makimoo-queen-bedding-set-4-piece-cotton-sateen-cream-queen';
const SATEEN_TERRACOTTA = 'makimoo-queen-bedding-set-4-piece-cotton-sateen-terracotta-queen';
const TOWEL_GREY_BATH = 'long-staple-cotton-towel-lightgrey-40x70-mk-towel-lsc-lightgrey-40x70';
const TOWEL_ROSE = 'long-staple-cotton-towel-dustyrose-30x56-mk-towel-lsc-dustyrose-30x56';
const RABBIT_RUG_CAMEL = 'ultra-soft-faux-rabbit-fur-area-rug-for-modern-living-room-1688-595229918569';
const MAT_SISAL = '2-pack-indoor-entryway-rugs-imitation-sisal-door-mats-non-1688-1016436401519';
const RUG_PERSIAN_BS12 = 'vintage-persian-area-rug-bs-12-1688-1052742241013-c24';
const JACTHROW_KHAKI = 'makimoo-jacquard-knit-throw-blanket-lightweight-nordic-130-x-190-cm-paisley-beige';
const WASHJAC_CREAM = 'makimoo-queen-bedding-set-4-piece-washed-cotton-jacquard-cream-queen';
const BOHO_OLIVE = 'makimoo-bohemian-chevron-knit-throw-blanket-with-tassels-50-x-71-in-olive';
const CTN_SAGE_45 = 'cotton-like-pillow-covers-sage-45x45-mk-pc-ctn-sage-45';
const PERCALE_NUDE = 'makimoo-queen-duvet-cover-set-3-piece-cotton-percale-nude-queen';
const LINEN_CHARCOAL = '100-linen-duvet-cover-set-3-pieces-queen-with-1-duvet-cover-linen3-charcoal-queen';
const PERCALEJAC_HAZE = 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-haze-queen';
const CORD_COFFEE = 'outdoor-patio-cushion-rocking-chair-cushion-tufted-pads-set--b0cbt7rfk2';
const OUTDOOR_TULIP = 'set-of-2-outdoor-dining-chair-cushions-patio-seating-cushion-b0cc5vnqy3';
const TOWEL_SAGE_BATH = 'long-staple-cotton-towel-sage-40x70-mk-towel-lsc-sage-40x70';
const TOWEL_ROSE_BATH = 'long-staple-cotton-towel-dustyrose-40x70-mk-towel-lsc-dustyrose-40x70';
const TOWEL_CREAM_BATH = 'long-staple-cotton-towel-cream-40x70-mk-towel-lsc-cream-40x70';
const POMPOM_SWIRL = 'makimoo-queen-bedding-set-4-piece-embossed-velvet-pom-pom-swirl-queen';
const POMPOM_INK = 'makimoo-queen-bedding-set-4-piece-embossed-velvet-pom-pom-ink-queen';
const PERCALE_SKY = 'makimoo-queen-duvet-cover-set-3-piece-cotton-percale-sky-queen';
const JACTHROW_HB_BLACK = 'makimoo-jacquard-knit-throw-blanket-lightweight-nordic-130-x-180-cm-hb-black';
const KNIT_THROW_GREY = 'makimoo-openwork-knit-throw-blanket-with-tassels-50-x-71-in-grey';
const PERSIAN_BOHO_C12 = 'vintage-persian-boho-area-rug-soft-faux-cashmere-non-slip-1688-1052742241013-c12';
const POMPOM_LEAF = 'makimoo-queen-bedding-set-4-piece-embossed-velvet-pom-pom-leaf-queen';
const SATEEN_BEIGE = 'makimoo-queen-bedding-set-4-piece-cotton-sateen-beige-queen';
const KNIT_THROW_PINK = 'makimoo-openwork-knit-throw-blanket-with-tassels-50-x-71-in-pink';
const PERCALESTRIPE_PETAL = 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-stripe-petal-queen';
const PERCALEJAC_ROSE = 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-rose-queen';
const MK_CUSHION_CORD_CREAM = 'corduroy-chair-cushions-cream-95x45-mk-cushion-cord-cream';
const BOUCLE_OATMEAL_45 = 'boucle-pillow-covers-oatmeal-45x45-mk-pc-boucle-oatmeal-45';

export const SCENES: SceneDef[] = [
  {
    slug: 'snowy-pompom-cabin',
    title: 'The Snowy Pompom Cabin',
    style: 'Alpine Winter',
    tagline: 'Dusty leaf velvet, an oat knit, and snow on the pines.',
    heroImage: '/images/scenes/snowy-pompom-cabin.webp',
    heroAlt: 'Alpine cabin bedroom with dusty blue leaf embossed bedding, white pom-pom trim, an oat chunky knit and a cream fur rug',
    addedAt: '2026-11-02T11:10:00Z',
    hotspots: [
      { spotId: 'leaf-bed', handle: POMPOM_LEAF, x: 38, y: 57, label: 'The bed' },
      { spotId: 'oat-throw', handle: CHUNKY_THROW_OAT, x: 58, y: 64, label: 'Across the foot' },
      { spotId: 'fur-rug', handle: RABBIT_RUG_CREAM, x: 50, y: 88, label: 'On the floor' },
    ],
  },
  {
    slug: 'rose-check-cabin',
    title: 'The Rose Check Cabin',
    style: 'Rustic Cabin',
    tagline: 'Rose jacquard, burnt orange wool, and cream fur by the fire.',
    heroImage: '/images/scenes/rose-check-cabin.webp',
    heroAlt: 'Rustic cabin bedroom with dusty pink jacquard bedding, a burnt orange chunky knit and a cream faux fur rug',
    addedAt: '2026-11-02T11:08:00Z',
    hotspots: [
      { spotId: 'rose-bed', handle: PERCALEJAC_ROSE, x: 35, y: 60, label: 'The bed' },
      { spotId: 'orange-throw', handle: CHUNKY_THROW_ORANGE, x: 52, y: 57, label: 'Across the foot' },
      { spotId: 'fur-rug', handle: RABBIT_RUG_CREAM, x: 42, y: 87, label: 'On the floor' },
    ],
  },
  {
    slug: 'champagne-dark-suite',
    title: 'The Champagne Suite',
    style: 'Dark Luxe',
    tagline: 'Champagne sateen, walnut panelling and low lamplight.',
    heroImage: '/images/scenes/champagne-dark-suite.webp',
    heroAlt: 'Dark luxe bedroom with champagne beige sateen bedding under walnut panelling and brass sconces',
    addedAt: '2026-11-02T11:07:00Z',
    hotspots: [
      { spotId: 'beige-bed', handle: SATEEN_BEIGE, x: 48, y: 62, label: 'The bed' },
      { spotId: 'charcoal-pillow', handle: CORD_CHARCOAL_45, x: 60, y: 46, label: 'Charcoal pillow' },
    ],
  },
  {
    slug: 'seaside-sky-suite',
    title: 'The Seaside Sky Suite',
    style: 'Coastal Sateen',
    tagline: 'Sky blue sateen with a herringbone band and the sea beyond.',
    heroImage: '/images/scenes/seaside-sky-suite.webp',
    heroAlt: 'Seaside bedroom with sky blue sateen bedding, a black white herringbone throw and a charcoal corduroy pillow',
    addedAt: '2026-11-02T11:06:00Z',
    hotspots: [
      { spotId: 'sky-bed', handle: PERCALE_SKY, x: 55, y: 65, label: 'The bed' },
      { spotId: 'hb-throw', handle: JACTHROW_HB_BLACK, x: 68, y: 58, label: 'Across the bed' },
      { spotId: 'cord-pillow', handle: CORD_CHARCOAL_45, x: 80, y: 47, label: 'Charcoal pillow' },
    ],
  },
  {
    slug: 'greenhouse-oat-room',
    title: 'The Greenhouse Oat Room',
    style: 'Conservatory',
    tagline: 'Oat linen, ferns on every sill, and a tufted chair.',
    heroImage: '/images/scenes/greenhouse-oat-room.webp',
    heroAlt: 'Greenhouse sunroom bedroom with oatmeal linen bedding and a cream tufted corduroy chair cushion',
    addedAt: '2026-11-02T11:05:00Z',
    hotspots: [
      { spotId: 'oat-bed', handle: LINEN_OAT, x: 57, y: 74, label: 'The bed' },
      { spotId: 'chair-cushion', handle: MK_CUSHION_CORD_CREAM, x: 26, y: 70, label: 'On the chair' },
    ],
  },
  {
    slug: 'tatami-sage-summer',
    title: 'The Tatami Sage Summer',
    style: 'Japanese Summer',
    tagline: 'Sage linen, a teal chevron sash, and maple at the veranda.',
    heroImage: '/images/scenes/tatami-sage-summer.webp',
    heroAlt: 'Japanese tatami room with sage linen bedding, a teal chevron throw and a sage pillow',
    addedAt: '2026-11-02T11:04:00Z',
    hotspots: [
      { spotId: 'sage-bed', handle: LINEN_SAGE, x: 42, y: 64, label: 'The bed' },
      { spotId: 'teal-throw', handle: BOHO_TEAL, x: 70, y: 70, label: 'Across the bed' },
      { spotId: 'sage-pillow', handle: CTN_SAGE_45, x: 84, y: 52, label: 'Sage pillow' },
    ],
  },
  {
    slug: 'cream-knit-bench',
    title: 'The Cream Knit Bench',
    style: 'Knitwear Study',
    tagline: 'Openwork cream, tassels and afternoon sun.',
    heroImage: '/images/scenes/cream-knit-bench.webp',
    heroAlt: 'Wide cream openwork knit throw with tassels folded on a rattan bench in warm light',
    heroWide: true,
    addedAt: '2026-11-02T11:03:00Z',
    hotspots: [
      { spotId: 'cream-throw', handle: KNIT_THROW_CREAM, x: 30, y: 40, label: 'The throw' },
      { spotId: 'sisal-mat', handle: MAT_SISAL, x: 70, y: 86, label: 'On the floor' },
    ],
  },
  {
    slug: 'oat-sunset-retreat',
    title: 'The Oat Sunset Retreat',
    style: 'Golden Dusk',
    tagline: 'Oat linen and burnt orange wool at last light.',
    heroImage: '/images/scenes/oat-sunset-retreat.webp',
    heroAlt: 'Golden hour bedroom with oatmeal linen bedding and a burnt orange chunky knit throw',
    addedAt: '2026-11-02T11:02:00Z',
    hotspots: [
      { spotId: 'oat-bed', handle: LINEN_OAT, x: 45, y: 62, label: 'The bed' },
      { spotId: 'orange-throw', handle: CHUNKY_THROW_ORANGE, x: 48, y: 55, label: 'Across the bed' },
      { spotId: 'fur-rug', handle: RABBIT_RUG_CREAM, x: 35, y: 88, label: 'On the floor' },
    ],
  },
  {
    slug: 'blush-stripe-room',
    title: 'The Blush Stripe Room',
    style: 'Soft Stripe',
    tagline: 'Blush stripes, dusty pink knits and a round of cream.',
    heroImage: '/images/scenes/blush-stripe-room.webp',
    heroAlt: 'Soft pink bedroom with blush stripe bedding, a dusty pink knit throw and a round cream shag rug',
    addedAt: '2026-11-02T11:01:00Z',
    hotspots: [
      { spotId: 'stripe-bed', handle: PERCALESTRIPE_PETAL, x: 45, y: 62, label: 'The bed' },
      { spotId: 'pink-throw', handle: KNIT_THROW_PINK, x: 93, y: 67, label: 'On the armchair' },
      { spotId: 'round-rug', handle: FAUX_FUR_RUG_WHITE, x: 22, y: 88, label: 'On the floor' },
    ],
  },
  {
    slug: 'tuscan-swirl-suite',
    title: 'The Tuscan Swirl Villa',
    style: 'Tuscan Sun',
    tagline: 'Caramel swirl velvet, burnt orange wool, and hillside light.',
    heroImage: '/images/scenes/tuscan-swirl-suite.webp',
    heroAlt: 'Tuscan stone villa bedroom with caramel swirl velvet bedding and a burnt orange chunky knit throw',
    addedAt: '2026-11-02T10:10:00Z',
    hotspots: [
      { spotId: 'swirl-bed', handle: POMPOM_SWIRL, x: 58, y: 62, label: 'The bed' },
      { spotId: 'rust-throw', handle: CHUNKY_THROW_ORANGE, x: 50, y: 57, label: 'Across the foot' },
    ],
  },
  {
    slug: 'ryokan-plaid-dawn',
    title: 'The Ryokan Plaid Dawn',
    style: 'Japanese Ryokan',
    tagline: 'Hazy jacquard bedding, a khaki knit, and maple light on tatami.',
    heroImage: '/images/scenes/ryokan-plaid-dawn.webp',
    heroAlt: 'Japanese ryokan bedroom with hazy blue-grey jacquard bedding and a khaki openwork knit throw on tatami mats',
    addedAt: '2026-11-02T10:09:00Z',
    hotspots: [
      { spotId: 'haze-bed', handle: PERCALEJAC_HAZE, x: 48, y: 60, label: 'The bed' },
      { spotId: 'khaki-throw', handle: KNIT_THROW_KHAKI, x: 63, y: 62, label: 'Draped on the bed' },
    ],
  },
  {
    slug: 'ink-floral-loft',
    title: 'The Ink Floral Loft',
    style: 'Scandi Mono',
    tagline: 'Ink-drawn florals, bobble cream, and a white shag.',
    heroImage: '/images/scenes/ink-floral-loft.webp',
    heroAlt: 'Scandinavian bedroom with white ink floral bedding, black pom-pom trim and a cream bobble knit throw',
    addedAt: '2026-11-02T10:07:00Z',
    hotspots: [
      { spotId: 'ink-bed', handle: POMPOM_INK, x: 62, y: 66, label: 'The bed' },
      { spotId: 'cream-throw', handle: KNIT_THROW_CREAM, x: 44, y: 72, label: 'Across the foot' },
      { spotId: 'shag-rug', handle: RABBIT_RUG_CREAM, x: 40, y: 88, label: 'On the floor' },
    ],
  },
  {
    slug: 'boho-mauve-hearth',
    title: 'The Boho Hearth',
    style: 'Boho Warm',
    tagline: 'Mauve linen, fairy lights, and a fire at dusk.',
    heroImage: '/images/scenes/boho-mauve-hearth.webp',
    heroAlt: 'Boho bedroom with dusty rose linen bedding, a cream knit throw and oat boucle pillows by the fire',
    addedAt: '2026-11-02T10:06:00Z',
    hotspots: [
      { spotId: 'nude-bed', handle: PERCALE_NUDE, x: 48, y: 62, label: 'The bed' },
      { spotId: 'cream-throw', handle: KNIT_THROW_CREAM, x: 38, y: 55, label: 'Across the bed' },
      { spotId: 'boucle-pillow', handle: BOUCLE_OATMEAL_45, x: 84, y: 60, label: 'Boucle pillows' },
    ],
  },
  {
    slug: 'sky-blue-mono-suite',
    title: 'The Sky Blue Suite',
    style: 'Modern Mono',
    tagline: 'Sky blue sateen against black, white and herringbone.',
    heroImage: '/images/scenes/sky-blue-mono-suite.webp',
    heroAlt: 'Modern monochrome bedroom with sky blue percale bedding, a black and white herringbone throw and a brown corduroy pillow',
    addedAt: '2026-11-02T10:05:00Z',
    hotspots: [
      { spotId: 'sky-bed', handle: PERCALE_SKY, x: 60, y: 68, label: 'The bed' },
      { spotId: 'hb-throw', handle: JACTHROW_HB_BLACK, x: 30, y: 60, label: 'Across the foot' },
      { spotId: 'cord-pillow', handle: CORD_CHARCOAL_45, x: 59, y: 52, label: 'Charcoal pillow' },
    ],
  },
  {
    slug: 'marrakech-rose-suite',
    title: 'The Marrakech Rose Suite',
    style: 'Moroccan Dust',
    tagline: 'Rose-clay sateen under carved cedar and lantern light.',
    heroImage: '/images/scenes/marrakech-rose-suite.webp',
    heroAlt: 'Moroccan bedroom with rose clay sateen bedding under a carved cedar arch and brass lanterns',
    addedAt: '2026-11-02T10:04:00Z',
    hotspots: [
      { spotId: 'clay-bed', handle: SATEEN_TERRACOTTA, x: 55, y: 60, label: 'The bed' },
    ],
  },
  {
    slug: 'sundown-persian-lounge',
    title: 'The Sundown Lounge',
    style: 'Rustic Modern',
    tagline: 'White linen sofa, burnt orange wool and a heriz at sundown.',
    heroImage: '/images/scenes/sundown-persian-lounge.webp',
    heroAlt: 'Wide living room at sundown with a white linen sofa, an orange chunky knit throw, a sage pillow and a vintage persian rug',
    heroWide: true,
    addedAt: '2026-11-02T10:03:00Z',
    hotspots: [
      { spotId: 'persian-rug', handle: PERSIAN_BOHO_C12, x: 30, y: 72, label: 'Persian rug' },
      { spotId: 'sage-pillow', handle: CTN_SAGE_45, x: 93, y: 43, label: 'Sage pillow' },
      { spotId: 'orange-throw', handle: CHUNKY_THROW_ORANGE, x: 78, y: 56, label: 'Over the arm' },
    ],
  },
  {
    slug: 'sage-bath-ritual',
    title: 'The Sage Bath Ritual',
    style: 'Herbal Spa',
    tagline: 'Sage towelling, brass fixtures and eucalyptus by the tub.',
    heroImage: '/images/scenes/sage-bath-ritual.webp',
    heroAlt: 'Farmhouse bathroom with sage towels on hooks, a cream towel on the clawfoot tub and brass fixtures',
    addedAt: '2026-11-02T10:02:00Z',
    hotspots: [
      { spotId: 'sage-towel', handle: TOWEL_SAGE_BATH, x: 56, y: 42, label: 'Sage towels' },
      { spotId: 'cream-towel', handle: TOWEL_CREAM_BATH, x: 35, y: 66, label: 'On the tub' },
    ],
  },
  {
    slug: 'parisian-cream-suite',
    title: 'The Parisian Cream Suite',
    style: 'French Cream',
    tagline: 'Ivory sateen, gilt mirrors and soft light on the parquet.',
    heroImage: '/images/scenes/parisian-cream-suite.webp',
    heroAlt: 'Parisian bedroom with ivory sateen bedding, a light grey knit throw and a cream shag rug under a boucle bench',
    addedAt: '2026-11-02T10:01:00Z',
    hotspots: [
      { spotId: 'cream-bed', handle: SATEEN_CREAM, x: 35, y: 70, label: 'The bed' },
      { spotId: 'grey-throw', handle: KNIT_THROW_GREY, x: 58, y: 60, label: 'Across the bed' },
      { spotId: 'shag-rug', handle: RABBIT_RUG_CREAM, x: 30, y: 90, label: 'On the floor' },
    ],
  },
  {
    slug: 'japandi-taupe-suite',
    title: 'The Japandi Taupe Suite',
    style: 'Japandi Loft',
    tagline: 'Taupe sateen, travertine stone, and an olive tree at high noon.',
    heroImage: '/images/scenes/japandi-taupe-suite.webp',
    heroAlt: 'Japandi loft bedroom with taupe sateen bedding, a travertine bench and a cream shag rug under an olive tree',
    addedAt: '2026-11-01T14:10:00Z',
    hotspots: [
      { spotId: 'taupe-bed', handle: SATEEN_TAUPE, x: 55, y: 62, label: 'The bed' },
      { spotId: 'floor-rug', handle: RABBIT_RUG_CREAM, x: 60, y: 93, label: 'On the floor' },
    ],
  },
  {
    slug: 'cottage-pompom-garden',
    title: 'The Cottage Garden Room',
    style: 'English Cottage',
    tagline: 'Vine jacquard, sage towels on the ladder, and a bobble throw.',
    heroImage: '/images/scenes/cottage-pompom-garden.webp',
    heroAlt: 'English cottage bedroom with cream vine jacquard bedding, sage towels on a ladder and a cream bobble knit throw',
    addedAt: '2026-11-01T14:09:00Z',
    hotspots: [
      { spotId: 'vine-bed', handle: POMPOM_VINE, x: 44, y: 68, label: 'The bed' },
      { spotId: 'bobble-throw', handle: KNIT_THROW_CREAM, x: 67, y: 64, label: 'Across the bed' },
      { spotId: 'sage-towel', handle: TOWEL_SAGE_BATH, x: 80, y: 28, label: 'Sage towels' },
    ],
  },
  {
    slug: 'lakeside-gingham-cabin',
    title: 'The Lakeside Gingham Cabin',
    style: 'Lakeside Cabin',
    tagline: 'Dusty blue jacquard, an oat knit throw, and autumn light on the water.',
    heroImage: '/images/scenes/lakeside-gingham-cabin.webp',
    heroAlt: 'Lakeside cabin bedroom with dusty blue percale jacquard bedding and an oat chunky knit throw',
    addedAt: '2026-11-01T14:08:00Z',
    hotspots: [
      { spotId: 'haze-bed', handle: PERCALEJAC_HAZE, x: 40, y: 62, label: 'The bed' },
      { spotId: 'oat-throw', handle: CHUNKY_THROW_OAT, x: 69, y: 59, label: 'Draped on the bed' },
    ],
  },
  {
    slug: 'olive-terrace-patio',
    title: 'The Olive Terrace',
    style: 'Mediterranean Patio',
    tagline: 'Wicker loungers under bougainvillea and a basket of knits.',
    heroImage: '/images/scenes/olive-terrace-patio.webp',
    heroAlt: 'Mediterranean patio with wicker chaise lounges, a corduroy tufted cushion and a woven sisal rug',
    addedAt: '2026-11-01T14:07:00Z',
    hotspots: [
      { spotId: 'seat-cushion', handle: CORD_COFFEE, x: 38, y: 68, label: 'Lounge cushion' },
      { spotId: 'tulip-cushion', handle: OUTDOOR_TULIP, x: 72, y: 64, label: 'Tulip cushions' },
      { spotId: 'patio-rug', handle: MAT_SISAL, x: 75, y: 90, label: 'On the floor' },
    ],
  },
  {
    slug: 'blush-nude-morning',
    title: 'Blush Morning Light',
    style: 'Soft Minimal',
    tagline: 'Nude pink percale and a bobble throw in first light.',
    heroImage: '/images/scenes/blush-nude-morning.webp',
    heroAlt: 'Soft minimal bedroom with nude pink percale bedding and a cream bobble knit throw',
    addedAt: '2026-11-01T14:06:00Z',
    hotspots: [
      { spotId: 'nude-bed', handle: PERCALE_NUDE, x: 58, y: 70, label: 'The bed' },
      { spotId: 'bobble-throw', handle: KNIT_THROW_CREAM, x: 71, y: 68, label: 'Across the bed' },
    ],
  },
  {
    slug: 'charcoal-loft-evening',
    title: 'The Concrete Loft',
    style: 'Wabi-Sabi Loft',
    tagline: 'Charcoal linen, a burnt orange knit, and concrete above.',
    heroImage: '/images/scenes/charcoal-loft-evening.webp',
    heroAlt: 'Wabi-sabi loft bedroom with charcoal linen bedding and a burnt orange chunky knit throw',
    addedAt: '2026-11-01T14:05:00Z',
    hotspots: [
      { spotId: 'charcoal-bed', handle: LINEN_CHARCOAL, x: 43, y: 57, label: 'The bed' },
      { spotId: 'orange-throw', handle: CHUNKY_THROW_ORANGE, x: 72, y: 66, label: 'Over the bench' },
    ],
  },
  {
    slug: 'provence-terracotta-suite',
    title: 'The Provence Terracotta Suite',
    style: 'Provence Farmhouse',
    tagline: 'Terracotta tones, dusty blue paisley, and lavender at the window.',
    heroImage: '/images/scenes/provence-terracotta-suite.webp',
    heroAlt: 'Provence bedroom with terracotta bedding, a dusty blue paisley throw and a cream shag rug',
    addedAt: '2026-11-01T14:03:00Z',
    hotspots: [
      { spotId: 'terracotta-bed', handle: SATEEN_TERRACOTTA, x: 55, y: 66, label: 'The bed' },
      { spotId: 'paisley-throw', handle: JACTHROW_P_BLUE, x: 38, y: 62, label: 'Across the bed' },
      { spotId: 'cream-knit', handle: CHUNKY_THROW_CREAM, x: 88, y: 74, label: 'On the bench' },
      { spotId: 'shag-rug', handle: RABBIT_RUG_CREAM, x: 34, y: 90, label: 'On the floor' },
    ],
  },
  {
    slug: 'ivory-gothic-library',
    title: 'The Gothic Ivory Chamber',
    style: 'Dark Academia',
    tagline: 'Ivory linen and candlelight in a midnight library.',
    heroImage: '/images/scenes/ivory-gothic-library.webp',
    heroAlt: 'Dark academia bedroom with ivory linen bedding and a traditional persian rug',
    addedAt: '2026-11-01T14:02:00Z',
    hotspots: [
      { spotId: 'ivory-bed', handle: LINEN_IVORY, x: 48, y: 62, label: 'The bed' },
      { spotId: 'red-pillow', handle: CORD_ROSE_45, x: 60, y: 48, label: 'Burgundy pillow' },
      { spotId: 'green-pillow', handle: CORD_OLIVE_45, x: 71, y: 48, label: 'Green pillow' },
    ],
  },
  {
    slug: 'rose-towels-soak',
    title: 'The Rose Soak',
    style: 'Parisian Bath',
    tagline: 'Checkered tile, a clawfoot tub, and rose towels everywhere.',
    heroImage: '/images/scenes/rose-towels-soak.webp',
    heroAlt: 'Parisian bath with checkered tile, a clawfoot tub and dusty rose towels on chair and stool',
    addedAt: '2026-11-01T14:01:00Z',
    hotspots: [
      { spotId: 'chair-towel', handle: TOWEL_ROSE_BATH, x: 52, y: 68, label: 'Chair towel' },
    ],
  },
  {
    slug: 'chateau-pompom-suite',
    title: 'The Château Pom-Pom',
    style: 'French Chateau',
    tagline: 'Olive velvet, cream jacquard, and pom-poms in morning light.',
    heroImage: '/images/scenes/chateau-pompom-suite.webp',
    heroAlt: 'French chateau bedroom with olive velvet and cream jacquard pom-pom bedding, an oat knit throw and a cream shag rug',
    addedAt: '2026-10-29T13:10:00Z',
    hotspots: [
      { spotId: 'vine-bed', handle: POMPOM_VINE, x: 48, y: 55, label: 'The bed' },
      { spotId: 'oat-throw', handle: CHUNKY_THROW_OAT, x: 40, y: 69, label: 'Across the bed' },
      { spotId: 'shag-rug', handle: RABBIT_RUG_CREAM, x: 70, y: 88, label: 'On the floor' },
    ],
  },
  {
    slug: 'rainy-sunroom-check',
    title: 'Rain in the Sunroom',
    style: 'Garden Sunroom',
    tagline: 'Checked oat linen, rain on the glass, and nowhere to be.',
    heroImage: '/images/scenes/rainy-sunroom-check.webp',
    heroAlt: 'Rainy garden sunroom with checked oatmeal bedding, a tan throw and a cream shag rug',
    addedAt: '2026-10-29T13:09:00Z',
    hotspots: [
      { spotId: 'check-bed', handle: PERCALEJAC_OATBEIGE, x: 48, y: 57, label: 'The bed' },
      { spotId: 'tan-throw', handle: CHUNKY_THROW_OAT, x: 37, y: 71, label: 'On the bench' },
      { spotId: 'shag-rug', handle: RABBIT_RUG_CREAM, x: 45, y: 88, label: 'On the floor' },
    ],
  },
  {
    slug: 'retro-vine-panel',
    title: 'Retro Vine Lounge',
    style: '70s Retro',
    tagline: 'Olive velvet, brass globes, and a record waiting downstairs.',
    heroImage: '/images/scenes/retro-vine-panel.webp',
    heroAlt: 'Retro bedroom with olive velvet and cream jacquard pom-pom bedding and an oat knit throw',
    addedAt: '2026-10-29T13:08:00Z',
    hotspots: [
      { spotId: 'vine-bed', handle: POMPOM_VINE, x: 40, y: 52, label: 'The bed' },
      { spotId: 'oat-throw', handle: CHUNKY_THROW_OAT, x: 42, y: 66, label: 'Across the bed' },
    ],
  },
  {
    slug: 'parisian-lilac-bath',
    title: 'Parisian Lilac Bath',
    style: 'Parisian Pink',
    tagline: 'Lilac velvet, rose towels, and a clawfoot tub next door.',
    heroImage: '/images/scenes/parisian-lilac-bath.webp',
    heroAlt: 'Parisian bedroom with lilac embossed velvet pom-pom bedding, dusty rose towels and a cream shag rug',
    addedAt: '2026-10-29T13:07:00Z',
    hotspots: [
      { spotId: 'bloom-bed', handle: POMPOM_LILAC, x: 45, y: 62, label: 'The bed' },
      { spotId: 'rose-towel', handle: TOWEL_ROSE, x: 88, y: 38, label: 'On the rail' },
      { spotId: 'shag-rug', handle: RABBIT_RUG_CREAM, x: 52, y: 88, label: 'On the floor' },
    ],
  },
  {
    slug: 'adobe-terracotta-room',
    title: 'Adobe Terracotta',
    style: 'Desert Adobe',
    tagline: 'Terracotta linen, olive zigzag, and figs on the table.',
    heroImage: '/images/scenes/adobe-terracotta-room.webp',
    heroAlt: 'Adobe desert bedroom with terracotta bedding, an olive chevron throw and a sage pillow',
    addedAt: '2026-10-29T13:06:00Z',
    hotspots: [
      { spotId: 'terra-bed', handle: SATEEN_TERRACOTTA, x: 60, y: 55, label: 'The bed' },
      { spotId: 'olive-throw', handle: BOHO_OLIVE, x: 30, y: 58, label: 'Draped at the foot' },
      { spotId: 'sage-pillow', handle: CTN_SAGE_45, x: 80, y: 42, label: 'The pillow' },
    ],
  },
  {
    slug: 'pom-pom-pink-morning',
    title: 'Pom-Pom Pink Morning',
    style: 'Soft Pink',
    tagline: 'Blush quilt, rose towels, and cotton-soft everything.',
    heroImage: '/images/scenes/pom-pom-pink-morning.webp',
    heroAlt: 'Soft pink bedroom with a blush pom-pom quilt, dusty rose towels and a cream shag rug',
    addedAt: '2026-10-29T13:05:00Z',
    hotspots: [
      { spotId: 'blush-bed', handle: POMPOM_BLUSH, x: 45, y: 60, label: 'The bed' },
      { spotId: 'rose-towel', handle: TOWEL_ROSE, x: 29, y: 36, label: 'On the rack' },
      { spotId: 'shag-rug', handle: RABBIT_RUG_CREAM, x: 30, y: 88, label: 'On the floor' },
    ],
  },
  {
    slug: 'yacht-taupe-cabin',
    title: 'The Yacht Cabin',
    style: 'Nautical Luxe',
    tagline: 'Taupe satin, cream wool, and harbours at dusk.',
    heroImage: '/images/scenes/yacht-taupe-cabin.webp',
    heroAlt: 'Yacht cabin with taupe satin bedding, a fur rug on the chair and a cream throw across the foot',
    addedAt: '2026-10-29T13:04:00Z',
    hotspots: [
      { spotId: 'taupe-bed', handle: SATEEN_TAUPE, x: 60, y: 58, label: 'The bed' },
      { spotId: 'floor-rug', handle: RABBIT_RUG_CAMEL, x: 68, y: 92, label: 'On the floor' },
      { spotId: 'foot-throw', handle: CHUNKY_THROW_CREAM, x: 50, y: 66, label: 'Across the foot' },
    ],
  },
  {
    slug: 'stone-bath-grey',
    title: 'The Stone Bath',
    style: 'Rustic Bath',
    tagline: 'Grey cotton, honey stone, and a long soak ahead.',
    heroImage: '/images/scenes/stone-bath-grey.webp',
    heroAlt: 'Rustic stone bathroom with grey cotton towels on a wooden rail and a woven bath mat',
    addedAt: '2026-10-29T13:03:00Z',
    hotspots: [
      { spotId: 'grey-towels', handle: TOWEL_GREY_BATH, x: 53, y: 42, label: 'On the rail' },
      { spotId: 'bath-mat', handle: MAT_SISAL, x: 52, y: 80, label: 'The bath mat' },
    ],
  },
  {
    slug: 'lilac-window-seat',
    title: 'The Lilac Window Seat',
    style: 'Lavender Daybed',
    tagline: 'A lilac throw, a pink boucle pillow, and one slow chapter.',
    heroImage: '/images/scenes/lilac-window-seat.webp',
    heroAlt: 'Window-seat daybed with a lilac fur throw and a dusty rose boucle pillow',
    addedAt: '2026-10-29T13:02:00Z',
    hotspots: [
      { spotId: 'lilac-throw', handle: RABBIT_THROW_PURPLE, x: 64, y: 70, label: 'The blanket' },
      { spotId: 'pink-pillow', handle: BOUCLE_ROSE, x: 88, y: 58, label: 'The pillow' },
    ],
  },
  {
    slug: 'palace-ivory-suite',
    title: 'Palace Ivory Suite',
    style: 'Baroque Ivory',
    tagline: 'Ivory satin, gilded cornices, and winter at the window.',
    heroImage: '/images/scenes/palace-ivory-suite.webp',
    heroAlt: 'Baroque palace bedroom with ivory sateen bedding, a vintage persian rug and an olive pillow',
    addedAt: '2026-10-29T13:01:00Z',
    hotspots: [
      { spotId: 'ivory-bed', handle: SATEEN_CREAM, x: 50, y: 60, label: 'The bed' },
      { spotId: 'persian-rug', handle: RUG_PERSIAN_BS12, x: 40, y: 89, label: 'On the floor' },
      { spotId: 'olive-pillow', handle: CORD_OLIVE_45, x: 62, y: 53, label: 'The pillow' },
    ],
  },
  {
    slug: 'cottage-check-bedroom',
    title: 'The Cottage Check',
    style: 'Rustic Check',
    tagline: 'Checked oat linen, burnt orange wool, and a fire in the grate.',
    heroImage: '/images/scenes/cottage-check-bedroom.webp',
    heroAlt: 'Rustic cottage bedroom with checked oatmeal linen bedding and a burnt orange chunky knit throw',
    addedAt: '2026-10-28T12:10:00Z',
    hotspots: [
      { spotId: 'check-bed', handle: PERCALEJAC_OATBEIGE, x: 42, y: 55, label: 'The bed' },
      { spotId: 'rust-throw', handle: CHUNKY_THROW_ORANGE, x: 58, y: 62, label: 'Across the foot' },
    ],
  },
  {
    slug: 'snowy-teahouse-bedroom',
    title: 'Snow at the Teahouse',
    style: 'Eastern Calm',
    tagline: 'Rumpled ivory linen, a teal chair pad, and snow at the lattice window.',
    heroImage: '/images/scenes/snowy-teahouse-bedroom.webp',
    heroAlt: 'Chinese farmhouse bedroom with ivory rumpled linen bedding and a tufted teal chair cushion',
    addedAt: '2026-10-28T12:09:00Z',
    hotspots: [
      { spotId: 'ivory-bed', handle: LINEN_IVORY, x: 50, y: 58, label: 'The bed' },
      { spotId: 'chair-cushion', handle: CHAIR_CUSHION_BLUE, x: 22, y: 70, label: 'The chair pad' },
    ],
  },
  {
    slug: 'rose-boudoir-corner',
    title: 'Rosewater Boudoir',
    style: 'Romantic Rose',
    tagline: 'Dusty rose linens, oat wool, and afternoon light on the vanity.',
    heroImage: '/images/scenes/rose-boudoir-corner.webp',
    heroAlt: 'Romantic pink bedroom with blush pink bedding and an oat knit throw',
    addedAt: '2026-10-28T12:08:00Z',
    hotspots: [
      { spotId: 'rose-bed', handle: BEDSET_PINK_FULL, x: 28, y: 58, label: 'The bed' },
      { spotId: 'oat-throw', handle: CHUNKY_THROW_OAT, x: 36, y: 68, label: 'Across the foot' },
    ],
  },
  {
    slug: 'stone-attic-daybed',
    title: 'The Stone Attic',
    style: 'Rustic Attic',
    tagline: 'Blue linen, sage cushions, and a herringbone throw by the fire.',
    heroImage: '/images/scenes/stone-attic-daybed.webp',
    heroAlt: 'Stone attic bedroom with a dusty blue linen daybed, a sage pillow and a tan jacquard throw',
    addedAt: '2026-10-28T12:07:00Z',
    hotspots: [
      { spotId: 'blue-bed', handle: LINEN_BLUE, x: 72, y: 52, label: 'The daybed' },
      { spotId: 'sage-pillow', handle: CTN_SAGE_45, x: 84, y: 52, label: 'At the pillows' },
      { spotId: 'tan-throw', handle: JACTHROW_KHAKI, x: 79, y: 63, label: 'Across the foot' },
    ],
  },
  {
    slug: 'study-in-denim',
    title: 'Study in Denim',
    style: 'Library Blue',
    tagline: 'Paisley blue, wide-wale cord, and one more chapter before dark.',
    heroImage: '/images/scenes/study-in-denim.webp',
    heroAlt: 'Blue library bedroom with a paisley throw, a dusty blue corduroy pillow and taupe sateen bedding',
    addedAt: '2026-10-28T12:06:00Z',
    hotspots: [
      { spotId: 'paisley-throw', handle: JACTHROW_P_BLUE, x: 82, y: 68, label: 'Across the foot' },
      { spotId: 'cord-pillow', handle: CORD_BLUE, x: 33, y: 56, label: 'The pillow' },
      { spotId: 'taupe-duvet', handle: SATEEN_TAUPE, x: 65, y: 62, label: 'The duvet' },
    ],
  },
  {
    slug: 'amber-panel-room',
    title: 'Amber Panel Room',
    style: 'Retro Amber',
    tagline: 'Mustard linen, chambray blue, and a zigzag across the foot.',
    heroImage: '/images/scenes/amber-panel-room.webp',
    heroAlt: 'Wood-panel bedroom with mustard bedding, a chambray blue pillow and a chevron knit throw',
    addedAt: '2026-10-28T12:05:00Z',
    hotspots: [
      { spotId: 'amber-bed', handle: SATEEN_MUSTARD, x: 45, y: 62, label: 'The bed' },
      { spotId: 'blue-pillow', handle: CTN_BLUE_45, x: 28, y: 45, label: 'The pillow' },
      { spotId: 'zigzag-throw', handle: BOHO_TEAL, x: 70, y: 63, label: 'Across the foot' },
    ],
  },
  {
    slug: 'pompom-quilt-morning',
    title: 'Quilt & Pom-Poms',
    style: 'Cottage Floral',
    tagline: 'Floral wallpaper, a pom-pom quilt, and tea going cold on the bench.',
    heroImage: '/images/scenes/pompom-quilt-morning.webp',
    heroAlt: 'Floral cottage bedroom with a pom-pom trim quilt and a cream knit throw',
    addedAt: '2026-10-28T12:04:00Z',
    hotspots: [
      { spotId: 'quilt-bed', handle: POMPOM_BLUSH, x: 42, y: 60, label: 'The bed' },
      { spotId: 'cream-throw', handle: KNIT_THROW_CREAM, x: 63, y: 63, label: 'Draped at the corner' },
    ],
  },
  {
    slug: 'three-colours-second-light',
    title: 'Three Colours, Second Light',
    style: 'Retro Cord',
    tagline: 'Rose, caramel and olive again, this time against the wall.',
    heroImage: '/images/scenes/three-colours-second-light.webp',
    heroAlt: 'Wooden bench with dusty rose, caramel and olive corduroy pillows in soft window light',
    addedAt: '2026-10-28T12:03:00Z',
    hotspots: [
      { spotId: 'rose-pillow', handle: CORD_ROSE_45, x: 18, y: 52, label: 'Left pillow' },
      { spotId: 'caramel-pillow', handle: CORD_CARAMEL_45, x: 50, y: 50, label: 'Middle pillow' },
      { spotId: 'olive-pillow', handle: CORD_OLIVE_45, x: 78, y: 52, label: 'Right pillow' },
    ],
  },
  {
    slug: 'zen-sage-tatami',
    title: 'Tatami Sage',
    style: 'Zen',
    tagline: 'Sage silk, paper screens, and nothing else.',
    heroImage: '/images/scenes/zen-sage-tatami.webp',
    heroAlt: 'Japanese zen bedroom with sage green bedding and a white lumbar pillow',
    addedAt: '2026-10-28T12:02:00Z',
    hotspots: [
      { spotId: 'sage-bed', handle: LINEN_SAGE, x: 52, y: 62, label: 'The bed' },
      { spotId: 'lumbar-pillow', handle: PILLOW_INSERT_WIDE, x: 66, y: 52, label: 'Lumbar pillow' },
    ],
  },
  {
    slug: 'blush-bobble-bedroom',
    title: 'Blush & Bobble',
    style: 'Soft Blush',
    tagline: 'Blush pink, bobble cream, and morning through the curtain.',
    heroImage: '/images/scenes/blush-bobble-bedroom.webp',
    heroAlt: 'Wide blush pink bedroom with a cream chunky knit throw and a woven bench',
    addedAt: '2026-10-28T12:01:00Z',
    heroWide: true,
    hotspots: [
      { spotId: 'blush-bed', handle: BEDSET_PINK_QUEEN, x: 28, y: 48, label: 'The bed' },
      { spotId: 'cream-throw', handle: CHUNKY_THROW_CREAM, x: 40, y: 57, label: 'Across the foot' },
    ],
  },
  {
    slug: 'sunrise-oat-linen-room',
    title: 'Sunrise in Oat Linen',
    style: 'Golden Oat',
    tagline: 'Oat linen, burnt orange wool, and first light on the floor.',
    heroImage: '/images/scenes/sunrise-oat-linen-room.webp',
    heroAlt:
      'Wide sunrise bedroom with oatmeal linen bedding, a burnt orange chunky knit throw and a cream faux rabbit fur rug',
    addedAt: '2026-10-27T11:10:00Z',
    heroWide: true,
    hotspots: [
      { spotId: 'oat-bed', handle: LINEN_OAT, x: 30, y: 48, label: 'The bed' },
      { spotId: 'rust-throw', handle: CHUNKY_THROW_ORANGE, x: 44, y: 57, label: 'Across the foot' },
      { spotId: 'cream-rug', handle: RABBIT_RUG_CREAM, x: 62, y: 90, label: 'On the floor' },
    ],
  },
  {
    slug: 'book-nook-window-seat',
    title: 'The Book Nook',
    style: 'Library Warm',
    tagline: 'A window seat, blue paisley, and nowhere to be.',
    heroImage: '/images/scenes/book-nook-window-seat.webp',
    heroAlt:
      'Attic reading nook with a dusty blue paisley throw, a cream cotton pillow and a cream faux rabbit fur rug',
    addedAt: '2026-10-27T11:09:00Z',
    hotspots: [
      { spotId: 'paisley-throw', handle: JACTHROW_P_BLUE, x: 66, y: 66, label: 'Draped on the seat' },
      { spotId: 'cream-pillow', handle: CTN_CREAM_45, x: 40, y: 52, label: 'Corner pillow' },
      { spotId: 'shag-rug', handle: RABBIT_RUG_CREAM, x: 56, y: 82, label: 'On the floor' },
    ],
  },
  {
    slug: 'art-deco-gold-suite',
    title: 'Gilded Deco Night',
    style: 'Art Deco',
    tagline: 'Brass, emerald velvet, and gold satin after dark.',
    heroImage: '/images/scenes/art-deco-gold-suite.webp',
    heroAlt: 'Art deco bedroom in gold sateen bedding with emerald velvet and brass accents',
    addedAt: '2026-10-27T11:08:00Z',
    hotspots: [{ spotId: 'gold-bed', handle: SATEEN_MUSTARD, x: 50, y: 78, label: 'The bed' }],
  },
  {
    slug: 'japandi-sage-suite',
    title: 'Japandi Sage Morning',
    style: 'Japandi',
    tagline: 'Sage linen and warm stone, pared back to quiet.',
    heroImage: '/images/scenes/japandi-sage-suite.webp',
    heroAlt: 'Minimal japandi bedroom with sage green bedding and a white lumbar pillow',
    addedAt: '2026-10-27T11:07:00Z',
    hotspots: [
      { spotId: 'sage-bed', handle: LINEN_SAGE, x: 52, y: 60, label: 'The bed' },
      { spotId: 'white-pillow', handle: PILLOW_INSERT_WIDE, x: 63, y: 49, label: 'Lumbar pillow' },
    ],
  },
  {
    slug: 'shabby-lavender-tea',
    title: 'Lavender Tea Time',
    style: 'Shabby Chic',
    tagline: 'Ivory linens, lilac blooms, and tea for two.',
    heroImage: '/images/scenes/shabby-lavender-tea.webp',
    heroAlt: 'Shabby chic bedroom with soft beige bedding, a draped lilac throw and a round fur rug',
    addedAt: '2026-10-27T11:06:00Z',
    hotspots: [
      { spotId: 'beige-bed', handle: BEDSET_BEIGE, x: 46, y: 56, label: 'The bed' },
      { spotId: 'lilac-throw', handle: CHUNKY_THROW_GREY, x: 42, y: 65, label: 'Draped lilac throw' },
      { spotId: 'fur-rug', handle: FAUX_FUR_RUG_WHITE, x: 50, y: 88, label: 'On the floor' },
    ],
  },
  {
    slug: 'boho-terracotta-dusk',
    title: 'Terracotta Dusk',
    style: 'Boho Warm',
    tagline: 'Desert light, rust wool, and woven everything.',
    heroImage: '/images/scenes/boho-terracotta-dusk.webp',
    heroAlt:
      'Boho bedroom with cream washed bedding, a burnt orange chunky knit throw and a caramel corduroy pillow',
    addedAt: '2026-10-27T11:05:00Z',
    hotspots: [
      { spotId: 'washed-bed', handle: WASHJAC_CREAM, x: 40, y: 55, label: 'The bed' },
      { spotId: 'orange-throw', handle: CHUNKY_THROW_ORANGE, x: 40, y: 66, label: 'Across the foot' },
      { spotId: 'caramel-pillow', handle: CORD_CARAMEL_45, x: 55, y: 48, label: 'At the headboard' },
    ],
  },
  {
    slug: 'spanish-courtyard-sage',
    title: 'The Spanish Courtyard',
    style: 'Mediterranean',
    tagline: 'Sage linen, olive chevron, and tiles older than us.',
    heroImage: '/images/scenes/spanish-courtyard-sage.webp',
    heroAlt:
      'Spanish courtyard bedroom with sage linen bedding, an olive chevron knit throw and a sage cotton pillow',
    addedAt: '2026-10-27T11:04:00Z',
    hotspots: [
      { spotId: 'courtyard-bed', handle: LINEN_SAGE, x: 38, y: 66, label: 'The bed' },
      { spotId: 'chevron-throw', handle: BOHO_OLIVE, x: 42, y: 72, label: 'Across the foot' },
      { spotId: 'sage-pillow', handle: CTN_SAGE_45, x: 20, y: 49, label: 'At the pillows' },
    ],
  },
  {
    slug: 'manor-cream-suite',
    title: 'The Manor in Cream',
    style: 'English Manor',
    tagline: 'Cream on cream, with a fire lit downstairs.',
    heroImage: '/images/scenes/manor-cream-suite.webp',
    heroAlt: 'English manor bedroom with cream bedding, velvet accent pillows and a vintage persian rug',
    addedAt: '2026-10-27T11:03:00Z',
    hotspots: [
      { spotId: 'manor-bed', handle: WASHJAC_CREAM, x: 52, y: 60, label: 'The bed' },
      { spotId: 'wine-pillow', handle: CORD_CARAMEL_45, x: 62, y: 54, label: 'Velvet pillow, left' },
      { spotId: 'sage-pillow', handle: CORD_BLUE, x: 73, y: 55, label: 'Velvet pillow, right' },
    ],
  },
  {
    slug: 'bali-canopy-dusk',
    title: 'Bali Canopy Dusk',
    style: 'Tropical Sage',
    tagline: 'Canopy drapes, sage silk, and pool-side evenings.',
    heroImage: '/images/scenes/bali-canopy-dusk.webp',
    heroAlt:
      'Bali canopy bedroom with sage green bedding, a cream openwork knit throw and a caramel corduroy pillow',
    addedAt: '2026-10-27T11:02:00Z',
    hotspots: [
      { spotId: 'canopy-bed', handle: LINEN_SAGE, x: 68, y: 72, label: 'The bed' },
      { spotId: 'cream-throw', handle: KNIT_THROW_CREAM, x: 48, y: 62, label: 'Across the foot' },
      { spotId: 'rust-pillow', handle: CORD_CARAMEL_45, x: 72, y: 52, label: 'At the pillows' },
    ],
  },
  {
    slug: 'library-oat-hour',
    title: 'The Library Hour',
    style: 'Warm Library',
    tagline: 'Oat corduroy, green plaid, and one more chapter.',
    heroImage: '/images/scenes/library-oat-hour.webp',
    heroAlt: 'Reading corner with an oatmeal tufted corduroy chair cushion and a cream faux rabbit fur rug',
    addedAt: '2026-10-27T11:01:00Z',
    hotspots: [
      { spotId: 'chair-cushion', handle: CHAIR_CUSHION_CREAM, x: 70, y: 58, label: 'The chair cushion' },
      { spotId: 'shag-rug-floor', handle: RABBIT_RUG_CREAM, x: 55, y: 88, label: 'On the floor' },
    ],
  },
  {
    slug: 'corduroy-bench-trio',
    title: 'Three Colours on a Bench',
    style: 'Retro Cord',
    tagline: 'Rose, caramel and olive corduroy, lined up in the afternoon sun.',
    heroImage: '/images/scenes/corduroy-bench-trio.webp',
    heroAlt:
      'Wooden bench with dusty rose, caramel and olive corduroy pillows in warm afternoon light',
    addedAt: '2026-10-27T10:05:00Z',
    heroWide: true,
    hotspots: [
      { spotId: 'rose-pillow', handle: CORD_ROSE_45, x: 16, y: 34, label: 'Left pillow' },
      { spotId: 'caramel-pillow', handle: CORD_CARAMEL_45, x: 37, y: 34, label: 'Middle pillow' },
      { spotId: 'olive-pillow', handle: CORD_OLIVE_45, x: 58, y: 34, label: 'Right pillow' },
    ],
  },
  {
    slug: 'cottage-patchwork-bedroom',
    title: 'The Patchwork Morning',
    style: 'English Cottage',
    tagline: 'Garden greens, a sun-warmed quilt, and a bench to linger on.',
    heroImage: '/images/scenes/cottage-patchwork-bedroom.webp',
    heroAlt:
      'Sunlit cottage bedroom with a green and grey patchwork quilt, a dusty blue pillow, a burnt orange chunky knit throw and a woven bench',
    addedAt: '2026-10-27T10:04:00Z',
    hotspots: [
      { spotId: 'orange-throw', handle: CHUNKY_THROW_ORANGE, x: 43, y: 64, label: 'Across the bed' },
      { spotId: 'blue-pillow', handle: CTN_BLUE_45, x: 22, y: 51.5, label: 'By the headboard' },
      { spotId: 'cream-throw', handle: KNIT_THROW_CREAM, x: 67, y: 72.5, label: 'On the bench' },
    ],
  },
  {
    slug: 'attic-blue-linen-bedroom',
    title: 'Under the Eaves',
    style: 'Dusty Blue',
    tagline: 'Linen the colour of a quiet sky, and a throw to sink into.',
    heroImage: '/images/scenes/attic-blue-linen-bedroom.webp',
    heroAlt:
      'Attic bedroom with dusty blue linen bedding, a cream chunky knit throw, a white faux fur throw and a round cream rug under a skylight',
    addedAt: '2026-10-27T10:03:00Z',
    hotspots: [
      { spotId: 'blue-linen', handle: LINEN_BLUE, x: 35, y: 58, label: 'The bed' },
      { spotId: 'cream-throw', handle: CHUNKY_THROW_CREAM, x: 52, y: 67, label: 'At the foot of the bed' },
      { spotId: 'cream-rug', handle: FAUX_FUR_RUG_WHITE, x: 38, y: 85, label: 'On the floor' },
    ],
  },
  {
    slug: 'lilac-pompom-bedroom',
    title: 'Lilac in the Light',
    style: 'Soft Lilac',
    tagline: 'A lilac quilt, a cream throw, and morning light across the floor.',
    heroImage: '/images/scenes/lilac-pompom-bedroom.webp',
    heroAlt:
      'Cream bedroom with lilac floral embossed velvet bedding with pom-pom trim, a cream chunky knit throw and a fluffy round rug',
    addedAt: '2026-10-27T10:02:00Z',
    hotspots: [
      { spotId: 'lilac-bedding', handle: POMPOM_LILAC, x: 42, y: 66, label: 'The bed' },
      { spotId: 'cream-throw', handle: CHUNKY_THROW_CREAM, x: 63, y: 65, label: 'Draped at the foot' },
      { spotId: 'cream-rug', handle: FAUX_FUR_RUG_WHITE, x: 33, y: 87, label: 'Under the bench' },
    ],
  },
  {
    slug: 'lavender-cottage-bedroom',
    title: 'The Lavender Cottage',
    style: 'English Country',
    tagline: 'Old beams, lavender sheets, and a cream knit throw at the foot.',
    heroImage: '/images/scenes/lavender-cottage-bedroom.webp',
    heroAlt:
      'Rustic cottage bedroom with lavender floral bedding, a brown corduroy pillow, a cream chunky knit throw and vintage rugs',
    addedAt: '2026-10-27T10:01:00Z',
    hotspots: [
      { spotId: 'lavender-bedding', handle: BEDSET_LILAC, x: 50, y: 63, label: 'The bed' },
      { spotId: 'cream-throw', handle: CHUNKY_THROW_CREAM, x: 63, y: 62, label: 'Across the bed' },
      { spotId: 'brown-pillow', handle: CORD_CHARCOAL_45, x: 59, y: 48.5, label: 'On the bed' },
    ],
  },
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
      { handle: KNIT_THROW_KHAKI, x: 83, y: 84, label: 'End of the bed' },
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
      { handle: CHUNKY_THROW_CREAM, x: 88, y: 58, label: 'Over the edge' },
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
      { handle: CHUNKY_THROW_OAT, x: 15, y: 55, label: 'Over the armrest' },
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
      { handle: CUSHION_COFFEE, x: 73, y: 58, label: 'On the bistro chair' },
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
      { handle: OUTDOOR_CUSHION_GREEN, x: 55, y: 64, label: 'On the wicker chair' },
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
      { handle: CHUNKY_THROW_CREAM, x: 67, y: 68, label: 'Across the bed' },
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
      { handle: CHAIR_CUSHION_NAVY, x: 88, y: 58, label: 'On the dining chair' },
      { handle: CORD_BLUE, x: 62, y: 51, label: 'The blue pillow' },
    ],
  },
];

/** 详情页/弹层用的精简产品卡片字段 */
export interface SceneHotspotCard {
  handle: string;
  /** 同一场景同一产品的多热区唯一键（无则用 handle） */
  spotId?: string;
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
  heroWide?: boolean;
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
      spotId: h.spotId,
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
    heroWide: def.heroWide,
    hotspots,
  };
}

/** 列表排序：新上线场景在前；无 addedAt 的旧场景保持原顺序 */
function sortByAddedAt(list: SceneDef[]): SceneDef[] {
  return [...list].sort((a, b) => {
    const ta = a.addedAt ? Date.parse(a.addedAt) : 0;
    const tb = b.addedAt ? Date.parse(b.addedAt) : 0;
    return tb - ta;
  });
}

export function getSceneViewData(slug: string): SceneViewData | null {
  const def = SCENES.find((s) => s.slug === slug);
  return def ? buildScene(def) : null;
}

/** /scenes/ 瀑布流页：一次取全部场景（含热区卡片数据） */
export function getAllSceneViewData(): SceneViewData[] {
  return sortByAddedAt(SCENES).map(buildScene);
}

/** 列表页 / 首页入口 / 换风格切换器用的轻量卡片 */
export function getSceneCards(): Pick<
  SceneDef,
  'slug' | 'title' | 'style' | 'tagline' | 'heroImage' | 'heroAlt'
>[] {
  return sortByAddedAt(SCENES).map(({ slug, title, style, tagline, heroImage, heroAlt }) => ({
    slug,
    title,
    style,
    tagline,
    heroImage,
    heroAlt,
  }));
}
