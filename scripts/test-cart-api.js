/**
 * 临时调试脚本：测试 Shopify Cart API 链路
 * cartCreate -> cartLinesAdd -> cart 查询 -> cartLinesUpdate -> cartLinesRemove
 * 运行：node scripts/test-cart-api.js
 */
const { createStorefrontApiClient } = require('@shopify/storefront-api-client');

const DOMAIN = 'mkhome-3.myshopify.com';
const TOKEN = '3e3428278f0d3abc4e62c217b9c09608';
const VARIANT_ID = 'gid://shopify/ProductVariant/51478667329834'; // Travel Neck Pillow

const client = createStorefrontApiClient({
  storeDomain: `https://${DOMAIN}`,
  apiVersion: '2024-10',
  publicAccessToken: TOKEN,
});

async function run(label, query, variables) {
  try {
    const { data, errors } = await client.request(query, { variables });
    if (errors) {
      console.log(`[${label}] GRAPHQL ERRORS:`, JSON.stringify(errors, null, 2));
      return null;
    }
    console.log(`[${label}] OK:`, JSON.stringify(data, null, 2).slice(0, 1200));
    return data;
  } catch (e) {
    console.log(`[${label}] FETCH FAILED:`, e.message);
    return null;
  }
}

(async () => {
  // 1. cartCreate with a line
  const created = await run('cartCreate', `
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { id checkoutUrl cost { subtotalAmount { amount currencyCode } }
               lines(first: 10) { edges { node { id quantity merchandise { ... on ProductVariant { id title price { amount currencyCode } product { title handle } } } } } } }
        userErrors { field message }
      }
    }`, { input: { lines: [{ merchandiseId: VARIANT_ID, quantity: 2 }] } });

  const cart = created?.cartCreate?.cart;
  if (!cart) { console.log('ABORT: no cart created'); return; }
  const cartId = cart.id;
  const lineId = cart.lines.edges[0]?.node.id;

  // 2. cartLinesAdd (same variant again -> should merge to qty 3)
  await run('cartLinesAdd', `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { id lines(first: 10) { edges { node { id quantity } } } }
        userErrors { field message }
      }
    }`, { cartId, lines: [{ merchandiseId: VARIANT_ID, quantity: 1 }] });

  // 3. cart query (what GET_CART does)
  await run('cart query', `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id checkoutUrl
        lines(first: 50) { edges { node { id quantity merchandise { ... on ProductVariant { id title price { amount currencyCode } product { title handle } } } } } }
        cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
      }
    }`, { cartId });

  // 4. cartLinesUpdate -> qty 5
  if (lineId) {
    await run('cartLinesUpdate', `
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart { id lines(first: 10) { edges { node { id quantity } } } cost { subtotalAmount { amount currencyCode } } }
          userErrors { field message }
        }
      }`, { cartId, lines: [{ id: lineId, quantity: 5 }] });
  }

  // 5. cartLinesRemove
  if (lineId) {
    await run('cartLinesRemove', `
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart { id lines(first: 10) { edges { node { id quantity } } } }
          userErrors { field message }
        }
      }`, { cartId, lineIds: [lineId] });
  }

  // 6. cart query with a bogus/expired cart id -> what does it return?
  await run('cart query (bogus id)', `
    query GetCart($cartId: ID!) { cart(id: $cartId) { id } }`,
    { cartId: 'gid://shopify/Cart/nonexistent123' });
})();
