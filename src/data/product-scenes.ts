/**
 * product-scenes.ts — PDP 反向场景映射（2026-11-05/06）：
 * 从 scenes.ts 的正向数据（场景 → 热区 handle）派生反向索引（handle → 出现的场景 + 热区坐标），
 * 供 PDP 展示"该商品出镜的 Shop the Look 场景图 + 热区定位点"。
 *
 * 运行时派生（模块加载时构建一次），不做 codegen——scenes.ts 新增场景自动生效，永不脱同步。
 * 背景：场景热区此前只有单向映射（场景页锚点 → PDP 入口），PDP 侧无法反查自己出镜的场景图
 * （协作方合并时发现，2026-11-05 用户定需求）。
 */

import { SCENES } from './scenes';

export interface ProductSceneSpot {
  /** 热区圆点中心在场景图上的百分比坐标（1-100） */
  x: number;
  y: number;
  /** 锚点位置说明（场景页小卡文案） */
  label?: string;
  /** 同场景同商品多次出现时的唯一键 */
  spotId?: string;
}

export interface ProductSceneRef {
  slug: string;
  title: string;
  style: string;
  tagline: string;
  heroImage: string;
  heroAlt: string;
  /** 宽幅场景（横图） */
  heroWide?: boolean;
  /** 场景上线时间（列表排序用） */
  addedAt?: string;
  /** 该商品在此场景里的全部热区（同场景多次出现时多条） */
  spots: ProductSceneSpot[];
}

// 模块级反向索引（构建一次）
const index = new Map<string, ProductSceneRef[]>();

for (const scene of SCENES) {
  for (const h of scene.hotspots) {
    const key = h.handle.toLowerCase();
    let list = index.get(key);
    if (!list) {
      list = [];
      index.set(key, list);
    }
    let ref = list.find((r) => r.slug === scene.slug);
    if (!ref) {
      ref = {
        slug: scene.slug,
        title: scene.title,
        style: scene.style,
        tagline: scene.tagline,
        heroImage: scene.heroImage,
        heroAlt: scene.heroAlt,
        spots: [],
        ...(scene.heroWide ? { heroWide: true } : {}),
        ...(scene.addedAt ? { addedAt: scene.addedAt } : {}),
      };
      list.push(ref);
    }
    ref.spots.push({
      x: h.x,
      y: h.y,
      ...(h.label ? { label: h.label } : {}),
      ...(h.spotId ? { spotId: h.spotId } : {}),
    });
  }
}

/** 查询某 handle 出镜的场景（addedAt 新的在前）；未出镜返回空数组 */
export function getProductScenes(handle: string): ProductSceneRef[] {
  const list = index.get(handle.toLowerCase());
  if (!list || list.length === 0) return [];
  return [...list].sort((a, b) => (b.addedAt ?? '').localeCompare(a.addedAt ?? ''));
}

/** 该商品是否出镜（轻量判断，不触发排序拷贝） */
export function hasProductScenes(handle: string): boolean {
  return index.has(handle.toLowerCase());
}
