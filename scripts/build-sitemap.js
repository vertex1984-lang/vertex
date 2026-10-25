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
// 2026-09-30 用户定：隐藏产品（4 款天鹅绒充气颈枕 + 8 款枕套）不入 sitemap
// 2026-10-16 用户定：1688-916370884976 水洗棉撞色三件套全家族（C5–C9）也不入
// （与 src/data/products.ts 的 HIDDEN_HANDLE_PREFIXES / HIDDEN_HANDLES 同步）
const HIDDEN_HANDLES = new Set([
  'textured-geometric-embossed-pillowcases-set-of-2-soft-b0gjlvmht7',
  'makimoo-embossed-microfiber-pillow-covers-50-x-70-cm-set-of-b0gjlp59k1',
  'makimoo-embossed-pillowcases-set-of-2-ultra-soft-breathable-b0gjlnmx2g',
  'makimoo-embossed-microfiber-pillowcases-set-of-2-soft-b0gjlp4pr2',
  'makimoo-embossed-pillowcases-2-pack-soft-textured-pillow-b0gjlmc6z4',
  'makimoo-embossed-microfibre-pillowcases-40-x-80-cm-set-of-2-b0gjlgxtl4',
  'set-of-2-pillowcases-40-x-80-cm-soft-durable-skin-friendly-b0gjlgm6xg',
  'makimoo-embossed-pillow-cases-set-of-2-luxury-soft-brushed-b0gjldwt6x',
  // 2026-10-17 用户定：DUVSET Butter Yellow / Dill Green 两色下架，不入 sitemap
  'makimoo-twin-duvet-cover-set-3-piece-soft-brushed-duvset-butter-twin',
  'makimoo-full-duvet-cover-set-3-piece-soft-brushed-duvset-butter-full',
  'makimoo-queen-duvet-cover-set-3-piece-soft-brushed-duvset-butter-queen',
  'makimoo-king-duvet-cover-set-3-piece-soft-brushed-duvset-butter-king',
  'makimoo-twin-duvet-cover-set-3-piece-soft-brushed-duvset-dill-twin',
  'makimoo-full-duvet-cover-set-3-piece-soft-brushed-duvset-dill-full',
  'makimoo-queen-duvet-cover-set-3-piece-soft-brushed-duvset-dill-queen',
  'makimoo-king-duvet-cover-set-3-piece-soft-brushed-duvset-dill-king',
  // 2026-10-23 用户定：b0-seat-cushions 变体族（藤编/簇绒花色座垫 12 色）整族下架，不入 sitemap
  '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0c4b9t6jv',
  '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0c4bbvs53',
  '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0c4bc7q4s',
  '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0c4bcd4dy',
  '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0c4bd7q5x',
  '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0c4bdllfk',
  '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0cjhx7xkl',
  '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0cj8tjl56',
  '2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0cjhslcz5',
  'indoor-outdoor-square-tufted-seat-cushions-set-of-2-with-b0gd81wt1b',
  'set-of-2-tufted-outdoor-chair-cushions-with-ties-square-b0gd84d8vc',
  'makimoo-chair-cushions-set-of-2-oil-painting-floral-seat-b0cjhl4lzp',
  // 2026-10-23 用户定：Neck Pillows 子类目整体下架（3 族 13 款），不入 sitemap
  'memory-foam-travel-pillow-neck-pillow-with-360-degree-head-s-b0bxckknn8',
  'memory-foam-travel-pillow-neck-pillow-with-360-degree-head-s-b0c2z9jrdm',
  'memory-foam-travel-pillow-neck-pillow-with-360-degree-head-s-b0c2z9pffk',
  'memory-foam-travel-pillow-neck-pillow-with-360-degree-head-s-b0c2zcxvx7',
  'travel-neck-pillow-top-memory-foam-pillow-for-head-support-i-b0bzcln57s',
  'travel-neck-pillow-top-memory-foam-pillow-for-head-support-i-b0bzcmdzns',
  'travel-neck-pillow-top-memory-foam-pillow-for-head-support-i-b0c8j237v3',
  'travel-neck-pillow-top-memory-foam-pillow-for-head-support-i-b0c8j292wf',
  'makimoo-memory-foam-travel-neck-pillow-violet-shell-case-1688-913882303732',
  'makimoo-memory-foam-travel-neck-pillow-sage-green-egg-case-1688-913882303732-c3',
  'makimoo-memory-foam-travel-neck-pillow-spring-pink-egg-case-1688-913882303732-c4',
  'makimoo-memory-foam-travel-neck-pillow-obsidian-grey-egg-case-1688-913882303732-c5',
  'makimoo-memory-foam-travel-neck-pillow-ivory-white-egg-case-1688-913882303732-c6',
  // 2026-10-23 用户定：Satin（ice silk 缎面）床品全站移除（2 族 24 款），与 products.ts 同步
  'luxurious-silky-cooling-ice-silk-duvet-cover-breathable-1688-1061371343572',
  'luxurious-silky-cooling-duvet-cover-for-hot-sleepers-smooth-1688-1061371343572-c2',
  'cooling-ice-silk-duvet-cover-silky-smooth-soft-breathable-1688-1061371343572-c3',
  'cooling-silk-touch-duvet-cover-breathable-silky-smooth-soft-1688-1061371343572-c4',
  'cooling-ice-silk-duvet-cover-breathable-smooth-solid-color-1688-1061371343572-c5',
  'cooling-ice-silk-duvet-cover-silky-breathable-solid-color-1688-1061371343572-c6',
  'cooling-ice-silk-duvet-cover-200-x-230-cm-silky-breathable-1688-1061371343572-c7',
  'cooling-ice-silk-duvet-cover-silky-breathable-solid-color-1688-1061371343572-c8',
  'cooling-silky-duvet-cover-breathable-smooth-bedding-cover-1688-1061371343572-c9',
  'cooling-ice-silk-duvet-cover-silky-breathable-solid-color-1688-1061371343572-c10',
  'cooling-ice-silk-duvet-cover-silky-breathable-solid-color-1688-1061371343572-c11',
  'luxury-soft-cooling-ice-silk-duvet-cover-silky-breathable-1688-1061371343572-c12',
  'cooling-ice-silk-duvet-cover-breathable-silky-smooth-solid-1688-1061371343572-c13',
  'cooling-ice-silk-duvet-cover-silky-breathable-solid-color-1688-1061371343572-c14',
  '1-piece-cooling-ice-silk-duvet-cover-silky-breathable-solid-1688-1061371343572-c15',
  'luxury-ice-silk-duvet-cover-cooling-silky-breathable-solid-1688-1061371343572-c16',
  'cooling-ice-silk-duvet-cover-smooth-breathable-silky-solid-1688-1061371343572-c17',
  'premium-cooling-ice-silk-duvet-cover-soft-silky-breathable-1688-1061371343572-c18',
  'cooling-ice-silk-duvet-cover-silky-breathable-quilt-cover-1688-1061371343572-c19',
  'cooling-ice-silk-duvet-cover-breathable-silky-smooth-1688-1061371343572-c20',
  'cooling-ice-silk-duvet-cover-solid-color-silky-breathable-1688-1061371343572-c21',
  'cooling-ice-silk-duvet-cover-breathable-silky-smooth-solid-1688-1061371343572-c22',
  'cooling-washed-ice-silk-dual-tone-duvet-cover-reversible-1688-1048207560416',
  'cooling-washed-ice-silk-dual-tone-quilt-cover-soft-1688-1048207560416-c2',
  // 2026-10-24 用户定：旧 14 个单独被套下架，与 products.ts 同步（LINEN3 五色已恢复重建，不再计 14 个）
  // 2026-10-24 用户定：LINEN3 五色 Queen 单独被套恢复重建，与 products.ts 同步移出排除清单
  'makimoo-washed-cotton-like-duvet-cover-only-gray-breathable-duvset-gray-duvet',
  'makimoo-washed-cotton-like-duvet-cover-only-pink-breathable-duvset-pink-duvet',
  'makimoo-washed-cotton-like-duvet-cover-only-beige-breathable-duvset-beige-duvet',
  'makimoo-washed-cotton-like-duvet-cover-only-white-breathable-duvset-white-duvet',
  // 2026-10-24 用户定：Petal / Stone 单独被套恢复重建，与 products.ts 同步移出排除清单
  'makimoo-cotton-percale-duvet-cover-only-coconut-milk-queen-percale-coconut-duvet',
  'makimoo-cotton-sateen-duvet-cover-only-olive-green-queen-sateen4-olive-duvet',
  'makimoo-cotton-percale-jacquard-wide-stripe-duvet-cover-only-dusty-blue-queen-percalejac-haze-duvet',
]);
const handles = [...new Set([...baseHandles, ...materialHandles])]
  .filter(
    (h) =>
      !h.startsWith('inflatable-travel-pillow-') &&
      !h.startsWith('comforter-set-3-pcs-washed-cotton-soft-breathable-skin-1688-916370884976') &&
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
