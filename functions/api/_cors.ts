/** Pages Functions 共用 CORS 工具（2026-11-23 买家侧 API 迁移到 CF）。
 * 生产走同域（/api/...），CORS 仅作兜底（预览域名、本地联调）。
 * Allow-Headers 必须覆盖所有自定义头（x-wishlist-token 等），与 admin cors.ts 铁律一致。
 */

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-wishlist-token, x-rewards-token, x-review-token, x-notify-token',
  'Access-Control-Max-Age': '86400',
};

export function corsJson(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...CORS_HEADERS,
      ...(init.headers || {}),
    },
  });
}

export function corsPreflight(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
