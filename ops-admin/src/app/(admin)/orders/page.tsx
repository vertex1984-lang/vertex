'use client';

import { useEffect, useState } from 'react';

interface OrderItem {
  title: string;
  qty: number;
}

interface OrderMilestone {
  key: string;
  at: string;
  photo?: string;
  note?: string;
}

interface OrderRecord {
  id: string;
  orderNo: string;
  email: string;
  items: OrderItem[];
  promiseLabel: string;
  milestones: OrderMilestone[];
  at: string;
  status: 'pending' | 'published';
}

const input = 'w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none';
const label = 'mb-1 block text-xs font-medium text-zinc-500';

const MILESTONES: { key: string; label: string }[] = [
  { key: 'ordered', label: '已下单' },
  { key: 'production_started', label: '生产启动（D2）' },
  { key: 'production_done', label: '生产完工（D6·检查点①）' },
  { key: 'departed', label: '已离港（D13·检查点②）' },
  { key: 'arrival_notice', label: '到港预告（D20）' },
  { key: 'customs_cleared', label: '清关完成（D25）' },
  { key: 'warehouse', label: '美国仓入库（D27）' },
  { key: 'out_for_delivery', label: '派送中' },
  { key: 'delivered', label: '已签收（D32）' },
];

/** 已推进段数（at 非空即算到达） */
function progressOf(o: OrderRecord): number {
  return o.milestones.filter((m) => m.at).length;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [msg, setMsg] = useState('');
  // 录单表单
  const [form, setForm] = useState({ orderNo: '', email: '', promiseLabel: '' });
  const [items, setItems] = useState<OrderItem[]>([{ title: '', qty: 1 }]);
  // 推进表单
  const [advance, setAdvance] = useState({ orderNo: '', key: 'production', note: '', photo: '' });
  const [uploading, setUploading] = useState(false);

  async function load() {
    const r = await fetch('/api/orders');
    const j = await r.json();
    setOrders(j.items || []);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    const r = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, items }),
    });
    const j = await r.json();
    setMsg(r.ok ? `已录入：${j.order.orderNo}（ordered 段已自动填当前时间，待发布）` : `失败：${j.error}`);
    if (r.ok) {
      load();
      setForm({ orderNo: '', email: '', promiseLabel: '' });
      setItems([{ title: '', qty: 1 }]);
    }
  }

  async function uploadPhoto(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.set('slug', advance.orderNo || 'untitled');
    fd.set('bucket', 'orders');
    fd.set('files', file);
    const r = await fetch('/api/upload', { method: 'POST', body: fd });
    const j = await r.json();
    setUploading(false);
    if (r.ok && j.urls?.[0]) {
      setAdvance((a) => ({ ...a, photo: j.urls[0].url }));
      setMsg(`实拍图已上传：${j.urls[0].url}`);
    } else {
      setMsg(`上传失败：${j.error}`);
    }
  }

  async function doAdvance() {
    if (!advance.orderNo) {
      setMsg('失败：先选择要推进的订单');
      return;
    }
    const r = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNo: advance.orderNo,
        advance: { key: advance.key, note: advance.note || undefined, photo: advance.photo || undefined },
      }),
    });
    const j = await r.json();
    setMsg(r.ok ? `已推进：${j.order.orderNo} → ${MILESTONES.find((m) => m.key === advance.key)?.label}（待发布）` : `失败：${j.error}`);
    if (r.ok) {
      load();
      setAdvance((a) => ({ ...a, note: '', photo: '' }));
    }
  }

  async function remove(orderNo: string) {
    if (!confirm(`删除订单？\n${orderNo}`)) return;
    const r = await fetch(`/api/orders?orderNo=${encodeURIComponent(orderNo)}`, { method: 'DELETE' });
    setMsg(r.ok ? '已删除' : '删除失败');
    if (r.ok) load();
  }

  async function publish() {
    const r = await fetch('/api/orders/publish', { method: 'POST' });
    const j = await r.json();
    setMsg(r.ok ? `已发布 ${j.orders} 单 → vertex 双份 JSON（需重新构建前台生效；产物只含邮箱哈希）` : `失败：${j.error}`);
    if (r.ok) load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">订单管理 📋</h1>
        <button onClick={publish} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          发布到前台
        </button>
      </div>
      {msg && <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm text-brand-700">{msg}</div>}

      {/* 录单 */}
      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-zinc-700">录入订单（同订单号重录 = 覆盖基础字段，推进进度保留）</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className={label}>订单号（如 MK-20261112-001）</label>
            <input className={input} value={form.orderNo} onChange={(e) => setForm({ ...form, orderNo: e.target.value })} />
          </div>
          <div>
            <label className={label}>客户邮箱（仅台账保存；发布产物只含哈希）</label>
            <input className={input} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className={label}>到货窗口文案（如 Arrives Dec 17 – Dec 20）</label>
            <input className={input} value={form.promiseLabel} onChange={(e) => setForm({ ...form, promiseLabel: e.target.value })} />
          </div>
        </div>
        <div className="mt-3">
          <label className={label}>商品（标题 × 数量）</label>
          <div className="space-y-2">
            {items.map((it, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={input}
                  placeholder="商品标题"
                  value={it.title}
                  onChange={(e) => setItems(items.map((x, xi) => (xi === i ? { ...x, title: e.target.value } : x)))}
                />
                <input
                  className="w-20 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  type="number"
                  min={1}
                  value={it.qty}
                  onChange={(e) => setItems(items.map((x, xi) => (xi === i ? { ...x, qty: Number(e.target.value) || 1 } : x)))}
                />
                {items.length > 1 && (
                  <button onClick={() => setItems(items.filter((_, xi) => xi !== i))} className="px-2 text-xs text-red-500 hover:underline">
                    删
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={() => setItems([...items, { title: '', qty: 1 }])} className="mt-2 text-xs text-brand-700 hover:underline">
            + 加一件商品
          </button>
        </div>
        <button
          onClick={save}
          disabled={!form.orderNo || !form.email || !form.promiseLabel}
          className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-40"
        >
          保存订单
        </button>
      </section>

      {/* 推进里程碑 */}
      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-zinc-700">
          推进里程碑（{MILESTONES.length} 段，按上线方案 1.3：已下单 → 生产启动 → 完工 → 离港 → 到港 → 清关 → 入库 → 派送 → 签收）
        </h2>
        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <label className={label}>订单</label>
            <select className={input} value={advance.orderNo} onChange={(e) => setAdvance({ ...advance, orderNo: e.target.value })}>
              <option value="">选择订单…</option>
              {orders.map((o) => (
                <option key={o.id} value={o.orderNo}>
                  {o.orderNo}（{progressOf(o)}/{MILESTONES.length}）
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>推进到</label>
            <select className={input} value={advance.key} onChange={(e) => setAdvance({ ...advance, key: e.target.value })}>
              {MILESTONES.map((m) => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>备注（可选，展示在时间线）</label>
            <input className={input} value={advance.note} onChange={(e) => setAdvance({ ...advance, note: e.target.value })} />
          </div>
          <div>
            <label className={label}>实拍图（可选，落 vertex /images/orders/）</label>
            <input
              type="file"
              accept=".webp,.png,.jpg,.jpeg"
              disabled={!advance.orderNo || uploading}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); }}
              className="w-full text-xs text-zinc-500 file:mr-2 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-xs"
            />
            {advance.photo && <p className="mt-1 truncate text-[11px] text-emerald-600">{advance.photo}</p>}
          </div>
        </div>
        <button onClick={doAdvance} disabled={!advance.orderNo || uploading} className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-40">
          推进
        </button>
      </section>

      {/* 台账列表 */}
      <section className="rounded-xl border border-zinc-200 bg-white">
        <h2 className="border-b border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700">订单台账（{orders.length}）</h2>
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs text-zinc-500">
            <tr>
              <th className="px-4 py-2">订单号</th>
              <th className="px-4 py-2">邮箱</th>
              <th className="px-4 py-2">商品</th>
              <th className="px-4 py-2">到货窗口</th>
              <th className="px-4 py-2">进度</th>
              <th className="px-4 py-2">状态</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const latest = [...o.milestones].reverse().find((m) => m.at);
              return (
                <tr key={o.id} className="border-t border-zinc-100">
                  <td className="px-4 py-2 font-medium">{o.orderNo}</td>
                  <td className="px-4 py-2 text-zinc-500">{o.email}</td>
                  <td className="px-4 py-2">
                    <span className="line-clamp-1 max-w-xs">
                      {o.items.map((it) => `${it.title} ×${it.qty}`).join('；')}
                    </span>
                  </td>
                  <td className="px-4 py-2">{o.promiseLabel}</td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-zinc-500">
                      {progressOf(o)}/{MILESTONES.length}{latest ? ` · ${MILESTONES.find((m) => m.key === latest.key)?.label}` : ''}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${o.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {o.status === 'pending' ? '待发布' : '已发布'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => remove(o.orderNo)} className="text-xs text-red-500 hover:underline">删除</button>
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && <tr><td colSpan={7} className="px-4 py-6 text-center text-zinc-400">暂无订单</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
}
