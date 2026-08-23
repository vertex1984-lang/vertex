/**
 * 构建时生成 sitemap.xml 到 public/（next build 会复制到 out/）
 * 从 src/data/products.ts 提取全部产品 handle，加上静态页面
 * 运行：node scripts/build-sitemap.js
 */
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.makimoohome.com';

const productsSrc = fs.readFileSync(path.join(__dirname, '../src/data/products.ts'), 'utf8');
const handles = [...productsSrc.matchAll(/"handle":\s*"([^"]+)"/g)].map((m) => m[1]);

// cart/ 和 404 不进 sitemap（robots noindex）
const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/categories/', priority: '0.9', changefreq: 'daily' },
  { loc: '/products/', priority: '0.8', changefreq: 'daily' },
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
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

const outPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');
console.log(`sitemap.xml generated: ${staticPages.length} pages + ${handles.length} products`);
