import { resolveUrl } from '@/lib/paths';
import V2DragScrollRow from '@/components/v2/V2DragScrollRow';

/**
 * /products?cat=bedding 类目页头（2026-10-16 用户定：参照 Parachute Sheets 页头；当日二轮调整）：
 * - 桌面端：通栏横版场景图（负 margin 顶出父容器打满屏宽），标题 + 描述叠在图上左侧墙面留白区；
 *   图下方一排快链导航（类型组 + 竖分隔线 + 面料组）
 * - 移动端：竖版场景图上部叠标题 + 描述（浅色墙面区用深色字 + 顶部轻微渐变保底可读性），
 *   图下横滚标签快链（类型 + 面料一排横滑）
 * 快链 = 类型子分类（Sheets & Duvet Sets / Duvet Covers / Sheets / Pillow Covers，后两个
 * Coming Soon 灰化；Duvet Cover Sets（3 件套）2026-10-22 下线）+ 有产品的面料页（2026-10-16 用户定）。
 * 链接清单由 products/page.tsx 按家族数据动态算出后传入。
 */

export interface BeddingHeroLink {
  label: string;
  href: string;
  /** 即将上线：渲染为不可点的灰化项 + Coming Soon 标记 */
  soon?: boolean;
}

function HeroLink({ label, href, soon }: BeddingHeroLink) {
  if (soon) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[#999]">
        {label}
        <span className="text-[10px] uppercase tracking-wider border border-warm-gray rounded-full px-1.5 py-px">
          Coming Soon
        </span>
      </span>
    );
  }
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-1 text-charcoal hover:text-brand transition-colors"
    >
      {label}
      <span className="transition-transform group-hover:translate-x-0.5">›</span>
    </a>
  );
}

export default function V2BeddingCatHero({
  styleCount,
  intro,
  typeLinks,
  fabricLinks,
}: {
  styleCount: number;
  intro: string;
  typeLinks: BeddingHeroLink[];
  fabricLinks: BeddingHeroLink[];
}) {
  const countSup = (
    <sup className="ml-1 lg:ml-2 align-super text-xs lg:text-base font-semibold text-[#999]">
      {styleCount}
    </sup>
  );
  return (
    <>
      {/* 移动端：竖版场景图（裁剪偏下多展示床，2026-10-16 用户定）+ 图上叠标题/描述 + 图下横滚标签。
          -mt-3 顶掉父容器 pt-3，hero 紧贴上方导航栏（2026-10-16 用户定） */}
      <section className="lg:hidden mb-5" aria-label="Bedding overview">
        <div className="relative -mx-3 -mt-3">
          <img
            src={resolveUrl('/images/bedding/hero-mobile.webp')}
            alt="Sunlit bedroom with neutral layered bedding"
            className="w-full aspect-[4/3] object-cover object-[center_62%]"
          />
          {/* 图上部墙面/枕头的浅色区叠深色字 + 顶部轻微渐变保底可读性；字体加大、位置下移（2026-10-16 用户定） */}
          <div className="absolute inset-x-0 top-0 px-4 pt-10 pb-4 bg-gradient-to-b from-[#f3ecdf]/70 via-[#f3ecdf]/20 to-transparent">
            <h1 className="text-3xl font-extrabold tracking-tight text-charcoal">
              Bedding
              {countSup}
            </h1>
            {intro && (
              <p className="mt-1.5 text-xs leading-relaxed text-charcoal-light max-w-[85%]">
                {intro}
              </p>
            )}
          </div>
        </div>
        {/* 快链：横滚标签行，类型 + 面料一排横滑；Coming Soon 为虚线灰化不可点 */}
        <nav
          className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Bedding categories"
        >
          {[...typeLinks, ...fabricLinks].map((l) =>
            l.soon ? (
              <span
                key={l.label}
                className="flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full border border-dashed border-warm-gray text-xs text-[#999]"
              >
                {l.label} · Soon
              </span>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full border border-warm-gray text-xs text-charcoal hover:border-brand hover:text-brand transition-colors"
              >
                {l.label}
              </a>
            )
          )}
        </nav>
      </section>

      {/* 桌面端：通栏横版 hero（-mx-10 打满屏宽、-mt-4 紧贴顶部导航，2026-10-16 用户定）+ 图下导航排 */}
      <section className="hidden lg:block mb-10" aria-label="Bedding overview">
        <div className="relative -mx-10 -mt-4">
          <img
            src={resolveUrl('/images/bedding/hero-desktop.webp')}
            alt="Sunlit bedroom with neutral layered bedding"
            className="w-full h-[400px] xl:h-[460px] object-cover"
          />
          {/* 图左上是浅色墙面留白：深色字直接叠，无需遮罩；文字靠上排（justify-start + pt，2026-10-16 用户定） */}
          <div className="absolute inset-0 flex flex-col justify-start pt-10 xl:pt-14 px-10">
            <h1 className="text-6xl font-extrabold tracking-tight text-charcoal">
              Bedding
              {countSup}
            </h1>
            {intro && (
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-charcoal-light">{intro}</p>
            )}
          </div>
        </div>
        {/* 导航排：类型组 + 竖分隔线 + 面料组（2026-10-16 用户定：只放同级类目 + 面料；
            2026-10-20 用户定：屏宽不足不换行，单行可拖拽滚动，见 V2DragScrollRow） */}
        <V2DragScrollRow
          className="mt-5 flex flex-nowrap items-center gap-x-7 gap-y-2 text-sm"
          ariaLabel="Bedding categories"
        >
          {typeLinks.map((l) => (
            <HeroLink key={l.label} {...l} />
          ))}
          {fabricLinks.length > 0 && (
            <span className="h-4 w-px bg-warm-gray" aria-hidden="true" />
          )}
          {fabricLinks.map((l) => (
            <HeroLink key={l.href} {...l} />
          ))}
        </V2DragScrollRow>
      </section>
    </>
  );
}
