import type { Metadata } from 'next';

// client 页面的 metadata 由同目录 route layout 提供（与 (v2)/products 同模式）
export const metadata: Metadata = {
  title: 'Complete the Look | Makimoo',
  description:
    'Shop Makimoo by color and scene — solid-color essentials grouped into Living Room, Bedroom, Kitchen, Bathroom and more.',
};

export default function FeaturedProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
