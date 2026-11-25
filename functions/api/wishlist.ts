/**
 * 心愿单云（从 makimoo-admin 迁移到 CF Pages Function + KV，2026-11-23）。
 * 契约与 admin /api/wishlist 完全一致：
 *   GET  ?customerId=          → { handles }
 *   POST { customerId, handles[] } → { ok, count, at }（去重覆盖式保存）
 * 鉴权：x-wishlist-token 共享密钥（与前端 NEXT_PUBLIC_WISHLIST_TOKEN 同值，
 * 会随 JS 下发，属防扫不防盗级别，与原版设计口径一致）。
 * 存储：KV key = wl:{customerId}，value = { handles: string[], at: string }。
 */
import { corsJson, corsPreflight } from './_cors';

interface Env {
  WISHLIST_KV: KVNamespace;
  WISHLIST_TOKEN: string;
}

function authorized(req: Request, env: Env): boolean {
  return (req.headers.get('x-wishlist-token') || '') === env.WISHLIST_TOKEN;
}

export const onRequestOptions: PagesFunction = async () => corsPreflight();

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!authorized(request, env)) return corsJson({ error: '未授权' }, { status: 401 });
  const customerId = (new URL(request.url).searchParams.get('customerId') || '').trim();
  if (!customerId) return corsJson({ error: '缺少 customerId' }, { status: 400 });
  const record = await env.WISHLIST_KV.get<{ handles: string[] }>(`wl:${customerId}`, 'json');
  return corsJson({ handles: record?.handles ?? [] });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!authorized(request, env)) return corsJson({ error: '未授权' }, { status: 401 });
  const body = (await request.json().catch(() => null)) as
    | { customerId?: unknown; handles?: unknown }
    | null;
  const customerId = String(body?.customerId || '').trim();
  const handles = Array.isArray(body?.handles)
    ? body.handles.map((h) => String(h).trim()).filter(Boolean)
    : null;
  if (!customerId || handles === null) {
    return corsJson({ error: '缺少必填字段（customerId / handles[]）' }, { status: 400 });
  }
  const saved = { handles: Array.from(new Set(handles)), at: new Date().toISOString() };
  await env.WISHLIST_KV.put(`wl:${customerId}`, JSON.stringify(saved));
  return corsJson({ ok: true, count: saved.handles.length, at: saved.at });
};
