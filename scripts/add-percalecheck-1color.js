/**
 * add-percalecheck-1color.js — Cotton Percale 细格提花四件套新面料线接入（2026-10-25 用户定，幂等，可重复运行）
 * 1 个产品 = 单色（Sand Beige 沙米，细格/细条纱染提花，B 面纯色）× 仅 Queen（同 percalejac/veljac 口径）。
 * 主图：用户供图 Desktop/种草图/jacquard-percale-beige-duvet-3x4.jpg（1440x1920，3:4 种草场景图）。
 * 面料：material 原子词 'Cotton Percale'（与 PERCALE/PERCALEJAC 族同口径，进 Cotton Percale 面料分区）。
 * 套件组成（尺寸参考同类别其他产品）：被套 88x88 + 床笠 60x80（全圈松紧）+ 2 枕套 20x30；
 * variant-groups 尺寸串 220 x 220 cm。
 * 上架状态：availableForSale=false、价格 0.00（同 percalejac 口径：先不可售，待 Shopify 建品，
 * SKU 口径 = 小写 asin：percalecheck-sand-queen）。
 * 色码查重（2026-10-25）：SAND 未占 COLOR_LABELS 与既有家族色段 → COLOR_LABELS 新增 SAND: 'Sand Beige'。
 * 写入：products-materials.ts、materials-map.ts、variant-groups.ts（新增 PERCALECHECK 族，单成员）、
 *       new-product-handles.ts、specs-overrides.ts（material "Cotton Percale"）、short-titles.ts、
 *       image-aspect-overrides.ts（3/4）、pdp-main-34-asins.ts（PDP 主图 3:4）
 * 图片：1.webp（1200x1200 cover centre，PLP 卡用）+ 1-3x4.webp（1200x1600，PDP 主图），q82
 * 配套代码改动（脚本内一并落盘）：bedding-families.ts classifySet 'percalecheck-' → four
 *       + COLOR_LABELS 新增 SAND: 'Sand Beige'
 * 注意：products-materials.ts / materials-map.ts 为 sync-materials.js 自动生成文件，
 *       全量同步后需重跑本脚本恢复这些条目（同 add-percalejac-4colors.js / add-veljac-1color.js 惯例）
 * 用法: node scripts/add-percalecheck-1color.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// ─── 产品定义 ──────────────────────────────────────────────────────────────
const COLOR = {
  slug: 'sand', name: 'Sand Beige', // 沙米（COLOR_LABELS 新增 SAND 映射）
  palette: 'a warm, understated Sand Beige—natural and calm, it lends the bedroom a soft, sunlit warmth',
};
const SRC_IMG = 'C:/Users/12021/Desktop/种草图/jacquard-percale-beige-duvet-3x4.jpg';
// 仅 Queen（同 percalejac 口径）：被套 88x88 + 床笠 60x80 + 枕套 20x30；cm 口径同 BEDSET4 Queen
const SIZE = { key: 'queen', name: 'Queen', duvet: '88 x 88 in', sheet: '60 x 80 in', pc: '20 x 30 in', cm: '220 x 220 cm', dims: [220, 220] };

const BULLETS = (c, s) =>
  `100% Cotton Percale with Yarn-Dyed Check Jacquard: Woven in a crisp, tightly woven cotton percale, the duvet cover and pillowcases feature a fine yarn-dyed check jacquard with a subtle woven texture. Reversible AB design—the A side shows the woven check jacquard, while the B side is a clean solid color.\n\n` +
  `Breathable & Skin-Friendly All Season: The percale plain weave feels cool, smooth and gentle against the skin, with airy breathability that keeps you comfortable through warm summers and layered cozy in cooler months.\n\n` +
  `Complete ${s.name} 4-Piece Set: This bedding set includes 1 duvet cover (${s.duvet}), 1 fitted sheet (${s.sheet}) with all-around elastic for a secure fit, and 2 pillowcases (${s.pc}), giving you everything you need for a coordinated, polished bed.\n\n` +
  `Thoughtful Details & Easy Care: A hidden zipper closure and interior corner ties keep your comforter neatly in place; the set is machine washable and keeps its crisp hand and woven texture wash after wash.\n\n` +
  `Soothing ${c.name} Colorway: Finished in ${c.palette}, pairing easily with modern, classic, or cozy décor.`;

const products = [];
{
  const c = COLOR, s = SIZE;
  const asin = `PERCALECHECK-${c.slug.toUpperCase()}-${s.key.toUpperCase()}`;
  const asinLower = asin.toLowerCase();
  const title = `Makimoo ${s.name} Bedding Set 4 Piece 100% Cotton Percale Check Jacquard Duvet Cover Fitted Sheet 2 Pillowcases ${s.duvet} (${c.name})`;
  products.push({
    asin, asinLower,
    title,
    shortTitle: `Cotton Percale Check Jacquard Bedding Set, 4 Piece, ${c.name}, ${s.name}`,
    handle: `makimoo-${s.key}-bedding-set-4-piece-cotton-percale-check-jacquard-${c.slug}-${s.key}`,
    bullets: BULLETS(c, s),
    sku: asinLower, // 2026-10-25：SKU 口径 = 小写 asin（同 percalejac）
    images: [`/images/products/${asin}/1.webp`], // 单色单图：3:4 种草场景图（同 percalejac 惯例）
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

// ─── 3. variant-groups.ts：新增 PERCALECHECK 族（单成员；lone-\r 行尾文件，按 \r 处理） ─
{
  const file = path.join(ROOT, 'src/data/variant-groups.ts');
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes("id: 'PERCALECHECK'")) {
    console.log('variant-groups.ts: PERCALECHECK 族已存在，跳过');
  } else {
    const idx = s.lastIndexOf('];');
    if (idx < 0) { console.error('variant-groups.ts anchor not found'); process.exit(1); }
    const members = products
      .map((p) => `    { asin: '${p.asinLower}', handle: '${p.handle}', color: '${p.color}', size: '${p.size}' },`)
      .join('\r');
    const block =
      `  {\r` +
      `    id: 'PERCALECHECK',\r` +
      `    optionName: 'Color',\r` +
      `    // Cotton Percale 细格提花四件套（单色 × 仅 Queen，2026-10-25 用户定）\r` +
      `    members: [\r${members}\r    ],\r` +
      `  },\r`;
    s = s.slice(0, idx) + block + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
    console.log('variant-groups.ts: 新增 PERCALECHECK 族 1 member');
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
    s = s.slice(0, idx) + '  // 2026-10-25：Cotton Percale 细格提花四件套（单色 × 仅 Queen）\n' + lines.join('\n') + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`new-product-handles.ts: +${lines.length} handles`);
}

// ─── 5. specs-overrides.ts：材质与尺寸（Cotton Percale 原子词） ─────────────
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
    s = s.slice(0, idx) + '  // 2026-10-25：Cotton Percale 细格提花四件套（单色 × 仅 Queen）\n' + lines.join('\n') + '\n' + s.slice(idx);
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
    s = s.slice(0, idx) + '  // 2026-10-25：Cotton Percale 细格提花四件套（单色 × 仅 Queen，3:4 PDP 主图）\n' + lines.join('\n') + '\n' + s.slice(idx);
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
    s = s.slice(0, idx) + '  // 2026-10-25：Cotton Percale 细格提花四件套（单色 × 仅 Queen）\n' + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`pdp-main-34-asins.ts: +${lines.length} entries`);
}

// ─── 9. bedding-families.ts：classifySet 'percalecheck-' → four + COLOR_LABELS SAND ─
{
  const file = path.join(ROOT, 'src/data/bedding-families.ts');
  let s = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (!s.includes("percalecheck-")) {
    const re = /if \(a\.startsWith\('percalejac-'\)\) return 'four';/;
    if (!re.test(s)) { console.error('bedding-families.ts classifySet anchor not found'); process.exit(1); }
    s = s.replace(re, (m) => m + "\n  if (a.startsWith('percalecheck-')) return 'four'; // 2026-10-25：细格提花四件套");
    changed = true;
  }
  if (!s.includes("SAND:")) {
    const re = /(\/\/ 2026-10-23：提花绒（双面绒）四件套单色（IVORY 未被占用）\r?\n  IVORY: 'Ivory White',)/;
    if (!re.test(s)) { console.error('bedding-families.ts COLOR_LABELS anchor not found'); process.exit(1); }
    s = s.replace(re, (m) => m + "\r\n  // 2026-10-25：Cotton Percale 细格提花四件套单色（SAND 未被占用）\r\n  SAND: 'Sand Beige',");
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(file, s, 'utf8');
    console.log('bedding-families.ts: classifySet + COLOR_LABELS 已更新');
  } else {
    console.log('bedding-families.ts: 已存在，跳过');
  }
}

// ─── 10. 图片转换：源 jpg → 1-3x4.webp（1200x1600，PDP 主图）+ 1.webp（1200x1200 cover centre，PLP 卡） ─
(async () => {
  const sharp = require('sharp');
  if (!fs.existsSync(SRC_IMG)) { console.error(`缺源图: ${SRC_IMG}`); process.exit(1); }
  const asin = `PERCALECHECK-${COLOR.slug.toUpperCase()}-QUEEN`;
  const dir = path.join(ROOT, 'public/images/products', asin);
  const out1 = path.join(dir, '1.webp');
  const out34 = path.join(dir, '1-3x4.webp');
  if (fs.existsSync(out1) && fs.existsSync(out34)) {
    console.log('images: 已存在，跳过');
  } else {
    fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(out34)) {
      const tmp = out34 + '.tmp';
      await sharp(SRC_IMG).resize(1200, 1600, { fit: 'cover', position: 'centre' }).webp({ quality: 82 }).toFile(tmp);
      fs.renameSync(tmp, out34);
    }
    if (!fs.existsSync(out1)) {
      const tmp = out1 + '.tmp';
      await sharp(SRC_IMG).resize(1200, 1200, { fit: 'cover', position: 'centre' }).webp({ quality: 82 }).toFile(tmp);
      fs.renameSync(tmp, out1);
    }
    console.log('images: +1 SKU');
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
