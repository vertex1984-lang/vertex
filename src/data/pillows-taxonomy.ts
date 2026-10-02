/**
 * Pillows 类目二级分类口径（2026-09-30 用户定，照搬 Bedding 的 Type × Fabric 双维度模型）：
 *
 * Type（形态）：
 * - bed-pillows        Bed Pillows        睡眠枕（标题含 "Bed Pillows"）
 * - decorative-pillows Decorative Pillows 装饰枕芯（标题含 Pillow Inserts / Throw Pillow）
 * - neck-pillows       Neck Pillows       旅行颈枕（Travel 类目产品，标题含 Neck Pillow）
 * （2026-09-30 用户定：Pillow Cases 子类目整体移除，8 款枕套产品全站隐藏，
 *   见 products.ts HIDDEN_HANDLES；pillowTypeOf 的 pillowcase 规则保留兜底但已无产品命中）
 *
 * Material（填充材质，取自 getProductSpecs(asin).material）：
 * - down-alternative   Down Alternative   Microfiber / Hollowfibre（2026-09-30 用户定：microfiber 枕头归入此类）
 * - down               Down               暂无产品（导航置灰 coming soon）
 * - memory-foam        Memory Foam        记忆棉（8 款记忆棉颈枕）
 *
 * 注意：旅行颈枕源数据 productType = Travel，enrich 后归一化为 Others（subcategory = travel）。
 * 它们跨挂到 Pillows（不出现在 /products?cat=others 之外仍保留原归属），靠 pillowTypeOf 识别。
 * 2026-09-30 用户定：4 款天鹅绒充气颈枕已全站隐藏（products.ts HIDDEN_HANDLE_PREFIXES），
 * 不进任何类目；neck-pillows 只剩记忆棉颈枕。
 */

import type { MakimooProduct } from '@/data/products';
import { getProductSpecs } from '@/lib/specs';
import { getVariantGroupOf, VARIANT_GROUPS } from '@/data/variant-groups';

export interface PillowTaxon {
  /** URL/筛选 key，如 'bed-pillows' */
  key: string;
  /** 展示名，如 'Bed Pillows' */
  label: string;
  /** /pillows/[slug]/ 的 slug（与 key 相同） */
  slug: string;
  /** mega menu 链接下一行小字（Parachute "Crisp. Cool." 式） */
  menuDesc: string;
  /** 类目页分区标题下 / 二级页 H1 下的一句话简介 */
  blurb: string;
}

export const PILLOW_TYPES: PillowTaxon[] = [
  {
    key: 'bed-pillows',
    label: 'Bed Pillows',
    slug: 'bed-pillows',
    menuDesc: 'For every sleep position.',
    blurb: 'Plush, supportive pillows sized for the way you sleep.',
  },
  {
    key: 'decorative-pillows',
    label: 'Decorative Pillows',
    slug: 'decorative-pillows',
    menuDesc: 'Inserts for your favorite covers.',
    blurb: 'Soft, full inserts that plump up any decorative cover.',
  },
  {
    key: 'neck-pillows',
    label: 'Neck Pillows',
    slug: 'neck-pillows',
    menuDesc: 'Comfort on the go.',
    blurb: 'Travel-ready neck support for planes, cars and desks.',
  },
];

export const PILLOW_MATERIALS: PillowTaxon[] = [
  {
    key: 'down-alternative',
    label: 'Down Alternative',
    slug: 'down-alternative',
    menuDesc: 'Plush. Hypoallergenic.',
    blurb: 'Hypoallergenic microfiber fill — plush loft, easy machine care.',
  },
  {
    key: 'down',
    label: 'Down',
    slug: 'down',
    menuDesc: 'Coming soon.',
    blurb: 'Real down fill — coming soon.',
  },
  {
    key: 'memory-foam',
    label: 'Memory Foam',
    slug: 'memory-foam',
    menuDesc: 'Contour support.',
    blurb: 'Contour support that molds to you — a travel favorite.',
  },
];

/** 产品 → 形态 key；不在四种形态内返回 ''（仅出现在未筛选的 All 视图） */
export function pillowTypeOf(p: Pick<MakimooProduct, 'title' | 'subcategory'>): string {
  const t = p.title;
  if (p.subcategory === 'travel' || /neck pillow/i.test(t)) return 'neck-pillows';
  if (/pillow ?case/i.test(t)) return 'pillow-cases';
  if (/bed pillow/i.test(t)) return 'bed-pillows';
  if (/insert|stuffer|throw pillow/i.test(t)) return 'decorative-pillows';
  return '';
}

