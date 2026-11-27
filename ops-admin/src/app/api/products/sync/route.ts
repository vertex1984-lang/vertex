import { NextResponse } from 'next/server';
import { runSync } from '@/lib/shopify-sync';

/**
 * 「从线上同步商品」（2026-11-26 线上版批次）：POST 即从 Shopify Storefront API（前台线上同源）
 * 拉全量商品 → 幂等合并进 data/snapshot.json → 返回 diff 摘要（新增 X / 更新 Y / 下架 Z）。
 * 会话保护由 middleware 承担。失败返回 400/500 与原因（凭证缺失 / GraphQL 错误等）。
 */
export async function POST() {
  try {
    const diff = await runSync();
    return NextResponse.json({ ok: true, diff });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
