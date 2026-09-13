import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { v2url } from '@/lib/v2paths';
import { COLOR_RULES } from '@/data/product-tags';
import { ALL, colorKeysWithProducts } from '../../tagged';

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

/** 色系分类页：/featured-products/color/<key>/ — 该色系全部在售产品，无筛选栏（2026-09 用户要求）。
 *  页头/产品卡样式对齐 /products 类目页（浅色面包屑页头 + 白底产品卡）。 */
export default function ColorCategoryPage({ params }: { params: { color: string } }) {
  const rule = COLOR_RULES.find((c) => c.key === params.color);
  const products = ALL.filter((p) => p.colorTag?.key === params.color);
  if (!rule || products.length === 0) notFound();

  return (
    <div className="px-6 lg:px-10 pt-32 lg:pt-36 pb-10 lg:pb-14">
      {/* 页头（同 /products 类目页）：面包屑 + 左对齐标题 + 右侧结果数 */}
      <nav className="text-xs lg:text-sm text-[#999] mb-2 lg:mb-3" aria-label="Breadcrumb">
        <a href={v2url('/')} className="hover:text-[#8B5A2B] transition-colors">Home</a>
        <span className="mx-1.5">/</span>
        <a href={v2url('/best-sellers/')} className="hover:text-[#8B5A2B] transition-colors">Best Sellers</a>
        <span className="mx-1.5">/</span>
        <span className="text-[#555]">{rule.label}</span>
      </nav>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6 lg:mb-10">
        <h1 className="text-2xl lg:text-4xl font-extrabold text-[#333]">{rule.label}</h1>
        <p className="text-sm text-[#777]">{products.length} result{products.length === 1 ? '' : 's'}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} href={v2url(`/products/${p.handle}/`)} />
        ))}
      </div>
    </div>
  );
}
