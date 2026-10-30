// /inspiration Lookbook 瀑布流数据（2026-10-30）
// 每张图只带 4 个字段：图片、房间标签、类目标签、跳转链接（PDP 或类目页）。
// 后续 100+ 种草图批量录入时往 LOOKBOOK 数组追加即可；可用脚本从图片目录扫描生成初始条目再人工补标签。

export type LookbookRoom =
  | 'bedroom'
  | 'living-room'
  | 'bathroom'
  | 'dining'
  | 'entryway';

export type LookbookCategory =
  | 'bedding'
  | 'pillows'
  | 'cushions'
  | 'towels'
  | 'blankets'
  | 'mats';

export interface LookbookItem {
  image: string;
  alt: string;
  room: LookbookRoom;
  category: LookbookCategory;
  /** 点击跳转：PDP 或类目页 */
  href: string;
}

export const LOOKBOOK_ROOM_LABELS: Record<LookbookRoom, string> = {
  bedroom: 'Bedroom',
  'living-room': 'Living Room',
  bathroom: 'Bathroom',
  dining: 'Dining',
  entryway: 'Entryway',
};

export const LOOKBOOK_CATEGORY_LABELS: Record<LookbookCategory, string> = {
  bedding: 'Bedding',
  pillows: 'Pillows',
  cushions: 'Cushions',
  towels: 'Towels',
  blankets: 'Blankets',
  mats: 'Mats & Rugs',
};

const CAT_URL = (c: LookbookCategory) => `/products?cat=${c}`;

const item = (
  image: string,
  alt: string,
  room: LookbookRoom,
  category: LookbookCategory,
  href?: string,
): LookbookItem => ({ image, alt, room, category, href: href ?? CAT_URL(category) });

