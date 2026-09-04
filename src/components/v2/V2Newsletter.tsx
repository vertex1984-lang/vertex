import Reveal from '@/components/Reveal';
import NewsletterForm from '@/components/NewsletterForm';

export default function V2Newsletter() {
  return (
    <section className="bg-warm-gray py-16 lg:py-24">
      <Reveal>
        <div className="max-w-xl mx-auto px-6 lg:px-10 text-center">
          <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-3">
            Newsletter
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-charcoal mb-3">
            Join the Makimoo Family
          </h2>
          <p className="text-sm lg:text-base text-charcoal-light mb-8">
            New collections, seasonal offers and comfort tips — delivered softly to your inbox.
          </p>
          <div className="flex justify-center">
            <NewsletterForm />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
