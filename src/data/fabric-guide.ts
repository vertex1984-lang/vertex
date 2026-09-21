/**
 * Fabric Guide 数据（2026-09 新增）：bedding 六种材质的介绍文案与五维评分。
 * 供两处使用：bedding landing 的 Fabric Guide 子模块（tags/bestFor）+ /fabric-guide/ 独立页。
 * key 与 BEDDING_TEXTURE_ORDER 材质名一一对应；评分 1-5（5 最高）。
 * 文案只描述面料本身特性，不写未证实的认证/产地信息。
 */
export interface FabricGuideEntry {
  key: string; // 材质名（= rawMaterialsOf 字符串，如 '100% Linen'）
  slug: string; // 页内锚点
  tags: [string, string, string]; // 三个关键词
  intro: string; // 一段式介绍
  feel: string[]; // Feel & Benefits
  care: string[]; // Care
  bestFor: string; // 一句话适合人群
  image?: string; // 面料细节特写图（本地 /images/fabric-guide/ 路径，2026-09 SeeAny 生成；缺省用产品场景图）
  ratings: {
    softness: number;
    cooling: number;
    warmth: number;
    texture: number;
    easyCare: number;
  };
}

export const FABRIC_RATING_LABELS: { key: keyof FabricGuideEntry['ratings']; label: string }[] = [
  { key: 'softness', label: 'Softness' },
  { key: 'cooling', label: 'Cooling' },
  { key: 'warmth', label: 'Warmth' },
  { key: 'texture', label: 'Texture' },
  { key: 'easyCare', label: 'Easy Care' },
];

export const FABRIC_GUIDE: FabricGuideEntry[] = [
  {
    key: '100% Linen',
    slug: 'linen',
    tags: ['Textured', 'Airy', 'Lived-In'],
    intro:
      'Pure 100% linen with a naturally slubbed texture — crisp at first touch, softer with every wash, and breathable all year round.',
    feel: [
      'Naturally textured with a relaxed, lived-in look',
      'Highly breathable — cool in summer, cozy in winter',
      'Gets softer and better with every wash',
    ],
    care: [
      'Machine wash cold on a gentle cycle',
      "Wrinkles are part of linen's natural charm",
    ],
    bestFor: 'Hot sleepers and anyone who loves a natural, textured feel.',
    image: '/images/fabric-guide/fabric-linen.webp',
    ratings: { softness: 3, cooling: 5, warmth: 3, texture: 5, easyCare: 3 },
  },
  {
    key: 'Washed Cotton-Like',
    slug: 'washed-cotton-like',
    tags: ['Soft', 'Relaxed', 'Easy-Care'],
    intro:
      'A soft washed handfeel that mimics well-loved cotton — relaxed, lived-in comfort from the very first night, with none of the fuss.',
    feel: [
      'Soft, washed feel from the very first night',
      'Relaxed matte look with a gentle drape',
      'Wrinkle-resistant and quick to dry',
    ],
    care: [
      'Machine wash warm, tumble dry low',
      'No ironing needed',
    ],
    bestFor: 'Everyday sleepers who want soft, low-maintenance bedding at an easy price.',
    image: '/images/fabric-guide/fabric-washed-cotton-like.webp',
    ratings: { softness: 4, cooling: 4, warmth: 3, texture: 2, easyCare: 5 },
  },
  {
    key: 'Linen-Like',
    slug: 'linen-like',
    tags: ['Airy', 'Textured', 'Lightweight'],
    intro:
      'The airy texture and natural drape of linen, reimagined in an easy-care weave — the look you love, minus the upkeep.',
    feel: [
      'Linen-style texture with a naturally relaxed drape',
      'Light and airy against the skin',
      'Dries quickly and resists wrinkles',
    ],
    care: [
      'Machine wash cold, tumble dry low',
      'Little to no ironing required',
    ],
    bestFor: 'Linen lovers who prefer easy care and a lighter price tag.',
    image: '/images/fabric-guide/fabric-linen-like.webp',
    ratings: { softness: 3, cooling: 4, warmth: 2, texture: 4, easyCare: 5 },
  },
  {
    key: 'Organic Cotton',
    slug: 'organic-cotton',
    tags: ['Soft', 'Natural', 'Skin-Kind'],
    intro:
      'Cotton grown without synthetic pesticides or fertilizers — pure, breathable softness that is gentle on skin and kinder to the planet.',
    feel: [
      'Clean, natural softness for sensitive skin',
      'Breathable all-season comfort',
      'Grown without synthetic chemicals',
    ],
    care: [
      'Machine wash cold with like colors',
      'Tumble dry low',
    ],
    bestFor: 'Sensitive skin and eco-conscious sleepers.',
    image: '/images/fabric-guide/fabric-organic-cotton.webp',
    ratings: { softness: 4, cooling: 4, warmth: 3, texture: 2, easyCare: 4 },
  },
  {
    key: 'Silk-Modal',
    slug: 'silk-modal',
    tags: ['Silky', 'Cool', 'Smooth'],
    intro:
      'A silk-touch modal blend with a cool, fluid drape — smooth luxury that glides against the skin.',
    feel: [
      'Silky-smooth with a cool first touch',
      'Fluid drape that feels weightless',
      'Gentle on hair and skin',
    ],
    care: [
      'Machine wash cold on a gentle cycle',
      'Avoid high heat to preserve the sheen',
    ],
    bestFor: 'Hot sleepers who want a smooth, luxurious feel.',
    image: '/images/fabric-guide/fabric-silk-modal.webp',
    ratings: { softness: 5, cooling: 5, warmth: 2, texture: 1, easyCare: 3 },
  },
  {
    key: 'Sateen',
    slug: 'sateen',
    tags: ['Buttery', 'Smooth', 'Warm'],
    intro:
      'A smooth sateen weave with a subtle sheen and buttery hand — slightly warmer, endlessly cozy.',
    feel: [
      'Buttery-smooth with a subtle luminous sheen',
      'Slightly warmer — perfect for cool nights',
      'Elegant drape with a hotel-like finish',
    ],
    care: [
      'Machine wash cool on a gentle cycle',
      'Tumble dry low',
    ],
    bestFor: 'Sleepers who love a smooth, warm, hotel-luxe feel.',
    image: '/images/fabric-guide/fabric-sateen.webp',
    ratings: { softness: 5, cooling: 2, warmth: 4, texture: 1, easyCare: 3 },
  },
];

/** 按睡姿偏好快速选面料（landing/指南页共用的入口卡）；覆盖全部六种面料（2026-09 用户定：横滑条展示所有布料） */
export const FABRIC_SHORTCUTS: { title: string; pick: string; slug: string; note: string }[] = [
  { title: 'I sleep hot', pick: '100% Linen', slug: 'linen', note: 'The most breathable weave we make.' },
  { title: 'I want low maintenance', pick: 'Washed Cotton-Like', slug: 'washed-cotton-like', note: 'Wash, dry, done — no ironing.' },
  { title: 'I love the linen look', pick: 'Linen-Like', slug: 'linen-like', note: 'Airy texture, zero upkeep.' },
  { title: 'I have sensitive skin', pick: 'Organic Cotton', slug: 'organic-cotton', note: 'Grown without synthetic chemicals.' },
  { title: 'I want silky luxury', pick: 'Silk-Modal', slug: 'silk-modal', note: 'Cool, fluid, weightless drape.' },
  { title: 'I love smooth & cozy', pick: 'Sateen', slug: 'sateen', note: 'Buttery with a subtle sheen.' },
];
