import { NextResponse } from 'next/server';
import fs from 'fs';
import { readDb, writeDb } from '@/lib/db';
import {
  CF_KV_ORDER_STATUS_ID,
  ORDER_STATUS_TARGET_PUBLIC,
  ORDER_STATUS_TARGET_SRC,
  VERTEX_ROOT,
} from '@/lib/env';
import { cfKvPut } from '@/lib/cf-kv';
import { orderEmailHash } from '@/lib/order';

/**
 * 发布订单台账（2026-11-25 改造）：主通道 = 直写 Cloudflare KV（key=latest），
 * 站点 Pages Function /data/order-status.json 直读，发布即时生效、无需重建。
 * vertex 两处 JSON（src 留档 + public 运行时）降级为可选副本：仅当本地存在
 * vertex 仓库时双写（兼容旧链路）；服务器上没有仓库则跳过，不再视为失败。
 * 发布产物只含 emailHash（sha256 前 16 位），绝无邮箱明文；pending → published。
 */
export async function POST() {
  const db = readDb();
  const pendingCount = db.orders.filter((o) => o.status === 'pending').length;
  // 空台账也允许发布（清空前台查单数据，幂等自愈）

  const payload = {
    _comment:
      '由 makimoo-admin（运营后台）订单台账发布时写入。手工勿改：下次发布会整体重写。orders 内只有 emailHash（sha256 前 16 位），绝无邮箱明文。',
    generatedAt: new Date().toISOString(),
    orders: db.orders.map((o) => ({
      orderNo: o.orderNo,
      emailHash: orderEmailHash(o.email, o.orderNo),
      items: o.items.map((it) => ({ title: it.title, qty: it.qty })),
      promiseLabel: o.promiseLabel,
      milestones: o.milestones.map((m) => ({
        key: m.key,
        at: m.at || '',
        ...(m.photo ? { photo: m.photo } : {}),
        ...(m.note ? { note: m.note } : {}),
      })),
    })),
  };

  const text = JSON.stringify(payload, null, 2);

  // 主通道：写 KV。失败则整体失败（不标记 published），让运营重试。
  try {
    await cfKvPut(CF_KV_ORDER_STATUS_ID, 'latest', text);
  } catch (e) {
    return NextResponse.json({ error: `写入 Cloudflare KV 失败：${(e as Error).message}` }, { status: 500 });
  }

  // 可选副本：本地有 vertex 仓库时双写（演示期兼容；服务器部署后自动跳过）
  let fileTargets: string[] = [];
  if (fs.existsSync(VERTEX_ROOT)) {
    try {
      fs.writeFileSync(ORDER_STATUS_TARGET_SRC, text);
      fs.writeFileSync(ORDER_STATUS_TARGET_PUBLIC, text);
      fileTargets = [ORDER_STATUS_TARGET_SRC, ORDER_STATUS_TARGET_PUBLIC];
    } catch {
      // 副本失败不阻断（KV 已生效），仅不回显 targets
    }
  }

  const now = new Date().toISOString();
  for (const o of db.orders) {
    if (o.status === 'pending') {
      o.status = 'published';
      o.publishedAt = now;
    }
  }
  writeDb(db);

  return NextResponse.json({
    ok: true,
    orders: payload.orders.length,
    pendingPublished: pendingCount,
    kv: true,
    ...(fileTargets.length ? { targets: fileTargets } : {}),
  });
}
