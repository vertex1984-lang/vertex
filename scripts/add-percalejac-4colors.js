/**
 * add-percalejac-4colors.js — Cotton Percale 色织提花四件套新面料线接入（2026-10-22 用户定，幂等，可重复运行）
 * 4 个产品 = 4 色 × 仅 Queen。每色一张 3:4 种草场景图（staging/{img}-34.png）。
 * 套件组成：被套 88x88 + 床笠 60x80（全圈松紧）+ 2 枕套 20x30；variant-groups 尺寸串 220 x 220 cm。
 * 上架状态：availableForSale=false、价格 0.00（2026-10-22 用户定：先不可售）——
 * Shopify 侧由用户建品：SKU 口径 percalejac-<color>-queen（同 materials-map.sku，小写 asin）。
 * 色码查重结论（2026-10-22，bedding-families.ts colorOf 按家族 key 第二段查 COLOR_LABELS，无条目回退 Title Case）：
 *   BLUE/PINK 被 bedset4/duvset 占用（回退 "Blue"/"Pink"）、OATMEAL 被 linen3-oatmeal 占用（回退 "Oatmeal"）、
 *   MIST 被 PERCALE 占用 → 改用 HAZE/ROSE/GREY/OATBEIGE（均不撞 COLOR_LABELS 与既有家族色段）。
 * 写入：products-materials.ts、materials-map.ts、variant-groups.ts（新增 PERCALEJAC 族，组首 HAZE）、
 *       new-product-handles.ts、specs-overrides.ts（material "Cotton Percale"）、short-titles.ts、
 *       image-aspect-overrides.ts（3/4）、pdp-main-34-asins.ts（PDP 主图 3:4）
 * 图片：每 SKU 两张——1.webp（1:1 cover centre 1200，PLP 卡用）+ 1-3x4.webp（1200x1600 cover centre，PDP 主图）
 * 配套代码改动（手动落盘，不在本脚本）：bedding-families.ts classifySet 'percalejac-' → four +
 *       COLOR_LABELS 四色映射（HAZE/ROSE/GREY/OATBEIGE）
 * 注意：products-materials.ts / materials-map.ts 为 sync-materials.js 自动生成文件，
 *       全量同步后需重跑本脚本恢复这些条目（同 add-sateen-4pcs.js / add-pompom-4pcs.js 惯例）
 * 用法: node scripts/add-percalejac-4colors.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// ─── 产品定义 ──────────────────────────────────────────────────────────────
// 色码 slug 必须单段（bedding-families.ts colorOf 只取家族 key 第二段）；
// img = staging 图名（{img}-34.png）；palette = 第 5 段 bullets 的低饱和色系描述
const COLORS = [
  {
    slug: 'haze', img: 'blue-waffle-zhongcao', name: 'Dusty Blue', // 雾霾蓝（组首）
    palette: 'a hazy, muted Dusty Blue with a soft grey undertone—calm and airy, it brings a quiet, restful feel to the bedroom',
  },
  {
    slug: 'rose', img: 'waffle-zhongcao-pink', name: 'Dusty Pink', // 灰粉
    palette: 'a gentle grey-toned Dusty Pink—soft and warm without being sweet, adding a subtle, soothing glow to the bed',
  },
  {
    slug: 'grey', img: 'waffle-zhongcao-gray', name: 'Light Grey', // 浅灰
    palette: 'a clean, understated Light Grey—versatile and serene, it pairs effortlessly with any bedroom palette',
  },
  {
    slug: 'oatbeige', img: 'waffle-zhongcao-oat', name: 'Oatmeal Beige', // 燕麦
    palette: 'a warm, creamy Oatmeal Beige—natural and cozy, it lends the room a soft, sunlit warmth',
  },
];
// 仅 Queen（2026-10-22 用户定）：被套 88x88 + 床笠 60x80 + 枕套 20x30；cm 口径同 BEDSET4 Queen
const SIZE = { key: 'queen', name: 'Queen', duvet: '88 x 88 in', sheet: '60 x 80 in', pc: '20 x 30 in', cm: '220 x 220 cm', dims: [220, 220] };

const BULLETS = (c, s) =>
  `100% Cotton Percale with Yarn-Dyed Jacquard: Woven in a crisp, tightly woven cotton percale, the duvet cover and pillowcases feature yarn-dyed jacquard wide stripes with a subtle waffle texture. Reversible AB design—the A side shows the woven stripe jacquard, while the B side is a clean solid color.\n\n` +
  `Breathable & Skin-Friendly All Season: The percale plain weave feels cool, smooth and gentle against the skin, with airy breathability that keeps you comfortable through warm summers and layered cozy in cooler months.\n\n` +
  `Complete ${s.name} 4-Piece Set: This bedding set includes 1 duvet cover (${s.duvet}), 1 fitted sheet (${s.sheet}) with all-around elastic for a secure fit, and 2 pillowcases (${s.pc}), giving you everything you need for a coordinated, polished bed.\n\n` +
  `Thoughtful Details & Easy Care: A hidden zipper closure and interior corner ties keep your comforter neatly in place; the set is machine washable and keeps its crisp hand and woven texture wash after wash.\n\n` +
  `Soothing ${c.name} Colorway: Finished in ${c.palette}, pairing easily with modern, classic, or cozy décor.`;

const products = [];
for (const c of COLORS) {
  const s = SIZE;
  const asin = `PERCALEJAC-${c.slug.toUpperCase()}-${s.key.toUpperCase()}`;
  const asinLower = asin.toLowerCase();
  const title = `Makimoo ${s.name} Bedding Set 4 Piece 100% Cotton Percale Jacquard Duvet Cover Fitted Sheet 2 Pillowcases ${s.duvet} (${c.name})`;
  products.push({
    asin, asinLower,
    title,
    shortTitle: `Cotton Percale Jacquard Bedding Set, 4 Piece, ${c.name}, ${s.name}`,
    handle: `makimoo-${s.key}-bedding-set-4-piece-cotton-percale-jacquard-${c.slug}-${s.key}`,
    bullets: BULLETS(c, s),
    sku: asinLower, // 2026-10-22 用户定：SKU 口径 = 小写 asin
    images: [`/images/products/${asin}/1.webp`], // 单色单图：3:4 种草场景图（同 sateen/pompom 惯例）
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

// ─── 3. variant-groups.ts：新增 PERCALEJAC 族（4 成员，组首 HAZE=蓝；lone-\r 行尾文件，按 \r 处理） ─
{
  const file = path.join(ROOT, 'src/data/variant-groups.ts');
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes("id: 'PERCALEJAC'")) {
    console.log('variant-groups.ts: PERCALEJAC 族已存在，跳过');
  } else {
    const idx = s.lastIndexOf('];');
    if (idx < 0) { console.error('variant-groups.ts anchor not found'); process.exit(1); }
    const members = products
      .map((p) => `    { asin: '${p.asinLower}', handle: '${p.handle}', color: '${p.color}', size: '${p.size}' },`)
      .join('\r');
    const block =
      `  {\r` +
      `    id: 'PERCALEJAC',\r` +
      `    optionName: 'Color',\r` +
      `    // Cotton Percale 色织提花四件套（4 色 × 仅 Queen，2026-10-22 用户定）\r` +
      `    members: [\r${members}\r    ],\r` +
      `  },\r`;
    s = s.slice(0, idx) + block + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
    console.log('variant-groups.ts: 新增 PERCALEJAC 族 4 members');
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
    s = s.slice(0, idx) + '  // 2026-10-22：Cotton Percale 提花四件套（4 色 × 仅 Queen）\n' + lines.join('\n') + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`new-product-handles.ts: +${lines.length} handles`);
}

// ─── 5. specs-overrides.ts：材质与尺寸（Cotton Percale，卡面同名展示） ────────
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
    s = s.slice(0, idx) + '  // 2026-10-22：Cotton Percale 提花四件套（4 色 × 仅 Queen）\n' + lines.join('\n') + '\n' + s.slice(idx);
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
    s = s.slice(0, idx) + '  // 2026-10-22：Cotton Percale 提花四件套（4 色 × 仅 Queen，3:4 PDP 主图）\n' + lines.join('\n') + '\n' + s.slice(idx);
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
    s = s.slice(0, idx) + '  // 2026-10-22：Cotton Percale 提花四件套（4 色 × 仅 Queen）\n' + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`pdp-main-34-asins.ts: +${lines.length} entries`);
}

// ─── 9. 图片转换：staging 3:4 PNG → 1.webp（1200x1200 cover centre，PLP）+ 1-3x4.webp（1200x1600 cover centre，PDP） ─
(async () => {
  const sharp = require('sharp');
  let converted = 0, skipped = 0, missing = 0;
  for (const c of COLORS) {
    const src = path.join(ROOT, 'public/images/staging', `${c.img}-34.png`);
    if (!fs.existsSync(src)) { console.error(`缺源图（先生成）: ${src}`); missing++; continue; }
    const asin = `PERCALEJAC-${c.slug.toUpperCase()}-QUEEN`;
    const dir = path.join(ROOT, 'public/images/products', asin);
    const out1 = path.join(dir, '1.webp');
    const out34 = path.join(dir, '1-3x4.webp');
    if (fs.existsSync(out1) && fs.existsSync(out34)) { skipped++; continue; }
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
    converted++;
  }
  console.log(`images: +${converted} SKU（跳过已存在 ${skipped}）`);
  if (missing) { console.error(`有 ${missing} 色缺源图，数据已写入但图片未转`); process.exit(1); }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
