import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BeddingSetCard from '@/components/v2/BeddingSetCard';
import { v2url } from '@/lib/v2paths';
import { STYLE_RULES } from '@/data/product-tags';
import { collapseToFamilies, toFamilyCard } from '@/lib/family-cards';
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
  // 家族卡口径（2026-10-20 用户定）：计数 = 该风格家族数（同色同族一张卡，无组产品单品成族）
  const count = collapseToFamilies(ALL_STYLED.filter((p) => p.styleTag.key === rule.key)).length;
  // 注意：本站 generateMetadata 的 title 不吃根 layout 的 "%s | Makimoo" 模板，后缀需手写
  return {
    title: `${rule.label} Style – Shop by Style | Makimoo`,
    description: `Shop Makimoo ${rule.label} pieces — ${STYLE_BLURBS[rule.key] || ''} ${count} pieces, shop by style.`,
  };
}

/** 风格聚合页：/featured-products/style/<key>/ — 该风格全部在售产品（全类目，按权重降序）。
 *  页头/产品卡样式对齐 /products 类目页（浅色面包屑页头 + 白底产品卡）。 */
export default function StyleCategoryPage({ params }: { params: { style: string } }) {
  const rule = STYLE_RULES.find((s) => s.key === params.style);
  const products = ALL_STYLED.filter((p) => p.styleTag.key === params.style);
  if (!rule || products.length === 0) notFound();
  // 家族卡（2026-10-20 用户定：全站产品卡统一为家族卡）：先按标签过滤再成族——
  // 同族成员共享同一风格标签，过滤后成族仍含全部尺寸 SKU（From 价正确）；
  // Decor/Dining/Others 等无变体组产品自动单品成族，无需特判
  const families = collapseToFamilies(products);

  return (
    <div className="px-3 lg:px-10 pt-3 lg:pt-6 pb-10 lg:pb-14">
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
        <p className="text-sm text-[#777]">{families.length} result{families.length === 1 ? '' : 's'}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
        {families.map((f) => (
          <BeddingSetCard key={f.key} family={toFamilyCard(f)} compactText />
        ))}
      </div>
    </div>
  );
}
