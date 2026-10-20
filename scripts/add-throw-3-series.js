/**
 * add-throw-3-series.js — 三个新毯子系列接入 + KNITTHROW 换灰底主图（2026-10-19 用户定，幂等）
 * 模式完全照搬 add-blanket2-knit-throw.js / add-sateen-4pcs.js：
 *   每个 颜色×尺寸 = 一个独立产品（同 SATEEN4/DUVSET 二维家族惯例），variant-groups 注册 color+size
 * 系列A BOHOTHROW（波西米亚锯齿针织毯，两端流苏，acrylic knit）4 色 × 2 尺寸 = 8
 * 系列B JACTHROW（北欧提花航空毯，无流苏干净包边，acrylic jacquard knit）4 色 × 3 尺寸 = 12
 * 系列C CHUNKYTHROW（豆豆粒粗针织毯，两端长流苏，chunky acrylic knit）4 色 × 2 尺寸 = 8
 * 主图：staging/throw-graybg-<key>-3x4.png（折叠=1.webp）+ -flat-3x4.png（平铺=2.webp），1200x1600 webp
 * KNITTHROW 换图：现有编号 webp 全部后移 +2（1.webp→3.webp），新灰底图存 1/2.webp，
 *   materials-map 4 个 knitthrow-* 键的 images/whiteBg 同步更新
 * 写入：products-materials.ts、materials-map.ts、variant-groups.ts（3 个新族）、new-product-handles.ts、
 *       specs-overrides.ts、short-titles.ts、product-weights.ts、image-aspect-overrides.ts（3/4）
 * 分类/标签与 KNITTHROW 一致：productType/tags = 'Blankets'（taxonomy.json/product-tags.json 无 KNITTHROW 条目，不动）
 * 价格占位由 Shopify CSV 侧给 $29.99；本地 products-materials 同先例 0.00 + availableForSale false
 * 用法: node scripts/add-throw-3-series.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// ─── 系列定义 ────────────────────────────────────────────────────────────────
const SERIES = [
  {
    family: 'BOHO-THROW',
    asinPrefix: 'BOHOTHROW',
    skuPrefix: 'boho-throw',
    material: 'Acrylic Knit',
    comment: '波西米亚锯齿针织毯（4 色 × 2 尺寸含流苏，2026-10-19 用户定）',
    colors: [
      { slug: 'sunset',   key: 'boho-sunset',   name: 'Sunset' },
      { slug: 'olive',    key: 'boho-olive',    name: 'Khaki Olive' },
      { slug: 'teal',     key: 'boho-teal',     name: 'Teal Blue' },
      { slug: 'burgundy', key: 'boho-burgundy', name: 'Burgundy' },
    ],
    sizes: [
      { suffix: '127', cm: '127 x 180 cm', in: '50 x 71 in', dims: [127, 180] },
      { suffix: '130', cm: '130 x 230 cm', in: '51 x 91 in', dims: [130, 230] },
    ],
    title: (c, s) => `Makimoo Bohemian Chevron Knit Throw Blanket with Tassels, Soft Lightweight Acrylic Decorative Blanket for Couch Sofa and Bed, ${s.in} (${c.name})`,
    handle: (c, s) => `makimoo-bohemian-chevron-knit-throw-blanket-with-tassels-${s.in.replace(/ /g, '-')}-${c.slug}`,
    shortTitle: (c, s) => `Bohemian Chevron Knit Throw, ${c.name}, ${s.in}`,
    bullets: (c, s) =>
      `Bohemian Chevron Design: Bold zigzag chevron stripes in warm, earthy tones give this throw its free-spirited boho character, finished with hand-knotted tassels on both ends for an artisan touch.\n\n` +
      `Soft Acrylic Knit: Knitted from soft, lightweight acrylic yarn, the blanket feels gentle and cozy without bulk—comfortable across all four seasons, from cool summer evenings to winter layering.\n\n` +
      `Generous Size with Tassels: Measuring ${s.in} (${s.cm}) including the tassel fringe, it drapes beautifully over a sofa arm, across the foot of a bed, or around your shoulders on a cool evening.\n\n` +
      `Versatile Boho Accent: The ${c.name} palette pairs effortlessly with bohemian, farmhouse, or eclectic décor—use it as a couch throw, bed-end blanket, reading-nook wrap, or picnic companion.\n\n` +
      `Easy Everyday Care: Machine washable on a gentle cycle; the knit keeps its color and texture wash after wash, and the tassels stay neat with a quick reshape while damp.`,
  },
  {
    family: 'JAC-THROW',
    asinPrefix: 'JACTHROW',
    skuPrefix: 'jac-throw',
    material: 'Acrylic Jacquard Knit',
    comment: '北欧提花航空毯（4 色 × 3 尺寸，无流苏干净包边，2026-10-19 用户定）',
    colors: [
      { slug: 'hb-black',      key: 'hb-black',      name: 'Herringbone Black White', pattern: 'classic herringbone pattern in black and white' },
      { slug: 'hb-khaki',      key: 'hb-khaki',      name: 'Herringbone Camel',       pattern: 'classic herringbone pattern in warm camel tones' },
      { slug: 'paisley-beige', key: 'paisley-beige', name: 'Paisley Khaki',           pattern: 'elegant paisley motif in soft khaki tones' },
      { slug: 'paisley-blue',  key: 'paisley-blue',  name: 'Paisley Dusty Blue',      pattern: 'elegant paisley motif in dusty blue tones' },
    ],
    sizes: [
      { suffix: '130x180', cm: '130 x 180 cm', g: 850,  dims: [130, 180] },
      { suffix: '150x200', cm: '150 x 200 cm', g: 1050, dims: [150, 200] },
      { suffix: '130x190', cm: '130 x 190 cm', g: 700,  dims: [130, 190] },
    ],
    title: (c, s) => `Makimoo Jacquard Knit Throw Blanket, Lightweight Nordic Decorative Blanket for Couch Sofa Travel and Office Nap, ${s.cm} ${s.g}g (${c.name})`,
    handle: (c, s) => `makimoo-jacquard-knit-throw-blanket-lightweight-nordic-${s.cm.replace(/ /g, '-')}-${c.slug}`,
    shortTitle: (c, s) => `Jacquard Knit Throw Blanket, ${c.name}, ${s.cm}`,
    bullets: (c, s) =>
      `Nordic Jacquard Pattern: The ${c.pattern} is woven directly into the knit—not printed—so the design stays crisp wash after wash, framed by a clean knitted edge with no tassels for a sleek, modern finish.\n\n` +
      `Lightweight Acrylic Jacquard Knit: Woven from soft acrylic yarn (${s.g}g), this blanket is light enough to carry from couch to office yet warm enough for an afternoon nap or a chilly commute.\n\n` +
      `Practical Throw Size: Measuring ${s.cm}, it covers your shoulders and legs comfortably—ideal as a sofa throw, travel blanket, office nap blanket, or an extra layer at the foot of the bed.\n\n` +
      `Quiet Nordic Accent: The ${c.name} tones blend effortlessly with modern, Scandinavian, or minimalist décor—drape it over an armchair, fold it across the bed end, or keep it in the car for road trips.\n\n` +
      `Easy Everyday Care: Machine washable on a gentle cycle; the jacquard knit holds its pattern and shape wash after wash—no fringe to tangle, no fuss.`,
  },
  {
    family: 'CHUNKY-THROW',
    asinPrefix: 'CHUNKYTHROW',
    skuPrefix: 'chunky-throw',
    material: 'Chunky Acrylic Knit',
    comment: '豆豆粒粗针织毯（4 色 × 2 尺寸含长流苏，2026-10-19 用户定）',
    colors: [
      { slug: 'orange', key: 'chunky-orange', name: 'Burnt Orange' },
      { slug: 'oat',    key: 'chunky-oat',    name: 'Khaki Oat' },
      { slug: 'cream',  key: 'chunky-cream',  name: 'Cream White' },
      { slug: 'grey',   key: 'chunky-grey',   name: 'Light Grey' },
    ],
    sizes: [
      { suffix: '127', cm: '127 x 172 cm', in: '50 x 68 in', dims: [127, 172] },
      { suffix: '130', cm: '130 x 230 cm', in: '51 x 91 in', dims: [130, 230] },
    ],
    title: (c, s) => `Makimoo Chunky Knit Throw Blanket with Tassels, Soft Textured Decorative Blanket for Couch Sofa and Bed End, ${s.in} (${c.name})`,
    handle: (c, s) => `makimoo-chunky-knit-throw-blanket-with-tassels-${s.in.replace(/ /g, '-')}-${c.slug}`,
    shortTitle: (c, s) => `Chunky Knit Throw Blanket, ${c.name}, ${s.in}`,
    bullets: (c, s) =>
      `Chunky Bobble Knit Texture: Plump, popcorn-style bobble stitches give this throw its rich, touchable texture, finished with long hand-tied tassels on both ends for a cozy, handcrafted look.\n\n` +
      `Soft Chunky Acrylic Knit: Knitted from thick yet soft acrylic yarn, the blanket feels plush and warm without heavy weight—perfect for snuggling on the couch through every season.\n\n` +
      `Generous Size with Tassels: Measuring ${s.in} (${s.cm}) including the long tassel fringe, it layers beautifully across the foot of a bed or over the back of a sofa.\n\n` +
      `Versatile Cozy Accent: The ${c.name} tone and chunky texture pair effortlessly with modern, farmhouse, or Scandinavian décor—use it as a couch throw, bed-end runner, or reading companion.\n\n` +
      `Easy Everyday Care: Machine washable on a gentle cycle and dry flat; the chunky knit keeps its loft and the tassels stay neat with a quick reshape while damp.`,
  },
];

// 展开为产品列表
const products = [];
for (const sr of SERIES) {
  for (const c of sr.colors) {
    for (const s of sr.sizes) {
      const asin = `${sr.asinPrefix}-${c.slug.toUpperCase().replace(/-/g, '-')}-${s.suffix.toUpperCase()}`;
      // ASIN 中颜色段：hb-black → HB-BLACK（保持连字符，与 staging key 大写一致）
      const asinLower = asin.toLowerCase();
      products.push({
        series: sr,
        asin, asinLower,
        title: sr.title(c, s),
        shortTitle: sr.shortTitle(c, s),
        handle: sr.handle(c, s),
        bullets: sr.bullets(c, s),
        sku: `${sr.skuPrefix}-${c.slug}-${s.suffix}`,
        images: [`/images/products/${asin}/1.webp`, `/images/products/${asin}/2.webp`],
        whiteBg: [false, false], // 灰底图打满图框
        color: c.name,
        size: s.cm,
        dims: s.dims,
        stagingKey: c.key,
      });
    }
  }
}

// ─── 0. KNITTHROW 换图：现有编号 webp 后移 +2，灰底新图存 1/2.webp ──────────
const KNIT_COLORS = [
  { slug: 'cream', key: 'knit-cream' },
  { slug: 'grey',  key: 'knit-grey' },
  { slug: 'khaki', key: 'knit-khaki' },
  { slug: 'pink',  key: 'knit-pink' },
];

async function convert(src, out) {
  const sharp = require('sharp');
  const tmp = out + '.tmp';
  await sharp(src).resize(1200, 1600).webp({ quality: 82 }).toFile(tmp);
  fs.renameSync(tmp, out);
}

(async () => {
  // ─── 0a. KNITTHROW 图片后移 + 新图转换 ────────────────────────────────────
  for (const kc of KNIT_COLORS) {
    const asin = `KNITTHROW-${kc.slug.toUpperCase()}`;
    const dir = path.join(ROOT, 'public/images/products', asin);
    if (fs.existsSync(dir) && !fs.existsSync(path.join(dir, '3.webp'))) {
      // 现有 1..N.webp 全部后移 +2（先改名 .shift 临时名避免覆盖；3.webp 已存在=已后移过，跳过保证幂等）
      const nums = fs.readdirSync(dir)
        .map((f) => /^(\d+)\.webp$/.exec(f))
        .filter(Boolean)
        .map((m) => parseInt(m[1], 10))
        .sort((a, b) => b - a);
      for (const n of nums) {
        fs.renameSync(path.join(dir, `${n}.webp`), path.join(dir, `${n}.webp.shift`));
      }
      for (const n of nums) {
        fs.renameSync(path.join(dir, `${n}.webp.shift`), path.join(dir, `${n + 2}.webp`));
      }
      if (nums.length) console.log(`${asin}: 现有 ${nums.length} 张图后移 +2`);
    } else {
      fs.mkdirSync(dir, { recursive: true });
    }
    const folded = path.join(ROOT, 'public/images/staging', `throw-graybg-${kc.key}-3x4.png`);
    const flat = path.join(ROOT, 'public/images/staging', `throw-graybg-${kc.key}-flat-3x4.png`);
    if (!fs.existsSync(folded) || !fs.existsSync(flat)) {
      console.error(`缺源图: ${folded} / ${flat}`); process.exit(1);
    }
    await convert(folded, path.join(dir, '1.webp'));
    await convert(flat, path.join(dir, '2.webp'));
  }
  console.log('KNITTHROW: 4 色灰底主图已写入 1/2.webp');

  // ─── 0b. materials-map.ts：更新 4 个 knitthrow 键的 images/whiteBg ─────────
  {
    const file = path.join(ROOT, 'src/data/materials-map.ts');
    let s = fs.readFileSync(file, 'utf8');
    for (const kc of KNIT_COLORS) {
      const asin = `KNITTHROW-${kc.slug.toUpperCase()}`;
      const dir = path.join(ROOT, 'public/images/products', asin);
      const nums = fs.readdirSync(dir)
        .map((f) => /^(\d+)\.webp$/.exec(f))
        .filter(Boolean)
        .map((m) => parseInt(m[1], 10))
        .sort((a, b) => a - b);
      const imgs = nums.map((n) => `/images/products/${asin}/${n}.webp`);
      const key = `"knitthrow-${kc.slug}":`;
      const lines = s.split('\n');
      const idx = lines.findIndex((l) => l.includes(key));
      if (idx < 0) { console.error(`materials-map.ts 缺 ${key}`); process.exit(1); }
      lines[idx] = lines[idx]
        .replace(/"images":\[[^\]]*\]/, `"images":${JSON.stringify(imgs)}`)
        .replace(/"whiteBg":\[[^\]]*\]/, `"whiteBg":${JSON.stringify(nums.map(() => false))}`);
      s = lines.join('\n');
    }
    fs.writeFileSync(file, s, 'utf8');
    console.log('materials-map.ts: knitthrow-* images/whiteBg 已更新');
  }

  // ─── 1. products-materials.ts：MATERIALS_PRODUCTS 末尾追加 ────────────────
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
        productType: 'Blankets',
        tags: ['Blankets'],
        availableForSale: false, // 价格/库存由 Shopify 侧建品后经 shopify-map 关联（同 KNITTHROW 惯例）
        images: p.images.map((url) => ({ url, altText: p.title, width: 1200, height: 1600 })),
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

  // ─── 2. materials-map.ts：MATERIALS_MAP 末尾追加 ──────────────────────────
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

  // ─── 3. variant-groups.ts：3 个新族（幂等；lone-\r 行尾文件，按 \r 处理） ──
  {
    const file = path.join(ROOT, 'src/data/variant-groups.ts');
    let s = fs.readFileSync(file, 'utf8');
    const idx = s.lastIndexOf('];');
    if (idx < 0) { console.error('variant-groups.ts anchor not found'); process.exit(1); }
    let blocks = '';
    for (const sr of SERIES) {
      if (s.includes(`id: '${sr.family}'`)) {
        console.log(`variant-groups.ts: ${sr.family} 族已存在，跳过`);
        continue;
      }
      const members = products
        .filter((p) => p.series === sr)
        .map((p) => `    { asin: '${p.asinLower}', handle: '${p.handle}', color: '${p.color}', size: '${p.size}' },`)
        .join('\r');
      blocks +=
        `  {\r` +
        `    id: '${sr.family}',\r` +
        `    optionName: 'Color',\r` +
        `    // ${sr.comment}\r` +
        `    members: [\r${members}\r    ],\r` +
        `  },\r`;
    }
    if (blocks) {
      s = s.slice(0, idx) + blocks + s.slice(idx);
      fs.writeFileSync(file, s, 'utf8');
      console.log('variant-groups.ts: 新增 3 族');
    }
  }

  // ─── 4. new-product-handles.ts：PDP v2 白名单 ─────────────────────────────
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
      s = s.slice(0, idx) + '  // 2026-10-19：波西米亚锯齿/北欧提花/豆豆粒粗针织毯（3 系列，颜色×尺寸）\n' + lines.join('\n') + s.slice(idx);
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
      lines.push(`  "${p.asinLower}": { material: "${p.series.material}", dimensionsCm: [${p.dims.join(', ')}] },`);
    }
    if (lines.length) {
      const idx = s.lastIndexOf('};');
      if (idx < 0) { console.error('specs-overrides.ts anchor not found'); process.exit(1); }
      s = s.slice(0, idx) + lines.join('\n') + '\n' + s.slice(idx);
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
      s = s.slice(0, idx) + '  // 2026-10-19：波西米亚锯齿/北欧提花/豆豆粒粗针织毯（3 系列）\n' + lines.join('\n') + '\n' + s.slice(idx);
      fs.writeFileSync(file, s, 'utf8');
    }
    console.log(`short-titles.ts: +${lines.length} entries`);
  }

  // ─── 7. product-weights.ts：毯子类目权重（同 knitthrow 口径） ──────────────
  {
    const file = path.join(ROOT, 'src/data/product-weights.ts');
    let s = fs.readFileSync(file, 'utf8');
    const lines = [];
    for (const p of products) {
      if (s.includes(`"${p.asinLower}":`)) continue;
      lines.push(`  "${p.asinLower}": {"type":"Blankets","score":1.5,"perf":1.5,"boost":0},`);
    }
    if (lines.length) {
      const idx = s.lastIndexOf('};');
      if (idx < 0) { console.error('product-weights.ts anchor not found'); process.exit(1); }
      s = s.slice(0, idx) + lines.join('\n') + '\n' + s.slice(idx);
      fs.writeFileSync(file, s, 'utf8');
    }
    console.log(`product-weights.ts: +${lines.length} entries`);
  }

  // ─── 8. image-aspect-overrides.ts：3:4 竖版图集（含 KNITTHROW 4 色） ──────
  {
    const file = path.join(ROOT, 'src/data/image-aspect-overrides.ts');
    let s = fs.readFileSync(file, 'utf8');
    const lines = [];
    const allAsins = [
      ...KNIT_COLORS.map((kc) => `knitthrow-${kc.slug}`),
      ...products.map((p) => p.asinLower),
    ];
    for (const a of allAsins) {
      if (s.includes(`'${a}':`)) continue;
      lines.push(`  '${a}': '3/4',`);
    }
    if (lines.length) {
      const idx = s.lastIndexOf('};');
      if (idx < 0) { console.error('image-aspect-overrides.ts anchor not found'); process.exit(1); }
      s = s.slice(0, idx) + lines.join('\n') + '\n' + s.slice(idx);
      fs.writeFileSync(file, s, 'utf8');
    }
    console.log(`image-aspect-overrides.ts: +${lines.length} entries`);
  }

  // ─── 9. 新系列图片转换：staging PNG → 1200x1600 webp（每色 2 张，各尺寸共用） ─
  let converted = 0, skipped = 0;
  for (const p of products) {
    const folded = path.join(ROOT, 'public/images/staging', `throw-graybg-${p.stagingKey}-3x4.png`);
    const flat = path.join(ROOT, 'public/images/staging', `throw-graybg-${p.stagingKey}-flat-3x4.png`);
    if (!fs.existsSync(folded) || !fs.existsSync(flat)) {
      console.error(`缺源图: throw-graybg-${p.stagingKey}-*.png`); process.exit(1);
    }
    const dir = path.join(ROOT, 'public/images/products', p.asin);
    fs.mkdirSync(dir, { recursive: true });
    for (const [src, name] of [[folded, '1.webp'], [flat, '2.webp']]) {
      const out = path.join(dir, name);
      if (fs.existsSync(out)) { skipped++; continue; }
      await convert(src, out);
      converted++;
    }
  }
  console.log(`images: +${converted} webp（跳过已存在 ${skipped}）`);
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e); process.exit(1); });
