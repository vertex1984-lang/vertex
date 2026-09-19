import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

// 静态 Hero：仅保留第 3 张图（原轮播、触摸滑动、dots 已移除）
const heroImage = {
  src: '/images/brand/hero-bg-3.webp',
  alt: 'Makimoo home textiles in natural light',
};

export default function V2Hero() {
  return (
    <section className="relative h-[68vh] min-h-[440px] lg:h-[92vh] lg:min-h-[560px] overflow-hidden">
      {/* Background（ken-burns 缓慢缩放，静态单图） */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 animate-ken-burns bg-cover bg-center"
          style={{ backgroundImage: `url(${resolveUrl(heroImage.src)})` }}
          role="img"
          aria-label={heroImage.alt}
        />

        {/* 渐变暗罩：底部深、顶部浅，保证下方 cream 文案可读 */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/25 to-charcoal/10" />
      </div>

      {/* Text content：垂直居中偏下（为 fixed Header 留出顶部视觉空间） */}
      <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center pt-[6vh] lg:pt-[12vh] translate-y-[3.5vh] lg:translate-y-[4.6vh]">
        <p
          className="text-xs lg:text-sm font-semibold tracking-[0.3em] uppercase text-cream/80 mb-4 lg:mb-5 animate-fade-in-up"
          style={{ animationDelay: '0ms' }}
        >
          Makimoo Home
        </p>
        <h1
          className="text-3xl sm:text-4xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-cream max-w-3xl mb-9 animate-fade-in-up"
          style={{ animationDelay: '150ms' }}
        >
          Comfort, Woven Into Every Day
        </h1>
        <div className="animate-fade-in-up" style={{ animationDelay: '450ms' }}>
          <a
            href={v2url('/featured-products/scene/bedroom/')}
            className="inline-block px-6 py-2.5 lg:px-7 lg:py-3 rounded-full bg-transparent border-2 border-cream text-cream text-xs lg:text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-cream hover:text-brand hover:shadow-xl"
          >
            Shop Beddings
          </a>
        </div>
      </div>
    </section>
  );
}
