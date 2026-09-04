import Reveal from '@/components/Reveal';

// 占位评价（与旧 ReviewsSection 同源，待真实评价数据接入后替换）
const QUOTES = [
  {
    body: 'The cushions are thick, the fabric feels premium, and they have survived two rainstorms without fading. Could not be happier.',
    author: 'Sarah M.',
    product: 'Outdoor Dining Chair Cushions',
  },
  {
    body: 'My wooden chairs went from torture devices to the most comfortable seats in the house. The colors match the photos exactly.',
    author: 'Olivia T.',
    product: 'Dining Chair Cushions',
  },
  {
    body: 'You can tell these were designed with care. The ties are sturdy and the fabric is soft but durable. Will buy again.',
    author: 'Daniel K.',
    product: 'Chair Cushions',
  },
];

export default function PressBar() {
  return (
    <section className="bg-brand text-cream py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <Reveal>
          <p className="text-center text-xs lg:text-sm font-semibold tracking-[0.3em] uppercase text-cream/70 mb-12 lg:mb-16">
            Loved by Homes Everywhere
          </p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-12 lg:gap-14">
          {QUOTES.map((q, i) => (
            <Reveal key={q.author} delay={i * 100}>
              <figure className="text-center">
                <span aria-hidden="true" className="block text-6xl leading-none text-cream/40 font-serif mb-4">
                  &ldquo;
                </span>
                <blockquote className="text-sm lg:text-base leading-relaxed tracking-wide text-cream/90 mb-5">
                  {q.body}
                </blockquote>
                <figcaption className="text-xs font-semibold tracking-[0.2em] uppercase text-cream/70">
                  {q.author}
                  <span className="block mt-1 font-normal normal-case tracking-wide text-cream/50">
                    {q.product}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
