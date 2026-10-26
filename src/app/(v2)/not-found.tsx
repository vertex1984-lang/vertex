import type { Metadata } from 'next';
import V2NotFound from '@/components/v2/V2NotFound';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
};

// (v2) 布局内的死链（如 /xxx/）：走 V2 布局，Header/Footer 由布局提供。
// 根 src/app/not-found.tsx 是全局兜底（不走任何布局），自行套壳渲染同一组件。
export default function V2NotFoundPage() {
  return <V2NotFound />;
}
