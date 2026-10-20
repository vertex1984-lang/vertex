import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BeddingSetCard from '@/components/v2/BeddingSetCard';
import { v2url } from '@/lib/v2paths';
import { SCENE_RULES } from '@/data/product-tags';
import { collapseToFamilies, toFamilyCard } from '@/lib/family-cards';
import { ALL, SCENE_BLURBS, sceneKeysWithProducts } from '../../tagged';

// 静态导出：只为 generateStaticParams 返回的分类生成页面，其余 404
// 注意：不要导出 dynamicParams=false —— dev 模式下 output:'export' 会因此把
// fallbackMode 判为非 "static" 而抛 "missing generateStaticParams()" 500；
// 静态导出本就只生成 generateStaticParams 返回的路径，无需该导出

// 只为 product-tags.json 中有 ≥1 个在售产品的场景生成静态页
export function generateStaticParams() {
  return sceneKeysWithProducts().map((scene) => ({ scene }));
}

export function generateMetadata({ params }: { params: { scene: string } }): Metadata {
  const rule = SCENE_RULES.find((s) => s.key === params.scene);
  if (!rule) return {};
  // 家族卡口径（2026-10-20 用户定）：计数 = 该场景家族数（同色同族一张卡）
  const count = collapseToFamilies(ALL.filter((p) => p.sceneTag.key === rule.key)).length;
  // 注意：本站 generateMetadata 的 title 不吃根 layout 的 "%s | Makimoo" 模板
  // （与 /products/[handle] 表现一致），后缀需手写
  return {
    title: `${rule.label} – Complete the Look | Makimoo`,
    description: `Shop Makimoo ${rule.label} pieces — ${SCENE_BLURBS[rule.key] || ''} ${count} pieces, shop by color.`,
  };
}

/** 场景分类页：/featured-products/scene/<key>/ — 该场景全部在售产品。
 *  页头/产品卡样式对齐 /products 类目页（浅色面包屑页头 + 白底产品卡）。 */
export default function SceneCategoryPage({ params }: { params: { scene: string } }) {
  const rule = SCENE_RULES.find((s) => s.key === params.scene);
  const products = ALL.filter((p) => p.sceneTag.key === params.scene);
  if (!rule || products.length === 0) notFound();
  // 家族卡（2026-10-20 用户定：全站产品卡统一为家族卡）：先按标签过滤再成族——
  // 同族成员共享同一场景标签，过滤后成族仍含全部尺寸 SKU（From 价正确）
  const families = collapseToFamilies(products);

  return (
    <div className="px-3 lg:px-10 pt-3 lg:pt-6 pb-10 lg:pb-14">
      {/* 页头（同 /products 类目页）：面包屑 + 左对齐标题 + 右侧结果数 */}
      <nav className="text-xs lg:text-sm text-[#999] mb-2 lg:mb-3" aria-label="Breadcrumb">
        <a href={v2url('/')} className="hover:text-[#8B5A2B] transition-colors">Home</a>
        <span className="mx-1.5">/</span>
        <a href={v2url('/best-sellers/')} className="hover:text-[#8B5A2B] transition-colors">Best Sellers</a>
        <span className="mx-1.5">/</span>
        <span className="text-[#555]">{rule.label}</span>
      </nav>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6 lg:mb-10">
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-[#333]">{rule.label}</h1>
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
