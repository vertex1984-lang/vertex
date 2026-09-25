/**
 * Bedding 套装家族分组（2026-09 抽取共享）：/bedding/ 落地页与 /products?cat=bedding
 * 选购视图共用同一分组口径。
 *
 * ASIN 规律：BEDSET4-{COLOR}-{SIZE}（4 件套）/ DUVSET-{COLOR}-{SIZE}、LINEN3-{COLOR}-{SIZE}（3 件套）/
 * 1688-916370884976-C*（Comforter 3 件套，纯尺寸家族）。
 * 卡片/点击均以 Queen 为代表 SKU（PDP 内有尺寸变体导航）。
 */
import { getProductSpecs } from '@/lib/specs';
import { MATERIALS_MAP } from '@/data/materials-map';
import type { MakimooProduct } from '@/data/products';

export type SetKind = 'four' | 'three' | 'comforter';

export const SET_SIZE_ORDER = ['TWIN', 'FULL', 'QUEEN', 'KING'];

// 色码 → 展示名（无条目时回退 Title Case）
const COLOR_LABELS: Record<string, string> = {
  DUSTYBLUE: 'Dusty Blue',
  OFFWHITE: 'Off White',
};

export interface SetFamily {
  key: string;
  kind: SetKind;
  /** 色系展示名（comforter 家族从 MATERIALS_MAP 原始标题尾括号解析，取不到为空串） */
  color: string;
  /** 代表 SKU（优先 Queen，其次按 Twin→King 顺序取首个） */
  rep: MakimooProduct;
  sizes: string[];
  /** 家族内最低售价（字符串，可能为空=无价） */
  fromPrice: string;
  currency: string;
  /** 原始材质列表（不过 "100% " 归一化，与 PLP 材质筛选口径一致），供材质筛选 */
  materials: string[];
}

export function classifySet(asin: string): SetKind | null {
  const a = asin.toLowerCase();
  if (a.startsWith('bedset4-')) return 'four';
  if (a.startsWith('duvset-') || a.startsWith('linen3-')) return 'three';
  if (a.startsWith('1688-916370884976')) return 'comforter';
  return null;
}

function familyKeyOf(asin: string): string {
  if (asin.toLowerCase().startsWith('1688-916370884976')) return '1688-916370884976';
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
 * comforter 家族 ASIN 无颜色段，从产品标题尾括号取配色名（如 "(Light Blue & Cheese)"）。
 * 注意：enrich 后 title 已被短标题覆盖（括号色名被裁掉），必须查 MATERIALS_MAP 原始标题。
 */
function titleColorOf(asin: string, fallbackTitle: string): string {
  const title = MATERIALS_MAP[asin.toLowerCase()]?.title ?? fallbackTitle;
  const m = title.match(/\(([^()]+)\)\s*$/);
  return m ? m[1].trim() : '';
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
    return {
      key,
      kind: kindOf,
      color: kindOf === 'comforter' ? titleColorOf(rep.asin, rep.title) : colorOf(key),
      rep,
      sizes: SET_SIZE_ORDER.filter((s) => members.some((p) => p.asin.toUpperCase().endsWith(`-${s}`))),
      fromPrice: prices.length > 0 ? String(Math.min(...prices)) : '',
      currency: rep.shopifyCurrencyCode || rep.priceRange.minVariantPrice.currencyCode,
      materials: getProductSpecs(rep.asin.toLowerCase())?.material?.split(', ') ?? [],
    };
  });
}

export const SET_KIND_LABEL: Record<SetKind, string> = {
  four: '4-Piece Set',
  three: '3-Piece Set',
  comforter: 'Comforter Set',
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
