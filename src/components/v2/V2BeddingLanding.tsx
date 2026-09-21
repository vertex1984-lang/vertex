'use client';

import { useState } from 'react';
import DragScroll from '@/components/v2/DragScroll';
import V2ProductCard, { V2CardProduct } from '@/components/v2/V2ProductCard';
import Reveal from '@/components/Reveal';
import { v2url } from '@/lib/v2paths';
import { resolveUrl } from '@/lib/paths';
import { FABRIC_GUIDE } from '@/data/fabric-guide';

export interface LandingColorGroup {
  key: string;
  label: string;
  hex: string;
  products: V2CardProduct[];
}

export interface LandingStyleCard {
  key: string;
  label: string;
  count: number;
  blurb: string;
  image: string;
}

export interface LandingTextureCard {
  key: string; // 材质原名（含空格/%，链接需 encodeURIComponent）
  label: string;
  count: number;
  image: string;
}

interface V2BeddingLandingProps {
  categoryKey: string; // 小写类目 key（链接用，如 'bedding'）
  textures: LandingTextureCard[];
  colorGroups: LandingColorGroup[];
  styleCards: LandingStyleCard[];
  newest: V2CardProduct[];
}

const stripCls =
  'flex gap-3 lg:gap-5 overflow-x-auto pb-2 pr-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';

// Texture 材质目录：固定展示顺序，无产品的材质也出卡（2026-09 用户定：占位图 + Coming Soon）。
// 目录外材质（历史遗留，如 Microfiber/Bamboo）由页面数据按数量追加在尾部
export const BEDDING_TEXTURE_ORDER = ['100% Linen', 'Washed Cotton-Like', 'Linen-Like', 'Organic Cotton', 'Silk-Modal', 'Sateen'];

// 材质卡一句话描述（小字，2026-09 用户定 Texture 模块）；未收录的材质不显示描述行
const TEXTURE_BLURBS: Record<string, string> = {
  '100% Linen': 'Pure natural linen — breathable, durable, softer with every wash.',
  'Washed Cotton-Like': 'A soft washed feel with a relaxed, lived-in look.',
  'Linen-Like': 'Airy linen-style texture with a naturally relaxed drape.',
  'Organic Cotton': 'Grown without synthetic chemicals — soft, breathable, kind to skin.',
  'Silk-Modal': 'Silky-smooth with a cool, gentle touch.',
  Sateen: 'A smooth sateen weave with a subtle, buttery sheen.',
};

// Fabric Guide 横幅图上六捆面料的热点 x 坐标（%，与 FABRIC_GUIDE 顺序一一对应；图为 21:9 六捆并列构图）
const FABRIC_HOTSPOT_X = [10, 26.5, 43, 57.5, 72.5, 87.5];

/**
 * Bedding 一级类目落地页（2026-09 重构）：全宽 bleed、非平铺的聚合展示——
 * Shop by Texture + Fabric Guide（同一底色带大模块，置顶：材质竖版大卡横滑 + 面料指南小卡 → /fabric-guide/）
 * → Shop by Style（bento 大图卡）
 * → Shop by Color（色系 chip 单行横滑 + 横滑产品条）→ New Arrivals（左标题右横滑）。
 * 无 scene 维度（bedding 全部产品 scene=bedroom，无分组意义）。
 * 入口去向：材质卡 → ?sub= 网格视图；色系底链 → ?color= 网格视图；风格卡 → ?material= 网格视图；View More → ?sort=newest 网格视图。
 */