/** 产品 → 材质 key；无匹配返回 '' */
export function pillowMaterialOf(p: Pick<MakimooProduct, 'asin'>): string {
  const m = getProductSpecs(p.asin.toLowerCase())?.material || '';
  if (/memory foam/i.test(m)) return 'memory-foam';
  if (/microfiber|hollowfibre|hollow ?fibre|down alternative/i.test(m)) return 'down-alternative';
  if (/^down$/i.test(m)) return 'down';
  return '';
}

/** Pillows 类目的完整产品范围：pillows 类目 + 跨挂的旅行颈枕（Others/travel） */
export function isPillowProduct(p: MakimooProduct): boolean {
  return (
    p.productType.toLowerCase() === 'pillows' ||
    p.tags.some((t) => t.toLowerCase().includes('pillows')) ||
    p.subcategory === 'travel'
  );
}

export function pillowTypeBySlug(slug: string): PillowTaxon | undefined {
  return PILLOW_TYPES.find((t) => t.slug === slug);
}

export function pillowMaterialBySlug(slug: string): PillowTaxon | undefined {
  return PILLOW_MATERIALS.find((m) => m.slug === slug);
}

/** 产品卡片尺寸带（2026-09-30，与 bed-sets 家族卡同口径）：变体族内全部尺寸去重（按族内顺序），
 *  非家族成员返回空数组（卡片不渲染尺寸行） */
export function pillowSizesOf(p: Pick<MakimooProduct, 'asin'>): string[] {
  const group = getVariantGroupOf(p.asin);
  if (!group) return [];
  return Array.from(new Set(group.members.map((m) => m.size).filter((s): s is string => !!s)));
}

/**
 * 列表卡合并（2026-10-02 用户定）：两款记忆棉旅行颈枕（b0-travel-memory 与
 * b0-travel-adjustable 两个变体族）在 pillows 列表页合并为一张卡展示——
 * 代表卡 = 灰色 adjustable 款（b0bzcmdzns，用户指定"使用灰色的"），
 * 卡面颜色行列出两族全部颜色变体，From 价取两族最低价。
 * 仅影响列表展示；PDP 仍是两个独立产品，色点不互通。
 */
const PILLOW_CARD_MERGES: { families: string[]; repHandle: string }[] = [
  {
    families: ['b0-travel-memory', 'b0-travel-adjustable'],
    repHandle: 'travel-neck-pillow-top-memory-foam-pillow-for-head-support-i-b0bzcmdzns',
  },
];

export interface PillowCardMergeResult {
  /** 合并后的展示列表（非代表成员已移除，原顺序保留） */
  list: MakimooProduct[];
  /** 代表卡 handle → 合并后的颜色变体名列表（卡面颜色行用） */
  colorsByHandle: Map<string, string[]>;
  /** 代表卡 handle → 两族最低 From 价（覆盖卡片默认的 rep 单价） */
  fromPriceByHandle: Map<string, { amount: string; currency: string }>;
}

/** 在 dedupeFamilyColors 之后调用：合并族的非代表成员从列表移除，代表保留 */
export function applyPillowCardMerges(products: MakimooProduct[]): PillowCardMergeResult {
  const hidden = new Set<string>();
  const colorsByHandle = new Map<string, string[]>();
  const fromPriceByHandle = new Map<string, { amount: string; currency: string }>();

  for (const merge of PILLOW_CARD_MERGES) {
    const byHandle = new Map(products.map((p) => [p.handle, p]));
    const colors: string[] = [];
    let best: { price: number; amount: string; currency: string } | null = null;
    for (const famId of merge.families) {
      const group = VARIANT_GROUPS.find((g) => g.id === famId);
      if (!group) continue;
      for (const m of group.members) {
        if (m.handle !== merge.repHandle) hidden.add(m.handle);
        const color = m.color.trim();
        if (!colors.some((c) => c.toLowerCase() === color.toLowerCase())) colors.push(color);
        const p = byHandle.get(m.handle);
        const amount = p?.shopifyPrice || p?.priceRange?.minVariantPrice?.amount || '';
        const price = parseFloat(amount);
        if (p && !Number.isNaN(price) && (best === null || price < best.price)) {
          best = {
            price,
            amount,
            currency: p.shopifyCurrencyCode || p.priceRange?.minVariantPrice?.currencyCode || 'USD',
          };
        }
      }
    }
    if (!byHandle.has(merge.repHandle)) continue; // 代表不在列表（被隐藏/缺货排除）则不合并展示
    colorsByHandle.set(merge.repHandle, colors);
    if (best) fromPriceByHandle.set(merge.repHandle, { amount: best.amount, currency: best.currency });
  }

  return {
    list: products.filter((p) => !hidden.has(p.handle)),
    colorsByHandle,
    fromPriceByHandle,
  };
}
