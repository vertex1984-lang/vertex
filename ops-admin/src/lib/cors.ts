import { NextResponse } from 'next/server';

/**
 * 买家级接口 CORS（批次 3 验收 P0-1 修复，2026-11-13）：vertex 前台（:3000）浏览器
 * 跨域调用 admin（:4200）的 /api/wishlist 与 /api/reviews（POST），带自定义头
 * （x-wishlist-token / x-review-token）必触发预检——预检 204 与实际响应缺一不可带
 * 本组头，否则浏览器直接 Failed to fetch（验收实测复现）。
 * 演示版 Allow-Origin=*；正式版收前台域名白名单（与共享密钥换环境变量同批评审）。
 *
 * ⚠ 铁律（2026-11-15 验收 P1 教训，已踩三次）：**每新增一个共享令牌（x-*-token），
 * 必须同步更新下方 Allow-Headers 白名单**——浏览器预检按 Access-Control-Request-Headers
 * 逐项校验，漏一个 = 该链路前台全挂；而 API 直连（curl/会话内）一切正常，极具迷惑性。
 * 历史踩坑：x-wishlist-token（批次 2）→ x-review-token（批次 3）→ x-notify-token（分层）→
 * x-rewards-token（2026-11-21 登录激励批次）。
 */
export const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-wishlist-token, x-review-token, x-notify-token, x-rewards-token',
};

/** 预检应答（/api/wishlist 与 /api/reviews 的 OPTIONS handler 统一用它） */
export function corsPreflight(): NextResponse {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/** NextResponse.json + CORS 头：无 ACAO 的响应浏览器读不到（含 4xx 错误体，fetch 直接 reject） */
export function corsJson(body: unknown, init?: ResponseInit): NextResponse {
  const res = NextResponse.json(body, init);
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.headers.set(k, v);
  return res;
}
