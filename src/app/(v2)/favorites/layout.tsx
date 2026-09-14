import type { Metadata } from 'next';

// favorites/page.tsx 是 client component，metadata 由本 route layout 提供（与 cart/ 一致）
export const metadata: Metadata = {
  title: 'My Wishlist',
  description: 'Your saved Makimoo favorites — the comfort pieces you love, all in one place.',
  robots: { index: false, follow: false },
};

export default function V2FavoritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
