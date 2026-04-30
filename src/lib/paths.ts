/**
 * 路径解析工具
 *
 * - HTTP/HTTPS 环境（Vercel 等）：绝对路径天然可用，直接返回
 * - file:// 协议（本地静态文件）：将绝对路径转为相对路径，并追加 index.html
 */

declare global {
  interface Window {
    __NEXT_BASE_PATH__: string;
  }
}

/**
 * 解析路径，兼容 HTTP 和 file:// 协议
 * @param url - 原始路径，如 "/images/products/B098F1BKJQ/1.jpg" 或 "/products"
 * @returns HTTP 环境返回原始路径；file:// 环境返回相对路径
 */
export function resolveUrl(url: string): string {
  if (!url.startsWith('/')) return url;
  // 服务端（构建期）：保留原始绝对路径
  if (typeof window === 'undefined') return url;

  // HTTP/HTTPS 环境（Vercel 等）：绝对路径天然可用，直接返回
  if (window.location.protocol !== 'file:') return url;

  // file:// 协议：将绝对路径转为相对路径
  const base = window.__NEXT_BASE_PATH__ || './';
  let resolved = base + url.substring(1);

  // 目录路径需要追加 index.html，否则浏览器会显示目录列表
  let pathPart = resolved;
  let queryHash = '';
  const qIdx = resolved.indexOf('?');
  const hIdx = resolved.indexOf('#');
  let splitAt = -1;
  if (qIdx !== -1 && hIdx !== -1) splitAt = Math.min(qIdx, hIdx);
  else if (qIdx !== -1) splitAt = qIdx;
  else if (hIdx !== -1) splitAt = hIdx;
  if (splitAt !== -1) {
    pathPart = resolved.substring(0, splitAt);
    queryHash = resolved.substring(splitAt);
  }

  const lastSegment = pathPart.split('/').filter(Boolean).pop() || '';
  const hasExtension = /\.\w+$/.test(lastSegment);

  if (!hasExtension) {
    if (pathPart.endsWith('/')) {
      pathPart += 'index.html';
    } else {
      pathPart += '/index.html';
    }
  }

  resolved = pathPart + queryHash;
  return resolved;
}
