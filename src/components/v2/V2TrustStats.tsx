import Reveal from '@/components/Reveal';
import { v2url } from '@/lib/v2paths';

const STAR_PATH = 'M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z';

const STATS = [
  { value: '1M+', label: 'Items sold worldwide every year' },
  { value: '100K+', label: 'Customer reviews received' },
  { value: '4.5', label: 'Average rating out of 5 stars', star: true },
];

/**
 * V2 首页信任数据纯文字区块（原 banner 叠加文案的排版版）
 * 左对齐排版，放在 MADE RESPONSIBLY（StorySplit）区域之前；无图片，纯文字。
 */
export default function V2TrustStats() {
  return (
    <section className="bg-off-white py-16 lg:py-24">
      <Reveal>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-0.5 bg-brand" />
            <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand">
              Trusted Worldwide
            </p>
          </div>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-charcoal mb-10 lg:mb-14 max-w-2xl">
            Comfort Loved by Millions
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-stretch gap-8 sm:gap-0 mb-10 lg:mb-12">
            {STATS.map((stat, i) => (
              <div
                key={stat.value}
                className={i === 0 ? 'sm:pr-12' : 'sm:px-12 sm:border-l sm:border-warm-gray'}
              >
                <p className="text-4xl lg:text-5xl font-extrabold text-charcoal tabular-nums inline-flex items-center gap-2">
                  {stat.value}
                  {stat.star && (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="#F5B942" stroke="none" aria-hidden="true">
                      <path d={STAR_PATH} />
                    </svg>
                  )}
                </p>
                <p className="text-sm text-charcoal-light mt-2 max-w-[180px]">{stat.label}</p>
              </div>
            ))}
          </div>
          <a
            href={v2url('/products/')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand tracking-wide hover:underline underline-offset-4"
          >
            Explore Our Collections
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
