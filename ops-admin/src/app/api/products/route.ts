import { NextRequest, NextResponse } from 'next/server';
import { effectiveProducts } from '@/lib/snapshot';

/** 商品列表：q 关键词 / status 状态 / page 页码 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const q = (sp.get('q') || '').trim().toLowerCase();
  const status = sp.get('status') || '';
  const page = Math.max(1, Number(sp.get('page')) || 1);
  const pageSize = Math.min(100, Number(sp.get('pageSize')) || 20);

  let items = effectiveProducts();
  if (q) {
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.handle.toLowerCase().includes(q) ||
        p.asin.toLowerCase().includes(q)
    );
  }
  if (status === 'changed') {
    items = items.filter((p) => p.pending.length > 0);
  } else if (status) {
    items = items.filter((p) => p.status === status);
  }
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pages);
  const slice = items.slice((safePage - 1) * pageSize, safePage * pageSize);

  return NextResponse.json({
    total,
    page: safePage,
    pages,
    items: slice.map((p) => ({
      handle: p.handle,
      asin: p.asin,
      title: p.title,
      productType: p.productType,
      subcategory: p.subcategory,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      available: p.available,
      hasShopifyData: p.hasShopifyData,
      firstImage: p.images[0] || null,
      status: p.status,
      derivedStatus: p.derivedStatus,
      pending: p.pending,
    })),
  });
}
