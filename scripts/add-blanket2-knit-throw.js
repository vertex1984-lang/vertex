/**
 * add-blanket2-knit-throw.js — blanket/2 北欧镂空针织毯产品线接入（2026-10-19 用户定，幂等）
 * 产品内容来源：C:\Users\12021\Desktop\blanket\2 下的 1688 页面 HTML
 *   标题：北欧沙发毯盖毯针织毛毯民宿酒店扔毯床尾巾镂空毛毯床尾毯搭毯
 *   材质：腈纶（Acrylic）；克重 500-799g；图案：纯色；四季通用
 *   尺寸：127 x 180 cm（含流苏，≈ 50 x 71 in）；颜色：米白/浅灰/卡其/粉色
 * 4 个产品 = 4 色 × 单尺寸；主图 = staging/blanket2-<color>-scene-1x1.png（seeany-blanket-2.js 定稿）
 * Shopify 侧由用户建品：SKU 口径 knit-throw-<color>（build-shopify-map.js SKU 兜底匹配）
 * 写入：products-materials.ts、materials-map.ts、variant-groups.ts（新增 KNIT-THROW 族，optionName Color）、
 *       new-product-handles.ts、specs-overrides.ts（material "Acrylic"）、short-titles.ts
 * 用法: node scripts/add-blanket2-knit-throw.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// ─── 产品定义 ──────────────────────────────────────────────────────────────
const SIZE_CM = '127 x 180 cm';
const SIZE_IN = '50 x 71 in';
const COLORS = [
  { slug: 'cream', name: 'Cream White' },  // 米白
  { slug: 'grey',  name: 'Light Grey' },   // 浅灰
  { slug: 'khaki', name: 'Khaki' },        // 卡其
  { slug: 'pink',  name: 'Dusty Pink' },   // 粉色
];

const BULLETS = (colorName) =>
  `Openwork Knit Design: Alternating slim ribbed bands and wide herringbone openwork stripes give this throw its airy, handcrafted look—delicate to the eye, yet knitted to hold its shape through everyday use.\n\n` +
  `Soft & Lightweight Acrylic: Woven from soft acrylic yarn (500-799g), this blanket feels gentle and cozy without weighing you down—comfortable across all four seasons, from summer naps to winter layering.\n\n` +
  `Generous Size with Tassels: Measuring ${SIZE_IN} (${SIZE_CM}) including the tassel fringe, it drapes beautifully over a sofa arm, across the foot of a bed, or around your shoulders on a cool evening.\n\n` +
  `Versatile Nordic Accent: The quiet ${colorName} tone and textured stripes blend effortlessly with modern, farmhouse, or neutral décor—use it as a couch throw, bed-end runner, nap blanket, or reading companion.\n\n` +
  `Easy Everyday Care: Machine washable on a gentle cycle; the knit keeps its texture and color wash after wash, and the tassels stay neat with a quick reshape while damp.`;

const products = COLORS.map((c) => {
  const asin = `KNITTHROW-${c.slug.toUpperCase()}`;
  const asinLower = asin.toLowerCase();
  return {
    asin, asinLower,
    title: `Makimoo Openwork Knit Throw Blanket with Tassels, Soft Lightweight Acrylic Nordic Decorative Blanket for Couch Sofa and Bed End, ${SIZE_IN} (${c.name})`,
    shortTitle: `Openwork Knit Throw Blanket, ${c.name}`,
    handle: `makimoo-openwork-knit-throw-blanket-with-tassels-50-x-71-in-${c.slug}`,
    bullets: BULLETS(c.name),
    sku: `knit-throw-${c.slug}`,
    images: [`/images/products/${asin}/1.webp`],
    whiteBg: [false], // 场景图打满图框
    color: c.name,
    size: SIZE_CM,
    dims: [127, 180],
  };
});

// ─── 1. products-materials.ts：MATERIALS_PRODUCTS 末尾追加 ─────────────────
{
  const file = path.join(ROOT, 'src/data/products-materials.ts');
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
      productType: 'Blankets',
      tags: ['Blankets'],
      availableForSale: false, // 价格/库存由 Shopify 侧建品后经 shopify-map 关联（同 PERCALE 惯例）
      images: p.images.map((url) => ({ url, altText: p.title, width: 1200, height: 1200 })),
      priceRange: { minVariantPrice: { amount: '0.00', currencyCode: 'USD' } },
      variants: [
        {
          id: `variant-${p.asin}`,
          title: 'Default Title',
          price: { amount: '0.00', currencyCode: 'USD' },
          availableForSale: false,
          selectedOptions: [],
        },
      ],
      amazonUrl: '',
    };
    entries.push('  ' + JSON.stringify(entry, null, 2).replace(/\n/g, '\n  '));
  }
  if (entries.length) {
    const idx = s.lastIndexOf('];');
    if (idx < 0) { console.error('products-materials.ts anchor not found'); process.exit(1); }
    s = s.slice(0, idx) + entries.join(',\n') + ',\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`products-materials.ts: +${entries.length} entries`);
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

// ─── 3. variant-groups.ts：新增 KNIT-THROW 族（4 成员，幂等；lone-\r 行尾文件，按 \r 处理） ─
{
  const file = path.join(ROOT, 'src/data/variant-groups.ts');
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes("id: 'KNIT-THROW'")) {
    console.log('variant-groups.ts: KNIT-THROW 族已存在，跳过');
  } else {
    const idx = s.lastIndexOf('];');
    if (idx < 0) { console.error('variant-groups.ts anchor not found'); process.exit(1); }
    const members = products
      .map((p) => `    { asin: '${p.asinLower}', handle: '${p.handle}', color: '${p.color}', size: '${p.size}' },`)
      .join('\r');
    const block =
      `  {\r` +
      `    id: 'KNIT-THROW',\r` +
      `    optionName: 'Color',\r` +
      `    // 北欧镂空针织毯（4 色 × 单尺寸 127x180cm 含流苏，2026-10-19 用户定，blanket/2）\r` +
      `    members: [\r${members}\r    ],\r` +
      `  },\r`;
    s = s.slice(0, idx) + block + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
    console.log('variant-groups.ts: 新增 KNIT-THROW 族 4 members');
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
    s = s.slice(0, idx) + '  // 2026-10-19：北欧镂空针织毯（4 色 × 单尺寸，blanket/2）\n' + lines.join('\n') + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`new-product-handles.ts: +${lines.length} handles`);
}

// ─── 5. specs-overrides.ts：材质与尺寸（Acrylic） ────────────────────────────
{
  const file = path.join(ROOT, 'src/data/specs-overrides.ts');
  let s = fs.readFileSync(file, 'utf8');
  const lines = [];
  for (const p of products) {
    if (s.includes(`"${p.asinLower}":`)) continue;
    lines.push(`  "${p.asinLower}": { material: "Acrylic", dimensionsCm: [${p.dims.join(', ')}] },`);
  }
  if (lines.length) {
    const idx = s.lastIndexOf('};');
    if (idx < 0) { console.error('specs-overrides.ts anchor not found'); process.exit(1); }
    s = s.slice(0, idx) + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`specs-overrides.ts: +${lines.length} entries`);
}

// ─── 6. short-titles.ts：短标题 ──────────────────────────────────────────────
{
  const file = path.join(ROOT, 'src/data/short-titles.ts');
  let s = fs.readFileSync(file, 'utf8');
  const lines = [];
  for (const p of products) {
    if (s.includes(`"${p.asinLower}":`)) continue;
    lines.push(`  "${p.asinLower}": ${JSON.stringify(p.shortTitle)},`);
  }
  if (lines.length) {
    const idx = s.lastIndexOf('};');
    if (idx < 0) { console.error('short-titles.ts anchor not found'); process.exit(1); }
    s = s.slice(0, idx) + '  // 2026-10-19：北欧镂空针织毯（4 色，blanket/2）\n' + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`short-titles.ts: +${lines.length} entries`);
}

// ─── 7. 图片转换：staging PNG → 1200x1200 webp（已存在则跳过） ─────────────
(async () => {
  const sharp = require('sharp');
  let converted = 0, skipped = 0, missing = 0;
  for (const c of COLORS) {
    const src = path.join(ROOT, 'public/images/staging', `blanket2-${c.slug}-scene-1x1.png`);
    if (!fs.existsSync(src)) { console.error(`缺源图（先生成）: ${src}`); missing++; continue; }
    const asin = `KNITTHROW-${c.slug.toUpperCase()}`;
    const dir = path.join(ROOT, 'public/images/products', asin);
    const out = path.join(dir, '1.webp');
    if (fs.existsSync(out)) { skipped++; continue; }
    fs.mkdirSync(dir, { recursive: true });
    const tmp = out + '.tmp';
    await sharp(src).resize(1200, 1200).webp({ quality: 82 }).toFile(tmp);
    fs.renameSync(tmp, out);
    converted++;
  }
  console.log(`images: +${converted} webp（跳过已存在 ${skipped}）`);
  if (missing) { console.error(`有 ${missing} 色缺源图，数据已写入但图片未转`); process.exit(1); }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
