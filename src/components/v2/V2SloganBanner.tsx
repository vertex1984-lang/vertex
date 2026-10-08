import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/**
 * V2SloganBanner —— ins 版（2026-10-08 测试副本）：替代原 V2TrustBanner 双卡长文案。
 * 一张全宽品牌氛围大图（复用 about 页头的 trust-living.webp）+ 一句 slogan，
 * 整图可点进 /about/ 品牌故事页。
 */
export default function V2SloganBanner() {
  return (
    <section className="pt-2 lg:pt-4 pb-10 lg:pb-12">
      <a
        href={v2url('/about/')}
        className="group relative block w-full overflow-hidden aspect-[4/3] lg:aspect-[21/9]"
      >
        <img
          src={resolveUrl('/images/brand/trust-living.webp')}
          alt="Makimoo warm and cozy living room"
          loading="lazy"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-charcoal/10 to-transparent" />
        <p className="absolute bottom-5 left-4 lg:bottom-10 lg:left-10 text-cream text-xl lg:text-4xl font-extrabold tracking-tight">
          A warmer, softer home.
        </p>
      </a>
    </section>
  );
}
