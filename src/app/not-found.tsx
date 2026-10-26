import type { Metadata } from 'next';
import V2Header from '@/components/v2/V2Header';
import V2Footer from '@/components/v2/V2Footer';
import MiniCart from '@/components/MiniCart';
import V2NotFound from '@/components/v2/V2NotFound';
import { stylesByCategory } from '@/data/style-tagged';
import { beddingMaterialSubs } from '@/app/(v2)/layout';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: false },
};

// 全局死链兜底：不走 (v2) 布局，手动套 V2 Header/Footer 壳（2026-10-20 用户定：404 与全站风格统一）。
// (v2)/not-found.tsx 渲染同一个 V2NotFound 组件，Header/Footer 由 (v2) 布局提供。
export default function NotFound() {
  const catStyles = { ...stylesByCategory(), bedding: beddingMaterialSubs() };
  return (
    <div className="w-full overflow-x-clip bg-off-white">
      <V2Header catStyles={catStyles} />
      <main>
        <V2NotFound />
      </main>
      <V2Footer />
      <MiniCart />
    </div>
  );
}
