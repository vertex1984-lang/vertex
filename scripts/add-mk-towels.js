/**
 * add-mk-towels.js — 接入 Makimoo 自有长绒棉毛巾（2026-10-16，幂等，可重复运行）
 * 24 个产品 = 6 色 × 4 尺寸（12x12 washcloth / 20x30 hand towel / 30x56 bath towel / 40x70 bath sheet）。
 * Shopify 侧尚未建品；建品时 SKU 须用同一口径 lsc-towel-<color>-<sizekey>，
 * 靠 materials-map 的 sku 兜底匹配（build-shopify-map.js SKU fallback，同 boucle 惯例）。
 * ASIN 口径：MK-TOWEL-LSC-<COLOR>-<SIZEKEY>（products.ts 大写，其余文件 key 小写）。
 * 写入：products.ts（BASE_PRODUCTS 末尾）、materials-map.ts（MATERIALS_MAP 末尾）、
 *       variant-groups.ts（mk-towel-lsc 颜色×尺寸族）、new-product-handles.ts（PDP v2 白名单）、
 *       specs-overrides.ts、short-titles.ts
 * 图片：public/images/staging/towel-lsc-<color>-main.png → 1200x1200 webp(q82) →
 *       public/images/products/MK-TOWEL-LSC-<COLOR>-<SIZEKEY>/1.webp（同色 4 尺寸共用一张，
 *       已存在则跳过；Windows 上 sharp 就地覆写会 EPERM，先写 .tmp 再 rename）
 * 注意：materials-map.ts 为 sync-materials.js 自动生成文件，全量同步后需重跑本脚本恢复 MK 条目
 * 用法: node scripts/add-mk-towels.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// ─── 产品定义 ──────────────────────────────────────────────────────────────
const COLORS = [
  { slug: 'cream', name: 'Cream' },
  { slug: 'oatmeal', name: 'Oatmeal' },
  { slug: 'sage', name: 'Sage' },
  { slug: 'dustyrose', name: 'Dusty Rose' },
  { slug: 'lightgrey', name: 'Light Grey' },
  { slug: 'dustyblue', name: 'Dusty Blue' },
];
const SIZES = [
  // 价格 2026-10-16 用户定价（与 Shopify CSV 一致）
  { key: '12x12', inch: '12" x 12"', type: 'washcloth', dims: [30, 30], price: '12.99' },
  { key: '20x30', inch: '20" x 30"', type: 'hand towel', dims: [51, 76], price: '26.99' },
  { key: '30x56', inch: '30" x 56"', type: 'bath towel', dims: [76, 142], price: '44.99' },
  { key: '40x70', inch: '40" x 70"', type: 'bath sheet', dims: [102, 178], price: '69.99' },
];

const TOWEL_BULLETS = (colorName, s) => {
  const Type = s.type.charAt(0).toUpperCase() + s.type.slice(1);
  return `One ${Type} Per Pack: This listing includes one ${s.inch} ${s.type} in ${colorName} — a single towel, not a multi-piece set.\n\nLong-Staple Cotton Terry: Woven from long-staple cotton, the plush looped terry feels soft against the skin and soaks up water quickly.\n\nSubstantial 400 g/m² Weave: The dense 400 grams-per-square-meter terry gives the towel a plush, hotel-like hand feel.\n\nMuted Ins-Style Color: A low-saturation ${colorName} tone that layers easily with white, cream and natural bathroom decor.\n\nEasy Care: Machine washable and tumble dry low; the terry gets softer with every wash. Wash before first use.`;
};

const products = [];
for (const c of COLORS) {
  for (const s of SIZES) {
    const asin = `MK-TOWEL-LSC-${c.slug.toUpperCase()}-${s.key.toUpperCase()}`;
    const asinLower = asin.toLowerCase();
    products.push({
      asin, asinLower,
      title: `Makimoo Long-Staple Cotton Towel ${s.inch} (${c.name})`,
      shortTitle: `Long-Staple Cotton Towel, ${s.inch} - ${c.name}`,
      handle: `long-staple-cotton-towel-${c.slug}-${s.key}-${asinLower}`,
      bullets: TOWEL_BULLETS(c.name, s),
      sku: `lsc-towel-${c.slug}-${s.key}`,
      price: s.price,
      images: [`/images/products/${asin}/1.webp`],
      whiteBg: [false], // 灰底棚拍图打满图框，不做白底内边距处理
      color: c.name,
      size: s.inch,
      dims: s.dims,
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
      productType: 'Towels',
      tags: ['Towels'],
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

// ─── 3. variant-groups.ts：mk-towel-lsc 颜色×尺寸族（幂等：缺成员则整族重建） ─────
{
  const file = path.join(ROOT, 'src/data/variant-groups.ts');
  let s = fs.readFileSync(file, 'utf8');
  const gid = 'mk-towel-lsc';
  const members = products
    .map((p) => `    { asin: '${p.asinLower}', handle: '${p.handle}', color: '${p.color}', size: '${p.size}' },`)
    .join('\n');
  const block = `  // 2026-10-16：长绒棉毛巾（6 色 × 4 尺寸，MK- 自有产品，尺寸段为英寸字符串）\n  {\n    id: '${gid}',\n    optionName: 'Color',\n    members: [\n${members}\n    ],\n  },`;
  if (!s.includes(`id: '${gid}'`)) {
    const idx = s.indexOf('\n];');
    if (idx < 0) { console.error('variant-groups.ts anchor not found'); process.exit(1); }
    s = s.slice(0, idx) + '\n' + block + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
    console.log('variant-groups.ts: +1 group');
  } else if (products.some((p) => !s.includes(`asin: '${p.asinLower}'`))) {
    // 族已存在但缺成员：整族块替换重建
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
    s = s.slice(0, idx) + '  // 2026-10-16：MK- 自有产品（长绒棉毛巾 6 色 × 4 尺寸）\n' + lines.join('\n') + s.slice(idx);
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
    lines.push(`  "${p.asinLower}": { material: "100% Long-Staple Cotton", dimensionsCm: [${p.dims.join(', ')}] },`);
  }
  if (lines.length) {
    const idx = s.lastIndexOf('};');
    if (idx < 0) { console.error('specs-overrides.ts anchor not found'); process.exit(1); }
    s = s.slice(0, idx) + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`specs-overrides.ts: +${lines.length} entries`);
}

// ─── 6. short-titles.ts：短标题（格式同 mk-pc-cord-*：{面料} Towel, {W}" x {L}" - {颜色}） ──
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
    s = s.slice(0, idx) + '  // 2026-10-16：MK- 自有长绒棉毛巾短标题（6 色 × 4 尺寸）\n' + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`short-titles.ts: +${lines.length} entries`);
}

// ─── 7. 图片转换：staging PNG → 1200x1200 webp（已存在则跳过） ─────────────
(async () => {
  const sharp = require('sharp');
  let converted = 0, skipped = 0;
  for (const c of COLORS) {
    const src = path.join(ROOT, 'public/images/staging', `towel-lsc-${c.slug}-main.png`);
    if (!fs.existsSync(src)) { console.error(`缺源图: ${src}`); process.exit(1); }
    for (const sz of SIZES) {
      const asin = `MK-TOWEL-LSC-${c.slug.toUpperCase()}-${sz.key.toUpperCase()}`;
      const dir = path.join(ROOT, 'public/images/products', asin);
      const out = path.join(dir, '1.webp');
      if (fs.existsSync(out)) { skipped++; continue; }
      fs.mkdirSync(dir, { recursive: true });
      const tmp = out + '.tmp';
      await sharp(src).resize(1200, 1200).webp({ quality: 82 }).toFile(tmp);
      fs.renameSync(tmp, out);
      converted++;
    }
  }
  console.log(`images: +${converted} webp（跳过已存在 ${skipped}）`);
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
