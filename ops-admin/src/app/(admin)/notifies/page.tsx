'use client';

import { useEffect, useState } from 'react';

interface NotifyGroup {
  handle: string;
  count: number;
  emails: { email: string; at: string }[];
}

/** 到货通知名单（2026-11-15 展示层订阅台账）：按产品分组计数 + 邮箱明细；
 * 触达方式（发货开售邮件）等邮件服务接入后自动化，当前运营手动导出/触达。 */
export default function NotifiesPage() {
  const [groups, setGroups] = useState<NotifyGroup[]>([]);
  const [total, setTotal] = useState(0);
  const [msg, setMsg] = useState('');

  async function load() {
    const r = await fetch('/api/subscribe');
    const j = await r.json();
    setGroups(j.groups || []);
    setTotal(j.total || 0);
  }
  useEffect(() => { load(); }, []);

  function exportCsv() {
    const rows = [['handle', 'email', 'at']];
    for (const g of groups) for (const e of g.emails) rows.push([g.handle, e.email, e.at]);
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `notify-subscribes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg('已导出 CSV（运营手动触达用）');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">到货通知名单 🔔</h1>
        <button onClick={exportCsv} disabled={groups.length === 0} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-40">
          导出 CSV
        </button>
      </div>
      {msg && <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm text-brand-700">{msg}</div>}

      <p className="text-sm text-zinc-500">
        合计订阅 <b className="text-zinc-800">{total}</b> 条 / {groups.length} 个产品——来源：展示层 PDP「Notify Me」订阅框（上线方案 1.1 展示层转化兜底）
      </p>

      <section className="rounded-xl border border-zinc-200 bg-white">
        <h2 className="border-b border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700">按产品分组（订阅数降序）</h2>
        <div className="divide-y divide-zinc-100">
          {groups.map((g) => (
            <div key={g.handle} className="px-4 py-4">
              <p className="text-sm font-semibold text-zinc-700">
                {g.handle} <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">{g.count} 人</span>
              </p>
              <ul className="mt-1.5 space-y-0.5 text-xs text-zinc-500">
                {g.emails.map((e) => (
                  <li key={e.email}>{e.email} <span className="text-zinc-400">· {e.at.slice(0, 16).replace('T', ' ')}</span></li>
                ))}
              </ul>
            </div>
          ))}
          {groups.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-zinc-400">暂无订阅——展示层 PDP 的 Notify Me 提交后出现在这里</div>
          )}
        </div>
      </section>
    </div>
  );
}
