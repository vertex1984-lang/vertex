/**
 * add-percale-6colors.js — Cotton Percale 三件套新面料线接入（2026-10-17 用户定，幂等，可重复运行）
 * 24 个产品 = 6 色 × 4 尺寸（Twin/Full/Queen/King）。每色一张场景主图（staging/percale-<color>-1x1.png，
 * 由 seeany-percale-6colors.js 生成，4 尺寸共用同色图，同 duvset 惯例）。
 * Shopify 侧由用户建品：SKU 须用同一口径 percale-<color>-<size>（build-shopify-map.js SKU 兜底匹配）；
 * 建品后重跑 build-shopify-map.js 完成关联。
 * 写入：products-materials.ts、materials-map.ts、variant-groups.ts（新增 PERCALE 族）、
 *       new-product-handles.ts、specs-overrides.ts（material "Cotton Percale"）、short-titles.ts
 * 配套代码改动（已手动落盘，不在本脚本）：bedding-families.ts classifySet 'percale-' → three +
 *       COLOR_LABELS 六色映射（卡标题 = "Cotton Percale Set, {颜色}"）
 * 注意：products-materials.ts / materials-map.ts 为 sync-materials.js 自动生成文件，
 *       全量同步后需重跑本脚本恢复这些条目（同 add-duvset-4colors.js 惯例）
 * 用法: node scripts/add-percale-6colors.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// ─── 产品定义 ──────────────────────────────────────────────────────────────
const COLORS = [
  { slug: 'sky',      name: 'Sky Blue' },     // 天空蓝 #B8C8D2
  { slug: 'mist',     name: 'Mist Grey' },    // 晨雾灰 #C6C7C2
  { slug: 'coconut',  name: 'Coconut Milk' }, // 椰奶白 #EDE7DB
  { slug: 'nude',     name: 'Nude Pink' },    // 裸粉 #E0C9BF
  { slug: 'euca',     name: 'Eucalyptus' },   // 桉叶绿 #B4BDAC
  { slug: 'lavender', name: 'Lavender Fog' }, // 雾紫 #C5BDC8
];
const SIZES = [
  // 尺寸口径与 DUVSET 既有成员一致（variant-groups.ts：cm；标题/bullets：in）
  { key: 'twin', name: 'Twin', inch: '68 x 88 in', pc: '20 x 26 in', cm: '170 x 220 cm', dims: [170, 220] },
  { key: 'full', name: 'Full', inch: '80 x 88 in', pc: '20 x 26 in', cm: '200 x 220 cm', dims: [200, 220] },
  { key: 'queen', name: 'Queen', inch: '88 x 88 in', pc: '20 x 30 in', cm: '220 x 220 cm', dims: [220, 220] },
  { key: 'king', name: 'King', inch: '104 x 90 in', pc: '20 x 36 in', cm: '260 x 220 cm', dims: [260, 220] },
];

const BULLETS = (colorName, s) =>
  `Crisp 100% Cotton Percale: Woven in a tight plain weave, this duvet cover set has the signature percale hand—matte, cool to the touch, and lightly structured—delivering that fresh, hotel-crisp feel that gets softer with every wash.\n\n` +
  `Secure Zipper Closure & Corner Ties: The hidden zipper design keeps your comforter neatly tucked in, while interior corner ties help prevent shifting and bunching for a smooth, tidy bed every night.\n\n` +
  `Complete ${s.name} 3-Piece Set: This bedding set includes 1 duvet cover (${s.inch}) and 2 pillowcases (${s.pc}), providing a coordinated, hotel-inspired look for your bedroom.\n\n` +
  `Breathable & Easy Care: The airy percale weave stays cool and comfortable year-round, machine washes easily, and is made to last—natural creases relax after a quick tumble or line dry.\n\n` +
  `Muted Healing Tone: The soft ${colorName} shade brings a calm, cozy feel to the bedroom and blends effortlessly with modern, classic, or neutral décor.`;

const products = [];
for (const c of COLORS) {
  for (const s of SIZES) {
    const asin = `PERCALE-${c.slug.toUpperCase()}-${s.key.toUpperCase()}`;
    const asinLower = asin.toLowerCase();
    const title = `Makimoo ${s.name} Duvet Cover Set 3 Piece 100% Cotton Percale Crisp Cool Breathable All Season Bedding with Zipper Closure Corner Ties ${s.inch} (${c.name})`;
    products.push({
      asin, asinLower,
      title,
      shortTitle: `Cotton Percale Duvet Cover Set, 3 Piece, ${c.name}, ${s.name}`,
      handle: `makimoo-${s.key}-duvet-cover-set-3-piece-cotton-percale-${c.slug}-${s.key}`,
      bullets: BULLETS(c.name, s),
      sku: `percale-${c.slug}-${s.key}`,
      images: [`/images/products/${asin}/1.webp`], // 单色单图：4 尺寸共用该色 staging 场景图（同 duvset 惯例）
      whiteBg: [false], // 场景图打满图框
      color: c.name,
      size: s.cm,
      dims: s.dims,
    });
  }
}

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
      productType: 'Bedding',
      tags: ['Bedding'],
      availableForSale: false, // 价格/库存由 Shopify 侧建品后经 shopify-map 关联（同 DUVSET 惯例）
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

// ─── 3. variant-groups.ts：新增 PERCALE 族（24 成员，幂等） ─────────────────
{
  const file = path.join(ROOT, 'src/data/variant-groups.ts');
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes("id: 'PERCALE'")) {
    console.log('variant-groups.ts: PERCALE 族已存在，跳过');
  } else {
    const idx = s.lastIndexOf('];');
    if (idx < 0) { console.error('variant-groups.ts anchor not found'); process.exit(1); }
    const members = products
      .map((p) => `    { asin: '${p.asinLower}', handle: '${p.handle}', color: '${p.color}', size: '${p.size}' },`)
      .join('\n');
    const block =
      `  {\n` +
      `    id: 'PERCALE',\n` +
      `    optionName: 'Size',\n` +
      `    // Cotton Percale 三件套（6 色 × 4 尺寸，2026-10-17 用户定）\n` +
      `    members: [\n${members}\n    ],\n` +
      `  },\n`;
    s = s.slice(0, idx) + block + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
    console.log('variant-groups.ts: 新增 PERCALE 族 24 members');
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
    s = s.slice(0, idx) + '  // 2026-10-17：Cotton Percale 三件套（6 色 × 4 尺寸）\n' + lines.join('\n') + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`new-product-handles.ts: +${lines.length} handles`);
}

// ─── 5. specs-overrides.ts：材质与尺寸（Cotton Percale，卡面同名展示） ──────
{
  const file = path.join(ROOT, 'src/data/specs-overrides.ts');
  let s = fs.readFileSync(file, 'utf8');
  const lines = [];
  for (const p of products) {
    if (s.includes(`"${p.asinLower}":`)) continue;
    lines.push(`  "${p.asinLower}": { material: "Cotton Percale", dimensionsCm: [${p.dims.join(', ')}] },`);
  }
  if (lines.length) {
    const idx = s.lastIndexOf('};');
    if (idx < 0) { console.error('specs-overrides.ts anchor not found'); process.exit(1); }
    s = s.slice(0, idx) + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`specs-overrides.ts: +${lines.length} entries`);
}

// ─── 6. short-titles.ts：短标题（格式同 duvset 既有成员） ────────────────────
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
    s = s.slice(0, idx) + '  // 2026-10-17：Cotton Percale 三件套（6 色 × 4 尺寸）\n' + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`short-titles.ts: +${lines.length} entries`);
}

// ─── 7. 图片转换：staging PNG → 1200x1200 webp（已存在则跳过） ─────────────
(async () => {
  const sharp = require('sharp');
  let converted = 0, skipped = 0, missing = 0;
  for (const c of COLORS) {
    const src = path.join(ROOT, 'public/images/staging', `percale-${c.slug}-1x1.png`);
    if (!fs.existsSync(src)) { console.error(`缺源图（先生成）: ${src}`); missing++; continue; }
    for (const sz of SIZES) {
      const asin = `PERCALE-${c.slug.toUpperCase()}-${sz.key.toUpperCase()}`;
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
  if (missing) { console.error(`有 ${missing} 色缺源图，数据已写入但图片未转`); process.exit(1); }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
