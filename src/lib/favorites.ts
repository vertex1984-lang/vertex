const FAVORITES_KEY = 'makimoo-favorites';

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(FAVORITES_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

// 切换收藏态，返回切换后是否为收藏；并广播事件给 Header 角标等监听方
export function toggleFavorite(id: string): boolean {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(id);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  window.dispatchEvent(new CustomEvent('makimoo:favorites-updated'));
  return index < 0;
}

// 剪掉目录里已不存在的收藏 id（ghost），保持原顺序；有变更时写回并广播事件，
// 让 Header 角标与收藏页网格数量一致（角标按 localStorage id 计数）
export function pruneFavorites(keep: (id: string) => boolean): string[] {
  const favorites = getFavorites();
  const pruned = favorites.filter(keep);
  if (pruned.length !== favorites.length) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(pruned));
    window.dispatchEvent(new CustomEvent('makimoo:favorites-updated'));
  }
  return pruned;
}

/* ============================================================================
 * 心愿单云同步（2026-11-12 批次 2）：localStorage 为主，登录后与 makimoo-admin
 * /api/wishlist（按 customerId 存 db.json）做「拉取合并 → 覆盖回写」。
 * 收藏值 = 本地 favorites 存的 product.id（即 favorites 页网格渲染口径）。
 * 演示版直连 admin :4200（本地演示特权）；正式版换后台只读服务域名（env 可配）。
 * ========================================================================== */

const WISHLIST_API = process.env.NEXT_PUBLIC_WISHLIST_API || 'http://localhost:4200/api/wishlist';
/** 与 makimoo-admin WISHLIST_TOKEN 同值（演示版写死；正式版换环境变量并评审鉴权方案） */
const WISHLIST_TOKEN = process.env.NEXT_PUBLIC_WISHLIST_TOKEN || 'makimoo-wishlist-demo-token';
const WISHLIST_HEADERS = { 'x-wishlist-token': WISHLIST_TOKEN } as const;

/** 拉取云端收藏（customerId = Shopify customer id）。失败静默返回 null（不阻断页面） */
export async function pullFavoritesFromCloud(customerId: string): Promise<string[] | null> {
  try {
    const r = await fetch(`${WISHLIST_API}?customerId=${encodeURIComponent(customerId)}`, { cache: 'no-store', headers: WISHLIST_HEADERS });
    if (!r.ok) return null;
    const j = (await r.json()) as { handles?: string[] };
    return Array.isArray(j.handles) ? j.handles : [];
  } catch {
    return null;
  }
}

/** 覆盖写云端收藏（调用方已做好合并；失败静默，下次进心愿单页会再同步） */
export async function pushFavoritesToCloud(customerId: string, ids: string[]): Promise<boolean> {
  try {
    const r = await fetch(WISHLIST_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...WISHLIST_HEADERS },
      body: JSON.stringify({ customerId, handles: ids }),
    });
    return r.ok;
  } catch {
    return false;
  }
}

/**
 * 登录态云同步（拉取合并 → 本地 → 覆盖云端）：并集去重、本地顺序在前（最近收藏优先）。
 * 返回合并后的本地列表（已写 localStorage 并广播）。
 */
export async function syncFavoritesWithCloud(customerId: string): Promise<string[]> {
  const local = getFavorites();
  const cloud = await pullFavoritesFromCloud(customerId);
  if (cloud === null) return local; // 云不可达：保持本地不动
  const merged = [...local, ...cloud.filter((id) => !local.includes(id))];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(merged));
  window.dispatchEvent(new CustomEvent('makimoo:favorites-updated'));
  if (JSON.stringify(merged) !== JSON.stringify(cloud)) {
    await pushFavoritesToCloud(customerId, merged);
  }
  return merged;
}
