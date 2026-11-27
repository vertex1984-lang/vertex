'use client';

import { useEffect, useState } from 'react';

interface PreorderEntry {
  id: string;
  handle: string;
  title: string;
  regularPrice: string;
  arrivesLabel: string;
  arrivesShort: string;
  deadline: string;
  deadlineLabel: string;
  reason: string;
  status: 'pending' | 'published';
  at: string;
}

interface PreorderSale {
  deadline: string;
  deadlineLabel: string;
  bannerLine: string;
}

interface ProductHit {
  handle: string;
  title: string;
  price: string;
}

const input = 'w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none';
const label = 'mb-1 block text-xs font-medium text-zinc-500';
const dateCls = 'rounded-lg border border-zinc-300 px-2 py-1.5 text-xs text-zinc-600';

/** 日期选择助手：ISO 日期（yyyy-mm-dd）→ 前台短文案（如 Dec 17，与展示同格式） */
const fmtDay = (iso: string): string => {
  if (!iso) return '';
  const dt = new Date(`${iso}T00:00:00`);
  return Number.isNaN(dt.getTime()) ? '' : dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function PreorderPage() {
  const [entries, setEntries] = useState<PreorderEntry[]>([]);
  const [sale, setSale] = useState<PreorderSale>({ deadline: '', deadlineLabel: '', bannerLine: '' });
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<ProductHit[]>([]);
  const [form, setForm] = useState({
    handle: '', title: '', regularPrice: '', arrivesLabel: '', arrivesShort: '',
    deadline: '', deadlineLabel: '', reason: 'Made to order, then shipped by fast sea freight — you wait a little, you save a lot.',
  });
  const [msg, setMsg] = useState('');
  // 日期选择助手的选中值（生成文案后文本框仍可手改；仅辅助，不进 payload）
  const [pickers, setPickers] = useState({ from: '', to: '', short: '', ddl: '' });

  async function load() {
    const r = await fetch('/api/preorder');
    const j = await r.json();
    setEntries(j.items || []);
    if (j.sale) setSale(j.sale);
  }
  useEffect(() => { load(); }, []);

  async function search() {
    if (!q.trim()) return;
    const r = await fetch(`/api/products?q=${encodeURIComponent(q)}&pageSize=8`);
    const j = await r.json();
    setHits(j.items || []);
  }

  function pick(p: ProductHit) {
    setForm((f) => ({ ...f, handle: p.handle, title: p.title, regularPrice: f.regularPrice || p.price }));
    setHits([]);
    setMsg('');
  }

  async function save() {
    const body = {
      ...form,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : '',
    };
    const r = await fetch('/api/preorder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json();
    setMsg(r.ok ? `已保存：${j.entry.title}（待发布）` : `失败：${j.error}`);
    if (r.ok) load();
  }

  async function remove(handle: string) {
    if (!confirm(`移除预售配置？\n${handle}`)) return;
    const r = await fetch(`/api/preorder?handle=${encodeURIComponent(handle)}`, { method: 'DELETE' });
    setMsg(r.ok ? '已移除' : '移除失败');
    if (r.ok) load();
  }

  async function saveSale() {
    const r = await fetch('/api/preorder/sale', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sale) });
    const j = await r.json();
    setMsg(r.ok ? '横幅口径已保存（待发布）' : `失败：${j.error}`);
  }

  async function publish() {
    const r = await fetch('/api/preorder/publish', { method: 'POST' });
    const j = await r.json();
    setMsg(r.ok ? `已发布 ${j.configs} 条预售配置 → vertex（需重新构建前台生效）` : `失败：${j.error}`);
    if (r.ok) load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">预售管理</h1>
        <button onClick={publish} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          发布到前台
        </button>
      </div>
      {msg && <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm text-brand-700">{msg}</div>}

      {/* 全站横幅口径 */}
      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-zinc-700">全站横幅口径（顶栏文案 + 活动截止）</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className={label}>活动主文案</label>
            <input className={input} value={sale.bannerLine} onChange={(e) => setSale({ ...sale, bannerLine: e.target.value })} />
          </div>
          <div>
            <label className={label}>截止时间（预售价失效，按本机时区）</label>
            <input type="datetime-local" className={input} value={sale.deadline ? sale.deadline.slice(0, 16) : ''} onChange={(e) => setSale({ ...sale, deadline: e.target.value })} />
          </div>
          <div>
            <label className={label}>截止日短文案（水合前帧，如 Nov 17）</label>
            <input className={input} value={sale.deadlineLabel} onChange={(e) => setSale({ ...sale, deadlineLabel: e.target.value })} />
          </div>
        </div>
        <button onClick={saveSale} className="mt-3 rounded-lg border border-brand-300 px-4 py-1.5 text-sm text-brand-700 hover:bg-brand-50">保存口径</button>
      </section>

      {/* 新增 / 编辑预售 SKU */}
      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-zinc-700">预售 SKU 配置</h2>
        <div className="mb-4 flex gap-2">
          <input className={`${input} flex-1`} placeholder="搜索商品（标题 / SKU / handle）" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && search()} />
          <button onClick={search} className="rounded-lg border border-zinc-300 px-4 text-sm hover:bg-zinc-50">搜索</button>
        </div>
        {hits.length > 0 && (
          <div className="mb-4 max-h-64 space-y-1 overflow-auto rounded-lg border border-zinc-200">
            {hits.map((h) => (
              <button key={h.handle} onClick={() => pick(h)} className="block w-full px-3 py-2 text-left text-sm hover:bg-brand-50">
                <span className="line-clamp-1">{h.title}</span>
                <span className="ml-2 text-xs text-zinc-400">${h.price} · {h.handle.slice(-30)}</span>
              </button>
            ))}
          </div>
        )}
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className={label}>商品（已选）</label>
            <input className={input} value={form.title} readOnly placeholder="从上方搜索选择" />
          </div>
          <div>
            <label className={label}>划线原价（专享价 = Shopify 现价）</label>
            <input className={input} value={form.regularPrice} onChange={(e) => setForm({ ...form, regularPrice: e.target.value })} placeholder="49.99" />
          </div>
          <div>
            <label className={label}>到货窗口（如 Dec 17 – Dec 20）</label>
            <input className={input} value={form.arrivesLabel} onChange={(e) => setForm({ ...form, arrivesLabel: e.target.value })} />
            {/* 日期选择助手（2026-11-15 运营反馈）：选起止日自动按前台格式生成，文本框仍可手改 */}
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <span>选日期：</span>
              <input
                type="date"
                className={dateCls}
                value={pickers.from}
                onChange={(e) => {
                  const from = e.target.value;
                  setPickers((p) => ({ ...p, from }));
                  const label2 = from && pickers.to ? `${fmtDay(from)} – ${fmtDay(pickers.to)}` : fmtDay(from) || fmtDay(pickers.to);
                  if (label2) setForm((f) => ({ ...f, arrivesLabel: label2 }));
                }}
              />
              <span>至</span>
              <input
                type="date"
                className={dateCls}
                value={pickers.to}
                onChange={(e) => {
                  const to = e.target.value;
                  setPickers((p) => ({ ...p, to }));
                  const label2 = pickers.from && to ? `${fmtDay(pickers.from)} – ${fmtDay(to)}` : fmtDay(pickers.from) || fmtDay(to);
                  if (label2) setForm((f) => ({ ...f, arrivesLabel: label2 }));
                }}
              />
              <span>只选一天 = 单日窗口</span>
            </div>
          </div>
          <div>
            <label className={label}>到货短标签（卡片/购物车单行，如 Dec 20）</label>
            <input className={input} value={form.arrivesShort} onChange={(e) => setForm({ ...form, arrivesShort: e.target.value })} />
            <div className="mt-1.5 flex items-center gap-2 text-xs text-zinc-400">
              <span>选日期：</span>
              <input
                type="date"
                className={dateCls}
                value={pickers.short}
                onChange={(e) => {
                  const v = e.target.value;
                  setPickers((p) => ({ ...p, short: v }));
                  if (v) setForm((f) => ({ ...f, arrivesShort: fmtDay(v) }));
                }}
              />
            </div>
          </div>
          <div>
            <label className={label}>该 SKU 预售价截止（按本机时区）</label>
            <input type="datetime-local" className={input} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
          <div>
            <label className={label}>截止日短文案（如 Nov 17）</label>
            <input className={input} value={form.deadlineLabel} onChange={(e) => setForm({ ...form, deadlineLabel: e.target.value })} />
            <div className="mt-1.5 flex items-center gap-2 text-xs text-zinc-400">
              <span>选日期：</span>
              <input
                type="date"
                className={dateCls}
                value={pickers.ddl}
                onChange={(e) => {
                  const v = e.target.value;
                  setPickers((p) => ({ ...p, ddl: v }));
                  if (v) setForm((f) => ({ ...f, deadlineLabel: fmtDay(v) }));
                }}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className={label}>等待理由（一句话，展示在预售模块）</label>
            <input className={input} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          </div>
        </div>
        <button onClick={save} disabled={!form.handle} className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-40">
          保存配置
        </button>
      </section>

      {/* 配置列表 */}
      <section className="rounded-xl border border-zinc-200 bg-white">
        <h2 className="border-b border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700">预售 SKU 列表（{entries.length}）</h2>
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs text-zinc-500">
            <tr>
              <th className="px-4 py-2">商品</th>
              <th className="px-4 py-2">划线价</th>
              <th className="px-4 py-2">到货窗口</th>
              <th className="px-4 py-2">截止</th>
              <th className="px-4 py-2">状态</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-t border-zinc-100">
                <td className="px-4 py-2"><span className="line-clamp-1 max-w-xs">{e.title}</span></td>
                <td className="px-4 py-2">${e.regularPrice}</td>
                <td className="px-4 py-2">{e.arrivesLabel}</td>
                <td className="px-4 py-2">{e.deadlineLabel}</td>
                <td className="px-4 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${e.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {e.status === 'pending' ? '待发布' : '已发布'}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => remove(e.handle)} className="text-xs text-red-500 hover:underline">移除</button>
                </td>
              </tr>
            ))}
            {entries.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-center text-zinc-400">暂无配置</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
}
