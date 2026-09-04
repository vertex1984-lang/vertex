import { v2url } from '@/lib/v2paths';

const footerLinkClass =
  "relative w-fit text-sm opacity-60 hover:opacity-100 transition py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-cream/70 after:transition-all after:duration-300 hover:after:w-full";

export default function V2Footer() {
  return (
    <footer className="bg-brand text-cream">
      {/* Top accent divider */}
      <div
        className="h-1 w-full"
        style={{ background: 'linear-gradient(to right, rgba(255,248,240,0.35), rgba(255,248,240,0.05))' }}
      />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-10">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider">Shop</h4>
            <span className="block w-8 h-0.5 rounded bg-cream/40 mt-2 mb-4" />
            <div className="flex flex-col gap-1">
              <a href={v2url('/products')} className={footerLinkClass}>Shop All</a>
              <a href={v2url('/products?cat=cushions')} className={footerLinkClass}>Cushions</a>
              <a href={v2url('/products?cat=pillows')} className={footerLinkClass}>Pillows</a>
              <a href={v2url('/products?cat=towels')} className={footerLinkClass}>Bath</a>
              <a href={v2url('/products?cat=mats')} className={footerLinkClass}>Mats</a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider">Help</h4>
            <span className="block w-8 h-0.5 rounded bg-cream/40 mt-2 mb-4" />
            <div className="flex flex-col gap-1">
              <a href={v2url('/contact')} className={footerLinkClass}>Contact Us</a>
              <a href={v2url('/shipping-returns')} className={footerLinkClass}>Shipping & Returns</a>
              <a href={v2url('/privacy')} className={footerLinkClass}>Privacy Policy</a>
              <a href={v2url('/terms')} className={footerLinkClass}>Terms of Service</a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider">About</h4>
            <span className="block w-8 h-0.5 rounded bg-cream/40 mt-2 mb-4" />
            <div className="flex flex-col gap-1">
              <a href={v2url('/about')} className={footerLinkClass}>Our Story</a>
              <a href={v2url('/about#quality')} className={footerLinkClass}>Quality Promise</a>
              <a href={v2url('/about#sustainability')} className={footerLinkClass}>Sustainability</a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider">Stay in Touch</h4>
            <span className="block w-8 h-0.5 rounded bg-cream/40 mt-2 mb-4" />
            <p className="text-sm opacity-60 mb-4">
              Subscribe for new arrivals, styling tips and exclusive offers.
            </p>
            {/* 订阅简报占位：后续接入真实订阅服务 */}
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                disabled
                className="flex-1 min-w-0 h-11 px-4 rounded-lg bg-cream/10 border border-cream/25 text-sm placeholder:text-cream/40 outline-none cursor-not-allowed"
              />
              <button
                type="button"
                disabled
                className="h-11 px-5 rounded-lg bg-cream text-brand text-sm font-semibold opacity-50 cursor-not-allowed flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs opacity-40 mt-3">Coming soon.</p>
          </div>
        </div>

        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid rgba(255,248,240,0.15)' }}
        >
          <p className="text-xs opacity-40">&copy; 2026 Makimoo. All rights reserved.</p>
          <p className="text-xs opacity-40">Simple Life, Better Comfort.</p>
        </div>
      </div>
    </footer>
  );
}
