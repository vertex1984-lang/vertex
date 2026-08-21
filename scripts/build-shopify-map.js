/**
 * build-shopify-map.js
 * 从 Shopify Storefront API 拉取全部产品，生成 src/data/shopify-map.ts 映射文件
 * SKU = ASIN（小写），用于关联本地产品数据
 */

const { createStorefrontApiClient } = require('@shopify/storefront-api-client');
const fs = require('fs');
const path = require('path');

const DOMAIN = 'mkhome-3.myshopify.com';
const TOKEN = '3e3428278f0d3abc4e62c217b9c09608';
const API_VERSION = '2025-07';

const client = createStorefrontApiClient({
  storeDomain: `https://${DOMAIN}`,
  apiVersion: API_VERSION,
  publicAccessToken: TOKEN,
});

const GET_ALL_PRODUCTS = `
  query GetAllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
          tags
          availableForSale
          createdAt
          variants(first: 5) {
            edges {
              node {
                id
                title
                sku
                price { amount currencyCode }
                availableForSale
                selectedOptions { name value }
              }
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const ASIN_RE = /^B0[A-Z0-9]{8}$/i;

// 已从站点剔除的 ASIN（早期错误数据），不再接入映射
const EXCLUDED_ASINS = new Set(['b0f1ycxtrx']);

async function fetchAllProducts() {
  let allProducts = [];
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {
    const { data, errors } = await client.request(GET_ALL_PRODUCTS, {
      variables: { first: 250, after: cursor },
    });

    if (errors) {
      console.error('Shopify API errors:', JSON.stringify(errors, null, 2));
      process.exit(1);
    }

    const products = data.products.edges.map(e => e.node);
    allProducts = allProducts.concat(products);

    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
    console.log(`Fetched ${products.length} products (total: ${allProducts.length})`);
  }

  return allProducts;
}

// 从 materials-map.ts 解析 ASIN→SKU（素材库是 SKU 的权威来源），用于校验 Shopify 产品
function loadMaterialsSkus() {
  try {
    const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'materials-map.ts'), 'utf-8');
    const skus = {};
    const re = /"([a-z0-9]+)": (\{[^\n]*\})/g;
    let m;
    while ((m = re.exec(src))) {
      try {
        const entry = JSON.parse(m[2]);
        if (entry.sku) skus[m[1]] = entry.sku.toLowerCase();
      } catch { /* 单行 JSON 解析失败则跳过 */ }
    }
    return skus;
  } catch {
    return {};
  }
}

function buildMap(products) {
  const map = {};
  const materialsSkus = loadMaterialsSkus();
  let dupCount = 0;
  let skuMismatch = 0;

  for (const product of products) {
    const variant = product.variants.edges[0]?.node;
    if (!variant) {
      console.warn(`Skipping product with no variant: ${product.title}`);
      continue;
    }

    // ASIN 优先取 tags（新上传产品）；无 tag 时，若 SKU 本身是 ASIN 格式（4-5 月导入的老产品）也接入，
    // 但老记录只作兜底：一旦同 ASIN 出现带 tag 的新记录，新记录永远优先
    const asinTag = (product.tags || []).map(t => t.trim()).find(t => ASIN_RE.test(t));
    const skuIsAsin = variant.sku && ASIN_RE.test(variant.sku.trim());
    if (!asinTag && !skuIsAsin) {
      console.warn(`Skipping product with no ASIN (tag/sku): ${product.title} (sku=${variant.sku || '-'})`);
      continue;
    }
    const asinLower = (asinTag || variant.sku.trim()).toLowerCase();
    if (EXCLUDED_ASINS.has(asinLower)) continue;

    if (map[asinLower]) {
      const existing = map[asinLower];
      const existingIsTag = existing._fromTag;
      const currentIsTag = !!asinTag;
      // 带 tag 的新记录 > 老 SKU 记录；同类型则创建时间新者胜
      const replace = currentIsTag !== existingIsTag ? currentIsTag : product.createdAt > existing.createdAt;
      dupCount++;
      if (replace) {
        console.log(`Duplicate ASIN ${asinLower}: replacing ${existingIsTag ? 'tag' : 'sku'}-based with ${currentIsTag ? 'tag' : 'sku'}-based (${product.title.slice(0, 40)})`);
      } else {
        console.log(`Duplicate ASIN ${asinLower}: keeping existing entry, skipping (${product.title.slice(0, 40)})`);
        continue;
      }
    }

    // SKU 校验（仅对 tags 匹配的新记录）：Shopify SKU 必须与素材库该 ASIN 的 SKU 一致
    const shopSku = (variant.sku || '').trim().toLowerCase();
    const expectedSku = materialsSkus[asinLower];
    if (asinTag && expectedSku && shopSku !== expectedSku) {
      skuMismatch++;
      console.warn(`SKU MISMATCH ${asinLower}: shopify=${shopSku || '(empty)'} materials=${expectedSku} (${product.title.slice(0, 40)})`);
    }

    const shopifyPrice = parseFloat(variant.price.amount);

    map[asinLower] = {
      variantId: variant.id,
      sku: variant.sku || '',
      price: variant.price.amount,
      currencyCode: variant.price.currencyCode,
      availableForSale: variant.availableForSale && product.availableForSale,
      shopifyHandle: product.handle,
      images: product.images.edges.map(e => e.node.url),
      createdAt: product.createdAt,
      _fromTag: !!asinTag,
      // Flag products with $0.0 price
      priceNeedsFix: shopifyPrice === 0,
    };
  }

  if (dupCount) console.log(`Resolved ${dupCount} duplicate ASIN(s) (newer record wins)`);
  if (skuMismatch) console.warn(`WARNING: ${skuMismatch} product(s) with SKU mismatch vs materials library`);
  return map;
}

function generateTsFile(map) {
  const entries = Object.entries(map)
    .map(([asin, data]) => {
      return `  "${asin}": {
    variantId: "${data.variantId}",
    sku: "${(data.sku || '').replace(/"/g, '\\"')}",
    price: "${data.price}",
    currencyCode: "${data.currencyCode}",
    availableForSale: ${data.availableForSale},
    shopifyHandle: "${data.shopifyHandle.replace(/"/g, '\\"')}",
    images: ${JSON.stringify(data.images)},
    priceNeedsFix: ${data.priceNeedsFix},
  }`;
    })
    .join(',\n');

  return `// Auto-generated by scripts/build-shopify-map.js
