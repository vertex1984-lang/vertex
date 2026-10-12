/**
 * 站内行为画像（2026-10 P2 建，P2.1 扩展）：纯 localStorage、无 PII、无同意门控。
 * （CookieConsent 组件已于 2026-09-28 移除、GA4 无条件加载——功能型存储与现状同口径。）
 *
 * 信号源与权重（对 affinity 的贡献倍率）：
 * - 浏览   makimoo-recently-viewed（handles，新→旧）  位置衰减 1.0 → 0.1
 * - 收藏   makimoo-favorites（product id）            固定 0.8
 * - 购物车 makimoo-cart（LocalCartItem.handle）       1.0（最强意图）
 * - 搜索词 makimoo-search-history（本 lib 维护）      类目 2 + top5 命中产品标签 0.5，
 *                                                     按天衰减 30 天 → 0.3
 *
 * 标签贡献：类目 3 / 子类 2 / 材质 2 / 颜色 2 / 场景 1（与首页 V2Recommended 同权重思路），
 * 口径统一走搜索引擎 productTagsOf。
 * 消费方：V2SearchOverlay——getAffinity（画像分）、getPersonalizedPool（个性推荐批次池）。
 */
import { PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';
import type { MakimooProduct } from '@/data/products';
import { matchCategories, productTagsOf, searchAll, familyKeyOf } from '@/lib/search-engine';
import { getRecentlyViewed } from '@/lib/recently-viewed';
import { getFavorites } from '@/lib/favorites';
import { getLocalCart } from '@/lib/cart';

const SEARCH_HISTORY_KEY = 'makimoo-search-history';
const MAX_SEARCH_HISTORY = 20;

interface HistoryEntry {
  t: string;
  ts: number;
}

function readHistory(): HistoryEntry[] {
  try {
    const raw = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]');
    return Array.isArray(raw) ? raw.filter((x) => x && typeof x.t === 'string') : [];
  } catch {
    return [];
  }
}

/** 记录一次搜索词（去重置顶、cap 20；<2 字符的垃圾输入不记） */
export function recordSearchTerm(term: string): void {
  if (typeof window === 'undefined') return;
  const q = term.trim();
  if (q.length < 2) return;
  const list = readHistory().filter((x) => x.t.toLowerCase() !== q.toLowerCase());
  list.unshift({ t: q, ts: Date.now() });
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(list.slice(0, MAX_SEARCH_HISTORY)));
  } catch {
    /* 存储满/隐私模式：画像属于增强功能，静默失败 */
  }
}

export function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return [];
  return readHistory().map((x) => x.t);
}

/** 清空全部搜索历史（搜索层垃圾桶图标） */
export function clearSearchHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch {
    /* 静默失败 */
  }
}

// 目录 enrich 缓存（全库仅一次；画像、推荐池、搜索浮层系统推荐共用）
let cachedEnriched: MakimooProduct[] | null = null;
export function enrichedCatalog(): MakimooProduct[] {
  if (!cachedEnriched) cachedEnriched = enrichProductsWithShopifyData(PRODUCTS_DATA);
  return cachedEnriched;
}

/** 单产品的标签贡献：类目 3 / 子类 2 / 材质 2 / 颜色 2 / 场景 1，乘以信号权重 */
function addProductTags(aff: Record<string, number>, p: MakimooProduct, weight: number): void {
  const bump = (tag: string, w: number) => {
    if (tag) aff[tag] = (aff[tag] || 0) + w;
  };
  const t = productTagsOf(p);
  bump(t.category, 3 * weight);
  bump(t.subcategory, 2 * weight);
  t.materials.forEach((m) => bump(m, 2 * weight));
  t.colors.forEach((c) => bump(c, 2 * weight));
  t.scene.forEach((s) => bump(s, 1 * weight));
}

/**
 * 兴趣画像：标签 → 分值。每次调用现算（数据量小：≤10 浏览 + 收藏 + 购物车 + 20 搜索词）。
 * 搜索词双通道：matchCategories 归到类目（粗），searchAll top5 命中产品的标签（细）。
 */
export function getAffinity(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  const aff: Record<string, number> = {};
  const catalog = enrichedCatalog();
  const byHandle = new Map(catalog.map((p) => [p.handle, p]));
  const byId = new Map(catalog.map((p) => [p.id, p]));

  // 浏览：位置衰减 1.0 → 0.1
  getRecentlyViewed().forEach((handle, i) => {
    const p = byHandle.get(handle);
    if (p) addProductTags(aff, p, Math.max(0.1, 1 - i * 0.1));
  });
  // 收藏：固定 0.8
  getFavorites().forEach((id) => {
    const p = byId.get(id);
    if (p) addProductTags(aff, p, 0.8);
  });
  // 购物车：最强意图，1.0
  getLocalCart().forEach((item) => {
    const p = byHandle.get(item.handle);
    if (p) addProductTags(aff, p, 1);
  });

  // 搜索词：类目（粗，2）+ 产品级标签（细，0.5），按天衰减
  const now = Date.now();
  for (const entry of readHistory()) {
    const ageDays = (now - entry.ts) / 86400000;
    const decay = Math.max(0.3, 1 - ageDays / 30);
    for (const hit of matchCategories(entry.t, 2)) {
      const m = hit.href.match(/[?&]cat=([^&]+)/);
      if (m) {
        const cat = decodeURIComponent(m[1]).toLowerCase();
        aff[cat] = (aff[cat] || 0) + 2 * decay;
      }
    }
    for (const p of searchAll(entry.t, 5)) {
      addProductTags(aff, p, 0.5 * decay);
    }
  }
  return aff;
}

/**
 * 个性推荐池（Picked for You 数据源）：全目录按画像分排序，排除最近浏览过的产品本身
 * （回味职责在系统推荐的 recentInsert 穿插位），同变体族去重。
 * 画像分主导排序，评分×ln(1+评论数) 作同分 tie-break；affinity=0 的产品不入池
 * （无画像 → 空池 → 搜索层该区块整体隐藏）。
 */
export function getPersonalizedPool(): MakimooProduct[] {
  if (typeof window === 'undefined') return [];
  const aff = getAffinity();
  const viewed = new Set(getRecentlyViewed());
  const seenFamily = new Set<string>();
  const out: MakimooProduct[] = [];
  const scored = enrichedCatalog()
    .filter((p) => !viewed.has(p.handle))
    .map((p) => {
      const t = productTagsOf(p);
      const a = [t.category, t.subcategory, ...t.materials, ...t.colors, ...t.scene].reduce(
        (s, tag) => s + (aff[tag] || 0),
        0
      );
      const rating = p.rating ?? 0;
      const reviews = p.reviewCount ?? 0;
      return { p, a, q: rating * Math.log(1 + reviews) };
    })
    .filter((x) => x.a > 0)
    .sort((x, y) => (y.a !== x.a ? y.a - x.a : y.q - x.q));
  for (const x of scored) {
    const k = familyKeyOf(x.p);
    if (seenFamily.has(k)) continue;
    seenFamily.add(k);
    out.push(x.p);
  }
  return out;
}