export const LOOKBOOK: LookbookItem[] = [
  // ── Bedding / Bedroom ──
  item('/images/pdp-lifestyle/bedding-linen-city.webp', 'Linen bedding in a city apartment bedroom', 'bedroom', 'bedding', '/bedding/linen/'),
  item('/images/pdp-lifestyle/bedding-linen-farmhouse.webp', 'Linen bedding in a farmhouse bedroom', 'bedroom', 'bedding', '/bedding/linen/'),
  item('/images/pdp-lifestyle/bedding-linenlike-cottage.webp', 'Cotton-feel bedding in a cottage bedroom', 'bedroom', 'bedding', '/bedding/washed-cotton/'),
  item('/images/pdp-lifestyle/bedding-linenlike-farmhouse.webp', 'Cotton-feel bedding in a farmhouse bedroom', 'bedroom', 'bedding', '/bedding/washed-cotton/'),
  item('/images/pdp-lifestyle/bedding-linenlike-moroccan.webp', 'Cotton-feel bedding in a Moroccan-style bedroom', 'bedroom', 'bedding', '/bedding/washed-cotton/'),
  item('/images/pdp-lifestyle/bedding-brushed-beige.webp', 'Brushed beige bedding in a soft neutral bedroom', 'bedroom', 'bedding'),
  item('/images/pdp-lifestyle/bedding-brushed-courtyard.webp', 'Brushed bedding in a bedroom with courtyard light', 'bedroom', 'bedding'),
  item('/images/pdp-lifestyle/bedding-brushed-gray.webp', 'Brushed gray bedding in a calm bedroom', 'bedroom', 'bedding'),
  item('/images/pdp-lifestyle/bedding-brushed-modern.webp', 'Brushed bedding in a modern bedroom', 'bedroom', 'bedding'),
  item('/images/pdp-lifestyle/bedding-brushed-retro.webp', 'Brushed bedding in a retro bedroom', 'bedroom', 'bedding'),
  item('/images/pdp-lifestyle/bedding-brushed-sunlit.webp', 'Brushed bedding in a sunlit bedroom', 'bedroom', 'bedding'),
  item('/images/pdp-lifestyle/bedding-satin-champagne.webp', 'Satin champagne bedding in an elegant bedroom', 'bedroom', 'bedding'),
  item('/images/pdp-lifestyle/bedding-satin-french.webp', 'Satin bedding in a French-style bedroom', 'bedroom', 'bedding'),

  // ── Pillows ──
  item('/images/pdp-lifestyle/pillow-boucle-bed.webp', 'Bouclé pillows styled on a bed', 'bedroom', 'pillows'),
  item('/images/pdp-lifestyle/pillow-boucle-bench.webp', 'Bouclé pillow on an entryway bench', 'entryway', 'pillows'),
  item('/images/pdp-lifestyle/pillow-boucle-nook.webp', 'Bouclé pillows in a reading nook', 'living-room', 'pillows'),
  item('/images/pdp-lifestyle/pillow-boucle-sofa.webp', 'Bouclé pillows on a living room sofa', 'living-room', 'pillows'),
  item('/images/pdp-lifestyle/pillow-boucle-wide.webp', 'A row of bouclé pillows on a wide sofa', 'living-room', 'pillows'),
  item('/images/pdp-lifestyle/pillow-bright-morning.webp', 'Pillows in a bright morning bedroom', 'bedroom', 'pillows'),
  item('/images/pdp-lifestyle/pillow-hero-black.webp', 'Black accent pillow on a sofa', 'living-room', 'pillows'),
  item('/images/pdp-lifestyle/pillow-hero-gray.webp', 'Gray pillow on a neutral sofa', 'living-room', 'pillows'),
  item('/images/pdp-lifestyle/pillow-hero-warm.webp', 'Warm-toned pillows on a sofa', 'living-room', 'pillows'),

  // ── Cushions ──
  item('/images/pdp-lifestyle/cushion-lifestyle-cafe.webp', 'Chair cushions in a café-style dining corner', 'dining', 'cushions'),
  item('/images/pdp-lifestyle/cushion-lifestyle-florist.webp', 'Chair cushions in a florist-style corner', 'dining', 'cushions'),
  item('/images/pdp-lifestyle/cushion-prints-coastal.webp', 'Printed cushions in a coastal sunroom', 'living-room', 'cushions'),
  item('/images/pdp-lifestyle/cushion-prints-rooftop.webp', 'Printed cushions on a rooftop terrace', 'living-room', 'cushions'),
  item('/images/pdp-lifestyle/cushion-solids-coastal.webp', 'Solid cushions in a coastal interior', 'living-room', 'cushions'),
  item('/images/pdp-lifestyle/cushion-solids-porch.webp', 'Solid cushions on a porch bench', 'entryway', 'cushions'),

  // ── Towels / Bathroom ──
  item('/images/pdp-lifestyle/towel-hooks-cream.webp', 'Cream towels on bathroom hooks', 'bathroom', 'towels'),
  item('/images/pdp-lifestyle/towel-hooks-dustyblue.webp', 'Dusty blue towels on bathroom hooks', 'bathroom', 'towels'),
  item('/images/pdp-lifestyle/towel-hooks-dustyrose.webp', 'Dusty rose towels on bathroom hooks', 'bathroom', 'towels'),
  item('/images/pdp-lifestyle/towel-hooks-lightgrey.webp', 'Light grey towels on bathroom hooks', 'bathroom', 'towels'),
  item('/images/pdp-lifestyle/towel-hooks-oatmeal.webp', 'Oatmeal towels on bathroom hooks', 'bathroom', 'towels'),
  item('/images/pdp-lifestyle/towel-hooks-sage.webp', 'Sage towels on bathroom hooks', 'bathroom', 'towels'),

  // ── Blankets ──
  item('/images/pdp-lifestyle/blankets-hero-sofa.webp', 'Plush throw blanket draped over a sofa', 'living-room', 'blankets'),

  // ── Mats & Rugs（inspiration After 图复用）──
  item('/images/inspiration/scene-1-after.webp', 'Living room styled with a vintage Persian rug', 'living-room', 'mats'),
  item('/images/inspiration/scene-3-after.webp', 'Kitchen styled with a Persian runner rug', 'dining', 'mats'),
  item('/images/inspiration/scene-4-after.webp', 'Dining room styled with a Persian rug', 'dining', 'mats'),
  item('/images/inspiration/scene-7-after.webp', 'Dining nook styled with a Persian rug and throw', 'dining', 'mats'),

  // ── Entryway ──
  item('/images/pdp-lifestyle/scene-entryway-bench.webp', 'Entryway bench with a bouclé pillow and fluffy rug', 'entryway', 'cushions'),
];
