import CollectionCard from '@/components/CollectionCard';
import HeroCarousel from '@/components/HeroCarousel';
import ProductCard from '@/components/ProductCard';
import Reveal from '@/components/Reveal';
import NewsletterForm from '@/components/NewsletterForm';
import BestSellers from '@/components/BestSellers';
import ReviewsSection from '@/components/ReviewsSection';
import UGCGallery from '@/components/UGCGallery';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { resolveUrl } from '@/lib/paths';

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

// Best Sellers：有 Shopify 数据且在售的产品，按标题去重（同款不同色只出现一次），取前 10 个
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

const collections = [
  {
    category: 'Cushions',
    title: 'Comfort for Every Seat',
    description: 'Tufted & water-resistant cushions, indoors and out.',
    image: '/images/collections/cushions.webp',
    href: '/products?cat=cushions',
  },
  {
    category: 'Pillows',
    title: 'Softness, Perfectly Filled',
    description: 'Premium fabrics with plush 3D filling for bed & sofa.',
    image: '/images/collections/pillows.webp',
    href: '/products?cat=pillows',
  },
  {
    category: 'Towels',
    title: 'Wrap Yourself in Softness',
    description: 'Hotel-style cotton towels for bath, beach & beyond.',
    image: '/images/collections/towels.webp',
    href: '/products?cat=towels',
  },
  {
    category: 'Mats',
    title: 'Step Into Comfort',
    description: 'Absorbent mats & durable rugs for every room.',
    image: '/images/collections/mats.webp',
    href: '/products?cat=mats',
  },
  {
    category: 'Holiday',
    title: 'Light Up Every Moment',
    description: 'Festive string lights & décor for the holidays.',
    image: '/images/collections/holiday.webp',
    href: '/products?cat=holiday',
    comingSoon: true,
  },
  {
    category: 'Others',
    title: 'The Little Essentials',
    description: 'Travel, kitchen & extras for daily living.',
    image: '/images/collections/others.webp',
    href: '/products?cat=others',
  },
];

