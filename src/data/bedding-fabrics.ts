/**
 * Bedding 面料注册表（2026-09 新增）：面料二级类目 PLP（/bedding/[fabric]/）的元数据源，
 * mega menu 面料列描述、面料互导模块共用同一口径。
 *
 * - slug = URL 段（/bedding/linen/ 等）
 * - material = 与 SetFamily.materials / ?sub= 参数口径完全一致（匹配用它，别用 slug 反推）
 * - 新面料上线：在此追加一条 + 备一张面料特写图（public/images/fabric-guide/），
 *   有产品的面料会自动生成静态页并出现在互导模块；build-sitemap.js 里的面料页清单需手动同步
 */

export interface BeddingFabric {
  slug: string;
  /** 材质名（与产品规格 material 原子词一致） */
  material: string;
  /** 一句话质感（mega menu 面料列 / 互导卡用，Parachute "Crisp. Cool." 式） */
  desc: string;
  /** 2-3 句面料故事（面料页 hero 用） */
  story: string;
  /** 面料特写图（hero + 互导卡共用） */
  heroImage: string;
}

export const BEDDING_FABRICS: BeddingFabric[] = [
  {
    slug: 'linen',
    material: '100% Linen',
    desc: 'Airy. Relaxed.',
    story:
      'Woven from natural flax, pure linen breathes with you — cool on warm nights, cozy when the air turns cold. It softens with every wash, and its lived-in texture only gets better over time.',
    heroImage: '/images/fabric-guide/fabric-linen.webp',
  },
  {
    slug: 'washed-cotton',
    material: 'Washed Cotton-Like',
    desc: 'Soft. Lived-in.',
    story:
      'Garment-washed for a broken-in softness from the very first night. Light, breathable and easy to care for — the everyday comfort you never have to think about.',
    heroImage: '/images/fabric-guide/fabric-washed-cotton-like.webp',
  },
  {
    slug: 'linen-like',
    material: 'Linen-Like',
    desc: 'Textured. Effortless.',
    story:
      'The relaxed look of linen, minus the upkeep. A softly textured weave that shrugs off wrinkles and stays smooth wash after wash — laid-back style, zero fuss.',
    heroImage: '/images/fabric-guide/fabric-linen-like.webp',
  },
  {
    // 2026-09-27 用户定：ice silk 缎面被套（原 More Bedding 兜底区）归 Satin 面料子类
    slug: 'satin',
    material: 'Satin',
    desc: 'Silky. Lustrous.',
    story:
      'A glossy satin weave with a mirror-smooth face that glides over skin and catches the light. Cool to the first touch, fluid in drape — and fully machine washable.',
    heroImage: '/images/fabric-guide/fabric-satin.webp',
  },
];

export function fabricBySlug(slug: string): BeddingFabric | undefined {
  return BEDDING_FABRICS.find((f) => f.slug === slug);
}

export function fabricByMaterial(material: string): BeddingFabric | undefined {
  return BEDDING_FABRICS.find((f) => f.material === material);
}

/** 面料对外展示名（2026-10-09 用户定：Washed Cotton-Like 全站展示为 Brushed Cotton）。
 *  仅展示层替换；匹配/筛选/URL ?sub= 口径仍用原 material 原子词（'Washed Cotton-Like'）。
 *  PDP 规格表 Material 行、/fabric-guide/ 与 /better-texture/ 营销页暂未替换（数据源口径）。 */
export function fabricDisplayName(material: string): string {
  return material === 'Washed Cotton-Like' ? 'Brushed Cotton' : material;
}
