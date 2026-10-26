/**
 * add-washjac-1color.js — Washed Cotton 奶白色暗纹提花四件套接入（2026-10-22 用户定，幂等，可重复运行）
 * 1 个产品 = 单色（Cream White 奶白，暗纹叶脉提花）× 仅 Queen。主图 staging/cream-jacquard-zhongcao-34.png（用户已验收）。
 * 面料：内部 material 原子词 'Washed Cotton-Like'，全站展示名 Washed Cotton（2026-10-22 用户改定，见 bedding-fabrics.ts）。
 * 套件组成：被套 88x88 + 床笠 60x80（全圈松紧）+ 2 枕套 20x30；variant-groups 尺寸串 220 x 220 cm。
 * 上架状态：availableForSale=false、价格 0.00（2026-10-22 用户定：先不可售，待 Shopify 建品，SKU washjac-cream-queen）。
 * 色码结论（2026-10-22）：CREAM 已在 COLOR_LABELS 映射 'Cream White'（sateen4-cream 在用）——
 *   按用户定直接复用，不新增不改；family key WASHJAC-CREAM → colorOf 自动得 'Cream White'。
 * threadCount：ProductSpecs 接口只有 dimensionsCm/material（无 threadCount），同 WASHSTRIPE 口径。
 * 写入：products-materials.ts、materials-map.ts、variant-groups.ts（新增 WASHJAC 族，单成员）、
 *       new-product-handles.ts、specs-overrides.ts（material "Washed Cotton-Like"）、short-titles.ts、
 *       image-aspect-overrides.ts（3/4）、pdp-main-34-asins.ts（PDP 主图 3:4）
 * 图片：1.webp（1200x1200 cover centre，PLP 卡用）+ 1-3x4.webp（1200x1600 cover centre，PDP 主图），q82
 * 配套代码改动（手动落盘，不在本脚本）：bedding-families.ts classifySet 'washjac-' → four
 *       （COLOR_LABELS 无需改——CREAM 复用现有映射）
 * 注意：products-materials.ts / materials-map.ts 为 sync-materials.js 自动生成文件，
 *       全量同步后需重跑本脚本恢复这些条目（同 add-washstripe-1color.js 惯例）
 * 用法: node scripts/add-washjac-1color.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// ─── 产品定义 ──────────────────────────────────────────────────────────────
// 色码 slug 必须单段（bedding-families.ts colorOf 只取家族 key 第二段）；
// img = staging 图名（{img}-34.png）；palette = 第 5 段 bullets 的低饱和色系描述
const COLOR = {
  slug: 'cream', img: 'cream-jacquard-zhongcao', name: 'Cream White', // 奶白（复用 COLOR_LABELS 既有 CREAM 映射）
  palette: 'a soft, milky Cream White—low-saturation and quietly warm, it brings a calm, airy elegance to the bedroom',
};
// 仅 Queen（2026-10-22 用户定）：被套 88x88 + 床笠 60x80 + 枕套 20x30；cm 口径同 BEDSET4 Queen
const SIZE = { key: 'queen', name: 'Queen', duvet: '88 x 88 in', sheet: '60 x 80 in', pc: '20 x 30 in', cm: '220 x 220 cm', dims: [220, 220] };

const BULLETS = (c, s) =>
  `Soft Washed Cotton with Textured Jacquard: Woven from garment-washed cotton-feel fabric with a broken-in softness from the very first night, the duvet cover and pillowcases feature a yarn-dyed, textured leaf-vein jacquard woven into the cloth—not printed—creating a subtle tonal pattern that catches the light gently. Reversible AB design—the A side shows the leaf-vein jacquard, while the B side is a clean solid color.\n\n` +
  `Breathable & Skin-Friendly All Season: The washed plain weave feels soft, airy and gentle against the skin, keeping you comfortable through warm summers and layered cozy in cooler months.\n\n` +
  `Complete ${s.name} 4-Piece Set: This bedding set includes 1 duvet cover (${s.duvet}), 1 fitted sheet (${s.sheet}) with all-around elastic for a secure fit, and 2 pillowcases (${s.pc}), giving you everything you need for a coordinated, polished bed.\n\n` +
  `Thoughtful Details & Easy Care: A hidden zipper closure and interior corner ties keep your comforter neatly in place; the set is machine washable and gets even softer with every wash.\n\n` +
  `Soothing ${c.name} Colorway: Finished in ${c.palette}, pairing easily with modern, classic, or cozy décor.`;

const products = [];
{
  const c = COLOR, s = SIZE;
  const asin = `WASHJAC-${c.slug.toUpperCase()}-${s.key.toUpperCase()}`;
  const asinLower = asin.toLowerCase();
  const title = `Makimoo ${s.name} Bedding Set 4 Piece Soft Washed Cotton Jacquard Duvet Cover Fitted Sheet 2 Pillowcases ${s.duvet} (${c.name})`;
  products.push({
    asin, asinLower,
    title,
    shortTitle: `Washed Cotton Jacquard Bedding Set, 4 Piece, ${c.name}, ${s.name}`,
    handle: `makimoo-${s.key}-bedding-set-4-piece-washed-cotton-jacquard-${c.slug}-${s.key}`,
    bullets: BULLETS(c, s),
    sku: 'washjac-cream-queen', // 2026-10-22 用户指定 SKU（待 Shopify 建品）
    images: [`/images/products/${asin}/1.webp`], // 单色单图：3:4 种草场景图（同 WASHSTRIPE 惯例）
    whiteBg: [false], // 场景图打满图框
    color: c.name,
    size: s.cm,
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
      productType: 'Bedding',
      tags: ['Bedding'],
      availableForSale: false, // 价格/库存由 Shopify 侧建品后经 shopify-map 关联（2026-10-22 用户定：先不可售）
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
    let head = s.slice(0, idx);
    // 前一条目无尾逗号时补逗号（sync-materials.js 重新生成后末条目无逗号，2026-10-22 实测踩到）
    if (/}\s*$/.test(head)) head = head.replace(/}(\s*)$/, '},$1');
    s = head + entries.join(',\n') + ',\n' + s.slice(idx);
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

// ─── 3. variant-groups.ts：新增 WASHJAC 族（单成员；lone-\r 行尾文件，按 \r 处理） ─
{
  const file = path.join(ROOT, 'src/data/variant-groups.ts');
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes("id: 'WASHJAC'")) {
    console.log('variant-groups.ts: WASHJAC 族已存在，跳过');
  } else {
    const idx = s.lastIndexOf('];');
    if (idx < 0) { console.error('variant-groups.ts anchor not found'); process.exit(1); }
    const members = products
      .map((p) => `    { asin: '${p.asinLower}', handle: '${p.handle}', color: '${p.color}', size: '${p.size}' },`)
      .join('\r');
    const block =
      `  {\r` +
      `    id: 'WASHJAC',\r` +
      `    optionName: 'Color',\r` +
      `    // Washed Cotton 奶白暗纹提花四件套（单色 × 仅 Queen，2026-10-22 用户定）\r` +
      `    members: [\r${members}\r    ],\r` +
      `  },\r`;
    s = s.slice(0, idx) + block + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
    console.log('variant-groups.ts: 新增 WASHJAC 族 1 member');
  }
}

// ─── 4. new-product-handles.ts：PDP v2 白名单（遗留文件，写上无害） ──────────
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
    s = s.slice(0, idx) + '  // 2026-10-22：Washed Cotton 奶白暗纹提花四件套（单色 × 仅 Queen）\n' + lines.join('\n') + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`new-product-handles.ts: +${lines.length} handles`);
}

// ─── 5. specs-overrides.ts：材质与尺寸（Washed Cotton-Like 原子词；无 threadCount 字段） ─
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

// ─── 6. short-titles.ts：短标题 ─────────────────────────────────────────────
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
    s = s.slice(0, idx) + '  // 2026-10-22：Washed Cotton 奶白暗纹提花四件套（单色 × 仅 Queen）\n' + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`short-titles.ts: +${lines.length} entries`);
}

// ─── 7. image-aspect-overrides.ts：PDP 图集容器 3/4 ─────────────────────────
{
  const file = path.join(ROOT, 'src/data/image-aspect-overrides.ts');
  let s = fs.readFileSync(file, 'utf8');
  const lines = [];
  for (const p of products) {
    if (s.includes(`'${p.asinLower}':`)) continue;
    lines.push(`  '${p.asinLower}': '3/4',`);
  }
  if (lines.length) {
    const idx = s.lastIndexOf('};');
    if (idx < 0) { console.error('image-aspect-overrides.ts anchor not found'); process.exit(1); }
    s = s.slice(0, idx) + '  // 2026-10-22：Washed Cotton 奶白暗纹提花四件套（单色 × 仅 Queen，3:4 PDP 主图）\n' + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`image-aspect-overrides.ts: +${lines.length} entries`);
}

// ─── 8. pdp-main-34-asins.ts：PDP 主图用 1-3x4.webp ─────────────────────────
{
  const file = path.join(ROOT, 'src/data/pdp-main-34-asins.ts');
  let s = fs.readFileSync(file, 'utf8');
  const lines = [];
  for (const p of products) {
    if (s.includes(`'${p.asinLower}'`)) continue;
    lines.push(`  '${p.asinLower}',`);
  }
  if (lines.length) {
    const idx = s.lastIndexOf(']);');
    if (idx < 0) { console.error('pdp-main-34-asins.ts anchor not found'); process.exit(1); }
    s = s.slice(0, idx) + '  // 2026-10-22：Washed Cotton 奶白暗纹提花四件套（单色 × 仅 Queen）\n' + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`pdp-main-34-asins.ts: +${lines.length} entries`);
}

// ─── 9. 图片转换：staging 3:4 PNG → 1.webp（1200x1200 cover centre，PLP）+ 1-3x4.webp（1200x1600 cover centre，PDP） ─
(async () => {
  const sharp = require('sharp');
  const src = path.join(ROOT, 'public/images/staging', `${COLOR.img}-34.png`);
  if (!fs.existsSync(src)) { console.error(`缺源图（先生成）: ${src}`); process.exit(1); }
  const asin = `WASHJAC-${COLOR.slug.toUpperCase()}-QUEEN`;
  const dir = path.join(ROOT, 'public/images/products', asin);
  const out1 = path.join(dir, '1.webp');
  const out34 = path.join(dir, '1-3x4.webp');
  if (fs.existsSync(out1) && fs.existsSync(out34)) {
    console.log('images: 已存在，跳过');
  } else {
    fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(out34)) {
      const tmp = out34 + '.tmp';
      await sharp(src).resize(1200, 1600, { fit: 'cover', position: 'centre' }).webp({ quality: 82 }).toFile(tmp);
      fs.renameSync(tmp, out34);
    }
    if (!fs.existsSync(out1)) {
      const tmp = out1 + '.tmp';
      await sharp(src).resize(1200, 1200, { fit: 'cover', position: 'centre' }).webp({ quality: 82 }).toFile(tmp);
      fs.renameSync(tmp, out1);
    }
    console.log('images: +1 SKU');
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
