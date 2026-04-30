import { MakimooProduct } from '@/data/products';
import { resolveUrl } from '@/lib/paths';

interface ProductCardProps {
  product: MakimooProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0];
  const displayPrice = product.shopifyPrice || product.priceRange.minVariantPrice.amount;
  const displayCurrency = product.shopifyCurrencyCode || product.priceRange.minVariantPrice.currencyCode;
  const isInStock = product.hasShopifyData ? (product.shopifyAvailable ?? true) : product.availableForSale;

  return (
    <a
      href={resolveUrl(`/products/${product.handle}/`)}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-56 lg:h-64 overflow-hidden bg-white">
        {image && (
          <img
            src={resolveUrl(image.url)}
            alt={image.altText || product.title}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {!isInStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="px-3 py-1 bg-[#333]/80 text-white text-xs font-semibold rounded-full">Out of Stock</span>
          </div>
        )}
        <div className="absolute bottom-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#8B5A2B] text-white shadow-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#8B5A2B] mb-1">
          {product.productType || 'Product'}
        </p>
        <h3 className="text-base font-medium text-[#333] line-clamp-2 leading-snug mb-3">
          {product.title}
        </h3>
        <p className="text-lg font-semibold text-[#8B5A2B]">
          {displayCurrency === 'USD' ? '$' : displayCurrency + ' '}
          {displayPrice}
        </p>
      </div>
    </a>
  );
}
