import { shopifyImageUrl } from '@/lib/paths';
import type { MakimooProduct } from '@/data/products';

/** 简短展示名：去掉品牌前缀和括号内的颜色/规格说明（与 V2ProductCard 同一规则） */
export function shortTitle(title: string): string {
  return title
    .replace(/^Makimoo\s+/i, '')
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatPrice(amount: string, currency: string): string {
  const value = parseFloat(amount);
  if (Number.isNaN(value)) return '';
  const symbol = currency === 'USD' ? '$' : `${currency} `;
  return `${symbol}${value.toFixed(2)}`;
}

/** 焦点图优先级与 V2ProductCard 一致：featuredImage（场景图）> Shopify CDN 图 > 本地图 */
export function spotlightImage(product: MakimooProduct) {
  if (product.featuredImage) return { url: product.featuredImage, altText: product.title };
  if (product.shopifyImages && product.shopifyImages.length > 0)
    return { url: shopifyImageUrl(product.shopifyImages[0], 1200), altText: product.title };
  return product.images[0];
}
