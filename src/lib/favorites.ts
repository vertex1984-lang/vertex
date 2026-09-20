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
