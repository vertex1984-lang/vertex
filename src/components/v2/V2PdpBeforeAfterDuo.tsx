import V2BeforeAfterSlider from '@/components/v2/V2BeforeAfterSlider';
import V2ImageHotspots from '@/components/v2/V2ImageHotspots';
import type { BeforeAfterHotspot } from '@/components/v2/hotspots';
import { getProductByHandle } from '@/data/products';
import { v2url } from '@/lib/v2paths';
import type { PdpBeforeAfterData } from '@/data/pdp-before-after';
import type { SceneHotspotRef } from '@/data/inspiration-scenes';

/**
 * V2PdpBeforeAfterDuo —— PDP 双图区（2026-10-29 用户定）：
 * 种草图（The Look）+ 场景对比滑块（Before & After）。
 * 一种草一证明，两张图讲同一条房间故事线（场景取自 /inspiration 同批素材）。
 * 位置（2026-10-30 用户定）：You May Also Like 上方。
 * 桌面端版式（2026-10-30 用户定稿）：不打满屏宽——整体宽度与 PDP 内容区一致
 * （max-w-[1520px] lg:w-[80%]），图片按 3:4 原生比例展示不裁切（热点全部可见），
 * 图约占 55% 宽、文字区垂直居中；通栏 1 图左文右，通栏 2 文左图右；
 * 移动端：上图下文竖排，图片打满屏宽。
 * 热区（2026-10-30 用户定）：两张图都展示场景内产品圆点+小卡（跳 PDP），
 * 圆点锚定 object-cover 图片实际显示区域（cover 裁切时不错位）；
 * 本 PDP 产品对应的圆点品牌色特别标记（"This item"），小卡不可跳转。
 * 仅 pdp-before-after.ts 映射表内的 handle 渲染（图里产品颜色与 PDP 匹配）。
 */

/** 本 PDP 产品的展示信息（isCurrent 热区小卡用当前 PDP 的图/价/名） */
export interface DuoCurrentProduct {
  title: string;
  image: string;
  price: string;
  currency: string;
}

/** 场景热区 refs → 产品卡字段（口径同 /inspiration page resolveHotspots），
    currentHandle 命中的热区标记 isCurrent 并用当前 PDP 信息 */
function enrichHotspots(
  refs: SceneHotspotRef[],
  currentHandle: string,
  current: DuoCurrentProduct,
): BeforeAfterHotspot[] {
  const out: BeforeAfterHotspot[] = [];
  for (const r of refs) {
    if (r.handle === currentHandle) {
      out.push({
        handle: r.handle,
        title: current.title,
        image: current.image,
        price: current.price,
        currency: current.currency,
        x: r.x,
        y: r.y,
        label: r.label,
        isCurrent: true,
      });
      continue;
    }
    const p = getProductByHandle(r.handle);
    if (!p) continue;
    out.push({
      handle: p.handle,
      title: p.title,
      image: p.shopifyImages?.[0] ?? p.featuredImage ?? p.images[0]?.url ?? '',
      price: p.shopifyPrice ?? p.priceRange.minVariantPrice.amount,
      currency: p.shopifyCurrencyCode ?? p.priceRange.minVariantPrice.currencyCode,
      x: r.x,
      y: r.y,
      label: r.label,
    });
  }
  return out;
}

const imgLabel =
  'absolute left-3 bottom-3 bg-black/45 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white pointer-events-none z-10';
const eyebrow =
  'text-xs font-semibold tracking-[0.25em] uppercase text-brand';
const headline =
  'mt-3 text-lg font-bold tracking-tight text-charcoal lg:text-4xl';
// 描述文字仅桌面端显示（2026-10-30 用户定：移动端不展示）
const bodyCopy =
  'hidden lg:block mt-4 max-w-md text-sm leading-relaxed text-charcoal/70 lg:text-base';

