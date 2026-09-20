'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { COLOR_RULES, SCENE_RULES } from '@/data/product-tags';
import { v2url } from '@/lib/v2paths';

/**
 * /featured-products/ 兼容跳转（client）：老参数 ?scene= / ?color= 仍落对应静态分类页，
 * 其余一律跳 /best-sellers/。无 JS 时由 page.tsx 里的静态链接兜底。
 */
export default function FeaturedProductsRedirect() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scene = params.get('scene');
    const color = params.get('color');
    if (scene && SCENE_RULES.some((s) => s.key === scene)) {
      router.replace(v2url(`/featured-products/scene/${scene}/`));
    } else if (color && COLOR_RULES.some((c) => c.key === color)) {
      router.replace(v2url(`/featured-products/color/${color}/`));
    } else {
      router.replace(v2url('/best-sellers/'));
    }
  }, [router]);

  return null;
}
