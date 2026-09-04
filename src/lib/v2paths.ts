/**
 * V2 路径工具：给站点内路径加 /v2 前缀，再交给 resolveUrl 处理
 * file:// 兼容逻辑（相对路径 + index.html 追加）
 *
 * v2url('/products') => '/v2/products'（HTTP 环境）
 * v2url('/')         => '/v2/'
 */

import { resolveUrl } from './paths';

/**
 * 解析 V2 站内路径
 * @param path - 不带 /v2 前缀的站内路径，如 "/products" 或 "/products?cat=cushions"
 */
export function v2url(path: string): string {
  if (!path.startsWith('/')) return resolveUrl(path);
  if (path === '/') return resolveUrl('/v2/');
  return resolveUrl(`/v2${path}`);
}
