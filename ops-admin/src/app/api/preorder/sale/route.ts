import { NextRequest, NextResponse } from 'next/server';
import { readDb, updatePreorderSale } from '@/lib/db';

/** 全站横幅口径：GET 读取 / POST 修改 */
export async function GET() {
  return NextResponse.json({ sale: readDb().preorderSale });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const deadline = (body?.deadline || '').trim();
  const deadlineLabel = (body?.deadlineLabel || '').trim();
  const bannerLine = (body?.bannerLine || '').trim();
  if (!deadline || !deadlineLabel || !bannerLine) {
    return NextResponse.json({ error: '缺少必填字段（deadline / deadlineLabel / bannerLine）' }, { status: 400 });
  }
  updatePreorderSale({ deadline, deadlineLabel, bannerLine });
  return NextResponse.json({ ok: true, sale: { deadline, deadlineLabel, bannerLine } });
}
