import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SceneView from '@/components/v2/SceneView';
import { SCENES, getSceneCards, getSceneViewData } from '@/data/scenes';

// 静态导出：场景 slug 有限，构建期全部预渲染
export function generateStaticParams() {
  return SCENES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const scene = SCENES.find((s) => s.slug === params.slug);
  if (!scene) return {};
  return {
    title: `${scene.title} – Shop the Look`,
    description: scene.tagline,
  };
}

export default function ScenePage({ params }: { params: { slug: string } }) {
  const scene = getSceneViewData(params.slug);
  if (!scene) notFound();
  const otherScenes = getSceneCards().filter((s) => s.slug !== scene.slug);
  return <SceneView scene={scene} otherScenes={otherScenes} />;
}
