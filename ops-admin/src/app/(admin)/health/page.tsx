import { loadSnapshot } from '@/lib/snapshot';

export const dynamic = 'force-dynamic';

export default function HealthPage() {
  const snap = loadSnapshot();
  const s = snap.stats;

  return (
    <div>
      <h1 className="text-xl font-semibold">数据健康</h1>
      <p className="mt-1 text-sm text-zinc-500">
        快照时间：{new Date(snap.importedAt).toLocaleString('zh-CN')} · 每次发布前建议先看一眼这里
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="text-sm text-zinc-500">场景图</div>
          <div className="mt-1 text-3xl font-semibold">{s.sceneCount}</div>
          <div className="mt-1 text-xs text-zinc-400">共 {s.hotspotCount} 个商品热区</div>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="text-sm text-red-600">死 SKU（热区指向不存在的商品）</div>
          <div className="mt-1 text-3xl font-semibold text-red-700">{s.deadSkuCount}</div>
          <div className="mt-1 text-xs text-red-400">圆点被自动过滤不 404，属数据债</div>
        </div>
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
          <div className="text-sm text-orange-700">404 风险（有商品但无落地页）</div>
          <div className="mt-1 text-3xl font-semibold text-orange-700">{s.noPageCount ?? 0}</div>
          <div className="mt-1 text-xs text-orange-400">圆点会渲染但点击 404，需优先处理</div>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="text-sm text-amber-700">Coming Soon（快照价 0）</div>
          <div className="mt-1 text-3xl font-semibold text-amber-700">{s.comingSoon}</div>
          <div className="mt-1 text-xs text-amber-500">价格位显示 Coming Soon，待定价/开卖</div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="text-sm text-zinc-500">无 Shopify 关联</div>
          <div className="mt-1 text-3xl font-semibold">{s.noShopify}</div>
          <div className="mt-1 text-xs text-zinc-400">快照里没有对应 Shopify 商品</div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-3 text-sm font-medium text-zinc-700">
          ⚠️ 404 风险清单（{snap.noPageSkus?.length ?? 0}）—— 商品在表但没落地页，圆点点击会 404
        </div>
        {(snap.noPageSkus?.length ?? 0) === 0 ? (
          <div className="px-5 py-6 text-center text-sm text-zinc-400">没有风险 🎉</div>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {snap.noPageSkus!.map((d) => (
                <tr key={d.handle} className="border-t border-zinc-100">
                  <td className="px-5 py-2 font-medium text-orange-600">{d.handle}</td>
                  <td className="max-w-lg px-5 py-2 text-xs text-zinc-500">{d.scenes.join('、')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-3 text-sm font-medium text-zinc-700">
          死 SKU 清单（{snap.deadSkus.length}）—— 热区指向的商品不存在，圆点被滤
        </div>
        {snap.deadSkus.length === 0 ? (
          <div className="px-5 py-6 text-center text-sm text-zinc-400">没有死链 🎉</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs text-zinc-500">
              <tr>
                <th className="px-5 py-2">handle（商品不存在）</th>
                <th className="px-5 py-2">出镜场景数</th>
                <th className="px-5 py-2">场景 slug</th>
              </tr>
            </thead>
            <tbody>
              {snap.deadSkus.map((d) => (
                <tr key={d.handle} className="border-t border-zinc-100">
                  <td className="px-5 py-2 font-medium text-red-600">{d.handle}</td>
                  <td className="px-5 py-2">{d.scenes.length}</td>
                  <td className="max-w-lg px-5 py-2 text-xs text-zinc-500">{d.scenes.join('、')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="border-t border-zinc-100 px-5 py-3 text-xs text-zinc-400">
          处理方式三选一：在 Shopify 补建商品（自动接上）/ 删除对应热区 / 换绑同类商品。（正式版会做成一键修复）
        </div>
      </div>
    </div>
  );
}
