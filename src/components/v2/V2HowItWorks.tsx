import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/**
 * V2HowItWorks —— Drop 模式说明带·图片卡版（2026-11-27 v2 用户定，/drop-home 试验页专用）。
 * 三张横版（16:9）图片卡，文字压图；移动端一行一张向下排列。
 * 图片叙事：① 产品场景 = You pre-order ② 面料质感 = We make your batch ③ 家居场景 = Ships to your home。
 * 素材暂用现有图；正式版可换打样实拍/生成图（需用户确认后再调 API）。
 */
const STEPS = [
  {
    n: '01',
    title: 'You pre-order',
    body: 'Lock in 30% off the launch price. Every piece is reserved under your name.',
    image: '/images/products/MK-SKROSE4-IVORY-QUEEN/1.webp',
    alt: 'Makimoo Sketch Rose bedding styled on a bed in soft daylight',
  },
  {
    n: '02',
    title: 'We make your batch',
    body: 'No overstock, no warehouses. Your bedding is cut and sewn after the drop closes.',
    image: '/images/fabric-guide/fabric-linen-like.webp',
    alt: 'Close-up of Makimoo linen-feel fabric weave texture',
  },
  {
    n: '03',
    title: 'Ships in ~5 weeks',
    body: 'Free cancellation before it ships. Full refund if we run late.',
    image: '/images/brand/trust-living.webp',
    alt: 'A warm, finished living room styled with Makimoo soft goods',
  },
];

export default function V2HowItWorks() {
  return (
    <section id="how-it-works" className="bg-off-white scroll-mt-[60px] lg:scroll-mt-[96px]">
      <div aria-hidden="true" className="mx-12 lg:mx-auto lg:w-3/5 lg:max-w-[1200px] border-t border-[#EDE6DC]" />
      {/* 容器通栏，与 The Latest（w-full px-6 lg:px-10）对齐 —— 2026-11-28 用户定 */}
      <div className="w-full px-6 lg:px-10 py-8 lg:py-10">
        <p className="text-[10px] lg:text-xs font-semibold tracking-[0.25em] uppercase text-brand mb-4 lg:mb-5">
          How Makimoo works
        </p>
        {/* 移动端竖排一行一张；桌面端三列横版卡 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-5">
          {STEPS.map((s) => (
            <div key={s.n} className="relative overflow-hidden rounded-lg aspect-[16/9] lg:aspect-[16/10] bg-warm-gray">
              <img
                src={resolveUrl(s.image)}
                alt={s.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5">
                <p className="text-cream/80 text-[10px] lg:text-xs font-bold tracking-[0.2em]">
                  {s.n}
                </p>
                <p className="mt-0.5 text-cream text-base lg:text-xl font-extrabold tracking-tight">
                  {s.title}
                </p>
                <p className="mt-1 text-cream/85 text-[11px] lg:text-[13px] leading-snug max-w-sm">
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 lg:mt-5">
          <a
            href={v2url('/pre-order/')}
            className="text-[11px] lg:text-sm font-semibold text-brand border-b border-brand/40 pb-0.5 hover:border-brand transition-colors"
          >
            Read the full pre-order promise →
          </a>
        </p>
      </div>
      <div aria-hidden="true" className="mx-12 lg:mx-auto lg:w-3/5 lg:max-w-[1200px] border-t border-[#EDE6DC]" />
    </section>
  );
}
