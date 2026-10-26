'use client';

import { useState, useEffect } from 'react';
import GroupProductCard from '@/components/v2/GroupProductCard';
import DragScroll from '@/components/v2/DragScroll';
import { getRecentlyViewed } from '@/lib/recently-viewed';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { buildBlanketFamilies } from '@/data/blanket-families';
import { familyColorOf } from '@/lib/family-cards';
import { buildGroupCards, groupKeyOfProduct, type GroupCard } from '@/lib/group-cards';

interface V2RecentlyViewedProps {
  /** 当前产品 handle，展示时排除自身 */
  currentHandle?: string;
}

// 全量 enriched 产品的组 key → 组卡表（模块级缓存只算一次）：
// 色卡变体 = 组内全部颜色（buildBlanketFamilies 需看到未去重全量列表才有正确 From 价/全色卡）
let groupIndex: Map<string, GroupCard> | null = null;
function getGroupIndex(): Map<string, GroupCard> {
  if (!groupIndex) {
    groupIndex = new Map(
      buildGroupCards(buildBlanketFamilies(enrichProductsWithShopifyData(PRODUCTS_DATA))).map(
        (c) => [c.key, c]
      )
    );
  }
  return groupIndex;
}

// RecentlyViewed 的 V2 包装版：localStorage 读取 + 排除自身 + 取前 8 个组，
// 卡片为组卡 GroupProductCard（2026-10-22 用户定：一组一卡 + 色卡——同组多个已浏览 handle
// 合并为一张卡，首屏选中色 = 最近浏览成员的颜色，色卡展示组内全部颜色）。
// 版式（2026-09-29 用户定）：与 PDP "You May Also Like" 完全同款——80% 宽容器、同字号标题、
// DragScroll 拖拽横滑、卡片同宽（桌面约 4.5 张可见，右缘露半张暗示可滑）
export default function V2RecentlyViewed({ currentHandle }: V2RecentlyViewedProps) {
  // localStorage 仅客户端可读，mount 后再取，避免 SSR 水合不一致
  const [cards, setCards] = useState<GroupCard[]>([]);

  useEffect(() => {
    const handles = getRecentlyViewed().filter((h) => h !== currentHandle);
    const found = handles
      .map((h) => PRODUCTS_DATA.find((p) => p.handle === h))
      .filter(Boolean) as MakimooProduct[];
    const enriched = enrichProductsWithShopifyData(found);
    const index = getGroupIndex();
    // 按组 key 折叠（已按浏览时间倒序，首个 = 最近浏览），取前 8 个组
    const seen = new Set<string>();
    const out: GroupCard[] = [];
    for (const p of enriched) {
      if (out.length >= 8) break;
      const key = groupKeyOfProduct(p);
      if (seen.has(key)) continue;
      seen.add(key);
      const card = index.get(key);
      if (!card) continue;
      // 首屏选中色 = 最近浏览成员的颜色（卡面主图/价格/评分随它）
      const color = familyColorOf(p);
      out.push(color ? { ...card, initialColor: color } : card);
    }
    setCards(out);
  }, [currentHandle]);

  if (cards.length === 0) return null;

  return (
    <section className="bg-off-white">
      <div className="mx-auto max-w-[1520px] lg:w-[80%] lg:max-w-none px-6 lg:px-10 pt-14 pb-14 lg:pt-20 lg:pb-20">
        <div className="mb-6 lg:mb-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2">Your Browsing</p>
          <h2 className="text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal">Recently Viewed</h2>
        </div>
        {/* 横滑：触摸原生滚动 + 桌面鼠标拖拽（与 You May Also Like 同款），snap 吸附、隐藏滚动条 */}
        <DragScroll className="flex gap-4 lg:gap-5 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {cards.map((card) => (
            <div key={card.key} className="w-[38vw] sm:w-[30vw] lg:w-[calc((100%-5rem)/4.5)] flex-shrink-0 snap-start">
              <GroupProductCard card={card} />
            </div>
          ))}
        </DragScroll>
      </div>
    </section>
  );
}
