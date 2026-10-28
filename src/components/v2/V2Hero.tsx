import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

// 静态 Hero：editorial-B「落地窗薄雾山野」（2026-10-27 用户定转正；sunday/autumn 版文件保留未删）
// mobileSrc/desktopSrc：/hero-test/N 副本页传入覆盖图（2026-10-28）；正式首页不传，用默认图
export default function V2Hero({ mobileSrc, desktopSrc, mobileBottom150 }: { mobileSrc?: string; desktopSrc?: string; mobileBottom150?: boolean } = {}) {
  const heroImage = {
    desktop: desktopSrc ?? '/images/brand/hero-mist-desktop.webp',
    mobile: mobileSrc ?? '/images/brand/hero-mist2-mobile.webp', // 2026-10-28 用户定：正式版移动端换 hero-editorial-b-desktop(1)（626x1090）
    alt: 'Makimoo bed floating in soft morning mist by a floor-to-ceiling window with mountain view',
  };
  return (
    // 移动端高度用 aspect-ratio（2026-10-28 用户定：以后移动端 hero 都用比例，当前 0.5625=图片原比例，零裁剪）；桌面端仍 lg:h-[87vh]。历史备注：曾用 svh（small viewport height，按浏览器地址栏/工具栏"显示"时的最小可视高计算）：
    // 移动浏览器（Edge/Chrome/Safari）首屏会显示地址栏+工具栏挤压可视高度，滚动后才收起；
    // 用 vh 会按最大可视高计算，首屏内容被挤出屏外。svh 保证两种状态下 Hero 都不溢出（2026-09-28 用户反馈 Edge 实测）。
    // bg-[#cfc0a8]：图片解码完成前的暖色垫层（hero 图墙面色调）——sticky 结构下 hero 顶部紧贴
    // 公告条下沿，无垫层时加载中会透出身后米色、形成一道"缝隙"（2026-10-12 用户反馈）
    <section className="relative aspect-[1152/2048] lg:aspect-auto lg:h-[87vh] lg:min-h-[560px] overflow-hidden bg-[#cfc0a8]">
      {/* Background（静态单图；2026-10-10 用户定取消 ken-burns 缩放动效）：移动端 9:16、桌面端 16:9 两层按断点切换 */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-top lg:hidden"
          style={{ backgroundImage: `url(${resolveUrl(heroImage.mobile)})` }}
          role="img"
          aria-label={heroImage.alt}
        />
        <div
          className="absolute inset-0 hidden bg-cover bg-center lg:block"
          style={{ backgroundImage: `url(${resolveUrl(heroImage.desktop)})` }}
          aria-hidden="true"
        />

      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-28 lg:h-32 bg-gradient-to-b from-black/45 to-transparent pointer-events-none" />
      </div>

      {/* Text content：移动端 justify-center + pb-[calc(9svh+90px)]；
          桌面端 2026-10-27 用户定：锚定视口左侧 lg:px-[7vw]（废弃 max-w-1400 居中 + min() 抵消方案——
          不同分辨率下位置乱跳，窄屏甚至反向右移）；字号流式 clamp 随分辨率缩放；底部 justify-end + 上移 calc(70px+7%)；移动端统一上移 7%（2026-10-28 用户定） */}
      <div className={`relative z-10 h-full max-w-[1400px] mx-auto px-6 flex flex-col ${mobileBottom150 ? 'justify-end pb-[150px]' : 'justify-end pb-[16%] -translate-y-[7%]'} lg:max-w-none lg:px-[7vw] lg:-translate-y-[calc(70px+7%)] lg:justify-end lg:pb-[8vh]`}>
        <h1
          className="text-[32px] lg:text-[50px] lg:leading-[1.05] font-extrabold tracking-tight leading-[1.05] text-cream max-w-3xl mb-[18px] lg:mb-7 animate-fade-in-up"
        >
          Rest, Naturally
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
