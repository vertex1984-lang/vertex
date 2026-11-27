import { NextRequest, NextResponse } from 'next/server';
import { readDb, upsertPromotion, removePromotion } from '@/lib/db';
import { promotionStageOf } from '@/lib/promotion';

/** 促销活动（批次 1：banner / flash）：GET 列表（含现算档期状态）/ POST 新增或覆盖 / DELETE ?id= */
export async function GET() {
  const db = readDb();
  const now = Date.now();
  return NextResponse.json({
    items: db.promotions.map((p) => ({ ...p, stage: promotionStageOf(p, now) })),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const type = body?.type === 'flash' ? 'flash' : body?.type === 'banner' ? 'banner' : '';
  const name = String(body?.name || '').trim();
  const bannerLine = String(body?.bannerLine || '').trim();
  const discountLabel = String(body?.discountLabel || '').trim();
  const start = body?.start ? new Date(String(body.start)).toISOString() : '';
  const end = body?.end ? new Date(String(body.end)).toISOString() : '';
  if (!type || !name || !bannerLine || !discountLabel || !start || !end) {
    return NextResponse.json(
      { error: '缺少必填字段（type / name / bannerLine / discountLabel / start / end）' },
      { status: 400 }
    );
  }
  if (new Date(end).getTime() <= new Date(start).getTime()) {
    return NextResponse.json({ error: '结束时间必须晚于开始时间' }, { status: 400 });
  }
  const entry = upsertPromotion({
    type,
    name,
    bannerLine,
    discountLabel,
    start,
    end,
    // 折扣码占位：批次 1 不同步 Shopify（等闸门 A Admin API token），仅落台账
    code: body?.code ? String(body.code).trim() : undefined,
    note: body?.note ? String(body.note) : undefined,
  });
  return NextResponse.json({ ok: true, entry: { ...entry, stage: promotionStageOf(entry) } });
}

export async function DELETE(req: NextRequest) {
  const id = (req.nextUrl.searchParams.get('id') || '').trim();
  if (!id) return NextResponse.json({ error: '缺少 id' }, { status: 400 });
  const ok = removePromotion(id);
  return NextResponse.json({ ok, error: ok ? undefined : '活动不存在' }, { status: ok ? 200 : 404 });
}
