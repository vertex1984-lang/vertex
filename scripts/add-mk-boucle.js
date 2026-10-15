/**
 * add-mk-boucle.js — 接入 2026-10-13 Shopify 新上的泰迪绒（Bouclé）抱枕套 4 色 × 40/45cm（幂等，可重复运行）
 * Shopify 侧现状：8 个独立产品（45cm：boucle-pillow-white/oatmeal/dusty-rose/sage；
 * 40cm：boucle-pillow-*-4040），$19.99，Set of 2，
 * 无 ASIN tag、SKU 为 boucle-pillow-* —— 靠 materials-map 的 sku 兜底匹配（build-shopify-map.js SKU fallback）。
 * ASIN 口径同 CORD 惯例：40cm 无后缀（MK-PC-BOUCLE-<COLOR>），45cm 带 -45 后缀。
 * 写入：products.ts（BASE_PRODUCTS 末尾）、materials-map.ts（MATERIALS_MAP 末尾）、
 *       variant-groups.ts（mk-pc-boucle 颜色族）、new-product-handles.ts（PDP v2 白名单）、specs-overrides.ts
 * 图片已就位 public/images/products/MK-PC-BOUCLE-<COLOR>[-45]/1.webp（本脚本不处理图片）
 * 注意：materials-map.ts 为 sync-materials.js 自动生成文件，全量同步后需重跑本脚本恢复 MK 条目
 * 用法: node scripts/add-mk-boucle.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// ─── 产品定义 ──────────────────────────────────────────────────────────────
const BOUCLE_BULLETS = (color, size) =>
  `Set of 2 Boucle Covers: You receive two matching ${size} throw pillow covers in ${color}, ready to refresh your sofa, couch or bed.\n\nSoft Teddy Boucle Fabric: A plush boucle (teddy fleece) fabric with a cozy curled texture that adds warmth and depth to any space.\n\nMuted Ins-Style Color: A low-saturation ${color} tone that layers beautifully with neutrals like cream, beige and warm brown.\n\nHidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.\n\nEasy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.`;

const SIZES = [
  { suffix: '', shopifySuffix: '-4040', size: '40 x 40 cm', sizeSlug: '40x40', dims: [40, 40] },
  { suffix: '-45', shopifySuffix: '', size: '45 x 45 cm', sizeSlug: '45x45', dims: [45, 45] },
];
const PRICE = '19.99';
const COLORS = [
  { slug: 'white', name: 'White' },
  { slug: 'oatmeal', name: 'Oatmeal' },
  { slug: 'dustyrose', name: 'Dusty Rose' },
  { slug: 'sage', name: 'Sage' },
];

const products = [];
for (const c of COLORS) {
  for (const s of SIZES) {
    const asin = `MK-PC-BOUCLE-${c.slug.toUpperCase()}${s.suffix.toUpperCase()}`;
    const asinLower = asin.toLowerCase();
    const title = `Makimoo Boucle Throw Pillow Covers Set of 2, Soft Teddy Fleece Square Cushion Cases for Sofa Couch Bed, ${s.size} (${c.name})`;
    products.push({
      asin, asinLower,
      title,
      handle: `boucle-pillow-covers-${c.slug}-${s.sizeSlug}-${asinLower}`,
      bullets: BOUCLE_BULLETS(c.name, s.size),
      sku: `boucle-pillow-${c.slug === 'dustyrose' ? 'dusty-rose' : c.slug}${s.shopifySuffix}`,
      price: PRICE,
      images: [1].map((n) => `/images/products/${asin}/${n}.webp`),
      whiteBg: [false],
      group: 'mk-pc-boucle',
      color: c.name,
      size: s.size,
      dims: s.dims,
      material: 'Boucle',
    });
  }
}

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
    const idx = s.indexOf('\n};');
    if (idx < 0) { console.error('materials-map.ts anchor not found'); process.exit(1); }
    s = s.slice(0, idx) + '\n' + lines.join('\n') + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`materials-map.ts: +${lines.length} entries`);
}

// ─── 3. variant-groups.ts：mk-pc-boucle 颜色族（幂等：缺成员则整族重建） ─────
{
  const file = path.join(ROOT, 'src/data/variant-groups.ts');
  let s = fs.readFileSync(file, 'utf8');
  const gid = 'mk-pc-boucle';
  const members = products
    .map((p) => `    { asin: '${p.asinLower}', handle: '${p.handle}', color: '${p.color}', size: '${p.size}' },`)
    .join('\n');
  const block = `  // 2026-10-13：Bouclé 泰迪绒装饰枕套（4 色 × 40/45cm，MK- 自有产品）\n  {\n    id: '${gid}',\n    optionName: 'Color',\n    members: [\n${members}\n    ],\n  },`;
  if (!s.includes(`id: '${gid}'`)) {
    const idx = s.indexOf('\n];');
    if (idx < 0) { console.error('variant-groups.ts anchor not found'); process.exit(1); }
    s = s.slice(0, idx) + '\n' + block + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
    console.log('variant-groups.ts: +1 group');
  } else if (products.some((p) => !s.includes(`asin: '${p.asinLower}'`))) {
    // 族已存在但缺成员（如新增尺寸）：整族块替换重建
    const re = new RegExp(`  // [^\\n]*\\n  \\{\\n    id: '${gid}',[\\s\\S]*?\\n  \\},`);
    if (!re.test(s)) { console.error('variant-groups.ts 族块定位失败'); process.exit(1); }
    s = s.replace(re, block);
    fs.writeFileSync(file, s, 'utf8');
    console.log('variant-groups.ts: 族已重建（补齐成员）');
  } else {
    console.log('variant-groups.ts: 已存在且成员齐全，跳过');
  }
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
    s = s.slice(0, idx) + '  // 2026-10-13：MK- 自有产品（Bouclé 泰迪绒枕套 4 色 × 45cm）\n' + lines.join('\n') + s.slice(idx);
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
