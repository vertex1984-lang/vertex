import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import V2PageHeader from '@/components/v2/V2PageHeader';
import { COLOR_RULES } from '@/data/product-tags';
import { ALL, colorKeysWithProducts } from '../../tagged';
import LookCard from '../../look-card';
import FilterBar from '../../filter-bar';

// 静态导出：只为 generateStaticParams 返回的分类生成页面，其余 404
export const dynamicParams = false;

// 只为 product-tags.json 中有 ≥1 个在售产品的色系生成静态页
export function generateStaticParams() {
  return colorKeysWithProducts().map((color) => ({ color }));
}

export function generateMetadata({ params }: { params: { color: string } }): Metadata {
  const rule = COLOR_RULES.find((c) => c.key === params.color);
  if (!rule) return {};
  const count = ALL.filter((p) => p.colorTag?.key === rule.key).length;
  // 注意：本站 generateMetadata 的 title 不吃根 layout 的 "%s | Makimoo" 模板
  // （与 /products/[handle] 表现一致），后缀需手写
  return {
    title: `${rule.label} — Complete the Look | Makimoo`,
    description: `Shop Makimoo in ${rule.label.toLowerCase()} — ${count} pieces across every room, shop by scene.`,
  };
}

/** 色系分类页：/featured-products/color/<key>/ — 该色系全部在售产品，筛选栏高亮当前色系 */
export default function ColorCategoryPage({ params }: { params: { color: string } }) {
  const rule = COLOR_RULES.find((c) => c.key === params.color);
  const products = ALL.filter((p) => p.colorTag?.key === params.color);
  if (!rule || products.length === 0) notFound();

  return (
    <>
      <V2PageHeader
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Featured Products', href: '/featured-products/' },
          { label: rule.label },
        ]}
        title={rule.label}
        subtitle={`${products.length} pieces in ${rule.label.toLowerCase()}, across every room.`}
      />

      {/* 吸顶筛选栏：分类导航，当前色系高亮 */}
      <FilterBar activeColor={rule.key} />

      <section className="py-12 lg:py-16">
        <div className="px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 lg:gap-x-6">
            {products.map((p) => (
              <LookCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
