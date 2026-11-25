/**
 * Pages Function：订单状态查询（免登录查单，2026-11-23 从仓库静态文件迁移到 KV）。
 *
 * 数据流：makimoo-admin（Lighthouse）发布 → Cloudflare API 写 KV（key = latest）
 *        → 本 Function 拦截 GET /data/order-status.json → 读 KV 返回。
 * 契约与历史静态文件 public/data/order-status.json 完全一致（{ generatedAt, orders[] }，
 * orders 内只有 16 位 emailHash，无邮箱明文，本来就按公开可读设计）。
 *
 * 注意：若构建产物 out/data/order-status.json 仍存在，静态资源优先于 Function，
 * 本 Function 不会执行——切换 KV 发布链路后需从仓库删除该静态文件（admin 停写）。
 */

interface Env {
  ORDER_STATUS_KV: KVNamespace;
}

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  // 订单状态高频更新，禁止任何缓存（与 admin 发布秒级生效的口径一致）
  'Cache-Control': 'no-store',
};

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const body = await env.ORDER_STATUS_KV.get('latest', 'text');
  if (!body) {
    // KV 未初始化：按"无订单"处理，追踪页走既有的未命中提示
    return new Response(JSON.stringify({ orders: [] }), { status: 200, headers: JSON_HEADERS });
  }
  return new Response(body, { status: 200, headers: JSON_HEADERS });
};
