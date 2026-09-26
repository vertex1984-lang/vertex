import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { v2url } from '@/lib/v2paths';
import { STYLE_RULES } from '@/data/product-tags';
import { ALL_STYLED, STYLE_BLURBS, styleKeysWithProducts } from '@/data/style-tagged';

// 静态导出：只为 generateStaticParams 返回的风格生成页面，其余 404
// 注意：不要导出 dynamicParams=false —— dev 模式下 output:'export' 会因此把
// fallbackMode 判为非 "static" 而抛 "missing generateStaticParams()" 500；
// 静态导出本就只生成 generateStaticParams 返回的路径，无需该导出

// 只为有 ≥1 个在售产品的风格生成静态页
export function generateStaticParams() {
  return styleKeysWithProducts().map((style) => ({ style }));
}

export function generateMetadata({ params }: { params: { style: string } }): Metadata {
  const rule = STYLE_RULES.find((s) => s.key === params.style);
  if (!rule) return {};
  const count = ALL_STYLED.filter((p) => p.styleTag.key === rule.key).length;
  // 注意：本站 generateMetadata 的 title 不吃根 layout 的 "%s | Makimoo" 模板，后缀需手写
  return {
    title: `${rule.label} Style — Shop by Style | Makimoo`,
    description: `Shop Makimoo ${rule.label} pieces — ${STYLE_BLURBS[rule.key] || ''} ${count} pieces, shop by style.`,
  };
}

/** 风格聚合页：/featured-products/style/<key>/ — 该风格全部在售产品（全类目，按权重降序）。
 *  页头/产品卡样式对齐 /products 类目页（浅色面包屑页头 + 白底产品卡）。 */
export default function StyleCategoryPage({ params }: { params: { style: string } }) {
  const rule = STYLE_RULES.find((s) => s.key === params.style);
  const products = ALL_STYLED.filter((p) => p.styleTag.key === params.style);
  if (!rule || products.length === 0) notFound();

  return (
    <div className="px-3 lg:px-10 pt-24 lg:pt-36 pb-10 lg:pb-14">
      {/* 页头（同 /products 类目页）：面包屑 + 左对齐标题 + 右侧结果数 */}
      <nav className="text-xs lg:text-sm text-[#999] mb-2 lg:mb-3" aria-label="Breadcrumb">
        <a href={v2url('/')} className="hover:text-[#8B5A2B] transition-colors">Home</a>
        <span className="mx-1.5">/</span>
        <span className="text-[#555]">Shop by Style</span>
        <span className="mx-1.5">/</span>
        <span className="text-[#555]">{rule.label}</span>
      </nav>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6 lg:mb-10">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-[#333]">{rule.label}</h1>
          {STYLE_BLURBS[rule.key] && (
            <p className="text-sm text-[#777] mt-2">{STYLE_BLURBS[rule.key]}</p>
          )}
        </div>
        <p className="text-sm text-[#777]">{products.length} result{products.length === 1 ? '' : 's'}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} href={v2url(`/products/${p.handle}/`)} />
        ))}
      </div>
    </div>
  );
}
