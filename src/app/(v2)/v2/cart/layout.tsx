import type { Metadata } from 'next';

// cart/page.tsx 是 client component，metadata 由本 route layout 提供（与 (classic) 一致）
export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review the items in your Makimoo shopping cart and proceed to checkout.',
  robots: { index: false, follow: false },
};

export default function V2CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
