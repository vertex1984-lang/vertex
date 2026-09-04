import Reveal from '@/components/Reveal';
import { v2url } from '@/lib/v2paths';

const STAR_PATH = 'M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z';

const STATS = [
  { value: '1M+', label: 'Items sold worldwide every year' },
  { value: '100K+', label: 'Customer reviews received' },
  { value: '4.5', label: 'Average rating out of 5 stars', star: true },
];

/**
 * V2 首页信任数据区块（原 banner 叠加文案的排版版）
 * cream 色带打满屏幕宽度（无圆角、无阴影、两侧无缝隙），内容块居中、内部左对齐；纯文字。
 * 移动端保持同一结构（数据横向一排 + 分隔线，字号缩小，不堆叠）。
 */
export default function V2TrustStats() {
  return (
    <section className="bg-off-white py-10 lg:py-16">
      <Reveal>
        <div className="bg-cream px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
          {/* 内容块整体水平居中，内部保持左对齐结构 */}
          <div className="w-fit mx-auto text-left">
          <div className="flex items-center gap-3 mb-3 lg:mb-4">
            <span className="w-8 lg:w-10 h-0.5 bg-brand" />
            <p className="text-[11px] lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand">
              Trusted Worldwide
            </p>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight text-charcoal mb-8 lg:mb-14">
            Comfort Loved by Millions
          </h2>
          {/* 数据一排展示（移动端同结构，字号缩小）；从第二项起带分隔线 */}
          <div className="flex items-stretch mb-8 lg:mb-12">
            {STATS.map((stat, i) => (
              <div
                key={stat.value}
                className={i === 0 ? 'pr-4 sm:pr-8 lg:pr-12' : 'px-4 sm:px-8 lg:px-12 border-l border-warm-gray'}
              >
                <p className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal tabular-nums inline-flex items-center gap-1.5 lg:gap-2">
                  {stat.value}
                  {stat.star && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#F5B942" stroke="none" aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-[26px] lg:h-[26px]">
                      <path d={STAR_PATH} />
                    </svg>
                  )}
                </p>
                <p className="text-[11px] sm:text-sm text-charcoal-light mt-1.5 lg:mt-2 max-w-[110px] sm:max-w-[180px] leading-snug">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <a
            href={v2url('/products/')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand tracking-wide hover:underline underline-offset-4"
          >
            Explore Our Collections
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
