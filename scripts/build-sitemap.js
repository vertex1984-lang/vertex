/**
 * 构建时生成 sitemap.xml 到 public/（next build 会复制到 out/）
 * 从 src/data/products.ts 提取全部产品 handle，加上静态页面
 * 运行：node scripts/build-sitemap.js
 */
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.makimoohome.com';

// 基础目录 + 素材库目录都收进 sitemap（此前只读 products.ts，241 个素材库商品 PDP 漏收）
const productsSrc = fs.readFileSync(path.join(__dirname, '../src/data/products.ts'), 'utf8');
const baseHandles = [...productsSrc.matchAll(/"handle":\s*"([^"]+)"/g)].map((m) => m[1]);
const materialsSrc = fs.readFileSync(path.join(__dirname, '../src/data/products-materials.ts'), 'utf8');
const materialHandles = [...materialsSrc.matchAll(/"handle":\s*"([^"]+)"/g)].map((m) => m[1]);
const handles = [...new Set([...baseHandles, ...materialHandles])];

// Blog 文章 slug（只匹配顶层条目的 4 空格缩进 slug；recos 里的引用 slug 是 `{ slug:` 形式，不会命中）
const blogSrc = fs.readFileSync(path.join(__dirname, '../src/data/blog-posts.ts'), 'utf8');
const blogSlugs = [...blogSrc.matchAll(/^ {4}slug:\s*"([^"]+)"/gm)].map((m) => m[1]);

// cart/ 和 404 不进 sitemap（robots noindex）
const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/categories/', priority: '0.9', changefreq: 'daily' },
  { loc: '/products/', priority: '0.8', changefreq: 'daily' },
  { loc: '/blog/', priority: '0.6', changefreq: 'weekly' },
  { loc: '/better-texture/', priority: '0.6', changefreq: 'monthly' },
  { loc: '/bedding/', priority: '0.7', changefreq: 'weekly' },
  // 面料二级 PLP（与 src/data/bedding-fabrics.ts 注册表手动同步）
  { loc: '/bedding/linen/', priority: '0.7', changefreq: 'weekly' },
  { loc: '/bedding/washed-cotton/', priority: '0.7', changefreq: 'weekly' },
  { loc: '/bedding/linen-like/', priority: '0.7', changefreq: 'weekly' },
  // 类型二级 PLP（与 bedding-families.ts 的 SET_KIND_SLUGS 手动同步）
  // Bed Sets 合并页（导航唯一类型入口）；单类型页保留兜底无入口，不入 sitemap；
  // comforter-sets 2026-09-26 移除（唯一 comforter 家族实为被套 3 件套，已归 three，该类型页不再生成）
  { loc: '/bedding/bed-sets/', priority: '0.7', changefreq: 'weekly' },
  { loc: '/about/', priority: '0.6', changefreq: 'monthly' },
  { loc: '/contact/', priority: '0.6', changefreq: 'monthly' },
  { loc: '/shipping-returns/', priority: '0.4', changefreq: 'monthly' },
  { loc: '/privacy/', priority: '0.2', changefreq: 'yearly' },
  { loc: '/terms/', priority: '0.2', changefreq: 'yearly' },
];

const today = new Date().toISOString().slice(0, 10);

const urls = [
  ...staticPages.map(
    (p) => `  <url>
    <loc>${SITE}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  ),
  ...handles.map(
    (h) => `  <url>
    <loc>${SITE}/products/${h}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  ),
  ...blogSlugs.map(
    (s) => `  <url>
    <loc>${SITE}/blog/${s}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
  ),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

const outPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');
console.log(`sitemap.xml generated: ${staticPages.length} pages + ${handles.length} products + ${blogSlugs.length} blog posts`);
