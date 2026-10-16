'use client';

import { useMemo } from 'react';
import { MakimooProduct } from '@/data/products';
import { buildSetFamilies, classifySet, clusterSetFamilies, SET_KIND_LABEL, SetFamily } from '@/data/bedding-families';
import { BEDDING_MATERIAL_BLURBS, sortBeddingMaterials } from '@/data/subcategories';
import { fabricDisplayName } from '@/data/bedding-fabrics';
import BeddingSetCard from '@/components/v2/BeddingSetCard';
import V2ProductCard from '@/components/v2/V2ProductCard';
import { sortByWeight } from '@/lib/weights';
import { dedupeFamilyColors } from '@/lib/listing-dedupe';

/**
 * Bedding 类目页选购视图（2026-09 重做，替代 V2BeddingLanding 聚合页）：
 * 定位 = 付费搜索落地页（任务型流量）。设计目标 = 最大化向下推进（进 PDP / 继续下滑）：
 * - 2026-10-16 用户定：页头改 Parachute 式 hero（见 V2BeddingCatHero，类型/面料二级页快链
 *   承担导航），本组件的 Type/Fabric 筛选条（含移动端 Filter 弹层）整体移除；
 *   旧 ?type=/?sub= 深链失效后降级为完整分区视图
 * - 视图固定为【按材质分区】展示全部家族（2026-09 用户定，参照 /bedding/bed-sets/ 子页结构）：
 *   材质标题 + 一句话描述 + BeddingSetCard 网格（卡片图上叠 type 标签——分区标题已表材质，
 *   2026-09 用户定统一规则：卡片只叠「标题未表达的另一维度」）；排序固定 Featured/权重序
 * - 卡片按色系家族聚合（23 款而非 92 SKU，减少选择瘫痪）
 * - From 最低价 + 尺码带直接上卡，价格透明度前置
 * 旧聚合页 V2BeddingLanding 组件保留在磁盘上备用（全站已无入口）。
 */

/** 材质名 → 分区锚点 id（"100% Linen" → fabric-100-linen） */
function fabricAnchor(material: string): string {
  return `fabric-${material.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
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

  // 排序固定 Featured（权重序，2026-09 用户定）+ 同变体族色卡聚拢相邻（2026-10-16 用户定）
  const sortFamilies = useMemo(
    () => (list: SetFamily[]): SetFamily[] => {
      const reps = sortByWeight(list.map((f) => f.rep));
      const byRep = new Map(list.map((f) => [f.rep.id, f]));
      return clusterSetFamilies(reps.map((r) => byRep.get(r.id)!).filter(Boolean));
    },
    []
  );

  // 材质分区：每家族只归一个材质区（materials[0]），
  // 分区顺序按 BEDDING_MATERIAL_ORDER、未收录材质按家族数降序兜底
  const materialSections = useMemo(() => {
    const map = new Map<string, SetFamily[]>();
    for (const f of families) {
      const m = f.materials[0] || 'Other';
      if (!map.has(m)) map.set(m, []);
      map.get(m)!.push(f);
    }
    return sortBeddingMaterials(Array.from(map.entries()), (e) => e[1].length).map(
      ([m, list]) => ({ material: m, anchor: fabricAnchor(m), list: sortFamilies(list) })
    );
  }, [families, sortFamilies]);

  return (
    <div>
      {/* 家族卡网格：与全站 PLP 同列数节奏；按材质分区（2026-09 用户定） */}
      {materialSections.map((s, i) => (
        <section
          key={s.material}
          id={s.anchor}
          className={`py-8 lg:py-12 ${i === 0 ? 'pt-0' : 'border-t border-[#E8E2DA]'}`}
        >
          <div className="mb-5 lg:mb-8">
            <h2 className="text-lg lg:text-2xl font-extrabold text-charcoal">{fabricDisplayName(s.material)}</h2>
            {BEDDING_MATERIAL_BLURBS[s.material] && (
              <p className="mt-1 text-xs lg:text-sm text-[#999]">
                {BEDDING_MATERIAL_BLURBS[s.material]}
              </p>
            )}
          </div>
          {/* 材质分区标题已表材质；卡片图上叠 type 标签（2026-09 用户定规则） */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
            {s.list.map((f) => (
              <BeddingSetCard
                key={f.key}
                family={f}
                badges={[SET_KIND_LABEL[f.kind]]}
                compactText
              />
            ))}
          </div>
        </section>
      ))}
      {unclassified.length > 0 && (
        <>
          <h2 className="mt-10 lg:mt-14 mb-4 text-lg lg:text-2xl font-extrabold text-[#333]">More Bedding</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
            {unclassified.map((p) => (
              <V2ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
