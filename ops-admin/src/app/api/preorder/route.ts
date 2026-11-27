import { NextRequest, NextResponse } from 'next/server';
import { readDb, upsertPreorderEntry, removePreorderEntry } from '@/lib/db';

/** 预售配置：GET 列表 / POST 新增或覆盖 / DELETE ?handle= */
export async function GET() {
  const db = readDb();
  return NextResponse.json({ items: db.preorder, sale: db.preorderSale });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const handle = (body?.handle || '').trim();
  if (!handle || !body?.regularPrice || !body?.arrivesLabel || !body?.arrivesShort || !body?.deadline || !body?.deadlineLabel || !body?.reason) {
    return NextResponse.json({ error: '缺少必填字段（handle / regularPrice / arrivesLabel / arrivesShort / deadline / deadlineLabel / reason）' }, { status: 400 });
  }
  const entry = upsertPreorderEntry({
    handle,
    title: (body.title || handle).trim(),
    regularPrice: String(body.regularPrice),
    arrivesLabel: String(body.arrivesLabel),
    arrivesShort: String(body.arrivesShort),
    deadline: String(body.deadline),
    deadlineLabel: String(body.deadlineLabel),
    reason: String(body.reason),
    note: body.note ? String(body.note) : undefined,
  });
  return NextResponse.json({ ok: true, entry });
}

export async function DELETE(req: NextRequest) {
  const handle = (req.nextUrl.searchParams.get('handle') || '').trim();
  if (!handle) return NextResponse.json({ error: '缺少 handle' }, { status: 400 });
  const ok = removePreorderEntry(handle);
  return NextResponse.json({ ok, error: ok ? undefined : '条目不存在' }, { status: ok ? 200 : 404 });
}
