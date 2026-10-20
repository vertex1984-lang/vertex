/**
 * add-duvset-4colors.js — DUVSET 三件套新增 4 个治愈系配色（2026-10-17 用户定，幂等，可重复运行）
 * 16 个产品 = 4 色 × 4 尺寸（Twin/Full/Queen/King）。图复用 staging 四张色图（同图供 4 尺寸共用，
 * 2026-10-17 用户定：不生成新图）。颜色派生自 DUVSET-BEIGE-QUEEN 主图场景。
 * Shopify 侧由用户建品：SKU 须用同一口径 duvset-<color>-<size>（build-shopify-map.js SKU 兜底匹配，
 * 同 towel/boucle 惯例）；建品后重跑 build-shopify-map.js 完成关联。
 * 写入：products-materials.ts（MATERIALS_PRODUCTS 末尾）、materials-map.ts（MATERIALS_MAP 末尾）、
 *       variant-groups.ts（DUVSET 族追加 16 成员）、new-product-handles.ts（PDP v2 白名单）、
 *       specs-overrides.ts、short-titles.ts
 * 图片：public/images/staging/duvset-beige-queen-<color>-1x1.png → 1200x1200 webp(q82) →
 *       public/images/products/DUVSET-<COLOR>-<SIZE>/1.webp（已存在则跳过；先写 .tmp 再 rename）
 * 注意：products-materials.ts / materials-map.ts 为 sync-materials.js 自动生成文件，
 *       全量同步后需重跑本脚本恢复这些条目（同 add-mk-towels.js 惯例）
 * 用法: node scripts/add-duvset-4colors.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// ─── 产品定义 ──────────────────────────────────────────────────────────────
const COLORS = [
  { slug: 'beanred', name: 'Bean Red' },   // 豆沙红 #AE7A6F
  // 2026-10-17 用户定：butter / dill 两色已下架（变体移除 + 全站隐藏），
  // 勿加回本数组，否则重跑会重新注入 variant-groups.ts
  { slug: 'oat', name: 'Alpine Oat' },     // 阿尔卑斯燕麦 #E4D6BC
];
const SIZES = [
  // 尺寸口径与 DUVSET 既有成员一致（variant-groups.ts：cm；标题/bullets：in）
  { key: 'twin', name: 'Twin', inch: '68 x 88 in', pc: '20 x 26 in', cm: '170 x 220 cm', dims: [170, 220] },
  { key: 'full', name: 'Full', inch: '80 x 88 in', pc: '20 x 26 in', cm: '200 x 220 cm', dims: [200, 220] },
  { key: 'queen', name: 'Queen', inch: '88 x 88 in', pc: '20 x 30 in', cm: '220 x 220 cm', dims: [220, 220] },
  { key: 'king', name: 'King', inch: '104 x 90 in', pc: '20 x 36 in', cm: '260 x 220 cm', dims: [260, 220] },
];

const BULLETS = (colorName, s) =>
  `Luxuriously Soft Fabric: Crafted from premium brushed cotton-like fabric that feels gentle against skin, this breathable duvet cover set offers a cozy, lightweight sleep surface suitable for year-round comfort.\n\n` +
  `Secure Zipper Closure & Corner Ties: The hidden zipper design keeps your comforter neatly tucked in, while interior corner ties help prevent shifting and bunching for a smooth, tidy bed every night.\n\n` +
  `Complete ${s.name} 3-Piece Set: This bedding set includes 1 duvet cover (${s.inch}) and 2 pillowcases (${s.pc}), providing a coordinated, hotel-inspired look for your bedroom.\n\n` +
  `Wrinkle Resistant & Easy Care: The durable fabric resists wrinkles and fading, machine washes easily, and dries quickly, saving you time while maintaining a fresh, inviting appearance.\n\n` +
  `Warm Healing Tone: The muted ${colorName} shade brings a calm, cozy feel to the bedroom and blends effortlessly with modern, classic, or neutral décor.`;

const products = [];
for (const c of COLORS) {
  for (const s of SIZES) {
    const asin = `DUVSET-${c.slug.toUpperCase()}-${s.key.toUpperCase()}`;
    const asinLower = asin.toLowerCase();
    const title = `Makimoo ${s.name} Duvet Cover Set 3 Piece Soft Brushed Cotton-Like Breathable Lightweight All Season Wrinkle Resistant Bedding with Zipper Closure Corner Ties ${s.inch} (${c.name})`;
    products.push({
      asin, asinLower,
      title,
      shortTitle: `Cotton-Like Duvet Cover Set, 3 Piece, ${c.name}, ${s.name}`,
      handle: `makimoo-${s.key}-duvet-cover-set-3-piece-soft-brushed-duvset-${c.slug}-${s.key}`,
      bullets: BULLETS(c.name, s),
      sku: `duvset-${c.slug}-${s.key}`,
      images: [`/images/products/${asin}/1.webp`], // 单色单图：4 尺寸共用该色 staging 场景图（2026-10-17 用户定）
      whiteBg: [false], // 场景图打满图框
      color: c.name,
      size: s.cm,
      dims: s.dims,
      sizeName: s.name,
      colorSlug: c.slug,
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
      availableForSale: false, // 价格/库存由 Shopify 侧建品后经 shopify-map 关联（同 DUVSET 既有成员）
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

// ─── 3. variant-groups.ts：DUVSET 族追加 16 成员（幂等） ────────────────────
{
  const file = path.join(ROOT, 'src/data/variant-groups.ts');
  let s = fs.readFileSync(file, 'utf8');
  const anchor = "    id: 'DUVSET',";
  const gi = s.indexOf(anchor);
  if (gi < 0) { console.error('variant-groups.ts DUVSET 族未找到'); process.exit(1); }
  const closeIdx = s.indexOf('    ],', gi);
  if (closeIdx < 0) { console.error('variant-groups.ts DUVSET 族 members 末尾未找到'); process.exit(1); }
  const lines = [];
  for (const p of products) {
    if (s.includes(`asin: '${p.asinLower}'`)) continue;
    lines.push(`    { asin: '${p.asinLower}', handle: '${p.handle}', color: '${p.color}', size: '${p.size}' },`);
  }
  if (lines.length) {
    s = s.slice(0, closeIdx) + lines.join('\n') + '\n' + s.slice(closeIdx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`variant-groups.ts: DUVSET 族 +${lines.length} members`);
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
    s = s.slice(0, idx) + '  // 2026-10-17：DUVSET 三件套 4 个治愈系新色（4 色 × 4 尺寸）\n' + lines.join('\n') + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`new-product-handles.ts: +${lines.length} handles`);
}

// ─── 5. specs-overrides.ts：材质与尺寸（Washed Cotton-Like → 卡面 Brushed Cotton，同 duvet 惯例） ──
{
  const file = path.join(ROOT, 'src/data/specs-overrides.ts');
  let s = fs.readFileSync(file, 'utf8');
  const lines = [];
  for (const p of products) {
    if (s.includes(`"${p.asinLower}":`)) continue;
    lines.push(`  "${p.asinLower}": { material: "Washed Cotton-Like", dimensionsCm: [${p.dims.join(', ')}] },`);
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
    s = s.slice(0, idx) + '  // 2026-10-17：DUVSET 三件套 4 个治愈系新色（4 色 × 4 尺寸）\n' + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`short-titles.ts: +${lines.length} entries`);
}

// ─── 7. 图片转换：staging PNG → 1200x1200 webp（已存在则跳过） ─────────────
(async () => {
  const sharp = require('sharp');
  let converted = 0, skipped = 0;
  for (const c of COLORS) {
    const src = path.join(ROOT, 'public/images/staging', `duvset-beige-queen-${c.slug}-1x1.png`);
    if (!fs.existsSync(src)) { console.error(`缺源图: ${src}`); process.exit(1); }
    for (const sz of SIZES) {
      const asin = `DUVSET-${c.slug.toUpperCase()}-${sz.key.toUpperCase()}`;
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
