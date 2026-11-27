'use client';

import { useEffect, useState } from 'react';

interface PromotionEntry {
  id: string;
  type: 'banner' | 'flash';
  name: string;
  bannerLine: string;
  discountLabel: string;
  start: string;
  end: string;
  code?: string;
  status: 'pending' | 'published';
  stage?: 'scheduled' | 'online' | 'ended';
}

const input = 'w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none';
const label = 'mb-1 block text-xs font-medium text-zinc-500';

const STAGE_BADGE: Record<string, { cls: string; text: string }> = {
  scheduled: { cls: 'bg-sky-100 text-sky-700', text: '排期' },
  online: { cls: 'bg-emerald-100 text-emerald-700', text: '在线' },
  ended: { cls: 'bg-zinc-100 text-zinc-500', text: '结束' },
};

/** datetime-local 本地值 → 保存用（服务端转 ISO）；回显时 ISO → 本地值 */
function toLocalValue(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function PromotionsPage() {
  const [items, setItems] = useState<PromotionEntry[]>([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    type: 'flash' as 'banner' | 'flash',
    name: '',
    bannerLine: '',
    discountLabel: '',
    start: '',
    end: '',
    code: '',
  });

  async function load() {
    const r = await fetch('/api/promotions');
    const j = await r.json();
    setItems(j.items || []);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    const r = await fetch('/api/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // datetime-local 按本机时区提交（服务端 new Date(...).toISOString()）
      body: JSON.stringify(form),
    });
    const j = await r.json();
    setMsg(r.ok ? `已保存：${j.entry.name}（待发布）` : `失败：${j.error}`);
    if (r.ok) {
      load();
      setForm({ type: form.type, name: '', bannerLine: '', discountLabel: '', start: '', end: '', code: '' });
    }
  }

  async function remove(id: string) {
    if (!confirm('删除该促销活动？')) return;
    const r = await fetch(`/api/promotions?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    setMsg(r.ok ? '已删除' : '删除失败');
    if (r.ok) load();
  }

  async function publish() {
    const r = await fetch('/api/promotions/publish', { method: 'POST' });
    const j = await r.json();
    setMsg(r.ok ? `已发布 ${j.promotions} 个活动 → vertex（需重新构建前台生效；到期自动回退无需重发）` : `失败：${j.error}`);
    if (r.ok) load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">促销活动 🎉</h1>
        <button onClick={publish} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          发布到前台
        </button>
      </div>
      {msg && <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm text-brand-700">{msg}</div>}

      {/* 新建 / 编辑活动 */}
      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-zinc-700">新建活动（同活动名重存 = 覆盖；状态机：草稿 → 排期 → 在线 → 结束 自动流转）</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className={label}>类型（批次 1：banner / flash）</label>
            <select className={input} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'banner' | 'flash' })}>
              <option value="flash">flash（闪购：限时 + 倒计时）</option>
              <option value="banner">banner（横幅活动）</option>
            </select>
          </div>
          <div>
            <label className={label}>活动名（唯一标识，如 BFCM-2026）</label>
            <input className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className={label}>折扣标签（如 30% Off）</label>
            <input className={input} value={form.discountLabel} onChange={(e) => setForm({ ...form, discountLabel: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className={label}>横幅主文案</label>
            <input className={input} value={form.bannerLine} onChange={(e) => setForm({ ...form, bannerLine: e.target.value })} placeholder="Flash Sale · 30% Off Sitewide" />
          </div>
          <div>
            <label className={label}>折扣码（占位：批次 1 不同步 Shopify，等闸门 A）</label>
            <input className={input} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="FLASH30（仅留档）" />
          </div>
          <div>
            <label className={label}>开始时间（按本机时区）</label>
            <input type="datetime-local" className={input} value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
          </div>
          <div>
            <label className={label}>结束时间（到期自动下线）</label>
            <input type="datetime-local" className={input} value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
          </div>
        </div>
        <button onClick={save} disabled={!form.name || !form.bannerLine || !form.discountLabel || !form.start || !form.end} className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-40">
          保存活动
        </button>
      </section>

      {/* 活动列表 */}
      <section className="rounded-xl border border-zinc-200 bg-white">
        <h2 className="border-b border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700">活动列表（{items.length}）</h2>
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs text-zinc-500">
            <tr>
              <th className="px-4 py-2">活动名</th>
              <th className="px-4 py-2">类型</th>
              <th className="px-4 py-2">文案</th>
              <th className="px-4 py-2">档期</th>
              <th className="px-4 py-2">折扣码</th>
              <th className="px-4 py-2">档期状态</th>
              <th className="px-4 py-2">发布状态</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => {
              const stage = STAGE_BADGE[p.stage || 'scheduled'];
              return (
                <tr key={p.id} className="border-t border-zinc-100">
                  <td className="px-4 py-2 font-medium">{p.name}</td>
                  <td className="px-4 py-2">{p.type}</td>
                  <td className="px-4 py-2">
                    <span className="line-clamp-1 max-w-xs">{p.bannerLine} · {p.discountLabel}</span>
                  </td>
                  <td className="px-4 py-2 text-xs text-zinc-500">
                    {toLocalValue(p.start).replace('T', ' ')}<br />→ {toLocalValue(p.end).replace('T', ' ')}
                  </td>
                  <td className="px-4 py-2 text-zinc-400">{p.code || '—'}</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${stage.cls}`}>{stage.text}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${p.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {p.status === 'pending' ? '待发布' : '已发布'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => remove(p.id)} className="text-xs text-red-500 hover:underline">删除</button>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && <tr><td colSpan={8} className="px-4 py-6 text-center text-zinc-400">暂无活动</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
}
