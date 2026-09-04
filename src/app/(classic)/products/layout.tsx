import type { Metadata } from 'next';

// products/page.tsx 是 client component，metadata 由本 route layout 提供
export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse the complete Makimoo collection of cushions, pillows, travel essentials and home fragrance.',
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
