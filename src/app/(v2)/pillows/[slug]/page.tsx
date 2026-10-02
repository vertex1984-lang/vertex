import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';
import { sortByWeight } from '@/lib/weights';
import { dedupeFamilyColors } from '@/lib/listing-dedupe';
import { spotlightImage } from '@/components/v2/card-utils';
import V2PillowSubShop from '@/components/v2/V2PillowSubShop';
import V2PillowCrossSell, { PillowCrossSellItem } from '@/components/v2/V2PillowCrossSell';
import { v2url } from '@/lib/v2paths';
import {
  PILLOW_TYPES,
  PILLOW_MATERIALS,
  pillowTypeOf,
  pillowMaterialOf,
  pillowTypeBySlug,
  pillowMaterialBySlug,
  isPillowProduct,
  PillowTaxon,
} from '@/data/pillows-taxonomy';

/**
 * Pillows 二级类目 PLP（2026-09-30 用户定：展示方法与逻辑完全对齐 /bedding/bed-sets/）：
 * - 形态页 /pillows/bed-pillows/ 等 + 材质页 /pillows/down-alternative/、/pillows/memory-foam/
 * - 无 banner（同 bedding 类型页）：面包屑 + H1 + 一句话简介 → 另一维度下拉 + 分区网格
 *   （形态页按材质分区、材质页按形态分区；卡片不叠 badge——页标题+分区标题已表达两维度）
 * - 底部互导：图片卡横滑条（照搬 bedding 的 V2FabricCrossSell 样式），当前页排除自身
 * 只给有产品的 slug 生成静态页；Down 无产品不生成（导航置灰）。
 */

// 静态导出：未列出的 slug 不会生成 HTML（等效 404）；页面内 taxonOf 未命中也走 notFound()。
// 注意：不要加 `export const dynamicParams = false`——dev 模式 output:export 下该导出会让
// fallbackMode 变为 false，导致本页在 dev 下一律 500 "missing generateStaticParams"
// （Next dev 的既有缺陷，/bedding/[slug] 曾同款；移除后 dev 可正常预览，生产构建行为不变）。

function pillowCards() {
  const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA).filter(isPillowProduct);
  return sortByWeight(dedupeFamilyColors(enriched));
}

function taxonOf(slug: string): { taxon: PillowTaxon; kind: 'type' | 'material' } | null {
  const t = pillowTypeBySlug(slug);
  if (t) return { taxon: t, kind: 'type' };
  const m = pillowMaterialBySlug(slug);
  if (m) return { taxon: m, kind: 'material' };
  return null;
}

function productsFor(slug: string) {
  const hit = taxonOf(slug);
  if (!hit) return [];
  const all = pillowCards();
  return hit.kind === 'type'
    ? all.filter((p) => pillowTypeOf(p) === hit.taxon.key)
    : all.filter((p) => pillowMaterialOf(p) === hit.taxon.key);
}

/** 互导条目：有产品的类目各取首卡焦点图（与 BeddingSetCard 同口径） */
function crossSellItems(): PillowCrossSellItem[] {
  return [...PILLOW_TYPES, ...PILLOW_MATERIALS]
    .map((t) => {
      const list = productsFor(t.slug);
      if (list.length === 0) return null;
      return { slug: t.slug, label: t.label, blurb: t.blurb, image: spotlightImage(list[0]).url };
    })
    .filter((x): x is PillowCrossSellItem => x !== null);
}

export function generateStaticParams() {
  return [...PILLOW_TYPES, ...PILLOW_MATERIALS]
    .filter((t) => productsFor(t.slug).length > 0)
    .map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const hit = taxonOf(params.slug);
  if (!hit) return {};
  return {
    title: `${hit.taxon.label} — Pillows`,
    description: hit.taxon.blurb,
  };
}

export default function PillowSubPage({ params }: { params: { slug: string } }) {
  const hit = taxonOf(params.slug);
  if (!hit) notFound();
  const products = productsFor(params.slug);
  if (products.length === 0) notFound();

  const { taxon, kind } = hit;

  /* 版心与 bedding 二级页一致（2026-09 用户定）：移动端 px-3、桌面 px-10 全宽 */
  return (
    <div className="pt-28 lg:pt-36 pb-10 lg:pb-14">
      <div className="px-3 lg:px-10">
        {/* ── 面包屑 ── */}
        <nav className="text-xs lg:text-sm text-[#999] mb-2 lg:mb-3" aria-label="Breadcrumb">
          <a href={v2url('/')} className="hover:text-[#8B5A2B] transition-colors">Home</a>
          <span className="mx-1.5">/</span>
          <a href={v2url('/products/?cat=pillows')} className="hover:text-[#8B5A2B] transition-colors">Pillows</a>
          <span className="mx-1.5">/</span>
          <span className="text-[#555]">{taxon.label}</span>
        </nav>

        {/* ── 页头：无 banner，H1 + 一句话简介（同 bedding 类型页）── */}
        <div className="mb-6 lg:mb-10">
          <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-charcoal">
            {taxon.label}
          </h1>
          <p className="mt-1.5 lg:mt-2 text-sm lg:text-base text-charcoal-light">{taxon.blurb}</p>
        </div>

        {/* ── 选购区：另一维度下拉 + 分区网格（同 /bedding/bed-sets/ 逻辑）── */}
        <V2PillowSubShop products={products} sectionBy={kind === 'type' ? 'material' : 'type'} />

        {/* ── 互导：其他形态/材质图片卡横滑条（含当前类目之外的全部有产品类目）── */}
        <V2PillowCrossSell items={crossSellItems()} currentSlug={taxon.slug} />
      </div>
    </div>
  );
}
