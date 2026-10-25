'use client';

import { useMemo } from 'react';
import { MakimooProduct } from '@/data/products';
import { buildSetFamilies, classifySet, clusterSetFamilies, setFamilyRoot, SET_KIND_PAGE_COPY, SetFamily, SetKind } from '@/data/bedding-families';
import { fabricDisplayName } from '@/data/bedding-fabrics';
import GroupProductCard from '@/components/v2/GroupProductCard';
import { buildGroupCards, collapseProductsToGroupCards } from '@/lib/group-cards';
import { sortByWeight } from '@/lib/weights';
import { dedupeFamilyColors } from '@/lib/listing-dedupe';
import { BEDDING_MATERIAL_ORDER } from '@/data/subcategories';

/**
 * Bedding 类目页选购视图（2026-09 重做，替代 V2BeddingLanding 聚合页）：
 * 定位 = 付费搜索落地页（任务型流量）。设计目标 = 最大化向下推进（进 PDP / 继续下滑）：
 * - 2026-10-16 用户定：页头改 Parachute 式 hero（见 V2BeddingCatHero，类型/面料二级页快链
 *   承担导航），本组件的 Type/Fabric 筛选条（含移动端 Filter 弹层）整体移除；
 *   旧 ?type=/?sub= 深链失效后降级为完整分区视图
 * - 视图固定为【按类型分区】展示全部家族（2026-10-16 用户定：取代原按材质分区；
 *   分区与 hero 快链同口径）：Sheets & Duvet Sets（4 件套，2026-10-22 起含原三件套家族）
 *   → Duvet Covers →（Sheets / Pillow Covers 无产品不出分区；Comforter 有产品时排最后）；
 *   分区标题 + 套装内容副标题（SET_KIND_PAGE_COPY）+ BeddingSetCard 网格；排序固定 Featured/权重序
 * - 卡片按色系家族聚合（23 款而非 92 SKU，减少选择瘫痪）
 * - From 最低价 + 尺码带直接上卡，价格透明度前置
 * 旧聚合页 V2BeddingLanding 组件保留在磁盘上备用（全站已无入口）。
 */

/** 分区顺序（2026-10-16 用户定，与 hero 快链一致；2026-10-22 three 下线并入 four；
 *  2026-10-25 新增 sheet（Fitted Sheets）分区，排在 duvet 之后）；comforter 不在类型快链里，有产品时兜底排最后 */
const SECTION_KIND_ORDER: SetKind[] = ['four', 'duvet', 'sheet', 'comforter'];

/**
 * four 分区族块位次对调（2026-10-24 用户定）：DUVSET（灰）换到第 2 位、WASHSTRIPE（sage）第 3 位、
 * WASHJAC（cream）第 4 位，分别与该位次当时的族块（PERCALEJAC / PERCALESTRIPE / PERCALEPATCH）整块互换。
 * 跨材质位次的固定排序无法靠权重/数据顺序实现（材质位次排序凌驾其上），故在此显式对调；
 * 键 = 族根（setFamilyRoot 口径），对调在聚拢排序之后按连续族块整体交换
 */
const FOUR_SECTION_SWAPS: Array<[string, string]> = [
  ['duvset', 'percalejac'],
  ['washstripe', 'percalestripe'],
  ['washjac', 'percalepatch'],
  // 2026-10-25 用户定：在上面三对生效后的位次上再对调——DUVSET（灰，当时第 2 位）移到第 7 位，
  // PERCALESTRIPE（stripe petal，当时第 7 位）移到第 2 位
  ['duvset', 'percalestripe'],
];

/**
 * duvet 分区卡位对调（2026-10-25 用户定，与 /bedding/duvet-covers 面料页的
 * FABRIC_SECTION_SWAPS 同一意图）：PERCALEJAC-HAZE-DUVET ↔ POMPOM4-VINE-DUVET。
 * 两个 asin 均无变体族（一族一卡），按 rep asin 直接互换展示位即可
 */
const DUVET_SECTION_SWAPS: Array<[string, string]> = [
  ['percalejac-haze-duvet', 'pompom4-vine-duvet'],
];

/** 按 rep asin（小写）成对互换家族展示位；任一 asin 不存在时跳过该对 */
function swapFamiliesByAsin(list: SetFamily[], swaps: Array<[string, string]>): SetFamily[] {
  const out = [...list];
  for (const [a, b] of swaps) {
    const ia = out.findIndex((f) => f.rep.asin.toLowerCase() === a);
    const ib = out.findIndex((f) => f.rep.asin.toLowerCase() === b);
    if (ia === -1 || ib === -1) continue;
    [out[ia], out[ib]] = [out[ib], out[ia]];
  }
  return out;
}

/** 按族根把已聚拢的家族列表切成连续族块，成对互换后展开；任一族根不存在时跳过该对 */
function swapFamilyBlocks(list: SetFamily[], swaps: Array<[string, string]>): SetFamily[] {
  const blocks: SetFamily[][] = [];
  for (const f of list) {
    const last = blocks[blocks.length - 1];
    if (last && setFamilyRoot(last[0]) === setFamilyRoot(f)) last.push(f);
    else blocks.push([f]);
  }
  const idxOf = (root: string) => blocks.findIndex((b) => setFamilyRoot(b[0]) === root);
  for (const [a, b] of swaps) {
    const ia = idxOf(a);
    const ib = idxOf(b);
    if (ia === -1 || ib === -1) continue;
    [blocks[ia], blocks[ib]] = [blocks[ib], blocks[ia]];
  }
  return blocks.flat();
}

