// /inspiration 页的 Before & After 场景数据
// 图片：public/images/inspiration/scene-{n}-{before|after}.webp（1200x1600, 3:4）
// products/hotspots 的 handle 映射待用户校正（场景中地毯/毯子的具体颜色变体）
// hotspots 坐标为图片百分比（0-100），相对渲染框，只显示在 After 侧（随分割线裁剪）

export interface SceneProduct {
  label: string;
  href: string;
}

export interface SceneHotspotRef {
  /** 站内产品 handle（PRODUCTS_DATA 里的 handle） */
  handle: string;
  /** 热区圆点中心在图上的百分比坐标 */
  x: number;
  y: number;
  /** 圆点 aria-label / 小卡上的位置说明 */
  label: string;
}

export interface InspirationScene {
  id: number;
  room: string; // 房间类型标签
  title: string;
  before: string;
  after: string;
  alt: string;
  products: SceneProduct[];
  hotspots: SceneHotspotRef[];
}

// 导出供 pdp-before-after.ts 标记"本 PDP 产品"热区用
export const RUG =
  'elegant-distressed-oriental-vintage-area-rug-traditional-745181807454-c3';
export const BLANKET_CREAM =
  'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-969627065032-c28';
export const BEDDING_IVORY =
  'makimoo-100-linen-duvet-cover-set-3-pieces-queen-size-with-linen3-ivory-queen';

const RUG_URL = `/products/${RUG}/`;
const BLANKET_URL = `/products/${BLANKET_CREAM}/`;
const BEDDING_URL = `/products/${BEDDING_IVORY}/`;
const CUSHIONS_URL = '/products?cat=cushions';

const img = (n: number, kind: 'before' | 'after') =>
  `/images/inspiration/scene-${n}-${kind}.webp`;

export const INSPIRATION_SCENES: InspirationScene[] = [
  {
    id: 1,
    room: 'Living Room',
    title: 'From empty corner to cozy retreat',
    before: img(1, 'before'),
    after: img(1, 'after'),
    alt: 'Living room before and after styling with a vintage Persian rug, throw blanket and cushions',
    products: [
      { label: 'Vintage Persian Rug', href: RUG_URL },
      { label: 'Faux Rabbit Fur Throw', href: BLANKET_URL },
      { label: 'Cushions', href: CUSHIONS_URL },
    ],
    hotspots: [
      { handle: BLANKET_CREAM, x: 34, y: 52, label: 'Throw on sofa' },
      { handle: RUG, x: 52, y: 82, label: 'Area rug' },
    ],
  },
  {
    id: 2,
    room: 'Bedroom',
    title: 'A softer place to land',
    before: img(2, 'before'),
    after: img(2, 'after'),
    alt: 'Bedroom before and after styling with ivory bedding, faux fur throw and Persian rug',
    products: [
      { label: 'Ivory Linen Duvet Set', href: BEDDING_URL },
      { label: 'Faux Rabbit Fur Throw', href: BLANKET_URL },
      { label: 'Vintage Persian Rug', href: RUG_URL },
    ],
    hotspots: [
      { handle: BEDDING_IVORY, x: 68, y: 52, label: 'Duvet set on bed' },
      { handle: BLANKET_CREAM, x: 60, y: 72, label: 'Throw at foot of bed' },
      { handle: RUG, x: 70, y: 88, label: 'Area rug' },
    ],
  },
  {
    id: 3,
    room: 'Kitchen',
    title: 'Warmth underfoot, even here',
    before: img(3, 'before'),
    after: img(3, 'after'),
    alt: 'Kitchen before and after styling with a Persian runner rug',
    products: [{ label: 'Vintage Persian Rug', href: RUG_URL }],
    hotspots: [{ handle: RUG, x: 74, y: 86, label: 'Area rug' }],
  },
  {
    id: 4,
    room: 'Dining Room',
    title: 'Gather around something beautiful',
    before: img(4, 'before'),
    after: img(4, 'after'),
    alt: 'Dining room before and after styling with a round table, green tablecloth and Persian rug',
    products: [{ label: 'Vintage Persian Rug', href: RUG_URL }],
    hotspots: [{ handle: RUG, x: 56, y: 86, label: 'Area rug' }],
  },
  {
    id: 5,
    room: 'Living Room',
    title: 'Fireside, finished',
    before: img(5, 'before'),
    after: img(5, 'after'),
    alt: 'Fireplace living room before and after styling with Persian rug and orange throw',
    products: [
      { label: 'Vintage Persian Rug', href: RUG_URL },
      { label: 'Faux Rabbit Fur Throw', href: BLANKET_URL },
    ],
    hotspots: [
      { handle: BLANKET_CREAM, x: 34, y: 56, label: 'Throw on sofa' },
      { handle: RUG, x: 52, y: 84, label: 'Area rug' },
    ],
  },
  {
    id: 6,
    room: 'Kitchen & Dining',
    title: 'Everyday meals, elevated',
    before: img(6, 'before'),
    after: img(6, 'after'),
    alt: 'Open kitchen and dining area before and after styling with a Persian rug',
    products: [{ label: 'Vintage Persian Rug', href: RUG_URL }],
    hotspots: [{ handle: RUG, x: 56, y: 86, label: 'Area rug' }],
  },
  {
    id: 7,
    room: 'Dining Nook',
    title: 'Small space, big difference',
    before: img(7, 'before'),
    after: img(7, 'after'),
    alt: 'Small dining nook before and after styling with Persian rug and orange throw',
    products: [
      { label: 'Vintage Persian Rug', href: RUG_URL },
      { label: 'Faux Rabbit Fur Throw', href: BLANKET_URL },
    ],
    hotspots: [
      { handle: BLANKET_CREAM, x: 68, y: 60, label: 'Throw on chair' },
      { handle: RUG, x: 50, y: 84, label: 'Area rug' },
    ],
  },
  {
    id: 8,
    room: 'Bedroom',
    title: 'Layers that make the room',
    before: img(8, 'before'),
    after: img(8, 'after'),
    alt: 'Rattan bedroom before and after styling with white bedding, colorful throws and Persian rug',
    products: [
      { label: 'Ivory Linen Duvet Set', href: BEDDING_URL },
      { label: 'Faux Rabbit Fur Throw', href: BLANKET_URL },
      { label: 'Vintage Persian Rug', href: RUG_URL },
    ],
    hotspots: [
      { handle: BEDDING_IVORY, x: 56, y: 50, label: 'Duvet set on bed' },
      { handle: BLANKET_CREAM, x: 62, y: 68, label: 'Throw on bed' },
      { handle: RUG, x: 54, y: 88, label: 'Area rug' },
    ],
  },
];
