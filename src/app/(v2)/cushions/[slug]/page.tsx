import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';
import { getSubcategoriesOf, getSubcategoryDef } from '@/data/subcategories';
import { spotlightImage } from '@/components/v2/card-utils';
import GroupProductCard from '@/components/v2/GroupProductCard';
import { buildGroupCards } from '@/lib/group-cards';
import V2PillowCrossSell, { PillowCrossSellItem } from '@/components/v2/V2PillowCrossSell';
import {
  visibleCushionFamilies,
  sortCushionFamilies,
} from '@/data/cushion-families';

/**
 * Cushions 二级类目 PLP（2026-10-09 用户定：与 pillows/bedding 一致，细分类目直接链接，
 * 不再走 /products?cat=cushions&sub= 筛选）：
 * - 2026-10-23 用户定：原 corduroy/solids/prints 三风格页下线（404），合并为 /cushions/outdoor-cushions/ 单页
 * - 无 banner（同 bedding/pillows 二级页）：面包屑 + H1 + 一句话简介 → 家族卡网格
 *   （cushions 单分类无第二维度下拉；卡片逻辑与列表页共用 cushion-families）
 * - 底部互导：其他风格图片卡横滑条（复用 V2PillowCrossSell，basePath=/cushions）
 * 只给有产品的 slug 生成静态页。
 * 注意：不要加 `export const dynamicParams = false`（dev 模式 output:export 下会导致 500，
 * 见 /pillows/[slug] 注释）。
 */

const CUSHION_SUBS = getSubcategoriesOf('cushions');

function cushionProducts() {
  return enrichProductsWithShopifyData(PRODUCTS_DATA).filter(
    (p) => p.productType.toLowerCase() === 'cushions'
  );
}

function productsFor(slug: string) {
  return cushionProducts().filter((p) => p.subcategory === slug);
}

/** 互导条目：其他有产品的分类各取首卡焦点图（与 BeddingSetCard 同口径；单分类时为空、互导条自动不渲染） */
function crossSellItems(): PillowCrossSellItem[] {
  return CUSHION_SUBS.map((s) => {
    const list = productsFor(s.key);
    if (list.length === 0) return null;
    return { slug: s.key, label: s.label, blurb: s.blurb, image: spotlightImage(list[0]).url };
  }).filter((x): x is PillowCrossSellItem => x !== null);
}

export function generateStaticParams() {
  return CUSHION_SUBS.filter((s) => productsFor(s.key).length > 0).map((s) => ({ slug: s.key }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const def = getSubcategoryDef(params.slug);
  if (!def || def.parent !== 'cushions') return {};
  return {
    title: `${def.label} – Cushions`,
    description: def.blurb,
  };
}

export default function CushionSubPage({ params }: { params: { slug: string } }) {
  const def = getSubcategoryDef(params.slug);
  if (!def || def.parent !== 'cushions') notFound();
  const products = productsFor(params.slug);
  if (products.length === 0) notFound();

  // 家族卡逻辑与 /products?cat=cushions 列表页完全一致（共用 cushion-families）
  const families = sortCushionFamilies(visibleCushionFamilies(products));

  /* 版心与 bedding/pillows 二级页一致：移动端 px-3、桌面 px-10 全宽 */
  return (
    <div className="pt-7 lg:pt-6 pb-10 lg:pb-14">
      <div className="px-3 lg:px-10">
        {/* 面包屑已整块移除（2026-10-10 用户定：页面顶端有同名 H1 标题，信息重复，两端都不显示） */}

        {/* ── 页头：无 banner，H1 + 一句话简介（同 bedding/pillows 二级页）── */}
        <div className="mb-6 lg:mb-10">
          <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-charcoal">
            {def.label}
          </h1>
          <p className="mt-1.5 lg:mt-2 text-sm lg:text-base text-charcoal-light">{def.blurb}</p>
        </div>

        {/* ── 组卡网格（同列表页分区网格样式；2026-10-22 一组一卡：同组各色并卡 + 色卡行，
            卡面标题走 familyCardDisplay 的 cushionCardTitle 同口径）── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
          {buildGroupCards(families).map((c) => (
            <GroupProductCard
              key={c.key}
              card={c}
              compactText
            />
          ))}
        </div>

        {/* ── 互导：其他风格图片卡横滑条 ── */}
        <V2PillowCrossSell
          items={crossSellItems()}
          currentSlug={def.key}
          basePath="/cushions"
          eyebrow="Makimoo Cushions"
          heading="More Ways to Shop Cushions"
        />
      </div>
    </div>
  );
}
