import { resolveUrl } from '@/lib/paths';
import V2DragScrollRow from '@/components/v2/V2DragScrollRow';

/**
 * /products?cat=cushions 类目页头（2026-10-18 用户定：按 bedding 类目页结构重建，见 V2BeddingCatHero）：
 * - 桌面端：hero 通栏 100%，图占满屏幕宽度；标题 + 描述叠在图片左上、白色字体，
 *   图片左侧加窄渐变深色滤镜保证可读（2026-10-23 用户定，全类目统一按 bedding 标准）；
 *   快链导航排在图正下方（单分类：Outdoor Cushions → /cushions/outdoor-cushions/）
 * - 移动端：标题 + 描述在图上方（2026-10-23 用户定，不再叠图），场景图（4:3 裁剪）居中，图下横滚标签快链
 * - 上标数 = 全部 SKU 数（每个颜色×尺寸变体都算一个产品，2026-10-18 用户定）
 * hero 图：双端同用 pdp-lifestyle/cushion-lifestyle-florist.webp（明亮花店橱窗 + 椅垫），
 * 桌面端取上部橱窗亮区（深色字直接叠），移动端取中部椅垫区。
 */

export interface CushionsHeroLink {
  label: string;
  href: string;
  /** 即将上线：渲染为不可点的灰化项 + Coming Soon 标记 */
  soon?: boolean;
}

function HeroLink({ label, href, soon }: CushionsHeroLink) {
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

export default function V2CushionsCatHero({
  styleCount,
  intro,
  typeLinks,
}: {
  styleCount: number;
  intro: string;
  typeLinks: CushionsHeroLink[];
}) {
  const countSup = (
    <sup className="ml-1 lg:ml-2 align-super text-xs lg:text-base font-semibold text-[#999]">
      {styleCount}
    </sup>
  );
  return (
    <>
      {/* 移动端：竖版场景图上叠标题/描述 + 图下横滚标签；-mt-3 紧贴顶部导航（同 bedding，2026-10-16 用户定） */}
      <section className="lg:hidden mb-5" aria-label="Cushions overview">
        <div className="-mx-3 -mt-3">
          {/* 文字在图上方（2026-10-23 用户定：花店图太花，叠字看不清） */}
          <div className="px-4 pt-5 pb-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-charcoal">
              Cushions
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
              src={resolveUrl('/images/pdp-lifestyle/cushion-lifestyle-florist.webp')}
              alt="Tufted chair cushion on a wooden chair in a bright florist shop"
              className="w-full aspect-[4/3] object-cover object-[center_58%] -mt-[7.5%]"
            />
          </div>
        </div>
        {/* 快链：横滚标签行；Coming Soon 为虚线灰化不可点 */}
        <nav
          className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Cushion categories"
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
      <section className="hidden lg:block mb-10" aria-label="Cushions overview">
        <div className="-mx-10 -mt-4">
          <div className="relative">
            <img
              src={resolveUrl('/images/pdp-lifestyle/cushion-lifestyle-florist.webp')}
              alt="Tufted chair cushion on a wooden chair in a bright florist shop"
              className="w-full h-[400px] xl:h-[460px] object-cover object-[center_26%]"
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
            <div className="absolute inset-0 px-10 pt-10 xl:pt-12">
              <h1 className="text-6xl font-extrabold tracking-tight text-white">
                Cushions
                <sup className="ml-2 align-super text-base font-semibold text-white/60">
                  {styleCount}
                </sup>
              </h1>
              {intro && (
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85">{intro}</p>
              )}
            </div>
          </div>
          {/* 快链排在图正下方，左缘与标题对齐再内缩一点（ml-2）；
              屏宽不足不换行，单行可拖拽滚动，见 V2DragScrollRow */}
          <V2DragScrollRow
            className="mt-4 ml-2 px-10 flex flex-nowrap items-center gap-x-7 gap-y-2 text-sm"
            ariaLabel="Cushion categories"
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
