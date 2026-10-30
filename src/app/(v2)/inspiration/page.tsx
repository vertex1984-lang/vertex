import type { Metadata } from 'next';
import V2BeforeAfterSlider, {
  type BeforeAfterHotspot,
} from '@/components/v2/V2BeforeAfterSlider';
import V2Lookbook from '@/components/v2/V2Lookbook';
import { INSPIRATION_SCENES, type InspirationScene } from '@/data/inspiration-scenes';
import { getProductByHandle } from '@/data/products';
import { v2url } from '@/lib/v2paths';

export const metadata: Metadata = {
  title: 'Inspiration – Styled Rooms & Before/After',
  description:
    'Real rooms, transformed. Drag the slider on our featured before & after scenes, then browse the lookbook — every look is shoppable.',
};

/** 服务端 enrich：热区 handle → 产品卡字段（口径同 scenes.ts buildScene） */
function resolveHotspots(refs: InspirationScene['hotspots']): BeforeAfterHotspot[] {
  const out: BeforeAfterHotspot[] = [];
  for (const h of refs) {
    const p = getProductByHandle(h.handle);
    if (!p) continue;
    out.push({
      handle: p.handle,
      title: p.title,
      image: p.shopifyImages?.[0] ?? p.featuredImage ?? p.images[0]?.url ?? '',
      price: p.shopifyPrice ?? p.priceRange.minVariantPrice.amount,
      currency: p.shopifyCurrencyCode ?? p.priceRange.minVariantPrice.currencyCode,
      x: h.x,
      y: h.y,
      label: h.label,
    });
  }
  return out;
}

/** 精选 B&A：只挑最有代表性的两套（客厅+卧室），大图单列展示（2026-10-30 用户定） */
const FEATURED_IDS = [5, 2];

/**
 * /inspiration —— 灵感中心（2026-10-30 重构，用户定）：
 * 1. Featured Before & After：精选 2 套对比大图（带热点/Shop this look），
 *    底部出口 → /scenes/（Shop the Look 汇总）；
 * 2. The Lookbook：种草图预览（前 12 张）+ View all → /scenes/（全量筛选瀑布流，
 *    与 /scenes/ 共用 src/data/lookbook.ts 单一数据源，永不同步问题）。
 */
export default function InspirationPage() {
  const featured = INSPIRATION_SCENES.filter((s) => FEATURED_IDS.includes(s.id));
  return (
    <div className="pb-16 pt-6 lg:pt-10">
      {/* ── Featured Before & After（精选大图，桌面全宽杂志感；移动端图片全出血，文字保留 px-4）── */}
      <div className="px-0 lg:px-6">
        <header className="px-4 lg:px-0">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand">
            Inspiration
          </p>
          <h1 className="mt-2 text-2xl lg:text-4xl font-extrabold tracking-tight text-charcoal">
            Before &amp; After
          </h1>
          <p className="mt-2 max-w-md text-sm text-charcoal/60">
            Same room, same angle — drag the slider to see what a few soft
            layers can do, then tap a dot to shop the look.
          </p>
        </header>

        {/* 桌面端两套并排双列（2026-10-30 用户定：原单列 max-w-3xl 两侧空白太大），移动端单列 */}
        <div className="mt-6 grid grid-cols-1 gap-10 lg:mt-10 lg:grid-cols-2 lg:gap-8">
          {featured.map((s) => (
            <section key={s.id} className="w-full">
              {/* 标题在图上方 */}
              <div className="mb-3 px-4 lg:px-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
                  {s.room}
                </p>
                <h2 className="mt-1 text-lg font-bold tracking-tight text-charcoal">
                  {s.title}
                </h2>
              </div>
              <V2BeforeAfterSlider
                before={s.before}
                after={s.after}
                alt={s.alt}
                hotspots={resolveHotspots(s.hotspots)}
              />
              <div className="mt-2 flex flex-wrap items-center gap-2 px-4 lg:px-0">
                <span className="text-xs text-charcoal/50">Shop this look:</span>
                {s.products.map((p) => (
                  <a
                    key={p.href}
                    href={v2url(p.href)}
                    className="rounded-full border border-charcoal/15 px-3 py-1 text-xs text-charcoal transition-colors hover:border-charcoal/40 hover:bg-off-white"
                  >
                    {p.label}
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* 出口：B&A 是"证明改变"，出口到 /scenes/ 全量种草图汇总页 */}
        <div className="mt-8 text-center lg:mt-10">
          <a
            href={v2url('/scenes/')}
            className="inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand"
          >
            Shop every look
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>

      {/* ── The Lookbook 预览（前 12 张，全量在 /scenes/；移动端图片全出血）── */}
      <div className="mt-12 px-0 lg:mt-16 lg:px-6">
        <div className="mb-5 flex items-end justify-between gap-4 px-4 lg:px-0">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand">
              The Lookbook
            </p>
            <h2 className="mt-2 text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal">
              Rooms we love
            </h2>
          </div>
          <a
            href={v2url('/scenes/')}
            className="shrink-0 text-sm font-semibold text-brand underline underline-offset-4 transition-colors hover:text-charcoal"
          >
            View all
          </a>
        </div>
        <V2Lookbook preview={12} />
        {/* 底部出口：与标题右侧 View all 同款（2026-10-30 用户定：预览末尾再加一个） */}
        <div className="mt-8 text-center">
          <a
            href={v2url('/scenes/')}
            className="text-sm font-semibold text-brand underline underline-offset-4 transition-colors hover:text-charcoal"
          >
            View all
          </a>
        </div>
      </div>
    </div>
  );
}
