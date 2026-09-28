/**
 * Blankets 毯子家族分组（2026-09-27 新增）：/products?cat=blankets 选购视图专用，
 * 口径仿 bedding-families 的 duvet 二维家族（颜色×尺寸）——family = 同色组，
 * 尺寸带取变体组内同色成员的 cm 尺寸（卡片层统一补 "cm" 后缀，不在此处重复单位）。
 *
 * 目前全类目仅一条产品线（仿兔毛毯 1688-969627065032，5 色 × 5 尺寸 = 23 SKU，
 * 颜色/尺寸均在 variant-groups.ts 注册）；以后新增毯子产品：
 *  - 有变体组（variant-groups.ts 注册 color+size）→ 自动按颜色成族，无需改本文件；
 *  - 无变体组 → 单品成族（sizes 为空，卡片不显示尺寸行）。
 */
import { getVariantGroupOf } from '@/data/variant-groups';
import type { MakimooProduct } from '@/data/products';

export interface BlanketFamily {
  /** key = 变体组 id::颜色；单品成族时为 asin */
  key: string;
  color: string;
  /** 代表 SKU：优先中间尺寸（组内顺序取中位），图片/链接/标题均取它 */
  rep: MakimooProduct;
  /** 尺寸带（不含 "cm" 单位，卡片统一补后缀；组内顺序去重） */
  sizes: string[];
  fromPrice: string;
  toPrice: string;
  currency: string;
}

/** 从 enriched 产品列表构建毯子家族（调用方负责 enrich + 筛 productType === 'Blankets'） */
export function buildBlanketFamilies(products: MakimooProduct[]): BlanketFamily[] {
  const byAsin = new Map(products.map((p) => [p.asin.toLowerCase(), p]));
  const groups = new Map<string, { color: string; members: { p: MakimooProduct; size: string }[] }>();
  const seen = new Set<string>();

  for (const p of products) {
    const g = getVariantGroupOf(p.asin);
    if (!g) {
      // 无变体组：单品成族
      const key = p.asin.toLowerCase();
      if (!groups.has(key)) groups.set(key, { color: '', members: [{ p, size: '' }] });
      continue;
    }
    for (const m of g.members) {
      const mp = byAsin.get(m.asin.toLowerCase());
      if (!mp || seen.has(m.asin.toLowerCase())) continue;
      seen.add(m.asin.toLowerCase());
      const key = `${g.id}::${m.color}`;
      let e = groups.get(key);
      if (!e) {
        e = { color: m.color, members: [] };
        groups.set(key, e);
      }
      e.members.push({ p: mp, size: m.size || '' });
    }
  }

  return Array.from(groups.entries()).map(([key, e]) => {
    // 成员顺序 = 变体组注册顺序（尺寸从小到大）；rep 取中位尺寸，视觉上是"标准款"
    const rep = e.members[Math.floor(e.members.length / 2)]?.p ?? e.members[0].p;
    const sizes: string[] = [];
    for (const m of e.members) {
      // 紧凑格式 "120×200"（去单位去空格）：5 段尺寸带单位会在卡片边缘硬截断，单位由卡片 sizesSuffix 统一补
      const s = m.size.replace(/\s*cm\s*$/i, '').replace(/\s*x\s*/i, '×').trim();
      if (s && !sizes.includes(s)) sizes.push(s);
    }
    const prices = e.members
      .map((m) => parseFloat(m.p.shopifyPrice || m.p.priceRange.minVariantPrice.amount))
      .filter((n) => !Number.isNaN(n) && n > 0);
    return {
      key,
      color: e.color,
      rep,
      sizes,
      fromPrice: prices.length > 0 ? String(Math.min(...prices)) : '',
      toPrice: prices.length > 0 ? String(Math.max(...prices)) : '',
      currency: rep.shopifyCurrencyCode || rep.priceRange.minVariantPrice.currencyCode,
    };
  });
}
