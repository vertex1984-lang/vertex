import Reveal from '@/components/Reveal';
import { v2url } from '@/lib/v2paths';
import { resolveUrl } from '@/lib/paths';

export interface PillowCrossSellItem {
  slug: string;
  label: string;
  blurb: string;
  image: string;
}

/**
 * Pillows 二级类目页底部互导模块（2026-09-30 用户定，样式照搬 bedding 的 V2FabricCrossSell）：
 * 横滑小卡条（文字压图 + Shop Now），把流量留在 pillows 类目闭环内互跳；
 * 当前所在页不展示自身卡（currentSlug 排除）。items 由调用方（服务端）算好后传入（只传有产品的类目）。
 */
export default function V2PillowCrossSell({
  items,
  currentSlug,
}: {
  items: PillowCrossSellItem[];
  currentSlug?: string;
}) {
  const list = items.filter((f) => f.slug !== currentSlug);
  if (list.length === 0) return null;
  return (
    <section className="py-10 lg:py-16 border-t border-[#E8E2DA]">
      <Reveal>
        <div className="text-center mb-6 lg:mb-8">
          <p className="text-[10px] lg:text-xs font-semibold tracking-[0.2em] uppercase text-brand">
            Makimoo Pillows
          </p>
          <h2 className="mt-2 text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal">
            More Ways to Shop Pillows
          </h2>
        </div>
        <div className="flex gap-3 lg:gap-4 overflow-x-auto pb-2 [justify-content:safe_center] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {list.map((f) => (
            <a
              key={f.slug}
              href={v2url(`/pillows/${f.slug}/`)}
              className="group block flex-shrink-0 w-[67vw] sm:w-[276px] lg:w-[322px]"
            >
              <div className="relative overflow-hidden rounded-xl aspect-[4/5] bg-warm-gray">
                <img
                  src={resolveUrl(f.image)}
                  alt={f.label}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 lg:p-4">
                  <p className="text-base lg:text-lg font-extrabold text-cream drop-shadow">
                    {f.label}
                  </p>
                  <p className="mt-0.5 text-[11px] lg:text-xs text-cream/85">{f.blurb}</p>
                  <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] lg:text-xs font-semibold text-cream">
                    <span className="relative">
                      Shop Now
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-cream transition-all duration-300 group-hover:w-full" />
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
