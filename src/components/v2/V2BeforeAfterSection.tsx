import V2BeforeAfterSlider from '@/components/v2/V2BeforeAfterSlider';
import { v2url } from '@/lib/v2paths';

/**
 * V2BeforeAfterSection —— Before/After 分栏模块（2026-10-29 用户定 P2）。
 * 首页种草钩子 + PDP "See it in a real room" 共用：
 * 一侧 3:4 拖动对比滑块（自然比例不裁剪，限宽防顶天立地），
 * 一侧 eyebrow + 标题 + 文案 + 可选 CTA；移动端堆叠为上下结构。
 */
export default function V2BeforeAfterSection({
  before,
  after,
  alt,
  eyebrow,
  heading,
  copy,
  ctaLabel,
  ctaHref,
  flip = false,
}: {
  before: string;
  after: string;
  alt: string;
  eyebrow: string;
  heading: string;
  copy: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** true 时桌面端图在右、文在左 */
  flip?: boolean;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 lg:px-6 lg:py-16">
      <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-14">
        <div className={flip ? 'lg:order-2' : ''}>
          <div className="mx-auto max-w-md lg:max-w-none">
            <V2BeforeAfterSlider before={before} after={after} alt={alt} />
          </div>
        </div>
        <div className={flip ? 'lg:order-1' : ''}>
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight text-charcoal">
            {heading}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-charcoal/60">
            {copy}
          </p>
          {ctaLabel && ctaHref && (
            <a
              href={v2url(ctaHref)}
              className="mt-5 inline-flex h-11 items-center rounded-full border border-charcoal/20 px-6 text-sm font-semibold text-charcoal transition hover:border-charcoal/50 hover:bg-off-white"
            >
              {ctaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
