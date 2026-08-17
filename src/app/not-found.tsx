import type { Metadata } from 'next';
import { resolveUrl } from '@/lib/paths';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="px-6 lg:px-10 py-24 text-center">
      <p className="text-sm font-semibold tracking-widest uppercase text-brand mb-3">404</p>
      <h1 className="text-4xl lg:text-6xl font-extrabold text-charcoal mb-4">Page Not Found</h1>
      <p className="text-base text-charcoal-light max-w-md mx-auto mb-8">
        Looks like this page wandered off. Let&apos;s get you back to comfort.
      </p>
      <a
        href={resolveUrl('/')}
        className="inline-block px-7 py-3 rounded-full text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
        style={{ backgroundColor: '#8B5A2B' }}
      >
        Back to Home
      </a>
    </div>
  );
}
