'use client';

/**
 * 全屏搜索层（2026-10 P2 建，P2.1 三区块重构，Parachute/淘宝混合式，移动优先）
 *
 * 空态四区块（自上而下）：
 * ① Search History 历史搜索——文字胶囊点击即搜、🗑 清空全部、▽ 折叠（持久化）；无历史隐藏
 * ② Search Suggestions 热词行——仅无搜索历史时显示（有历史后由历史区取代，清空后回归）
 * ③ Picked for You 个性推荐——画像气泡（左端 36px 小主图 + 短标题）、🔄 换一批（批次循环）、
 *    ▽ 收起（持久化）；数据源 getPersonalizedPool（纯画像驱动、排除最近浏览、同族去重），
 *    无画像（首访）整块隐藏；点击气泡进 PDP
 * ④ Recommended Products 系统推荐——大图网格，纯系统排序（评分×ln(1+评论数)+在售优先+
 *    家族去重+类目多样性，去个性化）+ 穿插 RECOMMENDED.recentInsert 个最近浏览产品
 *    （约第 3/7 位让客户再看看）；网格底部 Hide pill 收起、标题行眼睛图标展开（持久化）；
 *    manualHandles 人工置顶单生效于此（运营口，绕过类目多样性）
 *
 * 输入态：统一引擎联想（searchAll 家族去重 top6）+ 品类直达行（matchCategories）+
 * Enter/View all → /products/?q=。提交与点击联想记录搜索词（user-profile）。
 * 埋点：search_open / search_suggest_click / search_history_click / personalized_click /
 * personalized_refresh / recommended_click。
 */
