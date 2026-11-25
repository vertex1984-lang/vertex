/**
 * 游客心愿单留资（从 makimoo-admin 迁移到 CF Pages Function + KV，2026-11-23）。
 * 契约与 admin /api/wishlist-capture 完全一致：
 *   POST { productId, email, marketingConsent? } → { ok, duplicate?, at }
 *   同 (productId, email) 重复提交不增行、刷新 marketingConsent 与 at（幂等）
 * 鉴权：复用 x-wishlist-token（与原版一致，不新增令牌，CORS Allow-Headers 零改动）。
 * 存储：KV key = cap:{productId小写}:{email小写}，value = 记录本体。
 * 运营聚合读取：CF API 按前缀 cap:{productId} 列表（KV list）。
 */
import { corsJson, corsPreflight } from './_cors';

interface Env {
  WISHLIST_KV: KVNamespace;
  WISHLIST_TOKEN: string;
}

interface CaptureRecord {
  productId: string;
  email: string;
  marketingConsent: boolean;
  at: string;
}

export const onRequestOptions: PagesFunction = async () => corsPreflight();

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if ((request.headers.get('x-wishlist-token') || '') !== env.WISHLIST_TOKEN) {
    return corsJson({ error: '未授权' }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as
    | { productId?: unknown; email?: unknown; marketingConsent?: unknown }
    | null;
  const productId = String(body?.productId || '').trim();
  const email = String(body?.email || '').trim();
  const marketingConsent = body?.marketingConsent === true;
  if (!productId || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return corsJson({ error: '缺少 productId 或邮箱格式不合法' }, { status: 400 });
  }
  const key = `cap:${productId.toLowerCase()}:${email.toLowerCase()}`;
  const existing = await env.WISHLIST_KV.get<CaptureRecord>(key, 'json');
  const record: CaptureRecord = {
    productId,
    email: email.toLowerCase(),
    marketingConsent,
    at: new Date().toISOString(),
  };
  await env.WISHLIST_KV.put(key, JSON.stringify(record));
  return corsJson({ ok: true, ...(existing ? { duplicate: true } : {}), at: record.at });
};
