import Reveal from '@/components/Reveal';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

interface StorySplitProps {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
  /** true = 文案在左、图片在右 */
  reverse?: boolean;
  /** 文案区底色 */
  tone?: 'cream' | 'off-white';
}

// 叙事分屏：移动端堆叠（图上文下）；桌面左右各 50%，min-h-[70vh]
export default function StorySplit({
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaHref,
  image,
  imageAlt,
  reverse = false,
  tone = 'cream',
}: StorySplitProps) {
  const bg = tone === 'cream' ? 'bg-cream' : 'bg-off-white';

  return (
    <section className="grid lg:grid-cols-2 lg:min-h-[70vh]">
      {/* 图片半区：移动端固定比例，桌面撑满半高 */}
      <div className={`relative aspect-[4/3] lg:aspect-auto ${reverse ? 'lg:order-2' : ''}`}>
        <img
          src={resolveUrl(image)}
          alt={imageAlt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      {/* 文案半区 */}
      <div className={`${bg} flex items-center ${reverse ? 'lg:order-1' : ''}`}>
        <Reveal className="w-full">
          <div className="max-w-lg mx-auto px-6 lg:px-14 py-14 lg:py-24">
            <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-4">
              {eyebrow}
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-charcoal mb-5 leading-tight">
              {title}
            </h2>
            <p className="text-base text-charcoal-light leading-relaxed mb-8">{body}</p>
            <a
              href={v2url(ctaHref)}
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-brand group"
            >
              <span className="border-b border-brand/40 pb-0.5 transition-colors group-hover:border-brand">
                {ctaLabel}
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
