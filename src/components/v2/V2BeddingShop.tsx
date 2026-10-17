'use client';

import { useMemo } from 'react';
import { MakimooProduct } from '@/data/products';
import { buildSetFamilies, classifySet, clusterSetFamilies, SET_KIND_PAGE_COPY, SetFamily, SetKind } from '@/data/bedding-families';
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
 * - 视图固定为【按类型分区】展示全部家族（2026-10-16 用户定：取代原按材质分区，
 *   分区与 hero 快链五项同口径）：Duvet Cover Sets（3 件套）→ Sheets & Duvet Sets（4 件套）
 *   → Duvet Covers →（Sheets / Pillow Covers 无产品不出分区；Comforter 有产品时排最后）；
 *   分区标题 + 套装内容副标题（SET_KIND_PAGE_COPY）+ BeddingSetCard 网格；排序固定 Featured/权重序
 * - 卡片按色系家族聚合（23 款而非 92 SKU，减少选择瘫痪）
 * - From 最低价 + 尺码带直接上卡，价格透明度前置
 * 旧聚合页 V2BeddingLanding 组件保留在磁盘上备用（全站已无入口）。
 */

/** 分区顺序（2026-10-16 用户定，与 hero 快链一致）；comforter 不在五项里，有产品时兜底排最后 */
const SECTION_KIND_ORDER: SetKind[] = ['three', 'four', 'duvet', 'comforter'];

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

  // 按类型分区（无产品的类型不出分区）
  const kindSections = useMemo(
    () =>
      SECTION_KIND_ORDER.map((kind) => ({
        kind,
        copy: SET_KIND_PAGE_COPY[kind],
        list: sortFamilies(families.filter((f) => f.kind === kind)),
      })).filter((s) => s.list.length > 0),
    [families, sortFamilies]
  );

  return (
    <div>
      {/* 家族卡网格：与全站 PLP 同列数节奏；按类型分区（2026-10-16 用户定） */}
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
              卡片只叠「标题未表达的另一维度」；badge 开关全站关闭中，见 BeddingSetCard） */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
            {s.list.map((f) => (
              <BeddingSetCard
                key={f.key}
                family={f}
                badges={f.materials[0] ? [fabricDisplayName(f.materials[0])] : []}
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
