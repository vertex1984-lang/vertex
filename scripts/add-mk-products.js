/**
 * add-mk-products.js — 接入 2026-10-08 Shopify 新上的 21 个 MK- 自有产品（幂等，可重复运行）
 *  - 灯芯绒抱枕套 5 色 × 2 尺寸（MK-PC-CORD-*）、Cotton-like 抱枕套 5 色 × 2 尺寸（MK-PC-CTN-*）、长抱枕芯（MK-BP-INSERT-1PC）
 * 写入：products.ts（BASE_PRODUCTS 末尾）、materials-map.ts（MATERIALS_MAP 末尾）、
 *       variant-groups.ts（2 个颜色×尺寸族）、new-product-handles.ts（PDP v2 白名单）、specs-overrides.ts
 * 图片已就位 public/images/products/<ASIN>/{1..n}.webp（本脚本不处理图片）
 * 注意：materials-map.ts 为 sync-materials.js 自动生成文件，全量同步后需重跑本脚本恢复 MK 条目
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// ─── 产品定义 ──────────────────────────────────────────────────────────────
const CORD_BULLETS = (color, size) =>
  `Set of 2 Corduroy Covers: You receive two matching ${size} throw pillow covers in ${color}, ready to refresh your sofa, couch or bed.\n\nSoft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space.\n\nMuted Ins-Style Color: A low-saturation ${color} tone that layers beautifully with neutrals like cream, beige and warm brown.\n\nHidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.\n\nEasy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.`;
const CTN_BULLETS = (color, size) =>
  `Set of 2 Cotton-Like Covers: You receive two matching ${size} throw pillow covers in ${color}, ready to refresh your sofa, couch or bed.\n\nSoft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin.\n\nMuted Ins-Style Color: A low-saturation ${color} tone that layers beautifully with neutrals like sage, cream and soft grey.\n\nHidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.\n\nEasy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.`;
const BP_BULLETS =
  `Full-Body Support: The extra-long 137 x 51 cm (54 x 20 in) pillow cradles your body for side sleeping, lounging, reading or pregnancy support.\n\nSoft Breathable Fill: Generously filled with plush polyester fiber that balances softness and support and fluffs back easily.\n\nSmooth Brushed Shell: A soft brushed microfiber shell in clean white that fits any body pillow cover.\n\nVersatile Comfort: Ideal for beds, daybeds and sofas — use it as a hug pillow, backrest or leg support.\n\nEasy Care: Machine washable on a gentle cycle; tumble dry low to restore loft.`;

const FABRICS = [
  {
    code: 'cord', fabricLabel: 'Corduroy', material: 'Corduroy', bullets: CORD_BULLETS,
    titleOf: (color, size) => `Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, ${size} (${color})`,
    handleOf: (colorSlug, sizeSlug, asinLower) => `corduroy-pillow-covers-${colorSlug}-${sizeSlug}-${asinLower}`,
    colors: [
      { slug: 'caramel', name: 'Caramel', sku40: 'US-QHZREJ', sku45: 'US-TETRXU' },
      { slug: 'dustyrose', name: 'Dusty Rose', sku40: 'US-5P1JWN', sku45: 'US-CIMB73' },
      { slug: 'olive', name: 'Olive', sku40: 'US-67T6ZQ', sku45: 'US-34HUAI' },
      { slug: 'dustyblue', name: 'Dusty Blue', sku40: 'US-YZ2CYZ', sku45: 'US-4G54MG' },
      { slug: 'charcoal', name: 'Charcoal', sku40: 'US-MIFOBS', sku45: 'US-4ZHSCN' },
    ],
  },
  {
    code: 'ctn', fabricLabel: 'Cotton-Like', material: 'Cotton-Like', bullets: CTN_BULLETS,
    titleOf: (color, size) => `Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, ${size} (${color})`,
    handleOf: (colorSlug, sizeSlug, asinLower) => `cotton-like-pillow-covers-${colorSlug}-${sizeSlug}-${asinLower}`,
    colors: [
      { slug: 'sage', name: 'Sage', sku40: 'US-25LETQ', sku45: 'US-3TYCA1' },
      { slug: 'cream', name: 'Cream', sku40: 'US-GFYQU0', sku45: 'US-2IOPW0' },
      { slug: 'blush', name: 'Blush', sku40: 'US-Z32UHF', sku45: 'US-SJ3LDY' },
      { slug: 'dustyblue', name: 'Dusty Blue', sku40: 'US-FPIKAF', sku45: 'US-21EWYE' },
      { slug: 'lightgrey', name: 'Light Grey', sku40: 'US-OP3QEK', sku45: 'US-UX3P4A' },
    ],
  },
];
const SIZES = [
  { suffix: '', size: '40 x 40 cm', sizeSlug: '40x40', dims: [40, 40], skuKey: 'sku40' },
  { suffix: '-45', size: '45 x 45 cm', sizeSlug: '45x45', dims: [45, 45], skuKey: 'sku45' },
];
const PRICE_COVER = '19.99';
const PRICE_BP = '35.99';

// 展开为统一产品记录
const products = [];
for (const f of FABRICS) {
  for (const c of f.colors) {
    for (const s of SIZES) {
      const asin = `MK-PC-${f.code.toUpperCase()}-${c.slug.toUpperCase()}${s.suffix.toUpperCase()}`;
      const asinLower = asin.toLowerCase();
      const title = f.titleOf(c.name, s.size);
      products.push({
        asin, asinLower,
        title,
        handle: f.handleOf(c.slug, s.sizeSlug, asinLower),
        bullets: f.bullets(c.name, s.size),
        sku: c[s.skuKey],
        price: PRICE_COVER,
        images: [1, 2, 3].map((n) => `/images/products/${asin}/${n}.webp`),
        whiteBg: [false, false, false],
        group: `mk-pc-${f.code}`,
        color: c.name,
        size: s.size,
        dims: s.dims,
        material: f.material,
      });
    }
  }
}
products.push({
  asin: 'MK-BP-INSERT-1PC', asinLower: 'mk-bp-insert-1pc',
  title: 'Makimoo Long Body Pillow Insert, Soft Breathable Polyester Fiber Fill Rectangular Cushion for Bed Sofa Couch, 137 x 51 cm (White)',
  handle: 'long-body-pillow-insert-54x20-mk-bp-insert-1pc',
  bullets: BP_BULLETS,
  sku: 'US-66B80J',
  price: PRICE_BP,
  images: [1, 2, 3, 4].map((n) => `/images/products/MK-BP-INSERT-1PC/${n}.webp`),
  whiteBg: [false, false, false, false],
  group: null,
  color: 'White',
  size: '137 x 51 cm',
  dims: [137, 51],
  material: 'Polyester',
});

// ─── 1. products.ts：BASE_PRODUCTS 末尾追加 ────────────────────────────────
{
  const file = path.join(ROOT, 'src/data/products.ts');
  let s = fs.readFileSync(file, 'utf8');
  const entries = [];
  for (const p of products) {
    if (s.includes(`"asin": "${p.asin}"`)) continue;
    const descParas = p.bullets.split('\n\n');
    const entry = {
      id: `makimoo-${p.asin}`,
      asin: p.asin,
      title: p.title,
      handle: p.handle,
      description: descParas.join(' '),
      descriptionHtml: descParas.map((x) => `<p>${x}</p>`).join(''),
      productType: 'Pillows',
      tags: ['Pillows'],
      availableForSale: true,
      images: p.images.map((url) => ({ url, altText: p.title, width: 1200, height: 1200 })),
      priceRange: { minVariantPrice: { amount: p.price, currencyCode: 'USD' } },
      variants: [
        {
          id: `variant-${p.asin}`,
          title: 'Default Title',
          price: { amount: p.price, currencyCode: 'USD' },
          availableForSale: true,
          selectedOptions: [{ name: 'Title', value: 'Default Title' }],
        },
      ],
      amazonUrl: '',
    };
    entries.push('  ' + JSON.stringify(entry, null, 2).replace(/\n/g, '\n  '));
  }
  if (entries.length) {
    const anchor = /\r?\n\];\r?\n\r?\nimport \{ SHOPIFY_MAP \}/;
    if (!anchor.test(s)) { console.error('products.ts anchor not found'); process.exit(1); }
    s = s.replace(anchor, (m) => ',\n' + entries.join(',\n') + m.replace(/^,?\r?\n/, '\n'));
    // 上面 replace 把 ',' 前缀加到数组末元素后；修正：原最后是 "  }\r\n];" → 需 "  },\n<entries>\n];"
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`products.ts: +${entries.length} entries`);
}

// ─── 2. materials-map.ts：MATERIALS_MAP 末尾追加 ───────────────────────────
{
  const file = path.join(ROOT, 'src/data/materials-map.ts');
  let s = fs.readFileSync(file, 'utf8');
  const lines = [];
  for (const p of products) {
    if (s.includes(`"${p.asinLower}":`)) continue;
    const entry = {
      title: p.title,
      bullets: p.bullets,
      sku: p.sku,
      images: p.images,
      whiteBg: p.whiteBg,
    };
    lines.push(`  "${p.asinLower}": ${JSON.stringify(entry)},`);
  }
  if (lines.length) {
    // MATERIALS_MAP 对象在第一个 "\n};" 处结束（其后是 SITE_ONLY_WHITEBG）
    const idx = s.indexOf('\n};');
    if (idx < 0) { console.error('materials-map.ts anchor not found'); process.exit(1); }
    s = s.slice(0, idx) + '\n' + lines.join('\n') + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`materials-map.ts: +${lines.length} entries`);
}

// ─── 3. variant-groups.ts：两个颜色×尺寸族 ─────────────────────────────────
{
  const file = path.join(ROOT, 'src/data/variant-groups.ts');
  let s = fs.readFileSync(file, 'utf8');
  const blocks = [];
  for (const f of FABRICS) {
    const gid = `mk-pc-${f.code}`;
    if (s.includes(`id: '${gid}'`)) continue;
    const members = products
      .filter((p) => p.group === gid)
      .map((p) => `    { asin: '${p.asinLower}', handle: '${p.handle}', color: '${p.color}', size: '${p.size}' },`)
      .join('\n');
    blocks.push(`  // 2026-10-08：${f.fabricLabel} 装饰枕套（5 色 × 2 尺寸，MK- 自有产品）\n  {\n    id: '${gid}',\n    optionName: 'Color',\n    members: [\n${members}\n    ],\n  },`);
  }
  if (blocks.length) {
    const idx = s.indexOf('\n];');
    if (idx < 0) { console.error('variant-groups.ts anchor not found'); process.exit(1); }
    s = s.slice(0, idx) + '\n' + blocks.join('\n') + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`variant-groups.ts: +${blocks.length} groups`);
}

// ─── 4. new-product-handles.ts：PDP v2 白名单 ──────────────────────────────
{
  const file = path.join(ROOT, 'src/data/new-product-handles.ts');
  let s = fs.readFileSync(file, 'utf8');
  const lines = [];
  for (const p of products) {
    if (s.includes(`'${p.handle}'`)) continue;
    lines.push(`  '${p.handle}',`);
  }
  if (lines.length) {
    const idx = s.indexOf('\n]);');
    if (idx < 0) { console.error('new-product-handles.ts anchor not found'); process.exit(1); }
    s = s.slice(0, idx) + '  // 2026-10-08：MK- 自有产品（灯芯绒/Cotton-like 枕套 + 长抱枕芯）\n' + lines.join('\n') + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`new-product-handles.ts: +${lines.length} handles`);
}

// ─── 5. specs-overrides.ts：材质与尺寸 ─────────────────────────────────────
{
  const file = path.join(ROOT, 'src/data/specs-overrides.ts');
  let s = fs.readFileSync(file, 'utf8');
  const lines = [];
  for (const p of products) {
    if (s.includes(`"${p.asinLower}":`)) continue;
    lines.push(`  "${p.asinLower}": { material: "${p.material}", dimensionsCm: [${p.dims.join(', ')}] },`);
  }
  if (lines.length) {
    const idx = s.lastIndexOf('};');
    if (idx < 0) { console.error('specs-overrides.ts anchor not found'); process.exit(1); }
    s = s.slice(0, idx) + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`specs-overrides.ts: +${lines.length} entries`);
}

console.log('全部完成');
