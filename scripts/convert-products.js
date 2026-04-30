const fs = require('fs');
const path = require('path');

// Read original products data
const raw = fs.readFileSync(path.join(__dirname, '../../js/products-data.js'), 'utf-8');

// Extract JSON array
const match = raw.match(/window\.PRODUCTS_DATA\s*=\s*(\[.*?\]);/s);
if (!match) {
  console.error('Failed to parse PRODUCTS_DATA');
  process.exit(1);
}

const products = JSON.parse(match[1]);

// Transform to MakimooProduct format
const transformed = products
  .filter(p => p.title && p.title.trim())
  .map(p => ({
    id: `makimoo-${p.asin}`,
    asin: p.asin,
    title: p.title,
    handle: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60) || p.asin.toLowerCase(),
    description: [p.bullet1, p.bullet2, p.bullet3, p.bullet4, p.bullet5].filter(Boolean).join('. ') || p.title,
    descriptionHtml: `<p>${[p.bullet1, p.bullet2, p.bullet3, p.bullet4, p.bullet5].filter(Boolean).join('</p><p>') || p.title}</p>`,
    productType: p.category || 'Others',
    tags: [p.category || 'Others'],
    availableForSale: true,
    images: p.images.map(img => ({
      url: `/${img}`,
      altText: p.title,
      width: 800,
      height: 800,
    })),
    priceRange: {
      minVariantPrice: { amount: '49.99', currencyCode: 'USD' },
    },
    variants: [{
      id: `variant-${p.asin}`,
      title: 'Default Title',
      price: { amount: '49.99', currencyCode: 'USD' },
      availableForSale: true,
      selectedOptions: [],
    }],
    amazonUrl: p.amazonUrl,
  }));

const output = `export interface MakimooProduct {
  id: string;
  asin: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  images: { url: string; altText: string; width: number; height: number }[];
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: { id: string; title: string; price: { amount: string; currencyCode: string }; availableForSale: boolean; selectedOptions: { name: string; value: string }[] }[];
  amazonUrl: string;
}

export const PRODUCTS_DATA: MakimooProduct[] = ${JSON.stringify(transformed, null, 2)};

export function getProductByHandle(handle: string): MakimooProduct | undefined {
  return PRODUCTS_DATA.find(p => p.handle === handle);
}

export function getProductsByCategory(category: string): MakimooProduct[] {
  if (!category) return PRODUCTS_DATA;
  return PRODUCTS_DATA.filter(p =>
    p.productType.toLowerCase() === category.toLowerCase() ||
    p.tags.some(t => t.toLowerCase().includes(category.toLowerCase()))
  );
}

export function searchProducts(query: string): MakimooProduct[] {
  const q = query.toLowerCase();
  return PRODUCTS_DATA.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
}
`;

fs.writeFileSync(path.join(__dirname, '../src/data/products.ts'), output);
console.log(`Converted ${transformed.length} products to src/data/products.ts`);
