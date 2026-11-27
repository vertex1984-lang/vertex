import { NextResponse } from 'next/server';
import fs from 'fs';
import { readDb, writeDb } from '@/lib/db';
import { PROMOTIONS_TARGET } from '@/lib/env';

/**
 * 发布促销活动：全量重写 vertex admin-promotions.json（含全部档期，构建期/客户端按
 * start≤now≤end 现算"在线"，到期前端自动回退无需重发），幂等自愈；pending → published。
 * 折扣码仅落后台台账，不进发布产物（批次 1 不同步 Shopify，等闸门 A）。
 */
export async function POST() {
  const db = readDb();
  const pendingCount = db.promotions.filter((p) => p.status === 'pending').length;
  // 空活动表也允许发布（撤下全部活动，横幅回退预售/免邮，幂等自愈）

  const payload = {
    _comment:
      '由 makimoo-admin（运营后台）发布时写入的促销活动配置。手工勿改：下次发布会整体重写。批次 1 只有 banner / flash 两种；在线判定 start≤now≤end（构建期过滤 + 客户端倒计时双保险，到期自动回退预售/免邮文案）。折扣码字段不出现在发布产物（批次 1 不同步 Shopify）。',
    generatedAt: new Date().toISOString(),
    promotions: db.promotions.map((p) => ({
      type: p.type,
      name: p.name,
      bannerLine: p.bannerLine,
      discountLabel: p.discountLabel,
      start: p.start,
      end: p.end,
    })),
  };

  try {
    fs.writeFileSync(PROMOTIONS_TARGET, JSON.stringify(payload, null, 2));
  } catch (e) {
    return NextResponse.json({ error: `写入 vertex 失败：${(e as Error).message}` }, { status: 500 });
  }

  const now = new Date().toISOString();
  for (const p of db.promotions) {
    if (p.status === 'pending') {
      p.status = 'published';
      p.publishedAt = now;
    }
  }
  writeDb(db);

  return NextResponse.json({
    ok: true,
    promotions: payload.promotions.length,
    pendingPublished: pendingCount,
    target: PROMOTIONS_TARGET,
  });
}
