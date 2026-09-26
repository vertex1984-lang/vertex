import type { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import { v2url } from '@/lib/v2paths';
import { PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';
import { SHOPIFY_MAP } from '@/data/shopify-map';
import { dedupeFamilyColors } from '@/lib/listing-dedupe';

export const metadata: Metadata = {
  title: 'New Arrivals',
  description:
    'Just landed at Makimoo — the 20 newest pieces added to the collection.',
};

// 最新上架：按 Shopify 产品创建时间倒序，变体族同色去重（同色最新上架者为代表，prefer 'order'
// 保持时间序取首个）后取前 20，不区分类目、平铺展示
const newArrivals = dedupeFamilyColors(
  enrichProductsWithShopifyData(PRODUCTS_DATA)
    .filter((p) => p.hasShopifyData && p.shopifyAvailable)
    .sort((a, b) => {
      const ta = SHOPIFY_MAP[a.asin.toLowerCase()]?.createdAt ?? '';
      const tb = SHOPIFY_MAP[b.asin.toLowerCase()]?.createdAt ?? '';
      return tb.localeCompare(ta);
    }),
  'order'
).slice(0, 20);

/**
 * New Arrivals 独立页：浅色面包屑页头 + 白底 ProductCard 平铺网格（样式同 /products 类目页），
 * 展示最新上架的 20 款产品，不区分类目、按上架时间倒序。
 *（原画报式页面 2026-09 下线：分屏 hero / 批次 feed / 类目卡 / Newsletter / Featured teaser 移除）
 */
export default function NewArrivalsPage() {
  return (
    <div className="px-3 lg:px-10 pt-24 lg:pt-36 pb-10 lg:pb-14">
      {/* 页头（同 /products 类目页）：面包屑 + 左对齐标题 + 右侧结果数 */}
      <nav className="text-xs lg:text-sm text-[#999] mb-2 lg:mb-3" aria-label="Breadcrumb">
        <a href={v2url('/')} className="hover:text-[#8B5A2B] transition-colors">Home</a>
        <span className="mx-1.5">/</span>
        <span className="text-[#555]">New Arrivals</span>
      </nav>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6 lg:mb-10">
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-[#333]">New Arrivals</h1>
        <p className="text-sm text-[#777]">{newArrivals.length} result{newArrivals.length === 1 ? '' : 's'}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
        {newArrivals.map((p) => (
          <ProductCard key={p.id} product={p} href={v2url(`/products/${p.handle}/`)} />
        ))}
      </div>
    </div>
  );
}
