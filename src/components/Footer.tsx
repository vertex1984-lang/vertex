import { resolveUrl } from '@/lib/paths';

const footerLinkClass =
  "relative w-fit text-sm opacity-60 hover:opacity-100 transition py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white/70 after:transition-all after:duration-300 hover:after:w-full";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#8B5A2B', color: '#F8F5F0' }}>
      {/* Top accent divider */}
      <div
        className="h-1 w-full"
        style={{ background: 'linear-gradient(to right, rgba(255,248,240,0.35), rgba(255,248,240,0.05))' }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-10">
          <div>
            <img
              src={resolveUrl('/images/brand/makimoo-logo.webp')}
              alt="Makimoo"
              className="h-16 w-auto object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <p className="mt-2 text-sm opacity-60">Simple Life, Better Comfort.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider">Shop</h4>
            <span className="block w-8 h-0.5 rounded bg-white/40 mt-2 mb-4" />
            <div className="flex flex-col gap-1">
              <a href={resolveUrl('/products')} className={footerLinkClass}>All Products</a>
              <a href={resolveUrl('/products?cat=dining')} className={footerLinkClass}>Dining Cushions</a>
              <a href={resolveUrl('/products?cat=cushions')} className={footerLinkClass}>Chair Cushions</a>
              <a href={resolveUrl('/products?cat=pillows')} className={footerLinkClass}>Pillow Inserts</a>
              <a href={resolveUrl('/products?cat=travel')} className={footerLinkClass}>Travel Pillows</a>
              <a href={resolveUrl('/products?cat=home-fragrance')} className={footerLinkClass}>Home Fragrance</a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider">Company</h4>
            <span className="block w-8 h-0.5 rounded bg-white/40 mt-2 mb-4" />
            <div className="flex flex-col gap-1">
              <a href={resolveUrl('/about')} className={footerLinkClass}>Our Story</a>
              <a href={resolveUrl('/about#quality')} className={footerLinkClass}>Quality Promise</a>
              <a href={resolveUrl('/about#sustainability')} className={footerLinkClass}>Sustainability</a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider">Support</h4>
            <span className="block w-8 h-0.5 rounded bg-white/40 mt-2 mb-4" />
            <div className="flex flex-col gap-1">
              <a href={resolveUrl('/contact')} className={footerLinkClass}>Contact Us</a>
              <a href={resolveUrl('/shipping-returns')} className={footerLinkClass}>Shipping & Returns</a>
              <a href={resolveUrl('/privacy')} className={footerLinkClass}>Privacy Policy</a>
              <a href={resolveUrl('/terms')} className={footerLinkClass}>Terms of Service</a>
              <span className="text-sm opacity-60 py-1 cursor-default">FAQ</span>
            </div>
          </div>
        </div>

        {/* Social icons removed: previous placeholders pointed to dead "#" links.
            Restore them here as <a> once real brand profile URLs are available. */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(248,245,240,0.15)' }}
        >
          <p className="text-xs opacity-40">&copy; 2026 Makimoo. All rights reserved.</p>
          <p className="text-xs opacity-40">Simple Life, Better Comfort.</p>
        </div>
      </div>
    </footer>
  );
}
