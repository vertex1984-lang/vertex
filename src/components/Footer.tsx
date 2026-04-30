import { resolveUrl } from '@/lib/paths';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#8B5A2B', color: '#F8F5F0' }} className="px-6 lg:px-10 pt-14 pb-8">
      <div className="max-w-7xl mx-auto">
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
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Shop</h4>
            <div className="flex flex-col gap-1">
              <a href={resolveUrl('/products')} className="text-sm opacity-60 hover:opacity-100 transition py-1">All Products</a>
              <a href={resolveUrl('/products?cat=dining')} className="text-sm opacity-60 hover:opacity-100 transition py-1">Dining Cushions</a>
              <a href={resolveUrl('/products?cat=cushions')} className="text-sm opacity-60 hover:opacity-100 transition py-1">Chair Cushions</a>
              <a href={resolveUrl('/products?cat=pillows')} className="text-sm opacity-60 hover:opacity-100 transition py-1">Pillow Inserts</a>
              <a href={resolveUrl('/products?cat=travel')} className="text-sm opacity-60 hover:opacity-100 transition py-1">Travel Pillows</a>
              <a href={resolveUrl('/products?cat=home-fragrance')} className="text-sm opacity-60 hover:opacity-100 transition py-1">Home Fragrance</a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h4>
            <div className="flex flex-col gap-1">
              <a href={resolveUrl('/about')} className="text-sm opacity-60 hover:opacity-100 transition py-1">Our Story</a>
              <a href={resolveUrl('/about#quality')} className="text-sm opacity-60 hover:opacity-100 transition py-1">Quality Promise</a>
              <a href={resolveUrl('/about#sustainability')} className="text-sm opacity-60 hover:opacity-100 transition py-1">Sustainability</a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h4>
            <div className="flex flex-col gap-1">
              <span className="text-sm opacity-60 py-1 cursor-default">Contact Us</span>
              <span className="text-sm opacity-60 py-1 cursor-default">FAQ</span>
              <span className="text-sm opacity-60 py-1 cursor-default">Shipping & Returns</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid rgba(248,245,240,0.15)' }}>
          <div className="flex gap-4">
            <a href="#" aria-label="Instagram" className="opacity-60 hover:opacity-100 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="opacity-60 hover:opacity-100 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
            <a href="#" aria-label="Pinterest" className="opacity-60 hover:opacity-100 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.08 2.46 7.58 5.97 9.12-.08-.72-.16-1.83.03-2.62.17-.71 1.12-4.74 1.12-4.74s-.29-.57-.29-1.41c0-1.32.77-2.31 1.72-2.31.81 0 1.2.61 1.2 1.34 0 .81-.52 2.03-.79 3.16-.22.94.47 1.71 1.4 1.71 1.68 0 2.97-1.77 2.97-4.33 0-2.26-1.63-3.85-3.95-3.85-2.69 0-4.27 2.02-4.27 4.11 0 .81.31 1.68.71 2.16.08.09.09.18.07.27-.07.3-.24.94-.27 1.07-.04.18-.14.22-.33.13-1.24-.58-2.01-2.39-2.01-3.85 0-3.13 2.27-6.01 6.56-6.01 3.44 0 6.12 2.45 6.12 5.73 0 3.42-2.16 6.17-5.15 6.17-1.01 0-1.95-.52-2.27-1.14l-.62 2.35c-.22.87-.83 1.96-1.24 2.62.93.29 1.92.44 2.95.44 5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
            </a>
          </div>
          <p className="text-xs opacity-40">&copy; 2026 Makimoo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
