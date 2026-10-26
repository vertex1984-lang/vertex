/**
 * Bedding 套装家族分组（2026-09 抽取共享）：/bedding/ 落地页与 /products?cat=bedding
 * 选购视图共用同一分组口径。
 *
 * ASIN 规律：BEDSET4-{COLOR}-{SIZE} / DUVSET-{COLOR}-{SIZE}、LINEN3-{COLOR}-{SIZE} / SATEEN4-/POMPOM4-/PERCALEJAC-/PERCALESTRIPE-/PERCALEPATCH-/WASHSTRIPE-/WASHJAC-/
 * PERCALE-{COLOR}-{SIZE}、1688-916370884976-C*（纯尺寸家族，供应商误标 Comforter，实为被套+2枕套，
 * 2026-09-26 用户确认）——2026-10-22 用户定：原三件套家族全部改四件套口径（被套+床笠+2枕套），统一归 four。
 * 卡片/点击均以 Queen 为代表 SKU（PDP 内有尺寸变体导航）。
 */
import { getProductSpecs } from '@/lib/specs';
import { MATERIALS_MAP } from '@/data/materials-map';
import { getVariantGroupOf } from '@/data/variant-groups';
import { fabricDisplayName } from '@/data/bedding-fabrics';
import type { MakimooProduct } from '@/data/products';

export type SetKind = 'four' | 'comforter' | 'duvet' | 'sheet' | 'pillowcase';

// 被套单品家族（LINEN3-*/DUVSET-*-DUVET 独立被套单件归 duvet，见 classifySet）。
// ice silk 缎面家族（2026-10-15 用户确认为被套+2枕套；2026-10-22 起改四件套口径归 four），
// 颜色×尺寸二维：family = 同色组（key = 前缀::颜色）；
// 新品独立被套一色一家族。
const DUVET_PREFIXES = ['1688-1048207560416', '1688-1061371343572'];

export const SET_SIZE_ORDER = ['TWIN', 'FULL', 'QUEEN', 'KING'];

// 色码 → 展示名（无条目时回退 Title Case）
const COLOR_LABELS: Record<string, string> = {
  DUSTYBLUE: 'Dusty Blue',
  OFFWHITE: 'Off White',
  // 2026-10-17：DUVSET 四新色（slug 多词，回退 Title Case 会粘连成 "Beanred"）
  BEANRED: 'Bean Red',
  BUTTER: 'Butter Yellow',
  DILL: 'Dill Green',
  OAT: 'Alpine Oat',
  // 2026-10-17：Percale 六色（slug 多词防粘连）
  SKY: 'Sky Blue',
  MIST: 'Mist Grey',
  COCONUT: 'Coconut Milk',
  NUDE: 'Nude Pink',
  EUCA: 'Eucalyptus',
  LAVENDER: 'Lavender Fog',
  // 2026-10-18：Cotton Sateen 六色（slug 多词防粘连）
  CREAM: 'Cream White',
  BEIGE: 'Soft Beige',
  MUSTARD: 'Mustard Yellow',
  TAUPE: 'Taupe',
  TERRACOTTA: 'Terracotta',
  OLIVE: 'Olive Green',
  // 2026-10-21：Embossed Velvet 绒球四件套七色（slug 单段防粘连；Lilac Bloom 用 BLOOM 避免撞 bedset4-lilac 的 LILAC 回退）
  SWIRL: 'Caramel Swirl',
  VINE: 'Olive Vine',
  LEAF: 'Dusty Leaf',
  BLUSH: 'Blush Floral',
  INK: 'Ink Floral',
  BLOOM: 'Lilac Bloom',
  DAMASK: 'Gold Damask',
  // 2026-10-22：Cotton Percale 提花四件套四色（slug 单段；BLUE/PINK/OATMEAL 被既有家族色段占用、MIST 被 PERCALE 占用，改用 HAZE/ROSE/GREY/OATBEIGE）
  HAZE: 'Dusty Blue',
  ROSE: 'Dusty Pink',
  GREY: 'Light Grey',
  OATBEIGE: 'Oatmeal Beige',
  // 2026-10-22：Cotton Percale 粉白细条纹提花四件套单色（slug 单段；PINK/BLUSH/ROSE/NUDE 均被占，改用 PETAL）
  PETAL: 'Blush Pink Stripe',
  // 2026-10-22：Cotton Percale 灰白拼接提花四件套单色（slug 单段；GRAY/GREY/MIST 均被占，改用 STONE）
  STONE: 'Stone Grey Patchwork',
  // 2026-10-22：Washed Cotton 鼠尾草绿细条纹四件套单色（SAGE 被 bedset4-sage/linen3-sage 占用，改用 SAGEGREEN）
  SAGEGREEN: 'Sage Green',
  // 2026-10-23：提花绒（双面绒）四件套单色（IVORY 未被占用）
  IVORY: 'Ivory White',
  // 2026-10-25：Cotton Percale 细格提花四件套单色（SAND 未被占用）
  SAND: 'Sand Beige',
  // 2026-10-25：条纹绒（双面同纹）四件套（key MOCHA 与 ASIN 段一致，展示名 Sage Stripe）
  MOCHA: 'Sage Stripe',
  DENIM: 'Denim Stripe',
  CHARCOAL: 'Charcoal Stripe',
};

