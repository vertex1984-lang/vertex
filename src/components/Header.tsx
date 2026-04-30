'use client';

import { useState, useEffect } from 'react';
import { resolveUrl } from '@/lib/paths';

const navLinks = [
  { label: 'Shop All', href: '/products' },
  { label: 'Dining', href: '/products?cat=dining' },
  { label: 'Cushions', href: '/products?cat=cushions' },
  { label: 'Pillows', href: '/products?cat=pillows' },
  { label: 'Travel', href: '/products?cat=travel' },
  { label: 'Home Fragrance', href: '/products?cat=home-fragrance' },
  { label: 'Others', href: '/products?cat=others' },
  { label: 'Our Comfort Story', href: '/about' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
              className="relative py-1 text-[#333] hover:text-[#8B5A2B] transition-colors group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8B5A2B] transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-full hover:bg-[rgba(139,90,43,0.08)] text-[#333] hover:text-[#8B5A2B] transition"
            aria-label="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16" y2="16"/>
            </svg>
          </button>

          <a
            href={resolveUrl('/cart')}
            className="p-2 rounded-full hover:bg-[rgba(139,90,43,0.08)] text-[#333] hover:text-[#8B5A2B] transition"
            aria-label="Cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M6 6L5 3H2"/>
            </svg>
          </a>

          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex flex-col gap-1 p-2"
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
          className="absolute top-5 right-5 w-9 h-9 rounded-full border border-[#E8E2DA] flex items-center justify-center text-xl text-[#333] hover:bg-[#E8E2DA] hover:text-[#8B5A2B] transition"
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
          <div className="max-w-xl mx-auto w-full flex items-center gap-3">
            <input
              type="text"
              placeholder="Search products..."
              autoFocus
              className="flex-1 px-5 py-4 rounded-lg text-lg border-2 border-[#E8E2DA] focus:border-[#8B5A2B] outline-none bg-white"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="text-3xl text-[#555] hover:text-[#333] transition"
            >
              &times;
            </button>
          </div>
          <div className="max-w-xl mx-auto w-full mt-5 text-sm text-[#555]">
            Type to search products...
          </div>
        </div>
      )}
    </>
  );
}
