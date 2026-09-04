import Reveal from '@/components/Reveal';
import { resolveUrl } from '@/lib/paths';

/**
 * V2 首页品牌理念区（原 Material Guide 位置）
 * 四个子理念，每个配图 + 标题 + 一句话；图片为占位，后续可替换。
 */
const PILLARS = [
  {
    name: 'Honest Materials',
    trait: 'Natural fabrics and fills, chosen to last.',
    image: '/images/about/about-sustainability.webp',
  },
  {
    name: 'Thoughtful Design',
    trait: 'Every detail shaped around daily comfort.',
    image: '/images/brand/makimoo-design.webp',
  },
  {
    name: 'Made Responsibly',
    trait: 'Built for years of use, packaged with less.',
    image: '/images/about/about-story.webp',
  },
  {
    name: 'Comfort for All',
    trait: 'A warmer, softer home within reach.',
    image: '/images/about/about-banner.webp',
  },
];

export default function MaterialGuide() {
  return (
    <section className="bg-cream py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 text-center">
        <Reveal>
          <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-3">
            Our Philosophy
          </p>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-charcoal mb-4">
            What We Believe In
          </h2>
          <p className="text-base text-charcoal-light max-w-xl mx-auto mb-12 lg:mb-16">
            Four simple ideas behind every Makimoo piece.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {PILLARS.map((p, i) => (
            <Reveal key={p.name} delay={i * 80}>
              <div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4 lg:mb-5">
                  <img
                    src={resolveUrl(p.image)}
                    alt={p.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-charcoal mb-2">
                  {p.name}
                </h3>
                <p className="text-sm text-charcoal-light leading-relaxed">{p.trait}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