// DO NOT EDIT MANUALLY - Run 'node scripts/build-shopify-map.js' to update
// Generated at: ${new Date().toISOString()}

export interface ShopifyProductEntry {
  variantId: string;
  /** Shopify 侧新格式 SKU（如 US-F61ZXX），与素材库一致 */
  sku: string;
  price: string;
  currencyCode: string;
  availableForSale: boolean;
  shopifyHandle: string;
  images: string[];
  priceNeedsFix: boolean;
}

export type ShopifyProductMap = Record<string, ShopifyProductEntry>;

export const SHOPIFY_MAP: ShopifyProductMap = {
${entries}
};

export const SHOPIFY_ASINS = new Set(Object.keys(SHOPIFY_MAP));
`;
}

async function main() {
  console.log('Fetching products from Shopify...');
  const products = await fetchAllProducts();
  console.log(`Total products on Shopify: ${products.length}`);

  const map = buildMap(products);
  console.log(`Mapped ${Object.keys(map).length} products with valid SKUs`);

  // Stats
  const available = Object.values(map).filter(v => v.availableForSale && !v.priceNeedsFix).length;
  const zeroPrice = Object.values(map).filter(v => v.priceNeedsFix).length;
  const unavailable = Object.values(map).filter(v => !v.availableForSale).length;
  console.log(`  Available: ${available}, Zero-price: ${zeroPrice}, Unavailable: ${unavailable}`);

  const tsContent = generateTsFile(map);
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'shopify-map.ts');
  fs.writeFileSync(outputPath, tsContent, 'utf-8');
  console.log(`Written to ${outputPath}`);
}

main().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
