/** 商品图地址：本地路径（/images/...）走 vertex 图片代理；CDN 绝对 URL 直接用 */
export function assetSrc(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('/')) return `/api/asset${url}`;
  return url; // http(s):// CDN 地址
}
