import { BLOG_POSTS } from '@/data/blog-posts';
import { v2url } from '@/lib/v2paths';
import { resolveUrl } from '@/lib/paths';

/**
 * Related Guides 模块（2026-09 新增，对应优化手册 PDP 关联阅读 + PLP 教育模块）：
 * 按类目挑 3 张指南卡（Fabric Guide / The Texture Edit / Blog 文章），
 * PDP（heading="Related Guides"）与 PLP 网格下方（heading="Need help deciding?"）共用。
 */

interface GuideCard {
  href: string;
  image: string;
  cat: string;
  title: string;
}

// 站内向导页（非 blog）卡片
const STATIC_GUIDES: Record<string, GuideCard> = {
  'fabric-guide': {
    href: '/fabric-guide/',
    image: '/images/fabric-guide/fabric-banner.webp',
    cat: 'Fabric Guide',
    title: 'What Fabric Is Best for You?',
  },
  'better-texture': {
    href: '/better-texture/',
    image: '/images/fabric-guide/fabric-linen.webp',
    cat: 'The Texture Edit',
    title: 'Better Texture, Better Feeling.',
  },
};

// 各类目（小写 productType）的指南 slug 优先级（取前 3 张；未配置的类目回退到最新 blog 文章）
// bedding 只留 Fabric Guide（2026-09 用户定：The Texture Edit / Pillow Filling 内容还不完整，先不上）
const SLUGS_BY_CAT: Record<string, string[]> = {
  bedding: ['fabric-guide'],
  pillows: ['pillow-filling', 'fabric-guide', 'better-texture'],
  cushions: ['cushion-materials', 'cushion-size-guide', 'door-mats-101'],
  mats: ['rug-materials', 'rug-size-guide', 'low-pile-vs-shag'],
  blankets: ['rug-materials', 'fabric-guide', 'better-texture'],
  towels: ['fabric-guide', 'rug-materials', 'cushion-materials'],
};

function resolveCard(slug: string): GuideCard | null {
  const staticCard = STATIC_GUIDES[slug];
  if (staticCard) return staticCard;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return null;
  return { href: `/blog/${post.slug}/`, image: post.cardImage, cat: post.category, title: post.title };
}

interface V2RelatedGuidesProps {
  /** 小写 productType（bedding / pillows / cushions / mats / blankets / towels…） */
  cat: string;
  eyebrow?: string;
  heading?: string;
  sub?: string;
}

export default function V2RelatedGuides({
  cat,
  eyebrow = 'Keep Exploring',
  heading = 'Related Guides',
  sub,
}: V2RelatedGuidesProps) {
  const slugs = SLUGS_BY_CAT[cat] || BLOG_POSTS.slice(0, 3).map((p) => p.slug);
  const cards = slugs.map(resolveCard).filter((c): c is GuideCard => !!c).slice(0, 3);
  if (cards.length === 0) return null;

  return (
    <section className="bg-off-white">
      <div className="max-w-[1400px] mx-auto px-3 lg:px-10 pb-14 lg:pb-20">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand mb-2">{eyebrow}</p>
        <h2 className="text-xl lg:text-3xl font-extrabold tracking-tight text-charcoal">{heading}</h2>
        {sub && <p className="mt-2 text-sm lg:text-base text-charcoal-light">{sub}</p>}
        <div className="mt-6 lg:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {cards.map((c) => (
            <a key={c.href} href={v2url(c.href)} className="group block">
              <div className="relative overflow-hidden rounded-xl bg-warm-gray aspect-[16/10]">
                <img
                  src={resolveUrl(c.image)}
                  alt={c.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-brand">{c.cat}</p>
              <p className="mt-1 text-sm lg:text-base font-bold text-charcoal leading-snug group-hover:text-brand transition-colors">
                {c.title}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
