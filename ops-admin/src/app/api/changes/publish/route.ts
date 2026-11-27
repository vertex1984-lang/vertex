import { NextResponse } from 'next/server';
import fs from 'fs';
import { readDb, writeDb, type ChangeEntry } from '@/lib/db';
import { OVERRIDES_TARGET, ADMIN_PRODUCTS_TARGET } from '@/lib/env';
import { buildAdminProductsPayload } from '@/lib/newproduct';

/**
 * 发布：① 商品字段修改 → vertex admin-overrides.json（字段覆盖，vertex 侧待接入）
 *      ② 新品记录 → vertex admin-products.json（vertex 已接入，构建时合并进 PRODUCTS_DATA）
 * pending 全部标记为 published；产物全量重写（幂等，可重复发布自愈）。
 */
export async function POST() {
  const db = readDb();
  const pending = db.changes.filter((c) => c.status === 'pending');
  const pendingNew = db.newProducts.filter((r) => r.status === 'pending');
  // 批次 3：撤销全部覆盖后再发布（无 pending）也合法——覆盖产物全量重建（幂等自愈），不再拦截空发布

  const now = new Date().toISOString();

  // ① 字段覆盖（批次 3 修复：payload 基于 **pending + published 全量** 归并重建——
  // 旧逻辑只写 pending，导致撤销已发布覆盖后再发布别的字段时，文件里残留旧值/丢失生效值；
  // 归并时 pending 优先于 published（pending 是最新意图，同 getOverrides 口径），幂等自愈。
  // 撤销全部覆盖 = 空覆盖文件，同样是合法产物——**始终重写**）
  let overridesCount = 0;
  {
    const latest = new Map<string, ChangeEntry>();
    for (const c of db.changes) {
      if (c.status !== 'pending' && c.status !== 'published') continue;
      const key = `${c.handle}::${c.field}`;
      const prev = latest.get(key);
      if (!prev || (c.status === 'pending' && prev.status !== 'pending') || (c.at > prev.at)) {
        latest.set(key, c);
      }
    }
    const titles: Record<string, string> = {};
    const prices: Record<string, string> = {};
    const compareAtPrices: Record<string, string> = {};
    const statuses: Record<string, string> = {};
    // 批次 3 任务 3.1/3.2：描述与主图覆盖（vertex products.ts enrich 已消费）
    const descriptions: Record<string, string> = {};
    const featuredImages: Record<string, string> = {};
    for (const c of latest.values()) {
      if (c.field === 'title') titles[c.handle] = c.newValue;
      else if (c.field === 'price') prices[c.handle] = c.newValue;
      else if (c.field === 'compareAtPrice') compareAtPrices[c.handle] = c.newValue;
      else if (c.field === 'status') statuses[c.handle] = c.newValue;
      else if (c.field === 'description') descriptions[c.handle] = c.newValue;
      else if (c.field === 'featuredImage') featuredImages[c.handle] = c.newValue;
    }
    const payload = {
      _comment: '由 makimoo-admin 生成的运营字段覆盖（演示版）。批次 3 起 vertex 已消费 descriptions/featuredImage（PDP 描述与主图覆盖，构建期生效；改回原值=后台清空字段再发布，发布全量重建幂等自愈）；titles/prices/compareAtPrices/statuses 为原有字段（vertex 侧暂不消费）。新品走 admin-products.json。',
      generatedAt: now,
      counts: {
        titles: Object.keys(titles).length,
        prices: Object.keys(prices).length,
        compareAtPrices: Object.keys(compareAtPrices).length,
        statuses: Object.keys(statuses).length,
        descriptions: Object.keys(descriptions).length,
        featuredImage: Object.keys(featuredImages).length,
      },
      titles,
      prices,
      compareAtPrices,
      statuses,
      descriptions,
      // 任务书 3.2 字段名口径：featuredImage（单数）= Record<handle, url>
      featuredImage: featuredImages,
    };
    try {
      fs.writeFileSync(OVERRIDES_TARGET, JSON.stringify(payload, null, 2));
    } catch (e) {
      return NextResponse.json({ error: `写入 vertex 失败：${(e as Error).message}` }, { status: 500 });
    }
    overridesCount = pending.length;
  }

  // ② 状态翻转：pending → published（产物按 published 全量构建）
  for (const c of db.changes) {
    if (c.status === 'pending') {
      c.status = 'published';
      c.publishedAt = now;
    }
  }
  for (const r of db.newProducts) {
    if (r.status === 'pending') {
      r.status = 'published';
      r.publishedAt = now;
    }
  }

  // ③ 新品 + 变体组产物（全量已发布记录重写，自愈式）
  let newProductsCount = 0;
  let variantGroupsCount = 0;
  if (db.newProducts.length > 0) {
    const newPayload = buildAdminProductsPayload(db.newProducts);
    try {
      fs.writeFileSync(ADMIN_PRODUCTS_TARGET, JSON.stringify(newPayload, null, 2));
    } catch (e) {
      return NextResponse.json({ error: `写入新品文件失败：${(e as Error).message}` }, { status: 500 });
    }
    newProductsCount = newPayload.products.length;
    variantGroupsCount = newPayload.variantGroups.length;
  }

  writeDb(db);

  return NextResponse.json({
    ok: true,
    published: overridesCount,
    newProducts: newProductsCount,
    variantGroups: variantGroupsCount,
    target: OVERRIDES_TARGET,
    adminProductsTarget: ADMIN_PRODUCTS_TARGET,
  });
}
