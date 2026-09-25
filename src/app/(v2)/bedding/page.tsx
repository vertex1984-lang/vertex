import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import { PRODUCTS_DATA, enrichProductsWithShopifyData } from '@/data/products';
import { buildSetFamilies, SetFamily, SetKind, SET_KIND_PAGE_COPY } from '@/data/bedding-families';
import { BEDDING_FABRICS } from '@/data/bedding-fabrics';
import BeddingSetCard from '@/components/v2/BeddingSetCard';
import V2FabricCrossSell from '@/components/v2/V2FabricCrossSell';
import { v2url } from '@/lib/v2paths';
import { resolveUrl } from '@/lib/paths';

export const metadata: Metadata = {
  title: 'Bedding — Bed Sets, Duvet Covers & Sheets',
  description:
    'Better Comfort. Better Sleep. Soft, breathable Makimoo bedding — 3 & 4-piece bed sets in linen, washed cotton and more. Sheets and duvet covers coming soon.',
};

/**
 * 新 Bedding 落地页（2026-09 新增，第三版）：
 * - 按产品类型组织（Bed Sets / Duvet Covers / Sheets / Blankets），对标 Parachute 类目页
 * - 目前仅 Bed Sets 有产品（3 件套 & 4 件套套装）；Sheets / Duvet Covers 展示 Coming Soon
 * - 旧路由保留不动：V1 classic 在 legacy/classic/，本页为独立新路由 /bedding/，回滚 = 删除本目录
 * - 2026-09 用户定：桌面端内容区占屏 80% 居中；分区带锚点（#sets-4 / #sets-3 / #sets-comforter /
 *   #on-the-loom），mega menu BEDDING 列深链至此
 * - 家族分组与卡片复用共享模块（src/data/bedding-families.ts + BeddingSetCard.tsx），
 *   与 /products?cat=bedding 选购视图同一口径
 */

const KIND_ANCHOR: Record<SetKind, string> = {
  four: 'sets-4',
  three: 'sets-3',
  comforter: 'sets-comforter',
};

// ── 产品类型索引（Parachute 多列风格）─────────────────────────
interface TypeEntry {
  title: string;
  lines: string[];
  href?: string;
  comingSoon?: boolean;
}

/** 分区展示全部家族卡（2026-09 起不再截断：/products?cat=bedding 大杂烩页全站无入口，
 *  View All 没有可去的二级类型页，落地页直接展示完整列表） */