export interface SetFamily {
  key: string;
  kind: SetKind;
  /** 色系展示名（1688-916370884976 家族 ASIN 无颜色段，从 MATERIALS_MAP 原始标题尾括号解析，取不到为空串） */
  color: string;
  /** 代表 SKU（优先 Queen，其次按 Twin→King 顺序取首个） */
  rep: MakimooProduct;
  sizes: string[];
  /** 家族内最低售价（字符串，可能为空=无价） */
  fromPrice: string;
  /** 家族内最高售价（字符串，可能为空=无价；供价格区间上限展示，2026-09 用户指出上限漏算变体最高价） */
  toPrice: string;
  currency: string;
  /** 原始材质列表（不过 "100% " 归一化，与 PLP 材质筛选口径一致），供材质筛选 */
  materials: string[];
  /** 卡片展示标题覆盖（beddingCardTitle；仅卡面标题，PDP 原标题不变） */
  titleOverride?: string;
  /** 卡面标题下的浅色颜色行（2026-10-18 用户定：颜色从标题拆出，另起一行浅灰小字展示） */
  colorLine?: string;
}

/** 卡片展示标题规则（仅影响列表卡标题，PDP 原标题不变）：
 *  2026-10-18 用户定：颜色段从标题移除（改由卡面浅色颜色行 colorLine 展示），标题 = 布料 + 品类：
 *  - 四件套（four）     → "Washed Cotton Set"（2026-10-22 起原三件套家族也归此类）
 *  - comforter          → "{布料} Set"
 *  - 独立被套（duvet）  → "100% Linen Duvet Cover"
 *  - Sheets / Pillow Covers（未上线）上线后同规则
 *  布料展示名先经 fabricDisplayName（Washed Cotton-Like → Washed Cotton）；
 *  材质取不到返回 ''（卡片沿用原标题） */
export function beddingCardTitle(kind: SetKind, materials: string[]): string {
  const fabric = materials[0] ? fabricDisplayName(materials[0]) : '';
  if (!fabric) return '';
  if (kind === 'four') return `${fabric} Set`;
  if (kind === 'duvet') return `${fabric} Duvet Cover`;
  if (kind === 'sheet') return `${fabric} Fitted Sheet`;
  if (kind === 'pillowcase') return `${fabric} Pillowcases`;
  return `${fabric} Set`;
}

