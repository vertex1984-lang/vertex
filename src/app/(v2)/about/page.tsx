import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import StorySplit from '@/components/v2/StorySplit';
import { FABRIC_GUIDE } from '@/data/fabric-guide';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

export const metadata: Metadata = {
  title: 'Brand Story',
  description: 'Born from a love of simple living and genuine comfort, Makimoo brings warmth to every corner of your home.',
};

// 公信力数据（2026-09-30 用户定：静态四格，不做滚动动画）；
// 2026-10-02（用户定）：内容与首页信任条（V2TrustBar）对齐——
// 2 Million+ 客户 / 14,000+ 五星（星标在标签前同字号）/ 500K+ 年销 / 10+ 年行业，
// 竖线分隔 + 来源脚注；版式保留 about 页大字号（3xl/5xl）
const STATS = [
  { figure: '2 Million+', label: 'Customers Served Worldwide' },
  { figure: '14,000+', label: 'Five-Star Reviews', star: true },
  { figure: '500K+', label: 'Sold Every Year' },
  { figure: '10+ Years', label: 'In Home Textiles' },
];

export default function V2AboutPage() {
  return (
    <>
      {/* 全宽大图页头：从视口顶开始，衬住初始透明的 fixed V2Header。
          文案口径与 PDP 品牌故事板块一致（2026-09-30 用户定）：眉题 Makimoo + 主标 */}
      <section className="relative h-[440px] sm:h-[520px] lg:h-[600px] overflow-hidden">
        <img
          src={resolveUrl('/images/brand/trust-living.webp')}
          alt="A minimal Makimoo living room with a linen sofa and soft natural light"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/50" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-16">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-cream/80 mb-3">
            Makimoo
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-cream mb-4 drop-shadow-lg">
            A Trusted Name in Home Comfort
          </h1>
          <p className="text-base sm:text-lg text-cream/90 max-w-2xl">
            Born from a love of simple living and genuine comfort, Makimoo brings warmth to every corner of your home.
          </p>
        </div>
      </section>

      {/* 公信力数据条（静态四格；桌面 80% 宽与 PDP 新模块同口径；上下 padding 已收窄，2026-10-02 用户定） */}
      <section className="bg-off-white pt-8 pb-5 lg:pt-10 lg:pb-7 border-b border-warm-gray">
        <div className="max-w-[1400px] lg:w-[80%] lg:max-w-none mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 text-center lg:divide-x lg:divide-[#E8D9C8]">
              {STATS.map((s) => (
                <div key={s.label} className="lg:px-2">
                  {/* 移动端收窄一档（text-2xl）：最长格 "2 Million+" 在半宽格内不溢出（2026-10-02） */}
                  <p className="text-2xl lg:text-5xl font-extrabold tracking-tight text-brand mb-2 whitespace-nowrap">{s.figure}</p>
                  <p className="text-[11px] lg:text-xs font-semibold uppercase tracking-[0.18em] text-charcoal-light">
                    {/* 星标在标签文字最前，与标签同字号、品牌棕色（与首页信任条一致，2026-10-02） */}
                    {'star' in s && s.star && (
                      <span aria-hidden="true" className="text-brand mr-0.5">★</span>
                    )}
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
            {/* 来源脚注（与首页信任条一致，2026-10-02 用户定） */}
            <p className="mt-6 lg:mt-8 text-center text-[10px] lg:text-xs tracking-wide text-[#999]">
              Sales &amp; review data from Amazon
            </p>
          </Reveal>
        </div>
      </section>

      {/* Why We Exist */}
      <StorySplit
        eyebrow="Why We Exist"
        title="Comfort, Designed With Intention"
        body="Makimoo began with a simple belief: everyone deserves a home that feels like a warm embrace. Premium materials and thoughtful craftsmanship turn everyday spaces into sanctuaries."
        ctaLabel="Shop the Collection"
        ctaHref="/products/"
        image="/images/about/about-story.webp"
        imageAlt="A cozy Makimoo living room with floral cushions on a linen sofa"
        tone="cream"
      />

      {/* Our Materials：材质理念 + 六款面料平铺卡（2026-09-30 用户定：六张平铺，
          移动端 2 列、桌面 3 列；文案与 PDP 面料板块同口径，卡片数据取自 fabric-guide.ts） */}
      <section className="bg-off-white py-16 lg:py-24">
        <div className="max-w-[1400px] lg:w-[80%] lg:max-w-none mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="text-center mb-10 lg:mb-14 max-w-2xl mx-auto">
              <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-3">
                Our Materials
              </p>
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-charcoal mb-4">
                Honest Fabrics, Careful Workmanship
              </h2>
              <p className="text-sm lg:text-base text-charcoal-light leading-relaxed">
                From long-staple cotton to washed linen, we pick fabrics for how they feel and how they last.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6">
            {FABRIC_GUIDE.map((f, i) => (
              <Reveal key={f.key} delay={i * 60} className="h-full">
                <a
                  href={v2url(`/fabric-guide/#${f.slug}`)}
                  className="group block h-full rounded-2xl bg-white border border-warm-gray overflow-hidden transition hover:border-brand/40 hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={resolveUrl(f.image || '')}
                      alt={`${f.key} fabric close-up`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 lg:p-5">
                    <h3 className="text-sm lg:text-base font-bold text-charcoal mb-1.5">{f.key}</h3>
                    <p className="text-xs lg:text-sm text-charcoal-light leading-relaxed line-clamp-3">{f.intro}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="text-center mt-10 lg:mt-12">
              <a href={v2url('/fabric-guide/')} className="inline-flex items-center gap-2 text-sm font-semibold text-brand group">
                <span className="border-b border-brand/40 pb-0.5 transition-colors group-hover:border-brand">
                  Explore Our Fabrics
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quality Promise：并入 PDP 面料板块"逐件检验"做工文案（2026-09-30 用户定） */}
      <StorySplit
        eyebrow="Our Quality Promise"
        title="Built to Last, Made to Love"
        body="Every weave, stitch and finish is checked piece by piece before it leaves our workshop. High-density fill keeps its loft season after season, premium fabrics hold their color in the sun, and reinforced ties keep cushions in place — backed by a 30-day worry-free return policy."
        ctaLabel="Shop Best Sellers"
        ctaHref="/products/"
        image="/images/brand/trust-texture.webp"
        imageAlt="Close-up of Makimoo knit throw and cushion fabrics in warm natural light"
        reverse
        tone="off-white"
      />

      {/* What We Stand For 三栏价值观卡区已移除（2026-09-30 用户定） */}

      {/* Sustainability：首页 StorySplit 链接到 /v2/about#sustainability，锚点必须存在 */}
      <div id="sustainability" className="scroll-mt-32">
        <StorySplit
          eyebrow="Made Responsibly"
          title="Sustainability"
          body="From sustainable sourcing to minimal packaging, every decision considers our planet — because a comfortable home shouldn't come at the Earth's expense."
          ctaLabel="Get in Touch"
          ctaHref="/contact/"
          image="/images/about/about-sustainability.webp"
          imageAlt="Natural linen fabric, wood and greenery — Makimoo sustainable materials"
          tone="cream"
        />
      </div>

      {/* CTA（2026-09-30：品类口径从靠垫改为家纺全品类） */}
      <section className="bg-off-white py-16 lg:py-24">
        <Reveal>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-charcoal mb-4">
              Ready to Find Your Comfort?
            </h2>
            <p className="text-charcoal-light max-w-xl mx-auto mb-8">
              Explore our collection of bedding, rugs and home comfort essentials — made for every corner of your home.
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
