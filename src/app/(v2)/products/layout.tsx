import type { Metadata } from 'next';

// products/page.tsx 是 client component，metadata 由本 route layout 提供（与 (classic)、v2/cart 一致）
export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse the complete Makimoo collection of cushions, pillows, towels, mats and home comfort essentials.',
};

export default function V2ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
