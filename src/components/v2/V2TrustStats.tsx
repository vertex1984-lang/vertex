import Reveal from '@/components/Reveal';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

const STAR_PATH = 'M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z';

const STATS = [
  { value: '1M+', label: 'Items sold worldwide every year' },
  { value: '100K+', label: 'Customer reviews received' },
  { value: '4.5', label: 'Average rating out of 5 stars', star: true },
];

interface V2TrustStatsProps {
  image: string;
  imageAlt: string;
}

/**
 * V2 首页信任数据分屏区（原 StorySplit 位置）
 * 左侧文案：eyebrow（无横线，与全站 eyebrow 样式一致）+ 标题 + 三项数据（带分隔线）+ Best Sellers 链接；
 * 右侧场景图。移动端上下堆叠（图上文下）；桌面左右各 50%，min-h-[70vh]，与 StorySplit 同布局规范。
 */
export default function V2TrustStats({ image, imageAlt }: V2TrustStatsProps) {
  return (
    <section className="grid lg:grid-cols-2 lg:min-h-[70vh]">
      {/* 图片半区：移动端固定比例，桌面撑满半高 */}
      <div className="relative aspect-[4/3] lg:aspect-auto lg:order-2">
        <img
          src={resolveUrl(image)}
          alt={imageAlt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      {/* 文案半区 */}
      <div className="bg-off-white flex items-center lg:order-1">
        <Reveal className="w-full">
          <div className="max-w-lg mx-auto px-6 lg:px-14 py-14 lg:py-24">
            <p className="text-xs lg:text-sm font-semibold tracking-[0.25em] uppercase text-brand mb-4">
              Trusted Worldwide
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-charcoal mb-8 leading-tight">
              Comfort Loved by Millions
            </h2>
            {/* 数据一排展示（移动端同结构，字号缩小）；从第二项起带分隔线 */}
            <div className="flex items-stretch mb-8">
              {STATS.map((stat, i) => (
                <div
                  key={stat.value}
                  className={i === 0 ? 'pr-4 sm:pr-6' : 'px-4 sm:px-6 border-l border-warm-gray'}
                >
                  <p className="text-2xl sm:text-3xl font-extrabold text-charcoal tabular-nums inline-flex items-center gap-1.5">
                    {stat.value}
                    {stat.star && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#F5B942" stroke="none" aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5">
                        <path d={STAR_PATH} />
                      </svg>
                    )}
                  </p>
                  <p className="text-[11px] sm:text-xs text-charcoal-light mt-1.5 max-w-[110px] leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <a
              href={v2url('/best-sellers/')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand tracking-wide hover:underline underline-offset-4"
            >
              Explore Our Best Sellers
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
