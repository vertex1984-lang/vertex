import { NextRequest, NextResponse } from 'next/server';
import { addNewProducts, readDb, removeNewProduct } from '@/lib/db';
import { generateDrafts, type WizardPayload } from '@/lib/newproduct';
import { loadSnapshot } from '@/lib/snapshot';

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as WizardPayload | null;
  if (!body) return NextResponse.json({ error: '请求格式错误' }, { status: 400 });

  // 必填校验
  if (!body.seriesTitle?.trim()) return NextResponse.json({ error: '系列名称必填' }, { status: 400 });
  if (!body.productType) return NextResponse.json({ error: '请选择类目' }, { status: 400 });
  if (!body.description?.trim()) return NextResponse.json({ error: '商品描述必填' }, { status: 400 });
  if (body.launch === 'live' && !(Number(body.price) > 0)) {
    return NextResponse.json({ error: '直接上架必须填写大于 0 的价格（未定价请选 Coming Soon）' }, { status: 400 });
  }
  if (body.launch === 'live' && body.price && Number.isNaN(Number(body.price))) {
    return NextResponse.json({ error: '价格格式不正确' }, { status: 400 });
  }

  const drafts = generateDrafts(body);
  if (drafts.length === 0) return NextResponse.json({ error: '未生成任何商品记录' }, { status: 400 });

  // 唯一性校验：handle/asin 不得与快照、已存在的新品记录冲突
  const snap = loadSnapshot();
  const takenHandles = new Set(snap.products.map((p) => p.handle.toLowerCase()));
  const takenAsins = new Set(snap.products.map((p) => p.asin.toLowerCase()));
  const db = readDb();
  for (const r of db.newProducts) {
    takenHandles.add(r.draft.handle.toLowerCase());
    takenAsins.add(r.draft.asin.toLowerCase());
  }
  const conflicts: string[] = [];
  for (const d of drafts) {
    if (takenHandles.has(d.handle.toLowerCase())) conflicts.push(`handle 已存在：${d.handle}`);
    if (takenAsins.has(d.asin.toLowerCase())) conflicts.push(`ASIN 已存在：${d.asin}`);
  }
  if (conflicts.length > 0) {
    return NextResponse.json({ error: `命名冲突（换个系列名或检查尺寸花色拼写）：${conflicts.slice(0, 3).join('；')}` }, { status: 409 });
  }

  const batchId = `batch-${Date.now().toString(36)}`;
  const now = new Date().toISOString();
  const records = drafts.map((draft, i) => ({
    id: `${batchId}-${i}`,
    batchId,
    status: 'pending' as const,
    createdAt: now,
    by: 'admin',
    draft,
  }));
  addNewProducts(records);

  return NextResponse.json({ ok: true, batchId, count: records.length, handles: records.map((r) => r.draft.handle) });
}

/** 撤销：id 传单条记录 id 或整个 batchId */
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: '缺少 id' }, { status: 400 });
  const ok = removeNewProduct(id);
  return NextResponse.json({ ok, removed: ok ? id : null });
}
