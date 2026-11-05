'use client';

import { useMemo } from 'react';
import { MakimooProduct } from '@/data/products';
import GroupProductCard from '@/components/v2/GroupProductCard';
import { buildGroupCards } from '@/lib/group-cards';
import { buildBlanketFamilies } from '@/data/blanket-families';
import { sortFamiliesByWeight } from '@/lib/family-cards';

/**
 * /products?cat=mats 选购视图（2026-11-05：按 towels/decor 的 bedding 标准结构新建；
 * 同日用户定：取消分区，全部家族卡在一个结果网格里平铺展示）：
 * - 复用 buildBlanketFamilies 按颜色成族（不传 extraKey：取消二级分类拆卡，
 *   同一色族跨 kitchen/bath/door/area-rugs 合并为一卡，避免同网格内出现重复卡面）；
 *   排序固定 Featured（权重序，sortFamiliesByWeight）
 * - 无筛选条/排序下拉/左侧栏，也无分区标题与 blurb（hero 快链同步移除，见 page.tsx）
 * - 卡面标题走 familyCardDisplay 默认分支（原标题 + 色卡行）：mats 短标题已在
 *   short-titles.ts 全量配置（enrich 时套用），GroupProductCard 自动去尾部 ", N x N cm"
 * - 传入未去重原始列表：buildBlanketFamilies 需看到同色全部尺寸 SKU 才能拼正确 From 价；
 *   buildGroupCards 对 Mats 已有专门口径（代表色优先选在售 SKU、From 价只算可售变体，
 *   因为 rugs 大部分 SKU 未上架 Shopify）
 */
export default function V2MatsShop({ products }: { products: MakimooProduct[] }) {
  const families = useMemo(
    () => sortFamiliesByWeight(buildBlanketFamilies(products)),
    [products]
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
      {/* 一组一卡（2026-10-22 用户定）：同组同色并卡 + 色卡行 */}
      {buildGroupCards(families).map((c) => (
        <GroupProductCard key={c.key} card={c} compactText />
      ))}
    </div>
  );
}
