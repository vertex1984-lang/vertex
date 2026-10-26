/**
 * add-velstripe-2colors.js — 条纹绒四件套扩充 2 色 + mocha 换主图（2026-10-25 用户定，幂等）
 * 1) mocha 主图替换为 C:\Users\12021\Desktop\种草图\greige-stripe-velvet-nofold-3x4.jpg（灰绿底+棕条纹）
 * 2) 新增 2 色 PDP（同 VELSTRIPE 模板，Queen only，材质原子词 Embossed Velvet，展示名 Plush Velvet）：
 *    - DENIM 'Denim Stripe'：雾霾蓝底 + 棕色双细条纹（blue-brown-stripe-velvet-nofold-3x4.jpg）
 *    - CHARCOAL 'Charcoal Stripe'：灰色底 + 黑/深色双细条纹（grey-black-velvet-nofold-3x4.jpg）
 * 3) 两新品并入既有 VELSTRIPE 变体组（追加成员，不新建组）
 * 色码查重（2026-10-25）：DENIM / CHARCOAL 未占 COLOR_LABELS 与既有家族色段
 * 用法: node scripts/add-velstripe-2colors.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// ─── 产品定义 ──────────────────────────────────────────────────────────────
const COLORS = [
  {
    slug: 'denim', name: 'Denim Stripe', // 雾霾蓝底 + 棕色双细条纹（COLOR_LABELS 新增 DENIM 映射）
    stripeDesc: 'blue-and-brown stripe',
    palette: 'a dusty blue ground patterned with warm brown twin stripes—a calm, tailored colorway with a quiet vintage mood, it balances cool and warm tones in the bedroom',
    srcImg: 'C:/Users/12021/Desktop/种草图/blue-brown-stripe-velvet-nofold-3x4.jpg',
  },
  {
    slug: 'charcoal', name: 'Charcoal Stripe', // 灰色底 + 黑/深色双细条纹（COLOR_LABELS 新增 CHARCOAL 映射）
    stripeDesc: 'grey-and-black stripe',
    palette: 'a heather grey ground patterned with near-black twin stripes—graphic yet soft, it gives the bedroom a calm, tailored, quietly modern edge',
    srcImg: 'C:/Users/12021/Desktop/种草图/grey-black-velvet-nofold-3x4.jpg',
  },
];
// mocha 换图源
const MOCHA_SRC_IMG = 'C:/Users/12021/Desktop/种草图/greige-stripe-velvet-nofold-3x4.jpg';
const MOCHA_ASIN = 'VELSTRIPE-MOCHA-QUEEN';

// 仅 Queen（同 veljac/velstripe 口径）：被套 88x88 + 床笠 60x80 + 枕套 20x30
const SIZE = { key: 'queen', name: 'Queen', duvet: '88 x 88 in', sheet: '60 x 80 in', pc: '20 x 30 in', cm: '220 x 220 cm', dims: [220, 220] };

const BULLETS = (c, s) =>
  `Soft Plush Velvet, Same Stripe on Both Sides: The duvet cover and pillowcases are woven in a short, dense velvet pile—velvety matte to the touch and gently plush. Both sides share the identical ${c.stripeDesc}, so every fold, drape and turn-back shows the same warm pattern, inside and out.\n\n` +
  `Thick, Warm & Cozy: The dense velvet pile feels velvety soft against the skin and holds warmth beautifully—a cozy choice for autumn and winter nights without feeling heavy or stuffy.\n\n` +
  `Complete ${s.name} 4-Piece Set: This bedding set includes 1 duvet cover (${s.duvet}), 1 fitted sheet (${s.sheet}) with all-around elastic for a secure fit, and 2 pillowcases (${s.pc}), giving you everything you need for a coordinated, polished bed.\n\n` +
  `Thoughtful Details & Easy Care: A hidden zipper closure and interior corner ties keep your comforter neatly in place; the set is machine washable and keeps its plush pile and stripe texture wash after wash.\n\n` +
  `Soothing ${c.name} Colorway: Finished in ${c.palette}, pairing easily with modern, classic, or cozy décor.`;

const products = [];
for (const c of COLORS) {
  const s = SIZE;
  const asin = `VELSTRIPE-${c.slug.toUpperCase()}-${s.key.toUpperCase()}`;
  const asinLower = asin.toLowerCase();
  const title = `Makimoo ${s.name} Bedding Set 4 Piece Striped Velvet Duvet Cover Fitted Sheet 2 Pillowcases ${s.duvet} (${c.name})`;
  products.push({
    asin, asinLower,
    title,
    shortTitle: `Striped Velvet Bedding Set, 4 Piece, ${c.name}, ${s.name}`,
    handle: `makimoo-${s.key}-bedding-set-4-piece-striped-velvet-${c.slug}-${s.key}`,
    bullets: BULLETS(c, s),
    sku: asinLower,
    images: [`/images/products/${asin}/1.webp`],
    whiteBg: [false],
    color: c.name,
    size: s.cm,
    dims: s.dims,
    srcImg: c.srcImg,
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
      availableForSale: false,
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

// ─── 3. variant-groups.ts：向既有 VELSTRIPE 族追加成员（lone-\r 行尾文件） ──
{
  const file = path.join(ROOT, 'src/data/variant-groups.ts');
  let s = fs.readFileSync(file, 'utf8');
  const gi = s.indexOf("id: 'VELSTRIPE'");
  if (gi < 0) { console.error('variant-groups.ts: VELSTRIPE 族不存在，请先跑 add-velstripe-1color.js'); process.exit(1); }
  const closeIdx = s.indexOf('    ],', gi); // 族内 members 数组闭合（\r 行尾，内容不受影响）
  if (closeIdx < 0) { console.error('variant-groups.ts: members 闭合锚点未找到'); process.exit(1); }
  const lines = [];
  for (const p of products) {
    if (s.includes(`asin: '${p.asinLower}'`)) continue;
    lines.push(`    { asin: '${p.asinLower}', handle: '${p.handle}', color: '${p.color}', size: '${p.size}' },\r`);
  }
  if (lines.length) {
    s = s.slice(0, closeIdx) + lines.join('') + s.slice(closeIdx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`variant-groups.ts: VELSTRIPE 族 +${lines.length} members`);
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
    s = s.slice(0, idx) + '  // 2026-10-25：条纹绒四件套扩充 2 色（DENIM / CHARCOAL，并入 VELSTRIPE 变体组）\n' + lines.join('\n') + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`new-product-handles.ts: +${lines.length} handles`);
}

// ─── 5. specs-overrides.ts：材质与尺寸（并入提花绒分类：Embossed Velvet 原子词） ─
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
    s = s.slice(0, idx) + '  // 2026-10-25：条纹绒四件套扩充 2 色\n' + lines.join('\n') + '\n' + s.slice(idx);
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
    s = s.slice(0, idx) + '  // 2026-10-25：条纹绒四件套扩充 2 色（3:4 PDP 主图）\n' + lines.join('\n') + '\n' + s.slice(idx);
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
    s = s.slice(0, idx) + '  // 2026-10-25：条纹绒四件套扩充 2 色\n' + lines.join('\n') + '\n' + s.slice(idx);
    fs.writeFileSync(file, s, 'utf8');
  }
  console.log(`pdp-main-34-asins.ts: +${lines.length} entries`);
}

// ─── 9. bedding-families.ts：COLOR_LABELS 新增 DENIM / CHARCOAL（classifySet 已有 velstripe-） ─
{
  const file = path.join(ROOT, 'src/data/bedding-families.ts');
  let s = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (!s.includes('velstripe-')) {
    console.error('bedding-families.ts: classifySet 缺 velstripe- 规则，请先跑 add-velstripe-1color.js');
    process.exit(1);
  }
  const missing = COLORS.filter((c) => !s.includes(`${c.slug.toUpperCase()}:`));
  if (missing.length) {
    const re = /(\/\/ 2026-10-25：条纹绒（双面同纹）四件套单色（MOCHA 未被占用）\r?\n  MOCHA: 'Mocha Stripe',)/;
    if (!re.test(s)) { console.error('bedding-families.ts COLOR_LABELS MOCHA 锚点未找到'); process.exit(1); }
    const add = missing
      .map((c) => `\r\n  ${c.slug.toUpperCase()}: '${c.name}',`)
      .join('');
    s = s.replace(re, (m) => m + add);
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(file, s, 'utf8');
    console.log(`bedding-families.ts: COLOR_LABELS +${missing.length}`);
  } else {
    console.log('bedding-families.ts: 已存在，跳过');
  }
}

// ─── 10. 图片：mocha 换图（强制覆盖）+ 2 新色转换（1200x1600 1-3x4.webp + 1200x1200 1.webp） ─
(async () => {
  const sharp = require('sharp');
  const jobs = [];
  // mocha 换图：删除旧文件强制重建
  {
    if (!fs.existsSync(MOCHA_SRC_IMG)) { console.error(`缺源图: ${MOCHA_SRC_IMG}`); process.exit(1); }
    const dir = path.join(ROOT, 'public/images/products', MOCHA_ASIN);
    const out1 = path.join(dir, '1.webp');
    const out34 = path.join(dir, '1-3x4.webp');
    for (const f of [out1, out34]) if (fs.existsSync(f)) fs.unlinkSync(f);
    jobs.push({ src: MOCHA_SRC_IMG, out34, out1, force: true });
  }
  for (const p of products) {
    if (!fs.existsSync(p.srcImg)) { console.error(`缺源图: ${p.srcImg}`); process.exit(1); }
    const dir = path.join(ROOT, 'public/images/products', p.asin);
    jobs.push({ src: p.srcImg, out34: path.join(dir, '1-3x4.webp'), out1: path.join(dir, '1.webp'), force: false });
  }
  for (const j of jobs) {
    if (!j.force && fs.existsSync(j.out1) && fs.existsSync(j.out34)) { console.log(`images: ${path.basename(path.dirname(j.out1))} 已存在，跳过`); continue; }
    fs.mkdirSync(path.dirname(j.out1), { recursive: true });
    const t34 = j.out34 + '.tmp';
    await sharp(j.src).resize(1200, 1600, { fit: 'cover', position: 'centre' }).webp({ quality: 82 }).toFile(t34);
    fs.renameSync(t34, j.out34);
    const t1 = j.out1 + '.tmp';
    await sharp(j.src).resize(1200, 1200, { fit: 'cover', position: 'centre' }).webp({ quality: 82 }).toFile(t1);
    fs.renameSync(t1, j.out1);
    console.log(`images: ${path.basename(path.dirname(j.out1))} 完成`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
