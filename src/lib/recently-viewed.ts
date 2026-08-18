const RECENTLY_VIEWED_KEY = 'makimoo-recently-viewed';
const MAX_ITEMS = 10;

export function getRecentlyViewed(): string[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
  return saved ? JSON.parse(saved) : [];
}

// 记录一次浏览：最新在前、去重、最多保留 MAX_ITEMS 个
export function addRecentlyViewed(handle: string) {
  if (typeof window === 'undefined') return;
  const list = getRecentlyViewed().filter((h) => h !== handle);
  list.unshift(handle);
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list.slice(0, MAX_ITEMS)));
}
