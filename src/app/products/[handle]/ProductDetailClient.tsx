'use client';

import { useState } from 'react';
import { getProductByHandle } from '@/data/products';
import { resolveUrl } from '@/lib/paths';
import { addToShopifyCart, addToLocalCart } from '@/lib/cart';

interface ProductDetailClientProps {
  handle: string;
}

export default function ProductDetailClient({ handle }: ProductDetailClientProps) {
  const product = getProductByHandle(handle);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!product) {
    return (
      <div className="px-6 lg:px-10 py-20 text-center">
        <p className="text-lg text-[#555]">Product not found.</p>
        <a href={resolveUrl('/products')} className="mt-4 inline-block text-[#8B5A2B] underline">
          Back to products
        </a>
      </div>
    );
  }

  // Use Shopify price if available, otherwise local price
  const displayPrice = product.shopifyPrice || product.priceRange.minVariantPrice.amount;
  const displayCurrency = product.shopifyCurrencyCode || product.priceRange.minVariantPrice.currencyCode;
  const isInStock = product.hasShopifyData ? (product.shopifyAvailable ?? true) : product.availableForSale;

  const handleAddToCart = async () => {
    setAddingToCart(true);
    setCartMessage(null);

    try {
      if (product.hasShopifyData && product.shopifyVariantId) {
        // Use Shopify Cart API
        const result = await addToShopifyCart(product.shopifyVariantId, quantity);
        if (result) {
          setCartMessage({ text: 'Added to cart!', type: 'success' });
        } else {
          setCartMessage({ text: 'Failed to add to cart. Please try again.', type: 'error' });
        }
      } else {
        // Fallback to local cart
        addToLocalCart({
          id: product.id,
          title: product.title,
          image: resolveUrl(product.images[0]?.url || ''),
          price: displayPrice,
          quantity,
          handle: product.handle,
        });
        setCartMessage({ text: 'Added to cart!', type: 'success' });
      }
    } catch {
      setCartMessage({ text: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setAddingToCart(false);
      setTimeout(() => setCartMessage(null), 3000);
    }
  };

  return (
    <div className="px-6 lg:px-10 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#555] mb-8">
          <a href={resolveUrl('/')} className="hover:text-[#8B5A2B]">Home</a>
          <span>/</span>
          <a href={resolveUrl('/products')} className="hover:text-[#8B5A2B]">Products</a>
          <span>/</span>
          <span className="text-[#333] truncate max-w-[200px] sm:max-w-md">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Product Images */}
          <div>
            <div className="aspect-square rounded-xl overflow-hidden bg-white mb-4 border border-[#E8E2DA]">
              <img
                src={resolveUrl(product.images[selectedImage]?.url || '')}
                alt={product.images[selectedImage]?.altText || product.title}
                className="w-full h-full object-contain"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === i ? 'border-[#8B5A2B]' : 'border-transparent'
                    }`}
                  >
                    <img src={resolveUrl(img.url)} alt={img.altText || ''} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white mb-4" style={{ backgroundColor: '#8B5A2B' }}>
              {product.productType}
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#333] mb-6 leading-tight">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex text-[#FFB800]">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm text-[#555]">4.8 (1,247 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl font-bold text-[#8B5A2B]">${displayPrice}</span>
              <span className="text-lg text-[#999] line-through">${(parseFloat(displayPrice) * 1.3).toFixed(2)}</span>
              <span className="px-2 py-1 rounded text-xs font-semibold text-white bg-red-500">Save 24%</span>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {product.description.split('.').filter(s => s.trim().length > 10).slice(0, 4).map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#8B5A2B] mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <span className="text-sm text-[#555]">{feature.trim()}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              {isInStock ? (
                <>
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-[#E8E2DA] rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-11 h-11 bg-white hover:bg-[#F8F5F0] transition flex items-center justify-center text-[#333] text-lg font-medium"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      min={1}
                      max={99}
                      readOnly
                      className="w-[60px] h-11 border-none text-center text-base font-semibold text-[#333] bg-white outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-11 h-11 bg-white hover:bg-[#F8F5F0] transition flex items-center justify-center text-[#333] text-lg font-medium"
                    >
                      +
                    </button>
                  </div>
                  {product.hasShopifyData && product.shopifyVariantId ? (
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:hover:translate-y-0"
                      style={{ backgroundColor: '#8B5A2B' }}
                    >
                      {addingToCart ? 'Adding...' : 'Add to Cart'}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M6 6h15l-1.5 9h-12z"/>
                        <circle cx="9" cy="20" r="1"/>
                        <circle cx="18" cy="20" r="1"/>
                        <path d="M6 6L5 3H2"/>
                      </svg>
                    </button>
                  ) : (
                    <a
                      href={product.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                      style={{ backgroundColor: '#8B5A2B' }}
                    >
                      Shop on Amazon
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M7 17L17 7M17 7H7M17 7v10"/>
                      </svg>
                    </a>
                  )}
                </>
              ) : (
                <div className="flex-1 text-center py-4 px-6 rounded-full bg-[#F8F5F0] text-[#999] font-semibold text-sm">
                  Currently Unavailable
                </div>
              )}
            </div>

            {/* Cart message */}
            {cartMessage && (
              <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${
                cartMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {cartMessage.text}
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-[#E8E2DA]">
              <div className="flex flex-col items-center text-center gap-2">
                <svg className="w-6 h-6 text-[#8B5A2B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span className="text-xs text-[#555]">30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <svg className="w-6 h-6 text-[#8B5A2B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
                <span className="text-xs text-[#555]">Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <svg className="w-6 h-6 text-[#8B5A2B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span className="text-xs text-[#555]">Secure Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex border-b border-[#E8E2DA]">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-6 py-3 text-sm font-semibold transition border-b-2 ${
                activeTab === 'description'
                  ? 'text-[#8B5A2B] border-[#8B5A2B]'
                  : 'text-[#555] border-transparent hover:text-[#333]'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`px-6 py-3 text-sm font-semibold transition border-b-2 ${
                activeTab === 'specifications'
                  ? 'text-[#8B5A2B] border-[#8B5A2B]'
                  : 'text-[#555] border-transparent hover:text-[#333]'
              }`}
            >
              Specifications
            </button>
          </div>

          <div className="py-8">
            {activeTab === 'description' ? (
              <div className="max-w-3xl">
                <h3 className="text-xl font-bold text-[#333] mb-4">Product Description</h3>
                <div
                  className="text-[#555] leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              </div>
            ) : (
              <div className="max-w-3xl">
                <h3 className="text-xl font-bold text-[#333] mb-4">Product Specifications</h3>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-[#E8E2DA]">
                      <td className="py-3 text-sm text-[#555] w-1/3">Brand</td>
                      <td className="py-3 text-sm text-[#333] font-medium">Makimoo</td>
                    </tr>
                    <tr className="border-b border-[#E8E2DA]">
                      <td className="py-3 text-sm text-[#555]">Category</td>
                      <td className="py-3 text-sm text-[#333] font-medium">{product.productType}</td>
                    </tr>
                    <tr className="border-b border-[#E8E2DA]">
                      <td className="py-3 text-sm text-[#555]">Price</td>
                      <td className="py-3 text-sm text-[#333] font-medium">${displayPrice} {displayCurrency}</td>
                    </tr>
                    <tr className="border-b border-[#E8E2DA]">
                      <td className="py-3 text-sm text-[#555]">Availability</td>
                      <td className={`py-3 text-sm font-medium ${isInStock ? 'text-green-600' : 'text-red-500'}`}>
                        {isInStock ? 'In Stock' : 'Currently Unavailable'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
