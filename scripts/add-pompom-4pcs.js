/**
 * add-pompom-4pcs.js — Embossed Velvet 绒球花边雕花绒四件套新面料线接入（2026-10-21 用户定，幂等，可重复运行）
 * 28 个产品 = 7 色 × 4 尺寸（Twin/Full/Queen/King）。每色一张 3:4 种草场景图
 * （staging/pompom-zhongcao-{img}-34.png，由 seeany-pompom-zhongcao.js 按六段式+sunburst 生成，
 * 4 尺寸共用同色图，同 sateen/percale 惯例）。
 * 套件组成：被套 + 床笠 + 2 枕套（床笠款，2026-10-21 用户确认）；尺寸口径同 BEDSET4/SATEEN4。
 * 上架状态：availableForSale=false、价格 0.00（2026-10-21 用户定：先不可售）——
 * Shopify 侧由用户建品：SKU 须用同一口径 pompom-<color>-<size>（build-shopify-map.js SKU 兜底匹配）。
 * 写入：products-materials.ts、materials-map.ts、variant-groups.ts（新增 POMPOM4 族）、
 *       new-product-handles.ts、specs-overrides.ts（material "Embossed Velvet"）、short-titles.ts、
 *       image-aspect-overrides.ts（3/4）、pdp-main-34-asins.ts（PDP 主图 3:4）
 * 图片：每 SKU 两张——1.webp（1:1 居中裁 1200，PLP 卡用）+ 1-3x4.webp（1200x1600，PDP 主图）
 * 配套代码改动（手动落盘，不在本脚本）：bedding-families.ts classifySet 'pompom4-' → four +
 *       COLOR_LABELS 七色映射（色码单段 slug，多词展示名防粘连）
 * 注意：products-materials.ts / materials-map.ts 为 sync-materials.js 自动生成文件，
 *       全量同步后需重跑本脚本恢复这些条目（同 add-sateen-4pcs.js 惯例）
 * 用法: node scripts/add-pompom-4pcs.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// ─── 产品定义 ──────────────────────────────────────────────────────────────
// 色码 slug 必须单段（bedding-families.ts colorOf 只取家族 key 第二段）；
// img = staging 图名后缀（pompom-zhongcao-{img}-34.png）
const COLORS = [
  { slug: 'swirl',  img: 'gold-swirl',   name: 'Caramel Swirl' },  // 奶白底驼金佩斯利涡纹 + 黄球 + 芥末金内面
  { slug: 'vine',   img: 'cream-green',  name: 'Olive Vine' },     // 奶白底浅金卷草藤 + 棕球 + 橄榄绿内面
  { slug: 'leaf',   img: 'blue-leaf',    name: 'Dusty Leaf' },     // 浅灰蓝底白色叶脉 + 白球 + 米白内面
  { slug: 'blush',  img: 'pink-floral',  name: 'Blush Floral' },   // 奶白底浅粉灰碎花 + 白球 + 浅灰蓝内面
  { slug: 'ink',    img: 'ink-floral',   name: 'Ink Floral' },     // 米白底黑灰线描花卉 + 黑球 + 浅灰内面
  { slug: 'bloom',  img: 'lilac',        name: 'Lilac Bloom' },    // 浅灰紫底白色小花 + 紫球 + 浅灰内面（slug 不用 lilac：避免撞 COLOR_LABELS 影响 bedset4-lilac）
  { slug: 'damask', img: 'euro-gold',    name: 'Gold Damask' },    // 奶白底金色大马士革 + 棕球 + 橄榄绿内面（euro 参考图款）
];
const SIZES = [
  // 四件套口径参照 BEDSET4 Queen（被套 88x88 + 床笠 60x80 + 枕套 20x30）类推（同 sateen 脚本）；
  // variant-groups 尺寸串用被套 cm（同 PERCALE/BEDSET4/SATEEN4 惯例）
  { key: 'twin',  name: 'Twin',  duvet: '68 x 88 in',  sheet: '39 x 75 in', pc: '20 x 26 in', cm: '170 x 220 cm', dims: [170, 220] },
  { key: 'full',  name: 'Full',  duvet: '80 x 88 in',  sheet: '54 x 75 in', pc: '20 x 26 in', cm: '200 x 220 cm', dims: [200, 220] },
  { key: 'queen', name: 'Queen', duvet: '88 x 88 in',  sheet: '60 x 80 in', pc: '20 x 30 in', cm: '220 x 220 cm', dims: [220, 220] },
  { key: 'king',  name: 'King',  duvet: '104 x 90 in', sheet: '78 x 80 in', pc: '20 x 36 in', cm: '260 x 220 cm', dims: [260, 220] },
];

const BULLETS = (colorName, s) =>
  `Sculpted Embossed Velvet: The duvet cover and pillowcases are woven in a soft carved-plush fabric with a raised, sculpted pattern—velvety matte to the touch and gently plush, adding quiet depth and warmth to the bed.\n\n` +
  `Complete ${s.name} 4-Piece Set: This bedding set includes 1 duvet cover (${s.duvet}), 1 fitted sheet (${s.sheet}), and 2 pillowcases (${s.pc}), giving you everything you need for a coordinated, polished bed.\n\n` +
  `Pom-Pom Trim Finish: A playful pom-pom edging runs along the duvet cover and pillowcase borders, giving the set a soft, handcrafted look that stands out from plain bedding.\n\n` +
  `Cozy Milk-Velvet Reverse: The reverse side and fitted sheet are made of solid milk-velvet—dense, smooth and warm against the skin, ideal for cooler nights, with all-around elastic on the fitted sheet for a secure fit.\n\n` +
  `Soft ${colorName} Palette & Easy Care: The gentle ${colorName} colorway pairs easily with modern, classic, or cozy décor; the set is machine washable and keeps its plush texture wash after wash.`;

const products = [];
for (const c of COLORS) {
  for (const s of SIZES) {
    const asin = `POMPOM4-${c.slug.toUpperCase()}-${s.key.toUpperCase()}`;
    const asinLower = asin.toLowerCase();
    const title = `Makimoo ${s.name} Bedding Set 4 Piece Embossed Velvet Duvet Cover Fitted Sheet 2 Pillowcases with Pom Pom Trim ${s.duvet} (${c.name})`;
    products.push({
      asin, asinLower,
      title,
      shortTitle: `Embossed Velvet Bedding Set, 4 Piece, ${c.name}, ${s.name}`,
      handle: `makimoo-${s.key}-bedding-set-4-piece-embossed-velvet-pom-pom-${c.slug}-${s.key}`,
      bullets: BULLETS(c.name, s),
      sku: `pompom-${c.slug}-${s.key}`,
      images: [`/images/products/${asin}/1.webp`], // 单色单图：4 尺寸共用该色 3:4 场景图（同 sateen 惯例）
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
      availableForSale: false, // 价格/库存由 Shopify 侧建品后经 shopify-map 关联（2026-10-21 用户定：先不可售）
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

// ─── 3. variant-groups.ts：新增 POMPOM4 族（28 成员，幂等；lone-\r 行尾文件，按 \r 处理） ─
{
  const file = path.join(ROOT, 'src/data/variant-groups.ts');
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes("id: 'POMPOM4'")) {
    console.log('variant-groups.ts: POMPOM4 族已存在，跳过');
  } else {
    const idx = s.lastIndexOf('];');
    if (idx < 0) { console.error('variant-groups.ts anchor not found'); process.exit(1); }
    const members = products
      .map((p) => `    { asin: '${p.asinLower}', handle: '${p.handle}', color: '${p.color}', size: '${p.size}' },`)
      .join('\r');
    const block =
      `  {\r` +
      `    id: 'POMPOM4',\r` +
      `    optionName: 'Color',\r` +
      `    // Embossed Velvet 绒球花边雕花绒四件套（7 色 × 4 尺寸，2026-10-21 用户定）\r` +
      `    members: [\r${members}\r    ],\r` +
      `  },\r`;
    s = s.slice(0, idx) + block + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
    console.log('variant-groups.ts: 新增 POMPOM4 族 28 members');
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
    s = s.slice(0, idx) + '  // 2026-10-21：Embossed Velvet 绒球四件套（7 色 × 4 尺寸）\n' + lines.join('\n') + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`new-product-handles.ts: +${lines.length} handles`);
}

// ─── 5. specs-overrides.ts：材质与尺寸（Embossed Velvet，卡面同名展示） ───────
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

// ─── 6. short-titles.ts：短标题（格式同 sateen 既有成员） ───────────────────
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
    s = s.slice(0, idx) + '  // 2026-10-21：Embossed Velvet 绒球四件套（7 色 × 4 尺寸）\n' + lines.join('\n') + '\n' + s.slice(idx);
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
    s = s.slice(0, idx) + '  // 2026-10-21：Embossed Velvet 绒球四件套（7 色 × 4 尺寸，3:4 PDP 主图）\n' + lines.join('\n') + '\n' + s.slice(idx);
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
    s = s.slice(0, idx) + '  // 2026-10-21：Embossed Velvet 绒球四件套（7 色 × 4 尺寸）\n' + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`pdp-main-34-asins.ts: +${lines.length} entries`);
}

// ─── 9. 图片转换：staging 3:4 PNG → 1.webp（1:1 居中裁 1200，PLP）+ 1-3x4.webp（1200x1600，PDP） ─
(async () => {
  const sharp = require('sharp');
  let converted = 0, skipped = 0, missing = 0;
  for (const c of COLORS) {
    const src = path.join(ROOT, 'public/images/staging', `pompom-zhongcao-${c.img}-34.png`);
    if (!fs.existsSync(src)) { console.error(`缺源图（先生成）: ${src}`); missing++; continue; }
    for (const sz of SIZES) {
      const asin = `POMPOM4-${c.slug.toUpperCase()}-${sz.key.toUpperCase()}`;
      const dir = path.join(ROOT, 'public/images/products', asin);
      const out1 = path.join(dir, '1.webp');
      const out34 = path.join(dir, '1-3x4.webp');
      if (fs.existsSync(out1) && fs.existsSync(out34)) { skipped++; continue; }
      fs.mkdirSync(dir, { recursive: true });
      if (!fs.existsSync(out34)) {
        const tmp = out34 + '.tmp';
        await sharp(src).resize(1200, 1600).webp({ quality: 82 }).toFile(tmp);
        fs.renameSync(tmp, out34);
      }
      if (!fs.existsSync(out1)) {
        const tmp = out1 + '.tmp';
        await sharp(src).resize(1200, 1600).extract({ left: 0, top: 200, width: 1200, height: 1200 }).webp({ quality: 82 }).toFile(tmp);
        fs.renameSync(tmp, out1);
      }
      converted++;
    }
  }
  console.log(`images: +${converted} SKU（跳过已存在 ${skipped}）`);
  if (missing) { console.error(`有 ${missing} 色缺源图，数据已写入但图片未转`); process.exit(1); }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
