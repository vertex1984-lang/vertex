'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Reveal from '@/components/Reveal';
import V2PageHeader from '@/components/v2/V2PageHeader';
import { COLOR_RULES, SCENE_RULES } from '@/data/product-tags';
import { v2url } from '@/lib/v2paths';
import { ALL, SCENE_BLURBS } from './tagged';
import LookCard from './look-card';
import FilterBar from './filter-bar';

/**
 * Featured Products 独立页 = Complete the Look（本页只保留此模块）：
 * 页头 → 吸顶筛选栏（场景/色系分类导航 chip，点击跳转对应静态分类页）→ 按场景分区的产品网格，
 * 产品卡上同时打色系（色点）与场景（pill）标签。
 */
export default function CompleteTheLookPage() {
  const router = useRouter();

  // 老参数兼容：/featured-products/?scene=bedroom / ?color=blue → 对应静态分类页
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scene = params.get('scene');
    const color = params.get('color');
    if (scene && SCENE_RULES.some((s) => s.key === scene)) {
      router.replace(v2url(`/featured-products/scene/${scene}/`));
    } else if (color && COLOR_RULES.some((c) => c.key === color)) {
      router.replace(v2url(`/featured-products/color/${color}/`));
    }
  }, [router]);

  // 要渲染的场景分区（保持 SCENE_RULES 顺序，空区不渲染）
  const sections = SCENE_RULES.map((scene) => ({
    ...scene,
    products: ALL.filter((p) => p.sceneTag.key === scene.key),
  })).filter((s) => s.products.length > 0);

  return (
    <>
      <V2PageHeader
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Featured Products' }]}
        title="Complete the Look"
        subtitle={`Shop by color and scene — ${ALL.length} pieces across ${sections.length} rooms, solid colors tagged.`}
      />

      {/* 吸顶筛选栏：场景/色系分类导航（点击跳转对应静态分类页） */}
      <FilterBar activeScene="all" />

      {/* 场景分区（交替底色） */}
      {sections.map((section, idx) => (
        <section
          key={section.key}
          id={`scene-${section.key}`}
          className={`scroll-mt-44 py-12 lg:py-16 ${idx % 2 === 1 ? 'bg-off-white' : ''}`}
        >
          <div className="px-6 lg:px-10">
            <Reveal>
              <div className="flex items-end gap-5 mb-8 lg:mb-10">
                <span
                  aria-hidden
                  className="text-5xl lg:text-7xl font-extrabold leading-none text-brand/20 select-none"
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-charcoal">
                    {section.label}
                  </h2>
                  <p className="text-sm text-charcoal-light mt-1.5">
                    {SCENE_BLURBS[section.key] || ''} · {section.products.length} pieces
                  </p>
                </div>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 lg:gap-x-6">
              {section.products.map((p) => (
                <LookCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
