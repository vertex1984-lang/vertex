import type { Metadata } from 'next';
import GroupProductCard from '@/components/v2/GroupProductCard';
import { v2url } from '@/lib/v2paths';
import { PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';
import { SHOPIFY_MAP } from '@/data/shopify-map';
import { buildBlanketFamilies } from '@/data/blanket-families';
import { buildGroupCards, groupKeyOfFamily, type GroupCard } from '@/lib/group-cards';

export const metadata: Metadata = {
  title: 'New Arrivals',
  description:
    'Just landed at Makimoo — the 20 newest pieces added to the collection.',
};

// 最新上架（组卡，2026-10-22 用户定：一组一卡 + 色卡）：
// 未去重的在售列表按 Shopify 创建时间倒序，按组 key 保留每组首次出现
// （组序 = 组内最新上架者的时间；首屏默认选中色 = 该最新成员的家族颜色），取前 20 个组；
// 成族用未去重列表（buildBlanketFamilies 需看到全部尺寸 SKU 才有正确 From 价）
const inStockByRecency = enrichProductsWithShopifyData(PRODUCTS_DATA)
  .filter((p) => p.hasShopifyData && p.shopifyAvailable)
  .sort((a, b) => {
    const ta = SHOPIFY_MAP[a.asin.toLowerCase()]?.createdAt ?? '';
    const tb = SHOPIFY_MAP[b.asin.toLowerCase()]?.createdAt ?? '';
    return tb.localeCompare(ta);
  });
const familiesByRecency = buildBlanketFamilies(inStockByRecency);
// 组序 = 组内最新上架家族的位次；组首屏选中色 = 最新上架家族的颜色
const groupRecencyOrder: string[] = [];
const groupInitialColor = new Map<string, string>();
{
  const seen = new Set<string>();
  for (const f of familiesByRecency) {
    const k = groupKeyOfFamily(f);
    if (!seen.has(k)) {
      seen.add(k);
      groupRecencyOrder.push(k);
      groupInitialColor.set(k, f.color);
    }
  }
}
const groupCardByKey = new Map(buildGroupCards(familiesByRecency).map((c) => [c.key, c]));
const newArrivals: GroupCard[] = groupRecencyOrder
  .flatMap((k) => {
    const c = groupCardByKey.get(k);
    return c ? [{ ...c, initialColor: groupInitialColor.get(k) }] : [];
  })
  .slice(0, 20);

/**
 * New Arrivals 独立页：浅色面包屑页头 + 家族卡平铺网格（2026-10-20 起全站产品卡统一为家族卡），
 * 展示最新上架的 20 个家族，不区分类目、按族内最新上架时间倒序。
 *（原画报式页面 2026-09 下线：分屏 hero / 批次 feed / 类目卡 / Newsletter / Featured teaser 移除）
 */
export default function NewArrivalsPage() {
  return (
    <div className="px-3 lg:px-10 pt-3 lg:pt-6 pb-10 lg:pb-14">
      {/* 页头（同 /products 类目页）：面包屑 + 左对齐标题 + 右侧结果数 */}
      <nav className="text-xs lg:text-sm text-[#999] mb-2 lg:mb-3" aria-label="Breadcrumb">
        <a href={v2url('/')} className="hover:text-[#8B5A2B] transition-colors">Home</a>
        <span className="mx-1.5">/</span>
        <span className="text-[#555]">New Arrivals</span>
      </nav>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6 lg:mb-10">
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-[#333]">New Arrivals</h1>
        <p className="text-sm text-[#777]">{newArrivals.length} result{newArrivals.length === 1 ? '' : 's'}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
        {newArrivals.map((c) => (
          <GroupProductCard key={c.key} card={c} compactText />
        ))}
      </div>
    </div>
  );
}
