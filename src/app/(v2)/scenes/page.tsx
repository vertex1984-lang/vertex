import type { Metadata } from 'next';
import SceneModule from '@/components/v2/SceneModule';
import { getAllSceneViewData } from '@/data/scenes';

export const metadata: Metadata = {
  title: 'Shop the Look — Curated Cozy Corners | Makimoo',
  description:
    'Step into styled corners and shop everything in the picture — pillows, throws and soft layers, all in one tap.',
};

/**
 * Shop the Look 场景瀑布流页（2026-10-14 用户定）：
 * 一页展示全部场景模块（图 + 热区 + 组合加购条），占满屏幕宽度；
 * 各图比例不一致时用 CSS columns 自然排序（瀑布流）；
 * 桌面端 2 列（≥1536px 3 列），图随列宽放大。
 */
export default function ScenesIndexPage() {
  const scenes = getAllSceneViewData();
  return (
    <div className="pb-16 pt-6 lg:pt-10">
      {/* 标题贴左对齐（2026-10-14 用户定），与下方瀑布流左缘对齐 */}
      <header className="px-4 lg:px-6">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand">Shop the Look</p>
        <h1 className="mt-2 text-2xl lg:text-4xl font-extrabold tracking-tight text-charcoal">
          Curated Cozy Corners
        </h1>
        <p className="mt-2 max-w-md text-sm text-charcoal/60">
          Step inside a scene — tap a dot on the photo to shop everything in it.
        </p>
      </header>
      {/* 瀑布流：columns 自然排序；移动端全出血，桌面小边距占满屏宽 */}
      <div className="mt-6 lg:mt-10 px-0 lg:px-6 columns-1 md:columns-2 2xl:columns-3 gap-2 lg:gap-5 [&>*]:mb-2 lg:[&>*]:mb-5">
        {scenes.map((s) => (
          <SceneModule key={s.slug} scene={s} />
        ))}
      </div>
    </div>
  );
}
