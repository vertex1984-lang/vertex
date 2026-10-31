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

export const SCENES: SceneDef[] = [
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
      { spotId: 'lilac-throw', handle: RABBIT_THROW_PURPLE, x: 42, y: 65, label: 'Draped lilac throw' },
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