export function classifySet(asin: string): SetKind | null {
  const a = asin.toLowerCase();
  // 独立被套单件（LINEN3-{COLOR}-DUVET / DUVSET-{COLOR}-DUVET，2026-10 协作方新品）归 Duvet Covers，
  // 必须先于 duvset-/linen3- 前缀规则判断（否则会被吞进 four）
  if (/-duvet$/.test(a)) return 'duvet';
  // 独立床笠单件（…-SHEET，2026-10-25 新品 SATEEN4-SAGE-SHEET）归 Fitted Sheets，
  // 必须先于 sateen4-/percale- 等前缀规则判断（否则会被吞进 four）
  if (/-sheet$/.test(a)) return 'sheet';
  // 独立枕套对装（…-PC[-SIZE]，2026-10-26 新品 PERCALEJAC-IVORY-PC-QUEEN）归 Pillow Covers，
  // 必须先于 percalejac- 等前缀规则判断（否则会被吞进 four）
  if (/(^|-)pc(-|$)/.test(a)) return 'pillowcase';
  if (a.startsWith('bedset4-')) return 'four';
  // 2026-10-18 用户定：Cotton Sateen（贡缎棉）四件套新面料线（6 色 × 4 尺寸），归 four
  if (a.startsWith('sateen4-')) return 'four';
  // 2026-10-21 用户定：Embossed Velvet 绒球花边雕花绒四件套（7 色 × 4 尺寸），归 four
  if (a.startsWith('pompom4-')) return 'four';
  // 2026-10-22 用户定：Cotton Percale 色织提花四件套（4 色 × 仅 Queen），归 four
  if (a.startsWith('percalejac-')) return 'four';
  if (a.startsWith('percalecheck-')) return 'four'; // 2026-10-25：细格提花四件套
  // 2026-10-22 用户定：Cotton Percale 粉白细条纹色织提花四件套（单色 × 仅 Queen），归 four
  if (a.startsWith('percalestripe-')) return 'four';
  // 2026-10-22 用户定：Cotton Percale 灰白拼接色织提花四件套（单色 × 仅 Queen），归 four
  if (a.startsWith('percalepatch-')) return 'four';
  // 2026-10-22 用户定：Washed Cotton 鼠尾草绿细条纹四件套（单色 × 仅 Queen），归 four
  if (a.startsWith('washstripe-')) return 'four';
  // 2026-10-22 用户定：Washed Cotton 奶白暗纹提花四件套（单色 × 仅 Queen），归 four
  if (a.startsWith('washjac-')) return 'four';
  // 2026-10-23 用户定：提花绒（双面绒）四件套（单色 × 仅 Queen），归 four
  if (a.startsWith('veljac-')) return 'four';
  if (a.startsWith('velstripe-')) return 'four'; // 2026-10-25：条纹绒四件套
  // 2026-10-26 用户定：Cotton Feel（聚酯水洗棉手感）格纹四件套（3 色 × 仅 Queen，同日由格纹旧前缀迁移 1688 sku），归 four
  if (a.startsWith('1688-1071466105053')) return 'four';
  // 2026-10-26 用户定：Cotton Blend（85%棉/15%聚酯）Muslin 双层纱四件套（3 色 × 仅 Queen），归 four
  if (a.startsWith('1688-1025015219200')) return 'four';
  // 2026-10-22 用户定：原三件套家族（duvset/linen3/percale/1688 缎面/1688-916370884976）全站改四件套
  // 口径（被套+床笠+2枕套，标题/描述已同步加 fitted sheet），统一归 four；'three' 类型整体下线。
  // 1688-916370884976 供应商标题误标 "Comforter Set"——实物带拉链封口，是被套+2枕套
  // （2026-09-26 用户确认，与 8090 工具 set-of-3 标签一致）
  if (a.startsWith('duvset-') || a.startsWith('linen3-') || a.startsWith('1688-916370884976')) return 'four';
  // 2026-10-17 用户定：Cotton Percale 新面料线（6 色 × 4 尺寸），归 four（原 three，2026-10-22 改）
  if (a.startsWith('percale-')) return 'four';
  // ice silk 缎面（Satin）两个前缀家族（原 three，2026-10-22 改 four）；家族 key 仍按前缀::颜色（见 familyKeyOf）
  if (DUVET_PREFIXES.some((p) => a.startsWith(p))) return 'four';
  return null;
}

/** duvet 家族（颜色×尺寸二维）的颜色：优先 variant group 成员色，兜底解析原始标题尾括号 */
function duvetColorOf(asin: string): string {
  const g = getVariantGroupOf(asin);
  const m = g?.members.find((x) => x.asin.toLowerCase() === asin.toLowerCase());
  if (m?.color) return m.color;
  return titleColorOf(asin, '');
}

function familyKeyOf(asin: string): string {
  const a = asin.toLowerCase();
  if (a.startsWith('1688-916370884976')) return '1688-916370884976';
  // 2026-10-26：1688-1025015219200 Cotton Blend 双层纱四件套——同前缀同色归一个 family（key = 前缀::颜色，
  // 颜色取变体组成员色，同 duvet 二维家族口径；ASIN 无颜色段，colorOf 会误取数字段）
  if (a.startsWith('1688-1025015219200')) return `1688-1025015219200::${duvetColorOf(asin)}`;
  // 2026-10-26：1688-1071466105053 Cotton Feel 格纹四件套——同 muslin 口径（key = 前缀::颜色，
  // 颜色取变体组成员色；迁移后 ASIN 无颜色段，colorOf 会误取数字段）
  if (a.startsWith('1688-1071466105053')) return `1688-1071466105053::${duvetColorOf(asin)}`;
  // duvet 二维家族：同前缀同色归一个 family（key = 前缀::颜色）
  const duvetPrefix = DUVET_PREFIXES.find((p) => a.startsWith(p));
  if (duvetPrefix) return `${duvetPrefix}::${duvetColorOf(asin)}`;
  const parts = asin.split('-');
  const last = parts[parts.length - 1].toUpperCase();
  // BEDSET4-{COLOR}-{SIZE} → 去掉尺码尾段
  return SET_SIZE_ORDER.includes(last) ? parts.slice(0, -1).join('-') : asin;
}

