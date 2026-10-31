import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const dataDir = path.join(root, 'src', 'data');

function extractLiteral(file, marker) {
  const src = fs.readFileSync(path.join(dataDir, file), 'utf8');
  const mi = src.indexOf(marker);
  if (mi < 0) throw new Error(`marker not found in ${file}: ${marker}`);
  const eq = marker.lastIndexOf('=');
  const after = mi + (eq >= 0 ? eq + 1 : marker.length);
  const b = src.indexOf('[', after);
  const o = src.indexOf('{', after);
  const start = b >= 0 && (o < 0 || b < o) ? b : o;
  if (start < 0) throw new Error(`literal start not found in ${file}`);
  let i = start;
  let depth = 0;
  let quote = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (c === '\\') { i++; continue; }
      if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
    if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') {
      depth--;
      if (depth === 0) { i++; break; }
    }
  }
  const lit = src.slice(start, i);
  return Function(`"use strict"; return (${lit});`)();
}

const base = extractLiteral('products.ts', 'const BASE_PRODUCTS: MakimooProduct[] = ');
const materials = extractLiteral('products-materials.ts', 'export const MATERIALS_PRODUCTS: MakimooProduct[] = ');
const shopify = extractLiteral('shopify-map.ts', 'export const SHOPIFY_MAP: ShopifyProductMap = ');
const matsMap = extractLiteral('materials-map.ts', 'export const MATERIALS_MAP: Record<string, MaterialsEntry> = ');
const shortTitles = extractLiteral('short-titles.ts', 'export const SHORT_TITLES: Record<string, string> = ');

const COLORS = ['white', 'cream', 'ivory', 'beige', 'oatmeal', 'oat', 'sand', 'stone', 'greige', 'grey', 'gray', 'charcoal',
  'black', 'sage', 'olive', 'green', 'khaki', 'blue', 'navy', 'dustyblue', 'dusty-blue', 'sage', 'teal', 'pink', 'rose',
  'dustyrose', 'dusty-rose', 'blush', 'caramel', 'brown', 'tan', 'orange', 'rust', 'terracotta', 'yellow', 'mustard',
  'lavender', 'purple', 'red', 'burgundy'];

function colors(title) {
  const t = title.toLowerCase().replace(/[()]/g, ' ');
  const found = new Set();
  for (const c of COLORS) {
    const re = new RegExp(`(^|[^a-z])${c.replace(/-/g, '[ -]?')}([^a-z]|$)`, 'i');
    if (re.test(t)) found.add(c);
  }
  return [...found];
}

const seen = new Set();
const out = [];
let hiddenCount = 0;

for (const raw of [...base, ...materials]) {
  const asin = (raw.asin || '').toLowerCase();
  if (!asin || seen.has(asin)) continue;
  seen.add(asin);
  const mats = matsMap[asin];
  const sp = shopify[asin];
  const title = shortTitles[asin] || (mats && mats.title) || raw.title;
  const image = (mats && mats.images && mats.images[0]) || (sp && sp.images && sp.images[0]) || raw.images?.[0]?.url || '';
  out.push({
    asin: raw.asin,
    handle: raw.handle,
    title,
    fullTitle: raw.title,
    productType: raw.productType,
    tags: raw.tags || [],
    colors: colors(raw.title + ' ' + title),
    availableForSale: Boolean(raw.availableForSale),
    hasShopify: Boolean(sp),
    shopifyAvailable: sp ? Boolean(sp.availableForSale) : false,
    price: sp ? (sp.priceNeedsFix ? raw.priceRange?.minVariantPrice?.amount : sp.price) : (raw.priceRange?.minVariantPrice?.amount || '0.00'),
    currency: sp ? sp.currencyCode : (raw.priceRange?.minVariantPrice?.currencyCode || 'USD'),
    variantId: sp ? sp.variantId : null,
    image,
  });
}

const outDir = path.join(root, 'report', 'scenes');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'product-index.json'), JSON.stringify(out, null, 2));

const byType = {};
for (const p of out) byType[p.productType] = (byType[p.productType] || 0) + 1;
console.log(JSON.stringify({ total: out.length, hiddenDropped: hiddenCount, types: byType }, null, 2));
