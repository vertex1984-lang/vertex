'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { COLOR_RULES, SCENE_RULES } from '@/data/product-tags';
import { v2url } from '@/lib/v2paths';

/**
 * /featured-products/ 已隐藏（2026-09 用户要求：不留入口，原入口全部改指 /best-sellers/）。
 * 本页只做兼容跳转：老参数 ?scene= / ?color= 仍落对应静态分类页，其余一律跳 /best-sellers/。
 * 原 Complete the Look 内容（场景分区网格）随本页下线，filter-bar.tsx / look-card.tsx 保留备查。
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
