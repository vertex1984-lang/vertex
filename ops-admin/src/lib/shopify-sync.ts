import fs from 'fs';
import path from 'path';
import { VERTEX_ROOT } from './env';
import { loadSnapshot, type Snapshot, type SnapProduct } from './snapshot';

/**
 * 「从线上同步商品」（2026-11-26 线上版批次）：数据源 = Shopify Storefront API（前台线上同源），
 * 替代"从本地 vertex 仓库 import"作为运营刷新商品数据的主流程（避免前后台不同步）。
 *
 * 同步口径（幂等，重复点击无脏数据）：
 * - 新增：线上有、快照无 → 追加最小条目（derivedStatus='live'）
 * - 更新：价格 / 库存可用性 / 主图（首次同步为快照补 shopifyImage 基线，之后按变更计数）
 * - 下架标记：快照中有 Shopify 关联（hasShopifyData）但线上已不返回 → available=false + derivedStatus='hidden'
 * - 快照无 Shopify 关联的条目（vertex 纯素材产品）不动
 *
 * 凭证：优先 admin .env.local 的 SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_TOKEN；
 * 缺省回退解析 VERTEX_ROOT/.env.local 的 NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN /
 * NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN（与前台线上同源，领导要求口径一致）。
 */

export interface SyncDiff {
  added: { handle: string; title: string; price: number }[];
  updated: { handle: string; fields: string[] }[];
  delisted: { handle: string; title: string }[];
  unchanged: number;
  totalOnline: number;
}

interface OnlineProduct {
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  featuredImage: { url: string } | null;
  price: number;
  compareAtPrice: number | null;
  tags: string[];
}

interface OnlineNode {
  handle: string;
  title: string;
  description?: string;
  availableForSale: boolean;
  featuredImage: { url: string } | null;
  tags: string[];
  priceRange: { minVariantPrice: { amount: string } };
  compareAtPriceRange: { minVariantPrice: { amount: string } } | null;
}

function parseVertexEnv(): Record<string, string> {
  try {
    const text = fs.readFileSync(path.join(VERTEX_ROOT, '.env.local'), 'utf8');
    const out: Record<string, string> = {};
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+)\s*$/);
      if (m) out[m[1]] = m[2].trim();
    }
    return out;
  } catch {
    return {};
  }
}

