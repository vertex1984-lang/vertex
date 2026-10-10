import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

// 静态 Hero：autumn 场景图扩图版（桌面 16:9 / 移动 9:16 按断点切换）
const heroImage = {
  desktop: '/images/brand/hero-autumn-desktop.webp',
  mobile: '/images/brand/hero-autumn-mobile.webp',
  alt: 'Makimoo cozy autumn bedroom with sage green bedding in warm light',
};

export default function V2Hero() {
  return (
    // 移动端高度用 svh（small viewport height，按浏览器地址栏/工具栏"显示"时的最小可视高计算）：
    // 移动浏览器（Edge/Chrome/Safari）首屏会显示地址栏+工具栏挤压可视高度，滚动后才收起；
    // 用 vh 会按最大可视高计算，首屏内容被挤出屏外。svh 保证两种状态下 Hero 都不溢出（2026-09-28 用户反馈 Edge 实测）。
    <section className="relative h-[90svh] min-h-[440px] lg:h-[87vh] lg:min-h-[560px] overflow-hidden">
      {/* Background（静态单图；2026-10-10 用户定取消 ken-burns 缩放动效）：移动端 9:16、桌面端 16:9 两层按断点切换 */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center lg:hidden scale-105 origin-top"
          style={{ backgroundImage: `url(${resolveUrl(heroImage.mobile)})` }}
          role="img"
          aria-label={heroImage.alt}
        />
        <div
          className="absolute inset-0 hidden bg-cover bg-center lg:block"
          style={{ backgroundImage: `url(${resolveUrl(heroImage.desktop)})` }}
          aria-hidden="true"
        />

        {/* 渐变暗罩：底部深、顶部浅，保证下方 cream 文案可读 */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/25 to-charcoal/10" />
      </div>

      {/* Text content：ins 版只留一行品牌标语 + Shop Beddings 按钮（2026-10-08 用户定恢复按钮）；
          移动端文字位置 pb-[17svh]（10svh 太贴底、26svh 太靠上，2026-10-08 两次用户反馈取中），
          桌面端垂直居中偏下不变 */}
      <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-end pb-[17svh] lg:justify-center lg:pb-0 lg:pt-[12vh] lg:translate-y-[4.6vh]">
        <h1
          className="text-3xl sm:text-4xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-cream max-w-3xl mb-7 animate-fade-in-up"
        >
          Comfort, Woven Into Every Day
        </h1>
        <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <a
            href={v2url('/products/?cat=bedding')}
            className="inline-block px-6 py-2.5 lg:px-7 lg:py-3 rounded-full bg-transparent border-2 border-cream text-cream text-xs lg:text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-cream hover:text-brand hover:shadow-xl"
          >
            Shop Beddings
          </a>
        </div>
      </div>
    </section>
  );
}
