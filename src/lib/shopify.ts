import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-10';

export const shopifyClient = createStorefrontApiClient({
  storeDomain: `https://${domain}`,
  apiVersion,
  publicAccessToken: accessToken,
});

// Helper to handle API errors gracefully
export async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  try {
    const { data, errors } = await shopifyClient.request(query, { variables });
    if (errors) {
      console.error('Shopify API errors:', errors);
      return null;
    }
    return (data as T) ?? null;
  } catch (error) {
    console.error('Shopify API request failed:', error);
    return null;
  }
}
