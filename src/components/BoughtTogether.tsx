'use client';

import { useMemo } from 'react';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { getVariantGroupOf } from '@/data/variant-groups';
import { resolveUrl } from '@/lib/paths';
import { formatPrice } from '@/lib/currency';
import { trackEvent, GaItem } from '@/lib/gtag';

// 搭配规则（2026-10-12 用户定：纯规则推荐、无销售数据，命名 Pairs Well With 避免暗示共购数据）：
//  枕套 ↔ 同尺寸枕芯（枕套卖点即 "inserts not included"，最强搭配）；
//  床品 → 睡眠枕芯（Bed Pillows）；坐垫 → 同风格系列其他坐垫（排除本变体族）；
//  其余类目不推荐（宁缺毋滥，凑不够 2 个不渲染）
// 展示形式（2026-10-12 用户定，对标 Parachute "You'll love it with..."）：
//  纯推荐跳转卡（图+标题/价格+箭头），无勾选/合计/捆绑加购；点击跳对应 PDP（GA4 select_item）
// 标题中的尺寸 token（如 40 x 40 / 45x45），用于同尺寸精确匹配
const SIZE_TOKEN_RE = /\d+\s*x\s*\d+/gi;

const sizeTokens = (t: string) =>
  (t.match(SIZE_TOKEN_RE) || []).map((s) => s.replace(/\s+/g, '').toLowerCase());

const getPrice = (p: MakimooProduct) =>
  parseFloat(p.shopifyPrice || p.priceRange.minVariantPrice.amount);

const getThumb = (p: MakimooProduct) =>
  p.shopifyImages?.[0] || p.images[0]?.url || '';

export default function BoughtTogether({ product }: { product: MakimooProduct }) {
  // 全量产品 enrich 一次，用于挑选搭配候选
  const enriched = useMemo(() => enrichProductsWithShopifyData(PRODUCTS_DATA), []);

  const companions = useMemo(() => {
    // 当前产品无可加购的 Shopify variant 或不在售时不渲染
    if (!product.hasShopifyData || !product.shopifyAvailable || !product.shopifyVariantId) return [];

    const inStock = (p: MakimooProduct) =>
      p.hasShopifyData && p.shopifyAvailable && !!p.shopifyVariantId && p.handle !== product.handle;
    // 排除当前产品所属变体族（不推同款异色/异尺寸）
    const myGroup = getVariantGroupOf(product.asin.toLowerCase());
    const myFamily = new Set(myGroup ? myGroup.members.map((m) => m.handle) : []);

    const sub = product.subcategory || '';
    const cat = product.productType.toLowerCase();
    let pool: MakimooProduct[] = [];
    if (sub === 'pillow-cases') {
      // 枕套 → 同尺寸枕芯
      pool = enriched.filter((p) => inStock(p) && p.subcategory === 'pillow-inserts' && !myFamily.has(p.handle));
    } else if (sub === 'pillow-inserts') {
      // 枕芯 → 同尺寸枕套
      pool = enriched.filter((p) => inStock(p) && p.subcategory === 'pillow-cases' && !myFamily.has(p.handle));
    } else if (cat === 'bedding') {
      // 床品 → 睡眠枕芯
      pool = enriched.filter((p) => inStock(p) && p.subcategory === 'pillow-inserts' && /bed pillow/i.test(p.title));
    } else if (cat === 'cushions') {
      // 坐垫 → 同风格系列其他坐垫
      pool = enriched.filter(
        (p) => inStock(p) && p.productType.toLowerCase() === 'cushions' && p.subcategory === sub && !myFamily.has(p.handle)
      );
    } else {
      return [];
    }

    // 优先级：同尺寸 token > 价格在当前产品 ±50% 以内 > 默认顺序
    const currentPrice = getPrice(product);
    const curSizes = sizeTokens(product.title);
    // 枕套↔枕芯必须尺寸严格匹配（2026-10-12 用户反馈：30×50 枕芯配到了 40/45 枕套）：
    // 当前产品有尺寸 token 时只保留同尺寸候选，没有同尺寸就不渲染（宁缺毋滥）
    if ((sub === 'pillow-cases' || sub === 'pillow-inserts') && curSizes.length > 0) {
      pool = pool.filter((p) => sizeTokens(p.title).some((s) => curSizes.includes(s)));
    }
    const scored = pool.map((p, idx) => {
      const price = getPrice(p);
      const sameSize = curSizes.some((s) => sizeTokens(p.title).includes(s));
      const priceClose = price >= currentPrice * 0.5 && price <= currentPrice * 1.5;
      return { p, score: (sameSize ? 2 : 0) + (priceClose ? 1 : 0), idx };
    });
    scored.sort((a, b) => b.score - a.score || a.idx - b.idx);
    // 按变体族去重挑选（2026-10-12 用户反馈：同族两个尺寸兄弟被同时推出，视觉上是同一产品显示两次）
    const usedGroups = new Set<string>();
    const picked: MakimooProduct[] = [];
    for (const s of scored) {
      if (picked.length >= 2) break;
      const gid = getVariantGroupOf(s.p.asin.toLowerCase())?.id || s.p.handle;
      if (usedGroups.has(gid)) continue;
      usedGroups.add(gid);
      picked.push(s.p);
    }
    return picked;
  }, [product, enriched]);

  if (companions.length === 0) return null;

  const handleClick = (p: MakimooProduct) => {
    // GA4：搭配推荐点击跳转
    trackEvent('select_item', {
      item_list_name: 'Pairs Well With',
      items: [{
        item_id: p.handle,
        item_name: p.title,
        item_category: p.productType,
        price: getPrice(p),
        quantity: 1,
      } satisfies GaItem],
    });
  };

  return (
    <div className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#8B5A2B] mb-3">
        Pairs Well With
      </p>
      <div className="space-y-2.5">
        {companions.map((p) => (
          <a
            key={p.handle}
            href={resolveUrl(`/products/${p.handle}/`)}
            onClick={() => handleClick(p)}
            className="flex items-center gap-3.5 rounded-xl bg-[#F1EBE2] p-3 transition hover:bg-[#EAE2D6]"
          >
            <span
              className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 ${
                p.imageWhiteBg?.[0] ? 'bg-white' : 'bg-[#ECE6DD]'
              }`}
            >
              <img
                src={resolveUrl(getThumb(p))}
                alt={p.title}
                loading="lazy"
                className={`w-full h-full object-contain ${p.imageWhiteBg?.[0] ? 'p-1' : ''}`}
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-charcoal leading-snug line-clamp-2">{p.title}</span>
              <span className="block text-sm font-semibold text-[#8B5A2B] mt-1">
                {formatPrice(getPrice(p), p.shopifyCurrencyCode || p.priceRange.minVariantPrice.currencyCode)}
              </span>
            </span>
            <span className="w-8 h-8 rounded-lg bg-[#8B5A2B] text-white flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
