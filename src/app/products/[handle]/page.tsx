import ProductDetailClient from './ProductDetailClient';
import { PRODUCTS_DATA } from '@/data/products';

export function generateStaticParams() {
  return PRODUCTS_DATA.map((p) => ({ handle: p.handle }));
}

export default function ProductDetailPage({ params }: { params: { handle: string } }) {
  return <ProductDetailClient handle={params.handle} />;
}
