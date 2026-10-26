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
    // 2026-10-17 用户定：Cotton Percale 新面料线（6 色 × 4 尺寸，原三件套、2026-10-22 起四件套口径），面料列排第一位
    slug: 'percale',
    material: 'Cotton Percale',
    desc: 'Crisp. Cool. Breathable.',
    story:
      'A tight plain weave with that fresh, hotel-crisp hand — matte, cool to the touch, and lightly structured. Percale breathes all night and softens beautifully with every wash.',
    heroImage: '/images/fabric-guide/fabric-percale.webp',
  },
  {
    slug: 'linen',
    material: '100% Linen',
    desc: 'Airy. Naturally breathable.',
    story:
      'Woven from natural flax, pure linen breathes with you — cool on warm nights, cozy when the air turns cold. It softens with every wash, and its lived-in texture only gets better over time.',
    heroImage: '/images/fabric-guide/fabric-linen.webp',
  },
  {
    slug: 'washed-cotton',
    material: 'Washed Cotton-Like',
    desc: 'Soft. Lived-in. Easy care.',
    story:
      'Garment-washed for a broken-in softness from the very first night. Light, breathable and easy to care for — the everyday comfort you never have to think about.',
    heroImage: '/images/fabric-guide/fabric-washed-cotton-like.webp',
  },
  {
    slug: 'linen-like',
    material: 'Linen-Like',
    desc: 'Linen look. Zero fuss.',
    story:
      'The relaxed look of linen, minus the upkeep. A softly textured weave that shrugs off wrinkles and stays smooth wash after wash — laid-back style, zero fuss.',
    heroImage: '/images/fabric-guide/fabric-linen-like.webp',
  },
  {
    // 2026-10-18 用户定：Cotton Sateen（贡缎棉）四件套新面料线（6 色 × 4 尺寸）
    slug: 'sateen',
    material: 'Cotton Sateen',
    desc: 'Silky. Smooth. Lustrous.',
    story:
      'A fine sateen weave with a smooth, lustrous face and a subtle sheen that catches the light softly. Buttery against the skin with an elegant drape — and it only gets softer with every wash.',
    heroImage: '/images/fabric-guide/fabric-cotton-sateen.webp',
  },
  {
    // 2026-10-26 用户定：Cotton Blend（85%棉/15%聚酯）Muslin 双层纱四件套新面料线（3 色 × 仅 Queen）
    slug: 'cotton-blend',
    material: 'Cotton Blend',
    desc: 'Soft. Durable. Easy care.',
    story:
      'A breathable cotton blend—85% cotton, 15% polyester—woven as muslin double gauze: two airy layers with a soft, fluffy, featherlight hand. It breathes all night and gets even softer with every wash.',
    // hero 图由 grey 主图居中裁 4:3 生成（scripts/_muslin-convert-images.js），暂无独立面料特写素材
    heroImage: '/images/fabric-guide/fabric-cotton-blend.webp',
  },
  // /bedding/satin/ 2026-10-23 随 Satin 床品全站移除下线（用户定：24 款 ice silk 缎面床品 PDP 404）
];

export function fabricBySlug(slug: string): BeddingFabric | undefined {
  return BEDDING_FABRICS.find((f) => f.slug === slug);
}

export function fabricByMaterial(material: string): BeddingFabric | undefined {
  return BEDDING_FABRICS.find((f) => f.material === material);
}

/** 无独立面料 PLP 的材质的两词精简描述（mega menu 面料列 desc 兜底，与 BEDDING_FABRICS[].desc 同风格）。
 *  2026-10-25 用户定：Embossed Velvet 无面料页（mega menu 链到 ?sub= 网格），补 "Plush. Warm." */
export const BEDDING_FABRIC_SHORT_DESCS: Record<string, string> = {
  'Embossed Velvet': 'Plush. Warm. Cozy.',
};

/** 面料对外展示名（2026-10-09 用户定 Washed Cotton-Like 显为 Brushed Cotton；2026-10-22 用户改定：全站展示为 Washed Cotton；
 *  2026-10-25 用户定：Embossed Velvet 全站展示为 Plush Velvet——分类含雕花绒/提花绒/条纹绒，原名盖不住；
 *  2026-10-26 用户定：Washed Cotton 显为 Cotton Feel、Linen-Like 显为 Linen Feel——mega menu 面料列改造同步全站口径）。
 *  仅展示层替换；匹配/筛选/URL ?sub= 口径仍用原 material 原子词（'Washed Cotton-Like' / 'Linen-Like' / 'Embossed Velvet'）。
 *  PDP 规格表 Material 行、/fabric-guide/ 与 /better-texture/ 营销页暂未替换（数据源口径）。 */
export function fabricDisplayName(material: string): string {
  if (material === 'Washed Cotton-Like') return 'Cotton Feel';
  if (material === 'Linen-Like') return 'Linen Feel';
  if (material === 'Embossed Velvet') return 'Plush Velvet';
  return material;
}
