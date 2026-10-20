import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';
import { buildSetFamilies, SET_KIND_PAGE_COPY, SET_KIND_SLUGS } from '@/data/bedding-families';
import { BEDDING_FABRICS, fabricBySlug, fabricDisplayName } from '@/data/bedding-fabrics';
import V2FabricShop from '@/components/v2/V2FabricShop';
import V2FabricCrossSell from '@/components/v2/V2FabricCrossSell';
import V2DragScrollRow from '@/components/v2/V2DragScrollRow';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/**
 * Bedding 二级类目 PLP（2026-09，仿 Parachute fabric-led 模型），一个路由两种页型：
 * - 面料页 /bedding/linen/ 等：面料 hero 按 bedding 类目页格式（2026-10-16 用户定：通栏贴顶特写图
 *   + 叠标题/质感短句/故事 + 图下面料导航排）→ 按类型分区网格（无筛选条）
 * - 类型页 /bedding/4-piece-sets/ 等：**无 banner**（2026-09 用户定）；页头按 bedding 类目页标准
 *   （2026-10-16 用户定：无图 hero 只保留标题 + 副标题，大标题带上标家族数）
 * 两者共用：面料互导模块；卡片 badge（2026-09 用户定）：面料页不叠标签（布料=页面标题、类型=分区标题都已表达），类型页叠布料标签。
 * 只给有产品的面料/类型生成静态页；Sheets / Pillow Covers 无产品不生成（导航置灰 Coming soon）。
 * 原 Bed Sets 合并页 /bedding/bed-sets/ 已删除（2026-10-16 用户定：导航改五个独立子分类入口后合并页无存在必要，该 URL 404）。
 */

// 静态导出：未列出的 slug 不会生成 HTML（等效 404）；页面内未命中也走 notFound()。
// 注意：不要加 `export const dynamicParams = false`——dev 模式 output:export 下该导出会让
// fallbackMode 变为 false，导致本页在 dev 下一律 500 "missing generateStaticParams"
// （Next dev 的既有缺陷；移除后 dev 可正常预览，生产构建行为不变）。

function beddingFamilies() {
  const products = enrichProductsWithShopifyData(PRODUCTS_DATA).filter(
    (p) => p.productType === 'Bedding'
  );
  return buildSetFamilies(products);
}

export function generateStaticParams() {
  const families = beddingFamilies();
  const fabricParams = BEDDING_FABRICS.filter((fb) =>
    families.some((f) => f.materials.includes(fb.material))
  ).map((fb) => ({ slug: fb.slug }));
  const typeParams = Object.entries(SET_KIND_SLUGS)
    .filter(([, kind]) => families.some((f) => f.kind === kind))
    .map(([slug]) => ({ slug }));
  return [...fabricParams, ...typeParams];
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const fb = fabricBySlug(params.slug);
  if (fb) {
    return {
      title: `${fabricDisplayName(fb.material)} Bedding`,
      description: `${fb.desc} ${fb.story}`,
    };
  }
  const kind = SET_KIND_SLUGS[params.slug];
  if (kind) {
    const copy = SET_KIND_PAGE_COPY[kind];
    return { title: `${copy.heading} – Bedding`, description: copy.blurb };
  }
  return {};
}

