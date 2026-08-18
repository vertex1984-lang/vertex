'use client';

import { useState, useEffect, FormEvent } from 'react';
import { resolveUrl } from '@/lib/paths';
import { getLocalCart, getShopifyCart, openMiniCart } from '@/lib/cart';
import { getFavorites } from '@/lib/favorites';
import { searchProducts, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';

const navLinks = [
  { label: 'Shop All', href: '/products' },
  { label: 'Dining', href: '/products?cat=dining' },
  { label: 'Cushions', href: '/products?cat=cushions' },
  { label: 'Pillows', href: '/products?cat=pillows' },
  { label: 'Travel', href: '/products?cat=travel' },
  { label: 'Home Fragrance', href: '/products?cat=home-fragrance' },
  { label: 'Others', href: '/products?cat=others' },
  { label: 'Contact Us', href: '/contact' },
];

// 热门搜索关键词（hardcode 占位，可后续按真实搜索数据替换）
const HOT_SEARCHES = ['Cushions', 'Pillows', 'Travel', 'Dining', 'Fragrance'];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MakimooProduct[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen || searchOpen) {
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
    window.location.href = resolveUrl(`/products/?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 flex items-center justify-between px-6 lg:px-10 py-4 transition-shadow ${
          scrolled ? 'shadow-md' : ''
        }`}
        style={{ backgroundColor: '#F8F5F0', borderBottom: '1px solid rgba(139,90,43,0.1)' }}
      >
        <a href={resolveUrl('/')} className="flex items-center gap-2">
          <img
            src={resolveUrl('/images/brand/makimoo-logo.webp')}
            alt="Makimoo"
            className="h-16 lg:h-20 w-auto object-contain"
          />
        </a>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={resolveUrl(link.href)}
              className="relative py-1 text-base text-[#333] hover:text-[#8B5A2B] transition-colors group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8B5A2B] transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-11 h-11 rounded-full hover:bg-[rgba(139,90,43,0.08)] text-[#333] hover:text-[#8B5A2B] transition flex items-center justify-center"
            aria-label="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16" y2="16"/>
            </svg>
          </button>

          {/* 收藏入口（带数量角标；暂无独立收藏页，点击进产品列表） */}
          <a
            href={resolveUrl('/products')}
            className="relative w-11 h-11 rounded-full hover:bg-[rgba(139,90,43,0.08)] text-[#333] hover:text-[#8B5A2B] transition flex items-center justify-center"
            aria-label={favCount > 0 ? `Favorites, ${favCount} items` : 'Favorites'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {favCount > 0 && (
              <span
                className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                style={{ backgroundColor: '#8B5A2B' }}
              >
                {favCount > 99 ? '99+' : favCount}
              </span>
            )}
          </a>

          <button
            onClick={openMiniCart}
            className="relative w-11 h-11 rounded-full hover:bg-[rgba(139,90,43,0.08)] text-[#333] hover:text-[#8B5A2B] transition flex items-center justify-center"
            aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M6 6L5 3H2"/>
            </svg>
            {cartCount > 0 && (
              <span
                className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                style={{ backgroundColor: '#8B5A2B' }}
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-11 h-11 flex flex-col items-center justify-center gap-1"
            aria-label="Menu"
          >
            <span className="block w-5 h-0.5 bg-[#333] rounded" />
            <span className="block w-5 h-0.5 bg-[#333] rounded" />
            <span className="block w-5 h-0.5 bg-[#333] rounded" />
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[1400] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-3/4 max-w-sm z-[1500] p-8 pt-20 transition-transform lg:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: '#F8F5F0', boxShadow: '-4px 0 20px rgba(0,0,0,0.15)' }}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-5 right-5 w-11 h-11 rounded-full border border-[#E8E2DA] flex items-center justify-center text-xl text-[#333] hover:bg-[#E8E2DA] hover:text-[#8B5A2B] transition"
          aria-label="Close menu"
        >
          &times;
        </button>
        <nav className="flex flex-col gap-1">
          <a href={resolveUrl('/')} onClick={() => setMobileOpen(false)} className="text-base font-semibold text-[#333] py-3 px-4 rounded-lg hover:text-[#8B5A2B] hover:bg-[rgba(139,90,43,0.06)] transition">
            Home
          </a>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={resolveUrl(link.href)}
              onClick={() => setMobileOpen(false)}
              className="text-base font-semibold text-[#333] py-3 px-4 rounded-lg hover:text-[#8B5A2B] hover:bg-[rgba(139,90,43,0.06)] transition"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[2000] flex flex-col pt-24 px-6"
          style={{ backgroundColor: 'rgba(248,245,240,0.98)' }}
        >
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto w-full flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 px-5 rounded-lg text-base border-2 border-[#E8E2DA] focus:border-[#8B5A2B] focus:ring-2 focus:ring-[#8B5A2B]/20 outline-none bg-white"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              />
              {/* 即时建议下拉（300ms 防抖，client-side 过滤） */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#E8E2DA] overflow-hidden z-10">
                  {suggestions.map((p) => (
                    <a
                      key={p.id}
                      href={resolveUrl(`/products/${p.handle}/`)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8F5F0] transition"
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8B5A2B] w-20 flex-shrink-0 truncate">
                        {p.productType}
                      </span>
                      <span className="text-sm text-[#333] line-clamp-2">{p.title}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="h-12 px-5 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: '#8B5A2B' }}
              aria-label="Submit search"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="w-11 h-11 flex items-center justify-center text-3xl text-[#555] hover:text-[#333] transition"
              aria-label="Close search"
            >
              &times;
            </button>
          </form>

          {/* 热门搜索 chips */}
          {suggestions.length === 0 && (
            <div className="max-w-xl mx-auto w-full mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#999] mb-2.5">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {HOT_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-4 py-2 rounded-full bg-white border border-[#E8E2DA] text-sm text-[#555] hover:border-[#8B5A2B] hover:text-[#8B5A2B] transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
