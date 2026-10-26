'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v2url } from '@/lib/v2paths';

/**
 * 2026-10-26 用户定：未上架 PDP（Coming Soon）点进来时默认落到有货的规格。
 * - target 由服务端在构建期算好（同色已上架尺寸优先，其次家族内已上架款）
 * - 模块级标记保证同一页面文档只跳一次：站内点色点/尺寸（客户端导航、组件重挂载）不会被弹走，
 *   用户仍可浏览 Coming Soon 规格；整页刷新/外部进入才会再次跳转
 */
let redirectedThisDocument = false;

export default function PdpEntryRedirect({ target }: { target: string }) {
  const router = useRouter();
  useEffect(() => {
    if (redirectedThisDocument) return;
    redirectedThisDocument = true;
    router.replace(v2url(`/products/${target}/`));
  }, [router, target]);
  return null;
}