function colorOf(key: string): string {
  const code = key.split('-')[1] || '';
  return COLOR_LABELS[code.toUpperCase()] || code.charAt(0).toUpperCase() + code.slice(1).toLowerCase();
}

// 2026-10-20：导出给 /categories 页把 BlanketFamily 映射回套装家族，对齐 /products?cat=bedding 排序
export { familyKeyOf as setFamilyKeyOf };

/**
 * 1688-916370884976 家族 ASIN 无颜色段，从产品标题尾括号取配色名（如 "(Light Blue & Cheese)"）。
 * 注意：enrich 后 title 已被短标题覆盖（括号色名被裁掉），必须查 MATERIALS_MAP 原始标题。
 */
function titleColorOf(asin: string, fallbackTitle: string): string {
  const title = MATERIALS_MAP[asin.toLowerCase()]?.title ?? fallbackTitle;
  const m = title.match(/\(([^()]+)\)\s*$/);
  return m ? m[1].trim() : '';
}

/** duvet 家族尺寸带：variant group 内同色成员的 cm 尺寸（按组内顺序去重），卡片尺寸行用 */
function duvetSizesOf(asin: string, color: string): string[] {
  const g = getVariantGroupOf(asin);
  if (!g) return [];
  const out: string[] = [];
  for (const m of g.members) {
    if (m.color === color && m.size && !out.includes(m.size)) out.push(m.size);
  }
  return out;
}

/**
 * 单代表品口径的卡面标题/颜色行（2026-10-21 用户定：全站产品卡标题格式对齐一级类目 PLP）。
 * 供非 PLP 上下文（/categories、best-sellers、推荐位等 BlanketFamily 家族卡）复用本文件的
 * PLP 展示规则，结果与 buildSetFamilies 产出的 titleOverride / colorLine 一致。
 */
export function beddingCardDisplayOf(rep: Pick<MakimooProduct, 'asin' | 'title'>): {
  titleOverride?: string;
  colorLine?: string;
} {
  const kind = classifySet(rep.asin);
  if (!kind) return {};
  const key = familyKeyOf(rep.asin);
  const duvetColor = key.includes('::') ? key.split('::')[1] : '';
  const color =
    duvetColor || (key === '1688-916370884976' ? titleColorOf(rep.asin, rep.title) : colorOf(key));
  const materials = getProductSpecs(rep.asin.toLowerCase())?.material?.split(', ') ?? [];
  return {
    titleOverride: beddingCardTitle(kind, materials) || undefined,
    colorLine: color || undefined,
  };
}

