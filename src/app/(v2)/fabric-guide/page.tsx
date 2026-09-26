import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { getProductSpecs } from '@/lib/specs';
import { sortByWeight } from '@/lib/weights';
import { spotlightImage } from '@/components/v2/card-utils';
import DragScroll from '@/components/v2/DragScroll';
import { FABRIC_GUIDE, FABRIC_RATING_LABELS, FABRIC_SHORTCUTS } from '@/data/fabric-guide';
import { v2url } from '@/lib/v2paths';
import { resolveUrl } from '@/lib/paths';

export const metadata: Metadata = {
  title: 'Fabric Guide',
  description:
    'What fabric is best for you? Compare linen, washed cotton-like, linen-like, organic cotton, silk-modal and sateen bedding — feel, care, and who each is best for.',
};

// ── 材质卡图与可购状态（与 bedding landing 的 Texture 卡同一口径，构建期计算）──
const inStockBedding = sortByWeight(
  enrichProductsWithShopifyData(PRODUCTS_DATA).filter(
    (p) => p.productType.toLowerCase() === 'bedding' && p.hasShopifyData && p.shopifyAvailable
  )
);
const byMaterial = new Map<string, MakimooProduct[]>();
for (const p of inStockBedding) {
  const m = getProductSpecs(p.asin.toLowerCase())?.material;
  if (!m) continue;
  for (const x of m.split(', ')) {
    const list = byMaterial.get(x);
    if (list) list.push(p);
    else byMaterial.set(x, [p]);
  }
}
const fallbackImage =
  inStockBedding.length > 0 ? spotlightImage(inStockBedding.find((p) => p.featuredImage) || inStockBedding[0]).url : '';
const fabricMeta = (key: string) => {
  const products = byMaterial.get(key) || [];
  const first = products.find((p) => p.featuredImage) || products[0];
  return { available: products.length > 0, image: first ? spotlightImage(first).url : fallbackImage };
};

