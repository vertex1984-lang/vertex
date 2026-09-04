import Reveal from '@/components/Reveal';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

const STAR_PATH = 'M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z';

const STATS = [
  { value: '1M+', label: 'Items sold worldwide every year' },
  { value: '100K+', label: 'Customer reviews received' },
  { value: '4.5', label: 'Average rating out of 5 stars', star: true },
];

// 占位场景图（后续可替换）
const LEFT_IMAGE = { src: '/images/about/about-story.webp', alt: 'Makimoo comfort essentials in a styled home' };
const RIGHT_IMAGE = { src: '/images/about/about-sustainability.webp', alt: 'Natural materials used in Makimoo products' };

/**
 * V2 首页信任数据双图区（参考 Parachute 双图引语版式）
 * 左右两张场景图并排（移动端 4:5 竖版上下堆叠），图上居中叠加文字：
 * 左图：eyebrow "Trusted Worldwide" + 标题 "Comfort Loved by Millions"；
 * 右图：三项数据（1M+ / 100K+ / 4.5★，值大标小）。
 * 图片下方右侧："Explore Our Collections" 超链接（大写描线小字，跳 shop all 页）。
 */
export default function V2TrustStats() {
  return (
    <section className="w-full">
      <Reveal>
        {/* 双图并排，中间留细缝 */}
        <div className="grid lg:grid-cols-2 gap-2 lg:gap-3">
          {/* 左图：品牌信任标题 */}
          <div className="relative aspect-[4/5] sm:aspect-[4/3] overflow-hidden">
            <img
              src={resolveUrl(LEFT_IMAGE.src)}
              alt={LEFT_IMAGE.alt}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-charcoal/35 pointer-events-none" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
              <p className="text-xs lg:text-sm font-semibold tracking-[0.3em] uppercase text-cream/85 mb-4">
                Trusted Worldwide
              </p>
              <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-cream leading-tight max-w-md">
                Comfort Loved by Millions
              </h2>
            </div>
          </div>

          {/* 右图：三项数据 */}
          <div className="relative aspect-[4/5] sm:aspect-[4/3] overflow-hidden">
            <img
              src={resolveUrl(RIGHT_IMAGE.src)}
              alt={RIGHT_IMAGE.alt}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-charcoal/35 pointer-events-none" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 space-y-7 lg:space-y-9">
              {STATS.map((stat) => (
                <div key={stat.value}>
                  <p className="text-3xl lg:text-5xl font-extrabold text-cream tabular-nums inline-flex items-center gap-2">
                    {stat.value}
                    {stat.star && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#F5B942" stroke="none" aria-hidden="true" className="w-5 h-5 lg:w-7 lg:h-7">
                        <path d={STAR_PATH} />
                      </svg>
                    )}
                  </p>
                  <p className="text-xs lg:text-sm text-cream/85 mt-1.5 max-w-[220px] mx-auto leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 图片下方右侧：Explore Our Collections 链接（跳 shop all 页） */}
        <div className="flex justify-end px-6 lg:px-10 py-5 lg:py-6">
          <a
            href={v2url('/products/')}
            className="text-xs lg:text-sm font-semibold tracking-[0.2em] uppercase text-brand underline underline-offset-4 decoration-brand/40 hover:decoration-brand transition-colors"
          >
            Explore Our Collections
          </a>
        </div>
      </Reveal>
    </section>
  );
}
