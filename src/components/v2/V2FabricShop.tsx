import { SET_KIND_LABEL, SET_KIND_PAGE_COPY, SetFamily, SetKind, clusterSetFamilies, orderSheetsetFamilies } from '@/data/bedding-families';
import { fabricDisplayName } from '@/data/bedding-fabrics';
import { BEDDING_MATERIAL_BLURBS, sortBeddingMaterials } from '@/data/subcategories';
import GroupProductCard from '@/components/v2/GroupProductCard';
import { buildGroupCards, type GroupCard } from '@/lib/group-cards';
import { sortByWeight } from '@/lib/weights';

/**
 * bedding 二级类目 PLP 选购区（2026-09 新增，/bedding/[slug]/ 三种页型共用）：
 * 页面上没有任何筛选条/标签，固定 Featured（权重）排序——
 * "数量 + 价格区间 + 排序下拉"一行 2026-09 用户定已移除；
 * 分区锚点 chips（"x-Piece Sets n"）2026-10-16 用户定移除（老筛选残留，导航由 hero 下导航排承担）。
 * 2026-10-22 用户定（一组一卡 + 色卡）：卡片改 GroupProductCard——同组各色并一张卡，
 * 色卡行展示全部颜色（取代颜色文字行）；分区/排序口径不变。
 * 卡片 badge（2026-09 用户定统一规则：叠「标题未表达的另一维度」）：类型页/Bed Sets 合并页
 * 标题是类型（x-Piece Sets）、页内多布料混排 → 卡片图上叠布料标签（materials[0]）；
 * 面料页整页同一布料（布料=页面标题、类型=分区标题，两维度都已表达）→ 不叠任何标签，
 * 调用方传 noBadges。
 */

// 2026-10-27：补 sheetset/duvetset/bundle 三个新类型（矩阵序，无产品不出分区；
// 缺了会在面料页分区模式被静默丢弃——Sheet Sets 首款 SHEETSET-SAND-QUEEN 属 Cotton Percale 面料页）
const KIND_ORDER: SetKind[] = ['sheetset', 'duvetset', 'four', 'bundle', 'comforter', 'duvet', 'sheet'];

/** 布料标签：组卡首家族主材质（materials[0]，如 "100% Linen"），取不到则不叠；展示名经 fabricDisplayName */
const fabricBadge = (c: GroupCard): string[] =>
  c.materials?.[0] ? [fabricDisplayName(c.materials[0])] : [];

