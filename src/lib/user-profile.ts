/**
 * 站内行为画像（2026-10 P2）：纯 localStorage、无 PII、无同意门控。
 * （CookieConsent 组件已于 2026-09-28 移除、GA4 无条件加载——功能型存储与现状同口径。）
 *
 * 信号源全部复用现有存储，不重复采集：
 * - 浏览  makimoo-recently-viewed（handles，新→旧，位置即衰减）
 * - 收藏  makimoo-favorites（product id，固定 0.8 权重）
 * - 搜索  makimoo-search-history（本 lib 维护，cap 20 条，按天衰减 30 天到 0.3）
 *
 * 输出 affinity map：标签(小写) → 兴趣分。标签口径与搜索引擎 productTagsOf 一致；
 * 类目 3 / 子类 2 / 材质 2 / 颜色 2 / 场景 1（与首页 V2Recommended 同权重思路）。
 * 消费方：V2SearchOverlay 推荐网格个性化加成（空画像 = 纯评分排序，零风险退化）。
 */
import { PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';
import { matchCategories, productTagsOf } from '@/lib/search-engine';
import type { MakimooProduct } from '@/data/products';
import { getRecentlyViewed } from '@/lib/recently-viewed';
import { getFavorites } from '@/lib/favorites';

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
 * 兴趣画像：标签 → 分值。每次调用现算（数据量小：≤10 浏览 + 收藏 + 20 搜索词，毫秒级）。
 * 浏览按位置衰减 1.0→0.1（recently-viewed 新→旧）；收藏固定 0.8；
 * 搜索词经 matchCategories 归到类目，按天衰减（30 天 → 0.3）。
 */
export function getAffinity(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  const aff: Record<string, number> = {};

  // 目录 lookup（enrich 提供 subcategory；两次 Map 构建 + 一次全目录 enrich，毫秒级）
  const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA);
  const byHandle = new Map(enriched.map((p) => [p.handle, p]));
  const byId = new Map(enriched.map((p) => [p.id, p]));

  getRecentlyViewed().forEach((handle, i) => {
    const p = byHandle.get(handle);
    if (p) addProductTags(aff, p, Math.max(0.1, 1 - i * 0.1));
  });
  getFavorites().forEach((id) => {
    const p = byId.get(id);
    if (p) addProductTags(aff, p, 0.8);
  });

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
  }
  return aff;
}