export default function V2BeddingLanding({ categoryKey, textures, colorGroups, styleCards, newest }: V2BeddingLandingProps) {
  const [activeColor, setActiveColor] = useState(colorGroups[0]?.key || '');
  const activeGroup = colorGroups.find((g) => g.key === activeColor) || colorGroups[0];

  // 风格主卡 = 产品数最多的风格，其余按传入顺序
  const heroStyle = styleCards.reduce((a, b) => (b.count > a.count ? b : a), styleCards[0]);
  const restStyles = styleCards.filter((c) => c.key !== heroStyle?.key);

  return (
    /* 打破页容器 px 实现全宽 bleed（页容器 px-3 lg:px-10） */
    <div className="-mx-3 lg:-mx-10">
      {/* ── Section 1: Texture 大模块（2026-09 用户定：Shop by Texture + Fabric Guide 同一整体，共享底色带）── */}
      {textures.length > 0 && (
        <section className="mt-2 lg:mt-4 bg-[#F4EEE4]">
          {/* Part 1: Shop by Texture（竖版大卡横滑，整卡进 ?sub= 材质网格） */}
          <div className="pt-8 lg:pt-14 pb-9 lg:pb-14">
            <Reveal>
              <div className="px-3 lg:px-10 mb-5 lg:mb-7">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2">Touch &amp; Feel</p>
                <h2 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-charcoal">Shop by Fabric</h2>
                <p className="mt-2 text-sm lg:text-base text-charcoal-light max-w-xl">
                  From crisp natural linen to buttery-soft sateen — find the feel you want to sink into.
                </p>
              </div>
              <div className="pl-3 lg:pl-10">
                <DragScroll className={stripCls}>
                  {textures.map((t) => {
                    // 无产品的材质：不可点、图置灰、标 Coming Soon（2026-09 用户定：也展示，占位图由页面数据提供）
                    const empty = t.count === 0;
                    const inner = (
                      <>
                        <img
                          src={resolveUrl(t.image)}
                          alt={t.label}
                          loading="lazy"
                          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${
                            empty ? 'grayscale' : 'group-hover:scale-105'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
                          <p className="text-base lg:text-xl font-extrabold tracking-tight text-cream">{t.label}</p>
                          {/* 无产品材质标 Coming Soon；件数不展示（2026-09 用户定：全站卡片移除 xx Pieces） */}
                          {empty && <p className="mt-0.5 text-xs text-cream/80">Coming Soon</p>}
                          {TEXTURE_BLURBS[t.label] && (
                            <p className="mt-1.5 text-xs lg:text-sm leading-relaxed text-cream/85">{TEXTURE_BLURBS[t.label]}</p>
                          )}
                        </div>
                      </>
                    );
                    const cardCls =
                      'relative block w-[68vw] sm:w-[40vw] lg:w-[min(28vw,420px)] flex-shrink-0 overflow-hidden rounded-xl bg-warm-gray aspect-[3/4]';
                    return empty ? (
                      <div key={t.key} className={cardCls}>{inner}</div>
                    ) : (
                      <a
                        key={t.key}
                        href={v2url(`/products/?cat=${categoryKey}&sub=${encodeURIComponent(t.key)}`)}
                        className={`group ${cardCls}`}
                      >
                        {inner}
                      </a>
                    );
                  })}
                </DragScroll>
              </div>
            </Reveal>
          </div>

          {/* Part 2: Fabric Guide（2026-09 图像化改版：横板大图 + 图上热点 chip，点各面料捆进 /fabric-guide/ 对应章节） */}
          <div className="px-3 lg:px-10 pb-10 lg:pb-16">
            <div className="pt-8 lg:pt-12">
              <Reveal>
                {/* 与页面边框留与其他模块一致的空隙（px-3 lg:px-10 + 圆角）；白字 + 左侧暗渐变，与 /fabric-guide/ 页头一致（2026-09 用户定） */}
                <div className="relative overflow-hidden rounded-xl aspect-[4/3] lg:aspect-[21/9]">
                  <img
                    src={resolveUrl('/images/fabric-guide/fabric-banner.webp')}
                    alt="Six bedding fabrics side by side"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* 左侧暗色渐变 + 白字（与 /fabric-guide/ 页头同一处理）；文字垂直居中靠左 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 flex items-center">
                    <div className="px-5 lg:px-12 max-w-xl">
                      <p className="text-[10px] lg:text-xs font-semibold tracking-[0.2em] uppercase text-cream/90">The Fabric Guide</p>
                      <h3 className="mt-1.5 text-xl lg:text-3xl font-extrabold tracking-tight text-cream">What Fabric Is Best for You?</h3>
                      <p className="hidden sm:block mt-2 text-xs lg:text-sm text-cream/85 leading-relaxed">
                        Feel, care, and who each fabric is best for — decoded.
                      </p>
                      <a
                        href={v2url('/fabric-guide/')}
                        className="mt-3 inline-block text-xs lg:text-sm font-semibold text-cream underline underline-offset-4"
                      >
                        Explore the Guide →
                      </a>
                    </div>
                  </div>
                  {/* 桌面端：六捆面料热点 chip（移动端太挤不出热点，只留 CTA）；x 坐标对应图中六捆位置 */}
                  {FABRIC_GUIDE.map((f, i) => (
                    <a
                      key={f.key}
                      href={v2url(`/fabric-guide/#${f.slug}`)}
                      style={{ left: `${FABRIC_HOTSPOT_X[i]}%` }}
                      className="hidden lg:block absolute top-[18%] -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/55 text-cream text-xs font-semibold whitespace-nowrap transition hover:bg-brand"
                    >
                      {f.key}
                    </a>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ── Section 2: Shop by Style（bento 大图卡，整卡进 ?material= 网格） ── */}
      {styleCards.length > 0 && heroStyle && (
        <section className="py-10 lg:py-16">
          <Reveal>
            <div className="px-3 lg:px-10">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2">Find Your Look</p>
              <h2 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-charcoal mb-6 lg:mb-8">Shop by Style</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-5">
                {[heroStyle, ...restStyles].map((card, i) => {
                  const big = i === 0;
                  // 奇数张剩余卡时最后一张拉通整行（宽卡），避免网格末尾空位
                  const wideLast = !big && restStyles.length % 2 === 1 && i === restStyles.length;
                  return (
                    <a
                      key={card.key}
                      href={v2url(`/products/?cat=${categoryKey}&material=${card.key}`)}
                      className={`group relative block overflow-hidden rounded-xl bg-warm-gray ${
                        // 辅卡方卡 1:1，宽卡 2:1 与方卡行高一致；主卡两行撑高
                        big ? 'col-span-2 row-span-2 aspect-[2/1] lg:aspect-auto' : wideLast ? 'col-span-2 aspect-[2/1]' : 'aspect-square'
                      }`}
                    >
                      <img
                        src={resolveUrl(card.image)}
                        alt={card.label}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                        <p className={`font-extrabold tracking-tight text-cream ${big ? 'text-xl lg:text-2xl' : 'text-sm lg:text-lg'}`}>
                          {card.label}
                        </p>
                        {big && card.blurb && (
                          <p className="mt-1.5 text-xs lg:text-sm text-cream/85 max-w-md">{card.blurb}</p>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* ── Section 3: Shop by Color ── */}
      {colorGroups.length > 0 && activeGroup && (
        <section className="py-10 lg:py-16">
          <Reveal>
            <div className="px-3 lg:px-10 mb-5 lg:mb-7">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2">Shop by Color</p>
              <h2 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-charcoal">Find Your Shade</h2>
            </div>
            {/* 色系 chip 行：单行横滑可拖动（2026-09 用户定，替代多行换行）；hex 圆点 + 色名，active 品牌色描边 */}
            <div className="pl-3 lg:pl-10 mb-6 lg:mb-8">
              <DragScroll className="flex flex-nowrap items-center gap-2 lg:gap-2.5 overflow-x-auto pb-1 pr-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {colorGroups.map((g) => {
                  const active = g.key === activeGroup.key;
                  return (
                    <button
                      key={g.key}
                      onClick={() => setActiveColor(g.key)}
                      aria-pressed={active}
                      className={`inline-flex flex-shrink-0 whitespace-nowrap items-center gap-2 px-3.5 py-1.5 rounded-full border-2 text-sm transition ${
                        active
                          ? 'border-brand text-brand font-semibold'
                          : 'border-[#D8D2C8] text-[#555] hover:border-brand'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0" style={{ backgroundColor: g.hex }} />
                      {g.label}
                    </button>
                  );
                })}
              </DragScroll>
            </div>
            {/* 横滑产品条（按权重前 10；卡片标签天然显示材质） */}
            <div className="pl-3 lg:pl-10">
              <DragScroll className={stripCls}>
                {activeGroup.products.map((p) => (
                  <div key={p.id} className="w-[44vw] sm:w-[30vw] lg:w-[min(22vw,320px)] flex-shrink-0">
                    <V2ProductCard product={p} />
                  </div>
                ))}
              </DragScroll>
            </div>
            <div className="px-3 lg:px-10 mt-5 lg:mt-6 text-right">
              <a
                href={v2url(`/products/?cat=${categoryKey}&color=${activeGroup.key}`)}
                className="text-sm font-semibold text-brand hover:underline underline-offset-4"
              >
                Shop All {activeGroup.label} →
              </a>
            </div>
          </Reveal>
        </section>
      )}

      {/* ── Section 4: New Arrivals（左标题右横滑，V2NewArrivals 同款版式） ── */}
      {newest.length > 0 && (
        <section className="py-10 lg:py-16">
          <Reveal>
            <div className="lg:flex lg:items-stretch">
              <div className="px-3 lg:pl-10 lg:pr-6 mb-8 lg:mb-0 lg:w-[480px] lg:flex-shrink-0 lg:flex lg:flex-col">
                <div className="lg:max-w-[340px]">
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2">Just Landed</p>
                  <h2 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-charcoal leading-tight mb-4">
                    New Arrivals
                  </h2>
                  <p className="text-sm lg:text-base text-charcoal-light leading-relaxed mb-6">
                    The latest additions to our bedding collection.
                  </p>
                  <div>
                    <a
                      href={v2url(`/products/?cat=${categoryKey}&sort=newest`)}
                      className="inline-block px-7 py-3 rounded-full border-2 border-brand text-brand text-xs lg:text-sm font-semibold tracking-wide uppercase transition hover:bg-brand hover:text-cream"
                    >
                      View More
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0 pl-3 lg:pl-4">
                <DragScroll className={stripCls}>
                  {newest.map((p) => (
                    <div key={p.id} className="w-[44vw] sm:w-[30vw] lg:w-[min(22vw,320px)] flex-shrink-0">
                      <V2ProductCard product={p} />
                    </div>
                  ))}
                </DragScroll>
              </div>
            </div>
          </Reveal>
        </section>
      )}
    </div>
  );
}
