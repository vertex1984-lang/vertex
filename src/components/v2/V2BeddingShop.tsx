'use client';

import { useMemo } from 'react';
import { MakimooProduct } from '@/data/products';
import { buildSetFamilies, classifySet, clusterSetFamilies, SetFamily } from '@/data/bedding-families';
import { fabricDisplayName } from '@/data/bedding-fabrics';
import GroupProductCard from '@/components/v2/GroupProductCard';
import V2EditorialTile from '@/components/v2/V2EditorialTile';
import { buildGroupCards, collapseProductsToGroupCards } from '@/lib/group-cards';
import { sortByWeight } from '@/lib/weights';
import { dedupeFamilyColors } from '@/lib/listing-dedupe';
import { BEDDING_MATERIAL_ORDER } from '@/data/subcategories';
import type { EditorialTile } from '@/data/editorial-tiles';

/**
 * Bedding 类目页选购视图（/products?cat=bedding）。
 * 2026-11-01 用户定：
 * - 取消按类型分区（原 Sheets & Duvet Sets / Sheet Sets / Duvet Covers 分区标题、
 *   面料位次排序、FOUR/DUVET 分区卡位对调全部废除），全部家族融合为单一网格；
 * - 排序 = 种子随机打乱（LCG，种子定死 → 每次构建顺序稳定；想换顺序改 SHUFFLE_SEED）；
 * - 种草图按 4/8/4/8 节奏插入网格（数据见 editorial-tiles.ts 的 bedding 键，
 *   图源不复用子分类页已用图）；
 * - 卡片标题 = 布料+产品类型单数（beddingCardTitle，2026-11-01 用户定）。
 * 旧分区版组件逻辑（含位次对调）已随本重写移除；如需回退看 git 历史。
 */

/** 洗牌种子（2026-11-01 首版） */
const SHUFFLE_SEED = 20261101;

/** 种子随机洗牌（LCG；同种子同序，构建期稳定） */
function seededShuffle<T>(list: T[], seed: number): T[] {
  const a = [...list];
  let s = seed >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function V2BeddingShop({
  products,
  editorialTiles,
}: {
  products: MakimooProduct[];
  editorialTiles?: EditorialTile[];
}) {
  // 家族聚合 + 未匹配家族规则的兜底产品（新增 bedding 产品若不符合 ASIN 前缀规律也不会消失）。
  // 注意：上游传入的是未去重全量列表（家族需要全尺寸 SKU 拼尺寸带），
  // 兜底区逐 SKU 出卡前必须先做同色去重，否则同款 3 个尺寸并排重复（2026-09 修复）
  const families = useMemo(() => buildSetFamilies(products), [products]);
  const unclassified = useMemo(
    () => dedupeFamilyColors(products.filter((p) => !classifySet(p.asin))),
    [products]
  );

  // 2026-11-01 用户定：全家族融合 + 种子随机打乱。
  // 注意（同日修复）：先按面料位次+权重排序、聚卡后再洗【卡片位置】——
  // 卡面代表色保持 Featured 口径（洗家族会让组卡代表色随机漂移，两张相似卡面相邻易被误认为变体拆卡）
  const cards = useMemo(() => {
    const rankOf = (f: SetFamily) => {
      const i = BEDDING_MATERIAL_ORDER.indexOf(f.materials[0] || '');
      return i === -1 ? 999 : i;
    };
    const reps = sortByWeight(families.map((f) => f.rep));
    const byRep = new Map(families.map((f) => [f.rep.id, f]));
    const ordered = reps.map((r) => byRep.get(r.id)!).filter(Boolean);
    ordered.sort((a, b) => rankOf(a) - rankOf(b));
    return seededShuffle(buildGroupCards(clusterSetFamilies(ordered)), SHUFFLE_SEED);
  }, [families]);

  return (
    <div>
      {/* 单一融合网格（2026-11-01 用户定，取代原类型分区）；
          卡片按色系家族聚合（buildGroupCards 一组一卡 + 色卡）；
          Duvet Covers（kind=duvet）卡图 1:1 折叠图不偏移，其余 3:4 图 cropBiasRight（沿用原分区版口径）；
          种草图：插在「第 N 张产品卡之后」（afterIndex，1 起计，4/8/4/8 节奏） */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
        {cards.flatMap((c, i) => {
          const kind = classifySet(c.rep.asin);
          const nodes = [
            <GroupProductCard
              key={c.key}
              card={c}
              badges={c.materials?.[0] ? [fabricDisplayName(c.materials[0])] : []}
              compactText
              cropBiasRight={kind !== 'duvet' && !c.key.toLowerCase().startsWith('duvset')}
              anchorLeft={kind !== 'duvet' && c.key.toLowerCase().startsWith('duvset')}
            />,
          ];
          for (const t of editorialTiles ?? []) {
            if (t.afterIndex === i + 1) nodes.push(<V2EditorialTile key={t.image} tile={t} />);
          }
          return nodes;
        })}
      </div>
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
