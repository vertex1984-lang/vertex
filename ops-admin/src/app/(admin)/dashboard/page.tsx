import Link from 'next/link';
import { loadSnapshot } from '@/lib/snapshot';
import { readDb } from '@/lib/db';
import RefreshSnapshotButton from './RefreshSnapshotButton';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const snap = loadSnapshot();
  const db = readDb();
  const pendingCount = db.changes.filter((c) => c.status === 'pending').length;
  const s = snap.stats;

  const cards = [
    { label: '商品总数', value: s.total, sub: `另有 ${s.hiddenRaw} 个隐藏商品未上架`, href: '/products' },
    { label: '在售', value: s.live, sub: '价格 > 0 且库存可售', href: '/products?status=live' },
    { label: 'Coming Soon', value: s.comingSoon, sub: '快照价 0（未开卖）', href: '/products?status=coming_soon' },
    { label: '不可售', value: s.unavailable, sub: 'Shopify 库存标记售罄', href: '/products?status=unavailable' },
    { label: '待发布修改', value: pendingCount, sub: '变更清单里等发布', href: '/changes' },
    { label: '死 SKU（场景热区）', value: s.deadSkuCount, sub: `${s.hotspotCount} 个热区中的死链`, href: '/health' },
  ];

  const topCats = Object.entries(s.byCategory).sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">仪表盘</h1>
          <p className="mt-1 text-sm text-zinc-500">
            快照时间：{new Date(snap.importedAt).toLocaleString('zh-CN')} · 来源：vertex 仓库数据
          </p>
        </div>
        <RefreshSnapshotButton />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-brand-500 hover:shadow-sm"
          >
            <div className="text-sm text-zinc-500">{c.label}</div>
            <div className="mt-1 text-3xl font-semibold">{c.value}</div>
            <div className="mt-1 text-xs text-zinc-400">{c.sub}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-medium text-zinc-700">类目分布 Top 8</h2>
        <div className="mt-3 space-y-2">
          {topCats.map(([cat, n]) => (
            <div key={cat} className="flex items-center gap-3 text-sm">
              <div className="w-32 shrink-0 truncate text-zinc-600">{cat}</div>
              <div className="h-2 flex-1 rounded-full bg-zinc-100">
                <div className="h-2 rounded-full bg-brand-500" style={{ width: `${(n / s.total) * 100}%` }} />
              </div>
              <div className="w-12 text-right text-zinc-500">{n}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
