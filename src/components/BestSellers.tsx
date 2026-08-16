'use client';

import { useRef } from 'react';
import ProductCard from '@/components/ProductCard';
import type { MakimooProduct } from '@/data/products';

interface BestSellersProps {
  products: MakimooProduct[];
}

export default function BestSellers({ products }: BestSellersProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' });
  };

  if (products.length === 0) return null;

  return (
    <section className="px-6 lg:px-10 py-14">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-sm font-semibold tracking-widest uppercase text-brand mb-2">Customer Favorites</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-charcoal mb-3">Best Sellers</h2>
          <p className="text-base text-charcoal-light">
            Our most-loved comfort essentials, chosen again and again by homes like yours.
          </p>
        </div>

        <div className="relative group">
          {/* Left arrow (desktop, show on hover) */}
          <button
            onClick={() => scrollByCards(-1)}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center text-[#8B5A2B] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#F8F5F0]"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Scrollable track: native touch scroll + snap, scrollbar hidden */}
          <div
            ref={trackRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((product) => (
              <div key={product.id} className="w-64 sm:w-72 flex-shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Right arrow (desktop, show on hover) */}
          <button
            onClick={() => scrollByCards(1)}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center text-[#8B5A2B] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#F8F5F0]"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
