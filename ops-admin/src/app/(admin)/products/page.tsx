'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { assetSrc } from '@/lib/asset';

interface Item {
  handle: string;
  asin: string;
  title: string;
  productType: string;
  price: number;
  compareAtPrice: number | null;
  available: boolean;
  firstImage: string | null;
  status: string;
  derivedStatus: string;
  pending: string[];
}

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'live', label: '在售' },
  { value: 'coming_soon', label: 'Coming Soon' },
  { value: 'unavailable', label: '不可售' },
  { value: 'hidden', label: '已下架' },
  { value: 'changed', label: '有待发布修改' },
];

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'live'
      ? 'bg-brand-50 text-brand-700'
      : status === 'coming_soon'
        ? 'bg-amber-50 text-amber-700'
        : status === 'hidden'
          ? 'bg-red-50 text-red-600'
          : 'bg-zinc-100 text-zinc-500';
  const label =
    status === 'live' ? '在售' : status === 'coming_soon' ? 'Coming Soon' : status === 'hidden' ? '已下架' : '不可售';
  return <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${cls}`}>{label}</span>;
}

export default function ProductsPage() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (q: string, status: string, page: number) => {
    setLoading(true);
    const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&status=${status}&page=${page}`);
    const data = await res.json();
    setLoading(false);
    setItems(data.items || []);
    setTotal(data.total || 0);
    setPages(data.pages || 1);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(q, status, page), q ? 300 : 0);
    return () => clearTimeout(t);
  }, [q, status, page, load]);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">商品管理</h1>
          <p className="mt-1 text-sm text-zinc-500">共 {total} 个商品 · 点击行进入编辑</p>
        </div>
        <button
          onClick={() => (window.location.href = '/products/new')}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          ＋ 上新商品
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="搜索标题 / SKU / handle…"
          className="w-72 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs text-zinc-500">
            <tr>
              <th className="px-4 py-3">图片</th>
              <th className="px-4 py-3">商品</th>
              <th className="px-4 py-3">类目</th>
              <th className="px-4 py-3">价格</th>
              <th className="px-4 py-3">库存</th>
              <th className="px-4 py-3">状态</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-zinc-400">
                  加载中…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-zinc-400">
                  没有匹配的商品
                </td>
              </tr>
            ) : (
              items.map((p) => (
                <tr key={p.handle} className="border-t border-zinc-100 hover:bg-zinc-50">
                  <td className="px-4 py-2">
                    {p.firstImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={assetSrc(p.firstImage)}
                        alt=""
                        className="h-12 w-12 rounded-lg border border-zinc-100 object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-xs text-zinc-400">
                        无图
                      </div>
                    )}
                  </td>
                  <td className="max-w-md px-4 py-2">
                    <Link href={`/products/${p.handle}`} className="line-clamp-1 font-medium hover:text-brand-700">
                      {p.title}
                    </Link>
                    <div className="mt-0.5 text-xs text-zinc-400">
                      {p.asin} · {p.handle}
                      {p.pending.length > 0 && (
                        <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-blue-600">
                          待发布 {p.pending.length}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-zinc-500">{p.productType}</td>
                  <td className="px-4 py-2">
                    {p.price > 0 ? <>${p.price.toFixed(2)}</> : <span className="text-amber-600">Coming Soon</span>}
                    {p.compareAtPrice != null && p.compareAtPrice > p.price && (
                      <span className="ml-1 text-xs text-zinc-400 line-through">${p.compareAtPrice.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-zinc-500">{p.available ? '有货' : '无货'}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-zinc-500">
          第 {page} / {pages} 页
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((v) => Math.max(1, v - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 disabled:opacity-40"
          >
            上一页
          </button>
          <button
            onClick={() => setPage((v) => Math.min(pages, v + 1))}
            disabled={page >= pages}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 disabled:opacity-40"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
}