export default function V2PdpBeforeAfterDuo({
  duo,
  current,
}: {
  duo: PdpBeforeAfterData;
  current: DuoCurrentProduct;
}) {
  const lifestyleHotspots = enrichHotspots(
    duo.lifestyleScene.hotspots,
    duo.currentHandle,
    current,
  );
  const sceneHotspots = enrichHotspots(
    duo.scene.hotspots,
    duo.currentHandle,
    current,
  );
  const currentHref = `/products/${duo.currentHandle}/`;

  return (
    <section className="mx-auto max-w-[1520px] px-6 pt-8 pb-2 lg:w-[80%] lg:max-w-none lg:px-10 lg:py-12">
      {/* 通栏 1：种草图。移动端：标题在图上方、chips 在图下方；桌面端：图左文右。
          图片 3:4 原生比例不裁切 */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
        {/* 移动端标题块（桌面端标题在右侧文字区里） */}
        <div className="mb-4 lg:hidden">
          <p className={eyebrow}>Styled by makimoo</p>
          <h3 className={headline}>{duo.lifestyleScene.title}</h3>
        </div>
        <div className="relative -mx-6 lg:mx-0 lg:w-[55%] lg:shrink-0">
          <V2ImageHotspots
            image={duo.lifestyle.image}
            alt={duo.lifestyle.alt}
            hotspots={lifestyleHotspots}
          />
          <span className={imgLabel}>The Look</span>
        </div>
        <div className="flex flex-col justify-center py-6 lg:flex-1 lg:py-0">
          <p className={`${eyebrow} hidden lg:block`}>Styled by makimoo</p>
          <h3 className={`${headline} hidden lg:block`}>{duo.lifestyleScene.title}</h3>
          <p className={bodyCopy}>
            A quiet corner, finished with makimoo textures. Every piece in this
            room is shoppable — tap a dot on the image to see it up close.
          </p>
          <div className="flex flex-wrap items-center gap-2 lg:mt-6">
            <span className="text-xs text-charcoal/50">Shop this look:</span>
            {duo.lifestyleScene.products.map((p) => {
              const isCurrent = p.href === currentHref;
              return (
                <a
                  key={p.href}
                  href={v2url(p.href)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    isCurrent
                      ? 'bg-brand font-semibold text-white'
                      : 'border border-charcoal/15 text-charcoal hover:border-charcoal/40 hover:bg-off-white'
                  }`}
                >
                  {p.label}
                  {isCurrent ? ' · This item' : ''}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* 通栏 2：对比滑块。移动端：标题在图上方、拖拽提示在图下方；桌面端：文左图右。
          图片 3:4 原生比例不裁切 */}
      <div className="mt-10 flex flex-col lg:mt-16 lg:flex-row-reverse lg:items-center lg:gap-12 xl:gap-16">
        {/* 移动端标题块（桌面端标题在左侧文字区里） */}
        <div className="mb-4 lg:hidden">
          <p className={eyebrow}>Before &amp; After</p>
          <h3 className={headline}>{duo.scene.title}</h3>
        </div>
        <div className="relative -mx-6 lg:mx-0 lg:w-[55%] lg:shrink-0">
          <V2BeforeAfterSlider
            before={duo.scene.before}
            after={duo.scene.after}
            alt={duo.scene.alt}
            hotspots={sceneHotspots}
          />
          <span className={imgLabel}>Before &amp; After</span>
        </div>
        <div className="flex flex-col justify-center pt-4 pb-0 lg:flex-1 lg:py-0">
          <p className={`${eyebrow} hidden lg:block`}>Before &amp; After</p>
          <h3 className={`${headline} hidden lg:block`}>{duo.scene.title}</h3>
          <p className={bodyCopy}>
            The same room, before and after styling with makimoo. Drag the
            divider to see what a few soft layers can do.
          </p>
          <p className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-charcoal/50 lg:mt-6">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 6l-5 6 5 6" />
              <path d="M15 6l5 6-5 6" />
            </svg>
            Drag the image to compare
          </p>
        </div>
      </div>
    </section>
  );
}
