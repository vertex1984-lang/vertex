/**
 * Pillows 类目二级分类口径（2026-09-30 用户定，照搬 Bedding 的 Type × Fabric 双维度模型）：
 *
 * Type（形态，2026-10-08 用户定：改为 Inserts / Cases / Neck 三类；
 * 2026-10-23 用户定：Neck Pillows 整体下架，注册表移除，剩两类）：
 * - pillow-inserts  Pillow Inserts  枕芯 + 床枕（标题含 Pillow Inserts / Throw Pillow / Bed Pillow / Stuffer）
 * - pillow-cases    Throw Pillow Cases  枕套/抱枕套（标题含 Pillowcase / Cushion Cover；8 款老枕套仍全站隐藏，
 *                                   见 products.ts HIDDEN_HANDLES；类目名 2026-10-09 用户定由
 *                                   Decorative Pillow Cases 改为 Throw Pillow Cases）
 * - ~~neck-pillows~~  2026-10-23 下架：旅行颈枕 3 族 13 款全站隐藏（products.ts HIDDEN_HANDLES），
 *                     /pillows/neck-pillows/ 不再生成
 *
 * Material（填充材质，取自 getProductSpecs(asin).material）：
 * - down-alternative   Down Alternative   Microfiber / Hollowfibre（2026-09-30 用户定：microfiber 枕头归入此类；
 *                                   2026-10-09：Polyester 纤维填充同属化纤替代绒，归入此类——
 *                                   否则长抱枕芯（material=Polyester）在 /pillows/pillow-inserts/ 按材质分区时落空不显示）
 * - down               Down               羽绒类（2026-10-18 起有产品：80/20 Down 与 50/50 Down & Feather 床枕）
 * - ~~memory-foam~~  2026-10-23 随颈枕下架清空（该材质只有 8 款记忆棉颈枕），注册表移除
 *
 * 注意：旅行颈枕源数据 productType = Travel，enrich 后归一化为 Others（subcategory = travel），
 * 2026-10-23 起全部隐藏、不进任何类目。此前它们跨挂到 Pillows 靠 pillowTypeOf 识别。
 * 2026-09-30 用户定：4 款天鹅绒充气颈枕已全站隐藏（products.ts HIDDEN_HANDLE_PREFIXES）。
 */

import type { MakimooProduct } from '@/data/products';
import { getProductSpecs } from '@/lib/specs';
import { getVariantGroupOf, VARIANT_GROUPS } from '@/data/variant-groups';

export interface PillowTaxon {
  /** URL/筛选 key，如 'pillow-inserts' */
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
    key: 'pillow-inserts',
    label: 'Pillow Inserts',
    slug: 'pillow-inserts',
    menuDesc: 'Plump, supportive fill.',
    blurb: 'Soft, full inserts and bed pillows — plush support for sofa and sleep.',
  },
  {
    key: 'pillow-cases',
    label: 'Throw Pillow Cases',
    slug: 'pillow-cases',
    menuDesc: 'A fresh look, instantly.',
    blurb: 'Decorative covers in soft, muted tones — an instant refresh for any cushion.',
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
    menuDesc: 'Airy. Cloud-soft.',
    blurb: 'Real down and down-feather fills — airy loft with a soft, sink-in feel.',
  },
];

/** 产品 → 形态 key；不在三种形态内返回 ''（仅出现在未筛选的 All 视图） */
export function pillowTypeOf(p: Pick<MakimooProduct, 'title' | 'subcategory'>): string {
  const t = p.title;
  if (p.subcategory === 'travel' || /neck pillow/i.test(t)) return 'neck-pillows';
  if (/pillow ?case|pillowcase|cushion cover|pillow cover/i.test(t)) return 'pillow-cases';
  if (/bed pillow|insert|stuffer|throw pillow/i.test(t)) return 'pillow-inserts';
  return '';
}

/** 产品 → 材质 key；无匹配返回 '' */
export function pillowMaterialOf(p: Pick<MakimooProduct, 'asin'>): string {
  const m = getProductSpecs(p.asin.toLowerCase())?.material || '';
  if (/memory foam/i.test(m)) return 'memory-foam';
  if (/microfiber|hollowfibre|hollow ?fibre|down alternative|polyester/i.test(m)) return 'down-alternative';
  // 2026-10-18：/^down/ 同时命中 "Down" 与 "Down & Feather"（down-alternative 已在上方先行归位，无冲突）
  if (/^down/i.test(m)) return 'down';
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

/** 卡片展示标题规则（2026-10-09 用户定，仅影响 Pillows 列表卡标题，PDP 详情页标题不变）：
 *  - pillow-inserts → "Pillow Inserts Set of 2"；长抱枕芯（1 个装）→ "Body Pillow Insert"
 *  - pillow-cases   → "Pillow Covers Set of 2"
 *  - neck-pillows   → "Neck Pillow"（2026-10-18 用户定：颜色从标题拆出，改由卡面浅色颜色行展示）
 *  - 未分类 → ''（卡片沿用产品原标题） */
export function pillowCardTitle(p: Pick<MakimooProduct, 'title' | 'subcategory'>): string {
  const type = pillowTypeOf(p);
  if (type === 'pillow-inserts') {
    return /body pillow/i.test(p.title) ? 'Body Pillow Insert' : 'Pillow Inserts Set of 2';
  }
  if (type === 'pillow-cases') return 'Pillow Covers Set of 2';
  if (type === 'neck-pillows') return 'Neck Pillow';
  return '';
}

/** 卡面颜色行取值（2026-10-18 用户定，配合 pillowCardTitle 使用）：
 *  颈枕 = 短标题最后一个逗号后的颜色段；其余 = 变体族内该 SKU 的颜色名；都取不到返回 '' */
export function pillowCardColor(p: Pick<MakimooProduct, 'asin' | 'title' | 'subcategory'>): string {
  if (pillowTypeOf(p) === 'neck-pillows') {
    const m = p.title.match(/,\s*([^,]+)\s*$/);
    return m ? m[1] : '';
  }
  const g = getVariantGroupOf(p.asin);
  const member = g?.members.find((x) => x.asin.toLowerCase() === p.asin.toLowerCase());
  return member?.color || '';
}

/**
 * 列表卡合并/折叠（2026-10-02 用户定）：一族 = 一款产品 = 一张卡。
 * 2026-10-23 用户定：Neck Pillows 整体下架（b0-travel-memory / b0-travel-adjustable /
 * NECKPILLOW-EGGCASE 三族 13 款），合并名单清空，机制保留备用。
 */
const PILLOW_CARD_MERGES: { families: string[]; repHandle: string }[] = [];

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
