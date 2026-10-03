import { resolveUrl } from '@/lib/paths';
import { v2url } from '@/lib/v2paths';

/**
 * PDP 品牌故事 + 面料工艺板块（2026-09-29 用户定，参照 Parachute 版式）。
 * 移动端：上图下文堆叠，每块约占一个手机屏幕。
 * 桌面端（2026-09-29 用户定）：图文左右 50/50 分屏（与 StorySplit 同语言），
 * 图片与文案等宽对齐、整版高度约 70vh——原"通栏 21:9 横幅 + 居中窄文字"上下宽度不匹配。
 * 两板块图片左右交替，视觉有节奏。
 * 文案要点：
 * - 品牌故事：品牌公信力（年销体量 / Amazon 评价 / 行业年限），"Brand Story" 链接 → /about/
 * - Materials & Craft（仅 bedding）：布料、工艺与做工，"Explore Our Fabrics" → /fabric-guide/
 */

interface StoryBlockProps {
  image: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  /** 文案区底色 */
  tone: 'cream' | 'off-white';
  /** true = 图片在右（桌面端交替用） */
  reverse?: boolean;
}

function StoryBlock({ image, imageAlt, eyebrow, title, body, ctaLabel, ctaHref, tone, reverse = false }: StoryBlockProps) {
  const bg = tone === 'cream' ? 'bg-cream' : 'bg-off-white';
  return (
    /* 桌面端与 PDP 首屏同宽（80% 屏宽，2026-09-29 用户定：上下板块宽度对齐） */
    <section className={`grid lg:grid-cols-2 lg:w-[80%] lg:mx-auto ${bg}`}>
      {/* 图片半区：移动端 4:3，桌面撑满半区高度 */}
      <div className={`relative aspect-[4/3] lg:aspect-auto lg:min-h-[70vh] ${reverse ? 'lg:order-2' : ''}`}>
        <img
          src={resolveUrl(image)}
          alt={imageAlt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      {/* 文案半区 */}
      <div className={`flex items-center ${reverse ? 'lg:order-1' : ''}`}>
        <div className="max-w-lg mx-auto px-6 lg:px-14 py-8 lg:py-24">
          {eyebrow && (
            <p className="text-[11px] lg:text-xs font-semibold tracking-[0.25em] uppercase text-brand mb-2.5 lg:mb-4">
              {eyebrow}
            </p>
          )}
          <h2 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-charcoal leading-tight mb-3 lg:mb-5">
            {title}
          </h2>
          <p className="text-sm lg:text-base text-charcoal-light leading-relaxed">
            {body}
          </p>
          <a href={v2url(ctaHref)} className="inline-flex items-center gap-2 text-sm font-semibold text-brand group mt-5 lg:mt-7">
            <span className="border-b border-brand/40 pb-0.5 transition-colors group-hover:border-brand">
              {ctaLabel}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function PdpStoryBlocks({ showFabricGuide = false }: { showFabricGuide?: boolean }) {
  return (
    <>
      {/* ── 品牌故事（公信力）；eyebrow 品牌名 + 主标题排版（2026-09-29 用户定）── */}
      <div className="lg:mt-12">
      <StoryBlock
        image="/images/about/about-story.webp"
        imageAlt="A cozy Makimoo living room styled with soft home textiles"
        eyebrow="Makimoo"
        title="A Trusted Name in Home Comfort"
        body="Millions of customers worldwide choose Makimoo — with 500K+ items sold every year, tens of thousands of reviews on Amazon, and over 10 years of experience in home textiles."
        ctaLabel="Brand Story"
        ctaHref="/about/"
        tone="cream"
      />

      {/* ── 布料、工艺与做工（仅 bedding；图片右置交替）── */}
      {showFabricGuide && (
        <StoryBlock
          image="/images/fabric-guide/fabric-banner.webp"
          imageAlt="Makimoo fabric close-ups: linen, washed cotton and more"
          eyebrow="Materials & Craft"
          title="Honest Fabrics, Careful Workmanship"
          body="From long-staple cotton to washed linen, we pick fabrics for how they feel and how they last. Every weave, stitch and finish is checked piece by piece before it leaves our workshop."
          ctaLabel="Explore Our Fabrics"
          ctaHref="/fabric-guide/"
          tone="off-white"
          reverse
        />
      )}
      </div>
    </>
  );
}
