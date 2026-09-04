import { Metadata } from 'next';
import V2PageHeader from '@/components/v2/V2PageHeader';
import { v2url } from '@/lib/v2paths';

export const metadata: Metadata = {
  title: 'Best Sellers | Makimoo',
  description: 'Shop Makimoo best sellers — the comfort essentials our customers love most.',
};

/**
 * V2 Best Sellers 页面（占位）
 * 产品列表后续添加；目前从 V2TrustStats 的 "Explore Our Best Sellers" 链接进入。
 */
export default function V2BestSellersPage() {
  return (
    <>
      <V2PageHeader
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Best Sellers' }]}
        title="Best Sellers"
        subtitle="The comfort essentials our customers love most."
      />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 text-center">
        <p className="text-charcoal-light text-base mb-6">
          Our best sellers are being hand-picked — check back soon.
        </p>
        <a
          href={v2url('/products/')}
          className="inline-block px-9 py-3.5 rounded-full border-2 border-brand text-brand text-sm font-semibold tracking-wide transition hover:bg-brand hover:text-cream"
        >
          Shop All Products
        </a>
      </div>
    </>
  );
}
