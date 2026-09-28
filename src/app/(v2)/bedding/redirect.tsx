'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v2url } from '@/lib/v2paths';

/**
 * /bedding/ 兼容跳转（client）：落地页已下线，一律跳 bedding 一级类目页
 * /products/?cat=bedding（2026-09-27 用户定）。无 JS 时由 page.tsx 静态链接兜底。
 */
export default function BeddingRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(v2url('/products/?cat=bedding'));
  }, [router]);

  return null;
}
