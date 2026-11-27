import { CF_ACCOUNT_ID, CF_API_TOKEN } from './env';

/**
 * Cloudflare KV 直写（2026-11-25：admin 部署到服务器后不再依赖本地 vertex 仓库）。
 * 仅需一个带 Workers KV Storage 编辑权限的 API token（CF_API_TOKEN 环境变量）。
 */
export async function cfKvPut(namespaceId: string, key: string, value: string): Promise<void> {
  if (!CF_API_TOKEN) {
    throw new Error('缺少 CF_API_TOKEN 环境变量（Cloudflare API token，需 Workers KV Storage 编辑权限）');
  }
  const url =
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}` +
    `/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${CF_API_TOKEN}`, 'Content-Type': 'text/plain' },
    body: value,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Cloudflare KV 写入失败（HTTP ${res.status}）：${text.slice(0, 200)}`);
  }
}