/** 五维评分圆点（5 满） */
function Dots({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`${n} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`w-2 h-2 rounded-full ${i < n ? 'bg-brand' : 'bg-[#DED6C9]'}`} />
      ))}
    </span>
  );
}

const tagPillCls = 'inline-block px-2.5 py-1 rounded-full border border-[#D8D2C8] text-xs text-[#777] mr-1.5';

/**
 * Fabric Guide 独立页（2026-09 新增）：决策导向而非目录列表（与参考站的逐条陈列式明显区别）——
 * ① 睡姿速选卡 ② 五维对比矩阵 ③ 章节式面料详解（手感/养护/适合人群 + Shop CTA）。
 * 材质与 bedding landing 的 Shop by Texture 同一目录，锚点互通。
 */
export default function FabricGuidePage() {
  return (
    <div className="px-3 lg:px-10 pt-32 lg:pt-36 pb-10 lg:pb-14">
      <div className="max-w-[1200px] mx-auto">
        {/* ── 页头 ── */}
        <nav className="text-xs lg:text-sm text-[#999] mb-2 lg:mb-3" aria-label="Breadcrumb">
          <a href={v2url('/')} className="hover:text-[#8B5A2B] transition-colors">Home</a>
          <span className="mx-1.5">/</span>
          <a href={v2url('/products/?cat=bedding')} className="hover:text-[#8B5A2B] transition-colors">Bedding</a>
          <span className="mx-1.5">/</span>
          <span className="text-[#555]">Fabric Guide</span>
        </nav>
        {/* ── 页头：横幅图 + 图上文案（2026-09 图像化改版，替代原纯文字页头）── */}
        <div className="relative overflow-hidden rounded-xl aspect-[4/3] lg:aspect-[21/9] mb-10 lg:mb-16">
          <img
            src={resolveUrl('/images/fabric-guide/fabric-banner.webp')}
            alt="Six bedding fabrics side by side"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-5 lg:px-12 max-w-xl">
              <p className="text-[10px] lg:text-xs font-semibold tracking-[0.2em] uppercase text-cream/90">The Fabric Guide</p>
              <h1 className="mt-1.5 text-2xl lg:text-4xl font-extrabold tracking-tight text-cream">What Fabric Is Best for You?</h1>
              <p className="mt-2 text-xs lg:text-base text-cream/85 leading-relaxed">
                From crisp natural linen to buttery-soft sateen — every fabric sleeps differently.
              </p>
            </div>
          </div>
        </div>

        {/* ── ① 睡姿速选：先回答一个问题，直接给推荐 ── */}
        <section className="mb-12 lg:mb-20">
          <Reveal>
            <h2 className="text-lg lg:text-2xl font-extrabold text-charcoal mb-5 lg:mb-6">Start with How You Sleep</h2>
            {/* 横滑条：六种面料全展示，触屏滑动/桌面拖拽（2026-09 用户定，替代原 2x2 网格） */}
            <DragScroll className="flex gap-3 lg:gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {FABRIC_SHORTCUTS.map((s) => {
                const sm = fabricMeta(s.pick);
                return (
                  <a
                    key={s.slug}
                    href={`#${s.slug}`}
                    className="group block flex-shrink-0 w-[56vw] sm:w-[38vw] lg:w-[255px] bg-white rounded-xl border border-[#E8E2DA] overflow-hidden transition hover:border-brand hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* 缩略图：面料场景图，Coming Soon 置灰 */}
                    <div className="relative aspect-[16/9] bg-warm-gray overflow-hidden">
                      <img
                        src={resolveUrl(sm.image)}
                        alt={s.pick}
                        loading="lazy"
                        className={`absolute inset-0 w-full h-full object-cover ${sm.available ? '' : 'grayscale'}`}
                      />
                    </div>
                    <div className="p-4 lg:p-5">
                      <p className="text-sm lg:text-base font-bold text-charcoal">{s.title}</p>
                      <p className="mt-2.5 text-xs text-[#999]">We recommend</p>
                      <p className="mt-0.5 text-sm lg:text-base font-extrabold text-brand">{s.pick}</p>
                      <p className="mt-3 text-xs font-semibold text-brand opacity-0 group-hover:opacity-100 transition">See why ↓</p>
                    </div>
                  </a>
                );
              })}
            </DragScroll>
          </Reveal>
        </section>

        {/* ── ② 五维对比矩阵（全端表格；移动端横滑 + 首列固定）── */}
        <section className="mb-12 lg:mb-20">
          <Reveal>
            <h2 className="text-lg lg:text-2xl font-extrabold text-charcoal mb-5 lg:mb-6">Compare at a Glance</h2>
            {/* 全端同一表格：移动端横向滑动 + 首列吸左固定（2026-09 用户定：替代逐面料评分卡，移动端太长） */}
            <div className="overflow-x-auto rounded-xl border border-[#E8E2DA] bg-white">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-[#E8E2DA] text-left">
                    <th className="sticky left-0 z-10 bg-white px-3 lg:px-5 py-3 lg:py-4 text-xs font-semibold uppercase tracking-wider text-[#999]">Fabric</th>
                    {FABRIC_RATING_LABELS.map((c) => (
                      <th key={c.key} className="px-4 py-3 lg:py-4 text-xs font-semibold uppercase tracking-wider text-[#999] whitespace-nowrap">{c.label}</th>
                    ))}
                    <th className="px-4 py-3.5 lg:py-4" />
                  </tr>
                </thead>
                <tbody>
                  {FABRIC_GUIDE.map((f) => {
                    const meta = fabricMeta(f.key);
                    return (
                      <tr key={f.key} className="group/row border-b border-[#F0EAE0] last:border-0 hover:bg-[#FAF6EF] transition-colors">
                        <td className="sticky left-0 z-10 bg-white group-hover/row:bg-[#FAF6EF] px-3 lg:px-5 py-2.5 lg:py-4 transition-colors">
                          <a href={`#${f.slug}`} className="font-bold text-xs lg:text-sm text-charcoal hover:text-brand transition-colors whitespace-nowrap">{f.key}</a>
                          {/* 移动端 Coming Soon 另起一行（列窄放不下） */}
                          {!meta.available && <span className="block lg:inline mt-0.5 lg:mt-0 lg:ml-2 text-[10px] font-semibold uppercase tracking-wide text-[#999]">Coming Soon</span>}
                        </td>
                        {FABRIC_RATING_LABELS.map((c) => (
                          <td key={c.key} className="px-4 py-2.5 lg:py-4"><Dots n={f.ratings[c.key]} /></td>
                        ))}
                        <td className="px-4 py-2.5 lg:py-4 text-right">
                          <a href={`#${f.slug}`} className="text-xs font-semibold text-brand hover:underline underline-offset-4">Details →</a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="lg:hidden mt-2 text-xs text-[#999]">Swipe sideways to compare →</p>
          </Reveal>
        </section>

        {/* ── ③ 章节式面料详解：左右交替，锚点与速选卡/landing 互通 ── */}
        <div>
          {FABRIC_GUIDE.map((f, idx) => {
            const meta = fabricMeta(f.key);
            // Feel/Care 两个列表抽成 JSX：桌面两列展开、移动端收进 <details> 折叠（文字太密，2026-09 用户定）
            const feelList = (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#999] mb-2.5">Feel &amp; Benefits</h3>
                <ul className="space-y-1.5 text-sm text-[#555] list-disc list-outside pl-4 marker:text-brand">
                  {f.feel.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            );
            const careList = (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#999] mb-2.5">Care</h3>
                <ul className="space-y-1.5 text-sm text-[#555] list-disc list-outside pl-4 marker:text-brand">
                  {f.care.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            );
            return (
              <section key={f.key} id={f.slug} className="scroll-mt-28 lg:scroll-mt-32 py-8 lg:py-14 border-t border-[#E8E2DA]">
                <Reveal>
                  <div className={`lg:flex lg:items-start lg:gap-12 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="lg:w-1/2 mb-6 lg:mb-0">
                      <div className="relative overflow-hidden rounded-xl bg-warm-gray aspect-square lg:aspect-[4/3]">
                        <img
                          src={resolveUrl(f.image || meta.image)}
                          alt={f.key}
                          loading="lazy"
                          className={`absolute inset-0 w-full h-full object-cover`}
                        />
                        {!meta.available && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/55 text-cream text-[10px] font-semibold uppercase tracking-wider">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="lg:w-1/2">
                      <div className="mb-3">
                        {f.tags.map((t) => (
                          <span key={t} className={tagPillCls}>{t}</span>
                        ))}
                      </div>
                      <h2 className="text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal">{f.key}</h2>
                      <p className="mt-3 text-sm lg:text-base text-charcoal-light leading-relaxed">{f.intro}</p>
                      {/* 桌面：两列展开 */}
                      <div className="hidden lg:grid mt-6 grid-cols-2 gap-6">
                        {feelList}
                        {careList}
                      </div>
                      {/* 移动端：折叠，默认收起（原生 details，无 JS） */}
                      <details className="lg:hidden mt-4 rounded-lg border border-[#E8E2DA] bg-white/60 px-4 py-3">
                        <summary className="text-sm font-semibold text-charcoal cursor-pointer select-none">Feel &amp; Care Details</summary>
                        <div className="mt-3 space-y-4">
                          {feelList}
                          {careList}
                        </div>
                      </details>
                      <p className="mt-4 lg:mt-6 text-sm text-charcoal">
                        <span className="font-semibold text-brand">Best for: </span>
                        {f.bestFor}
                      </p>
                      <div className="mt-5 lg:mt-6">
                        {meta.available ? (
                          <a
                            href={v2url(`/products/?cat=bedding&sub=${encodeURIComponent(f.key)}`)}
                            className="inline-block px-7 py-3 rounded-full text-xs lg:text-sm font-semibold tracking-wide uppercase text-white transition hover:-translate-y-0.5 hover:shadow-lg bg-brand"
                          >
                            Shop {f.key}
                          </a>
                        ) : (
                          <span className="inline-block px-7 py-3 rounded-full text-xs lg:text-sm font-semibold tracking-wide uppercase border-2 border-[#D8D2C8] text-[#999]">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              </section>
            );
          })}
        </div>

        {/* ── 底部 CTA ── */}
        <section className="mt-6 lg:mt-10 rounded-2xl bg-brand px-6 py-10 lg:py-14 text-center">
          <h2 className="text-xl lg:text-3xl font-extrabold tracking-tight text-cream">Ready to Feel the Difference?</h2>
          <p className="mt-2 text-sm lg:text-base text-cream/80">Shop bedding by texture, color or style — all in one place.</p>
          <a
            href={v2url('/products/?cat=bedding')}
            className="mt-6 inline-block px-8 py-3.5 rounded-full bg-cream text-brand text-xs lg:text-sm font-semibold tracking-wide uppercase transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Shop All Bedding
          </a>
        </section>
      </div>
    </div>
  );
}
