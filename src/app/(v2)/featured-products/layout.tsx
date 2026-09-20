import type { Metadata } from 'next';

// metadata 放在 route layout 提供（与 (v2)/products 同模式；子路由 scene/color/style 页共用）
export const metadata: Metadata = {
  title: 'Complete the Look',
  description:
    'Shop Makimoo by color and scene — solid-color essentials grouped into Living Room, Bedroom, Kitchen, Bathroom and more.',
};

export default function FeaturedProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
