'use client';

import { useState } from 'react';
import { v2url } from '@/lib/v2paths';
import NewsletterForm from '@/components/NewsletterForm';

const footerLinkClass =
  "relative w-fit text-sm opacity-60 hover:opacity-100 transition py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-brand/60 after:transition-all after:duration-300 hover:after:w-full";

/* 移动端手风琴分组：默认折叠，点标题展开；md 及以上始终展开、标题不可点（2026-09 用户定） */
function FooterSection({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="flex items-center justify-between w-full text-left md:pointer-events-none"
      >
        <h4 className="text-sm font-semibold uppercase tracking-wider">{title}</h4>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`md:hidden opacity-60 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <span className="block w-8 h-0.5 rounded bg-brand/40 mt-2 mb-4" />
      <div id={id} className={`${open ? 'block' : 'hidden'} md:block`}>
        <div className="flex flex-col gap-1">{children}</div>
      </div>
    </div>
  );
}

export default function V2Footer() {
  // 移动端手风琴：同一时间只展开一组；桌面端忽略此状态（始终全展开）
  const [openKey, setOpenKey] = useState<string | null>(null);
  const toggle = (key: string) => setOpenKey((k) => (k === key ? null : key));

  return (
    <footer className="bg-off-white text-charcoal">
      {/* Top accent divider */}
      <div className="h-px w-full bg-charcoal/10" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10 md:pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 lg:gap-16 mb-8 md:mb-10">
          <FooterSection id="footer-shop" title="Shop" open={openKey === 'shop'} onToggle={() => toggle('shop')}>
            <a href={v2url('/products')} className={footerLinkClass}>Shop All</a>
            <a href={v2url('/products?cat=cushions')} className={footerLinkClass}>Cushions</a>
            <a href={v2url('/products?cat=pillows')} className={footerLinkClass}>Pillows</a>
            <a href={v2url('/products?cat=towels')} className={footerLinkClass}>Towels</a>
            <a href={v2url('/products?cat=mats')} className={footerLinkClass}>Mats</a>
            <a href={v2url('/products?cat=bedding')} className={footerLinkClass}>Bedding</a>
            <a href={v2url('/products?cat=blankets')} className={footerLinkClass}>Blankets</a>
          </FooterSection>
          <FooterSection id="footer-help" title="Help" open={openKey === 'help'} onToggle={() => toggle('help')}>
            <a href={v2url('/contact')} className={footerLinkClass}>Contact Us</a>
            <a href={v2url('/shipping-returns')} className={footerLinkClass}>Shipping & Returns</a>
            <a href={v2url('/privacy')} className={footerLinkClass}>Privacy Policy</a>
            <a href={v2url('/terms')} className={footerLinkClass}>Terms of Service</a>
          </FooterSection>
          <FooterSection id="footer-about" title="About" open={openKey === 'about'} onToggle={() => toggle('about')}>
            <a href={v2url('/about')} className={footerLinkClass}>Our Story</a>
            <a href={v2url('/about#quality')} className={footerLinkClass}>Quality Promise</a>
            <a href={v2url('/about#sustainability')} className={footerLinkClass}>Sustainability</a>
            <a href={v2url('/blog')} className={footerLinkClass}>Blog</a>
          </FooterSection>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider">Stay in Touch</h4>
            <span className="block w-8 h-0.5 rounded bg-brand/40 mt-2 mb-4" />
            <p className="text-sm opacity-60 mb-4">
              Subscribe for new arrivals, styling tips and exclusive offers.
            </p>
            {/* 真实订阅：Shopify customerCreate（NewsletterForm，2026-09 接通，替代原占位表单） */}
            <NewsletterForm />
          </div>
        </div>

        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-charcoal/10"
        >
          <p className="text-xs opacity-40">&copy; 2026 Makimoo. All rights reserved.</p>
          <p className="text-xs opacity-40">Simple Life, Better Comfort.</p>
        </div>
      </div>
    </footer>
  );
}