/** 从 enriched 产品列表构建套装家族（调用方负责 enrich + 筛 productType === 'Bedding'） */
export function buildSetFamilies(products: MakimooProduct[], kind?: SetKind): SetFamily[] {
  const groups = new Map<string, MakimooProduct[]>();
  for (const p of products) {
    const k = classifySet(p.asin);
    if (!k || (kind && k !== kind)) continue;
    const key = familyKeyOf(p.asin);
    const list = groups.get(key);
    if (list) list.push(p);
    else groups.set(key, [p]);
  }
  return Array.from(groups.entries()).map(([key, members]) => {
    const sorted = [...members].sort(
      (a, b) =>
        SET_SIZE_ORDER.indexOf(a.asin.split('-').pop()!.toUpperCase()) -
        SET_SIZE_ORDER.indexOf(b.asin.split('-').pop()!.toUpperCase())
    );
    const rep = sorted.find((p) => p.asin.toUpperCase().endsWith('-QUEEN')) || sorted[0];
    const prices = members
      .map((p) => parseFloat(p.shopifyPrice || p.priceRange.minVariantPrice.amount))
      .filter((n) => !Number.isNaN(n) && n > 0);
    const kindOf = classifySet(rep.asin)!;
    const duvetColor = key.includes('::') ? key.split('::')[1] : '';
    const materials = getProductSpecs(rep.asin.toLowerCase())?.material?.split(', ') ?? [];
    const color =
      duvetColor || (key === '1688-916370884976' ? titleColorOf(rep.asin, rep.title) : colorOf(key));
    return {
      key,
      kind: kindOf,
      color,
      rep,
      sizes: duvetColor
        ? duvetSizesOf(rep.asin, duvetColor)
        : SET_SIZE_ORDER.filter((s) => members.some((p) => p.asin.toUpperCase().endsWith(`-${s}`))),
      fromPrice: prices.length > 0 ? String(Math.min(...prices)) : '',
      toPrice: prices.length > 0 ? String(Math.max(...prices)) : '',
      currency: rep.shopifyCurrencyCode || rep.priceRange.minVariantPrice.currencyCode,
      materials,
      titleOverride: beddingCardTitle(kindOf, materials) || undefined,
      colorLine: color || undefined,
    };
  });
}

/**
 * 家族卡聚拢排序（2026-10-16 用户定：排完一个变体族的全部颜色，才到下一个族，不穿插）：
 * 族根 = 变体族 id（如 BEDSET4 / BEDSET4-BC / DUVSET），无变体族时用家族 key 前缀兜底。
 * 在调用方完成权重排序之后调用：族块位置由族内最靠前的家族决定，族内保持排序后相对顺序。
 */

/**
 * 家族 → 族根（clusterSetFamilies 的聚拢口径，2026-10-24 抽出共享）：
 * 族根优先取变体族 id（纯色 BEDSET4-BC 与印花 BEDSET4 是两个族，不并块）；
 * 无变体族的兜底用 key 前缀：'duvset-gray' → 'duvset'；二维家族 '1688-xxx::颜色' → '1688-xxx'；
 * 1688 纯尺寸家族无颜色段，取前两段避免不同供应商产品线并成一块
 */
export function setFamilyRoot(f: SetFamily): string {
  const g = getVariantGroupOf(f.rep.asin);
  if (g) return g.id.toLowerCase();
  const base = f.key.split('::')[0];
  const parts = base.split('-');
  return parts[0] === '1688' ? parts.slice(0, 2).join('-') : parts[0];
}

export function clusterSetFamilies(families: SetFamily[]): SetFamily[] {
  // 族根优先取变体族 id（纯色 BEDSET4-BC 与印花 BEDSET4 是两个族，不并块）；
  // 无变体族的兜底用 key 前缀：'duvset-gray' → 'duvset'；二维家族 '1688-xxx::颜色' → '1688-xxx'；
  // 1688 纯尺寸家族无颜色段，取前两段避免不同供应商产品线并成一块。
  // 2026-10-24：抽成导出的 setFamilyRoot，与 V2BeddingShop 的 four 分区族块位次对调共用同一"族"口径
  const rootOf = setFamilyRoot;
  const seen = new Set<string>();
  const out: SetFamily[] = [];
  for (const f of families) {
    if (seen.has(f.key)) continue;
    seen.add(f.key);
    out.push(f);
    const root = rootOf(f);
    for (const g of families) {
      if (!seen.has(g.key) && rootOf(g) === root) {
        seen.add(g.key);
        out.push(g);
      }
    }
  }
  return out;
}

export const SET_KIND_LABEL: Record<SetKind, string> = {
  // 2026-10-16 用户定：对外类目名不再用 x-Piece 叫法——four = "Sheets & Duvet Set(s)"（4 件套）；
  // 2026-10-22 用户定：three（Duvet Cover Sets，3 件套）类型整体下线，原家族并入 four
  four: 'Sheets & Duvet Set',
  comforter: 'Comforter Set',
  duvet: 'Duvet Cover',
  sheet: 'Fitted Sheet',
  // 2026-10-26 用户定：Pillow Covers 分类上线（枕套对装）
  pillowcase: 'Pillowcases',
};

/** 类型页标题 + 一句话说明（/bedding/ 落地页分区与 /bedding/[slug]/ 类型 PLP 共用）；
 *  副标题只保留组件清单，"—" 及之后描述已删（2026-10-16 用户定：文字太多） */
