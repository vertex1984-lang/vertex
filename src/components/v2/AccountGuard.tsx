'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCustomerToken } from '@/lib/customer';
import { v2url } from '@/lib/v2paths';

/**
 * 账号守卫（2026-11-12 批次 2）：静态导出无服务端 middleware，守卫只能在客户端做
 * （任务书坑 3）。mount 时查 localStorage token；无 token → 重定向 /login/?next=<当前路径>
 * （登录成功后回跳）。查库期间渲染骨架占位，防止受保护内容闪现。
 * token 失效（过期）由 getCustomerToken 的 expiry 判断兜底；API 层 401 由各页面处理。
 */
export default function AccountGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // null = 检查中（不渲染 children）；false = 未登录（渲染占位，effect 里跳转）；true = 放行
  const [allow, setAllow] = useState<boolean | null>(null);

  useEffect(() => {
    const token = getCustomerToken();
    if (token) {
      setAllow(true);
    } else {
      setAllow(false);
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      router.replace(v2url(`/login/?next=${next}`));
    }
  }, [router]);

  if (allow) return <>{children}</>;

  return (
    <div className="bg-off-white px-6 pt-32 pb-24 max-w-md mx-auto w-full">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-warm-gray rounded w-2/3 mx-auto" />
        <div className="h-40 bg-warm-gray rounded-2xl" />
      </div>
    </div>
  );
}
