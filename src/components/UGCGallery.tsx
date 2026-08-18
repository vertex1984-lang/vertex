import Reveal from '@/components/Reveal';
import { resolveUrl } from '@/lib/paths';

// hardcode 占位，待真实数据替换（当前复用 public/ 下现有场景图；后续换成真实买家秀 / Instagram 图）
const UGC_IMAGES = [
  { src: '/images/brand/outdoor-collection.webp', alt: 'Makimoo cushions styled on an outdoor patio' },
  { src: '/images/brand/indoor-collection.webp', alt: 'Makimoo pillows styled in a cozy living room' },
  { src: '/images/brand/holiday-collection.webp', alt: 'Makimoo holiday collection styled at home' },
  { src: '/images/brand/home-fragrance-collection.webp', alt: 'Makimoo home fragrance styled on a shelf' },
  { src: '/images/brand/indoor-collection-2.webp', alt: 'Makimoo cushions styled on a sofa' },
  { src: '/images/brand/outdoor-collection-2.webp', alt: 'Makimoo cushions styled in a garden' },
];

export default function UGCGallery() {
  return (
    <section className="px-6 lg:px-10 py-16">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-brand mb-2">@makimoohome</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-charcoal mb-3">Styled by You</h2>
            <p className="text-base text-charcoal-light">
              See how our community brings Makimoo comfort into their homes.
            </p>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {UGC_IMAGES.map((img) => (
              <div key={img.src} className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-[#F8F5F0] to-[#E8E2DA]">
                <img
                  src={resolveUrl(img.src)}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
