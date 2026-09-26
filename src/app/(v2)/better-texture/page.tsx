import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import DragScroll from '@/components/v2/DragScroll';
import { v2url } from '@/lib/v2paths';
import { resolveUrl } from '@/lib/paths';

export const metadata: Metadata = {
  title: 'Better Texture',
  description:
    'Better Texture, Better Feeling. A curated edit of Makimoo pieces where fabric details — linen slub, washed cotton, plush pile, quilting, corduroy — turn into everyday comfort.',
};

/**
 * Better Texture 编辑页（2026-09 新增）：入口 = 首页 Brand Banner "Discover More"。
 * 定位：以"材质细节 → 舒适感"为卖点的精选策展页，而非产品目录——
 * 6 个暖中性色系产品，每个一种不重复的质感，左右交替大排版（参照 fabric-guide 章节式）。
 * 图片帧经人工审图挑选：避开带文字/信息图/白底packshot的帧，选质感特写或暖调场景图。
 */

interface TextureItem {
  index: string;
  texture: string;
  title: string;
  copy: string;
  image: string;
  alt: string;
  handle: string;
}

const TEXTURES: TextureItem[] = [
  {
    index: '01',
    texture: 'Slubbed Linen',
    title: '100% Linen Duvet Cover Set, Oatmeal',
    copy: 'Woven from pure linen flax, the slubbed weave opens tiny air channels that breathe with you through the night — cool in summer, warm in winter. And it softens with every wash: texture that only gets better.',
    image: '/images/products/LINEN3-OATMEAL-QUEEN/3.webp',
    alt: 'Close-up of oatmeal linen duvet cover weave',
    handle: '100-linen-duvet-cover-set-queen-3-piece-bedding-set-with-linen3-oatmeal-queen',
  },
  {
    index: '02',
    texture: 'Washed Cotton-Like',
    title: 'Duvet Cover Set, 3 Piece, Beige',
    copy: 'Garment-washed for a lived-in matte finish, the brushed surface feels like your favorite old tee from the very first night. No stiffness, no break-in period — just instant, quiet softness.',
    image: '/images/products/DUVSET-BEIGE-QUEEN/1.webp',
    alt: 'Beige washed cotton-like duvet cover set in soft daylight',
    handle: 'makimoo-queen-duvet-cover-set-3-piece-soft-brushed-duvset-beige-queen',
  },
  {
    index: '03',
    texture: 'Linen-Like Print',
    title: '4-Piece Bedding Set, Tan Floral',
    copy: 'A quiet botanical print on a linen-touch weave: natural texture and soft pattern in one layer. It adds warmth and depth to the room without a hint of visual noise.',
    image: '/images/products/BEDSET4-TAN-QUEEN/1.webp',
    alt: 'Tan floral linen-like bedding set with botanical print',
    handle: 'makimoo-4-piece-queen-bedding-set-duvet-cover-fitted-sheet-bedset4-tan-queen',
  },
  {
    index: '04',
    texture: 'Plush Faux Fur',
    title: 'Faux Rabbit Fur Throw Blanket, Cream Yellow',
    copy: 'Dense ribbed pile traps warmth in every groove and springs back under your hand. One drape over the sofa, and it becomes the best seat in the house.',
    image: '/images/products/1688-969627065032-C28/4.webp',
    alt: 'Cream yellow faux rabbit fur throw draped over a bed',
    handle: 'luxury-faux-rabbit-fur-plush-blanket-for-couch-sofa-and-bed-1688-969627065032-c28',
  },
  {
    index: '05',
    texture: 'Diamond Quilting',
    title: 'Quilted Pillow Inserts, 40 x 40cm',
    copy: 'Diamond quilting locks the fill in even loft — no flat spots, no midnight fluffing. Just consistent, cloud-soft support every time you sink in.',
    image: '/images/products/B0G6LXSF4T/1.webp',
    alt: 'White quilted pillow inserts showing diamond stitching',
    handle: 'makimoo-quilted-throw-pillow-inserts-40-x-40-cm-pack-of-2-b0g6lxsf4t',
  },
  {
    index: '06',
    texture: 'Ribbed Corduroy',
    title: 'Corduroy Chair Cushions, Khaki',
    copy: 'Wide corduroy ribs and deep tufting give a springy, structured sit that holds its shape day after day. Texture you can lean on — literally.',
    image: '/images/products/B0CBT8FZWF/1.webp',
    alt: 'Khaki ribbed corduroy chair cushions with tufting',
    handle: '2-pack-ribbed-corduroy-chair-cushions-with-ties-for-indoor-b0cbt8fzwf',
  },
];

/** 面料特写横滑条：复用 fabric-guide 的实拍特写，仅取暖中性色系的 4 张（sateen 粉 / organic-cotton 橘红不入） */
const FABRIC_CLOSEUPS = [
  { src: '/images/fabric-guide/fabric-linen.webp', label: 'Linen' },
  { src: '/images/fabric-guide/fabric-linen-like.webp', label: 'Linen-Like' },
  { src: '/images/fabric-guide/fabric-washed-cotton-like.webp', label: 'Washed Cotton' },
  { src: '/images/fabric-guide/fabric-silk-modal.webp', label: 'Silk-Modal' },
];

