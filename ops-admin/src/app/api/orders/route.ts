import { NextRequest, NextResponse } from 'next/server';
import { advanceOrder, readDb, removeOrder, upsertOrder } from '@/lib/db';
import { MILESTONE_KEYS, type MilestoneKey } from '@/lib/order';

/** 订单台账：GET 列表 / POST 录入（基础字段）或推进（带 advance）/ DELETE ?orderNo=
 *  TODO(闸门 A)：Admin API 到位后订单自动回流（Shopify 新单自动建台账、fulfillment
 *  状态联动推进里程碑），届时本接口退化为人工修正/补录通道。
 */

/** 录入：订单号、邮箱、商品（标题×数量）、到货窗口文案 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const orderNo = String(body?.orderNo || '').trim();
  const email = String(body?.email || '').trim();
  const promiseLabel = String(body?.promiseLabel || '').trim();

  // 推进分支：advance = { key, note?, photo? }
  if (body?.advance) {
    const key = String(body.advance.key || '') as MilestoneKey;
    if (!orderNo) return NextResponse.json({ error: '缺少订单号' }, { status: 400 });
    if (!MILESTONE_KEYS.includes(key)) {
      return NextResponse.json({ error: `非法里程碑 key（${MILESTONE_KEYS.length} 段：${MILESTONE_KEYS.join(' / ')}）` }, { status: 400 });
    }
    const order = advanceOrder(orderNo, key, {
      note: body.advance.note ? String(body.advance.note) : undefined,
      photo: body.advance.photo ? String(body.advance.photo) : undefined,
    });
    if (!order) return NextResponse.json({ error: '订单不存在' }, { status: 404 });
    return NextResponse.json({ ok: true, order });
  }

  if (!orderNo || !email || !promiseLabel) {
    return NextResponse.json({ error: '缺少必填字段（orderNo / email / promiseLabel）' }, { status: 400 });
  }
  const rawItems = Array.isArray(body?.items) ? body.items : [];
  const items = rawItems
    .map((it: { title?: unknown; qty?: unknown }) => ({
      title: String(it?.title || '').trim(),
      qty: Math.max(1, Math.floor(Number(it?.qty) || 1)),
    }))
    .filter((it: { title: string }) => it.title.length > 0);
  if (items.length === 0) {
    return NextResponse.json({ error: '至少一件商品（items[].title）' }, { status: 400 });
  }

  const order = upsertOrder({ orderNo, email, items, promiseLabel, note: body?.note ? String(body.note) : undefined });
  return NextResponse.json({ ok: true, order });
}

export async function GET() {
  const db = readDb();
  return NextResponse.json({ items: db.orders });
}

export async function DELETE(req: NextRequest) {
  const orderNo = (req.nextUrl.searchParams.get('orderNo') || '').trim();
  if (!orderNo) return NextResponse.json({ error: '缺少 orderNo' }, { status: 400 });
  const ok = removeOrder(orderNo);
  return NextResponse.json({ ok, error: ok ? undefined : '订单不存在' }, { status: ok ? 200 : 404 });
}
