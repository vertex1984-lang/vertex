import Reveal from '@/components/Reveal';
import { v2url } from '@/lib/v2paths';
import { resolveUrl } from '@/lib/paths';
import type { BeddingFabric } from '@/data/bedding-fabrics';

/**
 * 面料互导模块（2026-09 新增，仿 Parachute "Only the highest-quality materials, period."）：
 * 面料/类型二级 PLP 底部 + /bedding/ 落地页共用，把流量留在 bedding 面料闭环内互跳。
 * 2026-09 用户定：所有文字（面料名 + 质感短句 + Shop Now）压在图上，不显示数量；
 * 当前所在面料页不展示自身卡（currentSlug 排除），落地页不传则全量展示。
 * fabrics 由调用方（服务端）算好数量后传入（只传有产品的面料）。
 */
export default function V2FabricCrossSell({
  fabrics,
  currentSlug,
}: {
  fabrics: (BeddingFabric & { count: number })[];
  currentSlug?: string;
}) {
  const list = fabrics.filter((f) => f.slug !== currentSlug);
  if (list.length === 0) return null;
  return (
    <section className="py-10 lg:py-16 border-t border-[#E8E2DA]">
      <Reveal>
        <div className="text-center mb-8 lg:mb-12">
          <p className="text-[10px] lg:text-xs font-semibold tracking-[0.2em] uppercase text-brand">
            Makimoo Fabrics
          </p>
          <h2 className="mt-2 text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal">
            Only the Highest-Quality Materials, Period.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8">
          {list.map((f) => (
            <a key={f.slug} href={v2url(`/bedding/${f.slug}/`)} className="group block">
              <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-warm-gray">
                <img
                  src={resolveUrl(f.heroImage)}
                  alt={`${f.material} fabric close-up`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 lg:p-6">
                  <p className="text-lg lg:text-2xl font-extrabold text-cream drop-shadow">
                    {f.material}
                  </p>
                  <p className="mt-0.5 text-xs lg:text-sm text-cream/85">{f.desc}</p>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs lg:text-sm font-semibold text-cream">
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
