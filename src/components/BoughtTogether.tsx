'use client';

import { useMemo, useState } from 'react';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { getVariantGroupOf } from '@/data/variant-groups';
import { resolveUrl } from '@/lib/paths';
import { addToShopifyCart, notifyCartUpdated, openMiniCart } from '@/lib/cart';
import { formatPrice } from '@/lib/currency';
import { trackEvent, GA_CURRENCY, GaItem } from '@/lib/gtag';
import { useToast } from '@/components/Toast';

// 搭配规则（2026-10-12 用户定：纯规则推荐、无销售数据，命名 Pairs Well With 避免暗示共购数据）：
//  枕套 ↔ 同尺寸枕芯（枕套卖点即 "inserts not included"，最强搭配）；
//  床品 → 睡眠枕芯（Bed Pillows）；坐垫 → 同风格系列其他坐垫（排除本变体族）；
//  其余类目不推荐（宁缺毋滥，凑不够 2 个不渲染）
// 标题中的尺寸 token（如 40 x 40 / 45x45），用于同尺寸精确匹配
const SIZE_TOKEN_RE = /\d+\s*x\s*\d+/gi;

const sizeTokens = (t: string) =>
  (t.match(SIZE_TOKEN_RE) || []).map((s) => s.replace(/\s+/g, '').toLowerCase());

const getPrice = (p: MakimooProduct) =>
  parseFloat(p.shopifyPrice || p.priceRange.minVariantPrice.amount);

const getThumb = (p: MakimooProduct) =>
  p.shopifyImages?.[0] || p.images[0]?.url || '';

export default function BoughtTogether({ product }: { product: MakimooProduct }) {
  const { toast } = useToast();
  const [unchecked, setUnchecked] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState(false);

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

  const selected = companions.filter(c => !unchecked[c.handle]);
  const items = [product, ...selected];
  const totalPrice = items.reduce((sum, p) => sum + getPrice(p), 0);
  const displayCurrency =
    product.shopifyCurrencyCode || product.priceRange.minVariantPrice.currencyCode;

  const handleAddSelected = async () => {
    setAdding(true);
    try {
      let failed = false;
      // 依次把当前产品（quantity=1）+ 勾选候选加入 Shopify 购物车
      for (const item of items) {
        const ok = await addToShopifyCart(item.shopifyVariantId!, 1);
        if (!ok) failed = true;
      }
      notifyCartUpdated();
      if (failed) {
        toast('Some items failed to add. Please try again.', 'error');
      } else {
        // GA4：搭配购打包加购
        trackEvent('add_to_cart', {
          currency: GA_CURRENCY,
          value: totalPrice,
          items: items.map(p => ({
            item_id: p.handle,
            item_name: p.title,
            item_category: p.productType,
            price: getPrice(p),
            quantity: 1,
          } satisfies GaItem)),
        });
        openMiniCart();
        toast('Added to cart!');
      }
    } catch {
      toast('Something went wrong. Please try again.', 'error');
    } finally {
      setAdding(false);
    }
  };

  const renderItem = (p: MakimooProduct, fixed: boolean) => (
    // 竖排条目（2026-10-12 适配新版 PDP 窄购买栏）：勾选框 + 缩略图 + 标题/价格
    <div className="flex items-center gap-3">
      {fixed ? (
        // 当前产品固定勾选，不可取消
        <span className="w-4 h-4 rounded-sm bg-[#8B5A2B] flex items-center justify-center flex-shrink-0">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setUnchecked(prev => ({ ...prev, [p.handle]: !prev[p.handle] }))}
          aria-pressed={!unchecked[p.handle]}
          aria-label={`Include ${p.title}`}
          className={`w-4 h-4 rounded-sm flex items-center justify-center border flex-shrink-0 ${
            unchecked[p.handle] ? 'bg-white border-[#C9C2B8]' : 'bg-[#8B5A2B] border-[#8B5A2B]'
          }`}
        >
          {!unchecked[p.handle] && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </button>
      )}
      <a
        href={resolveUrl(`/products/${p.handle}/`)}
        className={`relative w-14 h-14 rounded-lg overflow-hidden border border-[#E8E2DA] flex-shrink-0 ${
          p.imageWhiteBg?.[0] ? 'bg-white' : 'bg-[#F8F5F0]'
        }`}
      >
        <img
          src={resolveUrl(getThumb(p))}
          alt={p.title}
          loading="lazy"
          className={`w-full h-full object-contain ${p.imageWhiteBg?.[0] ? 'p-1' : ''}`}
        />
      </a>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[#555] leading-snug line-clamp-2">
          {fixed && <span className="font-semibold text-[#8B5A2B]">This item: </span>}
          {p.title}
        </p>
        <p className="text-xs font-semibold text-[#8B5A2B] mt-0.5">
          {formatPrice(getPrice(p), p.shopifyCurrencyCode || p.priceRange.minVariantPrice.currencyCode)}
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-[#E8E2DA] p-4 sm:p-5 mb-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#8B5A2B] mb-3">
        Pairs Well With
      </p>
      <div className="space-y-3">
        {renderItem(product, true)}
        {companions.map((c) => (
          <div key={c.handle}>{renderItem(c, false)}</div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-[#E8E2DA]">
        <p className="text-sm text-[#555] mb-3">
          Total for {items.length} item{items.length > 1 ? 's' : ''}:{' '}
          <span className="text-lg font-bold text-[#8B5A2B]">
            {formatPrice(totalPrice, displayCurrency)}
          </span>
        </p>
        <button
          onClick={handleAddSelected}
          disabled={adding}
          className="w-full px-6 py-3 rounded-full text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:hover:translate-y-0"
          style={{ backgroundColor: '#8B5A2B' }}
        >
          {adding ? 'Adding...' : `Add ${items.length} Item${items.length > 1 ? 's' : ''} to Cart`}
        </button>
      </div>
    </div>
  );
}
