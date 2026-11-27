'use client';

import { useCallback, useEffect, useState } from 'react';

interface UserItem {
  username: string;
  role: string;
  disabled: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setBusy(false);
    if (data.ok) {
      setMsg(`已添加：${data.username} ✓`);
      setUsername('');
      setPassword('');
      load();
    } else {
      setMsg(`失败：${data.error}`);
    }
  }

  async function toggleDisabled(u: UserItem) {
    setBusy(true);
    setMsg('');
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u.username, disabled: !u.disabled }),
    });
    const data = await res.json();
    setBusy(false);
    if (data.ok) {
      setMsg(`${u.username} 已${data.disabled ? '停用' : '启用'} ✓`);
      load();
    } else {
      setMsg(`失败：${data.error}`);
    }
  }

  async function resetPassword(u: UserItem) {
    const pwd = window.prompt(`为 ${u.username} 设置新密码（至少 8 位）：`);
    if (!pwd) return;
    setBusy(true);
    setMsg('');
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u.username, password: pwd }),
    });
    const data = await res.json();
    setBusy(false);
    setMsg(data.ok ? `${u.username} 密码已重置 ✓` : `失败：${data.error}`);
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-xl font-semibold">用户管理</h1>
      <p className="mb-6 text-sm text-zinc-500">
        后台登录账号管理。角色暂不细分（统一运营权限）；停用立即生效（该账号无法再登录）。
      </p>

      <form onSubmit={addUser} className="mb-8 flex items-end gap-3 rounded-xl border border-zinc-200 bg-white p-5">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">用户名</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-44 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            placeholder="字母数字，3-32 位"
            required
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">密码</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-52 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            placeholder="至少 8 位"
            required
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-brand px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {busy ? '处理中…' : '添加用户'}
        </button>
      </form>

      {msg && <div className="mb-4 rounded-lg bg-brand-50 px-4 py-2 text-sm text-brand-700">{msg}</div>}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-5 py-3">用户名</th>
              <th className="px-5 py-3">角色</th>
              <th className="px-5 py-3">状态</th>
              <th className="px-5 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-5 py-6 text-zinc-400" colSpan={4}>加载中…</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.username} className="border-t border-zinc-100">
                  <td className="px-5 py-3 font-medium">{u.username}</td>
                  <td className="px-5 py-3">{u.role}</td>
                  <td className="px-5 py-3">
                    {u.disabled ? (
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">已停用</span>
                    ) : (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-600">可用</span>
                    )}
                  </td>
                  <td className="space-x-3 px-5 py-3">
                    <button onClick={() => toggleDisabled(u)} disabled={busy} className="text-zinc-600 hover:text-brand-700 disabled:opacity-50">
                      {u.disabled ? '启用' : '停用'}
                    </button>
                    <button onClick={() => resetPassword(u)} disabled={busy} className="text-zinc-600 hover:text-brand-700 disabled:opacity-50">
                      重置密码
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
