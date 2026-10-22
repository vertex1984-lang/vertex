import { resolveUrl } from '@/lib/paths';
import V2DragScrollRow from '@/components/v2/V2DragScrollRow';

/**
 * /products?cat=pillows 类目页头（2026-10-16 用户定：按 bedding 类目页结构重建）：
 * - 桌面端：通栏横版场景图（-mx-10 打满屏宽、-mt-4 紧贴顶部导航），标题 + 描述叠在图上左侧留白区；
 *   图下方一排快链导航（形态组 + 竖分隔线 + 填充材质组）
 * - 移动端：场景图（4:3 裁剪偏上取墙面 + 枕头区）上叠标题 + 描述，图下横滚标签快链
 * 快链 = 有产品的形态页（/pillows/pillow-inserts/ 等）+ 填充材质页；Down 无产品标 Coming Soon。
 * 链接清单由 products/page.tsx 按在售产品动态算出后传入。
 * hero 图（2026-10-21 用户定，三轮终版）：双端同用 pdp-lifestyle/pillow-hero-warm.webp——
 * 以二轮灰调床景为参考重绘：床与床上白色枕芯/被芯的颜色、材质、褶皱细节不变，
 * 房间换成本站暖色系（暖米白墙 + 暖灰褐床头），小红书式种草图氛围（SeeAny 生成，
 * scripts/seeany-pillows-hero-black.js，4:3 横板）；移动端容器即 4:3，整图完整显示不裁切；
 * 桌面端 object-cover 裁上下取床品主体横带。
 * 一轮黑底版 pillow-hero-black.webp、二轮灰调版 pillow-hero-gray.webp 与更早的
 * pillow-lifestyle-tall.webp / pillow-boucle-sofa.webp 均保留磁盘备用。
 */

export interface PillowsHeroLink {
  label: string;
  href: string;
  /** 即将上线：渲染为不可点的灰化项 + Coming Soon 标记 */
  soon?: boolean;
}

function HeroLink({ label, href, soon }: PillowsHeroLink) {
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

export default function V2PillowsCatHero({
  styleCount,
  intro,
  typeLinks,
  fillingLinks,
}: {
  styleCount: number;
  intro: string;
  typeLinks: PillowsHeroLink[];
  fillingLinks: PillowsHeroLink[];
}) {
  const countSup = (
    <sup className="ml-1 lg:ml-2 align-super text-xs lg:text-base font-semibold text-[#999]">
      {styleCount}
    </sup>
  );
  return (
    <>
      {/* 移动端：场景图上叠标题/描述 + 图下横滚标签；-mt-3 紧贴顶部导航（同 bedding，2026-10-16 用户定） */}
      <section className="lg:hidden mb-5" aria-label="Pillows overview">
        <div className="relative -mx-3 -mt-3">
          {/* 移动端：4:3 容器 = 原图比例，整图完整显示不裁切（2026-10-21 用户定）；
              暖调图上部叠白字 + 黑渐变保底可读性 */}
          <img
            src={resolveUrl('/images/pdp-lifestyle/pillow-hero-warm.webp')}
            alt="White pillow inserts and a white duvet insert arranged on a bed in a warm cream bedroom"
            className="w-full aspect-[4/3] object-cover object-center"
          />
          {/* 图上部加深渐变罩 + 白色字保底可读性（2026-10-16 用户定：移动端图加深、文字改白色；字号/位置不变） */}
          <div className="absolute inset-x-0 top-0 px-4 pt-10 pb-4 bg-gradient-to-b from-black/50 via-black/20 to-transparent">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Pillows
              {countSup}
            </h1>
            {intro && (
              <p className="mt-1.5 text-xs leading-relaxed text-white/85 max-w-[85%]">
                {intro}
              </p>
            )}
          </div>
        </div>
        {/* 快链：横滚标签行，形态 + 填充材质一排横滑；Coming Soon 为虚线灰化不可点 */}
        <nav
          className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Pillow categories"
        >
          {[...typeLinks, ...fillingLinks].map((l) =>
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

      {/* 桌面端：通栏横版 hero（-mx-10 打满屏宽、-mt-4 紧贴顶部导航）+ 图下导航排（同 bedding） */}
      <section className="hidden lg:block mb-10" aria-label="Pillows overview">
        <div className="relative -mx-10 -mt-4">
          {/* 桌面端 hero 图 = pillow-hero-warm.webp（2026-10-21 用户定：本站暖色系种草图，
              白色枕芯+被芯不变；横带裁剪取床品主体区，左侧黑渐变罩保底白字可读性） */}
          <img
            src={resolveUrl('/images/pdp-lifestyle/pillow-hero-warm.webp')}
            alt="White pillow inserts and a white duvet insert arranged on a bed in a warm cream bedroom"
            className="w-full h-[400px] xl:h-[460px] object-cover object-[center_55%]"
          />
          {/* 深色罩 + 白色字（2026-10-16 用户定，回到该方案：位置/颜色还原初始，
              左侧黑渐变保底文字可读性；图其余区域保持原色） */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent"
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex flex-col justify-start pt-10 xl:pt-14 px-10">
            <h1 className="text-6xl font-extrabold tracking-tight text-white">
              Pillows
              <sup className="ml-2 align-super text-base font-semibold text-white/70">
                {styleCount}
              </sup>
            </h1>
            {intro && (
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85">{intro}</p>
            )}
          </div>
        </div>
        {/* 导航排：形态组 + 竖分隔线 + 填充材质组（2026-10-20 用户定：屏宽不足不换行，
            单行可拖拽滚动，见 V2DragScrollRow） */}
        <V2DragScrollRow
          className="mt-5 flex flex-nowrap items-center gap-x-7 gap-y-2 text-sm"
          ariaLabel="Pillow categories"
        >
          {typeLinks.map((l) => (
            <HeroLink key={l.label} {...l} />
          ))}
          {fillingLinks.length > 0 && (
            <span className="h-4 w-px bg-warm-gray" aria-hidden="true" />
          )}
          {fillingLinks.map((l) => (
            <HeroLink key={l.label} {...l} />
          ))}
        </V2DragScrollRow>
      </section>
    </>
  );
}
