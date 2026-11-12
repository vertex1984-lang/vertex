import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-10';

export const shopifyClient = createStorefrontApiClient({
  storeDomain: `https://${domain}`,
  apiVersion,
  publicAccessToken: accessToken,
});

/**
 * Customer API 专用 client（批次 2 修复，见 验收报告-批次2-20261112.md P0-1）：
 * SHOPIFY_API_VERSION=2025-07 已移除 customerAccessTokenCreate 等认证族 mutation，
 * 且经典形态的 customer 查询/地址 mutation 只在旧版本可用——**customer 调用族全部
 * 锁定 2024-04**（token 作查询变量传，无 header）。商品/购物车主 client（上方
 * shopifyClient，跟随 env 版本）不受影响，勿合并。
 */
export const customerClient = createStorefrontApiClient({
  storeDomain: `https://${domain}`,
  apiVersion: '2024-04',
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
