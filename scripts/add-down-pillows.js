/**
 * add-down-pillows.js — Down / Down & Feather 床枕新品接入（2026-10-18 用户定，幂等，可重复运行）
 * 6 个产品 = 2 款填充 × 3 尺寸（Standard/Queen/King）：
 *   A. Down Bed Pillows Set of 2（80% Down, 20% Feather and Fiber）——填充图 = filling-only（纯羽绒簇）
 *   B. Down & Feather Bed Pillows Set of 2（50% Down, 50% Feather and Fiber）——填充图 = filling-blend
 * 主图两款共用 staging/down-pillow-main-1x1.png（灰底双枕平叠）；
 * 每 SKU 两图：1.webp = 主图，2.webp = 对应填充物图（同 ASIN 目录惯例）。
 * 尺寸口径：Standard 20x26 in (51x66 cm) / Queen 20x30 in (51x76 cm) / King 20x36 in (51x91 cm)。
 * Shopify 侧由用户建品：SKU 须用同一口径 down-pillow-<size> / down-feather-pillow-<size>
 * （build-shopify-map.js SKU 兜底匹配）；建品后重跑 build-shopify-map.js 完成关联。
 * 写入：products-materials.ts、materials-map.ts、variant-groups.ts（DOWN-PILLOW / DOWN-FEATHER-PILLOW 两族）、
 *       new-product-handles.ts、specs-overrides.ts、short-titles.ts
 * 配套代码改动（手动落盘，不在本脚本）：pillows-taxonomy.ts pillowMaterialOf /^down/i 兼容
 *       "Down & Feather"；PILLOW_MATERIALS down 的 menuDesc/blurb 去 coming soon。
 * 注意：图片位次配套 scripts/insert-pillow-seed-image.js（2=种草图 3=填充图），重跑本脚本后需再跑一次它；
 *       products-materials.ts / materials-map.ts 为 sync-materials.js 自动生成文件，
 *       全量同步后需重跑本脚本恢复这些条目（同 add-percale-6colors.js 惯例）
 * 用法: node scripts/add-down-pillows.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// ─── 产品定义 ──────────────────────────────────────────────────────────────
const SIZES = [
  { key: 'standard', name: 'Standard', inch: '20 x 26 in', cm: '51 x 66 cm', dims: [51, 66] },
  { key: 'queen', name: 'Queen', inch: '20 x 30 in', cm: '51 x 76 cm', dims: [51, 76] },
  { key: 'king', name: 'King', inch: '20 x 36 in', cm: '51 x 91 cm', dims: [51, 91] },
];

const LINES = [
  {
    id: 'down-pillow',
    asinPrefix: 'DOWN-PILLOW',
    groupId: 'DOWN-PILLOW',
    handlePrefix: 'makimoo-down-bed-pillows-set-of-2',
    material: 'Down',
    fillingImg: 'down-pillow-filling-only-1x1.png',
    titleOf: (s) =>
      `Makimoo Down Bed Pillows Set of 2 ${s.name} Size 80% Down 20% Feather and Fiber Fill 100% Cotton Cover Hotel Luxury Soft Pillows for Sleeping ${s.inch} (White)`,
    shortTitleOf: (s) => `Down Bed Pillows Set of 2, White, ${s.name}`,
    bulletsOf: (s) =>
      `80% Premium Down Fill: Generously filled with 80% fluffy white down and 20% feather and fiber, these pillows deliver cloud-like softness with airy, high-loft fullness that gently cradles your head and neck.\n\n` +
      `100% Cotton Cover: A smooth, breathable cotton shell keeps the fill evenly distributed while feeling cool and gentle against the skin—no crinkly texture, just quiet comfort.\n\n` +
      `Set of 2, ${s.name} Size: Each pillow measures ${s.inch} (${s.cm}), a ready-to-pair set that outfits your bed with hotel-inspired luxury.\n\n` +
      `Soft, Sink-In Comfort: The down-rich fill compresses softly under weight and springs back with a daily fluff, suiting side, back, and stomach sleepers who love a plush, moldable pillow.\n\n` +
      `Easy Care: Fluff daily to maintain loft. Machine wash cold on a gentle cycle and tumble dry low with dryer balls to restore fullness—made to stay fresh and fluffy for everyday use.`,
  },
  {
    id: 'down-feather-pillow',
    asinPrefix: 'DOWN-FEATHER-PILLOW',
    groupId: 'DOWN-FEATHER-PILLOW',
    handlePrefix: 'makimoo-down-feather-bed-pillows-set-of-2',
    material: 'Down & Feather',
    fillingImg: 'down-pillow-filling-blend-1x1.png',
    titleOf: (s) =>
      `Makimoo Down and Feather Bed Pillows Set of 2 ${s.name} Size 50% Down 50% Feather and Fiber Fill 100% Cotton Cover Medium Support Hotel Pillows for Sleeping ${s.inch} (White)`,
    shortTitleOf: (s) => `Down & Feather Bed Pillows Set of 2, White, ${s.name}`,
    bulletsOf: (s) =>
      `50% Down 50% Feather Fill: A balanced blend of 50% white down and 50% feather and fiber pairs the airy softness of down with the gentle structure of feathers for a medium, resilient feel.\n\n` +
      `100% Cotton Cover: A smooth, breathable cotton shell keeps the fill evenly distributed while feeling cool and gentle against the skin—no crinkly texture, just quiet comfort.\n\n` +
      `Set of 2, ${s.name} Size: Each pillow measures ${s.inch} (${s.cm}), a ready-to-pair set that outfits your bed with hotel-inspired comfort.\n\n` +
      `Medium Support That Holds Shape: The feather blend keeps its loft longer through the night and offers a touch more support than pure down—ideal for back and side sleepers.\n\n` +
      `Easy Care: Fluff daily to maintain loft. Machine wash cold on a gentle cycle and tumble dry low with dryer balls to restore fullness—made to stay fresh and supportive for everyday use.`,
  },
];

const products = [];
for (const line of LINES) {
  for (const s of SIZES) {
    const asin = `${line.asinPrefix}-${s.key.toUpperCase()}`;
    const asinLower = asin.toLowerCase();
    products.push({
      line,
      asin, asinLower,
      title: line.titleOf(s),
      shortTitle: line.shortTitleOf(s),
      handle: `${line.handlePrefix}-${s.key}`,
      bullets: line.bulletsOf(s),
      sku: `${line.id}-${s.key}`,
      images: [`/images/products/${asin}/1.webp`, `/images/products/${asin}/2.webp`],
      whiteBg: [false, false], // 灰底棚拍图
      color: 'White',
      size: s.name, // 2026-10-18 用户定：变体标签用尺寸名（Standard/Queen/King）
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
      productType: 'Pillows',
      tags: ['Pillows'],
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

// ─── 3. variant-groups.ts：新增 DOWN-PILLOW / DOWN-FEATHER-PILLOW 两族（幂等） ─
{
  const file = path.join(ROOT, 'src/data/variant-groups.ts');
  let s = fs.readFileSync(file, 'utf8');
  for (const line of LINES) {
    if (s.includes(`id: '${line.groupId}'`)) {
      console.log(`variant-groups.ts: ${line.groupId} 族已存在，跳过`);
      continue;
    }
    const idx = s.lastIndexOf('];');
    if (idx < 0) { console.error('variant-groups.ts anchor not found'); process.exit(1); }
    const members = products
      .filter((p) => p.line === line)
      .map((p) => `    { asin: '${p.asinLower}', handle: '${p.handle}', color: '${p.color}', size: '${p.size}' },`)
      .join('\n');
    const block =
      `  {\n` +
      `    id: '${line.groupId}',\n` +
      `    optionName: 'Size',\n` +
      `    // ${line.material} 床枕 Set of 2（3 尺寸，2026-10-18 用户定）\n` +
      `    members: [\n${members}\n    ],\n` +
      `  },\n`;
    s = s.slice(0, idx) + block + s.slice(idx);
    console.log(`variant-groups.ts: 新增 ${line.groupId} 族 3 members`);
  }
  fs.writeFileSync(file, s, 'utf8');
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
    s = s.slice(0, idx) + '  // 2026-10-18：Down / Down & Feather 床枕（2 款 × 3 尺寸）\n' + lines.join('\n') + s.slice(idx);
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
    lines.push(`  "${p.asinLower}": { material: "${p.line.material}", dimensionsCm: [${p.dims.join(', ')}] },`);
  }
  if (lines.length) {
    const idx = s.lastIndexOf('};');
    if (idx < 0) { console.error('specs-overrides.ts anchor not found'); process.exit(1); }
    s = s.slice(0, idx) + '  // 2026-10-18：Down / Down & Feather 床枕\n' + lines.join('\n') + '\n' + s.slice(idx);
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
    s = s.slice(0, idx) + '  // 2026-10-18：Down / Down & Feather 床枕（2 款 × 3 尺寸）\n' + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`short-titles.ts: +${lines.length} entries`);
}

// ─── 7. 图片转换：staging PNG → 1200x1200 webp（已存在则跳过） ─────────────
(async () => {
  const sharp = require('sharp');
  let converted = 0, skipped = 0, missing = 0;
  const mainSrc = path.join(ROOT, 'public/images/staging', 'down-pillow-main-1x1.png');
  for (const line of LINES) {
    const fillSrc = path.join(ROOT, 'public/images/staging', line.fillingImg);
    for (const src of [mainSrc, fillSrc]) {
      if (!fs.existsSync(src)) { console.error(`缺源图（先生成）: ${src}`); missing++; }
    }
    if (missing) continue;
    for (const sz of SIZES) {
      const asin = `${line.asinPrefix}-${sz.key.toUpperCase()}`;
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
