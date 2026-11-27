import fs from 'fs';
import path from 'path';
import { DATA_DIR } from './env';
import { getOverrides } from './db';

/** 可被运营修改的字段对应的产品状态 */
export type ProductStatus = 'live' | 'coming_soon' | 'hidden';

export interface SnapProduct {
  handle: string;
  asin: string;
  title: string; // 快照标题（vertex enrich 后的最终展示标题）
  /** PDP 描述基线（vertex enrich 后口径；批次 3+ 编辑页回填当前生效文案用） */
  description: string;
  productType: string;
  subcategory: string | null;
  tags: string[];
  price: number;
  compareAtPrice: number | null;
  available: boolean;
  hasShopifyData: boolean;
  images: string[];
  derivedStatus: 'live' | 'coming_soon' | 'unavailable';
}

export interface Snapshot {
  importedAt: string;
  vertexRoot: string;
  stats: {
    total: number;
    live: number;
    comingSoon: number;
    unavailable: number;
    noShopify: number;
    hiddenRaw: number;
    sceneCount: number;
    hotspotCount: number;
    deadSkuCount: number;
    noPageCount?: number;
    byCategory: Record<string, number>;
  };
  products: SnapProduct[];
  /** 真死链：热区 handle 不在商品表（圆点被滤，数据债） */
  deadSkus: { handle: string; scenes: string[]; kind: string }[];
  /** 404 风险：handle 在商品表但 out/ 无落地页（圆点会渲染并 404，需修） */
  noPageSkus?: { handle: string; scenes: string[]; kind: string }[];
}

const SNAPSHOT_PATH = path.join(DATA_DIR, 'snapshot.json');

let cache: { snap: Snapshot; mtime: number } | null = null;

export function loadSnapshot(force = false): Snapshot {
  const mtime = fs.statSync(SNAPSHOT_PATH).mtimeMs;
  if (!force && cache && cache.mtime === mtime) return cache.snap;
  const snap = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8')) as Snapshot;
  cache = { snap, mtime };
  return snap;
}

/** 基线值 = 快照 + 已发布覆盖；生效值 = 基线 + 待发布覆盖 */
export interface EffectiveProduct extends SnapProduct {
  status: ProductStatus;
  /** 哪些字段有待发布修改 */
  pending: string[];
  /** 哪些字段已发布覆盖（尚未被快照吸收） */
  published: string[];
}

// 批次 3+：description 进可编辑族（快照带基线 → 已发布覆盖可归并出「当前生效文案」）
const EDITABLE = ['title', 'price', 'compareAtPrice', 'status', 'description'] as const;

export function effectiveProducts(): EffectiveProduct[] {
  const snap = loadSnapshot();
  const overrides = getOverrides();
  return snap.products.map((p) => {
    const eff: EffectiveProduct = {
      ...p,
      status: p.derivedStatus === 'unavailable' ? 'live' : p.derivedStatus,
      pending: [],
      published: [],
    };
    const fields = overrides.get(p.handle);
    if (fields) {
      for (const [field, entry] of Array.from(fields.entries())) {
        if (!EDITABLE.includes(field as (typeof EDITABLE)[number])) continue;
        const v = entry.newValue;
        if (field === 'title') eff.title = v;
        else if (field === 'price') eff.price = Number(v);
        else if (field === 'compareAtPrice') eff.compareAtPrice = v === '' ? null : Number(v);
        else if (field === 'status') eff.status = v as ProductStatus;
        else if (field === 'description') eff.description = v;
        (entry.status === 'pending' ? eff.pending : eff.published).push(field);
      }
    }
    return eff;
  });
}

export function findEffective(handle: string): EffectiveProduct | undefined {
  return effectiveProducts().find((p) => p.handle === handle);
}

export function statusLabel(s: string): string {
  return s === 'live' ? '在售' : s === 'coming_soon' ? 'Coming Soon' : s === 'hidden' ? '已下架' : s === 'unavailable' ? '不可售' : s;
}
