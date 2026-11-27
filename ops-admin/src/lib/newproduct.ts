/**
 * 上货窗口的核心：把运营填的表单（系列 + 尺寸 × 花色矩阵）
 * 生成符合 vertex 惯例的商品记录（对齐 products-planned.ts 的字段风格）。
 * 合成 ASIN / handle 规则与 planned 商品一致；price 0 + availableForSale false = Coming Soon。
 */

export interface NewProductImage {
  url: string;
  altText: string;
  width: number;
  height: number;
}

/** 一条新商品草稿（矩阵里的一个格子） */
export interface NewProductDraft {
  seriesTitle: string;
  seriesSlug: string;
  color: string; // '' = 无色系（单品）
  size: string; // '' = 无尺寸
  asin: string;
  handle: string;
  title: string;
  price: string; // USD 金额字符串；coming_soon 时为 '0.00'
  compareAtPrice: string | null;
  status: 'live' | 'coming_soon';
  productType: string;
  subcategory?: string;
  tags: string[];
  description: string;
  images: NewProductImage[];
}

/** db.json 里的一条新商品记录 */
export interface NewProductRecord {
  id: string;
  batchId: string;
  status: 'pending' | 'published';
  createdAt: string;
  publishedAt?: string;
  by: string;
  note?: string;
  draft: NewProductDraft;
}

/** 发布时写进 vertex admin-products.json 的结构 */
export interface AdminProductsPayload {
  _comment: string;
  generatedAt: string;
  products: Record<string, unknown>[];
  variantGroups: { id: string; optionName: string; members: { asin: string; handle: string; color: string; size?: string }[] }[];
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** 合成 ASIN 基座：系列名的紧凑大写（planned 商品惯例，如 SHEETSET-BEDSET4） */
function asinBase(seriesTitle: string): string {
  const base = slugify(seriesTitle).toUpperCase().slice(0, 28).replace(/-+$/, '');
  return base || 'MK';
}

export interface WizardPayload {
  seriesTitle: string;
  productType: string;
  subcategory?: string;
  tags: string[];
  description: string;
  sizes: string[];
  colors: string[];
  price: string;
  compareAtPrice: string | null;
  launch: 'live' | 'coming_soon';
  imageUrls: { url: string; width: number; height: number }[];
}

/** 矩阵展开：colors × sizes → N 条草稿（都空 = 单品 1 条） */
export function generateDrafts(p: WizardPayload): NewProductDraft[] {
  const colors = p.colors.length > 0 ? p.colors : [''];
  const sizes = p.sizes.length > 0 ? p.sizes : [''];
  const seriesSlug = slugify(p.seriesTitle);
  const price = p.launch === 'coming_soon' ? '0.00' : Number(p.price).toFixed(2);
  const compareAt = p.compareAtPrice && Number(p.compareAtPrice) > 0 ? Number(p.compareAtPrice).toFixed(2) : null;
  const drafts: NewProductDraft[] = [];

  for (const color of colors) {
    for (const size of sizes) {
      const handle = [
        'makimoo',
        seriesSlug,
        color ? slugify(color) : '',
        size ? slugify(size) : '',
      ]
        .filter(Boolean)
        .join('-');
      const asin = [
        asinBase(p.seriesTitle),
        color ? slugify(color).toUpperCase().slice(0, 20) : '',
        size ? slugify(size).toUpperCase().slice(0, 20) : '',
      ]
        .filter(Boolean)
        .join('-');
      const title = [
        'Makimoo',
        p.seriesTitle,
        size || '',
        color ? `(${color})` : '',
      ]
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      drafts.push({
        seriesTitle: p.seriesTitle,
        seriesSlug,
        color,
        size,
        asin,
        handle,
        title,
        price,
        compareAtPrice: compareAt,
        status: p.launch,
        productType: p.productType,
        subcategory: p.subcategory || undefined,
        tags: [p.productType, ...p.tags].filter(Boolean),
        description: p.description,
        images: p.imageUrls.map((img) => ({
          url: img.url,
          altText: title,
          width: img.width,
          height: img.height,
        })),
      });
    }
  }
  return drafts;
}

/** 草稿 → vertex MakimooProduct 结构（对齐 products-planned.ts 惯例） */
export function toVertexProduct(d: NewProductDraft): Record<string, unknown> {
  const amount = d.status === 'coming_soon' ? '0.00' : d.price;
  const descriptionHtml = d.description
    .split(/\n+/)
    .map((s) => `<p>${s.trim().replace(/</g, '&lt;')}</p>`)
    .join('');
  const out: Record<string, unknown> = {
    id: `makimoo-${d.asin}`,
    asin: d.asin,
    title: d.title,
    handle: d.handle,
    description: d.description,
    descriptionHtml,
    productType: d.productType,
    tags: d.tags,
    availableForSale: d.status === 'live',
    images: d.images,
    priceRange: { minVariantPrice: { amount, currencyCode: 'USD' } },
    variants: [
      {
        id: `variant-${d.asin}`,
        title: 'Default Title',
        price: { amount, currencyCode: 'USD' },
        availableForSale: d.status === 'live',
        selectedOptions: [],
      },
    ],
    amazonUrl: '',
  };
  if (d.compareAtPrice) out.compareAtPrice = d.compareAtPrice;
  if (d.subcategory) out.subcategory = d.subcategory;
  return out;
}

/** 发布产物：全部已发布新品 + 按批次聚合的变体组 */
export function buildAdminProductsPayload(records: NewProductRecord[]): AdminProductsPayload {
  const published = records.filter((r) => r.status === 'published');
  const products = published.map((r) => toVertexProduct(r.draft));

  // 变体组：同批次且有花色的记录聚合为一组（同款异色/尺寸互链的载体）
  const byBatch = new Map<string, NewProductRecord[]>();
  for (const r of published) {
    if (!r.draft.color) continue;
    if (!byBatch.has(r.batchId)) byBatch.set(r.batchId, []);
    byBatch.get(r.batchId)!.push(r);
  }
  const variantGroups = Array.from(byBatch.values())
    .filter((rs) => rs.length > 0)
    .map((rs) => ({
      id: rs[0].draft.seriesSlug,
      optionName: 'Color',
      members: rs.map((r) => ({
        asin: r.draft.asin,
        handle: r.draft.handle,
        color: r.draft.color,
        ...(r.draft.size ? { size: r.draft.size } : {}),
      })),
    }));

  return {
    _comment: '由 makimoo-admin（运营后台）发布时写入的新增商品与变体组。手工勿改：下次发布会整体重写。结构见 makimoo-admin/README.md。',
    generatedAt: new Date().toISOString(),
    products,
    variantGroups,
  };
}
