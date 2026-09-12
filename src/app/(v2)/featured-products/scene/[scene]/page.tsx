import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import V2PageHeader from '@/components/v2/V2PageHeader';
import { SCENE_RULES } from '@/data/product-tags';
import { ALL, SCENE_BLURBS, sceneKeysWithProducts } from '../../tagged';
import LookCard from '../../look-card';

// 静态导出：只为 generateStaticParams 返回的分类生成页面，其余 404
export const dynamicParams = false;

// 只为 product-tags.json 中有 ≥1 个在售产品的场景生成静态页
export function generateStaticParams() {
  return sceneKeysWithProducts().map((scene) => ({ scene }));
}

export function generateMetadata({ params }: { params: { scene: string } }): Metadata {
  const rule = SCENE_RULES.find((s) => s.key === params.scene);
  if (!rule) return {};
  const count = ALL.filter((p) => p.sceneTag.key === rule.key).length;
  // 注意：本站 generateMetadata 的 title 不吃根 layout 的 "%s | Makimoo" 模板
  // （与 /products/[handle] 表现一致），后缀需手写
  return {
    title: `${rule.label} — Complete the Look | Makimoo`,
    description: `Shop Makimoo ${rule.label} pieces — ${SCENE_BLURBS[rule.key] || ''} ${count} pieces, shop by color.`,
  };
}

/** 场景分类页：/featured-products/scene/<key>/ — 该场景全部在售产品 */
export default function SceneCategoryPage({ params }: { params: { scene: string } }) {
  const rule = SCENE_RULES.find((s) => s.key === params.scene);
  const products = ALL.filter((p) => p.sceneTag.key === params.scene);
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
        subtitle={`${SCENE_BLURBS[rule.key] || ''} · ${products.length} pieces`}
      />

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
