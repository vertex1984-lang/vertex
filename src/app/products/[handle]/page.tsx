import type { Metadata } from "next";
import ProductDetailClient from './ProductDetailClient';
import { PRODUCTS_DATA } from '@/data/products';

export function generateStaticParams() {
  return PRODUCTS_DATA.map((p) => ({ handle: p.handle }));
}

function getWords(text: string, count: number): string {
  const words = text.trim().split(/\s+/);
  return words.slice(0, count).join(' ');
}

export function generateMetadata({ params }: { params: { handle: string } }): Metadata {
  const product = PRODUCTS_DATA.find((p) => p.handle === params.handle);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: getWords(product.title, 10),
    description: getWords(product.title, 15),
  };
}

export default function ProductDetailPage({ params }: { params: { handle: string } }) {
  return <ProductDetailClient handle={params.handle} />;
}
