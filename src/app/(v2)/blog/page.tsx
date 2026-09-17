import type { Metadata } from 'next';
import { BLOG_POSTS } from '@/data/blog-posts';
import { PostCard } from '@/components/blog/BlogUI';
import { resolveUrl } from '@/lib/paths';
import './blog.css';

const SITE_URL = 'https://www.makimoohome.com';
const HERO_IMAGE = '/images/blog/photo-hero.jpg';

export const metadata: Metadata = {
  title: 'Ideas & Inspiration',
  description:
    'Guides to rugs, cushions, pillows and home textiles — honest advice on materials, sizing, care and styling. Practical information first, no sales pitch.',
  alternates: { canonical: `${SITE_URL}/blog/` },
  openGraph: {
    title: 'Ideas & Inspiration | Makimoo',
    description:
      'Honest guides on materials, care and considered design — for every room in your home.',
    url: `${SITE_URL}/blog/`,
    images: [{ url: `${SITE_URL}${HERO_IMAGE}`, alt: 'Makimoo Ideas & Inspiration' }],
  },
};

export default function BlogIndexPage() {
  return (
    <div className="bl-scope">
      {/* 避让 V2Header 固定定位（公告条 + 导航条） */}
      <div aria-hidden="true" style={{ height: 128 }} />

      <div className="bl-crumb">
        <a href={resolveUrl('/')}>Home</a>
        <span className="bl-sep">›</span>
        <span className="bl-current">Ideas &amp; Inspiration</span>
      </div>

      <div className="bl-hero">
        <img src={resolveUrl(HERO_IMAGE)} alt="Illustration of a living room styled with an area rug" />
        <div className="bl-hero-overlay">
          <h1 className="bl-hero-title">Ideas &amp; Inspiration</h1>
          <p className="bl-hero-sub">
            Explore what makes quality home essentials — independent guides on materials, sizing,
            care and considered design.
          </p>
        </div>
      </div>

      <div className="bl-gridwrap">
        <div className="bl-grid">
          {BLOG_POSTS.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
