/**
 * add-microfiber-pillows.js — Microfiber 床枕新品接入（2026-10-18 用户定，幂等，可重复运行）
 * 3 个产品 = 3 尺寸（Standard/Queen/King），替代原 b0-inserts-rect 族（50x70 / 40x80 同步全站隐藏，
 * 隐藏动作在 products.ts HIDDEN_HANDLES 手动落盘，不在本脚本）。
 * 填充：microfiber（down alternative）；枕套：polyester 光面。
 * 每 SKU 两图：1.webp = staging/microfiber-pillow-main-1x1.png（灰底双枕平叠，变体共用），
 *             2.webp = staging/microfiber-pillow-filling-1x1.png（纤维棉特写，变体共用）。
 * 尺寸口径同 down 线：Standard 20x26 in (51x66 cm) / Queen 20x30 in (51x76 cm) / King 20x36 in (51x91 cm)。
 * Shopify 侧由用户建品：SKU = microfiber-pillow-<size>（build-shopify-map.js SKU 兜底匹配）。
 * 写入：products-materials.ts、materials-map.ts、variant-groups.ts（MICROFIBER-PILLOW 族）、
 *       new-product-handles.ts、specs-overrides.ts、short-titles.ts
 * 注意：图片位次配套 scripts/insert-pillow-seed-image.js（2=种草图 3=填充图），重跑本脚本后需再跑一次它；
 *       products-materials.ts / materials-map.ts 为 sync-materials.js 自动生成文件，
 *       全量同步后需重跑本脚本恢复这些条目（同 add-percale-6colors.js 惯例）
 * 用法: node scripts/add-microfiber-pillows.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const SIZES = [
  { key: 'standard', name: 'Standard', inch: '20 x 26 in', cm: '51 x 66 cm', dims: [51, 66] },
  { key: 'queen', name: 'Queen', inch: '20 x 30 in', cm: '51 x 76 cm', dims: [51, 76] },
  { key: 'king', name: 'King', inch: '20 x 36 in', cm: '51 x 91 cm', dims: [51, 91] },
];

const bulletsOf = (s) =>
  `Plush Microfiber Fill: Generously filled with silky microfiber clusters, these pillows deliver a soft, fluffy loft that mimics the feel of down—hypoallergenic and easy to live with.\n\n` +
  `Smooth Polyester Cover: A soft, brushed-smooth polyester shell keeps the fill evenly distributed and stands up to everyday use and frequent washing.\n\n` +
  `Set of 2, ${s.name} Size: Each pillow measures ${s.inch} (${s.cm}), a ready-to-pair set that outfits your bed with plush, hotel-inspired comfort.\n\n` +
  `Medium-Firm Support: The resilient fiber fill holds its shape through the night and offers steady support for back and side sleepers.\n\n` +
  `Easy Machine Care: Machine wash cold on a gentle cycle and tumble dry low—the fill fluffs back up nicely, staying clean, fresh, and ready for everyday use.`;

const products = [];
for (const s of SIZES) {
  const asin = `MICROFIBER-PILLOW-${s.key.toUpperCase()}`;
  const asinLower = asin.toLowerCase();
  products.push({
    asin, asinLower,
    title: `Makimoo Microfiber Bed Pillows Set of 2 ${s.name} Size Soft Fluffy Down Alternative Fill Smooth Polyester Cover Hotel Pillows for Sleeping ${s.inch} (White)`,
    shortTitle: `Microfiber Bed Pillows Set of 2, White, ${s.name}`,
    handle: `makimoo-microfiber-bed-pillows-set-of-2-${s.key}`,
    bullets: bulletsOf(s),
    sku: `microfiber-pillow-${s.key}`,
    images: [`/images/products/${asin}/1.webp`, `/images/products/${asin}/2.webp`],
    whiteBg: [false, false], // 灰底棚拍图
    color: 'White',
    size: s.name, // 2026-10-18 用户定：变体标签用尺寸名（Standard/Queen/King）
    dims: s.dims,
  });
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
      productType: 'Pillows',
      tags: ['Pillows'],
      availableForSale: false, // 价格/库存由 Shopify 侧建品后经 shopify-map 关联（同 DOWN-PILLOW 惯例）
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

// ─── 3. variant-groups.ts：新增 MICROFIBER-PILLOW 族（3 成员，幂等） ─────────
{
  const file = path.join(ROOT, 'src/data/variant-groups.ts');
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes("id: 'MICROFIBER-PILLOW'")) {
    console.log('variant-groups.ts: MICROFIBER-PILLOW 族已存在，跳过');
  } else {
    const idx = s.lastIndexOf('];');
    if (idx < 0) { console.error('variant-groups.ts anchor not found'); process.exit(1); }
    const members = products
      .map((p) => `    { asin: '${p.asinLower}', handle: '${p.handle}', color: '${p.color}', size: '${p.size}' },`)
      .join('\n');
    const block =
      `  {\n` +
      `    id: 'MICROFIBER-PILLOW',\n` +
      `    optionName: 'Size',\n` +
      `    // Microfiber 床枕 Set of 2（3 尺寸，2026-10-18 用户定；替代 b0-inserts-rect 旧族）\n` +
      `    members: [\n${members}\n    ],\n` +
      `  },\n`;
    s = s.slice(0, idx) + block + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
    console.log('variant-groups.ts: 新增 MICROFIBER-PILLOW 族 3 members');
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
    s = s.slice(0, idx) + '  // 2026-10-18：Microfiber 床枕（3 尺寸）\n' + lines.join('\n') + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`new-product-handles.ts: +${lines.length} handles`);
}

// ─── 5. specs-overrides.ts：材质与尺寸（Microfiber → 归 down-alternative 材质区） ─
{
  const file = path.join(ROOT, 'src/data/specs-overrides.ts');
  let s = fs.readFileSync(file, 'utf8');
  const lines = [];
  for (const p of products) {
    if (s.includes(`"${p.asinLower}":`)) continue;
    lines.push(`  "${p.asinLower}": { material: "Microfiber", dimensionsCm: [${p.dims.join(', ')}] },`);
  }
  if (lines.length) {
    const idx = s.lastIndexOf('};');
    if (idx < 0) { console.error('specs-overrides.ts anchor not found'); process.exit(1); }
    s = s.slice(0, idx) + '  // 2026-10-18：Microfiber 床枕\n' + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`specs-overrides.ts: +${lines.length} entries`);
}

// ─── 6. short-titles.ts：短标题 ────────────────────────────────────────────
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
    s = s.slice(0, idx) + '  // 2026-10-18：Microfiber 床枕（3 尺寸）\n' + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`short-titles.ts: +${lines.length} entries`);
}

// ─── 7. 图片转换：staging PNG → 1200x1200 webp（已存在则跳过） ─────────────
(async () => {
  const sharp = require('sharp');
  const mainSrc = path.join(ROOT, 'public/images/staging', 'microfiber-pillow-main-1x1.png');
  const fillSrc = path.join(ROOT, 'public/images/staging', 'microfiber-pillow-filling-1x1.png');
  let converted = 0, skipped = 0, missing = 0;
  for (const src of [mainSrc, fillSrc]) {
    if (!fs.existsSync(src)) { console.error(`缺源图（先生成）: ${src}`); missing++; }
  }
  if (!missing) {
    for (const sz of SIZES) {
      const asin = `MICROFIBER-PILLOW-${sz.key.toUpperCase()}`;
      const dir = path.join(ROOT, 'public/images/products', asin);
      fs.mkdirSync(dir, { recursive: true });
      for (const [name, src] of [['1.webp', mainSrc], ['2.webp', fillSrc]]) {
        const out = path.join(dir, name);
        if (fs.existsSync(out)) { skipped++; continue; }
        const tmp = out + '.tmp';
        await sharp(src).resize(1200, 1200).webp({ quality: 82 }).toFile(tmp);
        fs.renameSync(tmp, out);
        converted++;
      }
    }
  }
  console.log(`images: +${converted} webp（跳过已存在 ${skipped}）`);
  if (missing) { console.error(`有 ${missing} 张缺源图，数据已写入但图片未转`); process.exit(1); }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
