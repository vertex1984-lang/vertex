import { NextRequest, NextResponse } from 'next/server';
import { findEffective, loadSnapshot } from '@/lib/snapshot';
import { readDb, removeChangesByField, upsertChange, type ChangeEntry } from '@/lib/db';

const STATUSES = ['live', 'coming_soon', 'hidden'];

export async function GET(_req: NextRequest, { params }: { params: { handle: string } }) {
  const p = findEffective(params.handle);
  if (!p) return NextResponse.json({ error: '商品不存在' }, { status: 404 });
  const db = readDb();
  const changes = db.changes.filter((c) => c.handle === params.handle);
  return NextResponse.json({ product: p, changes });
}

/** 保存修改：只对真正变化的字段建 pending 条目；与基线相同则清除 pending（等效撤销） */
export async function PATCH(req: NextRequest, { params }: { params: { handle: string } }) {
  const p = findEffective(params.handle);
  if (!p) return NextResponse.json({ error: '商品不存在' }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: '请求格式错误' }, { status: 400 });

  const db = readDb();
  // 基线 = 快照 + 已发布覆盖
  const base: Record<string, string> = {};
  for (const c of db.changes) {
    if (c.handle === params.handle && c.status === 'published') base[c.field] = c.newValue;
  }
  base.title = base.title ?? p.title;
  base.price = base.price ?? String(p.price);
  base.compareAtPrice = base.compareAtPrice ?? (p.compareAtPrice == null ? '' : String(p.compareAtPrice));
  base.status = base.status ?? p.status;

  const results: string[] = [];
  const by = 'admin'; // 演示版单账号

  const wantTitle = typeof body.title === 'string' ? body.title.trim() : undefined;
  if (wantTitle !== undefined && wantTitle !== base.title) {
    upsertChange({ handle: params.handle, field: 'title', oldValue: base.title, newValue: wantTitle, note: body.note, by });
    results.push('title');
  } else if (wantTitle !== undefined && wantTitle === base.title) {
    clearPending(params.handle, 'title');
  }

  const num = (v: unknown) => (v === '' || v == null ? '' : String(Number(v)));
  const wantPrice = body.price !== undefined ? num(body.price) : undefined;
  if (wantPrice !== undefined) {
    if (wantPrice === '' || Number.isNaN(Number(wantPrice))) {
      return NextResponse.json({ error: '价格格式不正确' }, { status: 400 });
    }
    if (wantPrice !== base.price) {
      upsertChange({ handle: params.handle, field: 'price', oldValue: base.price, newValue: wantPrice, note: body.note, by });
      results.push('price');
    } else {
      clearPending(params.handle, 'price');
    }
  }

  const wantCompare = body.compareAtPrice !== undefined ? num(body.compareAtPrice) : undefined;
  if (wantCompare !== undefined && wantCompare !== '' && Number.isNaN(Number(wantCompare))) {
    return NextResponse.json({ error: '划线价格式不正确' }, { status: 400 });
  }
  if (wantCompare !== undefined && wantCompare !== base.compareAtPrice) {
    upsertChange({ handle: params.handle, field: 'compareAtPrice', oldValue: base.compareAtPrice, newValue: wantCompare, note: body.note, by });
    results.push('compareAtPrice');
  } else if (wantCompare !== undefined) {
    clearPending(params.handle, 'compareAtPrice');
  }

  const wantStatus = typeof body.status === 'string' ? body.status : undefined;
  if (wantStatus !== undefined) {
    if (!STATUSES.includes(wantStatus)) {
      return NextResponse.json({ error: '状态值不合法' }, { status: 400 });
    }
    if (wantStatus !== base.status) {
      upsertChange({ handle: params.handle, field: 'status', oldValue: base.status, newValue: wantStatus, note: body.note, by });
      results.push('status');
    } else {
      clearPending(params.handle, 'status');
    }
  }

  // 批次 3 任务 3.1/3.2：描述 / 主图覆盖。撤销口径 = 提交空值删除该字段全部条目
  //（pending+published，改回原值=撤销覆盖）；主图 newValue 为 /images/products/<asin>/ 下新上传图的站内 URL
  const wantDescription = typeof body.description === 'string' ? body.description.trim() : undefined;
  if (wantDescription !== undefined) {
    if (wantDescription.length > 5000) {
      return NextResponse.json({ error: '描述过长（≤5000 字符）' }, { status: 400 });
    }
    if (wantDescription.length > 0) {
      // 批次 3+ 快照带基线：oldValue = 当前生效文案（快照+覆盖归并，findEffective 已算好）；
      // 与生效值相同 = 无变化 → 不建/不动 pending（防止把预填文案误存成覆盖）
      const baseDesc = p.description ?? '';
      if (wantDescription !== baseDesc) {
        upsertChange({ handle: params.handle, field: 'description', oldValue: baseDesc, newValue: wantDescription, note: body.note, by });
        results.push('description');
      }
    } else {
      removeChangesByField(params.handle, 'description');
    }
  }

  const wantFeatured = typeof body.featuredImage === 'string' ? body.featuredImage.trim() : undefined;
  if (wantFeatured !== undefined) {
    if (wantFeatured.length > 0) {
      if (!wantFeatured.startsWith('/images/products/')) {
        return NextResponse.json({ error: '主图 URL 非法（应为 /images/products/ 下路径）' }, { status: 400 });
      }
      upsertChange({ handle: params.handle, field: 'featuredImage', oldValue: '', newValue: wantFeatured, note: body.note, by });
      results.push('featuredImage');
    } else {
      removeChangesByField(params.handle, 'featuredImage');
    }
  }

  return NextResponse.json({ ok: true, changed: results });
}

function clearPending(handle: string, field: ChangeEntry['field'] | string) {
  removeChangesByField(handle, field as ChangeEntry['field']);
}
