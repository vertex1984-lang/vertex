'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customerGet, getCustomerToken, type CustomerProfile } from '@/lib/customer';
import { v2url } from '@/lib/v2paths';

/**
 * 账号页面共享 hook（批次 2）：mount 读 token → customerGet 拉全量资料。
 * - 无本地 token 或 API 凭证失效（UNAUTHORIZED）→ 清 token 踢回 /login（带 next 回跳）
 * - 返回 loading 状态供骨架屏；refresh() 供增删改后重拉
 */
export function useCustomer() {
  const router = useRouter();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearAndRedirect = () => {
    import('@/lib/customer').then(({ clearCustomerToken }) => clearCustomerToken());
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    router.replace(v2url(`/login/?next=${next}&expired=1`));
  };

  const load = async () => {
    const token = getCustomerToken();
    if (!token) {
      clearAndRedirect();
      return;
    }
    const r = await customerGet(token.accessToken);
    if (!r.ok) {
      if (r.code === 'UNAUTHORIZED') {
        clearAndRedirect();
        return;
      }
      setError(r.message);
      setLoading(false);
      return;
    }
    setProfile(r.data);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { profile, loading, error, refresh: load };
}
