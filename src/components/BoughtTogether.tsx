'use client';

import { useMemo, useState } from 'react';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { resolveUrl } from '@/lib/paths';
import { addToShopifyCart, notifyCartUpdated, openMiniCart } from '@/lib/cart';
import { formatPrice } from '@/lib/currency';
import { trackEvent, GA_CURRENCY, GaItem } from '@/lib/gtag';
import { useToast } from '@/components/Toast';

// 搭配类目映射（纯规则推荐，无销售数据）
const CATEGORY_COMPANIONS: Record<string, string[]> = {
  Pillows: ['Pillows', 'Cushions'],
  Cushions: ['Mats', 'Cushions'],
  Towels: ['Mats'],
  Mats: ['Towels', 'Cushions'],
  Others: ['Others'],
  Holiday: [],
};

// 标题中的尺寸 token（如 18 x 18 / 24x24），用于优先匹配同尺寸候选
const SIZE_TOKEN_RE = /\d+\s*x\s*\d+/i;

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
    const targets = CATEGORY_COMPANIONS[product.productType] ?? [];
    if (targets.length === 0) return [];

    const inStock = (p: MakimooProduct) =>
      p.hasShopifyData && p.shopifyAvailable && !!p.shopifyVariantId && p.handle !== product.handle;
    const pool = targets.flatMap(cat => enriched.filter(p => inStock(p) && p.productType === cat));

    // 优先级：同尺寸 token > 价格在当前产品 ±50% 以内 > 默认顺序
    const currentPrice = getPrice(product);
    const sizeToken = product.title.match(SIZE_TOKEN_RE)?.[0].replace(/\s+/g, '').toLowerCase();
    const scored = pool.map((p, idx) => {
      const price = getPrice(p);
      const sameSize = sizeToken
        ? p.title.replace(/\s+/g, '').toLowerCase().includes(sizeToken)
        : false;
      const priceClose = price >= currentPrice * 0.5 && price <= currentPrice * 1.5;
      return { p, score: (sameSize ? 2 : 0) + (priceClose ? 1 : 0), idx };
    });
    scored.sort((a, b) => b.score - a.score || a.idx - b.idx);
    return scored.slice(0, 2).map(s => s.p);
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
    // 横版条目：左图（勾选框叠加在图左上角）+ 右侧标题/价格
    <div className="flex items-center gap-3">
      <div
        className={`relative w-16 h-16 rounded-lg overflow-hidden border border-[#E8E2DA] flex-shrink-0 ${
          p.imageWhiteBg?.[0] ? 'bg-white' : 'bg-[#F8F5F0]'
        }`}
      >
        <img
          src={resolveUrl(getThumb(p))}
          alt={p.title}
          loading="lazy"
          className={`w-full h-full object-contain ${p.imageWhiteBg?.[0] ? 'p-1' : ''}`}
        />
        {fixed ? (
          // 当前产品固定勾选，不可取消
          <span className="absolute top-1 left-1 w-4 h-4 rounded-sm bg-[#8B5A2B] flex items-center justify-center">
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
            className={`absolute top-1 left-1 w-4 h-4 rounded-sm flex items-center justify-center border ${
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
      </div>
      <div className="w-32 sm:w-36 min-w-0">
        <p className="text-xs text-[#555] leading-snug line-clamp-2">{p.title}</p>
        <p className="text-xs font-semibold text-[#8B5A2B] mt-1">
          {formatPrice(getPrice(p), p.shopifyCurrencyCode || p.priceRange.minVariantPrice.currencyCode)}
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-[#E8E2DA] p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#8B5A2B] mb-3">
        Frequently Bought Together
      </p>
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        {/* 桌面端一行放下（nowrap），窄屏才允许换行 */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-x-3 gap-y-3 min-w-0">
          {renderItem(product, true)}
          {companions.map((c) => (
            <div key={c.handle} className="flex items-center gap-2 sm:gap-3">
              <span className="text-lg text-[#999]">+</span>
              {renderItem(c, false)}
            </div>
          ))}
        </div>
        <div className="lg:ml-auto flex items-center gap-4 flex-shrink-0">
          <p className="text-sm text-[#555] whitespace-nowrap">
            Total price:{' '}
            <span className="text-lg font-bold text-[#8B5A2B]">
              {formatPrice(totalPrice, displayCurrency)}
            </span>
          </p>
          <button
            onClick={handleAddSelected}
            disabled={adding}
            className="px-6 py-3 rounded-full text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:hover:translate-y-0"
            style={{ backgroundColor: '#8B5A2B' }}
          >
            {adding ? 'Adding...' : 'Add Selected to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
