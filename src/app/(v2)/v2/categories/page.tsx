import { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import V2PageHeader from '@/components/v2/V2PageHeader';
import { PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';
import { CATEGORY_DEFS, getSubcategoriesOf } from '@/data/subcategories';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

export const metadata: Metadata = {
  title: 'Shop by Category | Makimoo',
  description: 'Browse all Makimoo categories: cushions, pillows, towels, mats and more home comfort essentials.',
};

export default function V2CategoriesPage() {
  const allProducts = enrichProductsWithShopifyData(PRODUCTS_DATA);

  // 与 (classic) 分类页相同的归组逻辑：顶级分类 + 有产品的二级分类
  const sections = CATEGORY_DEFS.map((cat) => {
    const inCat = allProducts.filter(
      (p) =>
        p.productType.toLowerCase() === cat.value ||
        p.tags.some((t) => t.toLowerCase().includes(cat.value))
    );
    const subs = getSubcategoriesOf(cat.value)
      .map((s) => ({ ...s, count: inCat.filter((p) => p.subcategory === s.key).length }))
      .filter((s) => s.count > 0);
    return { ...cat, count: inCat.length, subs };
  }).filter((s) => s.count > 0);

  return (
    <>
      <V2PageHeader
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Categories' }]}
        title="Shop by Category"
        subtitle="Find the right comfort essentials for every corner of your home."
      />

      <section className="bg-off-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14 lg:py-20">
          <div className="grid md:grid-cols-2 gap-x-6 lg:gap-x-8 gap-y-12 lg:gap-y-16">
            {sections.map((cat, i) => (
              <Reveal key={cat.value} delay={(i % 2) * 80}>
                <div>
                  {/* 分类大卡：与首页 V2CategoryGrid 呼应的 hover 放大 + 底部渐变 */}
                  <a
                    href={v2url(`/products/?cat=${cat.value}`)}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-lg"
                  >
                    <img
                      src={resolveUrl(`/images/collections/${cat.value}.webp`)}
                      alt={cat.label}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7 flex items-end justify-between gap-4">
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-cream tracking-wide">
                          {cat.label}
                        </h2>
                        <p className="mt-1 text-xs font-medium tracking-widest uppercase text-cream/70">
                          {cat.count} Product{cat.count === 1 ? '' : 's'}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase text-cream/80 transition-colors group-hover:text-cream flex-shrink-0">
                        View All
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </div>
                  </a>

                  <p className="mt-4 text-sm text-charcoal-light">{cat.intro}</p>

                  {/* 二级分类 chips：直达 /v2/products/?cat=xxx&sub=yyy */}
                  {cat.subs.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {cat.subs.map((s) => (
                        <a
                          key={s.key}
                          href={v2url(`/products/?cat=${cat.value}&sub=${s.key}`)}
                          className="px-3.5 py-1.5 text-xs font-medium text-charcoal bg-white border border-warm-gray rounded-full transition-colors hover:border-brand hover:text-brand"
                        >
                          {s.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
