import Reveal from '@/components/Reveal';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

const STAR_PATH = 'M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z';
const ARROW_PATH = 'M5 12h14M13 6l6 6-6 6';

/**
 * V2 首页全宽 Brand Banner
 * 桌面：brand-banner.webp（1456×574 生活场景图）按 1456/500（约 2.9:1）锁定比例全宽展示，
 *        object-cover 从上下裁切（object-position 保持 center，沙发主体完整露出）；
 *        极宽屏高度超 85vh 时进一步从上下裁切；
 * 移动：brand-banner-mobile.webp（900×1200，正好 3:4）aspect-[3/4] 无裁切。
 * 图片本身不含文字，文案与 CTA 以叠加层呈现；整图可点击跳转全部产品。
 * 两张图均带 ken-burns 缓慢缩放动画（与 hero 同款 12s keyframes）；
 * CSS animation 会覆盖 transform，故不再使用 hover 缩放（group-hover:scale-105 与之冲突）。
 */
export default function V2BrandBanner() {
  return (
    <section className="w-full">
      <Reveal>
        {/* 桌面端：锁定 1456/500（约 2.9:1）比例全宽展示，极宽屏超 85vh 时从上下进一步裁切 */}
        <a
          href={v2url('/products/')}
          className="group relative hidden sm:block w-full aspect-[1456/500] max-h-[85vh] overflow-hidden"
        >
          <img
            src={resolveUrl('/images/brand/brand-banner.webp')}
            alt="Makimoo — comfort essentials loved by millions"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 via-charcoal/25 to-transparent pointer-events-none" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-10 lg:px-20 max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-0.5 bg-white/70" />
                <p className="text-white/85 text-sm font-semibold tracking-widest uppercase">
                  Trusted Worldwide
                </p>
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6 drop-shadow-md">
                Comfort Loved<br />by Millions
              </h2>
              <div className="flex items-start gap-8 mb-7">
                <div>
                  <p className="text-2xl lg:text-3xl font-extrabold text-white drop-shadow tabular-nums">1M+</p>
                  <p className="text-white/75 text-xs mt-1 leading-snug">Items sold worldwide<br />every year</p>
                </div>
                <div className="w-px self-stretch bg-white/25" />
                <div>
                  <p className="text-2xl lg:text-3xl font-extrabold text-white drop-shadow tabular-nums">100K+</p>
                  <p className="text-white/75 text-xs mt-1 leading-snug">Customer reviews<br />received</p>
                </div>
                <div className="w-px self-stretch bg-white/25" />
                <div>
                  <p className="text-2xl lg:text-3xl font-extrabold text-white drop-shadow inline-flex items-center gap-1.5 tabular-nums">
                    4.5
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#F5B942" stroke="none"><path d={STAR_PATH} /></svg>
                  </p>
                  <p className="text-white/75 text-xs mt-1 leading-snug">Average rating<br />out of 5 stars</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-base font-semibold text-white bg-brand transition group-hover:bg-brand-dark">
                Explore Our Collections
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={ARROW_PATH} />
                </svg>
              </span>
            </div>
          </div>
        </a>

        {/* 移动端：竖版 3:4（与原图比例一致，无裁切），文字底部排布 */}
        <a
          href={v2url('/products/')}
          className="group relative block sm:hidden w-full aspect-[3/4] overflow-hidden"
        >
          <img
            src={resolveUrl('/images/brand/brand-banner-mobile.webp')}
            alt="Makimoo — comfort essentials loved by millions"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 flex items-end">
            <div className="px-6 pb-8 w-full">
              <p className="text-white/85 text-xs font-semibold tracking-widest uppercase mb-2">
                Trusted Worldwide
              </p>
              <h2 className="text-3xl font-extrabold text-white leading-tight mb-3 drop-shadow-md">
                Comfort Loved by Millions
              </h2>
              <div className="flex items-start gap-5 mb-5">
                <div>
                  <p className="text-2xl font-extrabold text-white drop-shadow tabular-nums">1M+</p>
                  <p className="text-white/75 text-[11px] mt-1 leading-snug">Items sold<br />per year</p>
                </div>
                <div className="w-px self-stretch bg-white/25" />
                <div>
                  <p className="text-2xl font-extrabold text-white drop-shadow tabular-nums">100K+</p>
                  <p className="text-white/75 text-[11px] mt-1 leading-snug">Customer<br />reviews</p>
                </div>
                <div className="w-px self-stretch bg-white/25" />
                <div>
                  <p className="text-2xl font-extrabold text-white drop-shadow inline-flex items-center gap-1 tabular-nums">
                    4.5
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#F5B942" stroke="none"><path d={STAR_PATH} /></svg>
                  </p>
                  <p className="text-white/75 text-[11px] mt-1 leading-snug">Avg. rating<br />of 5 stars</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-brand">
                Explore Our Collections
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={ARROW_PATH} />
                </svg>
              </span>
            </div>
          </div>
        </a>
      </Reveal>
    </section>
  );
}
