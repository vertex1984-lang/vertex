import Reveal from '@/components/Reveal';

// hardcode 占位，待真实数据替换（接入 Judge.me / Shopify 评价后换成真实评论）
const REVIEWS = [
  {
    author: 'Sarah M.',
    rating: 5,
    title: 'Exactly what my patio needed',
    body: 'The cushions are thick, the fabric feels premium, and they have survived two rainstorms without fading. Could not be happier.',
    product: 'Outdoor Dining Chair Cushions',
  },
  {
    author: 'James L.',
    rating: 5,
    title: 'Best travel pillow I have owned',
    body: 'Used it on a 10-hour flight and actually slept. The snap buttons keep it in place and the cover washes easily.',
    product: 'Travel Neck Pillow',
  },
  {
    author: 'Emily R.',
    rating: 4,
    title: 'Plump and cozy',
    body: 'The pillow inserts are full and hold their shape well. One star off because shipping took a few days longer than expected.',
    product: 'Throw Pillow Inserts',
  },
  {
    author: 'Daniel K.',
    rating: 5,
    title: 'Quality you can feel',
    body: 'You can tell these were designed with care. The ties are sturdy and the fabric is soft but durable. Will buy again.',
    product: 'Chair Cushions',
  },
  {
    author: 'Olivia T.',
    rating: 5,
    title: 'Transformed my dining chairs',
    body: 'My wooden chairs went from torture devices to the most comfortable seats in the house. The colors match the photos exactly.',
    product: 'Dining Chair Cushions',
  },
  {
    author: 'Michael B.',
    rating: 4,
    title: 'Great value',
    body: 'Solid construction and fair pricing. The 30-day return policy made it an easy decision, but I am keeping them.',
    product: 'Pillow Inserts',
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex text-[#FFB800]" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24"
          fill={i <= rating ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth={i <= rating ? 0 : 1.5}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  // Review JSON-LD（hardcode 占位评价，随真实数据一并替换）
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Makimoo Home Comfort Essentials',
    brand: { '@type': 'Brand', name: 'Makimoo' },
    review: REVIEWS.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      name: r.title,
      reviewBody: r.body,
    })),
  };

  return (
    <section className="px-6 lg:px-10 py-16" style={{ backgroundColor: '#FFF8F0' }}>
      {/* SEO：评论结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-brand mb-2">Reviews</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-charcoal mb-3">Loved by Homes Everywhere</h2>
            <p className="text-base text-charcoal-light">
              Real words from customers who made their homes a little more comfortable.
            </p>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {REVIEWS.map((review) => (
              <div key={review.author} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <Stars rating={review.rating} />
                  <span className="text-xs text-[#999]">{review.product}</span>
                </div>
                <h3 className="text-sm font-bold text-[#333] mb-2">{review.title}</h3>
                <p className="text-sm text-[#555] leading-relaxed flex-1">{review.body}</p>
                <p className="text-xs font-semibold text-[#8B5A2B] mt-4">{review.author}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
