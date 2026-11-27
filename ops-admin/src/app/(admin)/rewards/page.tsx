'use client';

import { useEffect, useState } from 'react';

/**
 * 券码发放管理（2026-11-21 登录激励批次 T2/T3）：
 * - 配置位：总开关 + 折扣比例（默认 10% off 单次；开关关闭 = 全链路不发放、站内不显示文案）。
 *   T0 前由领导拍板是否启用——默认关。
 * - 台账：couponGrants 全量（含邮箱明文，仅供本地核对，不出 admin 数据面）。
 */

interface CouponGrant {
  id: string;
  customerEmail: string;
  code: string;
  reason: 'review' | 'signup' | 'notify-consent';
  percentOff: number;
  sourceId?: string;
  createdAt: string;
  status: string;
}

const REASON_LABEL: Record<CouponGrant['reason'], string> = {
  review: '评价送券',
  signup: '注册迎新',
  'notify-consent': '到货通知 + consent',
};

export default function RewardsPage() {
  const [config, setConfig] = useState<{ enabled: boolean; percentOff: number; at: string } | null>(null);
  const [items, setItems] = useState<CouponGrant[]>([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    const [cfgRes, listRes] = await Promise.all([fetch('/api/rewards/config'), fetch('/api/rewards')]);
    if (cfgRes.ok) setConfig((await cfgRes.json()).config ?? null);
    if (listRes.ok) setItems((await listRes.json()).items ?? []);
  }
  useEffect(() => { load(); }, []);

  async function save(patch: { enabled?: boolean; percentOff?: number }) {
    setBusy(true);
    const r = await fetch('/api/rewards', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const j = await r.json();
    setBusy(false);
    setMsg(r.ok ? '配置已保存' : `失败：${j.error}`);
    if (r.ok) load();
  }

  const enabled = config?.enabled ?? false;
  const percent = config?.percentOff ?? 10;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">券码发放 🎟️</h1>
        <p className="mt-1 text-sm text-zinc-500">
          登录激励批次（2026-11-21）：评价送券 / 注册迎新 / 到货通知 consent——站内台账发放，不依赖 Shopify 折扣码（等闸门 A）。
        </p>
      </div>
      {msg && <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm text-brand-700">{msg}</div>}

      {/* 配置位 */}
      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-zinc-700">发放配置</h2>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={enabled}
              disabled={busy}
              onChange={(e) => save({ enabled: e.target.checked })}
              className="h-4 w-4"
            />
            启用发放（总开关）
          </label>
          <label className="flex items-center gap-2">
            折扣比例
            <select
              value={percent}
              disabled={busy}
              onChange={(e) => save({ percentOff: Number(e.target.value) })}
              className="rounded-lg border border-zinc-300 px-2 py-1.5 text-sm"
            >
              {[5, 10, 15, 20].map((p) => (
                <option key={p} value={p}>{p}% off</option>
              ))}
            </select>
            单次使用
          </label>
          <span className={`rounded-full px-2.5 py-0.5 text-xs ${enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>
            {enabled ? '已启用（三条路径生效）' : '已关闭（全链路静默，站内不显示文案）'}
          </span>
        </div>
        <p className="mt-3 text-xs text-zinc-400">
          关闭时：评价 approve / 注册成功 / NotifyMe+consent 三条路径均不发放，前台注册成功页与 NotifyMe 成功态的迎新文案一并隐藏。默认 10% off 单次；T0 前由领导拍板启用。
        </p>
      </section>

      {/* 台账 */}
      <section className="rounded-xl border border-zinc-200 bg-white">
        <h2 className="border-b border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700">
          券码台账（已发 {items.length} 张）
        </h2>
        <div className="divide-y divide-zinc-100">
          {items.map((g) => (
            <div key={g.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-sm">
              <span className="font-mono font-semibold text-brand-700">{g.code}</span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">{REASON_LABEL[g.reason]}</span>
              <span className="text-zinc-500">{g.percentOff}% off</span>
              <span className="text-zinc-600">{g.customerEmail}</span>
              {g.sourceId && <span className="text-xs text-zinc-400" title="评价 id">评价 {g.sourceId.slice(0, 8)}…</span>}
              <span className="ml-auto text-xs text-zinc-400">{g.createdAt.slice(0, 16).replace('T', ' ')}</span>
            </div>
          ))}
          {items.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-zinc-400">
              暂无发放记录——开关启用后，评价通过 / 注册成功 / 到货通知+consent 会出现在这里
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
