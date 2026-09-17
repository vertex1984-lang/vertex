/**
 * Blog UI 组件集（Ideas & Inspiration）
 *
 * - 全部为服务端组件（静态导出构建期渲染）
 * - 产品卡按 key 从 PRODUCTS_DATA 反查：图片/价格/PDP 链接与站点数据保持一致
 */

import { PRODUCTS_DATA, enrichProductsWithShopifyData, MakimooProduct } from '@/data/products';
import { resolveUrl } from '@/lib/paths';
import type { BlogBlock, BlogPost, BlogProductRef } from '@/data/blog-posts';

const SITE_URL = 'https://www.makimoohome.com';

/** 按博客产品 key（小写 asin）解析站点产品（含 Shopify 价格富化） */
function findProduct(key: string): MakimooProduct | null {
  const raw = PRODUCTS_DATA.find((p) => p.asin.toLowerCase() === key.toLowerCase());
  if (!raw) return null;
  return enrichProductsWithShopifyData([raw])[0];
}

/** 价格展示：整数去小数，非整数保留两位 */
export function formatUsd(price?: string): string {
  if (!price) return '';
  const n = parseFloat(price);
  if (Number.isNaN(n)) return '';
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

/* ============ 列表页卡片 ============ */

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <a className="bl-card" href={resolveUrl(`/blog/${post.slug}/`)}>
      <div className="bl-card-img">
        <img src={resolveUrl(post.cardImage)} alt={post.title} loading="lazy" />
      </div>
      <div className="bl-cat">{post.category}</div>
      <h3 className="bl-card-title">{post.title}</h3>
      <div className="bl-exc">{post.excerpt}</div>
      <div className="bl-meta">
        {post.date} · {post.readTime} min read
      </div>
    </a>
  );
}

/* ============ 文章内嵌产品卡 ============ */

function BlogProductCard({ card }: { card: BlogProductRef }) {
  const product = findProduct(card.key);
  const img = product?.featuredImage || product?.images?.[0]?.url || '';
  const price = product ? product.shopifyPrice || product.priceRange.minVariantPrice.amount : '';
  const href = product ? resolveUrl(`/products/${product.handle}/`) : '';

  return (
    <a className="bl-product" href={href || resolveUrl('/categories/')}>
      <div className="bl-product-img">
        {img ? <img src={resolveUrl(img)} alt={card.name} loading="lazy" /> : null}
      </div>
      <div className="bl-product-info">
        <div className="bl-product-cat">{card.category}</div>
        <h4>{card.name}</h4>
        <p className="bl-product-desc">{card.desc}</p>
        <div className="bl-product-row">
          {price ? <span className="bl-price">{formatUsd(price)}</span> : null}
          <span className="bl-btn">View Product</span>
        </div>
      </div>
    </a>
  );
}

/* ============ 正文区块渲染 ============ */

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2>{block.text}</h2>;
    case 'p':
      return <p>{block.text}</p>;
    case 'list':
      return (
        <ul>
          {block.items?.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case 'olist':
      return (
        <ol>
          {block.items?.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );
    case 'table':
      return (
        <div className="bl-tbl-wrap">
          <table>
            <thead>
              <tr>
                {block.head?.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows?.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'prosCons':
      return (
        <div className="bl-pc">
          <div className="bl-pc-box bl-pros">
            <h4>Pros</h4>
            <ul>
              {block.pros?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bl-pc-box bl-cons">
            <h4>Cons</h4>
            <ul>
              {block.cons?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    case 'products':
      return (
        <>
          {block.products?.map((card, i) => (
            <BlogProductCard key={`${card.key}-${i}`} card={card} />
          ))}
          {block.productsNote ? <div className="bl-product-note">{block.productsNote}</div> : null}
        </>
      );
    case 'faq':
      return (
        <div className="bl-faq">
          {block.faqs?.map((f, i) => (
            <details key={i} open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      );
    case 'takeaway':
      return <div className="bl-takeaway">{block.text}</div>;
    case 'image':
      return (
        <figure>
          <img src={resolveUrl(block.src || '')} alt={block.alt || ''} loading="lazy" />
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      );
    default:
      return null;
  }
}

/* ============ 文章页组装 ============ */

export function ArticleBody({ post }: { post: BlogPost }) {
  return (
    <div className="bl-article-body">
      <p className="bl-lede">{post.lede}</p>
      {post.blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

export function ArticleHead({ post }: { post: BlogPost }) {
  return (
    <div className="bl-article-head">
      <h1>{post.title}</h1>
      <div className="bl-byline">
        <b>Makimoo Editors</b>
        <span className="bl-dot">•</span>
        <span>{post.date}</span>
        <span className="bl-dot">•</span>
        <span>{post.readTime} min read</span>
      </div>
      <div className="bl-head-rule" />
    </div>
  );
}

export function RecosRow({ post }: { post: BlogPost }) {
  return (
    <div className="bl-reco">
      <div className="bl-reco-title">Recommended Reading</div>
      <div className="bl-reco-row">
        {post.recos.map((reco) => (
          <a key={reco.slug} className="bl-reco-card" href={resolveUrl(`/blog/${reco.slug}/`)}>
            <div className="bl-reco-img">
              <img src={resolveUrl(reco.image)} alt={reco.title} loading="lazy" />
            </div>
            <div className="bl-cat">{reco.cat}</div>
            <h4>{reco.title}</h4>
          </a>
        ))}
      </div>
    </div>
  );
}

export function CtaBand({ post }: { post: BlogPost }) {
  return (
    <div className="bl-cta-band">
      <h3>{post.cta.heading}</h3>
      <p>{post.cta.text}</p>
      <a className="bl-btn" href={resolveUrl(post.cta.href)}>
        {post.cta.label}
      </a>
    </div>
  );
}

/* ============ JSON-LD ============ */

export function buildBlogJsonLd(post: BlogPost): object[] {
  const pageUrl = `${SITE_URL}/blog/${post.slug}/`;
  const imageUrl = post.cardImage.startsWith('http') ? post.cardImage : `${SITE_URL}${post.cardImage}`;
  const results: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.metaDescription,
      image: [imageUrl],
      author: { '@type': 'Organization', name: 'Makimoo' },
      publisher: { '@type': 'Organization', name: 'Makimoo' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Ideas & Inspiration', item: `${SITE_URL}/blog/` },
        { '@type': 'ListItem', position: 3, name: post.title, item: pageUrl },
      ],
    },
  ];
  const faqs = post.blocks
    .filter((b) => b.type === 'faq')
    .flatMap((b) => b.faqs || []);
  if (faqs.length > 0) {
    results.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }
  return results;
}