export default function V2BeddingShop({ products }: { products: MakimooProduct[] }) {
  // 家族聚合 + 未匹配家族规则的兜底产品（新增 bedding 产品若不符合 ASIN 前缀规律也不会消失）。
  // 注意：上游传入的是未去重全量列表（家族需要全尺寸 SKU 拼尺寸带），
  // 兜底区逐 SKU 出卡前必须先做同色去重，否则同款 3 个尺寸并排重复（2026-09 修复）
  const families = useMemo(() => buildSetFamilies(products), [products]);
  const unclassified = useMemo(
    () => dedupeFamilyColors(products.filter((p) => !classifySet(p.asin))),
    [products]
  );

  // 排序：先按面料固定位次（BEDDING_MATERIAL_ORDER，2026-10-17 用户定：Percale→Linen→Brushed
  // Cotton→Linen-Like；Satin 2026-10-23 已下线），同面料内按 Featured 权重序，最后同变体族色卡聚拢相邻（2026-10-16 用户定）
  const sortFamilies = useMemo(
    () => (list: SetFamily[]): SetFamily[] => {
      const rankOf = (f: SetFamily) => {
        const i = BEDDING_MATERIAL_ORDER.indexOf(f.materials[0] || '');
        return i === -1 ? 999 : i;
      };
      const reps = sortByWeight(list.map((f) => f.rep));
      const byRep = new Map(list.map((f) => [f.rep.id, f]));
      const ordered = reps.map((r) => byRep.get(r.id)!).filter(Boolean);
      // Array.prototype.sort 稳定：同面料位次内保持权重序
      ordered.sort((a, b) => rankOf(a) - rankOf(b));
      return clusterSetFamilies(ordered);
    },
    []
  );

  // 按类型分区（无产品的类型不出分区）
  const kindSections = useMemo(
    () =>
      SECTION_KIND_ORDER.map((kind) => {
        const sorted = sortFamilies(families.filter((f) => f.kind === kind));
        return {
          kind,
          copy: SET_KIND_PAGE_COPY[kind],
          // 2026-10-24 用户定：four 分区 DUVSET/WASHSTRIPE/WASHJAC 与第 2/3/4 位族块对调；
          // 2026-10-25 用户定：duvet 分区 haze ↔ pompom 卡位对调（同 duvet-covers 面料页）
          list:
            kind === 'four'
              ? swapFamilyBlocks(sorted, FOUR_SECTION_SWAPS)
              : kind === 'duvet'
                ? swapFamiliesByAsin(sorted, DUVET_SECTION_SWAPS)
                : sorted,
        };
      }).filter((s) => s.list.length > 0),
    [families, sortFamilies]
  );

  return (
    <div>
      {/* 家族卡网格：与全站 PLP 同列数节奏；按类型分区（2026-10-16 用户定）；
          2026-10-19 用户定：套装卡片改 3:4 竖图；2026-10-24 用户定：仅 Duvet Covers
          分区卡片改 1:1，3:4 折叠图 object-cover 居中裁上下，PDP 图集仍保持 3:4 */}
      {kindSections.map((s, i) => (
        <section
          key={s.kind}
          id={`sets-${s.kind}`}
          className={`py-8 lg:py-12 ${i === 0 ? 'pt-0' : 'border-t border-[#E8E2DA]'}`}
        >
          <div className="mb-5 lg:mb-8">
            <h2 className="text-lg lg:text-2xl font-extrabold text-charcoal">{s.copy.heading}</h2>
            <p className="mt-1 text-xs lg:text-sm text-[#999]">{s.copy.blurb}</p>
          </div>
          {/* 类型分区标题已表类型；卡片图上叠布料标签（2026-09 用户定规则：
              卡片只叠「标题未表达的另一维度」；badge 开关全站关闭中，见 GroupProductCard）。
              2026-10-22 一组一卡：分区内 SetFamily 按变体组并卡（buildGroupCards），色卡展示全部颜色；
              缎面 1688 组 / BEDSET4-BC 纯色组的剔除在上游 page.tsx 产品过滤，不受影响 */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
            {buildGroupCards(s.list).map((c) => (
              <GroupProductCard
                key={c.key}
                card={c}
                badges={c.materials?.[0] ? [fabricDisplayName(c.materials[0])] : []}
                compactText
                cropBiasRight={s.kind !== 'duvet' && !c.key.toLowerCase().startsWith('duvset')}
                anchorLeft={s.kind !== 'duvet' && c.key.toLowerCase().startsWith('duvset')}
              />
            ))}
          </div>
        </section>
      ))}
      {unclassified.length > 0 && (
        <>
          <h2 className="mt-10 lg:mt-14 mb-4 text-lg lg:text-2xl font-extrabold text-[#333]">More Bedding</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
            {collapseProductsToGroupCards(unclassified).map((c) => (
              <GroupProductCard key={c.key} card={c} tallImage cropBiasRight />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
