import type { Metadata } from 'next';
import { resolveUrl } from '@/lib/paths';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Born from a love of simple living and genuine comfort, Makimoo brings warmth to every corner of your home.',
};

const VALUES = [
  {
    title: 'Heart-Centered',
    desc: 'We design every product as if it were for our own home.',
    icon: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
  },
  {
    title: 'Sustainably Made',
    desc: 'Eco-friendly materials and responsible manufacturing.',
    icon: (
      <path d="M11 20A7 7 0 0 1 4 13c0-4 3-8 8-10 5 2 8 6 8 10a7 7 0 0 1-7 7M4 21c4-2 8-6 10-11" />
    ),
  },
  {
    title: 'Quality First',
    desc: 'Premium fabrics and durable construction that lasts.',
    icon: (
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.11" />
      </>
    ),
  },
];

const QUALITY_ITEMS = [
  {
    title: 'Lasting Plumpness',
    desc: 'High-density compressed poly-fiber fill keeps its loft season after season.',
    icon: <path d="M12 2a7 7 0 0 1 7 7c0 3-2 5-2 8H7c0-3-2-5-2-8a7 7 0 0 1 7-7zM9 21h6" />,
  },
  {
    title: 'UV-Fade Resistant',
    desc: 'Premium outdoor polyester fabric holds its color under the sun.',
    icon: (
      <>
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </>
    ),
  },
  {
    title: 'Water Repellent',
    desc: 'A water-repellent surface makes outdoor care effortless.',
    icon: <path d="M12 2.69 5.64 9.05a9 9 0 1 0 12.72 0L12 2.69z" />,
  },
  {
    title: 'Secure Ties',
    desc: 'Reinforced canvas ties keep every cushion exactly where you want it.',
    icon: <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />,
  },
  {
    title: 'Easy Care',
    desc: 'Spot clean and air dry — hassle-free maintenance, no special treatment.',
    icon: (
      <>
        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      </>
    ),
  },
  {
    title: '30-Day Returns',
    desc: 'Changed your mind? We cover return shipping within 30 days.',
    icon: (
      <>
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
      </>
    ),
  },
];

const TRUST = [
  {
    title: 'Free Shipping',
    desc: 'On all orders',
    icon: <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
  },
  {
    title: 'Free Return',
    desc: 'We cover return shipping',
    icon: (
      <>
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </>
    ),
  },
  {
    title: '30-Day Return',
    desc: 'Extended return period',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
  },
];

function SvgIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export default function AboutPage() {
  return (
    <div>
      {/* 顶部 Banner：品牌故事头图 */}
      <section className="relative h-[320px] sm:h-[420px] lg:h-[500px] overflow-hidden">
        <img
          src={resolveUrl('/images/about/about-banner.webp')}
          alt="Makimoo outdoor patio with floral cushions at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-[#F0E6D9] mb-3">Our Story</p>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">The Makimoo Story</h1>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl">
            Born from a love of simple living and genuine comfort, Makimoo brings warmth to every corner of your home.
          </p>
        </div>
      </section>

      <div className="px-6 lg:px-10 py-14 lg:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Why We Exist：图文 */}
          <Reveal>
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mb-20 lg:mb-28 items-center">
              <div>
                <img
                  src={resolveUrl('/images/about/about-story.webp')}
                  alt="A cozy Makimoo living room with floral cushions on a linen sofa"
                  className="w-full rounded-2xl shadow-lg"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#8B5A2B] mb-3">Why We Exist</p>
                <h2 className="text-2xl lg:text-4xl font-extrabold text-[#333] mb-5">Comfort, Designed With Intention</h2>
                <p className="text-[#555] leading-relaxed mb-4">
                  Makimoo was founded on a simple belief: everyone deserves a home that feels like a warm embrace.
                  Our journey began with a single cushion design and has grown into a full collection of comfort
                  essentials for indoor and outdoor living.
                </p>
                <p className="text-[#555] leading-relaxed">
                  Every product we create is designed with intention — using premium materials, thoughtful craftsmanship,
                  and a deep respect for the planet. We don&apos;t just sell cushions and pillows; we deliver comfort that
                  transforms spaces into sanctuaries.
                </p>
              </div>
            </div>
          </Reveal>

          {/* 品牌价值观 */}
          <Reveal delay={100}>
            <div className="mb-20 lg:mb-28">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-[#333] mb-10 text-center">What We Stand For</h2>
              <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
                {VALUES.map((item) => (
                  <div key={item.title} className="text-center p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#F8F5F0] flex items-center justify-center">
                      <SvgIcon className="w-7 h-7 text-[#8B5A2B]">{item.icon}</SvgIcon>
                    </div>
                    <h3 className="text-lg font-bold text-[#333] mb-2">{item.title}</h3>
                    <p className="text-sm text-[#555] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* 品质承诺：图标网格 */}
          <Reveal delay={100}>
            <div id="quality" className="mb-20 lg:mb-28">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#8B5A2B] mb-3 text-center">Our Quality Promise</p>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-[#333] mb-10 text-center">Built to Last, Made to Love</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {QUALITY_ITEMS.map((item) => (
                  <div key={item.title} className="flex gap-4 p-6 rounded-2xl bg-white shadow-sm">
                    <div className="shrink-0 w-11 h-11 rounded-full bg-[#F8F5F0] flex items-center justify-center">
                      <SvgIcon className="w-5 h-5 text-[#8B5A2B]">{item.icon}</SvgIcon>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#333] mb-1">{item.title}</h3>
                      <p className="text-sm text-[#555] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* 可持续性：宽幅图文 */}
          <Reveal delay={100}>
            <div id="sustainability" className="mb-20 lg:mb-28">
              <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <img
                  src={resolveUrl('/images/about/about-sustainability.webp')}
                  alt="Natural linen fabric, wood and greenery — Makimoo sustainable materials"
                  className="w-full h-72 sm:h-96 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-transparent flex items-center">
                  <div className="px-8 sm:px-12 max-w-lg">
                    <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-4">Sustainability</h2>
                    <p className="text-white/90 leading-relaxed">
                      We&apos;re committed to reducing our environmental footprint. From sustainable sourcing to minimal packaging,
                      every decision we make considers the impact on our planet — because a comfortable home shouldn&apos;t come
                      at the cost of the Earth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 信任带 */}
          <Reveal delay={100}>
            <div className="mb-20 lg:mb-28 border-y border-[#E8E2DA] py-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E2DA]">
                {TRUST.map((item) => (
                  <div key={item.title} className="text-center px-6 py-6 sm:py-0">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#F8F5F0] flex items-center justify-center">
                      <SvgIcon className="w-6 h-6 text-[#8B5A2B]">{item.icon}</SvgIcon>
                    </div>
                    <h3 className="font-bold text-[#333] tracking-wide">{item.title}</h3>
                    <p className="text-sm text-[#777] mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal delay={100}>
            <div className="text-center">
              <h2 className="text-2xl lg:text-4xl font-extrabold text-[#333] mb-4">Ready to Find Your Comfort?</h2>
              <p className="text-[#555] max-w-xl mx-auto mb-8">
                Explore our collection of cushions, pillows and comfort essentials — made for every corner of your home.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={resolveUrl('/products/')}
                  className="inline-block px-8 py-3.5 bg-[#8B5A2B] text-white font-semibold rounded-full hover:bg-[#6d4520] transition-colors shadow-md"
                >
                  Shop All Products
                </a>
                <a
                  href={resolveUrl('/contact/')}
                  className="inline-block px-8 py-3.5 bg-white text-[#8B5A2B] font-semibold rounded-full border border-[#8B5A2B] hover:bg-[#F8F5F0] transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