export default function BeddingSubPage({ params }: { params: { slug: string } }) {
  const all = beddingFamilies();
  const fabricsWithCounts = BEDDING_FABRICS.map((x) => ({
    ...x,
    count: all.filter((f) => f.materials.includes(x.material)).length,
  })).filter((x) => x.count > 0);

  const fb = fabricBySlug(params.slug);
  const kind = SET_KIND_SLUGS[params.slug];
  if (!fb && !kind) notFound();

  const families = fb
    ? all.filter((f) => f.materials.includes(fb.material))
    : all.filter((f) => f.kind === kind);
  if (families.length === 0) notFound();

  const pageCopy = kind ? SET_KIND_PAGE_COPY[kind] : null;

  // duvet-covers 页按面料分区展示（2026-10-16 用户定）
  const byFabric = !fb && kind === 'duvet';

  /* 类型页页头快链导航排已移除（2026-10-16 用户定：移除筛选栏，只保留标题 + 副标题 + 分区网格） */

  /* 版心与 products 列表页一致（2026-09 用户定：子类目页宽度/卡片占屏比对齐
     /products?cat=pillows&sub=* ）：移动端 px-3、桌面 px-10 全宽 */
  return (
    <div className="pt-7 lg:pt-6 pb-10 lg:pb-14">
      <div className="px-3 lg:px-10">
        {/* 面包屑已整块移除（2026-10-10 用户定：页面顶端有同名 H1 标题，信息重复，两端都不显示） */}

        {fb ? (
          /* ── 面料页头（2026-10-16 用户定：按 bedding 类目页格式重建）：通栏紧贴导航的面料特写图
             + 左叠大标题（上标风格数）+ 质感短句 + 面料故事；图下导航排 = 面料快链（当前面料高亮）
             + Fabric Guide，移动端为横滚胶囊，样式同 V2BeddingCatHero ── */
          <>
            <div className="relative -mx-3 -mt-7 lg:-mx-10 lg:-mt-6">
              <img
                src={resolveUrl(fb.heroImage)}
                alt={`${fabricDisplayName(fb.material)} fabric close-up`}
                className="w-full aspect-[4/3] lg:aspect-auto lg:h-[400px] xl:h-[460px] object-cover"
              />
              {/* 面料特写图深浅不一：渐变遮罩保底浅色字可读性（移动端自顶、桌面端自左） */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-transparent lg:bg-gradient-to-r lg:from-black/55 lg:via-black/25 lg:to-transparent" />
              <div className="absolute inset-x-0 top-0 px-4 pt-10 lg:inset-0 lg:flex lg:flex-col lg:justify-start lg:pt-14 lg:px-10">
                <h1 className="text-3xl lg:text-6xl font-extrabold tracking-tight text-cream">
                  {fabricDisplayName(fb.material)}
                  <sup className="ml-1 lg:ml-2 align-super text-xs lg:text-base font-semibold text-cream/70">
                    {families.length}
                  </sup>
                </h1>
                <p className="mt-1.5 lg:mt-3 text-xs lg:text-lg font-semibold text-cream/90">{fb.desc}</p>
                <p className="mt-1 lg:mt-2 max-w-[85%] lg:max-w-xl text-[11px] lg:text-base leading-relaxed text-cream/85">
                  {fb.story}
                </p>
              </div>
            </div>
            {/* 图下导航排：面料快链（当前面料高亮）+ Fabric Guide；移动端横滚胶囊（同 bedding hero） */}
            <nav
              className="lg:hidden mt-3 mb-5 flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Bedding fabrics"
            >
              {fabricsWithCounts.map((x) => (
                <a
                  key={x.slug}
                  href={v2url(`/bedding/${x.slug}/`)}
                  className={`flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full border text-xs transition-colors ${
                    x.slug === fb.slug
                      ? 'border-brand text-brand'
                      : 'border-warm-gray text-charcoal hover:border-brand hover:text-brand'
                  }`}
                >
                  {fabricDisplayName(x.material)}
                </a>
              ))}
              <a
                href={v2url('/fabric-guide/')}
                className="flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full border border-warm-gray text-xs text-charcoal hover:border-brand hover:text-brand transition-colors"
              >
                Fabric Guide
              </a>
            </nav>
            {/* 2026-10-20 用户定：屏宽不足不换行，单行可拖拽滚动（V2DragScrollRow） */}
            <V2DragScrollRow
              className="hidden lg:flex flex-nowrap mt-5 mb-10 items-center gap-x-7 gap-y-2 text-sm"
              ariaLabel="Bedding fabrics"
            >
              {fabricsWithCounts.map((x) => (
                <a
                  key={x.slug}
                  href={v2url(`/bedding/${x.slug}/`)}
                  className={`group inline-flex items-center gap-1 transition-colors ${
                    x.slug === fb.slug ? 'text-brand' : 'text-charcoal hover:text-brand'
                  }`}
                >
                  {fabricDisplayName(x.material)}
                  <span className="transition-transform group-hover:translate-x-0.5">›</span>
                </a>
              ))}
              <span className="h-4 w-px bg-warm-gray" aria-hidden="true" />
              <a
                href={v2url('/fabric-guide/')}
                className="group inline-flex items-center gap-1 text-charcoal hover:text-brand transition-colors"
              >
                Fabric Guide
                <span className="transition-transform group-hover:translate-x-0.5">›</span>
              </a>
            </V2DragScrollRow>
          </>
        ) : (
          /* ── 类型页页头：按 bedding 类目页标准（2026-10-16 用户定）——
             无图 hero 只保留标题 + 副标题：大标题（带上标家族数，同 V2BeddingCatHero 排版）+ 一句话说明 ── */
          <div className="mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-6xl font-extrabold tracking-tight text-charcoal">
              {pageCopy!.heading}
              <sup className="ml-1 lg:ml-2 align-super text-xs lg:text-base font-semibold text-[#999]">
                {families.length}
              </sup>
            </h1>
            <p className="mt-2 lg:mt-3 max-w-xl text-sm lg:text-base leading-relaxed text-charcoal-light">
              {pageCopy!.blurb}
            </p>
          </div>
        )}

        {/* ── 选购区：无筛选条（2026-10-16 用户定，与 /products?cat=bedding 同标准）；
            面料页按类型分区，duvet-covers 按面料分区（2026-10-16 用户定），其余类型页单一网格平铺；
            卡片 badge 规则（2026-09 用户定）：面料页整页同一布料不叠标签，类型页（多布料混排）
            叠布料标签；duvet-covers 分区标题=面料、页标题=类型，两维度都已表达 → 不叠标签 ── */}
        <V2FabricShop families={families} flat={!fb && !byFabric} noBadges={!!fb || byFabric} byFabric={byFabric} />

        {/* ── 面料互导（含当前面料，全量展示）── */}
        <V2FabricCrossSell fabrics={fabricsWithCounts} currentSlug={fb?.slug} />
      </div>

      {/* Related Guides 已从 bedding 二级类目页移除（2026-09-27 用户定）；PDP 仍保留 */}
    </div>
  );
}
