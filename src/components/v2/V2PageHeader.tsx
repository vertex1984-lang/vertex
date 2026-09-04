import { v2url } from '@/lib/v2paths';

export interface V2Crumb {
  label: string;
  /** 不带 /v2 前缀的站内路径；缺省表示当前页（不可点） */
  href?: string;
}

/**
 * V2 内页统一深色页头：bg-brand 块 + pt-32/lg:pt-36 衬住初始透明的 fixed V2Header
 * （announcement bar + header 实底后总高约 112-120px），与 /v2/products/ 页头一致
 */
export default function V2PageHeader({
  crumbs,
  title,
  subtitle,
  meta,
}: {
  crumbs: V2Crumb[];
  title: string;
  subtitle?: string;
  /** 标题下的小徽章，如 "Last Updated: May 2026" */
  meta?: string;
}) {
  return (
    <section className="bg-brand">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-32 lg:pt-36 pb-10 lg:pb-14">
        <nav className="text-xs lg:text-sm text-cream/60 mb-3 lg:mb-4" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={c.label}>
              {i > 0 && <span className="mx-1.5">/</span>}
              {c.href ? (
                <a href={v2url(c.href)} className="hover:text-cream transition-colors">
                  {c.label}
                </a>
              ) : (
                <span className="text-cream">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-cream">{title}</h1>
        {subtitle && (
          <p className="mt-3 lg:mt-4 text-sm lg:text-base text-cream/75 max-w-2xl">{subtitle}</p>
        )}
        {meta && (
          <p className="mt-5">
            <span className="inline-block px-3 py-1 text-xs font-medium text-cream bg-cream/10 border border-cream/25 rounded-full">
              {meta}
            </span>
          </p>
        )}
      </div>
    </section>
  );
}
