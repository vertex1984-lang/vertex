import { resolveUrl } from '@/lib/paths';
import V2DragScrollRow from '@/components/v2/V2DragScrollRow';

/**
 * /products?cat=bedding 类目页头（2026-10-23 用户定：全站类目统一按 cushions 标准改造）：
 * - 桌面端：hero 通栏 100%，图占满屏幕宽度；标题 + 描述叠在图片左上、白色字体，
 *   图片左侧（比文字稍宽的区域）加左深右透的渐变滤镜保证可读（2026-10-23 用户定，先试行 bedding）；
 *   快链导航排在图正下方、左缘对齐标题再内缩一点（ml-2）
 * - 移动端：标题 + 描述在图上方（不叠图），场景图（4:3 裁剪）居中，图下横滚标签快链
 * - 上标数 = 全部 SKU 数（每个颜色×尺寸变体都算一个产品）
 * 快链 = 类型子分类（Sheets & Duvet Sets（2026-10-26 曾短暂改名 Complete Sets，同日改回）/ Duvet Covers /
 * Fitted Sheets / Pillowcases & Shams（同日由 Pillow Covers 改名），无产品的不出快链；
 * Duvet Cover Sets（3 件套）2026-10-22 下线）+ 有产品的面料页（2026-10-16 用户定）。
 * 链接清单由 products/page.tsx 按家族数据动态算出后传入。
 * hero 图：桌面端 bedding/hero-desktop.webp、移动端 bedding/hero-mobile.webp
 * （2026-10-27 用户定换 editorial-A 侘寂微水泥 loft 图；原图备份为 hero-*-prev.webp）。
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
    <sup className="ml-1 lg:ml-2 align-super text-xs lg:text-base font-semibold text-white/60">
      {styleCount}
    </sup>
  );
  return (
    <>
      {/* 移动端：2026-10-27 用户定——hero 图用桌面 A 图的床体局部 4:3 裁剪（构图见用户参考图），
          标题 + 描述叠到图上左上角（原「文字在图上方」布局废弃）；图下横滚标签不变；
          -mt-3 顶掉父容器 pt-3，hero 紧贴上方导航栏 */}
      <section className="lg:hidden mb-5" aria-label="Bedding overview">
        <div className="-mx-3 -mt-3 relative">
          <div className="overflow-hidden">
            <img
              src={resolveUrl('/images/bedding/hero-mobile.webp')}
              alt="Wabi-sabi microcement loft bedroom with low platform bed and arches"
              className="w-full aspect-[4/3] object-cover object-center"
            />
          </div>
          {/* 文字叠图左上角：2026-10-27 用户定改白色（与桌面端一致） */}
          <div className="absolute top-0 left-0 px-4 pt-5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Bedding
              {countSup}
            </h1>
            {intro && (
              <p className="mt-1.5 text-xs leading-relaxed text-white/85 whitespace-nowrap">
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

      {/* 桌面端：图占满屏幕宽度，标题 + 副标题叠在图片左上、白色字体，
          图片加深色滤镜保证文字可读（2026-10-23 用户定，先试行 bedding）；
          快链在图正下方，左缘与标题对齐再内缩一点（ml-2） */}
      <section className="hidden lg:block mb-10" aria-label="Bedding overview">
        <div className="-mx-10 -mt-4">
          <div className="relative">
            <img
              src={resolveUrl('/images/bedding/hero-desktop.webp')}
              alt="Wabi-sabi microcement loft bedroom with low platform bed and arches"
              className="w-full h-[400px] xl:h-[460px] object-cover object-[center_70%]"
            />
            {/* 左侧渐变滤镜 2026-10-27 用户定去除（A 图左墙本身偏亮，若白字不清再议） */}
            <div className="absolute inset-0 px-10 pt-10 xl:pt-12">
              <h1 className="text-6xl font-extrabold tracking-tight text-white">
                Bedding
                <sup className="ml-2 align-super text-base font-semibold text-white/60">
                  {styleCount}
                </sup>
              </h1>
              {intro && (
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85">{intro}</p>
              )}
            </div>
          </div>
          {/* 快链排在图正下方：类型组 + 竖分隔线 + 面料组；
              屏宽不足不换行，单行可拖拽滚动，见 V2DragScrollRow */}
          <V2DragScrollRow
            className="mt-4 ml-2 px-10 flex flex-nowrap items-center gap-x-7 gap-y-2 text-sm"
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
        </div>
      </section>
    </>
  );
}
