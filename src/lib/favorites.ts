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