function SetSection({ kind, families }: { kind: SetKind; families: SetFamily[] }) {
  if (families.length === 0) return null;
  const copy = SET_KIND_PAGE_COPY[kind];
  return (
    <section
      id={KIND_ANCHOR[kind]}
      className="py-10 lg:py-16 border-t border-[#E8E2DA] first:border-t-0 first:pt-0 scroll-mt-32 lg:scroll-mt-36"
    >
      <Reveal>
        <div className="mb-6 lg:mb-10">
          <h2 className="text-xl lg:text-3xl font-extrabold text-charcoal">{copy.heading}</h2>
          <p className="mt-1.5 text-sm lg:text-base text-charcoal-light">{copy.blurb}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-8">
          {families.map((f) => (
            <BeddingSetCard key={f.key} family={f} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export default function BeddingPage() {
  const beddingProducts = enrichProductsWithShopifyData(PRODUCTS_DATA).filter(
    (p) => p.productType === 'Bedding'
  );
  const fourPiece = buildSetFamilies(beddingProducts, 'four');
  const threePiece = buildSetFamilies(beddingProducts, 'three');
  const comforter = buildSetFamilies(beddingProducts, 'comforter');
  const setCount = fourPiece.length + threePiece.length + comforter.length;

  // 面料互导模块数据：注册表顺序，只显示有产品的面料
  const all = [...fourPiece, ...threePiece, ...comforter];
  const fabricsWithCounts = BEDDING_FABRICS.map((x) => ({
    ...x,
    count: all.filter((f) => f.materials.includes(x.material)).length,
  })).filter((x) => x.count > 0);

  const types: TypeEntry[] = [
    {
      title: 'Bed Sets',
      lines: ['3 & 4-Piece Sets', `${setCount} styles, ready to ship.`],
      href: '#sets-4',
    },
    { title: 'Duvet Covers', lines: ['Stand-alone covers.', 'Coming Soon.'], comingSoon: true, href: '#on-the-loom' },
    { title: 'Sheets', lines: ['Fitted & flat sheets.', 'Coming Soon.'], comingSoon: true, href: '#on-the-loom' },
    {
      title: 'Blankets',
      lines: ['Plush throws & layers.', 'For bed, couch & beyond.'],
      href: '/products?cat=blankets',
    },
  ];

  /* 版心（2026-09 用户定）：移动端 px-3 全宽；桌面端内容区占屏幕 80% 居中（超宽屏下控制行长与卡尺寸），
     无 1200px 死版心，随视口等比缩放 */
  return (
    <div className="px-3 lg:px-0 lg:w-[80%] lg:mx-auto pt-32 lg:pt-36 pb-10 lg:pb-14">
      {/* ── 面包屑 ── */}
      <nav className="text-xs lg:text-sm text-[#999] mb-2 lg:mb-3" aria-label="Breadcrumb">
        <a href={v2url('/')} className="hover:text-[#8B5A2B] transition-colors">Home</a>
        <span className="mx-1.5">/</span>
        <span className="text-[#555]">Bedding</span>
      </nav>

      {/* ── Hero：舒适 & 睡眠质量主题（SeeAny 生成底图 + HTML 叠加文案）；桌面端 47:10 超宽幅（2026-09 用户定）── */}
      <div className="relative overflow-hidden rounded-xl aspect-[3/4] sm:aspect-[4/3] lg:aspect-[47/10] mb-12 lg:mb-20">
        <img
          src={resolveUrl('/images/bedding/hero-desktop.webp')}
          alt="A plush, layered bed in soft morning light"
          className="absolute inset-0 w-full h-full object-cover hidden lg:block"
        />
        <img
          src={resolveUrl('/images/bedding/hero-mobile.webp')}
          alt="A plush, layered bed in soft morning light"
          className="absolute inset-0 w-full h-full object-cover lg:hidden"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="px-5 lg:px-14 max-w-xl lg:max-w-2xl">
            <p className="text-[10px] lg:text-xs font-semibold tracking-[0.2em] uppercase text-cream/90">Makimoo Bedding</p>
            <h1 className="mt-1 lg:mt-2 text-2xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-cream">
              Better Comfort. Better Sleep.
            </h1>
            <p className="mt-1.5 lg:mt-3 text-xs lg:text-base text-cream/85 leading-relaxed">
              Soft, breathable layers designed for deeper sleep — and brighter mornings.
            </p>
          </div>
        </div>
      </div>

      {/* ── Shop by Type（Parachute 多列索引风格）── */}
      <section className="mb-12 lg:mb-20">
        <Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-14">
            {types.map((t) => {
              const inner = (
                <>
                  <span className="inline-flex items-center gap-2 text-sm lg:text-base font-bold tracking-[0.15em] uppercase text-charcoal pb-3 mb-4 border-b border-charcoal/20 w-full group-hover:text-brand transition-colors">
                    {t.title}
                    {!t.comingSoon && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    )}
                  </span>
                  <span className="block text-sm lg:text-base text-charcoal-light">{t.lines[0]}</span>
                  {t.comingSoon ? (
                    <span className="mt-1 inline-block text-xs lg:text-sm font-semibold tracking-wide uppercase text-[#999]">
                      {t.lines[1]}
                    </span>
                  ) : (
                    <span className="mt-1 block text-xs lg:text-sm text-[#999]">{t.lines[1]}</span>
                  )}
                </>
              );
              return t.href ? (
                <a key={t.title} href={t.href.startsWith('#') ? t.href : v2url(t.href)} className="group block">
                  {inner}
                </a>
              ) : (
                <div key={t.title} className="group block opacity-75">{inner}</div>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* ── Bed Sets 产品区（锚点供 mega menu BEDDING 列深链）── */}
      <SetSection kind="four" families={fourPiece} />
      <SetSection kind="three" families={threePiece} />
      <SetSection kind="comforter" families={comforter} />

      {/* ── Coming Soon：Sheets / Duvet Covers ── */}<section id="on-the-loom" className="py-10 lg:py-16 border-t border-[#E8E2DA] scroll-mt-32 lg:scroll-mt-36">
        <Reveal>
          <div className="mb-6 lg:mb-10">
            <h2 className="text-xl lg:text-3xl font-extrabold text-charcoal">On the Loom</h2>
            <p className="mt-1.5 text-sm lg:text-base text-charcoal-light">
              We&rsquo;re weaving what&rsquo;s next — same fabrics, same standard.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8">
            {[
              {
                title: 'Sheets',
                copy: 'Fitted & flat sheets in our signature breathable weaves.',
                image: '/images/fabric-guide/fabric-washed-cotton-like.webp',
              },
              {
                title: 'Duvet Covers',
                copy: 'Stand-alone covers to refresh the bed you already love.',
                image: '/images/fabric-guide/fabric-linen.webp',
              },
            ].map((c) => (
              <div key={c.title} className="relative overflow-hidden rounded-xl aspect-[16/9] lg:aspect-[16/8] bg-warm-gray">
                <img
                  src={resolveUrl(c.image)}
                  alt={`${c.title} fabric preview`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 lg:p-8">
                  <span className="inline-block px-3 py-1 rounded-full bg-cream/90 text-brand text-[10px] lg:text-xs font-bold tracking-[0.15em] uppercase">
                    Coming Soon
                  </span>
                  <h3 className="mt-2 text-lg lg:text-2xl font-extrabold text-cream">{c.title}</h3>
                  <p className="mt-1 text-xs lg:text-base text-cream/85">{c.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── 底部：面料互导模块（替代原进大杂烩页的 CTA——该页全站已无入口，2026-09 用户定）── */}
      <V2FabricCrossSell fabrics={fabricsWithCounts} />
    </div>
  );
}
