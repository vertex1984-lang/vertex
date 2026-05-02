import CollectionCard from '@/components/CollectionCard';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';
import { resolveUrl } from '@/lib/paths';

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
        className="relative flex items-center justify-center text-center overflow-hidden px-6 lg:px-10 sm:pt-24 lg:pt-28 pb-[78px] sm:pb-48 lg:pb-52"
        style={{
          backgroundImage: `url(${resolveUrl('/images/brand/hero-bg.webp')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          paddingTop: '104px',
        }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(248, 245, 240, 0.7)' }}
        />
        <div className="relative z-10 max-w-2xl mx-auto lg:mt-[15px]">
          <h4 className="text-sm font-semibold tracking-widest uppercase text-[#333] mb-3">
            Makimoo Brand Guidelines in Action
          </h4>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-[#8B5A2B] mb-6 leading-tight">
            SIMPLE LIFE,<br />BETTER COMFORT.
          </h1>
          <p className="text-base lg:text-lg text-[#333] font-medium mb-8 max-w-xl mx-auto text-center">
            Experience comfort for living, crafted with materials you&apos;ll love.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={resolveUrl('/products')}
              className="px-7 py-3 rounded-full text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              style={{ backgroundColor: '#8B5A2B', border: '2px solid #8B5A2B' }}
            >
              Shop the Collection
            </a>
            <a
              href={resolveUrl('/about')}
              className="px-7 py-3 rounded-full text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-[#333] hover:text-white"
              style={{ color: '#333', border: '2px solid #333' }}
            >
              Learn Our Story
            </a>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <div
        className="relative w-full border-t px-6 lg:px-10 py-2 sm:py-10 -mt-4 sm:-mt-[60px] z-10"
        style={{ backgroundColor: '#F8F5F0', borderColor: 'rgba(0,0,0,0.05)' }}
      >
        <div className="max-w-4xl mx-auto hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center px-6 md:border-r md:border-dotted md:border-[rgba(0,0,0,0.2)]">
            <div className="text-3xl mb-4">🛏️</div>
            <h3 className="text-lg font-bold mb-4">Plump Comfort</h3>
            <ul className="text-xs font-medium text-left inline-block space-y-2">
              <li className="pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-[#8B5A2B] before:font-bold">Plump, overstuffed design</li>
              <li className="pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-[#8B5A2B] before:font-bold">High-density compressed poly-fiber fill</li>
            </ul>
          </div>
          <div className="text-center px-6 md:border-r md:border-dotted md:border-[rgba(0,0,0,0.2)]">
            <div className="text-3xl mb-4">🌤️</div>
            <h3 className="text-lg font-bold mb-4">Durable Design</h3>
            <ul className="text-xs font-medium text-left inline-block space-y-2">
              <li className="pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-[#8B5A2B] before:font-bold">Premium outdoor polyester fabric</li>
              <li className="pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-[#8B5A2B] before:font-bold">UV-fade resistant print</li>
              <li className="pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-[#8B5A2B] before:font-bold">Water-repellent surface</li>
            </ul>
          </div>
          <div className="text-center px-6">
            <div className="text-3xl mb-4">🫧</div>
            <h3 className="text-lg font-bold mb-4">Hassle-Free Care</h3>
            <ul className="text-xs font-medium text-left inline-block space-y-2">
              <li className="pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-[#8B5A2B] before:font-bold">Reinforced canvas ties</li>
              <li className="pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-[#8B5A2B] before:font-bold">Spot clean & air dry</li>
              <li className="pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-[#8B5A2B] before:font-bold">Breathable non-slip base</li>
            </ul>
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
      <a href={resolveUrl('/products')} className="w-full hidden sm:block">
        <img
          src={resolveUrl('/images/brand/collection-banner.webp')}
          alt="Makimoo Collection Banner"
          className="w-full h-auto block"
        />
      </a>
      {/* Collection Banner - Mobile */}
      <a href={resolveUrl('/products')} className="w-full sm:hidden">
        <img
          src={resolveUrl('/images/brand/collection-banner-mobile.webp')}
          alt="Makimoo Collection Banner"
          className="w-full h-auto block object-contain"
          style={{ maxHeight: 'none' }}
        />
      </a>

      {/* Featured Products Section */}
      <section className="py-20 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#8B5A2B] mb-2">Best Sellers</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#333] mb-3">Featured Products</h2>
            <p className="text-base text-[#555]">
              Discover our most-loved cushions and pillows, crafted for comfort that lasts.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {enrichProductsWithShopifyData(PRODUCTS_DATA.slice(0, 8)).map((product) => (
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

      {/* About Banner */}
      <a href={resolveUrl('/products')} className="block relative w-full -mt-[15px] -mb-[15px]">
        {/* Desktop: img tag */}
        <img
          src={resolveUrl('/images/brand/about-banner.webp')}
          alt="Makimoo Brand Story"
          className="w-full h-auto block hidden sm:block"
        />
        {/* Mobile: img tag (no fade, no text) */}
        <img
          src={resolveUrl('/images/brand/about-banner-mobile.webp')}
          alt="Makimoo Brand Story"
          className="w-full h-auto block sm:hidden"
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
