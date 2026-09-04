import { Metadata } from 'next';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { CATEGORY_DEFS, getSubcategoriesOf } from '@/data/subcategories';
import CollectionCard from '@/components/CollectionCard';
import { shopifyImageUrl } from '@/lib/paths';

export const metadata: Metadata = {
  title: 'Shop by Category | Makimoo',
  description: 'Browse all Makimoo categories: cushions, pillows, towels, mats and more home comfort essentials.',
};

function isInStock(p: MakimooProduct): boolean {
  return p.hasShopifyData === true && p.shopifyAvailable === true;
}

/** 代表图：优先该组第一个在售产品的首图（Shopify CDN 缩到 600px），缺货组用第一个产品 */
function repImage(list: MakimooProduct[]): string {
  const rep = list.find(isInStock) || list[0];
  if (!rep) return '/images/brand/placeholder.jpg';
  if (rep.featuredImage) return rep.featuredImage;
  if (rep.shopifyImages && rep.shopifyImages.length > 0) return shopifyImageUrl(rep.shopifyImages[0], 600);
  return rep.images[0]?.url || '/images/brand/placeholder.jpg';
}

export default function CategoriesPage() {
  const allProducts = enrichProductsWithShopifyData(PRODUCTS_DATA);

  const sections = CATEGORY_DEFS.map((cat) => {
    const inCat = allProducts.filter(
      (p) =>
        p.productType.toLowerCase() === cat.value ||
        p.tags.some((t) => t.toLowerCase().includes(cat.value))
    );
    const subs = getSubcategoriesOf(cat.value)
      .map((s) => ({ ...s, products: inCat.filter((p) => p.subcategory === s.key) }))
      .filter((s) => s.products.length > 0);
    return { ...cat, products: inCat, subs };
  }).filter((s) => s.products.length > 0);

  return (
    <div className="px-6 lg:px-10 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#333] mb-3">Shop by Category</h1>
          <p className="text-[#555]">Find the right comfort essentials for every corner of your home.</p>
        </div>

        <div className="space-y-14">
          {sections.map((cat) => (
            <section key={cat.value}>
              <div className="flex items-end justify-between mb-5">
                <div>
                  <h2 className="text-xl lg:text-2xl font-extrabold text-[#333]">{cat.label}</h2>
                  <p className="text-sm text-[#999] mt-0.5">{cat.intro}</p>
                </div>
                <a
                  href={`/products/?cat=${cat.value}`}
                  className="text-sm font-semibold text-[#8B5A2B] hover:underline underline-offset-4 flex items-center gap-1 flex-shrink-0"
                >
                  View All ({cat.products.length})
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>

              {cat.subs.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  {cat.subs.map((s) => (
                    <CollectionCard
                      key={s.key}
                      category={cat.label}
                      title={s.label}
                      description={`${s.products.length} product${s.products.length === 1 ? '' : 's'}`}
                      image={repImage(s.products)}
                      href={`/products/?cat=${cat.value}&sub=${s.key}`}
                    />
                  ))}
                </div>
              ) : (
                /* 无二级分类的类目（Others / Holiday）：单卡直达类目页 */
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  <CollectionCard
                    category="Collection"
                    title={cat.label}
                    description={cat.intro}
                    image={repImage(cat.products)}
                    href={`/products/?cat=${cat.value}`}
                  />
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
