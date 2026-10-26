/**
 * add-veljac-1color.js — 提花绒（双面绒）象牙白四件套接入（2026-10-23 用户定，幂等，可重复运行）
 * 1 个产品 = 单色（Ivory White 象牙白，雕花菱形几何提花绒，AB 双面都是绒：A 面雕花绒 / B 面驼色纯色光面绒）× 仅 Queen。
 * 主图 staging/ivory-embossed-zhongcao-34-v2.png（用户已验收 v2，AB 双面翻折展示版）。
 * 面料：内部 material 原子词 'Embossed Velvet'（复用 pompom4 绒球四件套既有绒材质口径，不产生孤儿材质分区）。
 * 套件组成：被套 88x88 + 床笠 60x80（全圈松紧）+ 2 枕套 20x30；variant-groups 尺寸串 220 x 220 cm。
 * 上架状态：availableForSale=false、价格 0.00（同 washjac 口径：先不可售，待 Shopify 建品，SKU veljac-ivory-queen）。
 * 写入：products-materials.ts、materials-map.ts、variant-groups.ts（新增 VELJAC 族，单成员）、
 *       new-product-handles.ts、specs-overrides.ts（material "Embossed Velvet"）、short-titles.ts、
 *       product-weights.ts、image-aspect-overrides.ts（3/4）、pdp-main-34-asins.ts（PDP 主图 3:4）
 * 图片：1.webp（1200x1200 cover centre，PLP 卡用）+ 1-3x4.webp（1200x1600 cover centre，PDP 主图），q82
 * 配套代码改动（手动落盘，不在本脚本）：bedding-families.ts classifySet 'veljac-' → four
 *       + COLOR_LABELS 新增 IVORY: 'Ivory White'
 * 注意：products-materials.ts / materials-map.ts 为 sync-materials.js 自动生成文件，
 *       全量同步后需重跑本脚本恢复这些条目（同 add-washjac-1color.js 惯例）
 * 用法: node scripts/add-veljac-1color.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// ─── 产品定义 ──────────────────────────────────────────────────────────────
const COLOR = {
  slug: 'ivory', img: 'ivory-embossed-zhongcao-34-v2', name: 'Ivory White', // 象牙白（COLOR_LABELS 新增 IVORY 映射）
  palette: 'a soft Ivory White with a warm camel reverse—low-saturation and quietly warm, it brings a calm, cozy elegance to the bedroom',
};
// 仅 Queen（同 washjac 口径）：被套 88x88 + 床笠 60x80 + 枕套 20x30；cm 口径同 BEDSET4 Queen
const SIZE = { key: 'queen', name: 'Queen', duvet: '88 x 88 in', sheet: '60 x 80 in', pc: '20 x 30 in', cm: '220 x 220 cm', dims: [220, 220] };

const BULLETS = (c, s) =>
  `Double-Sided Jacquard Velvet: Both sides of this set are soft, plush velvet. The A side is carved with a three-dimensional diamond-and-braid jacquard that catches the light with a gentle sculpted relief, while the B side is a smooth, solid velvet in a warm camel tone—an AB reversible design that gives you two looks in one set.\n\n` +
  `Thick, Warm & Cozy: The dense milk-velvet pile feels velvety soft against the skin and holds warmth beautifully, a cozy choice for autumn and winter nights without feeling heavy or stuffy.\n\n` +
  `Complete ${s.name} 4-Piece Set: This bedding set includes 1 duvet cover (${s.duvet}), 1 fitted sheet (${s.sheet}) with all-around elastic for a secure fit, and 2 pillowcases (${s.pc}), giving you everything you need for a coordinated, polished bed.\n\n` +
  `Thoughtful Details & Easy Care: A hidden zipper closure and interior corner ties keep your comforter neatly in place; the set is machine washable and keeps its plush pile and carved texture wash after wash.\n\n` +
  `Soothing ${c.name} Colorway: Finished in ${c.palette}, pairing easily with modern, classic, or cozy décor.`;

const products = [];
{
  const c = COLOR, s = SIZE;
  const asin = `VELJAC-${c.slug.toUpperCase()}-${s.key.toUpperCase()}`;
  const asinLower = asin.toLowerCase();
  const title = `Makimoo ${s.name} Bedding Set 4 Piece Double-Sided Jacquard Velvet Duvet Cover Fitted Sheet 2 Pillowcases ${s.duvet} (${c.name})`;
  products.push({
    asin, asinLower,
    title,
    shortTitle: `Jacquard Velvet Bedding Set, 4 Piece, ${c.name}, ${s.name}`,
    handle: `makimoo-${s.key}-bedding-set-4-piece-jacquard-velvet-${c.slug}-${s.key}`,
    bullets: BULLETS(c, s),
    sku: 'veljac-ivory-queen', // 2026-10-23 待 Shopify 建品
    images: [`/images/products/${asin}/1.webp`], // 单色单图：3:4 种草场景图（同 WASHJAC 惯例）
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
      availableForSale: false, // 价格/库存由 Shopify 侧建品后经 shopify-map 关联（先不可售）
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
    // 前一条目无尾逗号时补逗号（sync-materials.js 重新生成后末条目无逗号）
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

// ─── 3. variant-groups.ts：新增 VELJAC 族（单成员；lone-\r 行尾文件，按 \r 处理） ─
{
  const file = path.join(ROOT, 'src/data/variant-groups.ts');
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes("id: 'VELJAC'")) {
    console.log('variant-groups.ts: VELJAC 族已存在，跳过');
  } else {
    const idx = s.lastIndexOf('];');
    if (idx < 0) { console.error('variant-groups.ts anchor not found'); process.exit(1); }
    const members = products
      .map((p) => `    { asin: '${p.asinLower}', handle: '${p.handle}', color: '${p.color}', size: '${p.size}' },`)
      .join('\r');
    const block =
      `  {\r` +
      `    id: 'VELJAC',\r` +
      `    optionName: 'Color',\r` +
      `    // 提花绒（双面绒）象牙白四件套（单色 × 仅 Queen，2026-10-23 用户定）\r` +
      `    members: [\r${members}\r    ],\r` +
      `  },\r`;
    s = s.slice(0, idx) + block + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
    console.log('variant-groups.ts: 新增 VELJAC 族 1 member');
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
    s = s.slice(0, idx) + '  // 2026-10-23：提花绒（双面绒）象牙白四件套（单色 × 仅 Queen）\n' + lines.join('\n') + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`new-product-handles.ts: +${lines.length} handles`);
}

// ─── 5. specs-overrides.ts：材质与尺寸（Embossed Velvet 原子词；无 threadCount 字段） ─
{
  const file = path.join(ROOT, 'src/data/specs-overrides.ts');
  let s = fs.readFileSync(file, 'utf8');
  const lines = [];
  for (const p of products) {
    if (s.includes(`"${p.asinLower}":`)) continue;
    lines.push(`  "${p.asinLower}": { material: "Embossed Velvet", dimensionsCm: [${p.dims.join(', ')}] },`);
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
    s = s.slice(0, idx) + '  // 2026-10-23：提花绒（双面绒）象牙白四件套（单色 × 仅 Queen）\n' + lines.join('\n') + '\n' + s.slice(idx);
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
    s = s.slice(0, idx) + '  // 2026-10-23：提花绒（双面绒）象牙白四件套（单色 × 仅 Queen，3:4 PDP 主图）\n' + lines.join('\n') + '\n' + s.slice(idx);
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
    s = s.slice(0, idx) + '  // 2026-10-23：提花绒（双面绒）象牙白四件套（单色 × 仅 Queen）\n' + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`pdp-main-34-asins.ts: +${lines.length} entries`);
}

// ─── 9. product-weights.ts：PLP 权重（同 washjac 口径 1.5/1.5） ─────────────
{
  const file = path.join(ROOT, 'src/data/product-weights.ts');
  let s = fs.readFileSync(file, 'utf8');
  const lines = [];
  for (const p of products) {
    if (s.includes(`"${p.asinLower}":`)) continue;
    lines.push(`  "${p.asinLower}": {"type":"Bedding","score":1.5,"perf":1.5,"boost":0},`);
  }
  if (lines.length) {
    const idx = s.lastIndexOf('};');
    if (idx < 0) { console.error('product-weights.ts anchor not found'); process.exit(1); }
    s = s.slice(0, idx) + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`product-weights.ts: +${lines.length} entries`);
}

// ─── 10. 图片转换：staging 3:4 PNG → 1.webp（1200x1200 cover centre，PLP）+ 1-3x4.webp（1200x1600 cover centre，PDP） ─
(async () => {
  const sharp = require('sharp');
  const src = path.join(ROOT, 'public/images/staging', `${COLOR.img}.png`);
  if (!fs.existsSync(src)) { console.error(`缺源图（先生成）: ${src}`); process.exit(1); }
  const asin = `VELJAC-${COLOR.slug.toUpperCase()}-QUEEN`;
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
