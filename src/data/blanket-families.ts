/**
 * Blankets 毯子家族分组（2026-09-27 新增）：/products?cat=blankets 选购视图专用，
 * 口径仿 bedding-families 的 duvet 二维家族（颜色×尺寸）——family = 同色组，
 * 尺寸带取变体组内同色成员的 cm 尺寸（卡片层统一补 "cm" 后缀，不在此处重复单位）。
 *
 * 目前全类目 5 条产品线（仿兔毛绒毯 969627065032、镂空针织 KNIT-THROW、
 * 波西米亚锯齿 BOHO-THROW、提花 JAC-THROW、豆豆粒 CHUNKY-THROW，2026-10-19 扩）；
 * 以后新增毯子产品：
 *  - 有变体组（variant-groups.ts 注册 color+size）→ 自动按颜色成族，无需改本文件；
 *  - 无变体组 → 单品成族（sizes 为空，卡片不显示尺寸行）。
 *
 * 2026-10-19 用户定：类目页按 bedding/towels 标准重构（Parachute hero + 按系列分区），
 * 分区注册表 BLANKET_SECTIONS + 归位函数 blanketSectionOf 在本文件末尾，
 * 页头快链（page.tsx blanketHero）与分区网格（V2BlanketsShop）共用同一口径。
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

/** 卡面标题 = 代表品短标题去掉尾部「, 尺寸」和「, 颜色」段（颜色移到标题下 colorLine，
 *  尺寸由尺寸带表达；同 towels 的 towelCardTitle 思路）。
 *  2026-10-21 从 V2BlanketsShop 抽入本文件，供 family-cards 的全站卡面标题分派（familyCardDisplay）复用；
 *  同日修复去颜色段的 RegExp 字符串转义 bug：`\s` 在字符串字面量中坍缩成字面 s，颜色段实际从未被去掉
 *  （卡面标题与 colorLine 重复显色，用户截图指出），须写 \\s */
export function blanketCardTitle(f: { rep: Pick<MakimooProduct, 'title'>; color: string }): string {
  const esc = f.color.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (f.rep.title || '')
    .replace(/,\s*\d+\s*x\s*\d+\s*(cm|in)$/i, '')
    .replace(new RegExp(`,\\s*${esc}$`, 'i'), '');
}

/** 从 enriched 产品列表构建毯子家族（调用方负责 enrich + 筛 productType === 'Blankets'）。
 *  extraKey（可选）：族 key 追加段——towels 选购页按二级分类拆族（同色跨 Bath/Hand&Face 的
 *  变体组拆成两张卡，各落各的分区）；blankets 不传，行为不变 */
export function buildBlanketFamilies(
  products: MakimooProduct[],
  extraKey?: (p: MakimooProduct) => string
): BlanketFamily[] {
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
      const key = `${g.id}::${m.color}${extraKey ? `::${extraKey(mp)}` : ''}`;
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


// ─── 类目页分区注册表（2026-10-19 用户定） ─────────────────────────────────
// /products?cat=blankets 按系列分区：分区顺序 = 数组顺序；页头 hero 快链锚点 = section.key；
// 无产品的分区不出（page.tsx blanketHero 与 V2BlanketsShop 各自按同一归位函数过滤）。
// groupIds = variant-groups.ts 的组 id；more-blankets 为兜底区（无变体组或未注册组的产品），
// 其 groupIds 为空——blanketSectionOf 把无法归位的家族都落到它。
// 2026-10-21 用户定：产品线不多，5 个系列分区太繁琐，收敛为两类——
// 编织类 Knit & Woven Throws（KNIT/BOHO/JAC/CHUNKY 四组合并）+ 仿毛类 Faux Fur Throws。
export interface BlanketSection {
  key: string;
  label: string;
  /** 分区标题下副标题（同 bedding 的 SET_KIND_PAGE_COPY.blurb） */
  blurb: string;
  /** mega menu 一行短描述（2026-10-21 用户定：菜单副标题控制一行、最多两行；
   *  blurb 偏长留给 PLP 分区副标题，菜单不用） */
  menuDesc: string;
  groupIds: string[];
}

export const BLANKET_SECTIONS: BlanketSection[] = [
  {
    key: 'knit-woven-throws',
    label: 'Knit & Woven Throws',
    blurb: 'Airy openwork knits, boho chevron stripes, Nordic jacquards & chunky bobble-knits.',
    menuDesc: 'Openwork knits, chevrons & jacquards.',
    groupIds: ['KNIT-THROW', 'BOHO-THROW', 'JAC-THROW', 'CHUNKY-THROW'],
  },
  {
    key: 'faux-fur-throws',
    label: 'Faux Fur Throws',
    blurb: 'Cloud-soft faux rabbit fur with carved channel stripes.',
    menuDesc: 'Cloud-soft faux rabbit fur.',
    groupIds: ['969627065032'],
  },
  {
    key: 'more-blankets',
    label: 'More Blankets',
    blurb: '',
    menuDesc: '',
    groupIds: [],
  },
];

/** 家族归位：按代表 SKU 的变体组 id 查注册表；查不到（无组/未注册组）→ more-blankets 兜底 */
export function blanketSectionOf(f: BlanketFamily): string {
  const g = getVariantGroupOf(f.rep.asin);
  if (g) {
    const s = BLANKET_SECTIONS.find((sec) => sec.groupIds.includes(g.id));
    if (s) return s.key;
  }
  return 'more-blankets';
}
