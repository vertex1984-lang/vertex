import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, getBlogPost } from '@/data/blog-posts';
import { ArticleBody, ArticleHead, RecosRow, CtaBand, buildBlogJsonLd } from '@/components/blog/BlogUI';
import { resolveUrl } from '@/lib/paths';
import '../blog.css';

const SITE_URL = 'https://www.makimoohome.com';

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return { title: 'Article Not Found' };
  const image = post.cardImage.startsWith('http') ? post.cardImage : `${SITE_URL}${post.cardImage}`;
  return {
    title: post.title,
    description: post.metaDescription,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}/` },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: 'article',
      url: `${SITE_URL}/blog/${post.slug}/`,
      images: [{ url: image, alt: post.title }],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const jsonLdBlocks = buildBlogJsonLd(post);

  return (
    <div className="bl-scope">
      {/* 避让 V2Header 固定定位（公告条 + 导航条） */}
      <div aria-hidden="true" style={{ height: 128 }} />

      {jsonLdBlocks.map((jsonLd, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}

      <div className="bl-article-wrap">
        <div className="bl-crumb" style={{ padding: '18px 0 0' }}>
          <a href={resolveUrl('/')}>Home</a>
          <span className="bl-sep">›</span>
          <a href={resolveUrl('/blog/')}>Ideas &amp; Inspiration</a>
          <span className="bl-sep">›</span>
          <span className="bl-current">{post.category}</span>
        </div>
      </div>

      <div className="bl-article-wrap">
        <ArticleHead post={post} />
        <ArticleBody post={post} />
      </div>

      <div className="bl-article-wrap">
        <RecosRow post={post} />
      </div>

      <CtaBand post={post} />
    </div>
  );
}
