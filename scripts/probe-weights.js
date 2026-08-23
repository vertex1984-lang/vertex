/**
 * probe-weights.js（一次性探查脚本）
 * 拉取 Shopify 全部 variant 的 weight/weightUnit，输出覆盖率和单位分布统计
 */

const { createStorefrontApiClient } = require('@shopify/storefront-api-client');

const DOMAIN = 'mkhome-3.myshopify.com';
const TOKEN = '3e3428278f0d3abc4e62c217b9c09608';
const API_VERSION = '2025-07';

const client = createStorefrontApiClient({
  storeDomain: `https://${DOMAIN}`,
  apiVersion: API_VERSION,
  publicAccessToken: TOKEN,
});

const QUERY = `
  query ProbeWeights($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          title
          tags
          variants(first: 1) {
            edges { node { sku weight weightUnit } }
          }
        }
        cursor
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

const ASIN_RE = /^(B0[A-Z0-9]{8}|1688-[0-9]+(-C[0-9]+)?)$/i;

async function main() {
  let all = [];
  let hasNextPage = true;
  let cursor = null;
  while (hasNextPage) {
    const { data, errors } = await client.request(QUERY, {
      variables: { first: 250, after: cursor },
    });
    if (errors) {
      console.error('API errors:', JSON.stringify(errors, null, 2));
      process.exit(1);
    }
    all = all.concat(data.products.edges.map(e => e.node));
    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  const unitDist = {};
  let withWeight = 0;
  let zeroWeight = 0;
  const zeroSamples = [];
  const unitSamples = {};

  for (const p of all) {
    const v = p.variants.edges[0]?.node;
    if (!v) continue;
    const unit = v.weightUnit || '(null)';
    unitDist[unit] = (unitDist[unit] || 0) + 1;
    if (v.weight > 0) {
      withWeight++;
      if (!unitSamples[unit]) unitSamples[unit] = `${v.weight} ${unit} — ${p.title.slice(0, 50)}`;
    } else {
      zeroWeight++;
      const asin = (p.tags || []).find(t => ASIN_RE.test(t)) || v.sku || '-';
      zeroSamples.push(`${asin}  ${p.title.slice(0, 60)}`);
    }
  }

  console.log(`Total products: ${all.length}`);
  console.log(`With weight > 0: ${withWeight}, zero/null: ${zeroWeight}`);
  console.log('Unit distribution:', JSON.stringify(unitDist));
  console.log('\nSamples per unit:');
  for (const [u, s] of Object.entries(unitSamples)) console.log(`  ${u}: ${s}`);
  if (zeroSamples.length) {
    console.log('\nZero-weight products (first 15):');
    zeroSamples.slice(0, 15).forEach(s => console.log(`  ${s}`));
  }
}

main().catch(err => { console.error('Failed:', err); process.exit(1); });
