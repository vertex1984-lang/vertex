import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';
import { buildSetFamilies, SET_KIND_PAGE_COPY, SET_KIND_SLUGS, BED_SETS_SLUG, BED_SETS_KINDS, BED_SETS_PAGE_COPY } from '@/data/bedding-families';
import { BEDDING_FABRICS, fabricBySlug } from '@/data/bedding-fabrics';
import V2FabricShop from '@/components/v2/V2FabricShop';
import V2FabricCrossSell from '@/components/v2/V2FabricCrossSell';
import V2RelatedGuides from '@/components/v2/V2RelatedGuides';
import { v2url } from '@/lib/v2paths';
import { resolveUrl } from '@/lib/paths';

/**
 * Bedding 二级类目 PLP（2026-09，仿 Parachute fabric-led 模型），一个路由三种页型：
 * - 面料页 /bedding/linen/ 等：面料 hero（名字 + 质感短句 + 故事）→ 按类型分区网格（无筛选条）
 * - 类型页 /bedding/4-piece-sets/ 等：**无 banner**（2026-09 用户定），H1 + 说明 → 单一网格平铺
 * - Bed Sets 合并页 /bedding/bed-sets/（2026-09 用户定：导航 4P/3P 合并入口）：
 *   无 banner，H1 + 说明 → 按 4-Piece/3-Piece 两个分区展示（卡片标题"材质 — 颜色"）
 * 三者共用：面料互导模块、Related Guides；卡片 badge（2026-09 用户定）：面料页不叠标签（布料=页面标题、类型=分区标题都已表达），类型页/Bed Sets 合并页叠布料标签。
 * 只给有产品的面料/类型生成静态页；Sheets / Duvet Covers 无产品不生成（导航指 /bedding/#on-the-loom）。
 */

// 静态导出：未列出的 slug 一律 404
export const dynamicParams = false;

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
  const bedSetsParams = families.some((f) => BED_SETS_KINDS.includes(f.kind))
    ? [{ slug: BED_SETS_SLUG }]
    : [];
  return [...fabricParams, ...typeParams, ...bedSetsParams];
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const fb = fabricBySlug(params.slug);
  if (fb) {
    return {
      title: `${fb.material} Bedding — Bed Sets`,
      description: `${fb.desc} ${fb.story}`,
    };
  }
  const kind = SET_KIND_SLUGS[params.slug];
  if (kind) {
    const copy = SET_KIND_PAGE_COPY[kind];
    return { title: `${copy.heading} — Bedding`, description: copy.blurb };
  }
  if (params.slug === BED_SETS_SLUG) {
    return { title: `${BED_SETS_PAGE_COPY.heading} — Bedding`, description: BED_SETS_PAGE_COPY.blurb };
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
  const isBedSets = params.slug === BED_SETS_SLUG;
  if (!fb && !kind && !isBedSets) notFound();

  const families = fb
    ? all.filter((f) => f.materials.includes(fb.material))
    : isBedSets
      ? all.filter((f) => BED_SETS_KINDS.includes(f.kind))
      : all.filter((f) => f.kind === kind);
  if (families.length === 0) notFound();

  const crumb = fb ? fb.material : isBedSets ? BED_SETS_PAGE_COPY.heading : SET_KIND_PAGE_COPY[kind!].heading;
  const pageCopy = isBedSets ? BED_SETS_PAGE_COPY : kind ? SET_KIND_PAGE_COPY[kind] : null;

  /* 版心与 products 列表页一致（2026-09 用户定：子类目页宽度/卡片占屏比对齐
     /products?cat=pillows&sub=* ）：移动端 px-3、桌面 px-10 全宽 */
  return (
    <div className="pt-28 lg:pt-36 pb-10 lg:pb-14">
      <div className="px-3 lg:px-10">
        {/* ── 面包屑 ── */}
        <nav className="text-xs lg:text-sm text-[#999] mb-2 lg:mb-3" aria-label="Breadcrumb">
          <a href={v2url('/')} className="hover:text-[#8B5A2B] transition-colors">Home</a>
          <span className="mx-1.5">/</span>
          <a href={v2url('/bedding/')} className="hover:text-[#8B5A2B] transition-colors">Bedding</a>
          <span className="mx-1.5">/</span>
          <span className="text-[#555]">{crumb}</span>
        </nav>

        {fb ? (
          /* ── 面料 Hero：面料特写图 + 名字/质感短句/面料故事（仿 Parachute Percale 页头）
             移动端 16/10 矮幅（2026-09 用户定：原 3/4 太高，首屏只有图见不到商品）── */
          <div className="relative overflow-hidden rounded-xl aspect-[16/10] sm:aspect-[16/7] lg:aspect-[47/10] mb-8 lg:mb-16">
            <img
              src={resolveUrl(fb.heroImage)}
              alt={`${fb.material} fabric close-up`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-5 lg:px-14 max-w-xl lg:max-w-2xl">
                <p className="text-[10px] lg:text-xs font-semibold tracking-[0.2em] uppercase text-cream/90">
                  Makimoo Bedding
                </p>
                <h1 className="mt-1 lg:mt-2 text-2xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-cream">
                  {fb.material}
                </h1>
                <p className="mt-1 lg:mt-2 text-sm lg:text-lg font-semibold text-cream/90">{fb.desc}</p>
                <p className="mt-1.5 lg:mt-3 text-xs lg:text-base text-cream/85 leading-relaxed">
                  {fb.story}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ── 类型页/Bed Sets 合并页页头：无 banner（2026-09 用户定），H1 + 一句话说明 ── */
          <div className="mb-6 lg:mb-10">
            <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-charcoal">
              {pageCopy!.heading}
            </h1>
            <p className="mt-1.5 lg:mt-2 text-sm lg:text-base text-charcoal-light">
              {pageCopy!.blurb}
            </p>
          </div>
        )}

        {/* ── 选购区：无筛选条，只有排序；面料页按类型分区，Bed Sets 合并页按 4P/3P 分区，
            类型页单一网格平铺；卡片 badge 规则（2026-09 用户定）：面料页整页同一布料不叠标签，
            类型页/合并页（多布料混排）叠布料标签 ── */}
        <V2FabricShop families={families} flat={!fb && !isBedSets} noBadges={!!fb} />

        {/* ── 面料互导（含当前面料，全量展示）── */}
        <V2FabricCrossSell fabrics={fabricsWithCounts} currentSlug={fb?.slug} />
      </div>

      {/* ── Related Guides（组件自带版心）── */}
      <div className="mt-8 lg:mt-12">
        <V2RelatedGuides cat="bedding" eyebrow="Need Help Deciding?" heading="Need help deciding?" sub="A few quick guides to help you choose the right one." />
      </div>
    </div>
  );
}
