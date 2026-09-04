import type { Metadata } from 'next';
import V2Hero from '@/components/v2/V2Hero';
import V2CategoryGrid from '@/components/v2/V2CategoryGrid';
import V2BestSellers from '@/components/v2/V2BestSellers';
import StorySplit from '@/components/v2/StorySplit';
import MaterialGuide from '@/components/v2/MaterialGuide';
import PressBar from '@/components/v2/PressBar';
import V2Newsletter from '@/components/v2/V2Newsletter';
import { PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';

export const metadata: Metadata = {
  title: 'Makimoo — Comfort, Woven Into Every Day',
  description:
    'Cushions, pillows, towels and soft home essentials crafted from honest materials. Free shipping over $49 and 30-day easy returns.',
};

// Best Sellers：有 Shopify 数据且在售的产品，按标题去重（同款不同色只出现一次），取前 10 个
// 逻辑与 (classic) 首页一致
const seenTitles = new Set<string>();
const bestSellers = enrichProductsWithShopifyData(PRODUCTS_DATA)
  .filter((p) => p.hasShopifyData && p.shopifyAvailable)
  .filter((p) => {
    const key = p.title.toLowerCase().replace(/\(.*?\)/g, '').slice(0, 30).trim();
    if (seenTitles.has(key)) return false;
    seenTitles.add(key);
    return true;
  })
  .slice(0, 10);

export default function V2HomePage() {
  return (
    <>
      <V2Hero />
      <V2CategoryGrid />
      <V2BestSellers products={bestSellers} />
      <StorySplit
        eyebrow="Crafted With Care"
        title="Materials That Earn Their Keep"
        body="We obsess over the details you can feel — brushed surfaces, even stitching, fills that stay plump. Every fabric is chosen for how it lives with you, not just how it looks on day one."
        ctaLabel="Read Our Story"
        ctaHref="/about"
        image="/images/brand/makimoo-design.webp"
        imageAlt="Makimoo design and craftsmanship details"
        tone="cream"
      />
      <StorySplit
        eyebrow="Made Responsibly"
        title="Comfort That Cares Back"
        body="From durable, long-lasting materials to packaging we keep to a minimum, we design for years of daily use — because the most sustainable product is the one you never need to replace."
        ctaLabel="Our Sustainability Promise"
        ctaHref="/about#sustainability"
        image="/images/about/about-sustainability.webp"
        imageAlt="Sustainable materials and responsible production at Makimoo"
        reverse
        tone="off-white"
      />
      <MaterialGuide />
      <PressBar />
      <V2Newsletter />
    </>
  );
}
