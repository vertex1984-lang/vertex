'use client';

import { useEffect, useState } from 'react';
import V2PageHeader from '@/components/v2/V2PageHeader';
import ProductCard from '@/components/ProductCard';
import { v2url } from '@/lib/v2paths';
import { getFavorites } from '@/lib/favorites';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';

/**
 * V2 心愿单页（/favorites/）：localStorage（makimoo-favorites）里的收藏产品网格。
 * 最近收藏在前（favorites 数组尾部是最新，渲染前倒序）；卡片爱心点击即移除并实时刷新
 * （监听 makimoo:favorites-updated）；已下架产品灰显 + Unavailable 角标。
 * client 页面，metadata 由同目录 layout.tsx 提供（同 cart/）。
 */
export default function V2FavoritesPage() {
  // null = 尚未挂载（SSR/首帧），避免 hydration 不一致
  const [products, setProducts] = useState<MakimooProduct[] | null>(null);

  useEffect(() => {
    const refresh = () => {
      const ids = getFavorites().slice().reverse();
      const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA);
      setProducts(
        ids
          .map((id) => enriched.find((p) => p.id === id))
          .filter((p): p is MakimooProduct => Boolean(p))
      );
    };
    refresh();
    window.addEventListener('makimoo:favorites-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('makimoo:favorites-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const count = products?.length ?? 0;

  return (
    <>
      <V2PageHeader
        crumbs={[{ label: 'Home', href: '/' }, { label: 'My Wishlist' }]}
        title="My Wishlist"
        subtitle={
          products === null
            ? undefined
            : count === 0
              ? 'Nothing saved yet.'
              : `${count} ${count === 1 ? 'item' : 'items'} you love, all in one place.`
        }
      />

      <section className="px-3 lg:px-10 py-10 lg:py-14">
        {products === null ? null : products.length === 0 ? (
          /* 空状态：心形线框 + 引导去逛产品 */
          <div className="py-16 lg:py-24 text-center">
            <svg
              viewBox="0 0 24 24"
              className="w-16 h-16 mx-auto mb-6 text-warm-gray"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-charcoal mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-sm lg:text-base text-charcoal-light max-w-md mx-auto mb-8">
              Tap the heart on any product to save it here for later.
            </p>
            <a
              href={v2url('/products/')}
              className="inline-block px-9 py-3.5 rounded-full border-2 border-brand text-brand text-sm font-semibold tracking-wide uppercase transition hover:bg-brand hover:text-cream"
            >
              Discover Products
            </a>
          </div>
        ) : (
          /* 收藏网格：与 /products 列表页同款 ProductCard，爱心点击即移除 */
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
            {products.map((p) => {
              const unavailable = p.hasShopifyData && !p.shopifyAvailable;
              return (
                <div key={p.id} className={`relative ${unavailable ? 'opacity-60' : ''}`}>
                  <ProductCard product={p} href={v2url(`/products/${p.handle}/`)} />
                  {unavailable && (
                    <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-charcoal/80 text-cream text-[10px] font-semibold tracking-widest uppercase">
                      Unavailable
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
