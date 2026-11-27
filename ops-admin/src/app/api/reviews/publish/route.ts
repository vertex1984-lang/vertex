import { NextResponse } from 'next/server';
import fs from 'fs';
import { readDb, writeDb } from '@/lib/db';
import { REVIEWS_TARGET } from '@/lib/env';

/**
 * 发布买家评价：只写 approved 到 vertex reviews.json（rejected/pending 不进产物——
 * 任务 2.3「拒绝的不显示」），全量重写幂等自愈。date 为展示口径（发布月份，如 "November 2026"）。
 * vertex 侧重新构建后生效（静态导出构建期读取）。
 */
export async function POST() {
  const db = readDb();
  const approved = db.reviews.filter((r) => r.status === 'approved');
  // 空集合也允许发布（撤下全部前台评价，幂等自愈——与订单/促销发布同一口径）

  const monthOf = (iso?: string): string => {
    const d = iso ? new Date(iso) : new Date();
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  };

  const payload = {
    _comment:
      '由 makimoo-admin（运营后台）评价审核发布时写入的已通过（approved）买家评价。手工勿改：下次发布会整体重写。只含 approved，拒绝的不进此文件。date 为发布时生成的展示口径（如 November 2026）。',
    generatedAt: new Date().toISOString(),
    reviews: approved.map((r) => ({
      handle: r.handle,
      author: r.author?.trim() || 'Anonymous',
      title: r.title || undefined,
      text: r.text,
      rating: r.rating,
      date: monthOf(r.moderatedAt || r.at),
    })),
  };

  try {
    fs.writeFileSync(REVIEWS_TARGET, JSON.stringify(payload, null, 2));
  } catch (e) {
    return NextResponse.json({ error: `写入 vertex 失败：${(e as Error).message}` }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    reviews: payload.reviews.length,
    pendingRemaining: db.reviews.filter((r) => r.status === 'pending').length,
    target: REVIEWS_TARGET,
  });
}
