'use client';

import { Fragment, useState } from 'react';
import { assetSrc } from '@/lib/asset';

/** 选品行（server page 聚合后的单款视图） */
export interface WishlistRow {
  productId: string;
  /** 快照 join 的商品名；join 不到为空串（UI 显示 id 兜底） */
  title: string;
  image: string;
  /** 账号收藏数（wishlists 展开） */
  account: number;
  /** 游客留资数（wishlistCaptures） */
  captures: number;
  total: number;
  /** 其中同意数字营销的条数 */
  consents: number;
  /** 游客留资明细（名单展开；账号收藏不展开——只有 customerId 无邮箱，隐私设计） */
  captureList: { email: string; marketingConsent: boolean; at: string; source: string }[];
}

/**
 * 心愿单选品表（批次 5）：合计降序、行内展开游客名单、客户端 CSV 导出
 * （导出 = 游客留资名单全量，含 consent 列——运营触达与合规审计两用）。
 */
export default function WishlistBoard({ rows }: { rows: WishlistRow[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  function exportCsv() {
    const header = ['productId', 'productName', 'email', 'marketingConsent', 'source', 'at'];
    const body: string[][] = [];
    for (const r of rows) {
      for (const c of r.captureList) {
        body.push([r.productId, r.title || r.productId, c.email, String(c.marketingConsent), c.source, c.at]);
      }
    }
    const csv = [header, ...body].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `wishlist-captures-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg(`已导出 ${body.length} 条游客留资（含 consent 列）`);
  }

  if (rows.length === 0) {
    return (
      <section className="rounded-xl border border-zinc-200 bg-white">
        <div className="px-4 py-10 text-center text-sm text-zinc-400">
          还没有收藏数据——前台收藏/留资后这里会出现选品排行
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-3">
      {msg && <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm text-brand-700">{msg}</div>}

      <section className="rounded-xl border border-zinc-200 bg-white">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-zinc-700">按款聚合（合计降序，Top N = 下一批候选池）</h2>
          <button
            onClick={exportCsv}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            导出游客留资 CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs text-zinc-500">
                <th className="w-10 px-4 py-2 font-medium">#</th>
                <th className="px-2 py-2 font-medium">商品</th>
                <th className="w-20 px-2 py-2 text-right font-medium">账号收藏</th>
                <th className="w-20 px-2 py-2 text-right font-medium">游客留资</th>
                <th className="w-16 px-2 py-2 text-right font-medium">合计</th>
                <th className="w-20 px-2 py-2 text-right font-medium">同意营销</th>
                <th className="w-24 px-4 py-2 text-right font-medium">名单</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const open = openId === r.productId;
                return (
                  <Fragment key={r.productId}>
                    <tr className="border-b border-zinc-100 hover:bg-zinc-50">
                      <td className="px-4 py-3 text-zinc-400">{i + 1}</td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-3">
                          {r.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={assetSrc(r.image)}
                              alt=""
                              className="h-10 w-10 shrink-0 rounded border border-zinc-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-zinc-200 bg-zinc-50 text-[10px] text-zinc-400">
                              N/A
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-medium text-zinc-800">{r.title || r.productId}</p>
                            {r.title && <p className="truncate text-xs text-zinc-400">{r.productId}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-3 text-right tabular-nums text-zinc-700">{r.account}</td>
                      <td className="px-2 py-3 text-right tabular-nums text-zinc-700">{r.captures}</td>
                      <td className="px-2 py-3 text-right font-semibold tabular-nums text-brand-700">{r.total}</td>
                      <td className="px-2 py-3 text-right tabular-nums text-zinc-700">{r.consents}</td>
                      <td className="px-4 py-3 text-right">
                        {r.captureList.length > 0 ? (
                          <button
                            onClick={() => setOpenId(open ? null : r.productId)}
                            className="text-brand-600 underline-offset-2 hover:underline"
                          >
                            {open ? '收起' : `${r.captureList.length} 人`}
                          </button>
                        ) : (
                          <span className="text-zinc-300">—</span>
                        )}
                      </td>
                    </tr>
                    {open && (
                      <tr className="border-b border-zinc-100 bg-zinc-50/60">
                        <td colSpan={7} className="px-8 py-3">
                          <ul className="space-y-1 text-xs text-zinc-600">
                            {r.captureList.map((c) => (
                              <li key={c.email}>
                                {c.email}
                                <span
                                  className={`ml-2 rounded-full px-2 py-0.5 ${
                                    c.marketingConsent ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-500'
                                  }`}
                                >
                                  {c.marketingConsent ? '同意营销' : '未同意'}
                                </span>
                                <span className="ml-2 text-zinc-400">{c.at.slice(0, 16).replace('T', ' ')}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="mt-2 text-[11px] text-zinc-400">
                            账号收藏名单不展示（仅 customerId，无邮箱——隐私设计）
                          </p>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
