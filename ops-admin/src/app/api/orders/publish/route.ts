import { NextResponse } from 'next/server';
import fs from 'fs';
import { readDb, writeDb } from '@/lib/db';
import { ORDER_STATUS_TARGET_PUBLIC, ORDER_STATUS_TARGET_SRC } from '@/lib/env';
import { orderEmailHash } from '@/lib/order';
import { CF_ACCOUNT_ID, CF_API_BASE, CF_API_TOKEN, ORDER_STATUS_KV_NAMESPACE } from '@/lib/env';

/**
 * 发布订单台账。2026-11-26 起双路径（CF Pages 迁移批次，文档三.3 / 待办 #4）：
 * - 旧路径（CF_API_TOKEN 未配置，向后兼容）：全量重写 vertex 两处 JSON
 *   （src/data/admin-order-status.json 构建期留档 + public/data/order-status.json 客户端读取），
 *   vertex 重新构建后生效 —— 与原行为完全一致。
 * - 新路径（CF_API_TOKEN 已配置）：在文件双写之外，追加 PUT Cloudflare KV
 *   ORDER_STATUS_KV 的 key=latest（与静态文件同一 JSON，**结构不变：只有 emailHash，
 *   绝无邮箱明文**）。KV 写入成功后，线上经 Pages Function `/data/order-status.json`
 *   即时生效，无需重建；public/data/order-status.json 静态文件暂不删除
 *   （静态遮蔽 Function 的切换顺序由协作侧在 Function 线上确认后处理，见文档三.3）。
 *   KV 写入失败时本接口返回 502 且**不翻转** pending → published（重试发布幂等自愈）。
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

  try {
    fs.writeFileSync(ORDER_STATUS_TARGET_SRC, text);
    fs.writeFileSync(ORDER_STATUS_TARGET_PUBLIC, text);
  } catch (e) {
    return NextResponse.json({ error: `写入 vertex 失败：${(e as Error).message}` }, { status: 500 });
  }

  // —— KV 发布路径：仅当 CF_API_TOKEN 配置时启用；失败即中止（不翻转状态，幂等重试） ——
  const kvEnabled = CF_API_TOKEN !== '';
  let kvError: string | undefined;
  if (kvEnabled) {
    try {
      const url = `${CF_API_BASE}/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${ORDER_STATUS_KV_NAMESPACE}/values/latest`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: text,
      });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        kvError = `CF KV PUT ${res.status}: ${body.slice(0, 300)}`;
      }
    } catch (e) {
      kvError = `CF KV 请求异常：${(e as Error).message}`;
    }
    if (kvError) {
      return NextResponse.json(
        { error: `KV 发布失败（文件双写已完成，状态未翻转，可修复后重新发布）：${kvError}`, kvEnabled },
        { status: 502 },
      );
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
    targets: [ORDER_STATUS_TARGET_SRC, ORDER_STATUS_TARGET_PUBLIC],
    ...(kvEnabled ? { kv: { enabled: true, namespace: ORDER_STATUS_KV_NAMESPACE, key: 'latest' } } : { kv: { enabled: false } }),
  });
}
