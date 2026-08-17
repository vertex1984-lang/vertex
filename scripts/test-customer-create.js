const { createStorefrontApiClient } = require('@shopify/storefront-api-client');
const client = createStorefrontApiClient({
  storeDomain: 'https://mkhome-3.myshopify.com',
  apiVersion: '2024-10',
  publicAccessToken: '3e3428278f0d3abc4e62c217b9c09608',
});
(async () => {
  const query = `
    mutation CustomerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer { id email acceptsMarketing }
        customerUserErrors { field message code }
      }
    }`;
  // 1) 新邮箱
  const r1 = await client.request(query, {
    variables: { input: { email: 'makimoo-newsletter-test@example.com', password: 'T3stxQ9wZ2vB7nM4pL8sD1aA', acceptsMarketing: true } },
  });
  console.log('new email:', JSON.stringify(r1.data ?? r1.errors, null, 2));
  // 2) 同邮箱再提交 -> 预期 TAKEN
  const r2 = await client.request(query, {
    variables: { input: { email: 'makimoo-newsletter-test@example.com', password: 'T3stxQ9wZ2vB7nM4pL8sD1aA', acceptsMarketing: true } },
  });
  console.log('same email again:', JSON.stringify(r2.data ?? r2.errors, null, 2));
})();
