import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import StorySplit from '@/components/v2/StorySplit';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

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

export default function V2AboutPage() {
  return (
    <>
      {/* 全宽大图页头：从视口顶开始，衬住初始透明的 fixed V2Header */}
      <section className="relative h-[440px] sm:h-[520px] lg:h-[600px] overflow-hidden">
        <img
          src={resolveUrl('/images/about/about-banner.webp')}
          alt="Makimoo outdoor patio with floral cushions at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/50" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-16">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-cream/80 mb-3">
            Our Story
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-cream mb-4 drop-shadow-lg">
            The Makimoo Story
          </h1>
          <p className="text-base sm:text-lg text-cream/90 max-w-2xl">
            Born from a love of simple living and genuine comfort, Makimoo brings warmth to every corner of your home.
          </p>
        </div>
      </section>

      {/* Why We Exist */}
      <StorySplit
        eyebrow="Why We Exist"
        title="Comfort, Designed With Intention"
        body="Makimoo was founded on a simple belief: everyone deserves a home that feels like a warm embrace. Every product we create uses premium materials, thoughtful craftsmanship, and a deep respect for the planet — we don't just sell cushions and pillows; we deliver comfort that transforms spaces into sanctuaries."
        ctaLabel="Shop the Collection"
        ctaHref="/products/"
        image="/images/about/about-story.webp"
        imageAlt="A cozy Makimoo living room with floral cushions on a linen sofa"
        tone="cream"
      />

      {/* What We Stand For：3 栏图标区 */}
      <section className="bg-off-white py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="text-center mb-10 lg:mb-14">
              <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-3">
                Our Values
              </p>
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-charcoal">
                What We Stand For
              </h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {VALUES.map((item, i) => (
              <Reveal key={item.title} delay={i * 80} className="h-full">
                <div className="h-full text-center p-8 rounded-2xl bg-white border border-warm-gray">
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-off-white flex items-center justify-center">
                    <svg className="w-7 h-7 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {item.icon}
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-charcoal mb-2">{item.title}</h3>
                  <p className="text-sm text-charcoal-light leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <StorySplit
        eyebrow="Our Quality Promise"
        title="Built to Last, Made to Love"
        body="High-density compressed poly-fiber fill keeps its loft season after season. Premium outdoor polyester holds its color under the sun, a water-repellent surface makes care effortless, and reinforced canvas ties keep every cushion exactly where you want it — all backed by a 30-day worry-free return policy."
        ctaLabel="Shop Best Sellers"
        ctaHref="/products/"
        image="/images/brand/makimoo-vi.webp"
        imageAlt="Makimoo cushion fabrics and construction details"
        reverse
        tone="off-white"
      />

      {/* Sustainability：首页 StorySplit 链接到 /v2/about#sustainability，锚点必须存在 */}
      <div id="sustainability" className="scroll-mt-32">
        <StorySplit
          eyebrow="Made Responsibly"
          title="Sustainability"
          body="We're committed to reducing our environmental footprint. From sustainable sourcing to minimal packaging, every decision we make considers the impact on our planet — because a comfortable home shouldn't come at the cost of the Earth."
          ctaLabel="Get in Touch"
          ctaHref="/contact/"
          image="/images/about/about-sustainability.webp"
          imageAlt="Natural linen fabric, wood and greenery — Makimoo sustainable materials"
          tone="cream"
        />
      </div>

      {/* CTA */}
      <section className="bg-off-white py-16 lg:py-24">
        <Reveal>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-charcoal mb-4">
              Ready to Find Your Comfort?
            </h2>
            <p className="text-charcoal-light max-w-xl mx-auto mb-8">
              Explore our collection of cushions, pillows and comfort essentials — made for every corner of your home.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={v2url('/products/')}
                className="inline-block px-8 py-3.5 bg-brand text-cream text-sm font-semibold rounded-full transition hover:bg-brand-dark"
              >
                Shop All Products
              </a>
              <a
                href={v2url('/contact/')}
                className="inline-block px-8 py-3.5 text-brand text-sm font-semibold rounded-full border-2 border-brand transition hover:bg-brand hover:text-cream"
              >
                Contact Us
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