export default function BetterTexturePage() {
  return (
    <div className="px-3 lg:px-10 pt-24 lg:pt-36 pb-10 lg:pb-14">
      <div className="max-w-[1200px] mx-auto">
        {/* ── 面包屑 ── */}
        <nav className="text-xs lg:text-sm text-[#999] mb-2 lg:mb-3" aria-label="Breadcrumb">
          <a href={v2url('/')} className="hover:text-[#8B5A2B] transition-colors">Home</a>
          <span className="mx-1.5">/</span>
          <span className="text-[#555]">Better Texture</span>
        </nav>

        {/* ── Hero 横幅（复用 fabric-guide 横幅 + 图上文案样式）── */}
        <div className="relative overflow-hidden rounded-xl aspect-[4/3] lg:aspect-[21/9] mb-12 lg:mb-20">
          <img
            src={resolveUrl('/images/fabric-guide/fabric-banner.webp')}
            alt="Folded fabric swatches in warm neutral tones"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-5 lg:px-12 max-w-xl">
              <p className="text-[10px] lg:text-xs font-semibold tracking-[0.2em] uppercase text-cream/90">The Texture Edit</p>
              <h1 className="mt-1.5 text-2xl lg:text-4xl font-extrabold tracking-tight text-cream">Better Texture, Better Feeling.</h1>
              <p className="mt-2 text-xs lg:text-base text-cream/85 leading-relaxed">
                Six pieces, six textures — each chosen for the comfort hidden in its details.
              </p>
            </div>
          </div>
        </div>

        {/* ── 理念引言（编辑感大留白排版）── */}
        <section className="mb-14 lg:mb-24 text-center">
          <Reveal>
            <p className="text-[10px] lg:text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-4">Our Belief</p>
            <h2 className="max-w-3xl mx-auto text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal leading-snug">
              Comfort is not a feature you add.
              <span className="text-brand"> It is a detail you weave in.</span>
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-sm lg:text-base text-charcoal-light leading-relaxed">
              A slub in the linen, a groove in the corduroy, a stitch in the quilting — small things your fingertips notice before your eyes do.
            </p>
          </Reveal>
        </section>

        {/* ── 材质质感章节：左右交替 ── */}
        <div>
          {TEXTURES.map((t, idx) => (
            <section key={t.handle} className="py-8 lg:py-14 border-t border-[#E8E2DA] first:border-t-0 first:pt-0">
              <Reveal>
                <div className={`lg:flex lg:items-center lg:gap-12 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="lg:w-1/2 mb-6 lg:mb-0">
                    <a
                      href={v2url(`/products/${t.handle}/`)}
                      className="group block relative overflow-hidden rounded-xl bg-warm-gray aspect-square lg:aspect-[4/3]"
                    >
                      <img
                        src={resolveUrl(t.image)}
                        alt={t.alt}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </a>
                  </div>
                  <div className="lg:w-1/2">
                    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#999]">{t.index}</p>
                    <p className="mt-2 text-sm lg:text-base font-bold text-brand">{t.texture}</p>
                    <h2 className="mt-1.5 text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal">{t.title}</h2>
                    <p className="mt-3 lg:mt-4 text-sm lg:text-base text-charcoal-light leading-relaxed">{t.copy}</p>
                    <a
                      href={v2url(`/products/${t.handle}/`)}
                      className="mt-5 lg:mt-6 inline-block px-7 py-3 rounded-full text-xs lg:text-sm font-semibold tracking-wide uppercase text-white transition hover:-translate-y-0.5 hover:shadow-lg bg-brand"
                    >
                      Shop This Piece
                    </a>
                  </div>
                </div>
              </Reveal>
            </section>
          ))}
        </div>

        {/* ── 面料特写横滑条 ── */}
        <section className="mt-6 lg:mt-10 mb-12 lg:mb-20">
          <Reveal>
            <h2 className="text-lg lg:text-2xl font-extrabold text-charcoal mb-5 lg:mb-6">Up Close</h2>
            <DragScroll className="flex gap-3 lg:gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {FABRIC_CLOSEUPS.map((f) => (
                <div key={f.label} className="flex-shrink-0 w-[56vw] sm:w-[38vw] lg:w-[255px]">
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-warm-gray">
                    <img
                      src={resolveUrl(f.src)}
                      alt={`${f.label} fabric close-up`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <p className="mt-2.5 text-sm font-semibold text-charcoal">{f.label}</p>
                </div>
              ))}
            </DragScroll>
          </Reveal>
        </section>

        {/* ── 底部 CTA ── */}
        <section className="rounded-2xl bg-brand px-6 py-10 lg:py-14 text-center">
          <h2 className="text-xl lg:text-3xl font-extrabold tracking-tight text-cream">Feel It for Yourself</h2>
          <p className="mt-2 text-sm lg:text-base text-cream/80">Textures this good deserve more than a screen.</p>
          <a
            href={v2url('/products/')}
            className="mt-6 inline-block px-8 py-3.5 rounded-full bg-cream text-brand text-xs lg:text-sm font-semibold tracking-wide uppercase transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Shop All Products
          </a>
        </section>
      </div>
    </div>
  );
}
