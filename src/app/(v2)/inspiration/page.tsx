import type { Metadata } from 'next';
import V2BeforeAfterSlider, {
  type BeforeAfterHotspot,
} from '@/components/v2/V2BeforeAfterSlider';
import { INSPIRATION_SCENES, type InspirationScene } from '@/data/inspiration-scenes';
import { getProductByHandle } from '@/data/products';
import { v2url } from '@/lib/v2paths';

export const metadata: Metadata = {
  title: 'Inspiration – Before & After',
  description:
    'Real rooms, transformed. Drag the slider to see each space before and after styling with makimoo pieces — then shop the look.',
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

/**
 * /inspiration —— Before & After 种草对比页（2026-10-28 P1 MVP）。
 * 8 套同一房间/同一角度/同一比例（3:4）的空房 vs 布置后对比图，
 * 拖动滑块查看差异；After 侧图上有产品热区点（点击弹小卡跳 PDP），
 * 图下挂 "Shop this look" 链接。
 * 布局（2026-10-29 用户定）：移动端单列，桌面端一行两个图（md 起 2 列），
 * max-w-5xl 居中收敛卡片高度；标题在图上方；分割线初始居中。
 */
export default function InspirationPage() {
  return (
    <div className="pb-16 pt-6 lg:pt-10">
      {/* 标题与图网格共用同一个居中容器，保证标题左缘与图片左边对齐（2026-10-29 用户定） */}
      {/* max-w-[83.6rem]：在 5xl 基础上整体放大 ~32%（两次 +20%/+10%），图片更高（2026-10-29 用户定） */}
      <div className="mx-auto max-w-5xl px-4 lg:max-w-[83.6rem] lg:px-6">
        <header>
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

        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:mt-10 lg:gap-8">
        {INSPIRATION_SCENES.map((s) => (
          <section key={s.id}>
            {/* 标题在图上方（2026-10-29 用户定） */}
            <div className="mb-3">
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
            <div className="mt-2 flex flex-wrap items-center gap-2">
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
      </div>
    </div>
  );
}
