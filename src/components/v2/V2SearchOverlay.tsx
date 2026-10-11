'use client';

/**
 * 全屏搜索层（2026-10 P2，Parachute 式，移动/桌面统一全屏）
 * - 空态：Search Suggestions 热词胶囊（search-config.ts）+ Recommended Products 网格
 *   （基础分 = 评分×ln(1+评论数)，在售优先、同族去重、类目多样性 ≤2/类目、
 *    个性化 affinity 加成上限 +50%，见 user-profile.ts；manualHandles 人工单置顶）
 * - 输入态：统一引擎联想（searchAll，家族去重 top6）+ 品类直达行（matchCategories）
 * - Enter → /products/?q=；Esc/× 关闭；开层锁滚动、自动聚焦
 * - 埋点：search_open / search_suggest_click / recommended_click；
 *   提交与点击联想记录搜索词（user-profile.recordSearchTerm）
 * 替代原 V2Header 内的下拉搜索面板（2026-10 P2 移除）。
 */
import { useState, useEffect, useRef } from 'react';
import { resolveUrl, shopifyImageUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { trackEvent } from '@/lib/gtag';
import { PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';
import type { MakimooProduct } from '@/data/products';
import { searchAll, matchCategories, familyKeyOf, productTagsOf, type CategoryHit } from '@/lib/search-engine';
import { HOT_SEARCHES, RECOMMENDED } from '@/data/search-config';
import { getAffinity, recordSearchTerm } from '@/lib/user-profile';

interface V2SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

function formatPrice(amount: string, currency: string): string {
  const value = parseFloat(amount);
  if (Number.isNaN(value)) return '';
  return currency === 'USD' ? `$${value.toFixed(2)}` : `${currency} ${value.toFixed(2)}`;
}

function cardImage(p: MakimooProduct): { url: string; alt: string } | undefined {
  if (p.shopifyImages && p.shopifyImages.length > 0) {
    return { url: shopifyImageUrl(p.shopifyImages[0], 600), alt: p.title };
  }
  return p.images[0] ? { url: p.images[0].url, alt: p.images[0].altText || p.title } : undefined;
}

function priceOf(p: MakimooProduct): string {
  const amount = p.shopifyPrice || p.priceRange.minVariantPrice.amount;
  const currency = p.shopifyCurrencyCode || p.priceRange.minVariantPrice.currencyCode;
  return formatPrice(amount, currency);
}

/** 推荐网格选品：评分基础分 × 类目多样性 × 个性化加成；人工单置顶；同族去重 */
function computeRecommended(): MakimooProduct[] {
  const all = enrichProductsWithShopifyData(PRODUCTS_DATA);
  const aff = getAffinity();
  const scored = all.map((p) => {
    const rating = p.rating ?? 0;
    const reviews = p.reviewCount ?? 0;
    // 基础分：评分×ln(1+评论数)；无评分产品给基线兜底（避免新目录完全排不上）
    let score = rating > 0 && reviews > 0 ? rating * Math.log(1 + reviews) : 0.4;
    const t = productTagsOf(p);
    const affinity = [t.category, t.subcategory, ...t.materials, ...t.colors, ...t.scene].reduce(
      (s, tag) => s + (aff[tag] || 0),
      0
    );
    // 个性化加成上限 +50%（画像分 0.1 → +1%）
    score *= 1 + Math.min(0.5, affinity * 0.1);
    return { p, score, cat: t.category, inStock: p.shopifyAvailable ?? p.availableForSale };
  });
  scored.sort((x, y) => (x.inStock === y.inStock ? y.score - x.score : x.inStock ? -1 : 1));
  // source === 'sales'（销量优先）分支位：Shopify 订单数据回流后在此切换排序依据（search-config.ts 开关）

  const out: MakimooProduct[] = [];
  const seenFamily = new Set<string>();
  const catCount: Record<string, number> = {};
  const pushAuto = (p: MakimooProduct) => {
    if (out.length >= RECOMMENDED.count) return;
    const key = familyKeyOf(p);
    if (seenFamily.has(key)) return;
    const c = (p.productType || '').toLowerCase();
    if ((catCount[c] || 0) >= RECOMMENDED.maxPerCategory) return;
    seenFamily.add(key);
    catCount[c] = (catCount[c] || 0) + 1;
    out.push(p);
  };
  // 人工置顶单：绕过类目多样性限制（运营意图优先），仍做家族去重与数量上限
  for (const handle of RECOMMENDED.manualHandles) {
    const p = all.find((x) => x.handle === handle);
    if (p && out.length < RECOMMENDED.count) {
      const key = familyKeyOf(p);
      if (!seenFamily.has(key)) {
        seenFamily.add(key);
        out.push(p);
      }
    }
  }
  for (const s of scored) pushAuto(s.p);
  return out;
}

export default function V2SearchOverlay({ open, onClose }: V2SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [suggestions, setSuggestions] = useState<MakimooProduct[]>([]);
  const [categories, setCategories] = useState<CategoryHit[]>([]);
  const [recommended, setRecommended] = useState<MakimooProduct[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // 开层：锁滚动、自动聚焦、埋点、推荐选品（一次性）；关层复位
  useEffect(() => {
    if (!open) {
      setQuery('');
      setDebounced('');
      setSuggestions([]);
      setCategories([]);
      return;
    }
    trackEvent('search_open');
    setRecommended(computeRecommended());
    document.body.style.overflow = 'hidden';
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // 输入防抖 300ms → 联想 + 品类直达
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debounced.length >= 2) {
      setSuggestions(searchAll(debounced, 6));
      setCategories(matchCategories(debounced, 3));
    } else {
      setSuggestions([]);
      setCategories([]);
    }
  }, [debounced]);

  if (!open) return null;
  const searching = debounced.length >= 2;

  const doSubmit = () => {
    const q = query.trim();
    if (!q) return;
    recordSearchTerm(q);
    trackEvent('search', { search_term: q });
    window.location.href = v2url(`/products/?q=${encodeURIComponent(q)}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className="fixed inset-0 z-[60] bg-off-white text-charcoal flex flex-col"
      style={{ animation: 'fadeIn 0.18s ease-out' }}
    >
      {/* 顶部搜索条：大输入框 + 关闭（触控目标 44px） */}
      <div className="border-b border-warm-gray bg-off-white px-4 lg:px-10 pt-3 pb-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-charcoal-light flex-shrink-0">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16" y2="16"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doSubmit()}
            placeholder="Search for products"
            aria-label="Search for products"
            className="flex-1 h-12 bg-transparent outline-none text-base placeholder:text-charcoal-light"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center text-2xl leading-none text-charcoal hover:bg-brand/10 hover:text-brand transition"
          >
            &times;
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="max-w-5xl mx-auto px-4 lg:px-10 py-6">
          {searching ? (
            <>
              {/* 品类直达行 */}
              {categories.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <a
                      key={c.href}
                      href={v2url(c.href)}
                      onClick={() => recordSearchTerm(debounced)}
                      className="px-4 py-2 rounded-full bg-brand/10 text-brand text-sm font-medium hover:bg-brand hover:text-cream transition"
                    >
                      See all in {c.label} →
                    </a>
                  ))}
                </div>
              )}
              {/* 产品联想列表 */}
              {suggestions.length > 0 ? (
                <div className="bg-white rounded-xl border border-warm-gray overflow-hidden">
                  {suggestions.map((p) => {
                    const img = cardImage(p);
                    return (
                      <a
                        key={p.id}
                        href={v2url(`/products/${p.handle}/`)}
                        onClick={() => {
                          recordSearchTerm(debounced);
                          trackEvent('search_suggest_click', { search_term: debounced });
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-off-white transition"
                      >
                        {img && (
                          <img
                            src={resolveUrl(img.url)}
                            alt={img.alt}
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-off-white border border-warm-gray"
                            loading="lazy"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-brand">{p.productType}</p>
                          <p className="text-sm text-charcoal line-clamp-1">{p.title}</p>
                        </div>
                        <span className="text-sm font-semibold text-[#8B5A2B] flex-shrink-0">{priceOf(p)}</span>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-charcoal-light py-8 text-center">
                  No matches for &ldquo;{debounced}&rdquo; — try one of the suggestions below.
                </p>
              )}
              {/* View all 完整结果 */}
              <div className="mt-4 text-center">
                <button
                  onClick={doSubmit}
                  className="h-11 px-6 rounded-lg text-sm font-semibold text-cream bg-brand hover:bg-brand-dark transition"
                >
                  View all results for &ldquo;{debounced}&rdquo;
                </button>
              </div>
            </>
          ) : (
            <>
              {/* 空态：热词胶囊（Parachute 式 Search Suggestions） */}
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Search Suggestions
                </h2>
                <div className="flex flex-wrap gap-2">
                  {HOT_SEARCHES.map((hot) => (
                    <a
                      key={hot.label}
                      href={v2url(hot.href)}
                      onClick={() => recordSearchTerm(hot.label)}
                      className="px-4 py-2 rounded-full bg-white border border-warm-gray text-sm text-charcoal-light hover:border-brand hover:text-brand transition"
                    >
                      {hot.label}
                    </a>
                  ))}
                </div>
              </section>

              {/* 空态：Recommended Products 网格（移动 2 列 / 桌面 4 列） */}
              {recommended.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Recommended Products
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
                    {recommended.map((p, i) => {
                      const img = cardImage(p);
                      return (
                        <a
                          key={p.id}
                          href={v2url(`/products/${p.handle}/`)}
                          onClick={() => trackEvent('recommended_click', { position: i + 1 })}
                          className="group block"
                        >
                          <div className="aspect-square rounded-lg overflow-hidden bg-warm-gray">
                            {img && (
                              <img
                                src={resolveUrl(img.url)}
                                alt={img.alt}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                              />
                            )}
                          </div>
                          <h3 className="mt-2.5 text-xs font-medium text-[#333] leading-snug line-clamp-2">{p.title}</h3>
                          <p className="mt-1 text-sm font-semibold text-[#8B5A2B]">{priceOf(p)}</p>
                        </a>
                      );
                    })}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