import { useState, useEffect, useRef } from 'react';
import { resolveUrl, shopifyImageUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { trackEvent } from '@/lib/gtag';
import type { MakimooProduct } from '@/data/products';
import { searchAll, matchCategories, familyKeyOf, type CategoryHit } from '@/lib/search-engine';
import { HOT_SEARCHES, HISTORY_SHOW_MAX, PERSONALIZED, RECOMMENDED, RANK_BADGES } from '@/data/search-config';
import {
  getSearchHistory,
  clearSearchHistory,
  recordSearchTerm,
  getPersonalizedPool,
  enrichedCatalog,
} from '@/lib/user-profile';
import { getRecentlyViewed } from '@/lib/recently-viewed';

interface V2SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

// 折叠/隐藏偏好（持久化；'1' = 开启，删除键 = 关闭）
const FLAG_HISTORY_COLLAPSED = 'makimoo-search-history-collapsed';
const FLAG_PERSONALIZED_COLLAPSED = 'makimoo-personalized-collapsed';
const FLAG_SYSTEM_HIDDEN = 'makimoo-system-recommended-hidden';

function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function writeFlag(key: string, on: boolean): void {
  try {
    if (on) localStorage.setItem(key, '1');
    else localStorage.removeItem(key);
  } catch {
    /* 静默失败 */
  }
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

/**
 * 系统推荐选品（全站统一，非个性化）：评分×ln(1+评论数) 基础分 + 在售优先 + 家族去重 +
 * 类目多样性 ≤ maxPerCategory + manualHandles 人工置顶；最后把最近浏览的
 * recentInsert 个产品穿插到第 3/7 位（让客户再看看，2026-10 用户定）。
 * 排名角标（RANK_BADGES）：按评分分取真实前 N 名，与展示位解耦——角标代表
 * "本推荐榜评分第 N"（榜单内口径），出现在网格任何位置都为真；回味位/置顶不虚假加冕；
 * 2026-10-12 合并修复：只发给有真实评分的产品（rating>0 且 reviewCount>0），
 * 堵住无评分基线分 0.4 被加冕的漏洞，凑不齐 N 个就少发。
 */
interface SystemPick {
  p: MakimooProduct;
  /** 排名角标序号（1 = 本推荐榜评分第一）；回味位无 */
  rank?: number;
  /** 回味位标记（穿插的最近浏览产品）：不参与榜单排名、永不发标 */
  recent?: boolean;
}

function computeSystemPicks(): SystemPick[] {
  // 2026-10-12 合并修复：复用 user-profile 的 enrich 缓存（原每次开层独立 enrich 全目录）
  const all = enrichedCatalog();
  const scored = all
    .map((p) => {
      const rating = p.rating ?? 0;
      const reviews = p.reviewCount ?? 0;
      // 基础分；无评分产品给基线兜底（新目录不至于完全排不上）
      const score = rating > 0 && reviews > 0 ? rating * Math.log(1 + reviews) : 0.4;
      return { p, score, cat: (p.productType || '').toLowerCase(), inStock: p.shopifyAvailable ?? p.availableForSale };
    })
    .sort((x, y) => (x.inStock === y.inStock ? y.score - x.score : x.inStock ? -1 : 1));
  // source === 'sales'（销量优先）分支位：Shopify 订单数据回流后在此切换排序依据
  const scoreOf = new Map<string, number>();
  for (const s of scored) scoreOf.set(s.p.handle, s.score);

  const out: SystemPick[] = [];
  const seenFamily = new Set<string>();
  const catCount: Record<string, number> = {};
  const seen = (p: MakimooProduct) => seenFamily.has(familyKeyOf(p));
  const mark = (p: MakimooProduct) => seenFamily.add(familyKeyOf(p));
  const pushAuto = (p: MakimooProduct) => {
    if (out.length >= RECOMMENDED.count || seen(p)) return;
    const c = (p.productType || '').toLowerCase();
    if ((catCount[c] || 0) >= RECOMMENDED.maxPerCategory) return;
    catCount[c] = (catCount[c] || 0) + 1;
    mark(p);
    out.push({ p });
  };
  // 人工置顶单：绕过类目多样性（运营意图优先），仍做家族去重与数量上限；
  // 角标只认榜单内评分排名，置顶本身不加冕
  for (const handle of RECOMMENDED.manualHandles) {
    const p = all.find((x) => x.handle === handle);
    if (p && out.length < RECOMMENDED.count && !seen(p)) {
      mark(p);
      out.push({ p });
    }
  }
  for (const s of scored) pushAuto(s.p);

  // 穿插最近浏览（第 3、7 位）：回味位不计类目多样性、不受家族排重限制——
  // 客户要看的就是他看过的那一件（同族兄弟已在网格也要原样再现），总数不变；
  // 仅按精确 handle 去重防重复展示；回味位带 recent 标记，永不发排名角标
  if (RECOMMENDED.recentInsert > 0) {
    const recent = getRecentlyViewed()
      .slice(0, RECOMMENDED.recentInsert)
      .map((h) => all.find((p) => p.handle === h))
      .filter((p): p is MakimooProduct => !!p && !out.some((x) => x.p.handle === p.handle));
    const positions = [2, 6];
    recent.forEach((p, i) => {
      const pos = Math.min(positions[i] ?? out.length, out.length);
      mark(p);
      out.splice(pos, 0, { p, recent: true });
      if (out.length > RECOMMENDED.count) out.pop();
    });
  }

  // 排名角标：最终网格内（排除回味位）按评分分取前 N——榜单内名次口径
  //（淘宝热榜式；全站名次会被同家族垄断导致凑不齐，2026-10 实测后改定）。
  // 声明仍真实：榜单内评分排序可支撑
  if (RANK_BADGES.enabled) {
    const eligible = out.filter((x) => !x.recent && (x.p.rating ?? 0) > 0 && (x.p.reviewCount ?? 0) > 0);
    eligible
      .sort((a, b) => (scoreOf.get(b.p.handle) || 0) - (scoreOf.get(a.p.handle) || 0))
      .slice(0, RANK_BADGES.topN)
      .forEach((x, i) => {
        x.rank = i + 1;
      });
  }
  return out;
}

export default function V2SearchOverlay({ open, onClose }: V2SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [suggestions, setSuggestions] = useState<MakimooProduct[]>([]);
  const [categories, setCategories] = useState<CategoryHit[]>([]);
  // ① 历史搜索
  const [history, setHistory] = useState<string[]>([]);
  const [historyCollapsed, setHistoryCollapsed] = useState(false);
  // ③ 个性推荐
  const [persPool, setPersPool] = useState<MakimooProduct[]>([]);
  const [persStart, setPersStart] = useState(0);
  const [personalizedCollapsed, setPersonalizedCollapsed] = useState(false);
  // ④ 系统推荐
  const [recommended, setRecommended] = useState<SystemPick[]>([]);
  const [systemHidden, setSystemHidden] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 开层：读画像/历史/持久化偏好、锁滚动、自动聚焦、埋点；关层复位
  useEffect(() => {
    if (!open) {
      setQuery('');
      setDebounced('');
      setSuggestions([]);
      setCategories([]);
      return;
    }
    trackEvent('search_open');
    setHistory(getSearchHistory());
    setHistoryCollapsed(readFlag(FLAG_HISTORY_COLLAPSED));
    setPersonalizedCollapsed(readFlag(FLAG_PERSONALIZED_COLLAPSED));
    setSystemHidden(readFlag(FLAG_SYSTEM_HIDDEN));
    setPersPool(getPersonalizedPool());
    setPersStart(0);
    setRecommended(computeSystemPicks());
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

  const jumpSearch = (term: string) => {
    window.location.href = v2url(`/products/?q=${encodeURIComponent(term)}`);
  };

  const doSubmit = () => {
    const q = query.trim();
    if (!q) return;
    recordSearchTerm(q);
    trackEvent('search', { search_term: q });
    jumpSearch(q);
  };

  // ③ 换一批：批次步进循环整个画像池
  const persBatch = persPool.slice(persStart, persStart + PERSONALIZED.batchSize);
  const refreshPersonalized = () => {
    trackEvent('personalized_refresh');
    setPersStart((s) => {
      const next = s + PERSONALIZED.batchSize;
      return next >= persPool.length ? 0 : next;
    });
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
              {/* ── ① 历史搜索：文字胶囊 / 🗑 清空 / ▽ 折叠 ── */}
              {history.length > 0 && (
                <section className="mb-7">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Search History
                    </h2>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          clearSearchHistory();
                          setHistory([]);
                          trackEvent('search_history_clear');
                        }}
                        aria-label="Clear search history"
                        className="w-9 h-9 rounded-full flex items-center justify-center text-charcoal-light hover:bg-brand/10 hover:text-brand transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          const next = !historyCollapsed;
                          setHistoryCollapsed(next);
                          writeFlag(FLAG_HISTORY_COLLAPSED, next);
                        }}
                        aria-label={historyCollapsed ? 'Expand search history' : 'Collapse search history'}
                        aria-expanded={!historyCollapsed}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-charcoal-light hover:bg-brand/10 hover:text-brand transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                          className={`transition-transform duration-200 ${historyCollapsed ? '' : 'rotate-180'}`}>
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  {!historyCollapsed && (
                    <div className="flex flex-wrap gap-2">
                      {history.slice(0, HISTORY_SHOW_MAX).map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            trackEvent('search_history_click', { search_term: term });
                            jumpSearch(term);
                          }}
                          className="px-4 py-2 rounded-full bg-white border border-warm-gray text-sm text-charcoal-light hover:border-brand hover:text-brand transition"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* ── ② 热词行：仅无搜索历史时显示（2026-10 P2.2 用户定——有历史后由
                  Search History 取代，避免整体过长；清空历史后回归兜底导购） ── */}
              {history.length === 0 && (
                <section className="mb-7">
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
              )}

              {/* ── ③ Picked for You 个性推荐：画像气泡（左端小主图）/ 🔄 换一批 / ▽ 折叠 ── */}
              {persPool.length > 0 && (
                <section className="mb-7">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Picked for You
                    </h2>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={refreshPersonalized}
                        aria-label="Show next picks"
                        className="w-9 h-9 rounded-full flex items-center justify-center text-charcoal-light hover:bg-brand/10 hover:text-brand transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          const next = !personalizedCollapsed;
                          setPersonalizedCollapsed(next);
                          writeFlag(FLAG_PERSONALIZED_COLLAPSED, next);
                        }}
                        aria-label={personalizedCollapsed ? 'Expand personalized picks' : 'Collapse personalized picks'}
                        aria-expanded={!personalizedCollapsed}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-charcoal-light hover:bg-brand/10 hover:text-brand transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                          className={`transition-transform duration-200 ${personalizedCollapsed ? '' : 'rotate-180'}`}>
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  {!personalizedCollapsed && (
                    /* 移动端两列网格（一行两个、8 个=4 行，2026-10 用户定）；
                       桌面端保持流式气泡（内容自适应宽度） */
                    <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:gap-2.5">
                      {persBatch.map((p, i) => {
                        const img = cardImage(p);
                        return (
                          <a
                            key={p.id}
                            href={v2url(`/products/${p.handle}/`)}
                            onClick={() => trackEvent('personalized_click', { position: persStart + i + 1 })}
                            className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 lg:gap-2.5 lg:pr-4 rounded-full bg-white border border-warm-gray hover:border-brand transition min-w-0"
                          >
                            {img ? (
                              <img
                                src={resolveUrl(img.url)}
                                alt={img.alt}
                                loading="lazy"
                                className="w-9 h-9 rounded-full object-cover flex-shrink-0 bg-warm-gray"
                              />
                            ) : (
                              <span className="w-9 h-9 rounded-full flex-shrink-0 bg-warm-gray" />
                            )}
                            <span className="text-xs text-charcoal truncate min-w-0 lg:max-w-[200px]">{p.title}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {/* ── ④ Recommended Products 系统推荐：大图网格 / 底部 Hide 收起 / 标题行眼睛展开 ── */}
              {recommended.length > 0 && (
                <section className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Recommended Products
                    </h2>
                    {systemHidden && (
                      <button
                        onClick={() => {
                          setSystemHidden(false);
                          writeFlag(FLAG_SYSTEM_HIDDEN, false);
                        }}
                        aria-label="Show recommendations"
                        className="w-9 h-9 rounded-full flex items-center justify-center text-charcoal-light hover:bg-brand/10 hover:text-brand transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                    )}
                  </div>
                  {!systemHidden && (
                    <>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
                        {recommended.map((item, i) => {
                          const p = item.p;
                          const img = cardImage(p);
                          return (
                            <a
                              key={p.id}
                              href={v2url(`/products/${p.handle}/`)}
                              onClick={() => trackEvent('recommended_click', { position: i + 1 })}
                              className="group block"
                            >
                              <div className="relative aspect-square rounded-lg overflow-hidden bg-warm-gray">
                                {/* 排名角标：真实评分前 N 名（分数排名，与展示位无关；回味位无标） */}
                                {item.rank != null && (
                                  <span className="absolute top-2 left-2 z-10 rounded-md bg-[#C8860D] px-2 py-1 text-[10px] font-bold leading-none text-white shadow-sm tracking-wide">
                                    #{item.rank} Rated
                                  </span>
                                )}
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
                      <div className="mt-5">
                        <button
                          onClick={() => {
                            setSystemHidden(true);
                            writeFlag(FLAG_SYSTEM_HIDDEN, true);
                          }}
                          className="inline-flex items-center gap-2 h-10 px-5 rounded-full border border-warm-gray bg-white text-xs text-charcoal-light hover:border-brand hover:text-brand transition"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                          </svg>
                          Hide Recommendations
                        </button>
                      </div>
                    </>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
