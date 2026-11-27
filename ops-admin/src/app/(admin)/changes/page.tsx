'use client';

import { useCallback, useEffect, useState } from 'react';

interface ChangeEntry {
  id: string;
  handle: string;
  field: string;
  oldValue: string;
  newValue: string;
  at: string;
  publishedAt?: string;
  note?: string;
  by: string;
}

interface NewProductEntry {
  id: string;
  batchId: string;
  status: string;
  createdAt: string;
  publishedAt?: string;
  note?: string;
  draft: { title: string; handle: string; asin: string; price: string; status: string; color: string; size: string };
}

const FIELD_LABEL: Record<string, string> = {
  title: '标题',
  price: '价格',
  compareAtPrice: '划线价',
  status: '状态',
};

export default function ChangesPage() {
  const [pending, setPending] = useState<ChangeEntry[]>([]);
  const [published, setPublished] = useState<ChangeEntry[]>([]);
  const [newPending, setNewPending] = useState<NewProductEntry[]>([]);
  const [newPublished, setNewPublished] = useState<NewProductEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/changes');
    const data = await res.json();
    setPending(data.pending || []);
    setPublished(data.published || []);
    setNewPending(data.newPending || []);
    setNewPublished(data.newPublished || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function revert(id: string) {
    await fetch('/api/changes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    load();
  }

  async function revertNew(id: string) {
    await fetch(`/api/products/new?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    load();
  }

  async function publish() {
    setPublishing(true);
    setMsg('');
    const res = await fetch('/api/changes/publish', { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    setPublishing(false);
    if (!res.ok) {
      setMsg(data.error || '发布失败');
      return;
    }
    const parts = [];
    if (data.published > 0) parts.push(`修改 ${data.published} 条`);
    if (data.newProducts > 0) parts.push(`新品 ${data.newProducts} 条（变体组 ${data.variantGroups}）`);
    setMsg(`已发布：${parts.join('，')} → 写入 vertex ✓（重新导入快照后可在商品列表看到新品）`);
    load();
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">变更与发布</h1>
          <p className="mt-1 text-sm text-zinc-500">
            所有修改先进入待发布清单，确认无误后一键发布（演示版：写入 vertex 的 admin-overrides.json）
          </p>
        </div>
        <button
          onClick={publish}
          disabled={publishing || (pending.length === 0 && newPending.length === 0)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {publishing ? '发布中…' : `发布全部（修改 ${pending.length} · 新品 ${newPending.length}）`}
        </button>
      </div>
      {msg && <p className="mt-3 text-sm text-zinc-600">{msg}</p>}

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-3 text-sm font-medium text-zinc-700">
          待发布新品（{newPending.length}）
        </div>
        {newPending.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-zinc-400">没有待发布的新品</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs text-zinc-500">
              <tr>
                <th className="px-5 py-2">标题</th>
                <th className="px-5 py-2">handle</th>
                <th className="px-5 py-2">内部编号</th>
                <th className="px-5 py-2">价格</th>
                <th className="px-5 py-2">状态</th>
                <th className="px-5 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {newPending.map((r) => (
                <tr key={r.id} className="border-t border-zinc-100">
                  <td className="max-w-xs truncate px-5 py-2 font-medium">{r.draft.title}</td>
                  <td className="max-w-xs truncate px-5 py-2 text-zinc-500">{r.draft.handle}</td>
                  <td className="px-5 py-2 text-zinc-500">{r.draft.asin}</td>
                  <td className="px-5 py-2">{r.draft.price === '0.00' ? '—' : `$${r.draft.price}`}</td>
                  <td className="px-5 py-2">
                    <span className={r.draft.status === 'coming_soon' ? 'text-amber-600' : 'text-brand-600'}>
                      {r.draft.status === 'coming_soon' ? 'Coming Soon' : '在售'}
                    </span>
                  </td>
                  <td className="px-5 py-2 text-right">
                    <button onClick={() => revertNew(r.id)} className="text-xs text-red-500 hover:underline">
                      撤销
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-3 text-sm font-medium text-zinc-700">
          待发布修改（{pending.length}）
        </div>
        {loading ? (
          <div className="px-5 py-8 text-center text-sm text-zinc-400">加载中…</div>
        ) : pending.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-zinc-400">没有待发布的修改</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs text-zinc-500">
              <tr>
                <th className="px-5 py-2">商品</th>
                <th className="px-5 py-2">字段</th>
                <th className="px-5 py-2">变更</th>
                <th className="px-5 py-2">备注</th>
                <th className="px-5 py-2">时间</th>
                <th className="px-5 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {pending.map((c) => (
                <tr key={c.id} className="border-t border-zinc-100">
                  <td className="max-w-xs px-5 py-2">
                    <div className="truncate font-medium">{c.handle}</div>
                  </td>
                  <td className="px-5 py-2 text-zinc-500">{FIELD_LABEL[c.field] || c.field}</td>
                  <td className="max-w-sm px-5 py-2">
                    <span className="text-zinc-400 line-through">{c.oldValue || '（空）'}</span>
                    <span className="mx-1">→</span>
                    <span className="font-medium">{c.newValue}</span>
                  </td>
                  <td className="px-5 py-2 text-zinc-500">{c.note || '—'}</td>
                  <td className="px-5 py-2 text-xs text-zinc-400">
                    {new Date(c.at).toLocaleString('zh-CN')}
                  </td>
                  <td className="px-5 py-2 text-right">
                    <button onClick={() => revert(c.id)} className="text-xs text-red-500 hover:underline">
                      撤销
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-3 text-sm font-medium text-zinc-700">
          已发布历史（{published.length}）
        </div>
        {published.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-zinc-400">暂无发布记录</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs text-zinc-500">
              <tr>
                <th className="px-5 py-2">商品</th>
                <th className="px-5 py-2">字段</th>
                <th className="px-5 py-2">值</th>
                <th className="px-5 py-2">发布时间</th>
              </tr>
            </thead>
            <tbody>
              {published.map((c) => (
                <tr key={c.id} className="border-t border-zinc-100">
                  <td className="max-w-xs truncate px-5 py-2">{c.handle}</td>
                  <td className="px-5 py-2 text-zinc-500">{FIELD_LABEL[c.field] || c.field}</td>
                  <td className="max-w-sm truncate px-5 py-2">{c.newValue}</td>
                  <td className="px-5 py-2 text-xs text-zinc-400">
                    {c.publishedAt ? new Date(c.publishedAt).toLocaleString('zh-CN') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