export function getShopifyCreds(): { domain: string; token: string; apiVersion: string } | null {
  const venv = parseVertexEnv();
  const domain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    venv.SHOPIFY_STORE_DOMAIN ||
    venv.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    '';
  const token =
    process.env.SHOPIFY_STOREFRONT_TOKEN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    venv.SHOPIFY_STOREFRONT_TOKEN ||
    venv.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    '';
  const apiVersion = process.env.SHOPIFY_API_VERSION || venv.SHOPIFY_API_VERSION || '2025-07';
  if (!domain || !token) return null;
  return { domain: domain.replace(/^https?:\/\//, ''), token, apiVersion };
}

const QUERY = `
query products($after: String) {
  products(first: 250, after: $after) {
    edges {
      cursor
      node {
        handle
        title
        description
        availableForSale
        tags
        featuredImage { url(transform: { maxWidth: 1600 }) }
        priceRange { minVariantPrice { amount } }
        compareAtPriceRange { minVariantPrice { amount } }
      }
    }
    pageInfo { hasNextPage }
  }
}`;

async function fetchAllOnline(creds: { domain: string; token: string; apiVersion: string }): Promise<OnlineProduct[]> {
  const out: OnlineProduct[] = [];
  let after: string | null = null;
  // 硬上限 40 页 × 250 = 1 万商品（远超当前规模，防失控循环）
  for (let i = 0; i < 40; i++) {
    const res: Response = await fetch(`https://${creds.domain}/api/${creds.apiVersion}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': creds.token,
      },
      body: JSON.stringify({ query: QUERY, variables: { after } }),
    });
    if (!res.ok) throw new Error(`Storefront API ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const json: {
      errors?: unknown[];
      data: { products: { edges: { cursor: string; node: OnlineNode }[]; pageInfo: { hasNextPage: boolean } } };
    } = await res.json();
    if (json.errors?.length) throw new Error(`GraphQL error: ${JSON.stringify(json.errors).slice(0, 200)}`);
    const conn = json.data.products;
    for (const edge of conn.edges) {
      const n = edge.node;
      out.push({
        handle: n.handle,
        title: n.title,
        description: n.description || '',
        availableForSale: !!n.availableForSale,
        featuredImage: n.featuredImage ? { url: n.featuredImage.url } : null,
        tags: n.tags || [],
        price: parseFloat(n.priceRange?.minVariantPrice?.amount ?? '0') || 0,
        compareAtPrice: n.compareAtPriceRange?.minVariantPrice?.amount
          ? parseFloat(n.compareAtPriceRange.minVariantPrice.amount)
          : null,
      });
    }
    if (!conn.pageInfo.hasNextPage) break;
    after = conn.edges[conn.edges.length - 1]?.cursor ?? null;
    if (!after) break;
  }
  return out;
}

function applySync(snap: Snapshot, online: OnlineProduct[]): SyncDiff {
  const diff: SyncDiff = { added: [], updated: [], delisted: [], unchanged: 0, totalOnline: online.length };

  /**
   * 匹配键（口径对齐 vertex build-shopify-map.js：tags > handle 兜底）：
   * 1. Shopify 产品 tags 里的产品标识（vertex 的 asin 字段，'1688-' 前缀已归一化，统一小写）
   * 2. Shopify handle 精确等于 vertex handle（少数直接对接的产品）
   * 同一标识命中多个线上产品时取最后一个（= Shopify 后台最新上传，对齐 AGENTS 重复标识规则）。
   */
  const normalize = (t: string) => t.trim().toLowerCase().replace(/^1688-/, '');
  const byHandle = new Map(online.map((p) => [p.handle, p]));
  const byTag = new Map<string, OnlineProduct>();
  for (const o of online) {
    for (const t of o.tags) {
      const id = normalize(t);
      if (id) byTag.set(id, o);
    }
  }
  const matchOnline = (p: SnapProduct): OnlineProduct | undefined => {
    const viaHandle = byHandle.get(p.handle);
    if (viaHandle) return viaHandle;
    const asin = normalize(p.asin || '');
    if (asin && byTag.has(asin)) return byTag.get(asin);
    // 兜底：部分 vertex handle 以 ASIN 结尾，且 Shopify handle 也可能内嵌 ASIN
    for (const t of p.tags || []) {
      const id = normalize(t);
      if (id && byTag.has(id)) return byTag.get(id);
    }
    return undefined;
  };
  const claimed = new Set<OnlineProduct>();
  const claim = (p: SnapProduct, o: OnlineProduct) => {
    claimed.add(o);
    // 记录映射到快照条目上（幂等复跑用；shopifyHandle 供运营对照）
    (p as unknown as { shopifyHandle?: string }).shopifyHandle = o.handle;
  };

  // —— 更新 + 下架标记（遍历既有快照）——
  for (const p of snap.products) {
    if (!p.hasShopifyData) continue; // 纯素材产品不动
    const o = matchOnline(p);
    if (!o) {
      // 线上已不返回 → 下架标记（幂等：已标记则不变；快照 derivedStatus 口径 = 'unavailable'（不可售））
      if (p.derivedStatus !== 'unavailable' || p.available !== false) {
        p.available = false;
        p.derivedStatus = 'unavailable';
        diff.delisted.push({ handle: p.handle, title: p.title });
      } else {
        diff.unchanged++;
      }
      continue;
    }
    claim(p, o);
    const fields: string[] = [];
    if (p.price !== o.price) {
      p.price = o.price;
      fields.push('price');
    }
    if ((p.compareAtPrice ?? null) !== (o.compareAtPrice ?? null)) {
      p.compareAtPrice = o.compareAtPrice;
      fields.push('compareAtPrice');
    }
    if (p.available !== o.availableForSale) {
      p.available = o.availableForSale;
      // 同步线上真实可售态（运营人工覆盖 status 走 overrides 层，不受此影响）
      p.derivedStatus = o.availableForSale ? 'live' : 'unavailable';
      fields.push('available');
    }
    // 主图：快照补 shopifyImage 基线，之后变更才计数（图片 URL 是 Shopify CDN，与本地 images[] 并存）
    const shopifyImg = o.featuredImage?.url ?? null;
    const prevImg = (p as unknown as { shopifyImage?: string | null }).shopifyImage ?? null;
    if (prevImg !== shopifyImg) {
      (p as unknown as { shopifyImage?: string | null }).shopifyImage = shopifyImg;
      fields.push('image');
    }
    if (fields.length) {
      diff.updated.push({ handle: p.handle, fields });
    } else {
      diff.unchanged++;
    }
  }

  // —— 新增（线上有、快照无，且未被任何既有产品认领）——
  for (const o of online) {
    if (claimed.has(o)) continue;
    const tags = o.tags || [];
    const np: SnapProduct & { shopifyImage?: string | null; shopifyHandle?: string } = {
      handle: o.handle,
      asin: o.handle,
      title: o.title,
      description: o.description,
      productType: 'Others',
      subcategory: null,
      tags: [...tags],
      price: o.price,
      compareAtPrice: o.compareAtPrice,
      available: o.availableForSale,
      hasShopifyData: true,
      images: o.featuredImage ? [o.featuredImage.url] : [],
      derivedStatus: o.availableForSale ? 'live' : 'coming_soon',
      shopifyImage: o.featuredImage?.url ?? null,
      shopifyHandle: o.handle,
    };
    snap.products.push(np);
    diff.added.push({ handle: o.handle, title: o.title, price: o.price });
  }

  return diff;
}

/** 主入口：拉线上 → 同步进 snapshot.json（原子写）→ 返回 diff */
export async function runSync(): Promise<SyncDiff> {
  const creds = getShopifyCreds();
  if (!creds) {
    throw new Error('缺少 Shopify 凭证：请在 .env.local 配置 SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_TOKEN（或保证 VERTEX_ROOT/.env.local 可读）');
  }
  const online = await fetchAllOnline(creds);
  const snap = loadSnapshot(true);
  const diff = applySync(snap, online);
  // 原子写（temp + rename）
  const target = path.join(process.cwd(), 'data', 'snapshot.json');
  const tmp = `${target}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(snap, null, 2));
  fs.renameSync(tmp, target);
  return diff;
}

