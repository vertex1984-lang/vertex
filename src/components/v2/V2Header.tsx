'use client';

import { useState, useEffect, FormEvent } from 'react';
import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';
import { getLocalCart, getShopifyCart, openMiniCart } from '@/lib/cart';
import { getFavorites } from '@/lib/favorites';
import { searchProducts, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';

// V2 导航：Bath 沿用现有分类 query 参数 towels
const navLinks = [
  { label: 'Shop All', href: '/products' },
  { label: 'Cushions', href: '/products?cat=cushions' },
  { label: 'Pillows', href: '/products?cat=pillows' },
  { label: 'Bath', href: '/products?cat=towels' },
  { label: 'Mats', href: '/products?cat=mats' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// 热门搜索关键词（hardcode 占位，可后续按真实搜索数据替换）
const HOT_SEARCHES = ['Cushions', 'Pillows', 'Towels', 'Mats', 'Neck Pillow'];

export default function V2Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MakimooProduct[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    // 滞回阈值：滚动超过 60px 变实底，回到 30px 以下才恢复透明，
    // 避免在阈值附近来回抖动
    let last = false;
    const onScroll = () => {
      const y = window.scrollY;
      const next = last ? y > 30 : y > 60;
      if (next !== last) {
        last = next;
        setScrolled(next);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // 只有移动端菜单锁定滚动；搜索面板不锁定（原页面保持可交互）
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen, searchOpen]);

  // Esc 关闭搜索遮罩和移动端菜单
  useEffect(() => {
    if (!mobileOpen && !searchOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen, searchOpen]);

  // 购物车角标：本地购物车 + Shopify 购物车数量之和
  // 仅在 mount 和购物车变化事件时刷新（Shopify 数量需一次 API 请求，不在渲染期发起）
  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const localCount = getLocalCart().reduce((sum, item) => sum + item.quantity, 0);
      let shopifyCount = 0;
      const cart = await getShopifyCart();
      if (cart?.lines?.edges) {
        shopifyCount = cart.lines.edges.reduce(
          (sum: number, edge: { node: { quantity: number } }) => sum + edge.node.quantity,
          0
        );
      }
      if (!cancelled) setCartCount(localCount + shopifyCount);
    };
    refresh();
    window.addEventListener('makimoo:cart-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      cancelled = true;
      window.removeEventListener('makimoo:cart-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  // 收藏角标
  useEffect(() => {
    const refresh = () => setFavCount(getFavorites().length);
    refresh();
    window.addEventListener('makimoo:favorites-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('makimoo:favorites-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  // 搜索建议：300ms 防抖，本地即时过滤
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      setSuggestions(enrichProductsWithShopifyData(searchProducts(q)).slice(0, 6));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    window.location.href = v2url(`/products/?q=${encodeURIComponent(q)}`);
  };

  // 透明态（首屏大图）用 cream 文字，滚动实底后用 charcoal
  const textColor = scrolled ? 'text-charcoal' : 'text-cream';
  const iconHover = scrolled
    ? 'hover:bg-brand/10 hover:text-brand'
    : 'hover:bg-cream/15 hover:text-cream';

  return (
    <>
      <div className="fixed top-0 z-50 w-full">
        {/* Announcement Bar */}
        <div className="bg-brand text-cream text-center text-xs font-medium tracking-wide py-2 px-4">
          Free Shipping on Orders Over $49 | 30-Day Easy Returns
        </div>

        <header
          className={`flex items-center justify-between px-6 lg:px-10 py-4 transition-all duration-300 ${textColor} ${
            scrolled ? 'bg-off-white/95 backdrop-blur shadow-md' : 'bg-transparent'
          }`}
        >
          <a href={v2url('/')} className="flex items-center gap-2">
            <img
              src={resolveUrl('/images/brand/makimoo-logo.webp')}
              alt="Makimoo"
              className="h-12 lg:h-14 w-auto object-contain transition-all duration-300"
              style={scrolled ? undefined : { filter: 'brightness(0) invert(1)' }}
            />
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={v2url(link.href)}
                className="relative py-1 text-base hover:text-brand transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className={`w-11 h-11 rounded-full transition flex items-center justify-center ${iconHover}`}
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16" y2="16"/>
              </svg>
            </button>

            {/* 收藏入口（带数量角标；暂无独立收藏页，点击进商品汇总页） */}
            <a
              href={v2url('/products')}
              className={`relative w-11 h-11 rounded-full transition flex items-center justify-center ${iconHover}`}
              aria-label={favCount > 0 ? `Favorites, ${favCount} items` : 'Favorites'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {favCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-cream text-[10px] font-bold flex items-center justify-center">
                  {favCount > 99 ? '99+' : favCount}
                </span>
              )}
            </a>

            <button
              onClick={openMiniCart}
              className={`relative w-11 h-11 rounded-full transition flex items-center justify-center ${iconHover}`}
              aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M6 6L5 3H2"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-cream text-[10px] font-bold flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-11 h-11 flex flex-col items-center justify-center gap-1"
              aria-label="Menu"
            >
              <span className="block w-5 h-0.5 bg-current rounded" />
              <span className="block w-5 h-0.5 bg-current rounded" />
              <span className="block w-5 h-0.5 bg-current rounded" />
            </button>
          </div>

          {/* Search Panel：导航下方的下拉面板，不遮全屏、不锁滚动，点外部/Esc 关闭 */}
          {searchOpen && (
            <div
              className="absolute top-full left-0 right-0 bg-off-white border-y border-warm-gray shadow-[0_12px_32px_rgba(60,45,30,0.12)] text-charcoal"
              style={{ animation: 'fadeIn 0.18s ease-out' }}
            >
              <div className="max-w-2xl mx-auto px-6 py-5">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search products..."
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg text-sm border-2 border-warm-gray focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none bg-white"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-11 px-5 rounded-lg text-sm font-semibold text-cream bg-brand transition hover:bg-brand-dark flex-shrink-0"
                    aria-label="Submit search"
                  >
                    Search
                  </button>
                </form>

                {/* 即时建议（300ms 防抖，client-side 过滤） */}
                {suggestions.length > 0 && (
                  <div className="mt-3 bg-white rounded-xl border border-warm-gray overflow-hidden max-h-80 overflow-y-auto">
                    {suggestions.map((p) => (
                      <a
                        key={p.id}
                        href={v2url(`/products/${p.handle}/`)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-off-white transition"
                      >
                        {p.images?.[0] && (
                          <img
                            src={resolveUrl(p.images[0].url)}
                            alt={p.images[0].altText || p.title}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-off-white border border-warm-gray"
                            loading="lazy"
                          />
                        )}
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-brand w-16 flex-shrink-0 truncate">
                          {p.productType}
                        </span>
                        <span className="text-sm text-charcoal line-clamp-2">{p.title}</span>
                      </a>
                    ))}
                  </div>
                )}

                {/* 热门搜索 chips */}
                {suggestions.length === 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-light mb-2.5">Popular Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {HOT_SEARCHES.map((term) => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="px-4 py-2 rounded-full bg-white border border-warm-gray text-sm text-charcoal-light hover:border-brand hover:text-brand transition"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </header>
      </div>

      {/* Mobile Full-screen Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[1500] bg-off-white text-charcoal p-8 pt-20 overflow-y-auto lg:hidden">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full border border-warm-gray flex items-center justify-center text-xl text-charcoal hover:bg-warm-gray hover:text-brand transition"
            aria-label="Close menu"
          >
            &times;
          </button>
          <nav className="flex flex-col gap-1">
            <a
              href={v2url('/')}
              onClick={() => setMobileOpen(false)}
              className="text-base font-semibold text-charcoal py-3 px-4 rounded-lg hover:text-brand hover:bg-brand/5 transition"
            >
              Home
            </a>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={v2url(link.href)}
                onClick={() => setMobileOpen(false)}
                className="text-base font-semibold text-charcoal py-3 px-4 rounded-lg hover:text-brand hover:bg-brand/5 transition"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* 点击面板外部区域关闭搜索 */}
      {searchOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setSearchOpen(false)} aria-hidden="true" />
      )}
    </>
  );
}
