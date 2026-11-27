import { NextRequest, NextResponse } from 'next/server';
import { readDb, removeChange } from '@/lib/db';

/** 变更清单：pending + published + 新品记录 */
export async function GET() {
  const db = readDb();
  return NextResponse.json({
    pending: db.changes.filter((c) => c.status === 'pending'),
    published: db.changes.filter((c) => c.status === 'published'),
    newPending: db.newProducts.filter((r) => r.status === 'pending'),
    newPublished: db.newProducts.filter((r) => r.status === 'published'),
  });
}

/** 撤销一条 pending 修改 */
export async function DELETE(req: NextRequest) {
  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: '缺少 id' }, { status: 400 });
  const ok = removeChange(String(id));
  return NextResponse.json({ ok, removed: ok ? String(id) : null });
}
