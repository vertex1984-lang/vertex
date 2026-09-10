/**
 * V2 路径工具：v2 已切换到根路径上线，v2url 直通 resolveUrl（保留 file:// 兼容逻辑）。
 * 历史：原给站内路径加 /v2 前缀（双版本并存期）；切换后一处改动即完成去前缀。
 *
 * v2url('/products') => '/products'（HTTP 环境）
 * v2url('/')         => '/'
 */

import { resolveUrl } from './paths';

/**
 * 解析站内路径
 * @param path - 站内路径，如 "/products" 或 "/products?cat=cushions"
 */
export function v2url(path: string): string {
  return resolveUrl(path);
}
