'use client';

import { useState, useEffect } from 'react';
import BeddingSetCard, { type FamilyCardData } from '@/components/v2/BeddingSetCard';
import DragScroll from '@/components/v2/DragScroll';
import { getRecentlyViewed } from '@/lib/recently-viewed';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { buildBlanketFamilies, type BlanketFamily } from '@/data/blanket-families';
import { familyKeyOf, familyColorOf } from '@/lib/family-cards';

interface V2RecentlyViewedProps {
  /** 当前产品 handle，展示时排除自身 */
  currentHandle?: string;
}

// 全量 enriched 产品的 familyKey → 家族表（模块级缓存只算一次）：
// From 价取同族成员最低价（buildBlanketFamilies 需看到未去重全量列表才有正确 From 价）
let familyIndex: Map<string, BlanketFamily> | null = null;
function getFamilyIndex(): Map<string, BlanketFamily> {
  if (!familyIndex) {
    familyIndex = new Map(
      buildBlanketFamilies(enrichProductsWithShopifyData(PRODUCTS_DATA)).map((f) => [f.key, f])
    );
  }
  return familyIndex;
}

// RecentlyViewed 的 V2 包装版：localStorage 读取 + 排除自身 + 取前 8 个家族，
// 卡片为家族卡 BeddingSetCard（2026-10-20 用户定：全站产品卡统一为家族卡——同族合并一张卡，From 最低价；
// 同族多个已浏览 handle 合并为一张卡，保留最先出现 = 最近浏览的成员作 rep）。
// 版式（2026-09-29 用户定）：与 PDP "You May Also Like" 完全同款——80% 宽容器、同字号标题、
// DragScroll 拖拽横滑、卡片同宽（桌面约 4.5 张可见，右缘露半张暗示可滑）
export default function V2RecentlyViewed({ currentHandle }: V2RecentlyViewedProps) {
  // localStorage 仅客户端可读，mount 后再取，避免 SSR 水合不一致
  const [families, setFamilies] = useState<FamilyCardData[]>([]);

  useEffect(() => {
    const handles = getRecentlyViewed().filter((h) => h !== currentHandle);
    const found = handles
      .map((h) => PRODUCTS_DATA.find((p) => p.handle === h))
      .filter(Boolean) as MakimooProduct[];
    const enriched = enrichProductsWithShopifyData(found);
    const index = getFamilyIndex();
    // 按 familyKey 折叠（已按浏览时间倒序，首个 = 最近浏览），取前 8 个家族
    const seen = new Set<string>();
    const out: FamilyCardData[] = [];
    for (const p of enriched) {
      if (out.length >= 8) break;
      const key = familyKeyOf(p);
      if (seen.has(key)) continue;
      seen.add(key);
      const fam = index.get(key);
      out.push({
        rep: p,
        sizes: [],
        fromPrice:
          fam?.fromPrice ?? (p.shopifyPrice || p.priceRange.minVariantPrice.amount),
        currency:
          fam?.currency ?? (p.shopifyCurrencyCode || p.priceRange.minVariantPrice.currencyCode),
        colorLine: familyColorOf(p) || undefined,
      });
    }
    setFamilies(out);
  }, [currentHandle]);

  if (families.length === 0) return null;

  return (
    <section className="bg-off-white">
      <div className="mx-auto max-w-[1520px] lg:w-[80%] lg:max-w-none px-6 lg:px-10 pt-14 pb-14 lg:pt-20 lg:pb-20">
        <div className="mb-6 lg:mb-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2">Your Browsing</p>
          <h2 className="text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal">Recently Viewed</h2>
        </div>
        {/* 横滑：触摸原生滚动 + 桌面鼠标拖拽（与 You May Also Like 同款），snap 吸附、隐藏滚动条 */}
        <DragScroll className="flex gap-4 lg:gap-5 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {families.map((family) => (
            <div key={family.rep.id} className="w-[38vw] sm:w-[30vw] lg:w-[calc((100%-5rem)/4.5)] flex-shrink-0 snap-start">
              <BeddingSetCard family={family} />
            </div>
          ))}
        </DragScroll>
      </div>
    </section>
  );
}
