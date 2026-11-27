'use client';

import { useEffect, useState } from 'react';

interface ReviewRecord {
  id: string;
  handle: string;
  productTitle?: string;
  author?: string;
  title?: string;
  text: string;
  rating: number;
  couponFlag?: boolean;
  customerEmail?: string;
  at: string;
  status: 'pending' | 'approved' | 'rejected';
  moderatedAt?: string;
}

const input = 'w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none';

const STATUS_BADGE: Record<ReviewRecord['status'], { cls: string; text: string }> = {
  pending: { cls: 'bg-amber-100 text-amber-700', text: '待审核' },
  approved: { cls: 'bg-emerald-100 text-emerald-700', text: '已通过' },
  rejected: { cls: 'bg-zinc-100 text-zinc-500', text: '已拒绝' },
};

function Stars({ n }: { n: number }) {
  return (
    <span className="text-amber-500 tracking-tight" aria-label={`${n} 星`}>
      {'★'.repeat(n)}
      <span className="text-zinc-300">{'★'.repeat(5 - n)}</span>
    </span>
  );
}

export default function ReviewsPage() {
  const [items, setItems] = useState<ReviewRecord[]>([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    const r = await fetch('/api/reviews');
    const j = await r.json();
    setItems(j.items || []);
  }
  useEffect(() => { load(); }, []);

  async function moderate(id: string, action: 'approve' | 'reject', couponFlag?: boolean) {
    setBusy(true);
    const r = await fetch('/api/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action, ...(couponFlag !== undefined ? { couponFlag } : {}) }),
    });
    const j = await r.json();
    setBusy(false);
    if (r.ok) {
      // 2026-11-21 T2：approve 且评价带登录身份 → 自动发放评价券（开关开启时）
      const granted = j.couponGranted as boolean | undefined;
      setMsg(
        action === 'approve'
          ? granted
            ? `已通过（待发布生效）· 已发放评价券 ${j.couponCode}`
            : '已通过（待发布生效）'
          : '已拒绝（不会上墙）'
      );
      load();
    } else {
      setMsg(`失败：${j.error}`);
    }
  }

  async function toggleCoupon(id: string, current: boolean) {
    setBusy(true);
    const r = await fetch('/api/reviews', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, couponFlag: !current }),
    });
    setBusy(false);
    setMsg(r.ok ? `返券标记已${!current ? '打开（仅记录，发放等闸门 A）' : '关闭'}` : '失败');
    if (r.ok) load();
  }

  async function remove(id: string) {
    if (!confirm('删除该评价？')) return;
    const r = await fetch(`/api/reviews?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    setMsg(r.ok ? '已删除' : '删除失败');
    if (r.ok) load();
  }

  async function publish() {
    setBusy(true);
    const r = await fetch('/api/reviews/publish', { method: 'POST' });
    const j = await r.json();
    setBusy(false);
    setMsg(r.ok ? `已发布 ${j.reviews} 条已通过评价 → vertex reviews.json（需重新构建前台生效）` : `失败：${j.error}`);
    if (r.ok) load();
  }

  const pendingCount = items.filter((r) => r.status === 'pending').length;
  const approvedCount = items.filter((r) => r.status === 'approved').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">评价管理 ⭐</h1>
        <button onClick={publish} disabled={busy} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-40">
          发布到前台（只发已通过）
        </button>
      </div>
      {msg && <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm text-brand-700">{msg}</div>}

      <div className="flex gap-4 text-sm text-zinc-500">
        <span>待审核 <b className="text-amber-600">{pendingCount}</b></span>
        <span>已通过 <b className="text-emerald-600">{approvedCount}</b></span>
        <span>合计 {items.length}</span>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white">
        <h2 className="border-b border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700">评价列表（待审核优先）</h2>
        <div className="divide-y divide-zinc-100">
          {items.map((r) => (
            <div key={r.id} className="px-4 py-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <Stars n={r.rating} />
                <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_BADGE[r.status].cls}`}>{STATUS_BADGE[r.status].text}</span>
                {r.couponFlag && (
                  <span className="rounded-full px-2 py-0.5 text-xs bg-purple-100 text-purple-700" title="仅记录，真实发放等闸门 A">返券标记</span>
                )}
                <span className="ml-auto text-xs text-zinc-400">{r.at.slice(0, 16).replace('T', ' ')}</span>
              </div>
              <p className="mt-1.5 text-sm text-zinc-700">
                <b>{r.author || 'Anonymous'}</b>
                {r.title && <span className="font-semibold"> · {r.title}</span>}
              </p>
              <p className="mt-1 text-sm text-zinc-600 whitespace-pre-line">{r.text}</p>
              <p className="mt-1 text-xs text-zinc-400">
                {r.productTitle || '—'} · {r.handle}
                {r.customerEmail && (
                  <span className="ml-1 rounded-full bg-sky-100 px-2 py-0.5 text-sky-700" title="登录用户提交——审核通过自动发券">
                    登录用户 {r.customerEmail}
                  </span>
                )}
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs">
                {r.status !== 'approved' && (
                  <button onClick={() => moderate(r.id, 'approve', r.couponFlag)} disabled={busy} className="font-semibold text-emerald-600 hover:underline">通过</button>
                )}
                {r.status !== 'rejected' && (
                  <button onClick={() => moderate(r.id, 'reject', r.couponFlag)} disabled={busy} className="font-semibold text-red-500 hover:underline">拒绝</button>
                )}
                <button onClick={() => toggleCoupon(r.id, !!r.couponFlag)} disabled={busy} className="text-purple-600 hover:underline">
                  {r.couponFlag ? '取消返券标记' : '标记返券'}
                </button>
                <button onClick={() => remove(r.id)} disabled={busy} className="text-zinc-400 hover:text-red-500 hover:underline">删除</button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-zinc-400">
              暂无评价——前台 PDP「Write a Review」提交后出现在这里
            </div>
          )}
        </div>
      </section>

      <p className="text-xs text-zinc-400">
        流程：前台提交（待审核）→ 通过/拒绝 → 「发布到前台」只写已通过条目 → vertex 重新构建后上墙。晒图返券：标记仅记录，真实发放等闸门 A（Admin API 折扣码）。
      </p>
    </div>
  );
}
