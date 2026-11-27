/**
 * 商品图地址：
 * - 本地开发（vertex 仓库在本机）：本地路径走 /api/asset 代理读 vertex/public
 * - VPS 部署（无 vertex 仓库）：目录图直连线上站点（NEXT_PUBLIC_SITE_ASSET_BASE=https://makimoohome.com）
 * - CDN 绝对 URL 直接用
 */
const SITE_ASSET_BASE = process.env.NEXT_PUBLIC_SITE_ASSET_BASE || '';

export function assetSrc(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('/')) return SITE_ASSET_BASE ? `${SITE_ASSET_BASE}${url}` : `/api/asset${url}`;
  return url; // http(s):// CDN 地址
}
