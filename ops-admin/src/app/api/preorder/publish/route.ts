import { NextResponse } from 'next/server';
import fs from 'fs';
import { readDb, writeDb } from '@/lib/db';
import { PREORDER_TARGET, SHOPIFY_MAP_SOURCE } from '@/lib/env';

/**
 * 从 vertex shopify-map.ts 源文本解析 slug→shopifyHandle（生成文件格式稳定，文本解析即可）。
 * 发布时把解析结果写入预售配置，vertex 端不再引用全量 SHOPIFY_MAP（防客户端包膨胀）。
 */
function loadShopifyHandles(): Map<string, string> {
  const map = new Map<string, string>();
  try {
    const raw = fs.readFileSync(SHOPIFY_MAP_SOURCE, 'utf8');
    const re = /"([a-zA-Z0-9-]+)":\s*\{[\s\S]*?shopifyHandle:\s*"([^"]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(raw)) !== null) map.set(m[1], m[2]);
  } catch {
    // map 缺失时 shopifyHandle 留空，购物车行交期提示退化（PDP/PLP 不受影响）
  }
  return map;
}

/** 站内 handle 尾部最长匹配 slug，得到 shopifyHandle */
function resolveShopifyHandle(siteHandle: string, slugMap: Map<string, string>): string | undefined {
  let bestLen = -1;
  let best: string | undefined;
  for (const [slug, sh] of slugMap) {
    if (siteHandle.endsWith(slug) && slug.length > bestLen) {
      bestLen = slug.length;
      best = sh;
    }
  }
  return best;
}

/**
 * 发布预售配置：published 条目全量重写 vertex admin-preorder.json（幂等自愈）；
 * pending → published。发布后需在 vertex 侧重新构建生效（静态站构建期读取该文件）。
 */
export async function POST() {
  const db = readDb();
  const published = db.preorder.filter((e) => e.status === 'published' || e.status === 'pending');
  const pendingCount = db.preorder.filter((e) => e.status === 'pending').length;
  if (db.preorder.length === 0) {
    return NextResponse.json({ error: '暂无预售配置可发布' }, { status: 400 });
  }

  const slugMap = loadShopifyHandles();
  const payload = {
    _comment: '由 makimoo-admin（运营后台）发布时写入的预售配置。手工勿改：下次发布会整体重写。sale = 全站横幅口径；shopifyHandle 发布时自动解析（勿手填）。',
    generatedAt: new Date().toISOString(),
    sale: db.preorderSale,
    configs: published.map((e) => ({
      handle: e.handle,
      shopifyHandle: resolveShopifyHandle(e.handle, slugMap),
      regularPrice: e.regularPrice,
      arrivesLabel: e.arrivesLabel,
      arrivesShort: e.arrivesShort,
      deadline: e.deadline,
      deadlineLabel: e.deadlineLabel,
      reason: e.reason,
    })),
  };

  try {
    fs.writeFileSync(PREORDER_TARGET, JSON.stringify(payload, null, 2));
  } catch (e) {
    return NextResponse.json({ error: `写入 vertex 失败：${(e as Error).message}` }, { status: 500 });
  }

  const now = new Date().toISOString();
  for (const e of db.preorder) {
    if (e.status === 'pending') {
      e.status = 'published';
      e.publishedAt = now;
    }
  }
  writeDb(db);

  return NextResponse.json({ ok: true, configs: published.length, pendingPublished: pendingCount, target: PREORDER_TARGET });
}
