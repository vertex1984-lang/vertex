'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { v2url } from '@/lib/v2paths';
import { pullFavoritesFromCloud } from '@/lib/favorites';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';

/**
 * 心愿单分享只读视图（批次 3 任务 5.1）：/wishlist/?w=<customerId>。
 * 公开路由（不在 /account/ 内，AccountGuard 不拦截）——接收人免登录即可看清单；
 * 数据 = makimoo-admin /api/wishlist 按 customerId 拉（x-review/wishlist token 模式）。
 * 只读：不渲染管理操作；访客点卡片爱心只影响其本地收藏，不改分享者云端数据。
 */
export default function SharedWishlistPage() {
  const [products, setProducts] = useState<MakimooProduct[] | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const w = new URLSearchParams(window.location.search).get('w');
    if (!w) {
      setMissing(true);
      return;
    }
    let cancelled = false;
    (async () => {
      const handles = await pullFavoritesFromCloud(decodeURIComponent(w));
      if (cancelled) return;
      if (!handles || handles.length === 0) {
        setMissing(true);
        return;
      }
      const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA);
      const byId = new Map(enriched.map((p) => [p.id, p] as const));
      setProducts(handles.map((id) => byId.get(id)).filter((p): p is MakimooProduct => Boolean(p)));
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="bg-off-white px-4 lg:px-10 pt-28 lg:pt-36 pb-16 lg:pb-24">
      <div className="mx-auto w-full max-w-[1400px]">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2 text-center">Wishlist</p>
        <h1 className="text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal leading-tight mb-2 text-center">Shared wishlist</h1>
        <p className="text-sm text-charcoal-light text-center mb-8">A Makimoo shopper shared this list with you.</p>

        {products === null && !missing && (
          <div className="animate-pulse grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-warm-gray rounded" />
                <div className="h-3 bg-warm-gray rounded w-2/3 mt-3" />
              </div>
            ))}
          </div>
        )}

        {missing && (
          <div className="rounded-2xl border border-warm-gray bg-white p-10 text-center max-w-md mx-auto">
            <p className="text-sm text-charcoal-light">This shared wishlist is empty or no longer available.</p>
            <a href={v2url('/categories/')} className="mt-4 inline-block px-7 py-2.5 rounded-full border-2 border-brand text-brand text-xs font-semibold uppercase tracking-wide transition hover:bg-brand hover:text-cream">
              Browse products
            </a>
          </div>
        )}

        {products !== null && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} href={v2url(`/products/${p.handle}/`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
