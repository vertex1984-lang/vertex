import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/**
 * V2Manifesto —— Drop 模式首页副本的品牌品质叙事位（2026-11-27，/drop-home 试验页专用）。
 * 潮牌 Lookbook 式编辑位：质感大图 + 三行信条（honest materials / in-house design /
 * small batches），链 fabric-guide 落地品质证据。图复用 about 页质感素材 trust-texture。
 */
export default function V2Manifesto() {
  return (
    <section className="pt-2 lg:pt-4 pb-10 lg:pb-12">
      <div className="group relative block w-full overflow-hidden aspect-[4/3] lg:aspect-[21/9]">
        <img
          src={resolveUrl('/images/brand/trust-texture.webp')}
          alt="Close-up of Makimoo woven fabric texture in warm natural tones"
          loading="lazy"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/20 to-transparent" />
        <div className="absolute bottom-5 left-4 right-4 lg:bottom-10 lg:left-10 lg:right-auto lg:max-w-2xl">
          <p className="text-[10px] lg:text-xs font-semibold tracking-[0.3em] uppercase text-cream/80 mb-2 lg:mb-3">
            Our Craft
          </p>
          <p className="text-cream text-xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Honest materials. Designed in-house. Made in small batches.
          </p>
          <p className="mt-2 lg:mt-4 text-xs lg:text-base text-cream/85 leading-relaxed max-w-xl">
            Every print and weave starts in our studio, then goes into a small made-to-order
            batch — never overstocked, never wasted.
          </p>
          <a
            href={v2url('/fabric-guide/')}
            className="mt-3 lg:mt-5 inline-block text-[11px] lg:text-sm font-semibold text-cream border-b border-cream/50 pb-0.5 hover:border-cream transition-colors"
          >
            Explore the fabric guide →
          </a>
        </div>
      </div>
    </section>
  );
}
