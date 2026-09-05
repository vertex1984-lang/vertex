import type { Metadata } from 'next';
import V2Hero from '@/components/v2/V2Hero';
import V2CategoryGrid from '@/components/v2/V2CategoryGrid';
import V2BrandBanner from '@/components/v2/V2BrandBanner';
import V2NewArrivals from '@/components/v2/V2NewArrivals';
import V2TrustStats from '@/components/v2/V2TrustStats';
import V2FeaturedStrip from '@/components/v2/V2FeaturedStrip';
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

// New Arrivals：展示用的新到产品（暂选 B0F/B0G 批次新品 ASIN，与 Featured 不重复）
const NEW_ARRIVAL_ASINS = [
  'B0F1XFWZVY',
  'B0F1XS27XS',
  'B0F1XS7VKY',
  'B0F1Y4J48T',
  'B0F1Y91HPR',
  'B0F62XRB55',
  'B0FNQRRV78',
  'B0G6M3F7CY',
];

const newArrivalProducts = NEW_ARRIVAL_ASINS.map((asin) =>
  PRODUCTS_DATA.find((p) => p.asin.toUpperCase() === asin.toUpperCase())
).filter(Boolean) as MakimooProduct[];

export default function V2HomePage() {
  return (
    <>
      <V2Hero />
      <V2CategoryGrid />
      <V2FeaturedStrip products={stripProducts} />
      {/* banner 位于 Featured 与 New Arrivals 之间；下方保持与 New Arrivals 的间距 */}
      <div className="mb-10 lg:mb-16">
        <V2BrandBanner />
      </div>
      <V2NewArrivals products={enrichProductsWithShopifyData(newArrivalProducts)} />
      <V2TrustStats />
      <MaterialGuide />
      <PressBar />
      <V2Newsletter />
    </>
  );
}