export const SET_KIND_PAGE_COPY: Record<SetKind, { heading: string; blurb: string }> = {
  four: {
    heading: 'Sheets & Duvet Sets',
    blurb: 'Duvet cover, fitted sheet & two pillowcases',
  },
  comforter: {
    heading: 'Comforter Sets',
    blurb: 'A plush comforter with matching shams',
  },
  duvet: {
    heading: 'Duvet Covers',
    blurb: 'Standalone covers in linen & washed cotton-like',
  },
  sheet: {
    heading: 'Fitted Sheets',
    blurb: 'A standalone fitted sheet with deep pocket & all-around elastic',
  },
  pillowcase: {
    heading: 'Pillow Covers',
    blurb: 'Two matching pillowcases',
  },
};

/** 类型二级 PLP 的 URL slug ↔ kind（/bedding/[slug]/ 路由与导航共用） */
export const SET_KIND_SLUGS: Record<string, SetKind> = {
  '4-piece-sets': 'four',
  'comforter-sets': 'comforter',
  'duvet-covers': 'duvet',
  'fitted-sheets': 'sheet',
  'pillow-covers': 'pillowcase',
};


/**
 * 美式尺寸叫法（2026-10-21 用户定：bedding 全站 PDP 尺寸改用美式床型名，口径参考 PDP Size Guide 的 Fits 列）：
 * - ASIN 带尺寸后缀的套装家族（…-TWIN/FULL/QUEEN/KING）→ 后缀名（Twin/Full/Queen/King）；
 * - 无后缀家族（1688 二维缎面家族、1688-916370884976、独立被套单件等）按 cm 尺寸短边映射，
 *   与 Size Guide fits 同规则：≤180 → Twin / Twin XL，≤210 → Full / Queen，以上 → King / Cal King；
 * 取不到返回 ''。
 */
export function beddingUsSizeLabel(asin: string, cmSize?: string): string {
  const last = asin.split('-').pop()?.toUpperCase() ?? '';
  // 2026-10-26：1688-1025015219200 Cotton Blend 双层纱四件套仅 Queen（ASIN 无尺寸尾段，220cm 短边会被误判 King / Cal King）
  if (asin.toLowerCase().startsWith('1688-1025015219200')) return 'Queen';
  // 2026-10-26：1688-1071466105053 Cotton Feel 格纹四件套仅 Queen（迁移后 ASIN 无 -QUEEN 尾段，同 muslin 特判）
  if (asin.toLowerCase().startsWith('1688-1071466105053')) return 'Queen';
  if (SET_SIZE_ORDER.includes(last)) return last.charAt(0) + last.slice(1).toLowerCase();
  const m = cmSize?.match(/(\d+)\s*x\s*(\d+)/i);
  if (!m) return '';
  const width = Math.min(Number(m[1]), Number(m[2]));
  // 床笠（…-SHEET）按美式床笠宽度映射：99→Twin、137→Full、152→Queen、193→King
  if (/-sheet$/.test(asin.toLowerCase()))
    return width <= 100 ? 'Twin' : width <= 140 ? 'Full' : width <= 165 ? 'Queen' : 'King';
  return width <= 180 ? 'Twin / Twin XL' : width <= 210 ? 'Full / Queen' : 'King / Cal King';
}

/**
 * bedding PDP 标题区（2026-10-21 用户定）：
 * 主标题 = 材质（fabricDisplayName）+ 类型（SET_KIND_LABEL），如 "Cotton Percale Duvet Cover Set"；
 * 副标题 = 类型组件清单（SET_KIND_PAGE_COPY.blurb）+ ' · ' + 美式尺寸，
 * 如 "Duvet cover & two pillowcases · Queen"。
 * 分类或材质取不到返回 null（PDP 沿用原短标题、不出副标题）。
 */
export function beddingPdpHeading(
  asin: string,
  cmSize?: string
): { title: string; subtitle: string } | null {
  const kind = classifySet(asin);
  if (!kind) return null;
  const materials = getProductSpecs(asin.toLowerCase())?.material?.split(', ') ?? [];
  const fabric = materials[0] ? fabricDisplayName(materials[0]) : '';
  if (!fabric) return null;
  const size = beddingUsSizeLabel(asin, cmSize);
  return {
    title: `${fabric} ${SET_KIND_LABEL[kind]}`,
    subtitle: `${SET_KIND_PAGE_COPY[kind].blurb}${size ? ` · ${size}` : ''}`,
  };
}
