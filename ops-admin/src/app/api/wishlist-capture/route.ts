import { NextRequest } from 'next/server';
import { addWishlistCapture, readDb } from '@/lib/db';
import { WISHLIST_TOKEN } from '@/lib/env';
import { corsJson, corsPreflight } from '@/lib/cors';

/**
 * 游客心愿单留资（批次 5 心愿单选品，2026-11-17 设计书任务 1）：
 * vertex 未登录买家收藏商品时弹捕获面板，B 路提交 email + 营销许可落 admin 台账。
 * - POST { productId, email, marketingConsent? } → { ok: true, duplicate?: true }
 *   productId 口径 = product.id（makimoo-ASIN），与 wishlists.handles[] 同 key（聚合无缝）
 * - 鉴权照 /api/wishlist：调用方是 vertex 买家浏览器（无 admin 会话），middleware 放行
 *   （isWishlistApi 前缀 startsWith('/api/wishlist') 已覆盖本路径——见 middleware.ts 注释），
 *   接口内共享密钥自保。**复用 x-wishlist-token，不新增令牌**（cors.ts Allow-Headers 零改动，
 *   规避三次踩坑的 CORS 铁律）
 * - 幂等：同 (productId, email) 重复提交不增行、刷新 marketingConsent 与 at（见 lib/db.ts）
 */
function authorized(req: NextRequest): boolean {
  return (req.headers.get('x-wishlist-token') || '') === WISHLIST_TOKEN;
}

export async function OPTIONS() {
  return corsPreflight();
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return corsJson({ error: '未授权' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const productId = String(body?.productId || '').trim();
  const email = String(body?.email || '').trim();
  const marketingConsent = body?.marketingConsent === true;
  if (!productId || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return corsJson({ error: '缺少 productId 或邮箱格式不合法' }, { status: 400 });
  }
  const duplicate = readDb().wishlistCaptures.some(
    (c) => c.productId.toLowerCase() === productId.toLowerCase() && c.email === email.toLowerCase()
  );
  const record = addWishlistCapture(productId, email, marketingConsent);
  return corsJson(
    { ok: true, ...(duplicate ? { duplicate: true } : {}), at: record.at }
  );
}
