import { resolveUrl } from '@/lib/paths';
import V2DragScrollRow from '@/components/v2/V2DragScrollRow';

/**
 * /products?cat=pillows 类目页头（2026-10-23 用户定：全站类目统一按 cushions 标准改造）：
 * - 桌面端：hero 通栏 100%，图占满屏幕宽度；标题 + 描述叠在图片左上、白色字体，
 *   图片左侧加窄渐变深色滤镜保证可读（2026-10-23 用户定，全类目统一按 bedding 标准）；
 *   快链导航排在图正下方
 * - 移动端：标题 + 描述在图上方（不叠图），场景图（4:3 容器 = 原图比例完整显示），图下横滚标签快链
 * - 上标数 = 全部 SKU 数（每个颜色×尺寸变体都算一个产品）
 * 快链 = 有产品的形态页（/pillows/pillow-inserts/ 等）+ 填充材质页；Down 无产品标 Coming Soon。
 * 链接清单由 products/page.tsx 按在售产品动态算出后传入。
 * hero 图（2026-10-21 用户定，三轮终版）：双端同用 pdp-lifestyle/pillow-hero-warm.webp——
 * 以二轮灰调床景为参考重绘：床与床上白色枕芯/被芯的颜色、材质、褶皱细节不变，
 * 房间换成本站暖色系（暖米白墙 + 暖灰褐床头），小红书式种草图氛围（SeeAny 生成，
 * scripts/seeany-pillows-hero-black.js，4:3 横板）。
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
      {/* 移动端：文字在图上方（2026-10-23 起全类目标准，不再叠图）+ 图下横滚标签；-mt-3 紧贴顶部导航 */}
      <section className="lg:hidden mb-5" aria-label="Pillows overview">
        <div className="-mx-3 -mt-3">
          <div className="px-4 pt-5 pb-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-charcoal">
              Pillows
              {countSup}
            </h1>
            {intro && (
              <p className="mt-1.5 text-xs leading-relaxed text-charcoal-light max-w-[85%]">
                {intro}
              </p>
            )}
          </div>
          {/* 4:3 容器 = 原图比例，整图完整显示不裁切（2026-10-21 用户定）；
              图从顶部再裁掉 10% 高度（2026-10-23 用户定，全类目统一）：负 margin 上移 + overflow 裁顶 */}
          <div className="overflow-hidden">
            <img
              src={resolveUrl('/images/pdp-lifestyle/pillow-hero-warm.webp')}
              alt="White pillow inserts and a white duvet insert arranged on a bed in a warm cream bedroom"
              className="w-full aspect-[4/3] object-cover object-center -mt-[7.5%]"
            />
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

      {/* 桌面端：图占满屏幕宽度，标题 + 副标题叠在图片左上、白色字体，
          图片左侧加窄渐变深色滤镜保证可读（2026-10-23 用户定，全类目统一按 bedding 标准）；
          快链在图正下方，左缘与标题对齐再内缩一点（ml-2） */}
      <section className="hidden lg:block mb-10" aria-label="Pillows overview">
        <div className="-mx-10 -mt-4">
          <div className="relative">
            {/* 桌面端横带裁剪取床品主体区（object-[center_55%]，沿用 2026-10-21 终版图裁剪位） */}
            <img
              src={resolveUrl('/images/pdp-lifestyle/pillow-hero-warm.webp')}
              alt="White pillow inserts and a white duvet insert arranged on a bed in a warm cream bedroom"
              className="w-full h-[400px] xl:h-[460px] object-cover object-[center_55%]"
            />
            {/* 局部滤镜：只压暗左侧文字区域（比文字稍宽），向右渐隐透明，右侧图片保持原色 */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 18%, rgba(0,0,0,0.15) 28%, transparent 36%)',
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 px-10 pt-10 xl:px-14 xl:pt-12">
              <h1 className="text-6xl font-extrabold tracking-tight text-white">
                Pillows
                <sup className="ml-2 align-super text-base font-semibold text-white/60">
                  {styleCount}
                </sup>
              </h1>
              {intro && (
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85">{intro}</p>
              )}
            </div>
          </div>
          {/* 快链排在图正下方，左缘与标题对齐再内缩一点（ml-2）：形态组 + 竖分隔线 + 填充材质组；
              屏宽不足不换行，单行可拖拽滚动，见 V2DragScrollRow */}
          <V2DragScrollRow
            className="mt-4 ml-2 px-10 xl:px-14 flex flex-nowrap items-center gap-x-7 gap-y-2 text-sm"
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
        </div>
      </section>
    </>
  );
}
