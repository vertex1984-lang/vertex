import { resolveUrl } from '@/lib/paths';

export default function AboutPage() {
  return (
    <div className="px-6 lg:px-10 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#8B5A2B] mb-2">Our Story</p>
          <h1 className="text-3xl lg:text-5xl font-extrabold text-[#333] mb-4">The Makimoo Story</h1>
          <p className="text-lg text-[#555] max-w-2xl mx-auto">
            Born from a love of simple living and genuine comfort, Makimoo brings warmth to every corner of your home.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <img
              src={resolveUrl('/images/about/about-story.webp')}
              alt="Makimoo Story"
              className="w-full rounded-2xl shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#333] mb-4">Why We Exist</h2>
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

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: '💛',
              title: 'Heart-Centered',
              desc: 'We design every product as if it were for our own home.',
            },
            {
              icon: '🌿',
              title: 'Sustainably Made',
              desc: 'Eco-friendly materials and responsible manufacturing.',
            },
            {
              icon: '✨',
              title: 'Quality First',
              desc: 'Premium fabrics and durable construction that lasts.',
            },
          ].map((item) => (
            <div key={item.title} className="text-center p-6 rounded-xl bg-white shadow-sm">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold text-[#333] mb-2">{item.title}</h3>
              <p className="text-sm text-[#555]">{item.desc}</p>
            </div>
          ))}
        </div>

        <div id="quality" className="mb-16">
          <h2 className="text-2xl font-bold text-[#333] mb-6 text-center">Our Quality Promise</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <ul className="space-y-4">
              {[
                'High-density compressed poly-fiber fill for lasting plumpness',
                'Premium outdoor polyester fabric with UV-fade resistance',
                'Water-repellent surface for easy outdoor care',
                'Reinforced canvas ties for secure placement',
                'Spot clean & air dry — hassle-free maintenance',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#8B5A2B] font-bold text-lg">✓</span>
                  <span className="text-[#555]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div id="sustainability">
          <h2 className="text-2xl font-bold text-[#333] mb-6 text-center">Sustainability</h2>
          <p className="text-[#555] leading-relaxed text-center max-w-2xl mx-auto">
            We&apos;re committed to reducing our environmental footprint. From sustainable sourcing to minimal packaging,
            every decision we make considers the impact on our planet. Because a comfortable home shouldn&apos;t come
            at the cost of the Earth.
          </p>
        </div>
      </div>
    </div>
  );
}
