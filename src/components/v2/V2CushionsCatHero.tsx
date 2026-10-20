import { resolveUrl } from '@/lib/paths';
import V2DragScrollRow from '@/components/v2/V2DragScrollRow';

/**
 * /products?cat=cushions 类目页头（2026-10-18 用户定：按 bedding 类目页结构重建，见 V2BeddingCatHero）：
 * - 桌面端：通栏横版场景图（-mx-10 打满屏宽、-mt-4 紧贴顶部导航），标题 + 描述叠在图上左侧；
 *   图下方一排快链导航（风格组：Corduroy / Solids / Prints → /cushions/[slug]/）
 * - 移动端：场景图（4:3 裁剪）上叠标题 + 描述，图下横滚标签快链
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
        <div className="relative -mx-3 -mt-3">
          <img
            src={resolveUrl('/images/pdp-lifestyle/cushion-lifestyle-florist.webp')}
            alt="Tufted chair cushion on a wooden chair in a bright florist shop"
            className="w-full aspect-[4/3] object-cover object-[center_58%]"
          />
          {/* 图上部亮区叠深色字 + 顶部轻微渐变保底可读性（同 bedding 移动端） */}
          <div className="absolute inset-x-0 top-0 px-4 pt-10 pb-4 bg-gradient-to-b from-[#f3ecdf]/70 via-[#f3ecdf]/20 to-transparent">
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

      {/* 桌面端：通栏横版 hero + 图下导航排（同 bedding） */}
      <section className="hidden lg:block mb-10" aria-label="Cushions overview">
        <div className="relative -mx-10 -mt-4">
          <img
            src={resolveUrl('/images/pdp-lifestyle/cushion-lifestyle-florist.webp')}
            alt="Tufted chair cushion on a wooden chair in a bright florist shop"
            className="w-full h-[400px] xl:h-[460px] object-cover object-[center_26%]"
          />
          {/* 图左上为明亮橱窗区：深色字直接叠；轻微渐变保底可读性（ florist 图比 bedding 墙面略花，加罩） */}
          <div className="absolute inset-0 flex flex-col justify-start pt-10 xl:pt-14 px-10 bg-gradient-to-b from-[#f3ecdf]/60 via-[#f3ecdf]/15 to-transparent">
            <h1 className="text-6xl font-extrabold tracking-tight text-charcoal">
              Cushions
              {countSup}
            </h1>
            {intro && (
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-charcoal-light">{intro}</p>
            )}
          </div>
        </div>
        {/* 导航排：风格组（corduroy / solids / prints → /cushions/[slug]/；
            2026-10-20 用户定：屏宽不足不换行，单行可拖拽滚动，见 V2DragScrollRow） */}
        <V2DragScrollRow
          className="mt-5 flex flex-nowrap items-center gap-x-7 gap-y-2 text-sm"
          ariaLabel="Cushion categories"
        >
          {typeLinks.map((l) => (
            <HeroLink key={l.label} {...l} />
          ))}
        </V2DragScrollRow>
      </section>
    </>
  );
}
