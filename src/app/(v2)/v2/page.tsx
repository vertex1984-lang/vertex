import type { Metadata } from 'next';
import V2Hero from '@/components/v2/V2Hero';
import V2CategoryGrid from '@/components/v2/V2CategoryGrid';
import V2BrandBanner from '@/components/v2/V2BrandBanner';
import V2FeaturedStrip from '@/components/v2/V2FeaturedStrip';
import StorySplit from '@/components/v2/StorySplit';
import MaterialGuide from '@/components/v2/MaterialGuide';
import PressBar from '@/components/v2/PressBar';
import V2Newsletter from '@/components/v2/V2Newsletter';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';

export const metadata: Metadata = {
  title: 'Makimoo — Comfort, Woven Into Every Day',
  description:
    'Cushions, pillows, towels and soft home essentials crafted from honest materials. Free shipping over $49 and 30-day easy returns.',
};

// Featured：与 (classic) 首页一致的 11 个精选 ASIN，配场景图 /images/featured/{asin}.webp
const FEATURED_ASINS = [
  'B0BCJQYYL1',
  'B098F1BKJQ',
  'B0BZCLN57S',
  'B0CBT7R7NN',
  'B0CC5RGRPS',
  'B0CW19GMPQ',
  'B0F1XMTYNC',
  'B0G6MPTVFD',
  'B0C4B9T6JV',
  'B0CQC5QJFJ',
  'B0CJ8TJL56',
];

const featuredProducts = FEATURED_ASINS.map((asin) => {
  const product = PRODUCTS_DATA.find((p) => p.asin.toUpperCase() === asin.toUpperCase());
  if (!product) return null;
  const featuredImage = `/images/featured/${asin.toLowerCase()}.webp`;
  return { ...product, featuredImage } as MakimooProduct;
}).filter(Boolean) as MakimooProduct[];

// Featured 横向条共展示 15 个：FEATURED_ASINS 优先，不足部分用 Best Sellers 筛选逻辑
//（有 Shopify 数据且在售、按标题去重）补足，且不与 Featured 重复
const titleKey = (title: string) =>
  title.toLowerCase().replace(/\(.*?\)/g, '').slice(0, 30).trim();

const featuredIds = new Set(featuredProducts.map((p) => p.id));
const seenTitles = new Set(featuredProducts.map((p) => titleKey(p.title)));
const featuredFillers = enrichProductsWithShopifyData(PRODUCTS_DATA)
  .filter((p) => p.hasShopifyData && p.shopifyAvailable)
  .filter((p) => !featuredIds.has(p.id))
  .filter((p) => {
    const key = titleKey(p.title);
    if (seenTitles.has(key)) return false;
    seenTitles.add(key);
    return true;
  })
  .slice(0, Math.max(0, 15 - featuredProducts.length));

const stripProducts = [...enrichProductsWithShopifyData(featuredProducts), ...featuredFillers].slice(0, 15);

export default function V2HomePage() {
  return (
    <>
      <V2Hero />
      <V2CategoryGrid />
      <V2BrandBanner />
      <V2FeaturedStrip products={stripProducts} />
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
