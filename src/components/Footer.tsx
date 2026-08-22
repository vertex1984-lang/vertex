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
              <a href={resolveUrl('/products?cat=cushions')} className={footerLinkClass}>Cushions</a>
              <a href={resolveUrl('/products?cat=pillows')} className={footerLinkClass}>Pillows</a>
              <a href={resolveUrl('/products?cat=towels')} className={footerLinkClass}>Towels</a>
              <a href={resolveUrl('/products?cat=mats')} className={footerLinkClass}>Mats</a>
              <a href={resolveUrl('/products?cat=others')} className={footerLinkClass}>Others</a>
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

        {/* 支付方式 + 信任语（纯 SVG 内联图标，无外部资源） */}
        <div className="flex flex-col items-center gap-3 pt-8 mb-6" style={{ borderTop: '1px solid rgba(248,245,240,0.15)' }}>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Visa */}
            <span className="h-7 px-2.5 rounded bg-white/95 flex items-center" title="Visa">
              <svg width="34" height="12" viewBox="0 0 34 12" fill="none" aria-label="Visa">
                <text x="0" y="10" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="bold" fontStyle="italic" fill="#1A1F71">VISA</text>
              </svg>
            </span>
            {/* Mastercard */}
            <span className="h-7 px-2.5 rounded bg-white/95 flex items-center" title="Mastercard">
              <svg width="28" height="16" viewBox="0 0 28 16" aria-label="Mastercard">
                <circle cx="10" cy="8" r="7" fill="#EB001B" />
                <circle cx="18" cy="8" r="7" fill="#F79E1B" fillOpacity="0.85" />
              </svg>
            </span>
            {/* American Express */}
            <span className="h-7 px-2.5 rounded bg-[#2E77BC] flex items-center" title="American Express">
              <svg width="34" height="12" viewBox="0 0 34 12" fill="none" aria-label="American Express">
                <text x="0" y="10" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#FFFFFF">AMEX</text>
              </svg>
            </span>
            {/* PayPal */}
            <span className="h-7 px-2.5 rounded bg-white/95 flex items-center" title="PayPal">
              <svg width="42" height="12" viewBox="0 0 42 12" fill="none" aria-label="PayPal">
                <text x="0" y="10" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fontStyle="italic" fill="#003087">Pay<tspan fill="#0079C1">Pal</tspan></text>
              </svg>
            </span>
            {/* Apple Pay */}
            <span className="h-7 px-2.5 rounded bg-black flex items-center" title="Apple Pay">
              <svg width="36" height="12" viewBox="0 0 36 12" fill="none" aria-label="Apple Pay">
                <text x="0" y="10" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="600" fill="#FFFFFF"> Pay</text>
                <path d="M6.2 2.2c-.4.5-1 .8-1.6.8-.1-.6.2-1.2.6-1.6.4-.5 1.1-.8 1.6-.9 0 .7-.2 1.3-.6 1.7zm.6 1c-.9-.1-1.6.5-2.1.5-.4 0-1.1-.5-1.8-.5-1 0-1.9.6-2.4 1.5-1 1.8-.3 4.4.7 5.9.5.7 1 1.4 1.7 1.4.7 0 .9-.4 1.8-.4s1 .4 1.7.4c.7 0 1.2-.7 1.7-1.4.5-.8.7-1.5.7-1.5 0 0-1.4-.5-1.4-2.1 0-1.3 1.1-1.9 1.1-2-.6-.9-1.5-1-1.7-1z" fill="#FFFFFF" transform="translate(-0.5,0) scale(0.85)"/>
              </svg>
            </span>
          </div>
          <p className="text-xs opacity-50">Secure checkout. Your payment information is always protected.</p>
        </div>

        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid rgba(248,245,240,0.15)' }}
        >
          <p className="text-xs opacity-40">&copy; 2026 Makimoo. All rights reserved.</p>
          <p className="text-xs opacity-40">Simple Life, Better Comfort.</p>
        </div>
      </div>
    </footer>
  );
}
