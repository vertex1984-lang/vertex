import FeaturedProductsRedirect from './redirect';
import { v2url } from '@/lib/v2paths';

/**
 * /featured-products/ 已隐藏（2026-09 用户要求：不留入口，原入口全部改指 /best-sellers/）。
 * 本页只做兼容跳转：老参数 ?scene= / ?color= 仍落对应静态分类页，其余一律跳 /best-sellers/
 * （client 组件 FeaturedProductsRedirect 在挂载后 replace）。
 * 页面本身服务端渲染一个指向 /best-sellers/ 的链接，保证无 JS 用户与爬虫有可达内容。
 */
export default function FeaturedProductsPage() {
  return (
    <div className="px-6 pt-36 lg:pt-44 pb-24 lg:pb-32 text-center">
      <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-charcoal mb-4">
        This page has moved
      </h1>
      <p className="text-base text-charcoal-light max-w-md mx-auto mb-8">
        Our featured picks now live with the best sellers.
      </p>
      <a
        href={v2url('/best-sellers/')}
        className="inline-block px-9 py-3.5 rounded-full border-2 border-brand text-brand text-sm font-semibold tracking-wide uppercase transition hover:bg-brand hover:text-cream"
      >
        Shop Best Sellers
      </a>
      <FeaturedProductsRedirect />
    </div>
  );
}