export default function HomePage() {
  // ItemList JSON-LD：Featured 产品列表，利于 SEO
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Makimoo Featured Products',
    itemListElement: enrichProductsWithShopifyData(featuredProducts).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.makimoohome.com/products/${p.handle}/`,
      name: p.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {/* Hero Section（移动端用 4:5 比例，避免桌面宽幅图被过度裁切；桌面端保持 85vh） */}
      <section
        className="relative flex items-center justify-center text-center overflow-hidden px-6 lg:px-10 aspect-[4/5] lg:aspect-auto lg:min-h-[85vh]"
      >
        <HeroCarousel />
      </section>

      {/* Features Strip */}
      <div
        className="relative w-full border-t px-6 lg:px-10 py-5 z-10"
        style={{ backgroundColor: '#F8F5F0', borderColor: 'rgba(0,0,0,0.05)' }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
          <div className="bg-white md:bg-transparent rounded-2xl md:rounded-none shadow-sm md:shadow-none p-4 md:p-0 text-center md:px-6 md:border-r md:border-dotted md:border-[rgba(0,0,0,0.2)]">
            <div className="mb-2.5 md:mb-4 flex items-center justify-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#E8E2DA] flex items-center justify-center">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[#8B5A2B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                  <path d="M12 8.5c-.5-.8-1.5-1.3-2.5-1.3-1.8 0-3.2 1.4-3.2 3.2 0 2.2 2.5 4.8 5.7 7.6 3.2-2.8 5.7-5.4 5.7-7.6 0-1.8-1.4-3.2-3.2-3.2-1 0-2 .5-2.5 1.3z" fill="currentColor" stroke="none" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-[13px] leading-snug md:text-lg font-bold mb-1 md:mb-3 tracking-wide">WARM & COMFORTABLE</h3>
              <p className="text-xs md:text-sm text-[#555] leading-relaxed">
                Everyone deserves a home that feels like a warm embrace.
              </p>
            </div>
          </div>
          <div className="bg-white md:bg-transparent rounded-2xl md:rounded-none shadow-sm md:shadow-none p-4 md:p-0 text-center md:px-6 md:border-r md:border-dotted md:border-[rgba(0,0,0,0.2)]">
            <div className="mb-2.5 md:mb-4 flex items-center justify-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#E8E2DA] flex items-center justify-center">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[#8B5A2B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-[13px] leading-snug md:text-lg font-bold mb-1 md:mb-3 tracking-wide">SIMPLE & THOUGHTFUL</h3>
              <p className="text-xs md:text-sm text-[#555] leading-relaxed">
                Bringing comfort to your home is our mission.
              </p>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 bg-white md:bg-transparent rounded-2xl md:rounded-none shadow-sm md:shadow-none p-4 md:p-0 text-center md:px-6">
            <div className="mb-2.5 md:mb-4 flex items-center justify-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#E8E2DA] flex items-center justify-center">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[#8B5A2B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-[13px] leading-snug md:text-lg font-bold mb-1 md:mb-3 tracking-wide">MADE FOR BETTER LIVING</h3>
              <p className="text-xs md:text-sm text-[#555] leading-relaxed">
                Making your life simpler is our top priority.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Collections：6 大分类卡片（3 列 × 2 行，stagger 入场） */}
      <section className="px-6 lg:px-10 pt-8 sm:pt-12 pb-16 sm:pb-24">
        <Reveal>
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#8B5A2B] mb-2">Shop by Category</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#333] mb-3">Find Your Comfort</h2>
            <p className="text-base text-[#555]">
              Six curated collections, one goal — a warmer, softer home.
            </p>
          </div>
        </Reveal>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {collections.map((col, i) => (
            <Reveal key={col.title} delay={i * 80} className="h-full">
              <CollectionCard {...col} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Collection Banner - Desktop (高度为原图的 92%，即 80% × 1.15) */}
      <div className="relative w-full hidden sm:block overflow-hidden animate-banner-in" style={{ aspectRatio: '1456 / 574' }}>
        <img
          src={resolveUrl('/images/brand/collection-banner-new.webp')}
          alt="Makimoo Collection Banner"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex items-center">
          <div className="px-10 lg:px-20 max-w-2xl">
            <div className="flex items-center gap-3 mb-7">
              <span className="text-white text-3xl font-bold tracking-wide drop-shadow">makimoo</span>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-0.5 bg-white/70" />
              <p className="text-white/85 text-base font-semibold tracking-widest uppercase">
                Exclusive Deals
              </p>
            </div>
            <h2 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-5 drop-shadow-md">
              Up to 50% Off
            </h2>
            <p className="text-white/85 text-lg lg:text-xl leading-relaxed mb-9 max-w-md">
              Limited-time offers on our most-loved comfort essentials, only on MakimooHome.com.
            </p>
            <a
              href={resolveUrl('/products')}
              className="group/btn inline-flex items-center gap-2.5 px-10 py-4 rounded-full text-lg font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-xl"
              style={{ backgroundColor: '#8B5A2B' }}
            >
              Discover Deals
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover/btn:translate-x-1"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      {/* Collection Banner - Mobile（竖版 3:4 底图，文字底部排布，占屏比更大） */}
      <div className="relative w-full sm:hidden overflow-hidden mt-[50px] animate-banner-in" style={{ aspectRatio: '3 / 4' }}>
        <img
          src={resolveUrl('/images/brand/collection-banner-mobile-v2.webp')}
          alt="Makimoo Collection Banner"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex items-end">
          <div className="px-6 pb-9">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-white text-lg font-bold tracking-wide drop-shadow">makimoo</span>
            </div>
            <p className="text-white/85 text-xs font-semibold tracking-widest uppercase mb-2">
              Exclusive Deals
            </p>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-3 drop-shadow-md">
              Up to 50% Off
            </h2>
            <p className="text-white/85 text-sm leading-relaxed mb-6 max-w-xs">
              Limited-time offers on our most-loved comfort essentials, only on MakimooHome.com.
            </p>
            <a
              href={resolveUrl('/products')}
              className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: '#8B5A2B' }}
            >
              Discover Deals
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover/btn:translate-x-1"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="pt-20 pb-8 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {/* 信任条：Free Shipping · 30-Day Returns · Secure Checkout · Quality Materials */}
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-12 text-xs sm:text-sm font-medium text-[#555]">
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4 text-[#8B5A2B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                Free Shipping
              </span>
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4 text-[#8B5A2B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
                30-Day Returns
              </span>
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4 text-[#8B5A2B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                Secure Checkout
              </span>
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4 text-[#8B5A2B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                Quality Materials
              </span>
            </div>
          </Reveal>
          <Reveal>
            <div className="text-center max-w-xl mx-auto mb-12">
              <p className="text-sm font-semibold tracking-widest uppercase text-brand mb-2">Curated For You</p>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-charcoal mb-3">Featured Products</h2>
              <p className="text-base text-charcoal-light">
                Discover our most-loved cushions and pillows, crafted for comfort that lasts.
              </p>
            </div>
          </Reveal>
          <Reveal delay={150}>
            {/* 移动端 2 列 / 桌面端 4 列，卡片等高（ProductCard h-full + grid 默认 items-stretch） */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
              {enrichProductsWithShopifyData(featuredProducts).map((product) => (
                <ProductCard key={product.id} product={product} variant="featured" />
              ))}
            </div>
          </Reveal>
          <div className="text-center">
            <a
              href={resolveUrl('/products')}
              className="inline-block px-7 py-3 rounded-full text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              style={{ backgroundColor: '#8B5A2B' }}
            >
              View All Products
            </a>
          </div>
        </div>
      </section>

      {/* Best Sellers horizontal scroller (replaces the old "Don't Miss Out" banner; image assets kept in /public/images/brand/) */}
      <Reveal>
        <BestSellers products={bestSellers} />
      </Reveal>

      {/* Reviews（hardcode 占位评价，待真实数据替换） */}
      <ReviewsSection />

      {/* UGC / Lifestyle 画廊（hardcode 占位图，待真实买家秀替换） */}
      <UGCGallery />

      {/* Worry-Free Purchase */}
      <section className="px-6 lg:px-10 py-[30px] mb-[60px]" style={{ backgroundColor: '#F8F5F0' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[#333] mb-8 text-center">Worry-Free Purchase</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Shipping */}
            <div className="text-center px-6 md:border-r md:border-dotted md:border-[rgba(0,0,0,0.2)]">
              <div className="mb-4 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#E8E2DA] flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#8B5A2B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 tracking-wide text-[#333]">Free Shipping</h3>
              <p className="text-sm text-[#555] leading-relaxed">
                We offer free shipping on all orders on our website.
              </p>
            </div>
            {/* Free Return */}
            <div className="text-center px-6 md:border-r md:border-dotted md:border-[rgba(0,0,0,0.2)]">
              <div className="mb-4 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#E8E2DA] flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#8B5A2B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 tracking-wide text-[#333]">Free Return</h3>
              <p className="text-sm text-[#555] leading-relaxed">
                We will cover return shipping cost.
              </p>
            </div>
            {/* 30-Day Return */}
            <div className="text-center px-6">
              <div className="mb-4 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#E8E2DA] flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#8B5A2B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 tracking-wide text-[#333]">30-Day Return</h3>
              <p className="text-sm text-[#555] leading-relaxed">
                We offer extended return period of 30 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-6 lg:px-10">
        <Reveal>
          <div
            className="relative max-w-7xl mx-auto rounded-3xl p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #8B5A2B 0%, #6B4220 100%)' }}
          >
            {/* Decorative radial glows */}
            <div
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(255,248,240,0.18) 0%, transparent 70%)' }}
            />
            <div
              className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(255,248,240,0.12) 0%, transparent 70%)' }}
            />
            <div className="relative">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-2">Join the Herd</h2>
              <p className="text-sm text-white/80">
                Get exclusive access to new collections, seasonal sales, and comfort tips delivered to your inbox.
              </p>
            </div>
            <div className="relative w-full lg:w-auto">
              <NewsletterForm />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
