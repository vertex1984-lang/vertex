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
// 2026-10-26 起：HIDDEN 清单唯一来源 = src/data/products.ts（自动解析，杜绝两份手动清单漂移——
// 漂移曾致 25 款已隐藏产品被 sitemap 收录、duvset-gray-duvet / percalejac-haze-duvet 两款在售品被误排除）
const HIDDEN_HANDLES = new Set(
  [...productsSrc.match(/const HIDDEN_HANDLES = new Set\(\[([\s\S]*?)\]\)/)[1].matchAll(/'([^']+)'/g)].map((m) => m[1])
);
const HIDDEN_HANDLE_PREFIXES = [...productsSrc
  .match(/const HIDDEN_HANDLE_PREFIXES = \[([\s\S]*?)\]/)[1]
  .matchAll(/'([^']+)'/g)].map((m) => m[1]);

const handles = [...new Set([...baseHandles, ...materialHandles])]
  .filter(
    (h) =>
      !HIDDEN_HANDLE_PREFIXES.some((pre) => h.startsWith(pre)) &&
      !HIDDEN_HANDLES.has(h)
  );

// Blog 文章 slug（只匹配顶层条目的 4 空格缩进 slug；recos 里的引用 slug 是 `{ slug:` 形式，不会命中）
const blogSrc = fs.readFileSync(path.join(__dirname, '../src/data/blog-posts.ts'), 'utf8');
const blogSlugs = [...blogSrc.matchAll(/^ {4}slug:\s*"([^"]+)"/gm)].map((m) => m[1]);

// cart/ 和 404 不进 sitemap（robots noindex）
const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/categories/', priority: '0.9', changefreq: 'daily' },
  // 裸 /products/ 2026-10-20 起客户端跳转 /categories/（用户定：浏览入口统一到类目页），不入 sitemap
  { loc: '/blog/', priority: '0.6', changefreq: 'weekly' },
  { loc: '/better-texture/', priority: '0.6', changefreq: 'monthly' },
  // /bedding/ 落地页已下线（2026-09-27 用户定，一级类目页 = /products?cat=bedding），不入 sitemap；
  // 面料二级 PLP（与 src/data/bedding-fabrics.ts 注册表手动同步）
  { loc: '/bedding/percale/', priority: '0.7', changefreq: 'weekly' },
  { loc: '/bedding/linen/', priority: '0.7', changefreq: 'weekly' },
  { loc: '/bedding/washed-cotton/', priority: '0.7', changefreq: 'weekly' },
  { loc: '/bedding/linen-like/', priority: '0.7', changefreq: 'weekly' },
  { loc: '/bedding/sateen/', priority: '0.7', changefreq: 'weekly' },
  // /bedding/satin/ 2026-10-23 随 Satin 床品全站移除下线（用户定），不入 sitemap
  // 类型二级 PLP（与 bedding-families.ts 的 SET_KIND_SLUGS 手动同步）
  // Bed Sets 合并页 2026-10-16 已下线（URL 死链 404）；3-piece-sets 2026-10-22 随三件套并四件套下线；
  // comforter-sets 2026-09-26 移除；单类型页保留兜底无入口——均不入 sitemap
  // Duvet Covers 类型页 2026-10 上线（ice silk 缎面 + 9 款独立被套单件，导航入口已开）
  { loc: '/bedding/duvet-covers/', priority: '0.7', changefreq: 'weekly' },
  // Pillows 二级 PLP（2026-09-30，与 src/data/pillows-taxonomy.ts 注册表手动同步；
  // down 无产品不生成页面，不入 sitemap；pillow-cases 同日移除——8 款枕套全站隐藏）
  { loc: '/pillows/bed-pillows/', priority: '0.7', changefreq: 'weekly' },
  { loc: '/pillows/decorative-pillows/', priority: '0.7', changefreq: 'weekly' },
  { loc: '/pillows/down-alternative/', priority: '0.7', changefreq: 'weekly' },
  // Cushions 二级 PLP（2026-10-23 用户定：原 corduroy/solids/prints 三风格页下线，合并为单页）
  { loc: '/cushions/outdoor-cushions/', priority: '0.7', changefreq: 'weekly' },
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
