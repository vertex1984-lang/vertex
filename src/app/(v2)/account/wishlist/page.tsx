'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { v2url } from '@/lib/v2paths';
import { pruneFavorites, syncFavoritesWithCloud } from '@/lib/favorites';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { useCustomer } from '@/lib/use-customer';

/**
 * /account/wishlist（批次 2 B4）：登录态心愿单 = 本地 localStorage 与云端（admin
 * /api/wishlist，按 customerId）「拉取合并 → 本地 → 覆盖回写」后的并集视图。
 * 渲染口径与游客 /favorites/ 页一致（ProductCard 网格，爱心点击即移除并双向同步）。
 */
export default function AccountWishlistPage() {
  const { profile, loading } = useCustomer();
  const [products, setProducts] = useState<MakimooProduct[] | null>(null);
  const [syncMsg, setSyncMsg] = useState('');

  useEffect(() => {
    if (loading || !profile) return;
    let cancelled = false;
    const run = async () => {
      // 云合并（本地为主，云端并入；失败保持本地）
      await syncFavoritesWithCloud(profile.id);
      if (cancelled) return;
      const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA);
      const inCatalog = new Set(enriched.map((p) => p.id));
      // 剪 ghost 后本地序倒序渲染（与游客 favorites 页同一口径：最新收藏在前）
      const kept = pruneFavorites((id) => inCatalog.has(id)).slice().reverse();
      setProducts(kept.map((id) => enriched.find((p) => p.id === id)).filter((p): p is MakimooProduct => Boolean(p)));
      setSyncMsg('Synced to your account.');
    };
    run();
    const refresh = () => {
      if (cancelled) return;
      const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA);
      const inCatalog = new Set(enriched.map((p) => p.id));
      const kept = pruneFavorites((id) => inCatalog.has(id)).slice().reverse();
      setProducts(kept.map((id) => enriched.find((p) => p.id === id)).filter((p): p is MakimooProduct => Boolean(p)));
      // 本地变化（爱心移除）→ 推云端
      void pushQuiet(profile.id, kept);
    };
    window.addEventListener('makimoo:favorites-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      cancelled = true;
      window.removeEventListener('makimoo:favorites-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, profile?.id]);

  if (loading || !profile) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-warm-gray rounded w-1/3" />
        <div className="h-40 bg-warm-gray rounded-2xl" />
      </div>
    );
  }

  const count = products?.length ?? 0;

  /** 任务 5.1：复制分享链接（公开只读视图 /wishlist/?w=<customerId>，接收人免登录可看） */
  async function copyShareLink() {
    if (!profile) return;
    const link = `${window.location.origin}${v2url('/wishlist/')}?w=${encodeURIComponent(profile.id)}`;
    try {
      await navigator.clipboard.writeText(link);
      setSyncMsg('Share link copied — anyone with it can view this list.');
    } catch {
      // 剪贴板权限被拒（http 环境等）：退化为显示链接让用户手动复制
      setSyncMsg(`Share link: ${link}`);
    }
  }

  async function pushQuiet(customerId: string, ids: string[]) {
    const { pushFavoritesToCloud } = await import('@/lib/favorites');
    await pushFavoritesToCloud(customerId, ids.slice().reverse()); // 还原本地序（旧→新）再推
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-charcoal">Wishlist ({count})</h2>
        <div className="flex items-center gap-3">
          {count > 0 && (
            <button onClick={copyShareLink} className="text-xs font-semibold text-brand hover:underline underline-offset-2">
              ⇗ Share
            </button>
          )}
          {syncMsg && count > 0 && <span className="text-[11px] text-emerald-600">{syncMsg}</span>}
        </div>
      </div>

      {products === null ? null : products.length === 0 ? (
        <div className="rounded-2xl border border-warm-gray bg-white p-8 text-center">
          <h3 className="text-lg font-bold text-charcoal mb-2">Your wishlist is empty</h3>
          <p className="text-xs text-charcoal-light mb-5">Tap the heart on any product to save it here — synced to your account.</p>
          <a href={v2url('/categories/')} className="inline-block px-7 py-2.5 rounded-full border-2 border-brand text-brand text-xs font-semibold uppercase tracking-wide transition hover:bg-brand hover:text-cream">
            Discover products
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
          {products.map((p) => {
            const unavailable = p.hasShopifyData && !p.shopifyAvailable;
            return (
              <div key={p.id} className={`relative ${unavailable ? 'opacity-60' : ''}`}>
                <ProductCard product={p} href={v2url(`/products/${p.handle}/`)} />
                {unavailable && (
                  <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-charcoal/80 text-cream text-[10px] font-semibold tracking-widest uppercase">Unavailable</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
