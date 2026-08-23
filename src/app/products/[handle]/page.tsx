import type { Metadata } from "next";
import ProductDetailClient from './ProductDetailClient';
import ProductCard from '@/components/ProductCard';
import RecentlyViewed from '@/components/RecentlyViewed';
import Reveal from '@/components/Reveal';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { STORE_CURRENCY } from '@/lib/currency';

const SITE_URL = 'https://www.makimoohome.com';

export function generateStaticParams() {
  return PRODUCTS_DATA.map((p) => ({ handle: p.handle }));
}

function getWords(text: string, count: number): string {
  const words = text.trim().split(/\s+/);
  return words.slice(0, count).join(' ');
}

function getProductImageUrl(product: MakimooProduct): string {
  const first = product.shopifyImages && product.shopifyImages.length > 0 ? product.shopifyImages[0] : product.images[0]?.url;
  if (!first) return `${SITE_URL}/images/brand/hero-bg.webp`;
  return first.startsWith('http') ? first : `${SITE_URL}${first}`;
}

export function generateMetadata({ params }: { params: { handle: string } }): Metadata {
  const raw = PRODUCTS_DATA.find((p) => p.handle === params.handle);
  if (!raw) return { title: 'Product Not Found' };
  const product = enrichProductsWithShopifyData([raw])[0];
  const title = getWords(product.title, 10);
  const description = getWords(product.title, 15);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_URL}/products/${product.handle}/`,
      images: [{ url: getProductImageUrl(product), alt: product.title }],
    },
  };
}

export default function ProductDetailPage({ params }: { params: { handle: string } }) {
  const product = PRODUCTS_DATA.find((p) => p.handle === params.handle);
  const enriched = product ? enrichProductsWithShopifyData([product])[0] : null;

  // You May Also Like：同分类（归一化后）的其他在售产品，排除自身，最多 4 个
  // 排序：同尺寸/同规格优先，其次价格相近
  const related = enriched
    ? (() => {
        const sizeMatch = enriched.title.match(/\d+\s*x\s*\d+/i)?.[0].replace(/\s/g, '').toLowerCase();
        const price = parseFloat(enriched.shopifyPrice || enriched.priceRange.minVariantPrice.amount);
        return enrichProductsWithShopifyData(PRODUCTS_DATA)
          .filter((p) =>
            p.handle !== enriched.handle &&
            p.productType === enriched.productType &&
            p.hasShopifyData &&
            p.shopifyAvailable
          )
          .map((p) => {
            const pPrice = parseFloat(p.shopifyPrice || p.priceRange.minVariantPrice.amount);
            const sameSize = sizeMatch ? p.title.replace(/\s/g, '').toLowerCase().includes(sizeMatch) : false;
            const nearPrice = price > 0 && Math.abs(pPrice - price) / price <= 0.3;
            return { p, score: (sameSize ? 2 : 0) + (nearPrice ? 1 : 0) };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 4)
          .map(({ p }) => p);
      })()
    : [];

  // JSON-LD Product 结构化数据（有真实评价数据时才输出 aggregateRating）
  const jsonLd = enriched
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: enriched.title,
        image: enriched.shopifyImages && enriched.shopifyImages.length > 0
          ? enriched.shopifyImages.slice(0, 3)
          : enriched.images.slice(0, 3).map((img) => img.url.startsWith('http') ? img.url : `${SITE_URL}${img.url}`),
        description: enriched.description.slice(0, 300),
        brand: { '@type': 'Brand', name: 'Makimoo' },
        offers: {
          '@type': 'Offer',
          url: `${SITE_URL}/products/${enriched.handle}/`,
          priceCurrency: STORE_CURRENCY,
          price: enriched.shopifyPrice || enriched.priceRange.minVariantPrice.amount,
          availability: (enriched.shopifyAvailable ?? enriched.availableForSale)
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        },
        ...(enriched.rating != null && enriched.reviewCount != null && enriched.reviewCount > 0
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: enriched.rating,
                reviewCount: enriched.reviewCount,
              },
            }
          : {}),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient handle={params.handle} />
      {related.length > 0 && (
        <section className="px-6 lg:px-10 pb-16">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="text-center max-w-xl mx-auto mb-10">
                <p className="text-sm font-semibold tracking-widest uppercase text-brand mb-2">More Comfort</p>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-charcoal mb-3">You May Also Like</h2>
                <p className="text-base text-charcoal-light">
                  More picks from the same collection, crafted for the same lasting comfort.
                </p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}
      <RecentlyViewed currentHandle={params.handle} />
    </>
  );
}
