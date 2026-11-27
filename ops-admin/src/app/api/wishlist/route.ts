import { NextRequest, NextResponse } from 'next/server';
import { getWishlist, setWishlist } from '@/lib/db';
import { WISHLIST_TOKEN } from '@/lib/env';
import { corsJson, corsPreflight } from '@/lib/cors';

/**
 * 心愿单云（批次 2 买家账号 MVP，vertex /account/wishlist 专用只写接口）：
 * GET ?customerId= → { handles }（拉取合并的云端一侧）
 * POST { customerId, handles } → 覆盖式保存（vertex 合并后回写）
 * OPTIONS → CORS 预检应答（批次 3 验收 P0-1：浏览器跨域带自定义头必预检）
 *
 * 鉴权：调用方是 vertex 买家浏览器（无 admin 会话），middleware 已放行本路径，
 * 改为接口内共享密钥自保（x-wishlist-token header === WISHLIST_TOKEN，
 * 演示版默认值两侧一致，正式版换环境变量防扫描；非 bank-grade，闸门 A 后评审）。
 */
function authorized(req: NextRequest): boolean {
  return (req.headers.get('x-wishlist-token') || '') === WISHLIST_TOKEN;
}

export async function OPTIONS() {
  return corsPreflight();
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return corsJson({ error: '未授权' }, { status: 401 });
  const customerId = (req.nextUrl.searchParams.get('customerId') || '').trim();
  if (!customerId) return corsJson({ error: '缺少 customerId' }, { status: 400 });
  return corsJson({ handles: getWishlist(customerId) });
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return corsJson({ error: '未授权' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const customerId = String(body?.customerId || '').trim();
  const handles = Array.isArray(body?.handles)
    ? body.handles.map((h: unknown) => String(h).trim()).filter(Boolean)
    : null;
  if (!customerId || handles === null) {
    return corsJson({ error: '缺少必填字段（customerId / handles[]）' }, { status: 400 });
  }
  const saved = setWishlist(customerId, Array.from(new Set(handles)));
  return corsJson({ ok: true, count: saved.handles.length, at: saved.at });
}
