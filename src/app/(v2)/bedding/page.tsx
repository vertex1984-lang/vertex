import BeddingRedirect from './redirect';
import { v2url } from '@/lib/v2paths';

/**
 * /bedding/ 落地页已下线（2026-09-27 用户定：删除该页，bedding 一级类目页指定为
 * /products/?cat=bedding，全站不再引用本页）。本页只做兼容跳转：
 * 老链接/书签/搜索引擎进来的访问一律 client 端 replace 到 /products/?cat=bedding；
 * 无 JS 时由下方静态链接兜底。
 * 面料/类型二级页 /bedding/[slug]/ 不受影响，仍在用。
 */
export default function BeddingLandingPage() {
  return (
    <div className="px-6 pt-36 lg:pt-44 pb-24 lg:pb-32 text-center">
      <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-charcoal mb-4">
        This page has moved
      </h1>
      <p className="text-base text-charcoal-light max-w-md mx-auto mb-8">
        Shop all Makimoo bedding in one place.
      </p>
      <a
        href={v2url('/products/?cat=bedding')}
        className="inline-block px-9 py-3.5 rounded-full border-2 border-brand text-brand text-sm font-semibold tracking-wide uppercase transition hover:bg-brand hover:text-cream"
      >
        Shop Bedding
      </a>
      <BeddingRedirect />
    </div>
  );
}
