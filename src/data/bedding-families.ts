/**
 * Bedding 套装家族分组（2026-09 抽取共享）：/bedding/ 落地页与 /products?cat=bedding
 * 选购视图共用同一分组口径。
 *
 * ASIN 规律：BEDSET4-{COLOR}-{SIZE}（4 件套）/ DUVSET-{COLOR}-{SIZE}、LINEN3-{COLOR}-{SIZE}（3 件套）/
 * 1688-916370884976-C*（纯尺寸家族，供应商误标 Comforter，实为被套 3 件套 → 归 three，2026-09-26 用户确认）。
 * 卡片/点击均以 Queen 为代表 SKU（PDP 内有尺寸变体导航）。
 */
import { getProductSpecs } from '@/lib/specs';
import { MATERIALS_MAP } from '@/data/materials-map';
import { getVariantGroupOf } from '@/data/variant-groups';
import { fabricDisplayName } from '@/data/bedding-fabrics';
import type { MakimooProduct } from '@/data/products';

export type SetKind = 'four' | 'three' | 'comforter' | 'duvet';

// 被套单品家族（LINEN3-*/DUVSET-*-DUVET 独立被套单件归 duvet，见 classifySet）。
// ice silk 缎面为三件套家族（2026-10-15 用户确认），颜色×尺寸二维：family = 同色组（key = 前缀::颜色）；
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
}

/** 卡片展示标题规则（2026-10-16 用户定，仅影响列表卡标题，PDP 原标题不变）：
 *  几件套："{布料} Set, {颜色}"（同日用户定：套装卡标题恢复颜色段、去掉品类词和 Set of x；
 *  Linen 系列卡面保留全名 "100% Linen"，不再简化）——
 *  - 三件套（three）    → "100% Linen Set, Gray"
 *  - 四件套（four）     → "Brushed Cotton Set, Beige"
 *  - comforter          → "{布料} Set"
 *  - 独立被套（duvet）  → "100% Linen Duvet Cover"
 *  - Sheets / Pillow Covers（未上线）上线后同规则
 *  布料展示名先经 fabricDisplayName（Washed Cotton-Like → Brushed Cotton）；
 *  材质取不到返回 ''（卡片沿用原标题） */
export function beddingCardTitle(kind: SetKind, materials: string[], color = ''): string {
  const fabric = materials[0] ? fabricDisplayName(materials[0]) : '';
  if (!fabric) return '';
  if (kind === 'three' || kind === 'four') return color ? `${fabric} Set, ${color}` : `${fabric} Set`;
  if (kind === 'duvet') return `${fabric} Duvet Cover`;
  return `${fabric} Set`;
}

export function classifySet(asin: string): SetKind | null {
  const a = asin.toLowerCase();
  // 独立被套单件（LINEN3-{COLOR}-DUVET / DUVSET-{COLOR}-DUVET，2026-10 协作方新品）归 Duvet Covers，
  // 必须先于 duvset-/linen3- 前缀规则判断（否则会被吞进 three）
  if (/-duvet$/.test(a)) return 'duvet';
  if (a.startsWith('bedset4-')) return 'four';
  // 1688-916370884976 供应商标题误标 "Comforter Set"——实物带拉链封口，是被套+2枕套的
  // 3 件套（2026-09-26 用户确认，与 8090 工具 set-of-3 标签一致），按 three 分类
  if (a.startsWith('duvset-') || a.startsWith('linen3-') || a.startsWith('1688-916370884976')) return 'three';
  // 2026-10-17 用户定：Cotton Percale 三件套新面料线（6 色 × 4 尺寸），归 three
  if (a.startsWith('percale-')) return 'three';
  // ice silk 缎面（Satin）两个前缀家族实为被套+2枕套三件套（2026-10-15 用户确认），归 three；
  // 家族 key 仍按前缀::颜色（见 familyKeyOf）
  if (DUVET_PREFIXES.some((p) => a.startsWith(p))) return 'three';
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
      titleOverride: beddingCardTitle(kindOf, materials, color) || undefined,
    };
  });
}

/**
 * 家族卡聚拢排序（2026-10-16 用户定：排完一个变体族的全部颜色，才到下一个族，不穿插）：
 * 族根 = 变体族 id（如 BEDSET4 / BEDSET4-BC / DUVSET），无变体族时用家族 key 前缀兜底。
 * 在调用方完成权重排序之后调用：族块位置由族内最靠前的家族决定，族内保持排序后相对顺序。
 */
export function clusterSetFamilies(families: SetFamily[]): SetFamily[] {
  // 族根优先取变体族 id（纯色 BEDSET4-BC 与印花 BEDSET4 是两个族，不并块）；
  // 无变体族的兜底用 key 前缀：'duvset-gray' → 'duvset'；二维家族 '1688-xxx::颜色' → '1688-xxx'；
  // 1688 纯尺寸家族无颜色段，取前两段避免不同供应商产品线并成一块
  const rootOf = (f: SetFamily) => {
    const g = getVariantGroupOf(f.rep.asin);
    if (g) return g.id.toLowerCase();
    const base = f.key.split('::')[0];
    const parts = base.split('-');
    return parts[0] === '1688' ? parts.slice(0, 2).join('-') : parts[0];
  };
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
  // 2026-10-16 用户定：对外类目名不再用 x-Piece 叫法——
  // four = "Sheets & Duvet Set(s)"（4 件套），three = "Duvet Cover Set(s)"（3 件套）；URL slug 不变
  four: 'Sheets & Duvet Set',
  three: 'Duvet Cover Set',
  comforter: 'Comforter Set',
  duvet: 'Duvet Cover',
};

/** 类型页标题 + 一句话说明（/bedding/ 落地页分区与 /bedding/[slug]/ 类型 PLP 共用）；
 *  副标题只保留组件清单，"—" 及之后描述已删（2026-10-16 用户定：文字太多） */
export const SET_KIND_PAGE_COPY: Record<SetKind, { heading: string; blurb: string }> = {
  four: {
    heading: 'Sheets & Duvet Sets',
    blurb: 'Duvet cover, fitted sheet & two pillowcases',
  },
  three: {
    heading: 'Duvet Cover Sets',
    blurb: 'Duvet cover & two pillowcases',
  },
  comforter: {
    heading: 'Comforter Sets',
    blurb: 'A plush comforter with matching shams',
  },
  duvet: {
    heading: 'Duvet Covers',
    blurb: 'Standalone covers in linen & washed cotton-like',
  },
};

/** 类型二级 PLP 的 URL slug ↔ kind（/bedding/[slug]/ 路由与导航共用） */
export const SET_KIND_SLUGS: Record<string, SetKind> = {
  '4-piece-sets': 'four',
  '3-piece-sets': 'three',
  'comforter-sets': 'comforter',
  'duvet-covers': 'duvet',
};
