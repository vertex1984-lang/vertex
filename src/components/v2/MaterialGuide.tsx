import Reveal from '@/components/Reveal';
import { v2url } from '@/lib/v2paths';

// 材质值取自 src/data/product-specs.ts 实际存在的展示字符串，
// URL 参数与 (classic) 产品页筛选一致：cat + material（空格需编码）
const MATERIALS = [
  {
    name: 'Cotton',
    trait: 'Breathable and absorbent, with that hotel-soft hand feel.',
    href: '/products/?cat=towels&material=Cotton',
  },
  {
    name: 'Polyester',
    trait: 'Durable, quick-drying and water-resistant for everyday use.',
    href: '/products/?cat=cushions&material=Polyester',
  },
  {
    name: 'Memory Foam',
    trait: 'Contours to your body and bounces back, night after night.',
    href: '/products/?cat=pillows&material=Memory%20Foam',
  },
  {
    name: 'Hollowfibre',
    trait: 'Airy, fluffy fill that stays plump and keeps its loft.',
    href: '/products/?cat=pillows&material=Hollowfibre',
  },
];

export default function MaterialGuide() {
  return (
    <section className="bg-cream py-16 lg:py-24">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-10 text-center">
        <Reveal>
          <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-3">
            Material Guide
          </p>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-charcoal mb-4">
            What Fabric Is Best for You?
          </h2>
          <p className="text-base text-charcoal-light max-w-2xl mx-auto mb-12 lg:mb-16">
            Every Makimoo piece starts with the material. Here is a quick guide to
            the fabrics and fills we reach for most — and what each one does best.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12 lg:mb-16">
          {MATERIALS.map((m, i) => (
            <Reveal key={m.name} delay={i * 80}>
              <a href={v2url(m.href)} className="group block">
                <h3 className="text-lg lg:text-xl font-bold text-charcoal mb-2 transition-colors group-hover:text-brand">
                  {m.name}
                </h3>
                <p className="text-sm text-charcoal-light leading-relaxed">{m.trait}</p>
                <span className="mt-3 inline-block text-xs font-semibold tracking-widest uppercase text-brand/70 transition-colors group-hover:text-brand">
                  Shop {m.name} →
                </span>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal delay={150}>
          <a
            href={v2url('/products/?cat=cushions&material=Polyester')}
            className="inline-block px-8 py-3.5 rounded-full border-2 border-brand text-brand text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-brand hover:text-cream"
          >
            Shop by Material
          </a>
        </Reveal>
      </div>
    </section>
  );
}
