import { resolveUrl } from '@/lib/paths';
import V2DragScrollRow from '@/components/v2/V2DragScrollRow';

/**
 * /products?cat=blankets 类目页头（2026-10-23 用户定：全站类目统一按 cushions 标准改造）：
 * - 桌面端：hero 通栏 100%，图占满屏幕宽度；标题 + 描述叠在图片左上、白色字体，
 *   图片左侧加窄渐变深色滤镜保证可读（2026-10-23 用户定，全类目统一按 bedding 标准）；
 *   快链导航排在图正下方
 * - 移动端：标题 + 描述在图上方（不叠图），场景图（4:3 裁剪）居中，图下横滚标签快链
 * - 上标数 = 全部 SKU 数（每个颜色×尺寸变体都算一个产品，2026-10-18 起全类目共通口径）
 * blankets 无二级页（同 towels），快链 = 页内锚点（分区 id = BLANKET_SECTIONS.key，见 V2BlanketsShop）
 * hero 图：双端同用 pdp-lifestyle/blankets-hero-sofa.webp（暖调客厅 + 米色沙发 + 奶白针织毯，
 * SeeAny 生成，scripts/seeany-blankets-hero.js；沿用原图与裁剪位）
 */

export interface BlanketsHeroLink {
  label: string;
  href: string;
  /** 即将上线：渲染为不可点的灰化项 + Coming Soon 标记 */
  soon?: boolean;
}

function HeroLink({ label, href, soon }: BlanketsHeroLink) {
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

export default function V2BlanketsCatHero({
  styleCount,
  intro,
  typeLinks,
}: {
  styleCount: number;
  intro: string;
  typeLinks: BlanketsHeroLink[];
}) {
  const countSup = (
    <sup className="ml-1 lg:ml-2 align-super text-xs lg:text-base font-semibold text-[#999]">
      {styleCount}
    </sup>
  );
  return (
    <>
      {/* 移动端：文字在图上方（2026-10-23 起全类目标准，不再叠图）+ 图下横滚标签；-mt-3 紧贴顶部导航 */}
      <section className="lg:hidden mb-5" aria-label="Blankets overview">
        <div className="-mx-3 -mt-3">
          <div className="px-4 pt-5 pb-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-charcoal">
              Blankets
              {countSup}
            </h1>
            {intro && (
              <p className="mt-1.5 text-xs leading-relaxed text-charcoal-light max-w-[85%]">
                {intro}
              </p>
            )}
          </div>
          {/* 图从顶部再裁掉 10% 高度（2026-10-23 用户定，全类目统一）：负 margin 上移 + overflow 裁顶 */}
          <div className="overflow-hidden">
            <img
              src={resolveUrl('/images/pdp-lifestyle/blankets-hero-sofa.webp')}
              alt="Cream knit throw blanket draped over a beige sofa in a warm sunlit living room"
              className="w-full aspect-[4/3] object-cover object-[60%_center] -mt-[7.5%]"
            />
          </div>
        </div>
        {/* 快链：横滚标签行 */}
        <nav
          className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Blanket categories"
        >
          {typeLinks.map((l) =>
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
      <section className="hidden lg:block mb-10" aria-label="Blankets overview">
        <div className="-mx-10 -mt-4">
          <div className="relative">
            <img
              src={resolveUrl('/images/pdp-lifestyle/blankets-hero-sofa.webp')}
              alt="Cream knit throw blanket draped over a beige sofa in a warm sunlit living room"
              className="w-full h-[400px] xl:h-[460px] object-cover object-[center_78%]"
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
                Blankets
                <sup className="ml-2 align-super text-base font-semibold text-white/60">
                  {styleCount}
                </sup>
              </h1>
              {intro && (
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85">{intro}</p>
              )}
            </div>
          </div>
          {/* 快链排在图正下方，左缘与标题对齐再内缩一点（ml-2）：系列分区（页内锚点 → 各 Throws 分区）；
              屏宽不足不换行，单行可拖拽滚动，见 V2DragScrollRow */}
          <V2DragScrollRow
            className="mt-4 ml-2 px-10 xl:px-14 flex flex-nowrap items-center gap-x-7 gap-y-2 text-sm"
            ariaLabel="Blanket categories"
          >
            {typeLinks.map((l) => (
              <HeroLink key={l.label} {...l} />
            ))}
          </V2DragScrollRow>
        </div>
      </section>
    </>
  );
}
