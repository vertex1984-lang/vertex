import CollectionCard from '@/components/CollectionCard';
import HeroCarousel from '@/components/HeroCarousel';
import ProductCard from '@/components/ProductCard';
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
  'B0F1YCXTRX',
];

const featuredProducts = FEATURED_ASINS.map((asin) => {
  const product = PRODUCTS_DATA.find((p) => p.asin.toUpperCase() === asin.toUpperCase());
  if (!product) return null;
  const featuredImage = `/images/featured/${asin.toLowerCase()}.webp`;
  return { ...product, featuredImage } as MakimooProduct;
}).filter(Boolean) as MakimooProduct[];

const collections = [
  {
    title: 'The Cushions\nCollection:',
    description: 'Weather-resistant cushions for your patio & garden.',
    image: '/images/brand/outdoor-collection.webp',
    href: '/products?cat=cushions',
  },
  {
    title: 'The Pillows\nCollection:',
    description: 'Premium Fabrics & 3D Polyster Filling Ensures Comfortness.',
    image: '/images/brand/indoor-collection.webp',
    href: '/products?cat=pillows',
  },
  {
    title: 'The Travel\nCollection:',
    description: 'Comfortable travel pillows for your journey.',
    image: '/images/brand/outdoor-collection-2.webp',
    href: '/products?cat=travel',
  },
  {
    title: 'The Dinings\nCollection:',
    description: 'Elegant dining essentials for your home.',
    image: '/images/brand/indoor-collection-2.webp',
    href: '/products?cat=dining',
  },
  {
    title: 'Holiday\nCollection:',
    description: 'Make every holiday moment truly unforgettable.',
    image: '/images/brand/holiday-collection.webp',
    href: '/products?cat=holiday',
  },
  {
    title: 'Home Fragrance\nCollection:',
    description: 'Elevate your everyday mood with fragrance.',
    image: '/images/brand/home-fragrance-collection.webp',
    href: '/products?cat=home-fragrance',
  },
  {
    title: 'The Dining\nCollection:',
    description: 'Elegant dining essentials for your home.',
    image: '/images/brand/indoor-collection.webp',
    href: '/products?cat=dining',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center text-center overflow-hidden px-6 lg:px-10 h-[500px] sm:h-[560px] lg:h-[640px]"
      >
        <HeroCarousel />
      </section>

      {/* Features Strip */}
      <div
        className="relative w-full border-t px-6 lg:px-10 py-5 z-10"
        style={{ backgroundColor: '#F8F5F0', borderColor: 'rgba(0,0,0,0.05)' }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center px-6 md:border-r md:border-dotted md:border-[rgba(0,0,0,0.2)]">
            <div className="mb-4 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#E8E2DA] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#8B5A2B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                  <path d="M12 8.5c-.5-.8-1.5-1.3-2.5-1.3-1.8 0-3.2 1.4-3.2 3.2 0 2.2 2.5 4.8 5.7 7.6 3.2-2.8 5.7-5.4 5.7-7.6 0-1.8-1.4-3.2-3.2-3.2-1 0-2 .5-2.5 1.3z" fill="currentColor" stroke="none" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-3 tracking-wide">WARM & COMFORTABLE</h3>
            <p className="text-sm text-[#555] leading-relaxed">
              Everyone deserves a home that feels like a warm embrace.
            </p>
          </div>
          <div className="text-center px-6 md:border-r md:border-dotted md:border-[rgba(0,0,0,0.2)]">
            <div className="mb-4 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#E8E2DA] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#8B5A2B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-3 tracking-wide">SIMPLE & THOUGHTFUL</h3>
            <p className="text-sm text-[#555] leading-relaxed">
              Bringing comfort to your home is our mission.
            </p>
          </div>
          <div className="text-center px-6">
            <div className="mb-4 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#E8E2DA] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#8B5A2B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-3 tracking-wide">MADE FOR BETTER LIVING</h3>
            <p className="text-sm text-[#555] leading-relaxed">
              Making your life simpler is our top priority.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Collection Cards */}
      <section className="px-6 lg:px-10 py-1 sm:py-5 pb-4 sm:pb-16">
        <div className="mx-auto flex flex-wrap justify-center gap-5">
          {collections.map((col, i) => (
            <CollectionCard key={i} {...col} />
          ))}
        </div>
      </section>

      {/* Collection Banner - Desktop */}
      <a href={resolveUrl('/products')} className="w-full hidden sm:block overflow-hidden">
        <img
          src={resolveUrl('/images/brand/collection-banner-new.webp')}
          alt="Makimoo Collection Banner"
          className="w-full h-auto block transition-transform duration-500 hover:scale-105"
        />
      </a>
      {/* Collection Banner - Mobile */}
      <a href={resolveUrl('/products')} className="w-full sm:hidden overflow-hidden">
        <img
          src={resolveUrl('/images/brand/collection-banner-new.webp')}
          alt="Makimoo Collection Banner"
          className="w-full h-auto block object-contain transition-transform duration-500 hover:scale-105"
          style={{ maxHeight: 'none' }}
        />
      </a>

      {/* Featured Products Section */}
      <section className="pt-20 pb-8 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#8B5A2B] mb-2">Best Sellers</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#333] mb-3">Featured Products</h2>
            <p className="text-base text-[#555]">
              Discover our most-loved cushions and pillows, crafted for comfort that lasts.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {enrichProductsWithShopifyData(featuredProducts).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
            {/* 60-Day Return */}
            <div className="text-center px-6">
              <div className="mb-4 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#E8E2DA] flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#8B5A2B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 tracking-wide text-[#333]">60-Day Return</h3>
              <p className="text-sm text-[#555] leading-relaxed">
                We offer extended return period of 60 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Banner */}
      <a href={resolveUrl('/products')} className="block relative w-full -mt-[15px] -mb-[15px] overflow-hidden">
        {/* Desktop: img tag */}
        <img
          src={resolveUrl('/images/brand/about-banner-new.webp')}
          alt="Makimoo Brand Story"
          className="w-full h-auto block hidden sm:block transition-transform duration-500 hover:scale-105"
        />
        {/* Mobile: img tag (no fade, no text) */}
        <img
          src={resolveUrl('/images/brand/about-banner-new.webp')}
          alt="Makimoo Brand Story"
          className="w-full h-auto block sm:hidden transition-transform duration-500 hover:scale-105"
        />
      </a>

      {/* Newsletter */}
      <section className="py-20 px-6 lg:px-10">
        <div
          className="max-w-7xl mx-auto rounded-3xl p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10"
          style={{ backgroundColor: '#8B5A2B' }}
        >
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-2">Join the Herd</h2>
            <p className="text-sm text-white/80">
              Get exclusive access to new collections, seasonal sales, and comfort tips delivered to your inbox.
            </p>
          </div>
          <form className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:min-w-[380px]">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-5 py-3.5 rounded-lg border-2 border-white/30 bg-white/10 text-white placeholder:text-white/50 outline-none focus:border-white text-sm"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-full text-sm font-semibold whitespace-nowrap transition hover:bg-[#F8F5F0]"
              style={{ backgroundColor: '#fff', color: '#8B5A2B' }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