/** 材质名 → 分区锚点 id（"100% Linen" → fabric-100-linen，与 V2BeddingShop 同口径） */
function fabricAnchor(material: string): string {
  return `fabric-${material.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

/** 2026-10-25 用户定：/bedding/duvet-covers 面料分区页跨分区对调卡片展示位（asin 小写对）——
 *  PERCALEJAC-HAZE-DUVET（Cotton Percale 区）↔ POMPOM4-VINE-DUVET（Embossed Velvet 区）。
 *  注意：对调后卡片落在对方面料分区标题下，仅调展示位置，不动卡片自身的面料标注 */
const FABRIC_SECTION_SWAPS: [string, string][] = [
  ['percalejac-haze-duvet', 'pompom4-vine-duvet'],
];

export default function V2FabricShop({
  families,
  flat = false,
  noBadges = false,
  byFabric = false,
}: {
  families: SetFamily[];
  /** flat = 类型二级 PLP 用：全页同一类型，不分区不出小标题，单一网格平铺 */
  flat?: boolean;
  /** 面料页用：整页同一布料，卡片不叠任何标签（2026-09 用户定） */
  noBadges?: boolean;
  /** byFabric = /bedding/duvet-covers/ 用（2026-10-16 用户定）：全页同一类型改按面料分区
   *  （分区标题 = 面料名 + 一句话描述，同 /products?cat=bedding 材质分区）；
   *  分区锚点由页头导航排承担，本组件不再渲染 chips */
  byFabric?: boolean;
}) {
  const cardBadges = (c: GroupCard): string[] => (noBadges ? [] : fabricBadge(c));
  // 固定 Featured 序：按权重降序 + 同变体族色卡聚拢相邻（2026-10-16 用户定）；
  // 2026-10-27 用户定：sheetset 家族按 SHEETSET_PLP_ORDER 显式排位（仅 sheetset 槽位置换，见 bedding-families.ts）
  const reps = sortByWeight(families.map((f) => f.rep));
  const byRep = new Map(families.map((f) => [f.rep.id, f]));
  const sorted = orderSheetsetFamilies(clusterSetFamilies(reps.map((r) => byRep.get(r.id)!).filter(Boolean)));

  // 按类型分区（保持排序后的相对顺序；无产品的类型不出分区）
  const sections = KIND_ORDER.map((kind) => ({
    kind,
    list: sorted.filter((f) => f.kind === kind),
  })).filter((s) => s.list.length > 0);

  // 按面料分区（byFabric 模式；分区顺序按 BEDDING_MATERIAL_ORDER，未收录材质按家族数降序兜底）
  const fabricMap = new Map<string, SetFamily[]>();
  for (const f of sorted) {
    const m = f.materials[0] || 'Other';
    if (!fabricMap.has(m)) fabricMap.set(m, []);
    fabricMap.get(m)!.push(f);
  }
  const fabricSections = sortBeddingMaterials(Array.from(fabricMap.entries()), (e) => e[1].length).map(
    ([m, list]) => ({ material: m, anchor: fabricAnchor(m), list })
  );

  // 跨分区对调（FABRIC_SECTION_SWAPS，2026-10-25 用户定）：仅 byFabric 模式生效
  if (byFabric) {
    for (const [a, b] of FABRIC_SECTION_SWAPS) {
      const locate = (asin: string) => {
        for (const s of fabricSections) {
          const idx = s.list.findIndex((f) => f.rep.asin.toLowerCase() === asin);
          if (idx >= 0) return { s, idx };
        }
        return null;
      };
      const pa = locate(a);
      const pb = locate(b);
      if (pa && pb) {
        const tmp = pa.s.list[pa.idx];
        pa.s.list[pa.idx] = pb.s.list[pb.idx];
        pb.s.list[pb.idx] = tmp;
      }
    }
  }

  if (byFabric) {
    return (
      <div>
        {fabricSections.map((s, i) => (
          <section
            key={s.material}
            id={s.anchor}
            className={`py-8 lg:py-12 scroll-mt-24 lg:scroll-mt-28 ${i === 0 ? 'pt-0' : 'border-t border-[#E8E2DA]'}`}
          >
            <div className="mb-5 lg:mb-8">
              <h2 className="text-lg lg:text-2xl font-extrabold text-charcoal">
                {fabricDisplayName(s.material)}
              </h2>
              {BEDDING_MATERIAL_BLURBS[s.material] && (
                <p className="mt-1 text-xs lg:text-sm text-[#999]">
                  {BEDDING_MATERIAL_BLURBS[s.material]}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
              {buildGroupCards(s.list).map((c) => (
                <GroupProductCard key={c.key} card={c} badges={cardBadges(c)} compactText />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* 分区锚点 chips 已移除（2026-10-16 用户定：面料页 hero 下的 "x-Piece Sets n" 锚点行属老筛选残留；
          页面导航由 hero 图下的面料导航排承担） */}
      {flat ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
          {buildGroupCards(sorted).map((c) => (
            <GroupProductCard key={c.key} card={c} badges={cardBadges(c)} compactText />
          ))}
        </div>
      ) : (
        sections.map((s, i) => (
          <section
            key={s.kind}
            id={`sets-${s.kind}`}
            className={`py-8 lg:py-12 scroll-mt-24 lg:scroll-mt-28 ${i === 0 ? 'pt-0' : 'border-t border-[#E8E2DA]'}`}
          >
            {/* 标题只写类型等属性：面料名 hero/面包屑已表达，不重复（2026-09 用户定）；
                副标题 = 套装内容说明（2026-10-16 用户定，字体同 bedding 类目页材质分区副标题） */}
            <div className="mb-5 lg:mb-8">
              <h2 className="text-lg lg:text-2xl font-extrabold text-charcoal">
                {SET_KIND_LABEL[s.kind]}s
              </h2>
              <p className="mt-1 text-xs lg:text-sm text-[#999]">{SET_KIND_PAGE_COPY[s.kind].blurb}</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
              {buildGroupCards(s.list).map((c) => (
                <GroupProductCard
                  key={c.key}
                  card={c}
                  badges={cardBadges(c)}
                  compactText
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
