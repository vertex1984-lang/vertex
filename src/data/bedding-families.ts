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
import type { MakimooProduct } from '@/data/products';

export type SetKind = 'four' | 'three' | 'comforter' | 'duvet';

// 被套单品家族（ice silk 缎面，2026-09-27 用户定：归 Satin 面料子类，原 "More Bedding" 兜底区清空）。
// 颜色×尺寸二维家族：family = 同色组（key = 前缀::颜色），kind = duvet。
// 类型筛选 chip/类型 PLP 暂不增 duvet 入口（范围外，用户未定）。
const DUVET_PREFIXES = ['1688-1048207560416', '1688-1061371343572'];

export const SET_SIZE_ORDER = ['TWIN', 'FULL', 'QUEEN', 'KING'];

// 色码 → 展示名（无条目时回退 Title Case）
const COLOR_LABELS: Record<string, string> = {
  DUSTYBLUE: 'Dusty Blue',
  OFFWHITE: 'Off White',
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
}

export function classifySet(asin: string): SetKind | null {
  const a = asin.toLowerCase();
  if (a.startsWith('bedset4-')) return 'four';
  // 1688-916370884976 供应商标题误标 "Comforter Set"——实物带拉链封口，是被套+2枕套的
  // 3 件套（2026-09-26 用户确认，与 8090 工具 set-of-3 标签一致），按 three 分类
  if (a.startsWith('duvset-') || a.startsWith('linen3-') || a.startsWith('1688-916370884976')) return 'three';
  if (DUVET_PREFIXES.some((p) => a.startsWith(p))) return 'duvet';
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
    return {
      key,
      kind: kindOf,
      color: duvetColor || (key === '1688-916370884976' ? titleColorOf(rep.asin, rep.title) : colorOf(key)),
      rep,
      sizes: duvetColor
        ? duvetSizesOf(rep.asin, duvetColor)
        : SET_SIZE_ORDER.filter((s) => members.some((p) => p.asin.toUpperCase().endsWith(`-${s}`))),
      fromPrice: prices.length > 0 ? String(Math.min(...prices)) : '',
      toPrice: prices.length > 0 ? String(Math.max(...prices)) : '',
      currency: rep.shopifyCurrencyCode || rep.priceRange.minVariantPrice.currencyCode,
      materials: getProductSpecs(rep.asin.toLowerCase())?.material?.split(', ') ?? [],
    };
  });
}

export const SET_KIND_LABEL: Record<SetKind, string> = {
  four: '4-Piece Set',
  three: '3-Piece Set',
  comforter: 'Comforter Set',
  duvet: 'Duvet Cover',
};

/** 类型页标题 + 一句话说明（/bedding/ 落地页分区与 /bedding/[slug]/ 类型 PLP 共用） */
export const SET_KIND_PAGE_COPY: Record<SetKind, { heading: string; blurb: string }> = {
  four: {
    heading: '4-Piece Bed Sets',
    blurb: 'Duvet cover, fitted sheet & two pillowcases — the whole bed in one box.',
  },
  three: {
    heading: '3-Piece Bed Sets',
    blurb: 'Duvet cover & two pillowcases — pair with your favorite sheets.',
  },
  comforter: {
    heading: 'Comforter Sets',
    blurb: 'A plush comforter with matching shams — warmth without the layering work.',
  },
  duvet: {
    heading: 'Duvet Covers',
    blurb: 'A silky standalone cover — slip it over your favorite insert.',
  },
};

/** 类型二级 PLP 的 URL slug ↔ kind（/bedding/[slug]/ 路由与导航共用） */
export const SET_KIND_SLUGS: Record<string, SetKind> = {
  '4-piece-sets': 'four',
  '3-piece-sets': 'three',
  'comforter-sets': 'comforter',
};

/** Bed Sets 合并页（2026-09 用户定：导航把 4-Piece/3-Piece 合并为一个入口，
 *  页内按 4 件/3 件两个分区展示，不含 Comforter；原单类型页保留兜底） */
export const BED_SETS_SLUG = 'bed-sets';
export const BED_SETS_KINDS: SetKind[] = ['four', 'three'];
export const BED_SETS_PAGE_COPY = {
  heading: 'Bed Sets',
  blurb: 'Duvet covers, sheets & pillowcases — coordinated sets for the whole bed.',
};
