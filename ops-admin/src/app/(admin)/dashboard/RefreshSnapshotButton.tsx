'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RefreshSnapshotButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function refresh() {
    setBusy(true);
    setMsg('');
    const res = await fetch('/api/snapshot', { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    setMsg(res.ok ? '已更新 ✓' : `失败：${data.error || '未知错误'}`);
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {msg && <span className="text-xs text-zinc-500">{msg}</span>}
      <button
        onClick={refresh}
        disabled={busy}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm hover:border-brand-500 disabled:opacity-50"
      >
        {busy ? '导入中…' : '↻ 重新导入快照'}
      </button>
    </div>
  );
}
